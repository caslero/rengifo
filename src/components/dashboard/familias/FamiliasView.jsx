"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import FichaDetalles from "@/components/FichaDetalles";
import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";
import ListadoFamilias from "@/components/dashboard/familias/components/ListadoFamilias";
import ModalFamilias from "@/components/dashboard/familias/components/ModalFamilias";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchFamilias } from "@/store/features/familias/thunks/todasFamilias";
import { fetchCalles } from "@/store/features/calles/thunks/todasCalles";

export default function FamiliasView() {
  const dispatch = useDispatch();
  const { familias, loading } = useSelector((state) => state.familias);

  useEffect(() => {
    dispatch(fetchFamilias());
    dispatch(fetchCalles());
  }, [dispatch]);

  const [nombreFamilia, setNombreFamilia] = useState("");
  const [direccionFamilia, setDireccionFamilia] = useState("");
  const [codigoFamilia, setCodigoFamilia] = useState("");
  const [tipoVivienda, setTipoVivienda] = useState("");
  const [numeroFamilia, setNumeroFamilia] = useState("");
  const [idCalleFamilia, setIdCalleFamilia] = useState("");
  const [discapacidadFamilia, setDiscapacidadFamilia] = useState(false);
  const [detallesDiscapacidadFamilia, setDetallesDiscapacidadFamilia] =
    useState("");
  const [servicioAguaFamilia, setServicioAguaFamilia] = useState(false);
  const [servicioLuzFamilia, setServicioLuzFamilia] = useState(false);
  const [observacionFamilia, setObservacionFamilia] = useState("");

  const [idFamilia, setIdFamilia] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreFamilia, setValidarNombreFamilia] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenDireccion, setOrdenDireccion] = useState("asc");

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [{ id: "nombre", nombre: "Nombre" }];

  const acciones = {
    setIdFamilia: setIdFamilia,
    setIdCalle: setIdCalleFamilia,
    setNombre: setNombreFamilia,
    setCodigo: setCodigoFamilia,
    setDireccion: setDireccionFamilia,
    setTipoVivienda: setTipoVivienda,
    setNumero: setNumeroFamilia,
    setDiscapacidad: setDiscapacidadFamilia,
    setDetallesDiscapacidad: setDetallesDiscapacidadFamilia,
    setServicioAgua: setServicioAguaFamilia,
    setServicioLuz: setServicioLuzFamilia,
    setObservacion: setObservacionFamilia,
  };

  const datosFamilias = {
    idFamilia: idFamilia,
    idCalle: idCalleFamilia,
    nombre: nombreFamilia,
    codigo: codigoFamilia,
    direccion: direccionFamilia,
    tipoVivienda: tipoVivienda,
    numero: numeroFamilia,
    discapacidad: discapacidadFamilia,
    detallesDiscapacidad: detallesDiscapacidadFamilia,
    servicioAgua: servicioAguaFamilia,
    servicioLuz: servicioLuzFamilia,
    observacion: observacionFamilia,
  };

  const validaciones = {
    validarNombre: validarNombreFamilia,
    setValidarNombre: setValidarNombreFamilia,
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
      <ModalFamilias
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
                          <ListadoFamilias
                            calle={calle}
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
