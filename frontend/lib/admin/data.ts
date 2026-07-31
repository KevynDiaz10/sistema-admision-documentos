import type { Doc, Status, Student } from "./types";

export const statusMeta: Record<
  Status,
  { label: string; className: string }
> = {
  pendiente: {
    label: "Pendiente",
    className: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400",
  },
  aprobado: {
    label: "Aprobado",
    className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  },
  rechazado: {
    label: "Rechazado",
    className: "bg-red-500/15 text-red-700 border-red-500/30 dark:text-red-400",
  },
  documentos_invalidos: {
    label: "Documentos inválidos",
    className: "bg-orange-500/15 text-orange-700 border-orange-500/30 dark:text-orange-400",
  },
};

const docs = (list: Doc[]): Doc[] => list;

export const STUDENTS: Student[] = [
  {
    id: "EST-1042",
    name: "María González Ruiz",
    email: "maria.gonzalez@mail.com",
    phone: "+52 55 1234 5678",
    birthDate: "2005-03-14",
    program: "Ingeniería en Sistemas",
    submittedAt: "Hace 2 horas",
    status: "pendiente",
    documents: docs([
      { name: "acta_nacimiento.pdf", type: "Acta de nacimiento", size: "1.2 MB" },
      { name: "certificado_bachillerato.pdf", type: "Certificado", size: "2.4 MB" },
      { name: "identificacion.jpg", type: "Identificación oficial", size: "820 KB" },
      { name: "foto.jpg", type: "Fotografía", size: "310 KB" },
    ]),
  },
  {
    id: "EST-1043",
    name: "Carlos Mendoza Peña",
    email: "c.mendoza@mail.com",
    phone: "+52 55 8765 4321",
    birthDate: "2004-11-02",
    program: "Medicina",
    submittedAt: "Hace 5 horas",
    status: "pendiente",
    documents: docs([
      { name: "acta_nacimiento.pdf", type: "Acta de nacimiento", size: "1.1 MB" },
      { name: "certificado_bachillerato.pdf", type: "Certificado", size: "2.0 MB" },
      { name: "curp.pdf", type: "CURP", size: "180 KB" },
    ]),
  },
  {
    id: "14",
    name: "Ana Lucía Fernández",
    email: "ana.fernandez@mail.com",
    phone: "+52 33 5544 3322",
    birthDate: "2005-06-20",
    program: "Arquitectura",
    submittedAt: "Ayer",
    status: "aprobado",
    comment: "Documentación completa y correcta. Bienvenida.",
    documents: docs([
      { name: "acta_nacimiento.pdf", type: "Acta de nacimiento", size: "1.3 MB" },
      { name: "certificado_bachillerato.pdf", type: "Certificado", size: "2.1 MB" },
    ]),
  },
  {
    id: "EST-1040",
    name: "Jorge Luis Ramírez",
    email: "jorge.ramirez@mail.com",
    phone: "+52 81 9988 7766",
    birthDate: "2003-01-30",
    program: "Derecho",
    submittedAt: "Hace 2 días",
    status: "documentos_invalidos",
    comment: "El certificado de bachillerato está ilegible, favor de reenviarlo.",
    documents: docs([
      { name: "certificado_bachillerato.pdf", type: "Certificado", size: "900 KB" },
    ]),
  },
];
