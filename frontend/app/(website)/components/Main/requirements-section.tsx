"use client";
import "../../../style/website/requirements_section.css";
const dataRequirements = [
  { req: "titulo de bachiller" },
  { req: "titulo de bachiller fonde negro" },
  { req: "certificado de calificaciones con timbres fiscales" },
  { req: "partida de nacimiento" },
  { req: "cedula (copia 124%)" },
  { req: "dos fotos tamaño carnet" },
  { req: "inscripcion OPSU" },
];
function Requirements() {
  return (
    <section className="bg-requirements h-[600px] w-full bg-cover bg-top bg-no-repeat px-10 py-20">
      <div className="text-white bbh-bartle-regular text-xl">
        Documentos exigidos para la digitalización de documentos
      </div>
      <div className="flex items-center justify-between mt-10">
        <ol className="list-[upper-roman] text-white mt-5 ml-12">
          {dataRequirements.map((item, index) => (
            <li key={index}>
              <p className="geist-font uppercase text-sm p-2">{item.req}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Requirements;
