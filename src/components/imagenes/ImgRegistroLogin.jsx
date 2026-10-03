import Titulos from "@/components/Titulos";

export default function ImgRegistroLogin({ indice }) {
  return (
    <div className="w-full flex items-center justify-between sm:justify-center gap-2">
      <img
        className="w-[100px] object-cover"
        src="/img/logo_comuna.png"
        alt="Logo cmz en el registro de usuario"
      />

      <Titulos
        indice={6}
        titulo={"Comuna Juan de Bolivar Villegas y Martinez"}
        className={`text-[#082158] !text-xl !hidden sm:!block uppercase text-center`}
      />

      <Titulos
        indice={6}
        titulo={
          indice === "usuario" ? "Registro de usuario" : "Entrar al sistema"
        }
        className={`text-[#082158] !text-xl sm:!hidden !block uppercase text-center`}
      />

      <img
        className="w-[100px] object-cover"
        src="/img/logo_comuna.png"
        alt="Logo snf que acompaña el registro de usuario"
      />
    </div>
  );
}
