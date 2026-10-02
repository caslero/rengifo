/**
 @fileoverview Controlador de API para consultar todos los calles disponibles. Este endpoint valida
 el acceso, realiza la consulta en la base de datos y retorna los calles excluyendo el rol con ID 1
 (Rol master para control total del sistema). Utiliza Prisma como ORM y servicios personalizados
 para validación y respuesta estandarizada. @module api/calles/consultarTodos
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import validarConsultarTodasCalles from "@/services/calles/validarConsultarTodasCalles"; // Servicio para validar la consulta
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas

/**
 Maneja las solicitudes HTTP GET para obtener todos los calles del sistema.
 Valida el contexto de la solicitud, consulta la base de datos y retorna una respuesta estructurada.
 @async
 @function GET
 @returns {Promise<Response>} Respuesta HTTP con la lista de calles o un mensaje de error.
*/

export async function GET() {
  try {
    // 1. Ejecuta la validación previa antes de consultar
    const validaciones = await validarConsultarTodasCalles();

    // 2. Si la validación falla, retorna una respuesta de error
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400,
      );
    }

    // 3. Consulta todos los calles, excluyendo el rol con ID 1 y los marcados como borrados
    const todasCalles = await prisma.calle.findMany({
      where: {
        borrado: false,
      },
    });

    // 4. Verifica si se obtuvieron resultados válidos
    if (!todasCalles) {
      return generarRespuesta("error", "Error, al consultar calles", {}, 400);
    }

    // 5. Retorna la lista de calles en una respuesta exitosa
    return generarRespuesta(
      "ok",
      "Todos los calles",
      {
        calles: todasCalles,
      },
      200,
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar calles: ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar calles",
      {},
      500,
    );
  }
}
