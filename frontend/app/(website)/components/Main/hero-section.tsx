//hero section:
import "./../../../../public/hero-img-1.webp";
import { Button } from "@/components/ui/button";
/**
 * hero section
 * title: Simplifica tu proceso de admisión
 * content: Más que una herramienta tecnológica, es la alternativa al método manual de gestión de documentos, diseñada para simplificar el manejo de documentos, sin alterar los pasos de validación establecidos por el IUTA.”
 * button CTA(call to action): Sube tus documentos ahora
 *
 */
function HeroSection() {
  return (
    <section className="flex gap-30 p-10 bg-linear-to-r from-blue-800 via-blue-900 to-blue-950">
      <div className="basis-1/2 flex flex-col justify-center gap-8 text-white">
        <h2 className={`font-mono text-5xl font-extrabold`}>
          Simplifica tu proceso de admisión
        </h2>
        <div className="w-[500px] flex flex-col gap-6">
          <p className="text-sm text-gray-300">
            Nuestro sistema digital reemplaza el manejo manual de documentos de
            admisión, ofreciendo una alternativa moderna, rápida y confiable,
            sin alterar los pasos de formalización presencial establecidos por
            el IUTA.
          </p>
          <div>
            <Button className="" variant={"secondary"}>Sube tus documentos ahora</Button>
          </div>
        </div>
      </div>
      <div>
        <img src="hero-img-1.webp" alt="" className="h-[500px]" />
      </div>
    </section>
  );
}

export default HeroSection;
