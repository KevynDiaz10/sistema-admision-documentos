import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const DOCUMENT_IDS = ["fondoNegro", "cedula", "notas", "fotoCarnet", "titulo"] as const

const REQUIRED_FIELDS = [
  "nombres",
  "apellidos",
  "cedula",
  "correo",
  "telefono",
  "direccion",
  "carrera",
] as const

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()

    // Validar campos obligatorios
    for (const field of REQUIRED_FIELDS) {
      const value = form.get(field)
      if (!value || typeof value !== "string" || !value.trim()) {
        return NextResponse.json({ error: `El campo "${field}" es obligatorio.` }, { status: 400 })
      }
    }

    // Preparar documentos
    const documentos: {
      tipo: string
      nombre_archivo: string
      mime_type: string
      tamano: number
      contenido: Buffer
    }[] = []

    for (const docId of DOCUMENT_IDS) {
      const file = form.get(docId)
      if (file && file instanceof File && file.size > 0) {
        documentos.push({
          tipo: docId,
          nombre_archivo: file.name,
          mime_type: file.type || "application/octet-stream",
          tamano: file.size,
          contenido: Buffer.from(await file.arrayBuffer()),
        })
      }
    }

    const perfil = await prisma.perfil.create({
      data: {
        nombres: form.get("nombres") as string,
        apellidos: form.get("apellidos") as string,
        cedula: form.get("cedula") as string,
        correo: form.get("correo") as string,
        telefono: form.get("telefono") as string,
        fecha_nacimiento: (form.get("fechaNacimiento") as string) || null,
        genero: (form.get("genero") as string) || null,
        direccion: form.get("direccion") as string,
        carrera: form.get("carrera") as string,
        semestre: (form.get("semestre") as string) || null,
        perfil_documentos: { create: documentos },
        id_user: "db76ed65-31a4-42e1-84d2-46a3762e2025"
      },
    })

    return NextResponse.json({ ok: true, id: perfil.id }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error al guardar el perfil:", error)
    const message = error instanceof Error ? error.message : "Error desconocido al guardar el perfil."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
