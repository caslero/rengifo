"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import FormCrearUsuario from "@/components/formularios/FormCrearUsuario";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";
import SelectOpcion from "@/components/SelectOpcion";
import BotonesModal from "@/components/botones/BotonesModal";

import { cambiarSeleccionRol } from "@/components/dashboard/usuarios/funciones/cambiarSeleccionRol";

import { fetchRoles } from "@/store/features/roles/thunks/todosRoles";
import { cambiarRolUsuario } from "@/store/features/usuarios/thunks/cambiarRolUsuario";
import { crearUsuario } from "@/store/features/usuarios/thunks/crearUsuario";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchCalles } from "@/store/features/calles/thunks/todasCalles";

export default function ModalUsuarios({
  acciones,
  datosUsuario,
  validaciones,
}) {
  const dispatch = useDispatch();
  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar,
  );
  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const notify = (msj) => toast(msj);

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { roles } = useSelector((state) => state.roles);
  const { calles } = useSelector((state) => state.calles);




  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchCalles());
  }, [dispatch]);

  const {
    accion,
    setAccion,
    setCedula,
    setNombre,
    setNombreDos,
    setApellido,
    setApellidoDos,        // <--- Añadido
    setFechaNacimiento,    // <--- Añadido
    setGenero,             // <--- Añadido
    setTelefono,           // <--- Añadido
    setCorreo,
    setClaveUno,
    setClaveDos,
    setRolId,              // <--- Añadido
    setIdRol,
    setNombreRol,
    setComunaId,           // <--- Añadido
    setCalleId,            // <--- Añadido
    setFamiliaId,          // <--- Añadido
    setValidado,           // <--- Añadido
    setMensaje,
    setAutorizar,
  } = acciones;

  const {
    cedula,
    nombre,
    nombreDos,
    apellido,
    apellidoDos,
    fechaNacimiento,
    genero,
    telefono,
    correo,
    claveUno,
    claveDos,
    rolId,                // <--- Añadido
    idRol,
    nombreRol,
    idUsuario,
    comunaId,
    calleId,
    familiaId,
    validado,             // <--- Añadido
    autorizar,
    mensaje,
  } = datosUsuario;

  const {
    validarCedula,
    setValidarCedula,
    validarNombre,
    setValidarNombre,
    validarApellido,
    setValidarApellido,
    validarCorreo,
    setValidarCorreo,
    validarClave,
    setValidarClave,
  } = validaciones;

  const handleCrearUsuario = async () => {
    try {
      const nuevoUsuario = {
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        claveUno: claveUno,
        claveDos: claveDos,
        id_rol: idRol,
        autorizar: autorizar,
        validado: idRol === 1 ? 1 : 2,
      };
      await dispatch(
        crearUsuario({
          nuevoUsuario: nuevoUsuario,
          notify: notify,
          cerrarModal: cerrarModal,
          setAccion: setAccion,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />

      <Modal
        isVisible={mostrarConfirmar}
        onClose={() => {
          dispatch(cerrarModal("confirmar"));
        }}
        titulo={"¿Crear este usuario?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Cedula" descripcion={cedula} />
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Apellido" descripcion={apellido} />
          <ModalDatos titulo="Correo" descripcion={correo} />
          <ModalDatos titulo="Clave" descripcion={claveUno} indice={1} />
          <ModalDatos
            titulo="Clave confirmar"
            descripcion={claveDos}
            indice={1}
          />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearUsuario}
          cancelar={() => {
            dispatch(cerrarModal("confirmar"));
            dispatch(abrirModal("crear"));
          }}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{
            cedula,
            nombre,
            apellido,
            correo,
            claveUno,
            claveDos,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
          setAccion("");
        }}
        titulo={
          accion === "cambiarRol"
            ? "¿Cambiar rol?"
            : "¿Actualizar este usuario?"
        }
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Usuario" descripcion={nombre} />

          {accion === "cambiarRol" && (
            <ModalDatos titulo="Rol" descripcion={nombreRol} />
          )}

          {accion === "cambiarRol" && (
            <SelectOpcion
              idOpcion={idRol}
              nombre={"Cambiar a"}
              handleChange={(e) => {
                cambiarSeleccionRol(e, setIdRol);
              }}
              opciones={roles}
              seleccione="Seleccione"
              setNombre={setNombreRol}
              indice={1}
            />
          )}
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={() => {
            if (accion === "cambiarRol") {
              dispatch(
                cambiarRolUsuario({
                  idRol: idRol,
                  idUsuario: idUsuario,
                  cerrarModal: cerrarModal,
                  notify: notify,
                  setAccion: setAccion,
                }),
              );
            }
          }}
          cancelar={() => {
            dispatch(cerrarModal("editar"));
            setAccion("");
          }}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{
            nombre,
          }}
        />
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
          setAccion("");
        }}
        titulo={"¿Crear usuario?"}
      >
        <ModalDatosContenedor>
          <FormCrearUsuario
            idRol={idRol}
            setIdRol={setIdRol}
            rolId={rolId}
            setRolId={setRolId}
            setNombreRol={setNombreRol}
            cedula={cedula}
            setCedula={setCedula}
            nombre={nombre}
            setNombre={setNombre}
            nombreDos={nombreDos}
            setNombreDos={setNombreDos}
            apellido={apellido}
            setApellido={setApellido}
            apellidoDos={apellidoDos}
            setApellidoDos={setApellidoDos}
            fn={fechaNacimiento}
            setFn={setFechaNacimiento}
            genero={genero}
            setGenero={setGenero}
            telefono={telefono}
            setTelefono={setTelefono}
            correo={correo}
            setCorreo={setCorreo}
            claveUno={claveUno}
            setClaveUno={setClaveUno}
            claveDos={claveDos}
            setClaveDos={setClaveDos}
            comunaId={comunaId}
            setComunaId={setComunaId}
            calleId={calleId}
            setCalleId={setCalleId}
            familiaId={familiaId}
            setFamiliaId={setFamiliaId}
            validado={idRol === 1 ? true : false}
            setValidado={setValidado}
            autorizar={autorizar}
            setAutorizar={setAutorizar}
            validarCedula={validarCedula}
            setValidarCedula={setValidarCedula}
            validarCorreo={validarCorreo}
            setValidarCorreo={setValidarCorreo}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
            validarApellido={validarApellido}
            setValidarApellido={setValidarApellido}
            validarClave={validarClave}
            setValidarClave={setValidarClave}
            mensaje={mensaje}
            setMensaje={setMensaje}
            roles={roles}
            calles={calles}
            usuarioActivo={usuarioActivo}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
