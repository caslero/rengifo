/**
 @fileoverview Clase de validaciones para campos comunes en formularios. Este módulo centraliza
 la lógica de validación para entradas como correos, teléfonos, claves, etc. Utiliza expresiones
 regulares definidas en constantes y funciones utilitarias para sanitizar datos.
 @module services/ValidarCampos
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para estructurar respuestas internas
import { quitarCaracteres } from "@/utils/quitarCaracteres"; // Función para limpiar caracteres no deseados

import { cedulaRegex } from "@/utils/regex/cedulaRegex";
import { phoneRegex } from "@/utils/regex/telefonoRegex";
import { emailRegex } from "@/utils/regex/correoRegex";
import { claveRegex } from "@/utils/regex/claveRegex";
import { rifRegex } from "@/utils/regex/rifRegex";
import { textRegex } from "@/utils/regex/textRegex";
import { fechaFormatoIsoRegex } from "@/utils/regex/fechaFormatoIsoRegex";
import { estanteRegex } from "@/utils/regex/nombreEstanteRegex";
import { carpetaRegex } from "@/utils/regex/nombreCarpetaRegex";
import { regexGeneral } from "@/utils/regex/regexGeneral";

/**
 Clase que agrupa métodos estáticos para validar campos individuales. Cada método retorna una
 respuesta estructurada con estado, mensaje y datos procesados.
*/

export default class ValidarCampos {
  /**
   Valida el campo de correo electrónico. Verifica que no esté vacío y que cumpla con el formato
   estándar. Convierte el correo a minúsculas para normalizarlo.
   @function validarCampoCorreo
   @param {string} correo - Correo electrónico ingresado por el usuario.
   @returns {Object} Objeto con estado, mensaje y correo normalizado si es válido.
  */
  static validarCampoCorreo(correo) {
    try {
      // 1. Verifica si el campo está vacío
      if (!correo) {
        return retornarRespuestaFunciones("error", "Campo correo vacio");
      }

      // 2. Valida el formato del correo usando expresión regular
      if (!emailRegex.test(correo)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, formato de correo invalido",
        );
      }

      // 3. Normaliza el correo a minúsculas
      const correoLetrasMinusculas = correo.toLowerCase();

      // 4. Retorna respuesta exitosa con el correo validado
      return retornarRespuestaFunciones("ok", "Campo correo correcto", {
        correo: correoLetrasMinusculas,
      });
    } catch (error) {
      // 5. Manejo de errores inesperados
      console.log(`Error interno campo correo:`, error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno campo correo");
    }
  }

  /**
   Valida el campo de nombre. Verifica que no esté vacío y que cumpla con el formato de texto
   permitido (letras y espacios). Convierte el nombre a minúsculas para normalizarlo.
   @function validarCampoNombre
   @param {string} nombre - Nombre ingresado por el usuario.
   @returns {Object} Objeto con estado, mensaje y nombre normalizado si es válido.
  */
  static validarCampoNombre(nombre) {
    try {
      // 1. Verifica si el campo está vacío
      if (!nombre) {
        return retornarRespuestaFunciones("error", "Error, campo nombre vacio");
      }

      // 2. Valida el formato del nombre usando expresión regular
      if (!textRegex.test(nombre)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, formato de nombre invalido",
        );
      }

      // 3. Normaliza el nombre a minúsculas
      const nombreLetrasMinusculas = nombre.toLowerCase();

      // 4. Retorna respuesta exitosa con el nombre validado
      return retornarRespuestaFunciones("ok", "Campo nombre correcto", {
        nombre: nombreLetrasMinusculas,
      });
    } catch (error) {
      // 5. Manejo de errores inesperados
      console.log(`Error interno campo nombre:`, error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno campo nombre");
    }
  }

  /**
   Valida un campo de texto genérico. Verifica que no esté vacío y lo normaliza a minúsculas.
   No aplica reglas de formato específicas.
   @function validarCampoTexto
   @param {string} texto - Texto ingresado por el usuario.
   @returns {Object} Objeto con estado, mensaje y texto normalizado si es válido.
  */
  static validarCampoTexto(texto) {
    try {
      // 1. Verifica si el campo está vacío
      if (!texto) {
        return retornarRespuestaFunciones("error", "Error campo texto vacio");
      }

      // 2. Normaliza el texto a minúsculas
      const textoLetrasMinusculas = texto.toLowerCase();

      // 3. Retorna respuesta exitosa con el texto validado
      return retornarRespuestaFunciones("ok", "Campo valido", {
        texto: textoLetrasMinusculas,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error, interno campo texto: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error, interno campo texto");
    }
  }

  /**
   Valida el campo de alias. Verifica que no esté vacío y que cumpla con el formato
   permitido: letras, números, espacios y el prefijo "no" (opcional).
   Formato válido: "estante no 01", "estante 01", "estante rosado grande no 01", "estante 0001"
   @function validarCampoAlias
   @param {string} alias - Alias ingresado por el usuario.
   @returns {Object} Objeto con estado, mensaje y alias normalizado si es válido.
  */
  static validarCampoAlias(alias, indice) {
    try {
      // 1. Verifica si el campo está vacío
      if (!alias) {
        return retornarRespuestaFunciones("error", "Error, campo alias vacío");
      }

      // 2. Mapeo de índices a expresiones regulares (fácil de extender)
      const regexMap = {
        0: estanteRegex, // Estantes
        1: carpetaRegex, // Carpetas (requiere números)
        2: regexGeneral, // Nombres simples
        // Futuras opciones:
        // 3: regexArchivo,
        // 4: regexDirectorio,
        // 5: regexRutaCompleta
      };

      // 3. Normalizar índice: null, undefined, "" se tratan como 0
      const indiceNormalizado =
        indice === null || indice === undefined || indice === "" ? 0 : indice;

      // 4. Obtener el regex correspondiente
      const regex = regexMap[indiceNormalizado];

      // 5. Validar que el índice exista en el mapa
      if (!regex) {
        return retornarRespuestaFunciones(
          "error",
          `Error, índice ${indice} no válido. Opciones disponibles: ${Object.keys(regexMap).join(", ")}`,
        );
      }

      // 6. Validar formato
      if (!regex.test(alias)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, formato de alias inválido",
        );
      }

      // 7. Normaliza el alias
      const aliasNormalizado = alias.toLowerCase();

      // 8. Retorna respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campo alias correcto", {
        alias: aliasNormalizado,
      });
    } catch (error) {
      console.log(`Error interno campo alias: ` + error);
      return retornarRespuestaFunciones("error", "Error interno campo alias");
    }
  }

  /**
   Valida el campo de código postal. Verifica que no esté vacío y lo normaliza a minúsculas. No
   aplica reglas de formato específicas, se asume validación externa si es necesario.
   @function validarCampoCodigoPostal
   @param {string} codigoPostal - Código postal ingresado por el usuario.
   @returns {Object} Objeto con estado, mensaje y código postal normalizado si es válido.
  */
  static validarCampoCodigoPostal(codigoPostal) {
    try {
      // 1. Verifica si el campo está vacío
      if (!codigoPostal) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo codigo postal vacio",
        );
      }

      // 2. Normaliza el código postal a minúsculas
      const textoLetrasMinusculas = codigoPostal.toLowerCase();

      // 3. Retorna respuesta exitosa con el código postal validado
      return retornarRespuestaFunciones("ok", "Campo valido", {
        codigoPostal: textoLetrasMinusculas,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campo codigo postal: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campo codigo postal",
      );
    }
  }

  /**
   Valida el segundo nombre o segundo apellido. Si el campo está presente, verifica que contenga
   solo letras usando una expresión regular. Normaliza el texto a minúsculas y lo retorna con la
   clave correspondiente.
   @function validarCampoNombreApellidoDos
   @param {string} nombre - Segundo nombre o segundo apellido.
   @param {string} opcion - Indica si se está validando "nombre" o "apellido".
   @returns {Object} Objeto con estado, mensaje y campo normalizado.
  */
  static validarCampoNombreApellidoDos(nombre, opcion) {
    try {
      // 1. Si el campo está presente, valida que solo contenga letras
      if (nombre && !textRegex.test(nombre)) {
        return retornarRespuestaFunciones(
          "error",
          `Error, segundo ${
            opcion === "apellido" ? "apellido" : "nombre"
          } solo letras`,
        );
      }

      // 2. Normaliza el texto y lo asigna al campo correspondiente
      const campo =
        opcion === "apellido"
          ? { apellido_dos: nombre ? nombre.toLowerCase() : "" }
          : { nombre_dos: nombre ? nombre.toLowerCase() : "" };

      // 3. Retorna respuesta exitosa con el campo validado
      return retornarRespuestaFunciones(
        "ok",
        `Campo segundo ${opcion === "apellido" ? "apellido" : "nombre"} valido`,
        campo,
      );
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(
        `Error interno validando segundo ${
          opcion === "apellido" ? "apellido" : "nombre"
        }: ` + error,
      );

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        `Error interno validando segundo ${
          opcion === "apellido" ? "apellido" : "nombre"
        }`,
      );
    }
  }

  /**
   Valida el campo de cédula venezolana. Limpia caracteres no numéricos, verifica que sea un número
   válido y que cumpla con el formato.
   @function validarCampoCedula
   @param {string|number} cedula - Cédula ingresada por el usuario.
   @returns {Object} Objeto con estado, mensaje y cédula validada.
  */
  static validarCampoCedula(cedula) {
    try {
      // 1. Verifica si el campo está vacío
      if (!cedula) {
        return retornarRespuestaFunciones("error", "Campo cedula vacio");
      }

      // 2. Elimina caracteres no numéricos
      const cedulaLimpia = quitarCaracteres(cedula);

      // 3. Convierte a número
      const cedulaNumero = Number(cedulaLimpia);

      // 4. Verifica si es un número válido
      if (isNaN(cedulaNumero)) {
        return retornarRespuestaFunciones("error", "Error, cedula inválida");
      }

      // 5. Verifica longitud válida (7 u 8 dígitos)
      if (cedulaNumero.length < 7 || cedulaNumero.length > 8) {
        return retornarRespuestaFunciones("error", "Error, cedula incorrecta.");
      }

      // 6. Verifica formato con expresión regular
      if (!cedulaRegex.test(cedulaNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Formato de cédula invalido",
        );
      }

      // 7. Retorna respuesta exitosa con la cédula validada
      return retornarRespuestaFunciones("ok", "Campo cedula correcto", {
        cedula: String(cedulaNumero),
      });
    } catch (error) {
      // 8. Manejo de errores inesperados
      console.log(`Error interno, campo cedula: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno, campo cedula");
    }
  }

  /**
   Valida el campo de número telefónico venezolano. Limpia caracteres no numéricos y verifica que
   cumpla con el formato de 11 dígitos.
   @function validarCampoTelefono
   @param {string|number} telefono - Número telefónico ingresado por el usuario.
   @returns {Object} Objeto con estado, mensaje y teléfono validado.
  */
  static validarCampoTelefono(telefono) {
    try {
      // 1. Verifica si el campo está vacío
      if (!telefono) {
        return retornarRespuestaFunciones("error", "Campo teléfono vacio");
      }

      // 2. Elimina caracteres no numéricos
      const telefonoLimpio = quitarCaracteres(telefono);

      // 3. Verifica formato con expresión regular
      if (!phoneRegex.test(telefonoLimpio)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, formato teléfono invalido",
        );
      }

      // 4. Retorna respuesta exitosa con el teléfono validado
      return retornarRespuestaFunciones("ok", "Campo teléfono valido", {
        telefono: telefonoLimpio,
      });
    } catch (error) {
      // 5. Manejo de errores inesperados
      console.log(`Error interno, campo teléfono: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno, campo teléfono",
      );
    }
  }

  /**
   Valida el campo de edad. Verifica que no esté vacío, que sea un número válido, y que esté dentro
   del rango permitido (18–99).
   @function validarCampoEdad
   @param {string|number} edad - Edad ingresada por el usuario.
   @returns {Object} Objeto con estado, mensaje y edad validada.
  */
  static validarCampoEdad(edad) {
    try {
      // 1. Verifica si el campo está vacío
      if (!edad) {
        return retornarRespuestaFunciones("error", "Campo edad vacio");
      }

      // 2. Convierte el valor a número
      const edadNumero = Number(edad);

      // 3. Verifica si es un número válido y positivo
      if (isNaN(edadNumero) || edadNumero <= 0) {
        return retornarRespuestaFunciones("error", "Error, edad inválida");
      }

      // 4. Verifica si la edad es excesivamente alta
      if (edadNumero > 99) {
        return retornarRespuestaFunciones("error", "Error, edad muy alta.");
      }

      // 5. Verifica si es menor de edad
      if (edadNumero < 18) {
        return retornarRespuestaFunciones(
          "error",
          "Error, es un menor de edad.",
        );
      }

      // 6. Retorna respuesta exitosa con la edad validada
      return retornarRespuestaFunciones("ok", "Campo edad valido", {
        edad: edadNumero,
      });
    } catch (error) {
      // 7. Manejo de errores inesperados
      console.log(`Error interno, campo edad: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno, campo edad");
    }
  }

  /**
   Valida un campo de ID numérico. Verifica que no esté vacío, que sea un número válido y mayor a cero.
   El mensaje se personaliza según el tipo de ID indicado en `detalles`.
   @function validarCampoId
   @param {string|number} id - ID ingresado por el usuario.
   @param {string} detalles - Descripción del campo (ej. "usuario", "institución").
   @returns {Object} Objeto con estado, mensaje y ID validado.
  */
  static validarCampoId(id, detalles) {
    try {
      // 1. Verifica si el campo está vacío
      if (!id) {
        return retornarRespuestaFunciones(
          "error",
          `Campo id ${detalles} vacio`,
        );
      }

      // 2. Convierte el valor a número
      const idNumero = Number(id);

      // 3. Verifica si es un número válido y positivo
      if (isNaN(idNumero) || idNumero <= 0) {
        return retornarRespuestaFunciones(
          "error",
          `Error, id ${detalles} inválido`,
        );
      }

      // 4. Retorna respuesta exitosa con el ID validado
      return retornarRespuestaFunciones("ok", `Campo id ${detalles} valido`, {
        id: idNumero,
      });
    } catch (error) {
      // 5. Manejo de errores inesperados
      console.log(`Error, interno al (validar id ${detalles}): ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        `Error, interno al (validar id ${detalles})`,
      );
    }
  }

  /**
   Valida los campos de contraseña y confirmación. Verifica que ambos estén presentes, que coincidan,
   y que cumplan con el formato seguro.
   @function validarCampoClave
   @param {string} claveUno - Contraseña principal ingresada por el usuario.
   @param {string} claveDos - Confirmación de la contraseña.
   @returns {Object} Objeto con estado, mensaje y claves validadas.
  */
  static validarCampoClave(claveUno, claveDos) {
    try {
      // 1. Verifica si la contraseña principal está vacía
      if (!claveUno) {
        return retornarRespuestaFunciones("error", "Error campo clave vacio");
      }

      // 2. Verifica si el campo de confirmación está vacío
      if (!claveDos) {
        return retornarRespuestaFunciones(
          "error",
          "Error campo confirmar clave vacio",
        );
      }

      // 3. Verifica si ambas contraseñas coinciden
      if (claveUno !== claveDos) {
        return retornarRespuestaFunciones(
          "error",
          "Error, claves no coinciden",
        );
      }

      // 4. Verifica si la contraseña cumple con el formato seguro
      if (!claveRegex.test(claveUno)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, formato de clave invalido",
        );
      }

      // 5. Retorna respuesta exitosa con las claves validadas
      return retornarRespuestaFunciones("ok", "Campos de clave validados", {
        claveUno: claveUno,
        claveDos: claveDos,
      });
    } catch (error) {
      // 6. Manejo de errores inesperados
      console.log(`Error interno, campos claves: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno, campos claves",
      );
    }
  }

  /**
   Valida el campo de género. Acepta valores 1 o 2 (numéricos o string) que representan masculino o
   femenino. Convierte el valor a booleano: 1 → true (masculino), 2 → false (femenino).
   @function validarCampoGenero
   @param {string|number} genero - Valor del género ingresado (1 o 2).
   @returns {Object} Objeto con estado, mensaje y género convertido a booleano.
  */
  static validarCampoGenero(genero) {
    try {
      // 1. Verifica si el campo está vacío
      if (genero === null || genero === undefined || genero === "") {
        return retornarRespuestaFunciones("error", "Error, campo genero vacío");
      }

      // 2. Normaliza el valor a string en minúsculas
      const valor = String(genero).toLowerCase().trim();

      // 3. Acepta valores válidos: "1", "2", "true", "false"
      if (!["1", "2", "true", "false"].includes(valor)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo debe ser hombre o mujer",
        );
      }

      // 4. Convierte a booleano (ejemplo: 1/hombre = true, 2/mujer = false)
      let generoBooleano;
      if (valor === "1" || valor === "true") {
        generoBooleano = true;
      } else {
        generoBooleano = false;
      }

      // 5. Retorna respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campo genero validado", {
        genero: generoBooleano,
      });
    } catch (error) {
      console.log(`Error interno campo genero: ` + error);
      return retornarRespuestaFunciones("error", "Error interno campo genero");
    }
  }

  /**
   Valida un campo numérico que debe convertirse a booleano. Acepta valores 1 o 2 (numéricos o string)
   y los convierte: 1 → true, 2 → false. El mensaje se personaliza según el nombre del campo (`opcion`).
   @function validarCampoNumeroPasarBoolean
   @param {string|number} numero - Valor numérico ingresado.
   @param {string} opcion - Nombre del campo para personalizar el mensaje.
   @returns {Object} Objeto con estado, mensaje y valor booleano.
  */
  static validarCampoNumeroPasarBoolean(numero, opcion) {
    try {
      // 1. Verifica si el campo está vacío
      if (!numero) {
        return retornarRespuestaFunciones(
          "error",
          `Error, campo ${opcion} vacio`,
        );
      }

      // 2. Convierte el valor a número
      const numeroPasarBoolean = Number(numero);

      // 3. Verifica si es un número válido
      if (isNaN(numeroPasarBoolean)) {
        return retornarRespuestaFunciones(
          "error",
          `Error, campo ${opcion} invalido`,
        );
      }

      // 4. Verifica si es un número entero
      if (!Number.isInteger(numeroPasarBoolean)) {
        return retornarRespuestaFunciones(
          "error",
          `Error, campo ${opcion} debe ser entero`,
        );
      }

      // 5. Verifica si el valor es 1 o 2
      if (!(numero === 1 || numero === 2 || numero === "1" || numero === "2")) {
        return retornarRespuestaFunciones(
          "error",
          `Error, campo ${opcion} deber ser 1 o 2`,
        );
      }

      // 6. Retorna respuesta exitosa con el valor convertido a booleano
      return retornarRespuestaFunciones("ok", `Campo ${opcion} valido`, {
        boolean: numeroPasarBoolean === 1 ? true : false,
      });
    } catch (error) {
      // 7. Manejo de errores inesperados
      console.log(`Error, interno validando ${opcion}: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        `Error, interno validando ${opcion}`,
      );
    }
  }

  /**
   Valida una fecha en formato ISO. Verifica que la fecha esté presente, tenga formato válido, sea
   interpretable, no esté en el futuro y no sea anterior al año 1900.
   @function validarCampoFechaISO
   @param {string} fecha - Fecha en formato ISO (ej. "2023-08-15T00:00:00Z").
   @returns {Object} Objeto con estado, mensaje y fecha convertida a objeto Date.
  */
  static validarCampoFechaISO(fecha) {
    try {
      // 1. Verifica si el campo está vacío
      if (!fecha) {
        return retornarRespuestaFunciones("error", "Campo fecha vacio");
      }

      // 2. Verifica si el formato cumple con la expresión regular ISO
      if (!fechaFormatoIsoRegex.test(fecha)) {
        return retornarRespuestaFunciones(
          "error",
          "Error formato de fecha invalido",
        );
      }

      // 3. Intenta convertir la fecha a objeto Date
      const fechaConvertida = new Date(fecha);

      // 4. Si la verificación es incorrecta retorna un error
      if (isNaN(fechaConvertida.getTime())) {
        return retornarRespuestaFunciones(
          "error",
          "Error no se puede interpretar la fecha",
        );
      }

      // 5. Define límites de fecha
      const ahora = new Date();
      const fechaMinima = new Date("1900-01-01T00:00:00Z"); // ajustable si se necesita otro límite

      // 6. Verifica que la fecha no sea futura
      if (fechaConvertida > ahora) {
        return retornarRespuestaFunciones(
          "error",
          "Error fecha no puede pasar el dia actual",
        );
      }

      // 7. Verifica que la fecha no sea demasiado antigua
      if (fechaConvertida < fechaMinima) {
        return retornarRespuestaFunciones("error", "Error fecha muy antigua");
      }

      // 8. Retorna respuesta exitosa con la fecha convertida
      return retornarRespuestaFunciones("ok", "Campo fecha correcto", {
        fecha: fechaConvertida,
      });
    } catch (error) {
      // 9. Manejo de errores inesperados
      console.log(`Error interno, campo fecha: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error, interno campo fecha");
    }
  }

  /**
   Valida el campo de cantidad de módulos. Verifica que el valor esté presente, sea un número
   entero positivo, y que esté dentro del rango permitido (1 a MAX_MODULOS).
   @function validarCampoModulo
   @param {string|number} modulo - Cantidad de módulos ingresada por el usuario.
   @returns {Object} Objeto con estado, mensaje y número de módulos validado.
  */
  static validarCampoModulo(modulo) {
    try {
      // 1. Verifica si el campo está vacío
      if (!modulo) {
        return retornarRespuestaFunciones("error", "Campo modulo vacio");
      }

      // 2. Convierte el valor a número
      const moduloNumero = Number(modulo);

      // 3. Verifica si es un número válido y positivo
      if (isNaN(moduloNumero) || moduloNumero <= 0) {
        return retornarRespuestaFunciones("error", "Error, modulo inválido");
      }

      // 4. Verifica si es un número entero
      if (!Number.isInteger(moduloNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, modulo debe ser un número entero",
        );
      }

      // 5. Verifica si el número mínimo es 1
      if (moduloNumero < 1) {
        return retornarRespuestaFunciones("error", "Error, minimo 1 modulo");
      }

      const MAX_MODULOS = 9;

      // 6. Verifica si excede el máximo permitido
      if (moduloNumero > MAX_MODULOS) {
        return retornarRespuestaFunciones(
          "error",
          `Error, maximo ${MAX_MODULOS} módulos`,
        );
      }

      // 7. Retorna respuesta exitosa con el número de módulos validado
      return retornarRespuestaFunciones("ok", "Campo modulo valido", {
        modulo: moduloNumero,
      });
    } catch (error) {
      // 8. Manejo de errores inesperados
      console.log(`Error interno campo modulo: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno campo modulo");
    }
  }

  /**
   Valida el campo RIF (Registro de Información Fiscal). Verifica el formato general y el dígito
   verificador según el algoritmo del SENIAT.
   @function validarCampoRif
   @param {string} rif - RIF ingresado por el usuario.
   @returns {Object} Objeto con estado, mensaje y RIF validado.
  */
  static validarCampoRif(rif) {
    try {
      // 1. Verifica si el campo está vacío
      if (!rif) {
        return retornarRespuestaFunciones("error", "Campo RIF vacío");
      }

      // 2. Limpia espacios y convierte a mayúsculas
      const rifLimpio = rif.trim().toUpperCase();

      // 3. Verifica el formato general con expresión regular
      if (!rifRegex.test(rifLimpio)) {
        return retornarRespuestaFunciones(
          "error",
          "Error formato de RIF inválido",
        );
      }

      // 4. Extrae componentes del RIF
      // Validación del dígito verificador según SENIAT
      const letra = rifLimpio.charAt(0);
      const cuerpo = rifLimpio.slice(2, 10); // 8 dígitos
      const digitoOriginal = parseInt(rifLimpio.slice(-1), 10);

      // 5. Tabla de valores para letras según SENIAT
      const valoresLetra = {
        V: 1,
        E: 2,
        J: 3,
        P: 4,
        G: 5,
        C: 6,
        L: 7,
      };
      const pesos = [4, 3, 2, 7, 6, 5, 4, 3, 2];

      // 6. Verifica si la letra es válida
      if (!valoresLetra[letra]) {
        return retornarRespuestaFunciones(
          "error",
          "Error letra de RIF inválida",
        );
      }

      // 7. Calcula el dígito verificador
      const rifNumerico = [valoresLetra[letra], cuerpo.split("").map(Number)];
      const suma = rifNumerico.reduce((acc, num, i) => acc + num * pesos[i], 0);
      const resto = suma % 11;
      const digitoCalculado = resto < 2 ? resto : 11 - resto;

      // 8. Compara con el dígito original
      if (digitoCalculado !== digitoOriginal) {
        return retornarRespuestaFunciones(
          "error",
          "Error dígito verificador incorrecto según SENIAT",
        );
      }

      // 9. Retorna respuesta exitosa con el RIF validado
      return retornarRespuestaFunciones("ok", "RIF válido.", {
        rif: rifLimpio,
      });
    } catch (error) {
      // 10. Manejo de errores inesperados
      console.log(`Error interno campo RIF: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno campo RIF");
    }
  }

  /**
   Valida un campo numérico que representa un rango. Verifica que el valor esté presente, sea un
   número válido y positivo. El mensaje se personaliza según el nombre del campo (`detalles`).
   @function validarCampoRango
   @param {string|number} rango - Valor numérico del rango.
   @param {string} detalles - Nombre del campo para personalizar el mensaje.
   @returns {Object} Objeto con estado, mensaje y rango validado.
  */
  static validarCampoRango(rango, detalles) {
    try {
      // 1. Verifica si el campo está vacío
      if (!rango) {
        return retornarRespuestaFunciones("error", `Campo ${detalles} vacio`);
      }

      // 2. Convierte el valor a número
      const numero = Number(rango);

      // 3. Verifica si es un número válido y positivo
      if (isNaN(numero) || numero <= 0) {
        return retornarRespuestaFunciones(
          "error",
          `Error ${detalles} inválido`,
        );
      }

      // 4. Retorna respuesta exitosa con el rango validado
      return retornarRespuestaFunciones("ok", `Campo ${detalles} valido`, {
        rango: numero,
      });
    } catch (error) {
      // 5. Manejo de errores inesperados
      console.log(`Error interno campo rango: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", `Error interno campo rango`);
    }
  }

  /**
   Valida el campo de cantidad de niveles. Verifica que el valor esté presente, sea un número
   entero positivo, y que esté dentro del rango permitido (1 a MAX_NIVELES).
   @function validarCampoNiveles
   @param {string|number} nivel - Cantidad de niveles ingresada por el usuario.
   @returns {Object} Objeto con estado, mensaje y número de niveles validado.
  */
  static validarCampoNivel(nivel) {
    try {
      // 1. Verifica si el campo está vacío
      if (!nivel && nivel !== 0) {
        // Atención: 0 es válido, no debe entrar aquí
        return retornarRespuestaFunciones("error", "Campo nivel vacio");
      }

      // 2. Convierte el valor a número
      const nivelNumero = Number(nivel);

      // 3. Verifica si es un número válido y no negativo
      if (isNaN(nivelNumero) || nivelNumero < 0) {
        return retornarRespuestaFunciones("error", "Error, nivel inválido");
      }

      // 4. Verifica si es un número entero
      if (!Number.isInteger(nivelNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, nivel debe ser un número entero",
        );
      }

      const MAX_NIVELES = 20;

      // 5. Verifica si excede el máximo permitido
      if (nivelNumero > MAX_NIVELES) {
        return retornarRespuestaFunciones(
          "error",
          `Error, maximo ${MAX_NIVELES} niveles`,
        );
      }

      // 6. Retorna respuesta exitosa con el número de niveles validado
      return retornarRespuestaFunciones("ok", "Campo nivel valido", {
        nivel: nivelNumero,
      });
    } catch (error) {
      console.log(`Error interno campo nivel: ` + error);
      return retornarRespuestaFunciones("error", "Error interno campo nivel");
    }
  }

  /**
   Valida el campo de cantidad de secciones. Verifica que el valor esté presente, sea un número
   entero positivo, y que esté dentro del rango permitido (1 a MAX_SECCIONES).
   @function validarCampoSecciones
   @param {string|number} seccion - Cantidad de secciones ingresada por el usuario.
   @returns {Object} Objeto con estado, mensaje y número de secciones validado.
  */
  static validarCampoSeccion(seccion) {
    try {
      // 1. Verifica si el campo está vacío
      if (!seccion) {
        return retornarRespuestaFunciones("error", "Campo seccion vacio");
      }

      // 2. Convierte el valor a número
      const seccionNumero = Number(seccion);

      // 3. Verifica si es un número válido y positivo
      if (isNaN(seccionNumero) || seccionNumero <= 0) {
        return retornarRespuestaFunciones("error", "Error, seccion inválida");
      }

      // 4. Verifica si es un número entero
      if (!Number.isInteger(seccionNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, seccion debe ser un número entero",
        );
      }

      // 5. Verifica si el número mínimo es 1
      if (seccionNumero < 1) {
        return retornarRespuestaFunciones("error", "Error, minimo 1 seccion");
      }

      const MAX_SECCIONES = 10;

      // 6. Verifica si excede el máximo permitido
      if (seccionNumero > MAX_SECCIONES) {
        return retornarRespuestaFunciones(
          "error",
          `Error, maximo ${MAX_SECCIONES} secciones`,
        );
      }

      // 7. Retorna respuesta exitosa con el número de secciones validado
      return retornarRespuestaFunciones("ok", "Campo seccion valido", {
        seccion: seccionNumero,
      });
    } catch (error) {
      // 8. Manejo de errores inesperados
      console.log(`Error interno campo seccion: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno campo seccion");
    }
  }

  /**
   Valida todos los campos necesarios para registrar un nuevo usuario. Aplica validaciones
   individuales para cada campo y retorna una respuesta consolidada.
   @function validarCamposRegistro
   @param {string|number} cedula - Cédula del usuario.
   @param {string} nombre - Nombre del usuario.
   @param {string} apellido - Apellido del usuario.
   @param {string} correo - Correo electrónico del usuario.
   @param {string} claveUno - Contraseña principal.
   @param {string} claveDos - Confirmación de la contraseña.
   @param {string|number} id_rol - ID del rol asignado al usuario.
   @param {string|number} autorizar - Valor que indica si el usuario está autorizado.
   @returns {Object} Objeto con estado, mensaje y datos validados o error.
  */
  static validarCamposRegistro(datos) {
    try {
      const {
        cedula,
        nombre,
        nombre_dos,
        apellido,
        apellido_dos,
        f_n,
        genero,
        telefono,
        correo,
        claveUno,
        claveDos,
        id_rol,
        comunaId,
        calleId,
        familiaId,
        validado,
      } = datos || {};

      // 1. Validaciones individuales de IDs y campos principales obligatorios
      const validarCedula = this.validarCampoCedula(cedula);
      const validarNombre = this.validarCampoNombre(nombre);
      const validarApellido = this.validarCampoNombre(apellido);
      const validarRolId = this.validarCampoId(id_rol, 'rol');
      const validarValidado = this.validarCampoNumeroPasarBoolean(
        validado,
        "validado",
      );

      // Retorno de errores para campos base obligatorios
      if (validarCedula.status === "error") return validarCedula;
      if (validarNombre.status === "error") return validarNombre;
      if (validarApellido.status === "error") return validarApellido;
      if (validarRolId.status === "error") return validarRolId;
      if (validarValidado.status === "error") return validarValidado;

      // Determinar si el usuario requiere credenciales según el rol
      const esRolHabitanteOInferior = Number(validarRolId.id) >= 3;

      // 2. Correo (Obligatorio si rolId < 3, opcional si rolId >= 3)
      let correoValidado = null;
      if (correo && String(correo).trim() !== "") {
        const validarCorreo = this.validarCampoCorreo(correo);
        if (validarCorreo.status === "error") return validarCorreo;
        correoValidado = validarCorreo.correo;
      } else if (!esRolHabitanteOInferior) {
        return retornarRespuestaFunciones(
          "error",
          "El correo electrónico es obligatorio para este rol",
        );
      }

      // 3. Contraseñas (Obligatorias si rolId < 3, opcionales si rolId >= 3)
      let claveUnoValidada = null;
      let claveDosValidada = null;
      if (claveUno || claveDos) {
        const validarClave = this.validarCampoClave(claveUno, claveDos);
        if (validarClave.status === "error") return validarClave;
        claveUnoValidada = validarClave.claveUno;
        claveDosValidada = validarClave.claveDos;
      } else if (!esRolHabitanteOInferior) {
        return retornarRespuestaFunciones(
          "error",
          "La contraseña es obligatoria para este rol",
        );
      }

      // 4. Nombres y apellidos secundarios (Opcionales)
      let nombreDosValidado = "";
      if (nombre_dos && String(nombre_dos).trim() !== "") {
        const vNombreDos = this.validarCampoNombre(nombre_dos);
        if (vNombreDos.status === "error") return vNombreDos;
        nombreDosValidado = vNombreDos.nombre;
      }

      let apellidoDosValidado = "";
      if (apellido_dos && String(apellido_dos).trim() !== "") {
        const vApellidoDos = this.validarCampoNombre(apellido_dos);
        if (vApellidoDos.status === "error") return vApellidoDos;
        apellidoDosValidado = vApellidoDos.nombre;
      }

      // 5. Relaciones comunitarias opcionales (Comuna, Calle, Familia)
      let comunaIdValidado = null;
      if (comunaId) {
        const vComuna = this.validarCampoId(comunaId, 'comuna');
        if (vComuna.status === "error") return vComuna;
        comunaIdValidado = vComuna.id;
      }

      let calleIdValidado = null;
      if (calleId) {
        const vCalle = this.validarCampoId(calleId, 'calle');
        if (vCalle.status === "error") return vCalle;
        calleIdValidado = vCalle.id;
      }

      let familiaIdValidado = null;
      if (familiaId) {
        const vFamilia = this.validarCampoId(familiaId, 'familia');
        if (vFamilia.status === "error") return vFamilia;
        familiaIdValidado = vFamilia.id;
      }

      // 6. Retorna la respuesta con todos los campos consolidados
      return retornarRespuestaFunciones("ok", "Campos validados", {
        // Datos Personales
        cedula: validarCedula.cedula,
        nombre: validarNombre.nombre,
        nombre_dos: nombreDosValidado,
        apellido: validarApellido.nombre,
        apellido_dos: apellidoDosValidado,
        f_n: f_n || null,
        genero: genero || null,
        telefono: telefono || null,
        correo: correoValidado,
        claveUno: claveUnoValidada,
        claveDos: claveDosValidada,

        // Estado
        validado: validarValidado.boolean,
        autorizar: validarValidado.boolean,

        // IDs / Relaciones comunitarias (Compatibilidad completa de nombres)
        rolId: validarRolId.id,
        id_rol: validarRolId.id,

        comunaId: comunaIdValidado ? comunaIdValidado : 1,
        id_comuna: comunaIdValidado ? comunaIdValidado : 1,

        calleId: calleIdValidado,
        id_calle: calleIdValidado,

        familiaId: familiaIdValidado,
        id_familia: familiaIdValidado,
      });
    } catch (error) {
      console.log(`Error interno, campos registro usuario: ${error}`);

      return retornarRespuestaFunciones(
        "error",
        "Error interno, campos registro usuario",
      );
    }
  }

  /**
   Valida los campos necesarios para crear una institución. Verifica nombre, descripción,
   RIF, sector, dirección y ubicación geográfica.
   @function validarCamposCrearInstitucion
  */
  static validarCamposCrearInstitucion(
    nombre,
    descripcion,
    rif,
    sector,
    direccion,
  ) {
    try {
      // 1. Validar cada campo individualmente
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarRif = this.validarCampoRif(rif);
      const validarSector = this.validarCampoTexto(sector);
      const validarDireccion = this.validarCampoTexto(direccion);

      // 2. Verificar si alguna validación falló
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarRif.status === "error") return validarRif;
      if (validarSector.status === "error") return validarSector;
      if (validarDireccion.status === "error") return validarDireccion;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        rif: validarRif.rif,
        sector: validarSector.texto,
        direccion: validarDireccion.texto,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos institución:`, error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos institución",
      );
    }
  }

  /**
   Valida los campos necesarios para crear un departamento. Verifica nombre y descripción.
   @function validarCamposCrearDepartamento
  */
  static validarCamposCrearDepartamento(
    nombre,
    descripcion,
    alias,
    id_institucion,
  ) {
    try {
      // 1. Validar cada campo individualmente
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarAlias = this.validarCampoAlias(alias, 2);
      const validarIdInstitucion = this.validarCampoId(
        id_institucion,
        "institución",
      );

      // 2. Verificar si alguna validación falló
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarAlias.status === "error") return validarAlias;
      if (validarIdInstitucion.status === "error") return validarIdInstitucion;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        alias: validarAlias.alias,
        id_institucion: validarIdInstitucion.id,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos departamento:`, error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos departamento",
      );
    }
  }

  /**
   Valida los campos necesarios para el inicio de sesión. Verifica correo y que la clave esté presente.
   @function validarCamposLogin
  */
  static validarCamposLogin(correo, clave) {
    try {
      // 1. Validar cada campo individualmente
      const validarCorreo = this.validarCampoCorreo(correo);

      // 2. Verificar si las validaciones fallan
      if (validarCorreo.status === "error") return validarCorreo;
      if (!clave) {
        return retornarRespuestaFunciones("error", "Error, campo clave vacio");
      }

      // 3. Retornar respuesta exitosa con los datos validados
      return retornarRespuestaFunciones("ok", "Campos validados", {
        correo: validarCorreo.correo,
        clave: clave,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos del login: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos del login",
      );
    }
  }

  /**
   Valida los campos necesarios para crear un nuevo estante.
   @function validarCamposCrearEstante
   @param {string} nombre - El nombre del estante.
   @param {string} descripcion - La descripción del estante.
   @param {string} alias - El alias del estante.
   @param {number} niveles - La cantidad de niveles del estante.
   @param {number} secciones - La cantidad de secciones del estante.
  */
  static validarCamposCrearEstante(
    nombre,
    descripcion,
    alias,
    niveles,
    secciones,
  ) {
    try {
      // 1. Validar cada campo individualmente.
      const validarNombre = this.validarCampoTexto(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarAlias = this.validarCampoAlias(alias);
      const validarNivel = this.validarCampoNivel(niveles);
      const validarSeccion = this.validarCampoSeccion(secciones);

      // 2. Verificar si alguna validación falló
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarAlias.status === "error") return validarAlias;
      if (validarNivel.status === "error") return validarNivel;
      if (validarSeccion.status === "error") return validarSeccion;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados", {
        nombre: validarNombre.texto,
        descripcion: validarDescripcion.texto,
        alias: validarAlias.alias,
        niveles: validarNivel.nivel,
        secciones: validarSeccion.seccion,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos estante: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos estante",
      );
    }
  }

  /**
   Valida los campos necesarios para crear una nueva carpeta.
   @function validarCamposCrearCarpeta
   @param {number} idEstante - El ID del estante al que pertenece la carpeta.
   @param {string} nombre - El nombre de la carpeta.
   @param {string} descripcion - La descripción de la carpeta.
   @param {string} alias - El alias de la carpeta.
   @param {number} nivel - El nivel de la carpeta.
   @param {number} seccion - La sección de la carpeta.
  */
  static validarCamposCrearCarpeta(
    idEstante,
    nombre,
    descripcion,
    alias,
    nivel,
    seccion,
  ) {
    try {
      // 1. Validar cada campo individualmente.
      const validarIdEstante = this.validarCampoId(idEstante, "estante");
      const validarNombre = this.validarCampoTexto(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarAlias = this.validarCampoAlias(alias, 1);
      const validarNivel = this.validarCampoNivel(nivel);
      const validarSeccion = this.validarCampoSeccion(seccion);

      // 2. Verificar si alguna validación falló
      if (validarIdEstante.status === "error") return validarIdEstante;
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarAlias.status === "error") return validarAlias;
      if (validarNivel.status === "error") return validarNivel;
      if (validarSeccion.status === "error") return validarSeccion;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados", {
        id_estante: validarIdEstante.id,
        nombre: validarNombre.texto,
        descripcion: validarDescripcion.texto,
        alias: validarAlias.alias,
        nivel: validarNivel.nivel,
        seccion: validarSeccion.seccion,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos carpeta: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos carpeta",
      );
    }
  }

  /**
   Valida los campos necesarios para crear un nuevo archivo.
   @function validarCamposCrearArchivo
   @param {number} idCarpeta - El ID de la carpeta a la que pertenece el archivo.
   @param {string} nombre - El nombre del archivo.
   @param {string} descripcion - La descripción del archivo.
   @param {string} alias - El alias del archivo.
  */
  static validarCamposCrearArchivo(idCarpeta, nombre, descripcion, alias) {
    try {
      // 1. Validar cada campo individualmente.
      const validarIdCarpeta = this.validarCampoId(idCarpeta, "carpeta");
      const validarNombre = this.validarCampoTexto(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarAlias = this.validarCampoAlias(alias, 1);

      // 2. Verificar si alguna validación falló
      if (validarIdCarpeta.status === "error") return validarIdCarpeta;
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarAlias.status === "error") return validarAlias;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados", {
        id_carpeta: validarIdCarpeta.id,
        nombre: validarNombre.texto,
        descripcion: validarDescripcion.texto,
        alias: validarAlias.alias,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos archivo: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos archivo",
      );
    }
  }

  /**
   * De aqui en adelante estan las funciones de validacion para editar
   * De aqui en adelante estan las funciones de validacion para editar
   * De aqui en adelante estan las funciones de validacion para editar
   * De aqui en adelante estan las funciones de validacion para editar
   * De aqui en adelante estan las funciones de validacion para editar
   * De aqui en adelante estan las funciones de validacion para editar
   * De aqui en adelante estan las funciones de validacion para editar
   * De aqui en adelante estan las funciones de validacion para editar
   * De aqui en adelante estan las funciones de validacion para editar
   * De aqui en adelante estan las funciones de validacion para editar
   * De aqui en adelante estan las funciones de validacion para editar
   * De aqui en adelante estan las funciones de validacion para editar
   * De aqui en adelante estan las funciones de validacion para editar
   */

  /**
   Valida los campos necesarios para editar una institución.
   @function validarCamposEditarInstitucion
   @param {string} nombre - El nuevo nombre de la institución.
   @param {string} descripcion - La nueva descripción de la institución.
   @param {string} rif - El RIF (Registro de Información Fiscal) de la institución.
   @param {string} sector - El sector al que pertenece la institución.
   @param {string} direccion - La nueva dirección de la institución.
   @param {number} id_institucion - El ID de la institución a editar.
  */
  static validarCamposEditarInstitucion(
    nombre,
    descripcion,
    rif,
    sector,
    direccion,
    id_institucion,
  ) {
    try {
      // 1. Validar cada campo individualmente.
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarRif = this.validarCampoRif(rif);
      const validarSector = this.validarCampoTexto(sector);
      const validarDireccion = this.validarCampoTexto(direccion);
      const validarIdInstitucion = this.validarCampoId(
        id_institucion,
        "institucion",
      );

      // 2. Verificar si alguna validación falló
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarRif.status === "error") return validarRif;
      if (validarSector.status === "error") return validarSector;
      if (validarDireccion.status === "error") return validarDireccion;
      if (validarIdInstitucion.status === "error") return validarIdInstitucion;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        rif: validarRif.rif,
        sector: validarSector.texto,
        direccion: validarDireccion.texto,
        id_institucion: validarIdInstitucion.id,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos editar institución:`, error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar institución",
      );
    }
  }

  /**
   Valida los campos necesarios para editar un departamento.
   @function validarCamposEditarDepartamento
   @param {string} nombre - El nuevo nombre del departamento.
   @param {string} descripcion - La nueva descripción del departamento.
   @param {number} id_departamento - El ID del departamento a editar.
  */
  static validarCamposEditarDepartamento(
    nombre,
    descripcion,
    id_institucion,
    id_departamento,
  ) {
    try {
      // 1. Validar cada campo individualmente.
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdInstitucion = this.validarCampoId(
        id_institucion,
        "institucion",
      );
      const validarIdDepartamento = this.validarCampoId(
        id_departamento,
        "departamento",
      );

      // 2. Verificar si alguna validación falló
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdInstitucion.status === "error") return validarIdInstitucion;
      if (validarIdDepartamento.status === "error")
        return validarIdDepartamento;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        id_institucion: validarIdInstitucion.id,
        id_departamento: validarIdDepartamento.id,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos editar departamento: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar departamento",
      );
    }
  }

  /**
   Valida los campos necesarios para editar un estante.
   @function validarCamposEditarEstante
   @param {string} nombre - El nuevo nombre del estante.
   @param {string} descripcion - La nueva descripción del estante.
   @param {number} niveles - La nueva cantidad de niveles del estante.
   @param {number} secciones - La nueva cantidad de secciones del estante.
   @param {number} id_estante - El ID del estante a editar.
  */
  static validarCamposEditarEstante(
    nombre,
    descripcion,
    niveles,
    secciones,
    id_estante,
  ) {
    try {
      // 1. Validar cada campo individualmente.
      const validarIdEstante = this.validarCampoId(id_estante, "estante");
      const validarNombre = this.validarCampoTexto(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarNivel = this.validarCampoNivel(niveles);
      const validarSeccion = this.validarCampoSeccion(secciones);

      // 2. Verificar si alguna validación falló
      if (validarIdEstante.status === "error") return validarIdEstante;
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarNivel.status === "error") return validarNivel;
      if (validarSeccion.status === "error") return validarSeccion;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados", {
        id_estante: validarIdEstante.id,
        nombre: validarNombre.texto,
        descripcion: validarDescripcion.texto,
        niveles: validarNivel.nivel,
        secciones: validarSeccion.seccion,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos editar estante: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar estante",
      );
    }
  }

  /**
   Valida los campos necesarios para editar una carpeta.
   @function validarCamposEditarCarpeta
   @param {string} nombre - El nuevo nombre de la carpeta.
   @param {string} descripcion - La nueva descripción de la carpeta.
   @param {number} nivel - El nuevo nivel donde estara la carpeta.
   @param {number} seccion - La nueva seccion donde estara la carpeta.
   @param {number} id_carpeta - El ID de la carpeta a editar.
  */
  static validarCamposEditarCarpeta(
    nombre,
    descripcion,
    nivel,
    seccion,
    id_carpeta,
  ) {
    try {
      // 1. Validar cada campo individualmente.
      const validarIdCarpeta = this.validarCampoId(id_carpeta, "carpeta");
      const validarNombre = this.validarCampoTexto(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarNivel = this.validarCampoNivel(nivel);
      const validarSeccion = this.validarCampoSeccion(seccion);

      // 2. Verificar si alguna validación falló
      if (validarIdCarpeta.status === "error") return validarIdCarpeta;
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarNivel.status === "error") return validarNivel;
      if (validarSeccion.status === "error") return validarSeccion;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados", {
        id_carpeta: validarIdCarpeta.id,
        nombre: validarNombre.texto,
        descripcion: validarDescripcion.texto,
        nivel: validarNivel.nivel,
        seccion: validarSeccion.seccion,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos editar carpeta: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar carpeta",
      );
    }
  }

  /**
   Valida los campos necesarios para editar un archivo.
   @function validarCamposEditarArchivo
   @param {string} nombre - El nuevo nombre del archivo.
   @param {string} descripcion - La nueva descripción del archivo.
   @param {number} id_archivo - El ID del archivo a editar.
  */
  static validarCamposEditarArchivo(nombre, descripcion, id_archivo) {
    try {
      // 1. Validar cada campo individualmente.
      const validarIdArchivo = this.validarCampoId(id_archivo, "archivo");
      const validarNombre = this.validarCampoTexto(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);

      // 2. Verificar si alguna validación falló
      if (validarIdArchivo.status === "error") return validarIdArchivo;
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados", {
        id_archivo: validarIdArchivo.id,
        nombre: validarNombre.texto,
        descripcion: validarDescripcion.texto,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos editar archivo: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar archivo",
      );
    }
  }
}
