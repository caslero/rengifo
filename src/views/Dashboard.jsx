"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/app/context/AuthContext";

import Div from "@/components/padres/Div";
import MenuLateralUsuario from "@/components/dashboard/Inicio/MenuLateralUsuarios";
import HeaderUsuarios from "@/components/dashboard/Inicio/HeaderUsuarios";
import Main from "@/components/padres/Main";
import Footer from "@/components/Footer";

//import MostrarPerfilUsuario from "./MostrarPerfilUsuario";
//import MostrarCambiarClaveUsuario from "./MostrarCambiarClaveUsuario";

// import ConsejoForm from "../opciones/ConsejoForm";
// import VoceroForm from "../opciones/VoceroForm";
// //import MostrarAlInicioUsuarios from "./MostrarInicioUsuarios";
// import ParticipantesForm from "../opciones/ParticipantesForm";
// import DepartamentosForm from "../opciones/DepartamentosForm";
// import EstadosForm from "../opciones/EstadoForm";
// import MunicipiosForm from "../opciones/MunicipioForm";
// import InstitucionesForm from "../opciones/InstitucionesForm";
//import NovedadesForm from "../opciones/NovedadesForm";

import UsuariosView from "@/components/dashboard/usuarios/UsuariosView";
//import ComunasView from "@/components/dashboard/comunas/ComunasView";
//import VocerosView from "@/components/dashboard/voceros/VocerosView";
import PerfilView from "@/components/dashboard/perfil/PerfilView";
import CambiarClaveView from "@/components/dashboard/cambiar-clave/CambiarClaveView";
import CallesView from "@/components/dashboard/calles/CallesView";
import FamiliasView from "@/components/dashboard/familias/FamiliasView";

export default function Dashboard() {
  const { screenSize } = useUser();

  const { usuarioActivo, departamento } = useSelector((state) => state.auth);

  const [vista, setVista] = useState("");
  const [abrirPanel, setAbrirPanel] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const userType = usuarioActivo?.rolId;

  useEffect(() => {
    if (!usuarioActivo?.validado) {
      router.push(`/`, { shallow: true });
    }
  }, [usuarioActivo]);

  useEffect(() => {
    if (screenSize?.width > 640) {
      setAbrirPanel(true);
    } else {
      setAbrirPanel(false);
    }
  }, [screenSize]);

  // **Sincronizar URL antes de la vista**
  useEffect(() => {
    const subRuta = pathname.split("/").pop();

    if (
      !subRuta ||
      ["empleados", "director", "administrador"].includes(subRuta)
    ) {
      if (vista !== "inicio") {
        router.push(`/dashboard/${subRuta || "empleados"}`, { shallow: true });
        setVista("inicio");
      }
    } else if (vista !== subRuta) {
      router.push(`/dashboard/${pathname.split("/")[2]}/${subRuta}`, {
        shallow: true,
      });
      setVista(subRuta);
    }
  }, [pathname]);

  // **Función para cambiar la ruta correctamente**
  const cambiarRuta = (subRuta, nuevaVista, id_rol) => {
    let baseRuta = [
      null,
      "/dashboard/administrador",
      "/dashboard/director",
      "/dashboard/empleados",
    ][id_rol];

    if (!baseRuta) {
      console.error("ID de rol inválido o no especificado.");
      return;
    }

    // **Primero cambiar la URL**
    router.push(`${baseRuta}/${subRuta || "inicio"}`, { shallow: true });

    // **Luego actualizar la vista después de que la URL cambie**
    setTimeout(() => {
      setVista(nuevaVista);
    }, 3000);
  };

  const abrirDashboar = () => setAbrirPanel(!abrirPanel);

  return (
    <>
      {usuarioActivo && (
        <Div
          className={`flex flex-col ${
            abrirPanel ? "" : "container mx-auto px-2"
          }`}
        >
          <MenuLateralUsuario
            vista={vista}
            cambiarRuta={cambiarRuta}
            abrirPanel={abrirPanel}
          />

          <Div
            className={`grid min-h-dvh grid-rows-[auto_1fr_auto] space-y-3 ${
              abrirPanel ? "ml-56 px-2" : "ml-0"
            } transition-all duration-500 ease-in-out`}
          >
            <HeaderUsuarios
              abrirDashboar={abrirDashboar}
              abrirPanel={abrirPanel}
              vista={vista}
              cambiarRuta={cambiarRuta}
              screenSize={screenSize}
            />

            <Main className="bg-[#faf5f8] rounded-md">
              {vista === "usuarios" && <UsuariosView />}

              {vista === "calles" && <CallesView />}

               {vista === "familias" && <FamiliasView />} 

              {vista === "perfil" && <PerfilView />}

              {vista === "cambiar-clave" && <CambiarClaveView />}
            </Main>

            <Footer />
          </Div>
        </Div>
      )}
    </>
  );
}
