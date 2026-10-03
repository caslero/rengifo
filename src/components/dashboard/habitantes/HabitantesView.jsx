"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import FichaDetalles from "@/components/FichaDetalles";
import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";
import ListadoHabitantes from "@/components/dashboard/habitantes/components/ListadoHabitantes";
import ModalHabitantes from "@/components/dashboard/habitantes/components/ModalHabitantes";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchFamilias } from "@/store/features/familias/thunks/todasFamilias";

export default function HabitantesView() {
  const dispatch = useDispatch();
  const { familias, loading } = useSelector((state) => state.familias);

  useEffect(() => {
    dispatch(fetchFamilias());
  }, [dispatch]);

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

  const [validarCedulaUsuario, setValidarCedulaUsuario] = useState(false);
  const [validarCorreoUsuario, setValidarCorreoUsuario] = useState(false);
  const [validarNombreUsuario, setValidarNombreUsuario] = useState(false);
  const [validarApellidoUsuario, setValidarApellidoUsuario] = useState(false);
  const [validarClaveUsuario, setValidarClaveUsuario] = useState(false);

  const [idFamilia, setIdFamilia] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreFamilia, setValidarNombreFamilia] = useState(false);

  const [nombreCalle, setNombreCalle] = useState("");

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenDireccion, setOrdenDireccion] = useState("asc");

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [{ id: "nombre", nombre: "Nombre" }];

  const acciones = {
    setIdFamilia: setIdFamilia,
    setNombreCalle: setNombreCalle,
    setValidarNombreFamilia: setValidarNombreFamilia,
    setNombreUsuario: setNombreUsuario,
    setNombreDosUsuario: setNombreDosUsuario,
    setApellidoUsuario: setApellidoUsuario,
    setApellidoDosUsuario: setApellidoDosUsuario,
    setFechaNacimientoUsuario: setFechaNacimientoUsuario,
    setGeneroUsuario: setGeneroUsuario,
    setTelefonoUsuario: setTelefonoUsuario,
    setCorreoUsuario: setCorreoUsuario,
    setClaveUnoUsuario: setClaveUnoUsuario,
    setClaveDosUsuario: setClaveDosUsuario,
    setRolIdUsuario: setRolIdUsuario,
    setValidadoUsuario: setValidadoUsuario,
    setComunaIdUsuario: setComunaIdUsuario,
    setCalleIdUsuario: setCalleIdUsuario,
    setFamiliaIdUsuario: setFamiliaIdUsuario,
    setIdRol: setIdRol,
    setNombreRol: setNombreRol,
    setIdUsuario: setIdUsuario,
  };

  const datosFamilias = {
    idFamilia: idFamilia,
    nombreCalle: nombreCalle,
    nombreUsuario: nombreUsuario,
    nombreDosUsuario: nombreDosUsuario,
    apellidoUsuario: apellidoUsuario,
    apellidoDosUsuario: apellidoDosUsuario,
    fechaNacimientoUsuario: fechaNacimientoUsuario,
    generoUsuario: generoUsuario,
    telefonoUsuario: telefonoUsuario,
    correoUsuario: correoUsuario,
    claveUnoUsuario: claveUnoUsuario,
    claveDosUsuario: claveDosUsuario,
    rolIdUsuario: rolIdUsuario,
    comunaIdUsuario: comunaIdUsuario,
    calleIdUsuario: calleIdUsuario,
    familiaIdUsuario: familiaIdUsuario,
  };

  const validaciones = {
    validarNombre: validarNombreFamilia,
    validadoUsuario: validadoUsuario,
    setValidarNombre: setValidarNombreFamilia,
    setValidarCedulaUsuario: setValidarCedulaUsuario,
    setValidarCorreoUsuario: setValidarCorreoUsuario,
    setValidarNombreUsuario: setValidarNombreUsuario,
    setValidarApellidoUsuario: setValidarApellidoUsuario,
    setValidarClaveUsuario: setValidarClaveUsuario,
  };

  const familiasFiltradasOrdenadas = useMemo(() => {
    return filtrarOrdenar(
      familias,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda,
    );
  }, [familias, busqueda, ordenCampo, ordenDireccion]);

  const familiasPaginadas = useMemo(() => {
    return familiasFiltradasOrdenadas.slice(first, first + rows);
  }, [familiasFiltradasOrdenadas, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarFamilia = (familia) => {
    setIdFamilia(familia.id);
    setNombreFamilia(familia.nombre);
    setDireccionFamilia(familia.direccion);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalHabitantes
        acciones={acciones}
        datosFamilias={datosFamilias}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión Familias"}
          first={first}
          setFirst={setFirst}
          rows={rows}
          setRows={setRows}
          datos={familias}
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
            {familias?.length === 0 && loading ? (
              <Loader titulo="Cargando familias..." />
            ) : (
              <>
                {familiasPaginadas?.length !== 0 ? (
                  familiasPaginadas.map((familia, index) => {
                    return (
                      <FichaDetalles
                        key={familia.id}
                        dato={familia}
                        index={index}
                      >
                        <ButtonToggleDetalles
                          expanded={expanded}
                          dato={familia}
                          setExpanded={setExpanded}
                        />

                        {expanded === familia.id && (
                          <ListadoHabitantes
                            familia={familia}
                            editarFamilia={editarFamilia}
                          />
                        )}
                      </FichaDetalles>
                    );
                  })
                ) : (
                  <EstadoMsjVacio dato={familias} loading={loading} />
                )}
              </>
            )}
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
