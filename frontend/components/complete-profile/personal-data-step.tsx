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
  function set<K extends keyof PersonalData>(key: K, value: string) {
    onChange({ ...data, [key]: value })
  }

  const inputError = (key: keyof PersonalData) => (errors[key] ? "border-destructive" : "")

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
          value={data.correo}
          onChange={(e) => set("correo", e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          className={cn(inputError("correo"))}
        />
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
