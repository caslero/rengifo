/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de creación de familia en la base de datos. @module services/familias/validarCrear
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida los campos y la lógica de negocio para crear un nuevo familia.
 @async
 @function validarCrearFamilia
 @param {string} nombre - El nombre del nuevo familia.
 @param {string} descripcion - La descripción del nuevo familia.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarCrearFamilia(datos) {
  try {
    // 1. Obtener y validar el correo del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 3. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validarCampos = ValidarCampos.validarCampoNombre(datos.nombre);

    // 4. Si los campos no son válidos, se retorna un error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message,
      );
    }

    // 5. Verificar si el nombre del familia ya existe en la base de datos.
    const nombreRepetido = await prisma.familia.findFirst({
      where: {
        codigo: datos.codigo,
      },
    });

    // 6. Si se encuentra un familia con el mismo nombre, se retorna un error.
    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, familia ya existe...",
        {
          id_usuario: validaciones.id_usuario,
        },
      );
    }

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos para la creación.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      codigo: datos.codigo,
      descripcion: datos.descripcion,
      nombre: validarCampos.nombre,
      tipoVivienda: datos.tipoVivienda,
      numero: Number(datos.numero),
      discapacidad: datos.discapacidad,
      detallesDiscapacidad: datos.detallesDiscapacidad,
      servicioAgua: datos.servicioAgua,
      electricidad: datos.servicioLuz,
      observacion: datos.observacion,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log(`Error interno validar crear familia: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear familia",
    );
  }
}

/**
 const {
      nombre,
      codigo,
      descripcion,
      tipoVivienda,
      numero,
      discapacidad,
      detallesDiscapacidad,
      servicioAgua,
      servicioLuz,
      observacion,
      calle,
    } = await request.json();
 */
