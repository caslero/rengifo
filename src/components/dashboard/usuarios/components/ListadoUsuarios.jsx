import { useDispatch } from "react-redux";
import Image from "next/image";

import SwitchToggle from "@/components/SwitchToggle";
import Button from "@/components/padres/Button";
import Div from "@/components/padres/Div";
import Span from "@/components/padres/Span";
import BloqueInfoUsuario from "@/components/dashboard/usuarios/components/BloqueInfoUsuario";

import { formatearFecha } from "@/utils/Fechas";
import { formatearCedula } from "@/utils/formatearCedula";

import { cambiarAccesoUsuario } from "@/store/features/usuarios/thunks/cambiarAccesoUsuario";
import { eliminarRestaurarUsuario } from "@/store/features/usuarios/thunks/eliminarRestaurarUsuario";

export default function ListadoUsuarios({
  usuario,
  abrirModal,
  setAccion,
  setNombreUsuario,
  setIdUsuario,
  setIdRol,
  setNombreRol,
}) {
  const dispatch = useDispatch();

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-2 text-black rounded-b-md">
      {/* Cédula */}
      <BloqueInfoUsuario
        indice={1}
        nombre={"Cédula"}
        valor={formatearCedula(usuario.cedula)}
      />

      {/* Nombre Completo */}
      <BloqueInfoUsuario
        indice={1}
        nombre={"Nombre Completo"}
        valor={`${usuario.nombre || ""} ${usuario.nombre_dos || ""} ${usuario.apellido || ""} ${usuario.apellido_dos || ""}`.trim()}
      />

      {/* Teléfono */}
      <BloqueInfoUsuario
        indice={1}
        nombre={"Teléfono"}
        valor={usuario.telefono || "No registrado"}
      />

      {/* Correo Electrónico */}
      <BloqueInfoUsuario
        indice={1}
        nombre={"Correo"}
        valor={usuario.correo || "Sin correo (Habitante)"}
      />

      {/* Fecha de Nacimiento y Género */}
      <BloqueInfoUsuario
        indice={1}
        nombre={"Fecha Nacimiento"}
        valor={usuario.f_n ? formatearFecha(usuario.f_n) : "No registrada"}
      />
      <BloqueInfoUsuario
        indice={1}
        nombre={"Género"}
        valor={usuario.genero ? "masculino" : "femenino"}
      />

      {/* Comuna */}
      <BloqueInfoUsuario
        indice={1}
        nombre={"Comuna"}
        valor={usuario.comuna?.nombre || "Sin comuna asignada"}
      />

      {/* Calle */}
      <BloqueInfoUsuario
        indice={1}
        nombre={"Calle"}
        valor={usuario.calle?.nombre || "Sin calle asignada"}
      />

      {/* Familia */}
      <BloqueInfoUsuario
        indice={1}
        nombre={"Familia"}
        valor={usuario.familia?.nombre || "Sin grupo familiar"}
      />

      {/* Rol y Botón de Cambiar Rol */}
      <Div className="flex items-center justify-between border-t pt-2 mt-1">
        <BloqueInfoUsuario
          indice={1}
          nombre={"Rol"}
          valor={
            usuario.roles?.nombre ||
            (usuario.rolId === 1
              ? "Administrador"
              : usuario.rolId === 2
                ? "Líder Comunitario"
                : usuario.rolId === 3
                  ? "Habitante"
                  : "Sin rol asignado")
          }
        />

        <Button
          title="Cambiar rol"
          onClick={() => {
            dispatch(abrirModal("editar"));
            setAccion("cambiarRol");
            setNombreUsuario(`${usuario.nombre} ${usuario.apellido}`);
            setIdRol("");
            setNombreRol(usuario.roles?.nombre || "");
            setIdUsuario(usuario.id);
          }}
          className="p-1 sm:px-4 sm:py-1 sm:min-w-28 rounded-md bg-[#082158] text-white shadow-md hover:scale-105 transition cursor-pointer flex items-center justify-center"
        >
          <Span className="hidden sm:block">Cambiar Rol</Span>
          <Div className="sm:hidden w-6 h-6 flex items-center justify-center">
            <Image
              width={24}
              height={20}
              src="/img/editar.png"
              alt="Imagen del botón editar"
            />
          </Div>
        </Button>
      </Div>

      {/* Estado (Activo / Inactivo) */}
      <Div className="flex items-center justify-between">
        <BloqueInfoUsuario
          indice={!usuario.borrado ? 3 : 2}
          nombre={"Estado"}
          valor={!usuario.borrado ? "Activo" : "Inactivo"}
        />

        <SwitchToggle
          checked={!usuario.borrado}
          onToggle={() => {
            dispatch(
              eliminarRestaurarUsuario({
                estado: usuario.borrado,
                id_usuario: usuario.id,
              }),
            );
          }}
        />
      </Div>

      {/* Autorización de Acceso (Validado) */}
      <Div className="flex items-center justify-between">
        <BloqueInfoUsuario
          indice={usuario.validado ? 3 : 2}
          nombre={"Autorizado"}
          valor={usuario.validado ? "Sí" : "No"}
        />

        <SwitchToggle
          checked={Boolean(usuario.validado)}
          onToggle={() => {
            dispatch(
              cambiarAccesoUsuario({
                validado: usuario.validado,
                idUsuario: usuario.id,
              }),
            );
          }}
        />
      </Div>

      {/* Fecha de Registro */}
      <BloqueInfoUsuario
        indice={1}
        nombre={"Registrado"}
        valor={formatearFecha(usuario.createdAt)}
      />
    </Div>
  );
}
