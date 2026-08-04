"use client"

import type React from "react"

import { useRef, useState } from "react"
import { CheckCircle2, FileText, ImageIcon, UploadCloud, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type UploadFile = {
  file: File
  previewUrl: string | null
}

type FileUploadFieldProps = {
  id: string
  label: string
  description: string
  accept: string
  acceptLabel: string
  value: UploadFile | null
  onChange: (value: UploadFile | null) => void
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploadField({
  id,
  label,
  description,
  accept,
  acceptLabel,
  value,
  onChange,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const acceptedTypes = accept.split(",").map((t) => t.trim())

  function validateAndSet(file: File) {
    const extension = "." + (file.name.split(".").pop()?.toLowerCase() ?? "")
    const matches = acceptedTypes.some((t) => extension === t)
    if (!matches) {
      setError(`Formato no válido. Se permite: ${acceptLabel}`)
      return
    }
    setError(null)
    const isImage = file.type.startsWith("image/")
    onChange({
      file,
      previewUrl: isImage ? URL.createObjectURL(file) : null,
    })
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) validateAndSet(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) validateAndSet(file)
  }

  function handleRemove() {
    if (value?.previewUrl) URL.revokeObjectURL(value.previewUrl)
    onChange(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const isImageFile = value?.file.type.startsWith("image/")

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <span className="text-xs text-muted-foreground">{acceptLabel}</span>
      </div>

      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
            {isImageFile && value.previewUrl ? (
              <img src={value.previewUrl || "/placeholder.svg"} alt={label} className="size-full object-cover" />
            ) : (
              <FileText className="size-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{value.file.name}</p>
            <p className="flex items-center gap-1 text-xs text-primary">
              <CheckCircle2 className="size-3.5" />
              {formatSize(value.file.size)} · Cargado
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Eliminar ${label}`}
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-card px-4 py-6 text-center transition-colors hover:border-primary/60 hover:bg-accent",
            dragging && "border-primary bg-accent",
          )}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-muted">
            {accept.includes(".png") && !accept.includes(".pdf") ? (
              <ImageIcon className="size-5 text-muted-foreground" />
            ) : (
              <UploadCloud className="size-5 text-muted-foreground" />
            )}
          </span>
          <span className="text-sm font-medium text-foreground">Haz clic o arrastra un archivo</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </button>
      )}

      <input ref={inputRef} id={id} type="file" accept={accept} onChange={handleInputChange} className="sr-only" />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
