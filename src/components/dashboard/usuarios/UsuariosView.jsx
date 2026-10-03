"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import SectionMain from "@/components/SectionMain";
import SectionPrimary from "@/components/SectionPrimary";
import Div from "@/components/padres/Div";
import SectionTertiary from "@/components/SectionTertiary";
import ListadoUsuarios from "@/components/dashboard/usuarios/components/ListadoUsuarios";
import ButtonToggleDetallesUsuario from "@/components/dashboard/usuarios/components/ButtonToggleDetallesUsuario";
import LeyendaUsuarios from "@/components/dashboard/usuarios/components/LeyendaUsuarios";
import FichaUsuario from "@/components/dashboard/usuarios/components/FichaUsuario";
import ModalUsuarios from "@/components/dashboard/usuarios/components/ModalUsuarios";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { fetchUsuarios } from "@/store/features/usuarios/thunks/todosUsuarios";
import { abrirModal } from "@/store/features/modal/slicesModal";

export default function UsuariosView() {
  const dispatch = useDispatch();
  const { usuarios, loading } = useSelector((state) => state.usuarios);

  useEffect(() => {
    dispatch(fetchUsuarios());
  }, [dispatch]);

  // Identificación y Nombres
  const [cedulaUsuario, setCedulaUsuario] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [nombreDosUsuario, setNombreDosUsuario] = useState("");
  const [apellidoUsuario, setApellidoUsuario] = useState("");
  const [apellidoDosUsuario, setApellidoDosUsuario] = useState("");

  // Datos Personales y Contacto
  const [fechaNacimientoUsuario, setFechaNacimientoUsuario] = useState(""); // Formato YYYY-MM-DD
  const [generoUsuario, setGeneroUsuario] = useState(""); // "masculino", "femenino", etc.
  const [telefonoUsuario, setTelefonoUsuario] = useState("");
  const [correoUsuario, setCorreoUsuario] = useState("");

  // Credenciales de Acceso
  const [claveUnoUsuario, setClaveUnoUsuario] = useState("");
  const [claveDosUsuario, setClaveDosUsuario] = useState("");

  // Rol y Estado de Autorización
  const [rolIdUsuario, setRolIdUsuario] = useState(""); // 1: Admin, 2: Líder, 3: Habitante
  const [validadoUsuario, setValidadoUsuario] = useState(false); // 1 = Autorizado / True, 0 = No / False

  // Relaciones Comunitarias
  const [comunaIdUsuario, setComunaIdUsuario] = useState("");
  const [calleIdUsuario, setCalleIdUsuario] = useState("");
  const [familiaIdUsuario, setFamiliaIdUsuario] = useState(""); // Opcional (null si no aplica)

  const [idRol, setIdRol] = useState("");
  const [nombreRol, setNombreRol] = useState("");
  const [idUsuario, setIdUsuario] = useState("");

  const [expanded, setExpanded] = useState("");
  const [accion, setAccion] = useState("");

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [validarCedulaUsuario, setValidarCedulaUsuario] = useState(false);
  const [validarCorreoUsuario, setValidarCorreoUsuario] = useState(false);
  const [validarNombreUsuario, setValidarNombreUsuario] = useState(false);
  const [validarApellidoUsuario, setValidarApellidoUsuario] = useState(false);
  const [validarClaveUsuario, setValidarClaveUsuario] = useState(false);

  const [autorizar, setAutorizar] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  const camposBusqueda = ["cedula", "nombre", "apellido", "correo"];
  const opcionesOrden = [
    { id: "cedula", nombre: "Cédula" },
    { id: "correo", nombre: "Correo" },
    { id: "nombre", nombre: "Nombre" },
    { id: "apellido", nombre: "Apellido" },
  ];

  const usuariosFiltradosOrdenados = useMemo(() => {
    return filtrarOrdenar(
      usuarios,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda,
    );
  }, [usuarios, busqueda, ordenCampo, ordenDireccion]);

  const usuariosPaginados = useMemo(() => {
    return usuariosFiltradosOrdenados.slice(first, first + rows);
  }, [usuariosFiltradosOrdenados, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const acciones = {
    accion,
    setNombreRol,
    setIdRol: setIdRol,
    setCedula: setCedulaUsuario,
    setNombre: setNombreUsuario,
    setNombreDos: setNombreDosUsuario,
    setApellido: setApellidoUsuario,
    setApellidoDos: setApellidoDosUsuario,
    setFechaNacimiento: setFechaNacimientoUsuario,
    setGenero: setGeneroUsuario,
    setTelefono: setTelefonoUsuario,
    setCorreo: setCorreoUsuario,
    setClaveUno: setClaveUnoUsuario,
    setClaveDos: setClaveDosUsuario,
    setRolId: setRolIdUsuario,
    setComunaId: setComunaIdUsuario,
    setCalleId: setCalleIdUsuario,
    setFamiliaId: setFamiliaIdUsuario,
    setValidado: setValidadoUsuario,
    setAutorizar, // Mantenido para retrocompatibilidad
    setAccion,
  };

  const datosUsuario = {
    cedula: cedulaUsuario,
    nombre: nombreUsuario,
    nombre_dos: nombreDosUsuario,
    apellido: apellidoUsuario,
    apellido_dos: apellidoDosUsuario,
    f_n: fechaNacimientoUsuario,
    genero: generoUsuario,
    telefono: telefonoUsuario,
    correo: correoUsuario,
    claveUno: claveUnoUsuario,
    claveDos: claveDosUsuario,
    rolId: rolIdUsuario || idRol,
    idRol: idRol,
    nombreRol: nombreRol,
    comunaId: comunaIdUsuario,
    calleId: calleIdUsuario,
    familiaId: familiaIdUsuario,
    validado: validadoUsuario,
    autorizar: autorizar,
    idUsuario: idUsuario,
  };

  const validaciones = {
    validarCedula: validarCedulaUsuario,
    setValidarCedula: setValidarCedulaUsuario,
    validarNombre: validarNombreUsuario,
    setValidarNombre: setValidarNombreUsuario,
    validarApellido: validarApellidoUsuario,
    setValidarApellido: setValidarApellidoUsuario,
    validarCorreo: validarCorreoUsuario,
    setValidarCorreo: setValidarCorreoUsuario,
    validarClave: validarClaveUsuario,
    setValidarClave: setValidarClaveUsuario,
  };

  return (
    <>
      <ModalUsuarios
        acciones={acciones}
        datosUsuario={datosUsuario}
        validaciones={validaciones}
      />
      <SectionMain>
        {/* <SectionPrimary nombre={"Representación usuarios"}>
          <LeyendaUsuarios />
        </SectionPrimary> */}

        <SectionTertiary
          nombre={"Gestión usuarios"}
          first={first}
          setFirst={setFirst}
          rows={rows}
          setRows={setRows}
          datos={usuarios}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          ordenCampo={ordenCampo}
          setOrdenCampo={setOrdenCampo}
          ordenDireccion={ordenDireccion}
          setOrdenDireccion={setOrdenDireccion}
          opcionesOrden={opcionesOrden}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
          <Div className={`flex flex-col gap-2`}>
            {usuarios?.length === 0 && loading ? (
              <Loader titulo="Cargando usuarios..." />
            ) : (
              <>
                {usuariosPaginados?.length !== 0 ? (
                  usuariosPaginados.map((usuario, index) => {
                    return (
                      <FichaUsuario
                        key={usuario.id}
                        usuario={usuario}
                        index={index}
                      >
                        <ButtonToggleDetallesUsuario
                          expanded={expanded}
                          usuario={usuario}
                          setExpanded={setExpanded}
                        />

                        {expanded === usuario.id && (
                          <ListadoUsuarios
                            usuario={usuario}
                            abrirModal={abrirModal}
                            setAccion={setAccion}
                            setNombreUsuario={setNombreUsuario}
                            setIdUsuario={setIdUsuario}
                            setIdRol={setIdRol}
                            setNombreRol={setNombreRol}
                          />
                        )}
                      </FichaUsuario>
                    );
                  })
                ) : (
                  <EstadoMsjVacio dato={usuarios} loading={loading} />
                )}
              </>
            )}
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
