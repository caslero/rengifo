import { useDispatch } from "react-redux";
import Image from "next/image";

import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import Button from "@/components/padres/Button";
import Span from "@/components/padres/Span";
import BloqueInfo from "@/components/BloqueInfo";

import { formatearFecha } from "@/utils/Fechas";

import { eliminarRestaurarFamilia } from "@/store/features/familias/thunks/eliminarRestaurarFamilia";

export default function ListadoFamilia({ familia, editarFamilia }) {
  const dispatch = useDispatch();

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <Div className="flex items-center justify-between gap-2">
        <BloqueInfo indice={1} nombre={"Código"} valor={familia.codigo} />

        <Button
          title="Editar"
          onClick={() => {
            editarFamilia(familia);
          }}
          className="p-1 sm:px-4 sm:py-1 sm:min-w-28 rounded-md bg-[#082158]  text-white shadow-md hover:scale-105 transition cursor-pointer"
        >
          <Span className="hidden sm:block">Actualizar</Span>
          <Div className="sm:hidden w-6 h-6 flex items-center justify-center">
            <Image
              width={24}
              height={20}
              src="/img/editar.png"
              alt="Imagen del boton editar"
            />
          </Div>
        </Button>
      </Div>

      <BloqueInfo indice={1} nombre={"Calle"} valor={familia?.calle?.nombre} />

      <BloqueInfo indice={1} nombre={"Dirección"} valor={familia.direccion} />
      <BloqueInfo
        indice={1}
        nombre={"Tipo de vivienda"}
        valor={familia.tipoVivienda ?? "No especificado"}
      />
      <BloqueInfo indice={1} nombre={"Número"} valor={familia.numero} />
      <BloqueInfo
        indice={1}
        nombre={"Discapacidad"}
        valor={familia.discapacidad ? "Sí" : "No"}
      />
      <BloqueInfo
        indice={1}
        nombre={"Detalles de discapacidad"}
        valor={familia.detallesDiscapacidad ?? "No especificado"}
      />
      <BloqueInfo
        indice={1}
        nombre={"Servicio de agua"}
        valor={familia.servicioAgua ? "Sí" : "No"}
      />
      <BloqueInfo
        indice={1}
        nombre={"Electricidad"}
        valor={familia.electricidad ? "Sí" : "No"}
      />
      <BloqueInfo
        indice={1}
        nombre={"Observación"}
        valor={familia.observacion ?? "Sin observaciones"}
      />

      <Div className="flex items-center justify-between">
        <BloqueInfo
          indice={!familia.borrado ? 3 : 2}
          nombre={"familia"}
          valor={!familia.borrado ? "Activo" : "Inactivo"}
        />

        <SwitchToggle
          checked={!familia.borrado}
          onToggle={() => {
            dispatch(
              eliminarRestaurarFamilia({
                estado: familia.borrado,
                id_familia: familia.id,
              }),
            );
          }}
        />
      </Div>

      <BloqueInfo
        indice={1}
        nombre={"Creada"}
        valor={formatearFecha(familia.createdAt)}
      />
    </Div>
  );
}
