/**
 * @fileoverview Controlador de API para la creación de un calle.
 * Este archivo maneja la lógica para registrar un nuevo calle en la base de datos a través de una solicitud POST.
 * Utiliza Prisma para interactuar con la base de datos, un sistema de validación para verificar los datos de entrada
 * y un mecanismo de registro de eventos para mantener una bitácora de seguridad.
 * @module
 */

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarCrearCalle from "@/services/calles/validarCrearCalle"; // Servicio para validar los datos de entrada del calle.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad en la base de datos.

/**
 * Maneja las solicitudes HTTP POST para crear un nuevo calle.
 * @async
 * @function POST
 * @param {object} request - El objeto de la solicitud HTTP (Next.js Request basado en Web API).
 * @returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación.
 */

export async function POST(request) {
  try {
    // 1. Obtiene los datos del cuerpo de la solicitud (request)
    const { nombre, numero, descripcion } = await request.json();

    // 2. Valida los datos recibidos utilizando el servicio 'validarCrearCalle'
    const validaciones = await validarCrearCalle(nombre, descripcion);

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      // Registra un evento de intento fallido en la bitácora de seguridad
      await registrarEventoSeguro(request, {
        tabla: "calle",
        accion: "INTENTO_FALLIDO_CALLE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al intentar crear calle",
        datosAntes: null,
        datosDespues: validaciones,
      });

      // Retorna una respuesta de error con un código de estado 400 (Bad Request)
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400,
      );
    }

    // 4. Crea un nuevo calle en la base de datos utilizando Prisma
    const nuevoCalle = await prisma.calle.create({
      data: {
        nombre: validaciones.nombre,
        direccion: validaciones.descripcion,
        numero: numero,
        usuarios: { connect: { id: validaciones.id_usuario } },
        comuna: { connect: { id: 1 } }, // Conecta con la comuna de ID 1
      },
    });

    // 5. Condición de error al crear el calle en la base de datos
    if (!nuevoCalle) {
      // Registra un evento de error en la bitácora
      await registrarEventoSeguro(request, {
        tabla: "calle",
        accion: "ERROR_CREAR_calle",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el calle",
        datosAntes: null,
        datosDespues: nuevoCalle,
      });

      // Retorna una respuesta de error con un código de estado 400
      return generarRespuesta("error", "Error, no se creo el calle", {}, 400);
    }

    // 6. Condición de éxito: el calle se creó correctamente
    // Registra un evento de creación exitosa en la bitácora
    await registrarEventoSeguro(request, {
      tabla: "calle",
      accion: "CREAR_calle",
      id_objeto: nuevoCalle.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "calle creado con exito",
      datosAntes: null,
      datosDespues: nuevoCalle,
    });

    // Retorna una respuesta de éxito con un código de estado 201 (Created)
    return generarRespuesta(
      "ok",
      "Calle creado...",
      { calles: nuevoCalle },
      201,
    );
  } catch (error) {
    // 7. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno (calles): ` + error);

    // Registra un evento de error interno en la bitácora
    await registrarEventoSeguro(request, {
      tabla: "calle",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear calle",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (calles)", {}, 500);
  }
}
