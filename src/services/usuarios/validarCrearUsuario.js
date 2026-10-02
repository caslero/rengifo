/**
 @fileoverview Función utilitaria para validar la identidad del usuario, sus permisos
 y los parámetros necesarios antes de registrar un nuevo usuario en el sistema.
 @module services/usuarios/validarCrearUsuario
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import AuthTokens from "@/libs/AuthTokens"; // Utilidad para generar tokens de autenticación
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves"; // Utilidad para cifrar contraseñas
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "@/services/ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida los datos del usuario activo, los campos del nuevo usuario y las condiciones de registro.
 Verifica duplicidad, genera token, cifra la contraseña y determina la institución asociada.
 @async
 @function validarCrearUsuario
 @param {string|number} cedula - Cédula del nuevo usuario.
 @param {string} nombre - Nombre del nuevo usuario.
 @param {string} apellido - Apellido del nuevo usuario.
 @param {string} correo - Correo electrónico del nuevo usuario.
 @param {string} claveUno - Contraseña ingresada.
 @param {string} claveDos - Confirmación de contraseña.
 @param {number} id_rol - Rol asignado al nuevo usuario.
 @param {boolean} autorizar - Indica si el usuario está autorizado.
 @param {Array<{id: number}>} instituciones - Lista de instituciones (solo para administradores).
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarCrearUsuario(datos) {
  try {
    // 1. Validar identidad del usuario activo mediante el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 3. Validar los campos del nuevo usuario.
    const validandoCampos = ValidarCampos.validarCamposRegistro(datos);

    // 4. Si los campos son inválidos, retornar error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
      );
    }

    // 5. Generar token de autenticación para el nuevo usuario.
    const tokenAuth = AuthTokens.tokenValidarUsuario(10);

    // 6. Verificar si ya existe un usuario con el mismo correo, cédula o token.

    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        OR: [
          {
            correo: validandoCampos.correo
              ? String(validandoCampos.correo)
              : undefined,
          },
          { cedula: validandoCampos.cedula }, // <-- Debe ser String
          { token: tokenAuth },
        ],
      },
    });

    // 7. Si existe el usuario, retornar error
    if (usuarioExistente) {
      return retornarRespuestaFunciones("error", "Error, usuario ya existe", {
        codigo: 409,
      });
    }

    // 8. Variable para almacenar los datos de la institucion.

    // 10. Cifrar la contraseña del nuevo usuario.
    const claveEncriptada = await CifrarDescifrarClaves.cifrarClave(
      validandoCampos.claveUno,
    );

    // 11. Si la encriptación falla, retornar error.
    if (claveEncriptada.status === "error") {
      return retornarRespuestaFunciones(
        claveEncriptada.status,
        claveEncriptada.message,
      );
    }

    // 12. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validaciones correctas", {
      // Creador y Autenticación
      id_creador: validaciones.id_usuario
        ? Number(validaciones.id_usuario)
        : null,
      id_usuario: validaciones.id_usuario
        ? Number(validaciones.id_usuario)
        : null,
      token: tokenAuth,

      // Datos Personales
      cedula: validandoCampos.cedula,
      nombre: validandoCampos.nombre,
      nombre_dos: validandoCampos.nombre_dos,
      apellido: validandoCampos.apellido,
      apellido_dos: validandoCampos.apellido_dos,
      f_n: validandoCampos.f_n,
      genero: validandoCampos.genero,
      telefono: validandoCampos.telefono,
      correo: validandoCampos.correo,
      claveEncriptada: claveEncriptada?.claveEncriptada || null,
      validado: validandoCampos.validado,

      // Roles y Ubicación Comunal
      rolId: validandoCampos.rolId,
      id_rol: validandoCampos.id_rol,

      comunaId: validandoCampos.comunaId,
      id_comuna: validandoCampos.id_comuna,

      calleId: validandoCampos.calleId,
      id_calle: validandoCampos.id_calle,

      familiaId: validandoCampos.familiaId,
      id_familia: validandoCampos.id_familia,
    });
  } catch (error) {
    // 13. Manejo de errores inesperados.
    console.log("Error interno validar crear usuario:", error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear usuario",
    );
  }
}
