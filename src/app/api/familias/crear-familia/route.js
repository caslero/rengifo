/**
 * @fileoverview Controlador de API para la creación de un familia.
 * Este archivo maneja la lógica para registrar un nuevo familia en la base de datos a través de una solicitud POST.
 * Utiliza Prisma para interactuar con la base de datos, un sistema de validación para verificar los datos de entrada
 * y un mecanismo de registro de eventos para mantener una bitácora de seguridad.
 * @module
 */

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarCrearFamilia from "@/services/familias/validarCrearFamilia"; // Servicio para validar los datos de entrada del familia.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad en la base de datos.

/**
 * Maneja las solicitudes HTTP POST para crear un nuevo familia.
 * @async
 * @function POST
 * @param {object} request - El objeto de la solicitud HTTP (Next.js Request basado en Web API).
 * @returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación.
 */

export async function POST(request) {
  try {
    // 1. Obtiene los datos del cuerpo de la solicitud (request)
    const datos = await request.json();

    // 2. Valida los datos recibidos utilizando el servicio 'validarCrearFamilia'
    const validaciones = await validarCrearFamilia(datos);

    console.log(validaciones);
    

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      // Registra un evento de intento fallido en la bitácora de seguridad
      await registrarEventoSeguro(request, {
        tabla: "familia",
        accion: "INTENTO_FALLIDO_familia",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al intentar crear familia",
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

    // 4. Crea un nuevo familia en la base de datos utilizando Prisma
    const nuevofamilia = await prisma.familia.create({
      data: {
        nombre: validaciones.nombre,
        codigo: validaciones.codigo,
        direccion: validaciones.descripcion,
        tipoVivienda: validaciones.tipoVivienda,
        discapacidad: validaciones.discapacidad,
        detallesDiscapacidad: validaciones.detallesDiscapacidad,
        servicioAgua: validaciones.servicioAgua,
        electricidad: validaciones.electricidad,
        observacion: validaciones.observacion,
        numero: validaciones.numero,
        calle: { connect: { id: 1 } },
      },
    });

    // 5. Condición de error al crear el familia en la base de datos
    if (!nuevofamilia) {
      // Registra un evento de error en la bitácora
      await registrarEventoSeguro(request, {
        tabla: "familia",
        accion: "ERROR_CREAR_familia",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el familia",
        datosAntes: null,
        datosDespues: nuevofamilia,
      });

      // Retorna una respuesta de error con un código de estado 400
      return generarRespuesta("error", "Error, no se creo el familia", {}, 400);
    }

    // 6. Condición de éxito: el familia se creó correctamente
    // Registra un evento de creación exitosa en la bitácora
    await registrarEventoSeguro(request, {
      tabla: "familia",
      accion: "CREAR_familia",
      id_objeto: nuevofamilia.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "familia creado con exito",
      datosAntes: null,
      datosDespues: nuevofamilia,
    });

    // Retorna una respuesta de éxito con un código de estado 201 (Created)
    return generarRespuesta(
      "ok",
      "Familia creada con exito",
      { familias: nuevofamilia },
      201,
    );
  } catch (error) {
    // 7. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno (familias): ` + error);

    // Registra un evento de error interno en la bitácora
    await registrarEventoSeguro(request, {
      tabla: "familia",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear familia",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (familias)", {}, 500);
  }
}
