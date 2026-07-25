import { CheckCircle2, FileText } from "lucide-react"
import { DOCUMENT_FIELDS, type DocumentsState } from "./documents-step"
import type { PersonalData } from "./personal-data-step"

type ReviewStepProps = {
  documents: DocumentsState
  personal: PersonalData
}

const GENERO_LABELS: Record<string, string> = {
  femenino: "Femenino",
  masculino: "Masculino",
  otro: "Otro",
  "prefiero-no-decir": "Prefiero no decir",
}

export function ReviewStep({ documents, personal }: ReviewStepProps) {
  const rows: { label: string; value: string }[] = [
    { label: "Nombres", value: personal.nombres },
    { label: "Apellidos", value: personal.apellidos },
    { label: "Cédula", value: personal.cedula },
    { label: "Correo", value: personal.correo },
    { label: "Teléfono", value: personal.telefono },
    { label: "Fecha de nacimiento", value: personal.fechaNacimiento },
    { label: "Género", value: GENERO_LABELS[personal.genero] ?? "" },
    { label: "Carrera", value: personal.carrera },
    { label: "Semestre", value: personal.semestre ? `${personal.semestre}º` : "" },
    { label: "Dirección", value: personal.direccion },
  ]

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Documentos cargados</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {DOCUMENT_FIELDS.map((field) => {
            const doc = documents[field.id]
            return (
              <li
                key={field.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
              >
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{field.label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {doc ? doc.file.name : "Sin archivo"}
                  </p>
                </div>
                {doc && <CheckCircle2 className="size-4 shrink-0 text-primary" />}
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Datos personales</h3>
        <dl className="grid gap-x-6 gap-y-3 rounded-lg border border-border bg-background p-4 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="text-sm text-foreground">{row.value || "—"}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
