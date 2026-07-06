"use client"
import { cn } from "@/lib/utils";
import {
  CheckCheck,
  FileSearchCorner,
  FileX2,
  Icon,
  Inbox,
  RefreshCcwDot,
  SearchAlert,
  TimerReset,
} from "lucide-react";
export function Document({
  titulo,
  state,
}: {
  titulo: string;
  state: string;
}) {
  const ESTADOS_CONFIG = {
    neutral: {
      border: "hover:border-gray-400 hover:shadow-gray-400/20",
      div: "group-hover:bg-gray-400/30 bg-gray-400/80 border-gray-400/60 border-2 group-hover:border-gray-400",
      titulo: "group-hover:text-gray-500",
      line: "bg-gray-400",
      label: "Sin archivos",
      icon: <Inbox />,
    },
    pendiente: {
      border: "hover:border-blue-500 hover:shadow-blue-500/20",
      div: "group-hover:bg-blue-500/30 bg-blue-500/80 border-blue-500/60 border-2 group-hover:border-blue-500",
      titulo: "group-hover:text-blue-500",
      line: "bg-blue-500",
      label: "Pendiente (aún no completa)",
      icon: <TimerReset />,
    },
    en_revision: {
      border: "hover:border-amber-500 hover:shadow-amber-500/20",
      div: "group-hover:bg-amber-500/30 bg-amber-500/80 border-amber-500/60 border-2 group-hover:border-amber-500",
      titulo: "group-hover:text-amber-500",
      line: "bg-amber-500",
      label: "En revisión",
      icon: <FileSearchCorner />,
    },
    aprobado: {
      border: "hover:border-emerald-500 hover:shadow-emerald-500/20",
      div: "group-hover:bg-emerald-500/30 bg-emerald-500/80 border-emerald-500/60 border-2 group-hover:border-emerald-500",
      titulo: "group-hover:text-emerald-500",
      line: "bg-emerald-500",
      label: "Aprobado",
      icon: <CheckCheck />,
    },
    rechazado: {
      border: "hover:border-red-500 hover:shadow-red-500/20",
      div: "group-hover:bg-red-500/30 bg-red-500/80 border-red-500/60 border-2 group-hover:border-red-500",
      titulo: "group-hover:text-red-500",
      line: "bg-red-500",
      label: "Rechazado",
      icon: <FileX2 />,
    },
    correcciones: {
      border: "hover:border-orange-500 hover:shadow-orange-500/20",
      div: "group-hover:bg-orange-500/30 bg-orange-500/80 border-orange-500/60 border-2 group-hover:border-orange-500",
      titulo: "group-hover:text-orange-500",
      line: "bg-orange-500",
      label: "Requiere correcciones",
      icon: <SearchAlert />,
    },
  };

  function Card({ data }: { data: any }) {
    
    return (
      <div className="flex flex-wrap gap-6 justify-center items-center">
        <label className="text-gray-400 cursor-pointer" onClick={()=> alert(data.label)}>
          <input type="checkbox" className="hidden peer" />
          <div
            className={cn(
              "group flex flex-col gap-4 w-32 h-40 bg-linear-to-b from-gray-800 to-gray-900 rounded-2xl p-4 shadow-xl border-2 border-transparent transition-all duration-300 ease-in-out",
              data.border,
            )}
          >
            <div className="relative items-center justify-center flex">
              <div
                className={cn(
                  "p-2 relative flex h-14 w-12 cursor-pointer flex-col items-center justify-center rounded-lg shadow-md transition-all",
                  data.div,
                )}
              >
                <span className="text-xs font-bold text-white tracking-wider mt-1 group-hover:text-white/90">
                  {data.icon}
                </span>
              </div>
            </div>
            <div className="text-center">
              <p
                className={cn(
                  "font-medium text-sm  transition-colors duration-300",
                  data.titulo,
                )}
              >
                {titulo}
              </p>
              <p className="text-xs mt-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                {data.state === "sin_consignar" ? "agregar": "enviado"}
              </p>

              <div
                className={cn(
                  "h-1 w-0 rounded-full mx-auto group-hover:w-full transition-all duration-300 mt-3",
                  data.line,
                )}
              ></div>
            </div>
          </div>
        </label>
      </div>
    );
  }
  if (state === "entregado") {
    return <Card data={ESTADOS_CONFIG.en_revision} />;
  }
  if (state === "aprobado") {
    return <Card data={ESTADOS_CONFIG.aprobado} />;
  }
  if (state === "rechazado") {
    return <Card data={ESTADOS_CONFIG.rechazado} />;
  }
  if (state === "sin_consignar") {
    return <Card data={ESTADOS_CONFIG.neutral} />;
  }
}

export default { Document };
