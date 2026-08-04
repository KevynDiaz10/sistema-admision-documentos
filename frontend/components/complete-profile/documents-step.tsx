"use client"

import { FileUploadField, type UploadFile } from "./file-upload-field"

export type DocumentId = "fondoNegro" | "cedulaFile" | "notas" | "fotoCarnet" | "titulo" | "opsu" | "partidaNacimiento"

export type DocumentsState = Partial<Record<DocumentId, UploadFile>>

export const DOCUMENT_FIELDS: {
  id: DocumentId
  label: string
  description: string
  accept: string
  acceptLabel: string
}[] = [
  {
    id: "fondoNegro",
    label: "Fondo negro",
    description: "Documento de fondo negro en formato PDF.",
    accept: ".pdf",
    acceptLabel: "PDF",
  },
  {
    id: "cedulaFile",
    label: "Cédula",
    description: "Copia de tu cédula de identidad.",
    accept: ".png,.pdf",
    acceptLabel: "PNG o PDF",
  },
  {
    id: "notas",
    label: "Notas certificadas",
    description: "Certificado de notas oficial.",
    accept: ".pdf",
    acceptLabel: "PDF",
  },
  {
    id: "fotoCarnet",
    label: "Foto tipo carnet",
    description: "Foto reciente fondo blanco.",
    accept: ".png",
    acceptLabel: "PNG",
  },
  {
    id: "titulo",
    label: "Título",
    description: "Título de bachiller o profesional.",
    accept: ".png,.pdf",
    acceptLabel: "PNG o PDF",
  },
  {
    id: "partidaNacimiento",
    label: "Partida de Nacimiento",
    description: "Partida de nacimento de el estudiante.",
    accept: ".png,.pdf",
    acceptLabel: "PNG o PDF",
  },
  {
    id: "opsu",
    label: "Inscripción de la opsu",
    description: "Entra a la página del SNI OPSU.",
    accept: ".pdf, .docx",
    acceptLabel: "PNG o PDF",
  },
]

type DocumentsStepProps = {
  documents: DocumentsState
  onChange: (documents: DocumentsState) => void
}

export function DocumentsStep({ documents, onChange }: DocumentsStepProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {DOCUMENT_FIELDS.map((field) => (
        <FileUploadField
          key={field.id}
          id={field.id}
          label={field.label}
          description={field.description}
          accept={field.accept}
          acceptLabel={field.acceptLabel}
          value={documents[field.id] ?? null}
          onChange={(value) => onChange({ ...documents, [field.id]: value ?? undefined })}
        />
      ))}
    </div>
  )
}
