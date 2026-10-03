"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import SelectOpcion from "@/components/SelectOpcion";
import InputCedula from "@/components/inputs/InputCedula";
import InputNombre from "@/components/inputs/InputNombre";
import InputCorreo from "@/components/inputs/InputCorreo";
import InputClave from "@/components/inputs/InputClave";
import InputCheckBox from "@/components/inputs/InputCheckBox";
import Div from "@/components/padres/Div";
import Span from "@/components/padres/Span";
import MostrarMsj from "@/components/MostrarMensaje";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { cambiarSeleccionRol } from "@/components/dashboard/usuarios/funciones/cambiarSeleccionRol";
import { toggleAutorizar } from "@/components/dashboard/usuarios/funciones/toggleAutorizar";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { resetForm } from "@/store/features/formularios/formSlices";

export default function FormCrearUsuario({
  // Identificación y Rol
  idRol,
  setIdRol,
  rolId,
  setRolId,
  setNombreRol,
  roles = [],
  calles,

  // Cédula
  cedula,
  setCedula,

  // Nombres y Apellidos
  nombre,
  setNombre,
  nombreDos,
  setNombreDos,
  apellido,
  setApellido,
  apellidoDos,
  setApellidoDos,

  // Datos Personales
  fn,
  setFechaNacimiento,
  genero,
  setGenero,
  telefono,
  setTelefono,

  // Credenciales
  correo,
  setCorreo,
  claveUno,
  setClaveUno,
  claveDos,
  setClaveDos,

  // Estructura Comunal
  comunaId,
  setComunaId,
  calleId,
  setCalleId,
  familiaId,
  setFamiliaId,

  // Control y Autorización
  validado,
  setValidado,
  autorizar,
  setAutorizar,

  // Validaciones y Mensajes
  validarCedula,
  setValidarCedula,
  validarCorreo,
  setValidarCorreo,
  validarNombre,
  setValidarNombre,
  validarApellido,
  setValidarApellido,
  validarClave,
  setValidarClave,
  mensaje,
  setMensaje,

  // Auth / Redux
  usuarioActivo,
}) {
  const dispatch = useDispatch();
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.usuarioForm,
  );

  const safeSet = (fn, val) => {
    if (typeof fn === "function") fn(val);
  };

  useEffect(() => {
    if (mostrarCrear) {
      safeSet(setCedula, "");
      safeSet(setCorreo, "");
      safeSet(setNombre, "");
      safeSet(setNombreDos, "");
      safeSet(setApellido, "");
      safeSet(setApellidoDos, "");
      safeSet(setFechaNacimiento, "");
      safeSet(setGenero, "");
      safeSet(setTelefono, "");
      safeSet(setIdRol, "");
      safeSet(setRolId, "");
      safeSet(setClaveUno, "");
      safeSet(setClaveDos, "");
      safeSet(setComunaId, "");
      safeSet(setCalleId, "");
      safeSet(setFamiliaId, "");
      safeSet(setValidado, false);
      safeSet(setAutorizar, "");
      safeSet(setMensaje, "");
    }
  }, [reiniciarForm, mostrarCrear]);

  const leyendoClave1 = (e) => {
    const val = e.target.value;
    safeSet(setClaveUno, val);
    verificarCoincidencia(val, claveDos);
    limiteSizeClave(val, claveDos);
  };

  const leyendoClave2 = (e) => {
    const val = e.target.value;
    safeSet(setClaveDos, val);
    verificarCoincidencia(claveUno, val);
    limiteSizeClave(claveUno, val);
  };

  const limiteSizeClave = (clave, claveDos) => {
    if (clave && claveDos && clave === claveDos) {
      if (clave.length < 8 || claveDos.length > 16) {
        safeSet(setMensaje, "Clave debe ser entre 8 y 16 caracteres");
      } else if (!validarClave) {
        safeSet(setMensaje, "Formato de clave invalido...");
      } else {
        safeSet(setMensaje, "");
      }
    }
  };

  const verificarCoincidencia = (clave, clave2) => {
    if (!validarClave) {
      safeSet(setMensaje, "Formato clave invalido...");
    } else if (clave !== clave2) {
      safeSet(setMensaje, "Claves no coinciden...");
    } else {
      safeSet(setMensaje, "");
    }
  };

  return (
    <Formulario onSubmit={(e) => e.preventDefault()}>
      <DivScroll>
        {/* Cédula */}
        <InputCedula
          value={cedula}
          setValue={setCedula}
          validarCedula={validarCedula}
          setValidarCedula={setValidarCedula}
        />

        {/* Primer Nombre */}
        <InputNombre
          nombre={"Primer Nombre"}
          value={nombre}
          setValue={setNombre}
          validarNombre={validarNombre}
          setValidarNombre={setValidarNombre}
        />

        {/* Segundo Nombre */}
        <InputNombre
          nombre={"Segundo Nombre (Opcional)"}
          htmlFor={"nombreDos"}
          value={nombreDos}
          setValue={setNombreDos}
          validarNombre={() => true}
          setValidarNombre={() => {}}
          placeholder={"opcional"}
        />

        {/* Primer Apellido */}
        <InputNombre
          nombre={"Primer Apellido"}
          htmlFor={"apellido"}
          value={apellido}
          setValue={setApellido}
          validarNombre={validarApellido}
          setValidarNombre={setValidarApellido}
          placeholder={"Pérez"}
        />

        {/* Segundo Apellido */}
        <InputNombre
          nombre={"Segundo Apellido (Opcional)"}
          htmlFor={"apellidoDos"}
          value={apellidoDos}
          setValue={setApellidoDos}
          validarNombre={() => true}
          setValidarNombre={() => {}}
          placeholder={"opcional"}
        />

        {/* Correo Electrónico */}
        <InputCorreo
          value={correo}
          setValue={setCorreo}
          validarCorreo={validarCorreo}
          setValidarCorreo={setValidarCorreo}
        />

        {/* Selección de Rol */}
        <SelectOpcion
          idOpcion={idRol || rolId}
          nombre={"Roles"}
          handleChange={(e) => {
            cambiarSeleccionRol(e, setIdRol);
          }}
          opciones={roles}
          seleccione={"Seleccione"}
          setNombre={setNombreRol}
        />

        <SelectOpcion
          idOpcion={calleId}
          nombre={"Calles"}
          handleChange={(e) => {
            cambiarSeleccionRol(e, setCalleId);
          }}
          opciones={calles}
          seleccione={"Seleccione"}
          setNombre={setNombreRol}
        />

        {/* Contraseñas */}
        <InputClave
          value={claveUno}
          onChange={leyendoClave1}
          indice={"clave"}
          validarClave={validarClave}
          setValidarClave={setValidarClave}
        />

        <InputClave
          nombre={"Clave confirmar"}
          value={claveDos}
          onChange={leyendoClave2}
          indice={"clave2"}
        />

        {/* Autorizar */}
        <Div className="flex flex-col w-full">
          <Span className="text-[#364153] font-medium">Autorizar</Span>
          <Div className="flex justify-evenly border border-[#d1d5dc] py-2 rounded-md hover:border hover:border-[#082158]">
            {[
              { id: 1, nombre: "Si" },
              { id: 2, nombre: "No" },
            ].map((opcion) => (
              <InputCheckBox
                altura={5}
                key={opcion.id}
                id={opcion.id}
                nombre={opcion.nombre}
                isChecked={autorizar === opcion.id}
                onToggle={() =>
                  toggleAutorizar(opcion.id, setAutorizar, autorizar)
                }
              />
            ))}
          </Div>
        </Div>

        {/* Mensaje de validación */}
        {mensaje && (
          <Div className="w-full">
            <MostrarMsj mensaje={mensaje} />
          </Div>
        )}

        {/* Botones */}
        <AgruparCamposForm>
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={() => {
              dispatch(cerrarModal("crear"));
              dispatch(abrirModal("confirmar"));
            }}
            nombre={"Crear"}
            campos={{
              cedula,
              nombre,
              apellido,
              correo,
              claveUno,
              claveDos,
              idRol: idRol,
              calleId,
              autorizar,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              dispatch(resetForm("usuarioForm"));
            }}
            campos={{
              cedula,
              correo,
              nombre,
              nombreDos,
              apellido,
              apellidoDos,
              claveUno,
              claveDos,
              idRol: idRol || rolId,
              autorizar,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
