export type Status = "pendiente" | "aprobado" | "rechazado" | "documentos_invalidos";

export type Doc = {
  name: string;
  type: string;
  size: string;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  program: string;
  submittedAt: string;
  status: Status;
  comment?: string;
  documents: Doc[];
};
