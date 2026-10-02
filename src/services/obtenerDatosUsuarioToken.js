/**
 @fileoverview Función utilitaria para obtener los datos completos del usuario activo
 a partir del token de autenticación, incluyendo su rol, institución y departamento.
 @module services/usuarios/obtenerDatosUsuarioToken
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerCorreoToken from "@/utils/obtenerCorreoToken"; // Función para extraer el correo y rol del usuario desde el token

/**
 Obtiene los datos del usuario activo utilizando su correo extraído del token.
 Retorna información como ID, nombre, cédula, rol, institución y departamento.
 @async
 @function obtenerDatosUsuarioToken
 @returns {Promise<Object>} Respuesta estructurada con los datos del usuario o error.
*/
export default async function obtenerDatosUsuarioToken() {
  try {
    // 1. Extraer correo y rol del token de autenticación.
    const validaciones = await obtenerCorreoToken();

    // 2. Si el token es inválido o no contiene datos, retornar error.
    if (!validaciones || validaciones.status === "error") {
      return retornarRespuestaFunciones(
        "error",
        validaciones?.message || "Token inválido o no proporcionado",
      );
    }

    // Extraer correctamente las propiedades según la estructura de retornarRespuestaFunciones
    const correoToken = validaciones.datos?.correo || validaciones.correo;
    const rolIdToken = validaciones.datos?.id_rol || validaciones.id_rol;

    if (!correoToken) {
      return retornarRespuestaFunciones(
        "error",
        "No se encontró un correo válido en el token",
      );
    }

    // 3. Consultar en la base de datos los datos del usuario por correo.
    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: correoToken },
      select: {
        id: true,
        cedula: true,
        nombre: true,
      },
    });

    // 4. Si no se encuentra el usuario, retornar error.
    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario inválido", {
        codigo: 404,
      });
    }

    // 5. Retornar los datos consolidados del usuario.
    return retornarRespuestaFunciones("ok", "Datos usuario obtenidos", {
      datosUsuario: datosUsuario,
      cedula: datosUsuario.cedula,
      nombre: datosUsuario.nombre,
      id_usuario: datosUsuario.id,
      correo: correoToken,
      id_rol: rolIdToken ? Number(rolIdToken) : null,
    });
  } catch (error) {
    // 6. Manejo de errores inesperados.
    console.log("Error interno obtener datos usuario:", error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno obtener datos usuario",
    );
  }
}

// /**
//  @fileoverview Función utilitaria para obtener los datos completos del usuario activo
//  a partir del token de autenticación, incluyendo su rol, institución y departamento.
//  @module services/usuarios/obtenerDatosUsuarioToken
// */

// import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
// import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
// import obtenerCorreoToken from "@/utils/obtenerCorreoToken"; // Función para extraer el correo y rol del usuario desde el token

// /**
//  Obtiene los datos del usuario activo utilizando su correo extraído del token.
//  Retorna información como ID, nombre, cédula, rol, institución y departamento.
//  @async
//  @function obtenerDatosUsuarioToken
//  @returns {Promise<Object>} Respuesta estructurada con los datos del usuario o error.
// */
// export default async function obtenerDatosUsuarioToken() {
//   try {
//     // 1. Extraer correo y rol del token de autenticación.
//     const validaciones = await obtenerCorreoToken();

//     console.log(validaciones);

//     // 2. Si el token es inválido o no contiene datos, retornar error.
//     if (validaciones.status === "error") {
//       return retornarRespuestaFunciones(
//         validaciones.status,
//         validaciones.message,
//       );
//     }

//     // 3. Consultar en la base de datos los datos del usuario por correo.
//     const datosUsuario = await prisma.usuario.findFirst({
//       where: { correo: validaciones.correo },
//       select: {
//         id: true,
//         cedula: true,
//         nombre: true,
//       },
//     });

//     // 4. Si no se encuentra el usuario, retornar error.
//     if (!datosUsuario) {
//       return retornarRespuestaFunciones("error", "Error, usuario invalido", {
//         codigo: 404,
//       });
//     }

//     // 5. Retornar los datos consolidados del usuario.
//     return retornarRespuestaFunciones("ok", "Datos usuario obtenidos", {
//       datosUsuario: datosUsuario,
//       cedula: datosUsuario.cedula,
//       nombre: datosUsuario.nombre,
//       id_usuario: datosUsuario.id,
//       correo: validaciones.correo,
//       id_rol: validaciones.rolId,
//     });
//   } catch (error) {
//     // 6. Manejo de errores inesperados.
//     console.log("Error interno obtener datos usuario:", error);

//     // Retorna una respuesta del error inesperado
//     return retornarRespuestaFunciones(
//       "error",
//       "Error interno obtener datos usuario",
//     );
//   }
// }
