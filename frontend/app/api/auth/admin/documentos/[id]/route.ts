import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Desempaquetar params como Promise
    const { id } = await params;
    const documentoId = parseInt(id);
    
    if (isNaN(documentoId)) {
      return NextResponse.json(
        { error: 'ID de documento inválido' },
        { status: 400 }
      );
    }

    const documento = await prisma.perfil_documentos.findUnique({
      where: { id: documentoId },
      select: {
        id: true,
        nombre_archivo: true,
        mime_type: true,
        tamano: true,
        contenido: true,
      },
    });

    if (!documento) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Convertir Buffer a Uint8Array si es necesario
    const contenido = documento.contenido instanceof Buffer 
      ? new Uint8Array(documento.contenido) 
      : documento.contenido;

    return new NextResponse(contenido, {
      headers: {
        'Content-Type': documento.mime_type,
        'Content-Disposition': `inline; filename="${documento.nombre_archivo}"`,
        'Content-Length': documento.tamano.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error al obtener documento:', error);
    return NextResponse.json(
      { error: 'Error al obtener el documento' },
      { status: 500 }
    );
  }
}