"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import BotonesModal from "@/components/botones/BotonesModal";
import FormCrearCalle from "@/components/formularios/FormCrearCalle";
import FormEditarCalle from "@/components/formularios/FormEditarCalle";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import ModalPrincipal from "@/components/modales/ModalPrincipal";

import { crearCalle } from "@/store/features/calles/thunks/crearCalle";
import { actualizarCalle } from "@/store/features/calles/thunks/actualizarCalle";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchCalles } from "@/store/features/calles/thunks/todasCalles";

export default function ModalCalles({ acciones, datosCalles, validaciones }) {
  const dispatch = useDispatch();

  const mostrarConfirmar = useSelector(
    (state) => state.modal.modales.confirmar,
  );
  const mostrarConfirmarCambios = useSelector(
    (state) => state.modal.modales.confirmarCambios,
  );
  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const mostrarCrear = useSelector((state) => state.modal.modales.crear);

  const { idCalle, nombre, numero, descripcion } = datosCalles;

  useEffect(() => {
    dispatch(fetchCalles());
  }, [dispatch]);

  const notify = (msj) => toast(msj);

  const handleCrearCalle = async () => {
    try {
      const nuevaCalle = {
        nombre: nombre,
        numero: Number(numero),
        descripcion: descripcion,
        comuna: { id: 1 },
      };

      await dispatch(
        crearCalle({
          nuevaCalle: nuevaCalle,
          notify: notify,
          cerrarModal: cerrarModal,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarCalle = async () => {
    try {
      const updateCalle = {
        nombre: nombre,
        numero: numero,
        descripcion: descripcion,
        id_calle: idCalle,
      };

      await dispatch(
        actualizarCalle({
          updateCalle: updateCalle,
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
        titulo={"¿Crear esta calle?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleCrearCalle}
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
            descripcion,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarConfirmarCambios}
        onClose={() => {
          dispatch(cerrarModal("confirmarCambios"));
        }}
        titulo={"¿Actualizar esta calle?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo="Nombre" descripcion={nombre} />
          <ModalDatos titulo="Descripción" descripcion={descripcion} />
        </ModalDatosContenedor>

        <BotonesModal
          aceptar={handleEditarCalle}
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
            descripcion,
            idCalle,
          }}
        />
      </Modal>

      <Modal
        isVisible={mostrarEditar}
        onClose={() => {
          dispatch(cerrarModal("editar"));
        }}
        titulo={"¿Actualizar esta calle?"}
      >
        <ModalDatosContenedor>
          <FormEditarCalle
            acciones={acciones}
            datosCalles={datosCalles}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </Modal>

      <ModalPrincipal
        isVisible={mostrarCrear}
        onClose={() => {
          dispatch(cerrarModal("crear"));
        }}
        titulo={"¿Crear cargo?"}
      >
        <ModalDatosContenedor>
          <FormCrearCalle
            acciones={acciones}
            datosCalles={datosCalles}
            validaciones={validaciones}
          />
        </ModalDatosContenedor>
      </ModalPrincipal>
    </>
  );
}
