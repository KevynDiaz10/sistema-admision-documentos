// app/auth/admin/solicitudesroute.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ============================================
// GET - Obtener solicitudes con filtros
// ============================================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filtros: any = {};
    
    const estatus = searchParams.get('estatus');
    if (estatus && ['pendiente', 'aprobado', 'rechazado'].includes(estatus)) {
      filtros.estatus = estatus;
    }
    
    const perfilId = searchParams.get('perfilId');
    if (perfilId) {
      filtros.perfilId = parseInt(perfilId);
    }
    
    const fechaDesde = searchParams.get('fechaDesde');
    if (fechaDesde) {
      filtros.fechaDesde = new Date(fechaDesde);
    }
    
    const fechaHasta = searchParams.get('fechaHasta');
    if (fechaHasta) {
      filtros.fechaHasta = new Date(fechaHasta);
    }

    const where: any = {};

    if (filtros?.estatus) {
      where.estatus = filtros.estatus;
    }

    if (filtros?.perfilId) {
      where.id_perfil = filtros.perfilId;
    }

    if (filtros?.fechaDesde) {
      where.fecha_creacion = {
        ...where.fecha_creacion,
        gte: filtros.fechaDesde
      };
    }

    if (filtros?.fechaHasta) {
      where.fecha_creacion = {
        ...where.fecha_creacion,
        lte: filtros.fechaHasta
      };
    }

const getSolicitudes = await prisma.solicitudes.findMany({
  where,
  orderBy: {
    fecha_creacion: 'desc'
  },
  include: {
    perfiles: {
      include: {
        perfil_documentos: {
          select: {
            id: true,
            tipo: true,
            nombre_archivo: true,
            mime_type: true,
            tamano: true,
            creado_en: true
          }
        }
      }
    }
  }
});
    
    return NextResponse.json(getSolicitudes);
  } catch (error: any) {
    console.error('Error en GET /api/admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Crear una nueva solicitud
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_perfil, descripcion, archivo_url } = body;
    
    if (!id_perfil || !descripcion) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos: id_perfil y descripcion' },
        { status: 400 }
      );
    }

    const nuevaSolicitud = await prisma.solicitudes.create({
      data: {
        id_perfil: parseInt(id_perfil),
        descripcion,
        archivo_url: archivo_url || null,
        estatus: 'pendiente',
        fecha_creacion: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: nuevaSolicitud 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error en POST /api/admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al crear la solicitud' },
      { status: 500 }
    );
  }
}

// ============================================
// PATCH - Actualizar el estado de una solicitud
// ============================================
export async function PATCH(request: NextRequest) {
  try {
    // Obtener el ID de los query params: /api/admin?id=123
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    // Obtener los datos del cuerpo
    const body = await request.json();
    const { estatus, comentarios } = body;

    // Validar ID
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'El ID de la solicitud es requerido' },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: 'ID de solicitud inválido' },
        { status: 400 }
      );
    }

    // Validar estatus (3 estados)
    const estadosPermitidos = ['pendiente', 'aprobado', 'rechazado'];
    if (!estatus || !estadosPermitidos.includes(estatus)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Estatus inválido. Debe ser: ${estadosPermitidos.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Verificar que la solicitud existe
    const solicitudExistente = await prisma.solicitudes.findUnique({
      where: { id: parseInt(id) }
    });

    if (!solicitudExistente) {
      return NextResponse.json(
        { success: false, error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar estatus y comentarios
    const dataToUpdate: any = {
      estatus: estatus,
      fecha_actualizacion: new Date()
    };

    // Si se envía comentarios, actualizarlos también
    if (comentarios !== undefined && comentarios !== null) {
      dataToUpdate.comentarios = comentarios;
    }

    const solicitudActualizada = await prisma.solicitudes.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      include: {
        perfiles: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            cedula: true,
            correo: true,
            telefono: true,
            carrera: true,
            semestre: true,
            fecha_nacimiento: true,
            genero: true,
            direccion: true,
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Solicitud ${estatus} exitosamente`,
      data: solicitudActualizada 
    });

  } catch (error: any) {
    console.error('Error en PATCH /api/admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al actualizar la solicitud' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Eliminar una solicitud
// ============================================
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'El ID de la solicitud es requerido' },
        { status: 400 }
      );
    }

    const solicitudExistente = await prisma.solicitudes.findUnique({
      where: { id: parseInt(id) }
    });

    if (!solicitudExistente) {
      return NextResponse.json(
        { success: false, error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    await prisma.solicitudes.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Solicitud eliminada correctamente' 
    });

  } catch (error: any) {
    console.error('Error en DELETE /api/admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al eliminar la solicitud' },
      { status: 500 }
    );
  }
}