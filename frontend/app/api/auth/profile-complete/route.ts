import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DOCUMENT_IDS = [
  "fondoNegro",
  "cedulaFile",
  "notas",
  "fotoCarnet",
  "titulo",
] as const;

const REQUIRED_FIELDS = [
  "nombres",
  "apellidos",
  "cedula",
  "correo",
  "telefono",
  "direccion",
  "carrera",
] as const;

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    
    // Validar campos obligatorios
    for (const field of REQUIRED_FIELDS) {
      const value = form.get(field);
      if (!value || typeof value !== "string" || !value.trim()) {
        return NextResponse.json(
          { error: `El campo "${field}" es obligatorio.` },
          { status: 400 }
        );
      }
    }

    // Validar que el usuario existe
    const getUserByEmail = await prisma.user.findUnique({
      where: {
        email: form.get("correo") as string,
      },
    });

    if (!getUserByEmail) {
      return NextResponse.json(
        { error: "Usuario no encontrado con este correo electrónico." },
        { status: 404 }
      );
    }

    // Preparar documentos usando Uint8Array en lugar de Buffer
const documentos: any[] = [];

for (const docId of DOCUMENT_IDS) {
  const file = form.get(docId);
  if (file && file instanceof File && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    documentos.push({
      tipo: docId,
      nombre_archivo: file.name,
      mime_type: file.type || "application/octet-stream",
      tamano: file.size,
      contenido: buffer as any, // Type assertion para evitar el error de tipos
    });
  }
}
    // Crear todo en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear perfil con documentos anidados
      const perfil = await tx.perfil.create({
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
          id_user: getUserByEmail.id,
          perfil_documentos: {
            create: documentos,
          },
        },
        include: {
          perfil_documentos: true,
        },
      });

      // Crear solicitud
      const solicitud = await tx.solicitudes.create({
        data: {
          id_perfil: perfil.id,
          carrera: form.get("carrera") as string,
          estatus: "pendiente",
        },
      });

      return { perfil, solicitud };
    });

    console.log("Perfil creado con ID:", result.perfil.id);
    console.log("Documentos creados:", result.perfil.perfil_documentos?.length || 0);

    return NextResponse.json(
      {
        ok: true,
        id: result.perfil.id,
        solicitudId: result.solicitud.id,
        documentosCreados: result.perfil.perfil_documentos?.length || 0,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al guardar el perfil:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido al guardar el perfil.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}