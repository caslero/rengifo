"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import FichaDetalles from "@/components/FichaDetalles";
import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";
import ListadoCalles from "@/components/dashboard/calles/components/ListadoCalles";
import ModalCalles from "@/components/dashboard/calles/components/ModalCalles";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchCalles } from "@/store/features/calles/thunks/todasCalles";

export default function CallesView() {
  const dispatch = useDispatch();
  const { calles, loading } = useSelector((state) => state.calles);

  useEffect(() => {
    dispatch(fetchCalles());
  }, [dispatch]);

  const [nombreCalle, setNombreCalle] = useState("");
  const [descripcionCalle, setDescripcionCalle] = useState("");
  const [numeroCalle, setNumeroCalle] = useState("");

  const [idCalle, setIdCalle] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreCalle, setValidarNombreCalle] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenDireccion, setOrdenDireccion] = useState("asc");

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [{ id: "nombre", nombre: "Nombre" }];

  const acciones = {
    setIdCalle: setIdCalle,
    setNombre: setNombreCalle,
    setNumero: setNumeroCalle,
    setDescripcion: setDescripcionCalle,
  };

  const datosCalles = {
    idCalle: idCalle,
    nombre: nombreCalle,
    numero: numeroCalle,
    descripcion: descripcionCalle,
  };

  const validaciones = {
    validarNombre: validarNombreCalle,
    setValidarNombre: setValidarNombreCalle,
  };

  const callesFiltradasOrdenadas = useMemo(() => {
    return filtrarOrdenar(
      calles,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda,
    );
  }, [calles, busqueda, ordenCampo, ordenDireccion]);

  const callesPaginadas = useMemo(() => {
    return callesFiltradasOrdenadas.slice(first, first + rows);
  }, [callesFiltradasOrdenadas, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarCalle = (calle) => {
    setIdCalle(calle.id);
    setNombreCalle(calle.nombre);
    setDescripcionCalle(calle.descripcion);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalCalles
        acciones={acciones}
        datosCalles={datosCalles}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión Calles"}
          first={first}
          setFirst={setFirst}
          rows={rows}
          setRows={setRows}
          datos={calles}
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
            {calles?.length === 0 && loading ? (
              <Loader titulo="Cargando calles..." />
            ) : (
              <>
                {callesPaginadas?.length !== 0 ? (
                  callesPaginadas.map((calle, index) => {
                    return (
                      <FichaDetalles key={calle.id} dato={calle} index={index}>
                        <ButtonToggleDetalles
                          expanded={expanded}
                          dato={calle}
                          setExpanded={setExpanded}
                        />

                        {expanded === calle.id && (
                          <ListadoCalles
                            calle={calle}
                            editarCalle={editarCalle}
                          />
                        )}
                      </FichaDetalles>
                    );
                  })
                ) : (
                  <EstadoMsjVacio dato={calles} loading={loading} />
                )}
              </>
            )}
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
