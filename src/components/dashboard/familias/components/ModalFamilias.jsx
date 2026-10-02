"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearFamilia from "@/components/formularios/FormCrearFamilia";
import FormEditarFamilia from "@/components/formularios/FormEditarFamilia";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearFamilia } from "@/store/features/familias/thunks/crearFamilia";
import { actualizarFamilia } from "@/store/features/familias/thunks/actualizarFamilia";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchFamilias } from "@/store/features/familias/thunks/todasFamilias";

export default function ModalFamilias({
  acciones,
  datosFamilias,
  validaciones,
}) {
  const dispatch = useDispatch();

  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar,
  );
  const mostrarConfirmarCambios = useSelector(
    (state) => state.modal.modales.confirmarCambios,
  );
  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const {
    idFamilia,
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

  useEffect(() => {
    dispatch(fetchFamilias());
  }, [dispatch]);

  const notify = (msj) => toast(msj);

  const handleCrearFamilia = async () => {
    try {
      const nuevaFamilia = {
        nombre: nombre,
        codigo: codigo,
        descripcion: direccion,
        tipoVivienda: tipoVivienda,
        numero: numero,
        discapacidad: discapacidad,
        detallesDiscapacidad: detallesDiscapacidad,
        servicioAgua: servicioAgua,
        servicioLuz: servicioLuz,
        observacion: observacion,
        calle: { id: idCalle },
      };

      await dispatch(
        crearFamilia({
          nuevaFamilia: nuevaFamilia,
          notify: notify,
          cerrarModal: cerrarModal,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarFamilia = async () => {
    try {
      const updateFamilia = {
        nombre: nombre,
        numero: numero,
        descripcion: direccion,
        tipoVivienda: tipoVivienda,
        discapacidad: discapacidad,
        detallesDiscapacidad: detallesDiscapacidad,
        id_calle: idCalle,
      };

      await dispatch(
        actualizarFamilia({
          updateFamilia: updateFamilia,
          notify: notify,
          cerrarModal: cerrarModal,
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
        titulo={"¿Crear esta familia?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={direccion} />
          <ModalDatos titulo="Tipo de vivienda" descripcion={tipoVivienda} />
          <ModalDatos titulo="Número" descripcion={numero} />
          <ModalDatos titulo="Discapacidad" descripcion={discapacidad} />
          <ModalDatos
            titulo="Detalles de discapacidad"
            descripcion={detallesDiscapacidad}
          />
          <ModalDatos titulo="Servicio de agua" descripcion={servicioAgua} />
          <ModalDatos titulo="Servicio de luz" descripcion={servicioLuz} />
          <ModalDatos titulo="Observación" descripcion={observacion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearFamilia}
          cancelar={() => {
            dispatch(cerrarModal("confirmar"));
            dispatch(abrirModal("crear"));
          }}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{
            nombre,
            direccion,
            tipoVivienda,
            numero,
            servicioAgua,
            servicioLuz,
            observacion,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarConfirmarCambios}
        onClose={() => {
          dispatch(cerrarModal("confirmarCambios"));
        }}
        titulo={"¿Actualizar esta familia?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={direccion} />
          <ModalDatos titulo="Tipo de vivienda" descripcion={tipoVivienda} />
          <ModalDatos titulo="Número" descripcion={numero} />
          <ModalDatos titulo="Discapacidad" descripcion={discapacidad} />
          <ModalDatos
            titulo="Detalles de discapacidad"
            descripcion={detallesDiscapacidad}
          />
          <ModalDatos titulo="Servicio de agua" descripcion={servicioAgua} />
          <ModalDatos titulo="Servicio de luz" descripcion={servicioLuz} />
          <ModalDatos titulo="Observación" descripcion={observacion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarFamilia}
          cancelar={() => {
            dispatch(cerrarModal("confirmarCambios"));
            dispatch(abrirModal("editar"));
          }}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Guardar cambios"
          nombreDos="Cancelar"
          campos={{
            nombre,
            direccion,
            tipoVivienda,
            numero,
            servicioAgua,
            servicioLuz,
            observacion,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar esta familia?"}
      >
        <ModalDatosContenedor>
          <FormEditarFamilia
            acciones={acciones}
            datosFamilias={datosFamilias}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear familia?"}
      >
        <ModalDatosContenedor>
          <FormCrearFamilia
            acciones={acciones}
            datosFamilias={datosFamilias}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
