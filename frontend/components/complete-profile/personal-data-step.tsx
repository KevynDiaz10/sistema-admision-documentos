"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export type PersonalData = {
  nombres: string
  apellidos: string
  cedula: string
  correo: string
  telefono: string
  fechaNacimiento: string
  genero: string
  direccion: string
  carrera: string
  semestre: string
}

export const emptyPersonalData: PersonalData = {
  nombres: "",
  apellidos: "",
  cedula: "",
  correo: "",
  telefono: "",
  fechaNacimiento: "",
  genero: "",
  direccion: "",
  carrera: "",
  semestre: "",
}

type PersonalDataStepProps = {
  data: PersonalData
  errors: Partial<Record<keyof PersonalData, string>>
  onChange: (data: PersonalData) => void
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function PersonalDataStep({ data, errors, onChange }: PersonalDataStepProps) {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  
  // Obtener el email de la URL o de la sesión
  const emailFromUrl = searchParams.get("email")
  const userEmail = session?.user?.email || emailFromUrl

  function set<K extends keyof PersonalData>(key: K, value: string) {
    onChange({ ...data, [key]: value })
  }
  
  const inputError = (key: keyof PersonalData) => (errors[key] ? "border-destructive" : "")

  // Establecer el correo automáticamente cuando esté disponible
  useEffect(() => {
    if (userEmail && data.correo !== userEmail) {
      set("correo", userEmail)
    }
  }, [userEmail])

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field id="nombres" label="Nombres" error={errors.nombres} required>
        <Input
          id="nombres"
          value={data.nombres}
          onChange={(e) => set("nombres", e.target.value)}
          placeholder="Ej. María José"
          className={cn(inputError("nombres"))}
        />
      </Field>

      <Field id="apellidos" label="Apellidos" error={errors.apellidos} required>
        <Input
          id="apellidos"
          value={data.apellidos}
          onChange={(e) => set("apellidos", e.target.value)}
          placeholder="Ej. Pérez Gómez"
          className={cn(inputError("apellidos"))}
        />
      </Field>

      <Field id="cedula" label="Cédula" error={errors.cedula} required>
        <Input
          id="cedula"
          value={data.cedula}
          onChange={(e) => set("cedula", e.target.value)}
          placeholder="Ej. V-12345678"
          className={cn(inputError("cedula"))}
        />
      </Field>

      <Field id="correo" label="Correo electrónico" error={errors.correo} required>
        <Input
          id="correo"
          type="email"
          value={data.correo || "Cargando..."}
          readOnly
          disabled
          placeholder="tucorreo@ejemplo.com"
          className={cn(
            inputError("correo"),
            "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-75"
          )}
        />
        <div className="flex items-center gap-1.5 mt-1">
          <svg 
            className="w-3.5 h-3.5 text-muted-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
          <p className="text-xs text-muted-foreground font-medium">
            Este es el correo con el que te registraste y no se puede modificar
          </p>
        </div>
      </Field>

      <Field id="telefono" label="Teléfono" error={errors.telefono} required>
        <Input
          id="telefono"
          type="tel"
          value={data.telefono}
          onChange={(e) => set("telefono", e.target.value)}
          placeholder="Ej. 0412-1234567"
          className={cn(inputError("telefono"))}
        />
      </Field>

      <Field id="fechaNacimiento" label="Fecha de nacimiento" error={errors.fechaNacimiento}>
        <Input
          id="fechaNacimiento"
          type="date"
          value={data.fechaNacimiento}
          onChange={(e) => set("fechaNacimiento", e.target.value)}
        />
      </Field>

      <Field id="genero" label="Género">
        <Select value={data.genero} onValueChange={(v) => set("genero", v)}>
          <SelectTrigger id="genero" className="w-full">
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="femenino">Femenino</SelectItem>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
            <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field id="semestre" label="Semestre / Año">
        <Select value={data.semestre} onValueChange={(v) => set("semestre", v)}>
          <SelectTrigger id="semestre" className="w-full">
            <SelectValue placeholder="Selecciona el semestre" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <SelectItem key={n} value={`${n}`}>
                {n}º semestre
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field id="carrera" label="Carrera" error={errors.carrera} required>
        <Input
          id="carrera"
          value={data.carrera}
          onChange={(e) => set("carrera", e.target.value)}
          placeholder="Ej. Ingeniería en Sistemas"
          className={cn(inputError("carrera"))}
        />
      </Field>

      <div className="sm:col-span-2">
        <Field id="direccion" label="Dirección" error={errors.direccion} required>
          <Input
            id="direccion"
            value={data.direccion}
            onChange={(e) => set("direccion", e.target.value)}
            placeholder="Ej. Av. Principal, Edif. Los Robles, Piso 3"
            className={cn(inputError("direccion"))}
          />
        </Field>
      </div>
    </div>
  )
}