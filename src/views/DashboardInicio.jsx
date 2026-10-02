"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/app/context/AuthContext";

import Div from "@/components/padres/Div";
import HeaderUsuarios from "@/components/dashboard/Inicio/HeaderUsuarios";
import Main from "@/components/padres/Main";
import Footer from "@/components/Footer";
import InicioUsuarios from "@/components/dashboard/Inicio/InicioUsuarios";
import MenuLateralUsuario from "@/components/dashboard/Inicio/MenuLateralUsuarios";

export default function DashboardInicio() {
  const { screenSize } = useUser();

  const { usuarioActivo } = useSelector((state) => state.auth);

  const [vista, setVista] = useState("");

  const [abrirPanel, setAbrirPanel] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const userType = usuarioActivo?.rolId;

  useEffect(() => {
    if (screenSize?.width > 640) {
      setAbrirPanel(true);
    } else {
      setAbrirPanel(false);
    }
  }, [screenSize]);

  const cambiarRuta = (subRuta, nuevaVista, rolId) => {
    // Determinar la base de la ruta según el rolId
    let baseRuta = ""; // Por defecto, no hay ninguna ruta
    if (rolId === 1) {
      baseRuta = "/dashboard/administrador";
    } else if (rolId === 2) {
      baseRuta = "/dashboard/director";
    } else if (rolId === 3) {
      baseRuta = "/dashboard/empleados";
    } else {
      console.log("ID de rol inválido o no especificado.");
      return; // Detener si el rol no es válido
    }

    // Construir la ruta completa
    router.push(`${baseRuta}${subRuta ? `/${subRuta}` : ""}`, {
      shallow: true,
    });

    // Actualizar la vista
    setVista(nuevaVista);
  };

  const abrirDashboar = () => {
    setAbrirPanel(!abrirPanel);
  };

  return (
    <>
      {usuarioActivo && (
        <Div
          className={`flex flex-col justify-between ${
            abrirPanel ? "" : "container mx-auto px-2"
          } `}
        >
          <MenuLateralUsuario
            vista={vista}
            cambiarRuta={cambiarRuta}
            abrirPanel={abrirPanel}
          />

          <Div
            className={`grid min-h-dvh grid-rows-[auto_1fr_auto] gap-4 ${
              abrirPanel ? "ml-56 px-2 " : "ml-0"
            } transition-all duration-1000 ease-in-out`}
          >
            <HeaderUsuarios
              abrirDashboar={abrirDashboar}
              abrirPanel={abrirPanel}
              vista={vista}
              cambiarRuta={cambiarRuta}
              screenSize={screenSize}
            />

            <Main className="bg-[#faf5f8] rounded-md p-4 h-full overflow-hidden">
              <Div className="h-full overflow-y-auto no-scrollbar">
                <InicioUsuarios />
              </Div>
            </Main>

            <Footer />
          </Div>
        </Div>
      )}
    </>
  );
}

{
  /*
    <Main className={`bg-[#faf5f8] rounded-md p-4 h-full`}>
      <Div className={"h-[calc(100vh-200px)] overflow-y-auto no-scrollbar"}
        <InicioUsuarios />
      </Div>
    </Main>
  */
}
