"use client"
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CircleCheckBig } from "lucide-react";
import React from "react";

const dataFaqs = [
  {
    pregunta: "¿Cómo inicio mi proceso de inscripción?",
    respuesta:
      "Solo debes crear una cuenta con tu correo electrónico, seleccionar el programa al que deseas postular y seguir los pasos del portal.",
    className: "p-0 m-0",
  },
  {
    pregunta: "¿Qué tipos de documentos puedo subir?",
    respuesta:
      "La plataforma acepta archivos en formato PDF, JPG y PNG. Cada requisito indica el formato recomendado y el tamaño máximo permitido.",
  },
  {
    pregunta: "¿Cómo sé si mis documentos fueron aprobados?",
    respuesta:
      "El sistema te notificará en tiempo real cuando un documento sea aprobado, observado o necesite corrección. También puedes revisar tu checklist en el portal.",
  },
  {
    pregunta: "¿Qué hago si un documento es observado?",
    respuesta:
      "En tu panel verás el motivo de la observación y podrás subir una nueva versión del documento siguiendo las indicaciones",
  },
  {
    pregunta: "¿Puedo completar mi inscripción desde el celular?",
    respuesta:
      "Sí, la plataforma es totalmente compatible con dispositivos móviles, permitiéndote subir documentos y revisar tu progreso desde cualquier lugar.",
  },
  {
    pregunta: "¿Mis datos y documentos están seguros?",
    respuesta:
      "Sí, utilizamos cifrado y protocolos de seguridad para proteger tu información, cumpliendo con estándares de privacidad.",
  },
  {
    pregunta: "¿Cuánto tiempo toma completar la inscripción?",
    respuesta:
      "El proceso puede completarse en pocos minutos, dependiendo de la disponibilidad de tus documentos y la revisión del equipo de admisiones.",
      className: "border-none",
  },
  {
    pregunta: "¿Qué sucede después de completar todos los requisitos?",
    respuesta:
      "Una vez aprobados todos tus documentos, puedes esperar la aprobación de los administradores.",
    className: "border-none",
  },
];
function Faqs() {
  return (
    <section className="bg-sky-950 px-6">
      <div className="items-center flex flex-col text-white py-10">
        <h1 className="bbh-bartle-regular text-xl text-blue-100">
          Resuelve tus Preguntas{" "}
        </h1>
        <p className="text-gray-200/80 text-sm md:w-3/8 text-center">
          Encuentra respuestas claras a las dudas más comunes sobre tu proceso
          de admisión de documentos.
        </p>
      </div>
      <div className="flex flex-row flex-wrap justify-around">
        {dataFaqs.map((item) => (
          <div key={item.pregunta} className={`border-s pl-8 relative pb-10 ${item.className? item.className : ""}`}>
            <div className="absolute  -start-[25px] bg-sky-950 w-12 h-12 rounded-full flex items-center justify-center z-0">
              <CircleCheckBig size={36} color="white" />
            </div>
            <Card className="w-[400px] p-3 gap-1 hover:scale-105 z-10 ease-in-out duration-150 cursor-pointer">
              <CardTitle className="text-sm">{item.pregunta}</CardTitle>
              <CardDescription className="text-xs">
                {item.respuesta}
              </CardDescription>
              <span className="text-blue-400 text-[10px]">READ MORE</span>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Faqs;
