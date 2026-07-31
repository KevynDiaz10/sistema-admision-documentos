import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// GET - Obtener documento
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

// PUT - Reemplazar documento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const documentoId = parseInt(id);
    
    if (isNaN(documentoId)) {
      return NextResponse.json(
        { error: 'ID de documento inválido' },
        { status: 400 }
      );
    }

    // Verificar que el documento existe y obtener su perfil
    const documentoExistente = await prisma.perfil_documentos.findUnique({
      where: { id: documentoId },
      include: {
        perfil: {
          include: {
            solicitudes: {
              orderBy: { fecha_creacion: 'desc' },
              take: 1,
            },
            user: {
              select: { id: true }
            }
          }
        }
      },
    });

    if (!documentoExistente) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el usuario es el dueño del documento o es admin
    const isAdmin = token.role === 'admin';
    const isOwner = documentoExistente.perfil.user?.id === token.sub;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este documento' },
        { status: 403 }
      );
    }

    // Verificar el estado de la solicitud
    const ultimaSolicitud = documentoExistente.perfil.solicitudes[0];
    
    if (ultimaSolicitud) {
      if (ultimaSolicitud.estatus === 'aprobado') {
        return NextResponse.json(
          { error: 'No se puede modificar el documento porque la solicitud está aprobada' },
          { status: 400 }
        );
      }
    }

    // Obtener el archivo del FormData
    const formData = await request.formData();
    const archivo = formData.get('archivo') as File;

    if (!archivo) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!tiposPermitidos.includes(archivo.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo se permiten PDF, JPEG y PNG' },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 5MB)
    const tamanoMaximo = 5 * 1024 * 1024; // 5MB
    if (archivo.size > tamanoMaximo) {
      return NextResponse.json(
        { error: 'El archivo excede el tamaño máximo permitido (5MB)' },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer
    const bytes = await archivo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Actualizar el documento en la base de datos
    const documentoActualizado = await prisma.perfil_documentos.update({
      where: { id: documentoId },
      data: {
        nombre_archivo: archivo.name,
        mime_type: archivo.type,
        tamano: archivo.size,
        contenido: buffer,
      },
      select: {
        id: true,
        tipo: true,
        nombre_archivo: true,
        mime_type: true,
        tamano: true,
        creado_en: true,
      },
    });

    // Si la solicitud está rechazada, cambiarla a pendiente
    if (ultimaSolicitud && ultimaSolicitud.estatus === 'rechazado') {
      await prisma.solicitudes.update({
        where: { id: ultimaSolicitud.id },
        data: {
          estatus: 'pendiente',
          comentarios: ultimaSolicitud.comentarios 
            ? `${ultimaSolicitud.comentarios}\n[Actualización automática: Documento reemplazado - ${new Date().toLocaleString('es-ES')}]`
            : `Documento reemplazado automáticamente - ${new Date().toLocaleString('es-ES')}`,
        },
      });

      return NextResponse.json({
        documento: documentoActualizado,
        mensaje: 'Documento actualizado correctamente. La solicitud ha cambiado a estado pendiente.',
        solicitudActualizada: true,
      });
    }

    return NextResponse.json({
      documento: documentoActualizado,
      mensaje: 'Documento actualizado correctamente',
      solicitudActualizada: false,
    });

  } catch (error) {
    console.error('Error al actualizar documento:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el documento' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar documento (opcional)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const documentoId = parseInt(id);
    
    if (isNaN(documentoId)) {
      return NextResponse.json(
        { error: 'ID de documento inválido' },
        { status: 400 }
      );
    }

    // Verificar que el documento existe
    const documentoExistente = await prisma.perfil_documentos.findUnique({
      where: { id: documentoId },
      include: {
        perfil: {
          include: {
            solicitudes: {
              orderBy: { fecha_creacion: 'desc' },
              take: 1,
            },
            user: {
              select: { id: true }
            }
          }
        }
      },
    });

    if (!documentoExistente) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Verificar permisos
    const isAdmin = token.role === 'admin';
    const isOwner = documentoExistente.perfil.user?.id === token.sub;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este documento' },
        { status: 403 }
      );
    }

    // Verificar estado de la solicitud
    const ultimaSolicitud = documentoExistente.perfil.solicitudes[0];
    if (ultimaSolicitud && ultimaSolicitud.estatus === 'aprobado') {
      return NextResponse.json(
        { error: 'No se puede eliminar el documento porque la solicitud está aprobada' },
        { status: 400 }
      );
    }

    await prisma.perfil_documentos.delete({
      where: { id: documentoId },
    });

    return NextResponse.json({
      mensaje: 'Documento eliminado correctamente',
    });

  } catch (error) {
    console.error('Error al eliminar documento:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el documento' },
      { status: 500 }
    );
  }
}