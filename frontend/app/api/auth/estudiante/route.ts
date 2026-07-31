import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Obtener el token de la sesión
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

    const userId = token.sub;

    // Buscar el perfil del usuario con sus documentos y solicitudes
    const perfil = await prisma.perfil.findFirst({
      where: {
        id_user: userId,
      },
      include: {
        perfil_documentos: {
          select: {
            id: true,
            tipo: true,
            nombre_archivo: true,
            mime_type: true,
            tamano: true,
            creado_en: true,
          },
          orderBy: {
            creado_en: 'desc',
          },
        },
        solicitudes: {
          select: {
            id: true,
            carrera: true,
            estatus: true,
            comentarios: true,
            fecha_creacion: true,
            fecha_actualizacion: true,
          },
          orderBy: {
            fecha_creacion: 'desc',
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!perfil) {
      return NextResponse.json(
        { error: 'Perfil no encontrado' },
        { status: 404 }
      );
    }

    // Estructurar la respuesta
    const response = {
      perfil: {
        id: perfil.id,
        nombres: perfil.nombres,
        apellidos: perfil.apellidos,
        cedula: perfil.cedula,
        correo: perfil.correo,
        telefono: perfil.telefono,
        fecha_nacimiento: perfil.fecha_nacimiento,
        genero: perfil.genero,
        direccion: perfil.direccion,
        carrera: perfil.carrera,
        semestre: perfil.semestre,
        creado_en: perfil.creado_en,
      },
      usuario: perfil.user ? {
        id: perfil.user.id,
        email: perfil.user.email,
        nombre: perfil.user.name,
        imagen: perfil.user.image,
      } : null,
      documentos: perfil.perfil_documentos.map(doc => ({
        id: doc.id,
        tipo: doc.tipo,
        nombre: doc.nombre_archivo,
        formato: doc.mime_type,
        tamaño: doc.tamano,
        subido: doc.creado_en,
      })),
      solicitudes: perfil.solicitudes.map(sol => ({
        id: sol.id,
        carrera: sol.carrera,
        estatus: sol.estatus,
        comentarios: sol.comentarios,
        fecha_creacion: sol.fecha_creacion,
        ultima_actualizacion: sol.fecha_actualizacion,
      })),
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error al obtener datos del estudiante:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}