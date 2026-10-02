import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "../AgruparCamposForm";
import InputNombre from "@/components/inputs/InputNombre";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import Input from "@/components/inputs/Input";
import LabelInput from "@/components/inputs/LabelInput";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

function CampoTexto({ id, nombre, value, setValue, type = "text" }) {
  return (
    <LabelInput htmlFor={id} nombre={nombre}>
      <Input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoComplete="off"
      />
    </LabelInput>
  );
}

function CampoBooleano({ id, nombre, value, setValue }) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 text-[#364153] font-medium"
    >
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={value}
        onChange={(event) => setValue(event.target.checked)}
        className="h-4 w-4 accent-[#082158]"
      />
      {nombre}
    </label>
  );
}

export default function FormCrearFamilia({
  acciones,
  datosFamilias,
  validaciones,
}) {
  const dispatch = useDispatch();

  const mostrarCrear = useSelector((state) => state.modal.modales.crear);
  const calles = useSelector((state) => state.calles.calles);

  const {
    setIdCalle,
    setNombre,
    setCodigo,
    setDireccion,
    setTipoVivienda,
    setNumero,
    setDiscapacidad,
    setDetallesDiscapacidad,
    setServicioAgua,
    setServicioLuz,
    setObservacion,
  } = acciones;

  const {
    idCalle,
    nombre,
    codigo,
    direccion,
    tipoVivienda,
    numero,
    discapacidad,
    detallesDiscapacidad,
    servicioAgua,
    servicioLuz,
    observacion,
  } = datosFamilias;

  const { validarNombre, setValidarNombre } = validaciones;

  useEffect(() => {
    if (mostrarCrear) {
      setIdCalle("");
      setNombre("");
      setCodigo("");
      setDireccion("");
      setTipoVivienda("");
      setNumero("");
      setDiscapacidad(false);
      setDetallesDiscapacidad("");
      setServicioAgua(false);
      setServicioLuz(false);
      setObservacion("");
      setValidarNombre(false);
    }
  }, [mostrarCrear]);

  const limpiarCampos = () => {
    setIdCalle("");
    setNombre("");
    setCodigo("");
    setDireccion("");
    setTipoVivienda("");
    setNumero("");
    setDiscapacidad(false);
    setDetallesDiscapacidad("");
    setServicioAgua(false);
    setServicioLuz(false);
    setObservacion("");
    setValidarNombre(false);
  };

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col"
    >
      <DivScroll>
        <LabelInput htmlFor="idCalle" nombre="Calle">
          <select
            id="idCalle"
            name="idCalle"
            value={idCalle}
            onChange={(event) =>
              setIdCalle(event.target.value ? Number(event.target.value) : "")
            }
            className="block w-full rounded-md p-2 shadow-sm outline outline-1 outline-[#d1d5dc] transition-all hover:outline-[#082158] focus:outline-[#082158]"
          >
            <option value="">Selecciona una calle</option>
            {calles.map((calle) => (
              <option key={calle.id} value={calle.id}>
                {calle.nombre}
                {calle.numero ? ` - ${calle.numero}` : ""}
              </option>
            ))}
          </select>
        </LabelInput>

        <InputNombre
          value={nombre}
          setValue={setNombre}
          validarNombre={validarNombre}
          setValidarNombre={setValidarNombre}
        />

        <CampoTexto
          id="codigo"
          nombre="Código"
          value={codigo}
          setValue={setCodigo}
        />

        <CampoTexto
          id="numero"
          nombre="Número"
          value={numero}
          setValue={setNumero}
        />

        <InputDescripcion
          htmlFor="direccion"
          nombre="Dirección"
          value={direccion}
          setValue={setDireccion}
          row={3}
          max={500}
          autoComplete="off"
        />

        <CampoTexto
          id="tipoVivienda"
          nombre="Tipo de vivienda"
          value={tipoVivienda}
          setValue={setTipoVivienda}
        />

        <CampoBooleano
          id="discapacidad"
          nombre="¿Hay personas con discapacidad?"
          value={discapacidad}
          setValue={setDiscapacidad}
        />

        <InputDescripcion
          htmlFor="detallesDiscapacidad"
          nombre="Detalles de discapacidad"
          value={detallesDiscapacidad}
          setValue={setDetallesDiscapacidad}
          row={3}
          max={500}
          autoComplete="off"
        />

        <CampoBooleano
          id="servicioAgua"
          nombre="¿Tiene servicio de agua?"
          value={servicioAgua}
          setValue={setServicioAgua}
        />

        <CampoBooleano
          id="servicioLuz"
          nombre="¿Tiene servicio de luz?"
          value={servicioLuz}
          setValue={setServicioLuz}
        />

        <InputDescripcion
          htmlFor="observacion"
          nombre="Observación"
          value={observacion}
          setValue={setObservacion}
          row={3}
          max={500}
          autoComplete="off"
        />

        <AgruparCamposForm>
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={() => {
              dispatch(cerrarModal("crear"));
              dispatch(abrirModal("confirmar"));
            }}
            nombre={"Crear"}
            campos={{
              idCalle,
              nombre,
              codigo,
              direccion,
              tipoVivienda,
              numero,
              servicioAgua,
              servicioLuz,
              observacion,
            }}
          />

          <BotonLimpiarCampos
            aceptar={limpiarCampos}
            campos={{
              idCalle,
              nombre,
              codigo,
              direccion,
              tipoVivienda,
              numero,
              discapacidad,
              detallesDiscapacidad,
              servicioAgua,
              servicioLuz,
              observacion,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
