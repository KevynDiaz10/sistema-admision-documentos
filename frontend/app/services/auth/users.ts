"use server";
import { prisma } from "@/lib/prisma";

export async function getDocuments(email: string) {
  // con el email pedir el id del usuario y con el id pedir los documentos
  
  try {
    const documents = await prisma.documentos.findMany({
      where: { usuario_id: "cf5a9100-0c10-434d-90d0-66a51a901330" },
    });
    if (documents) {
      return {
        success: true,
        message: "Documentos encontrados",
        data: documents,
      };
    }
    return {
      success: false,
      message: "Documentos no encontrado",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener los documentos",
      error: error,
    };
  }
}
export async function createDocuments(data: any) {
  const createDocument = await prisma.documentos.createMany({
    data: [
      {
        usuario_id: data.id,
        tipo_documento: "fondo_negro",
        estado: "sin_consignar",
        ruta_archivo: "/",
        extension: "pdf",
        nombre_original: "fondo_negro.pdf",
      },
      {
        usuario_id: data.id,
        tipo_documento: "cedula",
        estado: "sin_consignar",
        ruta_archivo: "/",
        extension: "pdf",
        nombre_original: "cedula.pdf",
      },
      {
        usuario_id: data.id,
        tipo_documento: "notas_certificadas",
        estado: "sin_consignar",
        ruta_archivo: "/",
        extension: "pdf",
        nombre_original: "notas_certificadas.pdf",
      },
      {
        usuario_id: data.id,
        tipo_documento: "foto_carnet",
        estado: "sin_consignar",
        ruta_archivo: "/",
        extension: "png",
        nombre_original: "foto_carnet.png",
      },
      {
        usuario_id: data.id,
        tipo_documento: "titulo",
        estado: "sin_consignar",
        ruta_archivo: "/",
        extension: "png",
        nombre_original: "titulo.png",
      },
    ],
  });
  return {createDocument}
}
