"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, LayoutDashboard, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepIndicator } from "./step-indicator"
import { DocumentsStep, type DocumentsState, DOCUMENT_FIELDS } from "./documents-step"
import { PersonalDataStep, type PersonalData, emptyPersonalData } from "./personal-data-step"
import { ReviewStep } from "./review-step"

const STEPS = [{ title: "Documentos" }, { title: "Datos personales" }, { title: "Revisión" }]

export function ProfileWizard() {
  const [current, setCurrent] = useState(0)
  const [documents, setDocuments] = useState<DocumentsState>({})
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonalData)
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const documentsComplete = useMemo(
    () => DOCUMENT_FIELDS.every((field) => Boolean(documents[field.id])),
    [documents],
  )

  function validatePersonal() {
    const next: Partial<Record<keyof PersonalData, string>> = {}
    const required: (keyof PersonalData)[] = [
      "nombres",
      "apellidos",
      "cedula",
      "correo",
      "telefono",
      "direccion",
      "carrera",
    ]
    for (const key of required) {
      if (!personal[key]?.trim()) next[key] = "Este campo es obligatorio"
    }
    if (personal.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.correo)) {
      next.correo = "Ingresa un correo válido"
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleNext() {
    if (current === 0 && !documentsComplete) return
    if (current === 1 && !validatePersonal()) return
    setCurrent((c) => Math.min(c + 1, STEPS.length - 1))
  }

  function handleBack() {
    setCurrent((c) => Math.max(c - 1, 0))
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const formData = new FormData()
      for (const [key, value] of Object.entries(personal)) {
        formData.append(key, value)
      }
      for (const field of DOCUMENT_FIELDS) {
        const doc = documents[field.id]
        if (doc?.file) formData.append(field.id, doc.file)
      }

      const res = await fetch("/api/auth/profile-complete", { method: "POST", body: formData })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "No se pudo guardar el perfil.")
      }
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Ocurrió un error al enviar el perfil.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-7 text-primary" />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-foreground">¡Perfil completado!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tus documentos y datos se han registrado correctamente, {personal.nombres || "estudiante"}.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" />
              Ir al dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <StepIndicator steps={STEPS} current={current} />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <header className="mb-6 flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            {current === 1 ? (
              <User className="size-5 text-primary" />
            ) : (
              <FileText className="size-5 text-primary" />
            )}
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {current === 0 && "Sube tus documentos"}
              {current === 1 && "Completa tus datos personales"}
              {current === 2 && "Revisa y confirma"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {current === 0 && "Adjunta los archivos requeridos en el formato indicado."}
              {current === 1 && "Ingresa tu información de contacto y académica."}
              {current === 2 && "Verifica que todo esté correcto antes de enviar."}
            </p>
          </div>
        </header>

        {current === 0 && <DocumentsStep documents={documents} onChange={setDocuments} />}
        {current === 1 && <PersonalDataStep data={personal} errors={errors} onChange={setPersonal} />}
        {current === 2 && <ReviewStep documents={documents} personal={personal} />}

        {submitError && (
          <p className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {submitError}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
          <Button variant="ghost" onClick={handleBack} disabled={current === 0 || submitting}>
            <ArrowLeft className="size-4" />
            Atrás
          </Button>

          {current < STEPS.length - 1 ? (
            <Button onClick={handleNext} disabled={current === 0 && !documentsComplete}>
              Continuar
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  Enviar perfil
                  <CheckCircle2 className="size-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
