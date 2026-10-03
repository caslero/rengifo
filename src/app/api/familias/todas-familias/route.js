/**
 @fileoverview Controlador de API para consultar todos los familias disponibles. Este endpoint valida
 el acceso, realiza la consulta en la base de datos y retorna los familias excluyendo el rol con ID 1
 (Rol master para control total del sistema). Utiliza Prisma como ORM y servicios personalizados
 para validación y respuesta estandarizada. @module api/familias/consultarTodasFamilias
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import validarConsultarTodasFamilias from "@/services/familias/validarConsultarTodasFamilias"; // Servicio para validar la consulta
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas

/**
 Maneja las solicitudes HTTP GET para obtener todos los familias del sistema.
 Valida el contexto de la solicitud, consulta la base de datos y retorna una respuesta estructurada.
 @async
 @function GET
 @returns {Promise<Response>} Respuesta HTTP con la lista de familias o un mensaje de error.
*/

export async function GET() {
  try {
    // 1. Ejecuta la validación previa antes de consultar
    const validaciones = await validarConsultarTodasFamilias();

    // 2. Si la validación falla, retorna una respuesta de error
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400,
      );
    }

    // 3. Consulta todos los familias, excluyendo el rol con ID 1 y los marcados como borrados
    const todasfamilias = await prisma.familia.findMany({
      where: {
        borrado: false,
      },
      include: {
        calle: true
      }
    });

    // 4. Verifica si se obtuvieron resultados válidos
    if (!todasfamilias) {
      return generarRespuesta("error", "Error, al consultar familias", {}, 400);
    }

    // 5. Retorna la lista de familias en una respuesta exitosa
    return generarRespuesta(
      "ok",
      "Todas las familias",
      {
        familias: todasfamilias,
      },
      200,
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar familias: ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar familias",
      {},
      500,
    );
  }
}
