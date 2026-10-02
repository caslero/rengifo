import { NextResponse } from "next/server";
import ValidarCampos from "@/services/ValidarCampos";
//import { conexion } from "@/libs/database/conexion.js";

export async function POST(request) {
  try {
    const { correo } = await request.json();

    const validarCampoCorreo = ValidarCampos.validarCampoCorreo(correo);

    if (validarCampoCorreo.status === "error") {
      return NextResponse.json(
        {
          status: validarCampoCorreo.status,
          message: validarCampoCorreo.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      status: "ok",
      message: "Correo enviado...",
      redirect: "/",
    });
  } catch (error) {
    console.log("Error, al guardar nuevo usuario: " + error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error, al crear usuario...",
      },
      { status: 500 },
    );
  }
}

//..........................................................................
// /**
//  * @fileoverview Controlador de API para solicitar restablecimiento de contraseña.
//  * Este endpoint recibe un correo electrónico, valida su formato y existencia en la base de datos,
//  * genera un token seguro y envía un enlace de recuperación al correo del usuario.
//  * @module api/auth/recuperar-clave
//  */

// import { NextResponse } from "next/server";
// import ValidarCampos from "@/services/ValidarCampos";
// import { conexion } from "@/libs/database/conexion.js";
// import { generarRespuesta } from "@/utils/respuestasAlFront";
// import { generarTokenRecuperacion } from "@/services/TokenService";
// import { enviarCorreoRecuperacion } from "@/services/EmailService";

// /**
//  * Maneja las solicitudes POST para solicitar restablecimiento de contraseña.
//  * Valida el correo, verifica su existencia en la base de datos, genera un token
//  * de recuperación y envía un enlace por correo electrónico.
//  *
//  * @async
//  * @function POST
//  * @param {Request} request - Solicitud HTTP con el objeto { correo: string }
//  * @param {Object} request.body - Cuerpo de la solicitud
//  * @param {string} request.body.correo - Correo electrónico del usuario
//  * @returns {Promise<NextResponse>} Respuesta JSON con el estado de la operación
//  *
//  * @example
//  * // Solicitud exitosa
//  * POST /api/auth/recuperar-clave
//  * Body: { "correo": "usuario@ejemplo.com" }
//  * Response: { "status": "ok", "message": "Correo de recuperación enviado" }
//  *
//  * @example
//  * // Error: Correo no registrado
//  * Response: { "status": "error", "message": "Correo no registrado" }
//  * Status: 404
//  */
// export async function POST(request) {
//   try {
//     // 1. Extraer y validar el correo del cuerpo de la solicitud
//     const { correo } = await request.json();

//     // 2. Validar formato del correo electrónico
//     const validacionCorreo = ValidarCampos.validarCampoCorreo(correo);

//     // 3. Si el correo no tiene formato válido, retornar error
//     if (validacionCorreo.status === "error") {
//       return generarRespuesta(
//         "error",
//         validacionCorreo.message || "Formato de correo inválido",
//         {},
//         400,
//       );
//     }

//     // 4. Verificar si el correo existe en la base de datos
//     const usuarioExistente = await verificarUsuarioPorCorreo(correo);

//     if (!usuarioExistente) {
//       return generarRespuesta(
//         "error",
//         "Correo no registrado en el sistema",
//         {},
//         404,
//       );
//     }

//     // 5. Generar token seguro de recuperación (expira en 1 hora)
//     const token = await generarTokenRecuperacion({
//       correo,
//       userId: usuarioExistente.id,
//       expiracion: Date.now() + 3600000, // 1 hora en milisegundos
//     });

//     // 6. Guardar token en la base de datos (opcional pero recomendado)
//     await guardarTokenRecuperacion(usuarioExistente.id, token);

//     // 7. Construir enlace de recuperación
//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
//     const enlaceRecuperacion = `${baseUrl}/cambiar-clave?token=${token}`;

//     // 8. Enviar correo electrónico con el enlace
//     const emailEnviado = await enviarCorreoRecuperacion({
//       destinatario: correo,
//       nombre: usuarioExistente.nombre || "Usuario",
//       enlace: enlaceRecuperacion,
//       expiracion: "1 hora",
//     });

//     // 9. Verificar si el correo se envió correctamente
//     if (!emailEnviado) {
//       return generarRespuesta(
//         "error",
//         "Error al enviar el correo de recuperación",
//         {},
//         500,
//       );
//     }

//     // 10. Respuesta exitosa
//     return generarRespuesta(
//       "ok",
//       "Correo de recuperación enviado exitosamente",
//       {
//         redirect: "/login",
//         email: correo,
//         tokenEnviado: true,
//       },
//       200,
//     );
//   } catch (error) {
//     // 11. Manejo de errores inesperados
//     console.error("Error al procesar solicitud de recuperación:", error);

//     // 12. Diferenciar errores para mejor depuración
//     if (error.name === "ValidationError") {
//       return generarRespuesta(
//         "error",
//         "Datos inválidos proporcionados",
//         { detalle: error.message },
//         400,
//       );
//     }

//     if (error.name === "DatabaseError") {
//       console.error("Error de base de datos:", error);
//       return generarRespuesta(
//         "error",
//         "Error al verificar el usuario en la base de datos",
//         {},
//         503,
//       );
//     }

//     // 13. Error genérico del servidor
//     return generarRespuesta(
//       "error",
//       "Error interno al procesar la solicitud de recuperación",
//       {},
//       500,
//     );
//   }
// }

// /**
//  * Verifica si un correo electrónico existe en la base de datos
//  * @async
//  * @function verificarUsuarioPorCorreo
//  * @param {string} correo - Correo electrónico a verificar
//  * @returns {Promise<Object|null>} Datos del usuario si existe, null si no
//  * @throws {Error} Si hay problemas con la conexión a la base de datos
//  */
// async function verificarUsuarioPorCorreo(correo) {
//   try {
//     // Consulta a la base de datos
//     const [usuario] = await conexion.query(
//       "SELECT id, nombre, correo, estado FROM usuarios WHERE correo = ? AND estado = 'activo'",
//       [correo],
//     );

//     return usuario || null;
//   } catch (error) {
//     console.error("Error al verificar usuario:", error);
//     throw new Error("DatabaseError: " + error.message);
//   }
// }

// /**
//  * Guarda el token de recuperación en la base de datos
//  * @async
//  * @function guardarTokenRecuperacion
//  * @param {number|string} userId - ID del usuario
//  * @param {string} token - Token de recuperación generado
//  * @returns {Promise<void>}
//  * @throws {Error} Si hay problemas al guardar el token
//  */
// async function guardarTokenRecuperacion(userId, token) {
//   try {
//     // Guardar token en la base de datos con fecha de expiración
//     await conexion.query(
//       `INSERT INTO tokens_recuperacion (user_id, token, expiracion, usado)
//        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR), 0)`,
//       [userId, token],
//     );
//   } catch (error) {
//     console.error("Error al guardar token:", error);
//     throw new Error("DatabaseError: " + error.message);
//   }
// }

// /**
//  * Genera un token de recuperación único y seguro
//  * @function generarTokenRecuperacion
//  * @param {Object} params - Parámetros para generar el token
//  * @param {string} params.correo - Correo del usuario
//  * @param {number|string} params.userId - ID del usuario
//  * @param {number} params.expiracion - Timestamp de expiración
//  * @returns {Promise<string>} Token generado
//  */
// async function generarTokenRecuperacion({ correo, userId, expiracion }) {
//   // Implementación con crypto para generar token seguro
//   const crypto = await import("crypto");
//   const payload = `${userId}-${correo}-${expiracion}`;
//   const token = crypto
//     .createHmac("sha256", process.env.JWT_SECRET || "secret")
//     .update(payload)
//     .digest("hex");

//   return token;
// }

// /**
//  * Envía el correo electrónico de recuperación
//  * @function enviarCorreoRecuperacion
//  * @param {Object} params - Parámetros del correo
//  * @param {string} params.destinatario - Correo del destinatario
//  * @param {string} params.nombre - Nombre del usuario
//  * @param {string} params.enlace - Enlace de recuperación
//  * @param {string} params.expiracion - Tiempo de expiración del enlace
//  * @returns {Promise<boolean>} True si se envió correctamente
//  */
// async function enviarCorreoRecuperacion({
//   destinatario,
//   nombre,
//   enlace,
//   expiracion,
// }) {
//   try {
//     // Aquí iría la implementación con nodemailer, SendGrid, etc.
//     // Ejemplo con nodemailer:
//     const nodemailer = await import("nodemailer");

//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: true,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const htmlContent = `
//       <h1>Recuperación de Contraseña</h1>
//       <p>Hola ${nombre},</p>
//       <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
//       <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
//       <a href="${enlace}" style="display:inline-block;padding:10px 20px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">
//         Restablecer Contraseña
//       </a>
//       <p>Este enlace expirará en ${expiracion}.</p>
//       <p>Si no solicitaste este cambio, ignora este mensaje.</p>
//     `;

//     await transporter.sendMail({
//       from: process.env.SMTP_FROM,
//       to: destinatario,
//       subject: "Recuperación de Contraseña - Sistema Comuna",
//       html: htmlContent,
//     });

//     return true;
//   } catch (error) {
//     console.error("Error al enviar correo:", error);
//     return false;
//   }
// }

//..........................................................................
