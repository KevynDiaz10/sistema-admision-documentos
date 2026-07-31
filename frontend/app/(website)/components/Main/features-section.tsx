"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {DynamicIcon} from "lucide-react/dynamic"

const dataFeatureItem = [
  {
    badge: 
    {text: "EFICIENCIA", color: "bg-green-500/20 text-green-500", icon: {name: "zap", color: "text-green-500"}},
    title: "Carga de Archivos",
    descrition:
      "Olvídate de subir archivos uno por uno. Nuestra interfaz permite agregar múltiples formatos con validación de tamaño automática.",
  },
  {
    badge: {text: "INFORMATIVO", color: "bg-blue-500/20 text-blue-500", icon: {name: "info", color: "text-blue-500"}},
    title: "Rechazo con retroalimentación",
    descrition:
      "Si un documento es ilegible, el sistema permite enviar comentarios específicos al usuario para que sepa exactamente qué corregir.",
  },
  {
    badge: {text: "SEGURIDAD", color: "bg-yellow-500/30 text-yellow-500", icon: {name: "shield-check", color: "text-yellow-500"}},
    title: "Almacenamiento seguro",
    descrition:
      "Protegemos la información sensible con cifrado avanzado, garantizando que solo el personal autorizado tenga acceso a los expedientes.",
  },
  {
    badge: {text: "ALERTAS", color: "bg-red-500/20 text-red-500", icon: {name: "bell", color: "text-red-500"}},
    title: "Comentarios",
    descrition:
      "Mantén a todos informados con alertas por comentario sobre vencimientos o actualizaciones de expedientes, asegurando que nadie se quede atrás en el proceso de admisión.",
  },
  {
    badge: {text: "NUBE", color: "bg-purple-500/20 text-purple-500", icon: {name: "cloud", color: "text-purple-500"}},
    title: "Acceso desde cualquier lugar",
    descrition:
      "Sube o revisa documentos desde cualquier dispositivo (móvil, tablet o PC) con una experiencia optimizada y sincronización inmediata.",
  },
  {
    badge: {text: "CERO ERRORES", color: "bg-neutral-500/20 text-black-500", icon: {name: "x-circle", color: "text-black-500"}},
    title: "Feedback instantáneo de errores",
    descrition:
      "Si un documento es ilegible o incorrecto, el sistema te avisa al momento para que puedas corregirlo y no pierdas tu lugar en el proceso.",
  }
];
function Features() {
  return (
    <section className="bg-sky-950 py-18 px-6 ">
      <div className="items-center w-full flex flex-col gap-2 mb-12 ">
        <span><Badge><DynamicIcon name="sparkles" className="text-blue-500" size={16} />Our Features</Badge></span>
        <h1 className="text-white text-center bbh-bartle-regular text-4xl">
          Funciones destacadas
        </h1>
        <p className="text-center geist-font text-gray-200/80 md:max-w-3/8 w-full text-sm">
          Funciones diseñadas para maximizar tu experiencia de usuario en nuestra aplicación.
        </p>
      </div>

      <div className="grid w-full gap-8 md:grid-cols-3 ">
        {dataFeatureItem.map((item) => (
          <div key={Math.random()}>
            <FeatureItem {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeatureItem(item: any) {
  return (
    <Card className=" mx-auto w-full max-w-sm p-4 gap-0 h-full">
      <CardHeader className="p-0 gap-0">
        <Badge variant="secondary" className={`${item.badge.color} text-[8px]`}><DynamicIcon name={item.badge.icon.name} className={item.badge.icon.color} size={48} />{item.badge.text}</Badge>
      </CardHeader>

      <CardTitle className="text-sm">{item.title}</CardTitle>
      <CardDescription className="text-xs mt-2">{item.descrition}</CardDescription>
    </Card>
  );
}

export default Features;
