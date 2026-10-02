/**
 @fileoverview Controlador de API para crear un nuevo usuario en el sistema. Este endpoint valida
 los datos recibidos, genera un token de activación, registra al usuario en la base de datos, lo
 asocia con instituciones y departamentos, registra eventos de auditoría y retorna el perfil del
 usuario creado. Utiliza Prisma como ORM y servicios personalizados para validación y respuesta
 estandarizada. @module api/usuarios/crearUsuario
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría
import validarCrearUsuario from "@/services/usuarios/validarCrearUsuario"; // Servicio para validar los datos del nuevo usuario
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas

/**
 Maneja las solicitudes HTTP POST para crear un nuevo usuario.
 Valida los datos recibidos, genera un token de activación,
 registra al usuario en la base de datos y retorna su perfil.
 @async
 @function POST
 @param {Request} request - Solicitud HTTP con los datos del nuevo usuario.
 @returns {Promise<Response>} Respuesta HTTP con el usuario creado o mensaje de error.
*/

export async function POST(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud adaptados al schema comunitario
    const datos = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarCrearUsuario(datos);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: 0,
        descripcion: "Validacion fallida al intentar crear usuario",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400,
      );
    }

    // 4. Ejecuta transacción: crea el usuario y consulta su perfil con sus relaciones comunitarias
    const [nuevoUsuario, usuarioCompleto] = await prisma.$transaction([
      prisma.usuario.create({
        data: {
          cedula: validaciones.cedula,
          nombre: validaciones.nombre,
          nombre_dos: validaciones.nombre_dos ?? "",
          apellido: validaciones.apellido,
          apellido_dos: validaciones.apellido_dos ?? "",
          f_n: validaciones.f_n ? new Date(validaciones.f_n) : null,
          genero: validaciones.genero,
          telefono: validaciones.telefono,
          correo: validaciones.correo ?? null,
          token: validaciones.token,
          clave: validaciones.claveEncriptada ?? null,
          validado: validaciones.validado ?? false,
          roles: { connect: { id: validaciones.rolId } },
          creador: validaciones.id_creador
            ? { connect: { id: validaciones.id_creador } }
            : undefined,
          comuna: { connect: { id: validaciones.comunaId } },
          calle: validaciones.calleId
            ? { connect: { id: validaciones.calleId } }
            : undefined,
          familia: validaciones.familiaId
            ? { connect: { id: validaciones.familiaId } }
            : undefined,
        },
      }),

      prisma.usuario.findFirst({
        where: {
          cedula: validaciones.cedula,
        },
        select: {
          id: true,
          cedula: true,
          nombre: true,
          nombre_dos: true,
          apellido: true,
          apellido_dos: true,
          f_n: true,
          genero: true,
          telefono: true,
          correo: true,
          borrado: true,
          validado: true,
          createdAt: true,
          rolId: true,
          roles: {
            select: { id: true, nombre: true },
          },
          comuna: {
            select: { id: true, nombre: true, codigo: true },
          },
          calle: {
            select: { id: true, nombre: true, numero: true },
          },
          familia: {
            select: { id: true, nombre: true, codigo: true },
          },
        },
      }),
    ]);

    // 5. Si no se crea el usuario, registra el error y retorna error 400
    if (!nuevoUsuario) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_CREAR_USUARIO",
        id_objeto: 0,
        id_usuario: 0,
        descripcion: "No se pudo crear el usuario",
        datosAntes: null,
        datosDespues: nuevoUsuario,
      });

      return generarRespuesta("error", "Error, no se creo el usuario", {}, 400);
    }

    // 6. Registro exitoso del evento y retorno del usuario creado
    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "CREAR_USUARIO",
      id_objeto: usuarioCompleto?.familia?.id ?? 0,
      id_usuario: nuevoUsuario.id,
      descripcion: `Usuario creado y asignado a la comuna ${
        usuarioCompleto?.comuna?.nombre ?? "sin comuna"
      }`,
      datosAntes: null,
      datosDespues: nuevoUsuario,
    });

    return generarRespuesta(
      "ok",
      "Usuario creado con exito",
      { usuarios: usuarioCompleto },
      201,
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno crear usuario:`, error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear usuario",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error interno crear usuario", {}, 500);
  }
}

// export async function POST(request) {
//   try {
//     // 1. Extrae los datos del cuerpo de la solicitud
//     const {
//       cedula,
//       nombre,
//       apellido,
//       correo,
//       claveUno,
//       claveDos,
//       id_rol,
//       autorizar,
//       institucion,
//       departamento,
//     } = await request.json();

//     // 2. Ejecuta la validación de los datos recibidos
//     const validaciones = await validarCrearUsuario(
//       cedula,
//       nombre,
//       apellido,
//       correo,
//       claveUno,
//       claveDos,
//       id_rol,
//       autorizar,
//       institucion,
//     );

//     // 3. Si la validación falla, registra el intento fallido y retorna error 400
//     if (validaciones.status === "error") {
//       await registrarEventoSeguro(request, {
//         tabla: "usuario",
//         accion: "INTENTO_FALLIDO",
//         id_objeto: 0,
//         id_usuario: 0,
//         descripcion: "Validacion fallida al intentar crear usuario",
//         datosAntes: null,
//         datosDespues: validaciones,
//       });

//       return generarRespuesta(
//         validaciones.status,
//         validaciones.message,
//         {},
//         400,
//       );
//     }

//     // 4. Ejecuta transacción: crea el usuario y consulta su perfil con departamentos
//     const [nuevoUsuario, usuarioConDepartamentos] = await prisma.$transaction([
//       prisma.usuario.create({
//         data: {
//           cedula: validaciones.cedula,
//           nombre: validaciones.nombre,
//           apellido: validaciones.apellido,
//           correo: validaciones.correo,
//           token: validaciones.token,
//           clave: validaciones.claveEncriptada,
//           id_rol: validaciones.id_rol,
//           id_usuario: validaciones.id_creador,
//           validado: validaciones.autorizar,
//           MiembrosInstitucion: {
//             connect: validaciones.id_institucion.map(({ id }) => ({ id })),
//           },
//           MiembrosDepartamentos: {
//             connect: departamento.map(({ id }) => ({ id })),
//           },
//         },
//       }),

//       prisma.usuario.findFirst({
//         where: {
//           correo: validaciones.correo,
//         },
//         select: {
//           id: true,
//           cedula: true,
//           correo: true,
//           nombre: true,
//           apellido: true,
//           borrado: true,
//           validado: true,
//           createdAt: true,
//           id_rol: true,
//           roles: {
//             select: { id: true, nombre: true },
//           },
//           MiembrosDepartamentos: {
//             select: {
//               id: true,
//               nombre: true,
//               descripcion: true,
//             },
//           },
//         },
//       }),
//     ]);

//     // 5. Si no se crea el usuario, registra el error y retorna error 400
//     if (!nuevoUsuario) {
//       await registrarEventoSeguro(request, {
//         tabla: "usuario",
//         accion: "ERROR_CREAR_USUARIO",
//         id_objeto: 0,
//         id_usuario: 0,
//         descripcion: "No se pudo crear el usuario",
//         datosAntes: null,
//         datosDespues: nuevoUsuario,
//       });

//       return generarRespuesta("error", "Error, no se creo el usuario", {}, 400);
//     }

//     // 6. Registro exitoso del evento y retorno del usuario creado
//     await registrarEventoSeguro(request, {
//       tabla: "usuario",
//       accion: "CREAR_USUARIO",
//       id_objeto: usuarioConDepartamentos?.MiembrosDepartamentos?.[0]?.id ?? 0,
//       id_usuario: nuevoUsuario.id,
//       descripcion: `Usuario creado y se agrego al departamento ${
//         usuarioConDepartamentos?.MiembrosDepartamentos?.[0]?.nombre ??
//         "sin departamento"
//       }`,
//       datosAntes: null,
//       datosDespues: nuevoUsuario,
//     });

//     return generarRespuesta(
//       "ok",
//       "Usuario creado con exito",
//       { usuarios: usuarioConDepartamentos },
//       201,
//     );
//   } catch (error) {
//     // 7. Manejo de errores inesperados
//     console.log(`Error interno crear usuario:`, error);

//     await registrarEventoSeguro(request, {
//       tabla: "usuario",
//       accion: "ERROR_INTERNO",
//       id_objeto: 0,
//       id_usuario: 0,
//       descripcion: "Error inesperado al crear usuario",
//       datosAntes: null,
//       datosDespues: error.message,
//     });

//     // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
//     return generarRespuesta("error", "Error interno crear usuario", {}, 500);
//   }
// }
