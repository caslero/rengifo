import { useEffect } from "react";
import { useSelector } from "react-redux";

import Div from "@/components/padres/Div";
import Section from "@/components/padres/Section";
import P from "@/components/padres/P";
import EnlacesBarraLateral from "@/components/dashboard/Inicio/EnlacesBarraLateral";

export default function MenuLateralUsuario({ abrirPanel, cambiarRuta, vista }) {
  const { usuarioActivo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (abrirPanel) {
      setTimeout(() => {
        // Buscar el botón activo por la clase que usa cuando está seleccionado
        const activo = document.querySelector(".bg-\\[\\#E61C45\\]");
        if (activo) {
          activo.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    }
  }, [abrirPanel, vista]);

  return (
    <Div
      className={`fixed inset-y-0 left-0 w-56 z-30 transform ${
        abrirPanel ? "translate-x-0" : "-translate-x-full"
      } ${
        abrirPanel ? "pointer-events-auto" : "pointer-events-none"
      } transition-transform duration-500 ease-in-out`}
    >
      <Section
        className={`w-full h-full py-2 px-4 ${
          abrirPanel ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500 ease-in-out`}
      >
        <Div className="">
          <Div className="flex flex-col">
            <Div className="py-1 flex flex-col justify-center items-center">
              <Div className="flex flex-col items-center p-1 border border-[#ffffff] rounded-full">
                <img
                  className="w-full p-2 h-16"
                  src="/img/logo_comuna.png"
                  alt="Logo en la barra lateral izquierda"
                />
              </Div>
              <P className="text-[#ffffff] text-center fuente-arial-black text-xs shadow-lg">
                Comuna Juan de Bolivar Villegas y Martinez
              </P>
            </Div>

            <Div className="mt-2 flex flex-col gap-2 overflow-y-auto h-[calc(100vh-255px)] no-scrollbar">
              <EnlacesBarraLateral
                id_rol={usuarioActivo.rolId}
                cambiarRuta={cambiarRuta}
                vista={vista}
                vistaActual={"inicio"}
                nombre={"Inicio"}
              />

              {usuarioActivo.rolId === 1 && (
                <>
                  <EnlacesBarraLateral
                    id_rol={usuarioActivo.rolId}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"usuarios"}
                    nombre={"Usuarios"}
                  />

                  <EnlacesBarraLateral
                    id_rol={usuarioActivo.rolId}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"calles"}
                    nombre={"Calles"}
                  />
                </>
              )}

              {usuarioActivo.rolId === 2 && (
                <>
                  <EnlacesBarraLateral
                    id_rol={usuarioActivo.rolId}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"familias"}
                    nombre={"Familias"}
                  />
                </>
              )}
            </Div>

            <Div>
              <img
                className="w-full h-32 opacity-50"
                src="/img/busqueda.png"
                alt="Imagen de busqueda"
              />
            </Div>
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
