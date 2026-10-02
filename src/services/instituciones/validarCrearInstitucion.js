/**
 @fileoverview Función utilitaria para validar la identidad del usuario, sus permisos
 y los parámetros necesarios antes de crear una nueva institución en el sistema.
 @module services/instituciones/validarCrearInstitucion
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "@/services/ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación
import { generarCodigoSecuencial } from "@/utils/codigo/codigoSecuencial";

/**
 Valida la identidad del usuario, sus permisos y los datos requeridos para crear una nueva institución.
 Verifica que no exista una institución duplicada en la misma ubicación geográfica.
 @async
 @function validarCrearInstitucion
 @param {string} nombre - Nombre de la institución.
 @param {string} descripcion - Descripción de la institución.
 @param {string} rif - Registro de Información Fiscal de la institución.
 @param {string} sector - Sector al que pertenece la institución.
 @param {string} direccion - Dirección física de la institución.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarCrearInstitucion(
  nombre,
  descripcion,
  rif,
  sector,
  direccion,
) {
  try {
    // 1. Validar identidad del usuario mediante el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 3. Validar los campos de entrada.
    const validarCampos = ValidarCampos.validarCamposCrearInstitucion(
      nombre,
      descripcion,
      rif,
      sector,
      direccion,
    );

    // 4. Si los campos son inválidos, retornar error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message,
        { id_usuario: validaciones.id_usuario },
      );
    }

    // 5. Verificar si el usuario tiene permisos de super admin (rol 1).
    if (validaciones.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos",
      );
    }

    // 6. Verificar si ya existe una institución con el mismo nombre en la misma ubicación.
    const nombreRepetido = await prisma.institucion.findFirst({
      where: {
        OR: [
          {
            nombre: validarCampos.nombre,
          },
          {
            rif: validarCampos.rif,
          },
        ],
      },
    });

    // 7. Si el nombre esta repetido, retornar error.
    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, institución ya existe",
        {
          id_usuario: validaciones.id_usuario,
          codigo: 409,
        },
      );
    }

    // 8. Path como firma o direccion de una carpeta de institucion.
    const path = `/storage/instituciones/${validarCampos.nombre}`;

    // 9. Consultar estantes para general el codigo
    const cantidadInstitucion = await prisma.institucion.count();

    // 10. Crear codigo del departamento
    const codigoInstitucion = generarCodigoSecuencial(
      "0000",
      "INST",
      cantidadInstitucion,
    );

    // 9. Retornar respuesta con los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      rif: validarCampos.rif,
      sector: validarCampos.sector,
      direccion: validarCampos.direccion,
      path: path,
      codigoInstitucion: codigoInstitucion,
    });
  } catch (error) {
    // 10. Manejo de errores inesperados.
    console.log("Error interno validar crear institución:", error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear institución",
    );
  }
}
