"use client"; // Agrega esta línea si estás usando Next.js App Router

import { useState, useEffect } from "react";

export default function Footer() {
  const [hora, setHora] = useState(null);

  useEffect(() => {
    // Función para actualizar la hora local
    const actualizarReloj = () => {
      const ahora = new Date();
      setHora(
        ahora.toLocaleTimeString("es-VE", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    };

    actualizarReloj();
    const intervalo = setInterval(actualizarReloj, 1000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <footer className="bg-[#faf5f8] rounded-md px-6 py-3 min-h-20 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-700 text-xs sm:text-sm font-medium border border-pink-100/50 shadow-sm">
      {/* Copyright */}
      <div className="flex items-center gap-1">
        <span>© {new Date().getFullYear()}</span>
        <span className="font-semibold text-slate-800">
          Comuna Juan de Bolívar
        </span>
        <span>• Todos los derechos reservados</span>
      </div>

      {/* Reloj en tiempo real */}
      <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-pink-200/60 shadow-inner">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-mono font-bold text-slate-800 tracking-wider">
          {hora || "--:--:-- --"}
        </span>
      </div>
    </footer>
  );
}

// export default function Footer() {
//   return (
//     <footer className={`bg-[#faf5f8] rounded-md px-4 h-20`}>
//       <div className="bg-[#faf5f8] rounded-md w-full h-full font-semibold flex items-center justify-center">
//         Este es un pie de pagina
//       </div>
//     </footer>
//   );
// }
