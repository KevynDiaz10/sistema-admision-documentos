"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  IdCard,
  BookOpen,
  BadgeCheck,
  Download,
  Eye,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Upload,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { signOut } from "next-auth/react";

interface Documento {
  id: number;
  tipo: string;
  nombre: string;
  formato: string;
  tamaño: number;
  subido: string;
}

interface Solicitud {
  id: number;
  carrera: string;
  estatus: 'pendiente' | 'aprobado' | 'rechazado';
  comentarios: string | null;
  fecha_creacion: string;
  ultima_actualizacion: string;
}

interface DatosEstudiante {
  perfil: {
    id: number;
    nombres: string;
    apellidos: string;
    cedula: string;
    correo: string;
    telefono: string;
    fecha_nacimiento: string;
    genero: string;
    direccion: string;
    carrera: string;
    semestre: string;
    creado_en: string;
  };
  usuario: {
    id: string;
    email: string;
    nombre: string;
    imagen: string | null;
  } | null;
  documentos: Documento[];
  solicitudes: Solicitud[];
}

const tipoDocumentoLabels: Record<string, string> = {
  fondoNegro: "Fondo Negro",
  cedulaFile: "Cédula de Identidad",
  notas: "Notas Certificadas",
  fotoCarnet: "Foto Carnet",
  titulo: "Título de Bachiller",
};

const generoLabels: Record<string, string> = {
  masculino: "Masculino",
  femenino: "Femenino",
  otro: "Otro",
};

const statusConfig = {
  pendiente: {
    label: 'Pendiente',
    className: 'border-amber-500/30 text-amber-400 bg-amber-500/20',
    icon: Clock,
  },
  aprobado: {
    label: 'Aprobado',
    className: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/20',
    icon: CheckCircle2,
  },
  rechazado: {
    label: 'Rechazado',
    className: 'border-red-500/30 text-red-400 bg-red-500/20',
    icon: XCircle,
  },
};

export default function Page() {
  const { data: session } = useSession();
  const [datos, setDatos] = useState<DatosEstudiante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentoAReemplazar, setDocumentoAReemplazar] = useState<Documento | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDatosEstudiante = async () => {
    try {
      setError(null);
      const response = await fetch('/api/auth/estudiante');
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      setDatos(data);
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudieron cargar los datos del estudiante');
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchDatosEstudiante();
    }
  }, [session]);

  const handleDownloadDocument = async (documento: Documento) => {
    try {
      const response = await fetch(`/api/auth/admin/documentos/${documento.id}`);
      if (!response.ok) throw new Error('Error al descargar');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = documento.nombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Documento descargado");
    } catch (error) {
      toast.error("Error al descargar el documento");
    }
  };

  const handleViewDocument = (documento: Documento) => {
    window.open(`/api/auth/admin/documentos/${documento.id}`, '_blank');
  };

  const handleReplaceClick = (documento: Documento) => {
    setDocumentoAReemplazar(documento);
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, 100);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    if (!archivo || !documentoAReemplazar) {
      setDocumentoAReemplazar(null);
      return;
    }

    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!tiposPermitidos.includes(archivo.type)) {
      toast.error('Solo se permiten archivos PDF, JPEG y PNG');
      setDocumentoAReemplazar(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      toast.error('El archivo no debe superar los 5MB');
      setDocumentoAReemplazar(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);

      const response = await fetch(`/api/auth/admin/documentos/${documentoAReemplazar.id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al reemplazar el documento');
      }
      
      toast.success(result.mensaje || 'Documento actualizado correctamente');
      
      if (result.solicitudActualizada) {
        toast.info('Tu solicitud ha vuelto a estado pendiente para revisión');
      }

      await fetchDatosEstudiante();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al reemplazar el documento');
    } finally {
      setIsProcessing(false);
      setDocumentoAReemplazar(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const canModifyDocument = () => {
    if (!datos?.solicitudes.length) return false;
    const ultimaSolicitud = datos.solicitudes[0];
    return ultimaSolicitud.estatus === 'rechazado';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-800 via-blue-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-white/60" />
          <p className="mt-4 text-white/80">Cargando tus datos...</p>
        </div>
      </div>
    );
  }

  if (error || !datos) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-800 via-blue-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <p className="mt-4 text-white/80">{error || 'Error al cargar los datos'}</p>
        </div>
      </div>
    );
  }

  const puedeModificar = canModifyDocument();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-800 via-blue-900 to-blue-950">
      <Toaster position="top-right" richColors />
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileSelect}
      />
      
      {/* Header con logout */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm flex h-16 shrink-0 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-white/80 text-sm font-medium">Dashboard</span>
        </div>
        <Button
          onClick={handleLogout}
          className="bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200 border border-red-500/30"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 overflow-auto max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Bienvenido, {datos.perfil.nombres}
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Panel de control de tu proceso de admisión
          </p>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <User className="h-4 w-4" />
              Mis Datos Personales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow icon={User} label="Nombre Completo" value={`${datos.perfil.nombres} ${datos.perfil.apellidos}`} highlight />
              <InfoRow icon={IdCard} label="Cédula" value={datos.perfil.cedula} />
              <InfoRow icon={Mail} label="Correo" value={datos.perfil.correo} />
              <InfoRow icon={Phone} label="Teléfono" value={datos.perfil.telefono} />
              <InfoRow icon={BookOpen} label="Carrera" value={datos.perfil.carrera} />
              <InfoRow icon={GraduationCap} label="Semestre" value={datos.perfil.semestre || 'No especificado'} />
              <InfoRow icon={Calendar} label="Fecha Nacimiento" value={datos.perfil.fecha_nacimiento ? formatDate(datos.perfil.fecha_nacimiento) : 'No disponible'} />
              <InfoRow icon={BadgeCheck} label="Género" value={generoLabels[datos.perfil.genero] || datos.perfil.genero || 'No especificado'} />
              <InfoRow icon={MapPin} label="Dirección" value={datos.perfil.direccion || 'No especificada'} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <FileText className="h-4 w-4" />
              Estado de Solicitudes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {datos.solicitudes.length > 0 ? (
              <div className="space-y-3">
                {datos.solicitudes.map((solicitud) => {
                  const config = statusConfig[solicitud.estatus];
                  const StatusIcon = config.icon;
                  return (
                    <div
                      key={solicitud.id}
                      className="rounded-lg border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            Solicitud #{solicitud.id}
                          </span>
                          <Badge className={`gap-1.5 ${config.className}`}>
                            <StatusIcon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                        </div>
                        <span className="text-xs text-white/50">
                          {formatDate(solicitud.fecha_creacion)}
                        </span>
                      </div>
                      <p className="text-sm text-white/70">
                        Carrera: {solicitud.carrera}
                      </p>
                      {solicitud.comentarios && (
                        <div className="mt-2 rounded bg-white/5 border border-white/10 p-2">
                          <p className="text-xs text-white/60">Comentarios:</p>
                          <p className="text-sm text-white/80">{solicitud.comentarios}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-white/20" />
                <p className="mt-2 text-sm text-white/50">
                  No tienes solicitudes registradas
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <FileText className="h-4 w-4" />
              Mis Documentos
            </CardTitle>
            <p className="text-sm text-white/60">
              {datos.documentos.length} documento{datos.documentos.length !== 1 ? 's' : ''} cargado{datos.documentos.length !== 1 ? 's' : ''}
            </p>
          </CardHeader>
          <CardContent>
            {datos.documentos.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {datos.documentos.map((doc) => {
                  const isImage = doc.formato.startsWith('image/');
                  
                  return (
                    <div
                      key={doc.id}
                      className="group rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {isImage ? (
                            <ImageIcon className="h-5 w-5 text-blue-300" />
                          ) : (
                            <FileText className="h-5 w-5 text-blue-300" />
                          )}
                          <span className="text-sm font-medium text-white">
                            {tipoDocumentoLabels[doc.tipo] || doc.tipo}
                          </span>
                        </div>
                        <Badge className="border-white/20 bg-white/10 text-white/70 text-xs">
                          {doc.formato.toUpperCase().includes("WORDPROCESSINGML")? "DOCX" : doc.formato.split('/')[1]?.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-white/50 mb-1 truncate" title={doc.nombre}>
                        {doc.nombre}
                      </p>
                      
                      <p className="text-xs text-white/40 mb-3">
                        {formatFileSize(doc.tamaño)} • {formatDate(doc.subido)}
                      </p>
                      
                      <div className="flex gap-2 mb-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600/40 text-blue-200 hover:bg-blue-600/60 hover:text-white border border-blue-500/30 transition-all"
                          onClick={() => handleViewDocument(doc)}
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600/40 text-emerald-200 hover:bg-emerald-600/60 hover:text-white border border-emerald-500/30 transition-all"
                          onClick={() => handleDownloadDocument(doc)}
                        >
                          <Download className="mr-1 h-3.5 w-3.5" />
                          Descargar
                        </Button>
                      </div>

                      {puedeModificar && (
                        <Button
                          size="sm"
                          className="w-full bg-amber-600/40 text-amber-200 hover:bg-amber-600/60 hover:text-white border border-amber-500/30 transition-all"
                          onClick={() => handleReplaceClick(doc)}
                          disabled={isProcessing}
                        >
                          <Upload className="mr-1 h-3.5 w-3.5" />
                          Cambiar
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-white/20" />
                <p className="mt-2 text-sm text-white/50">
                  No has cargado documentos todavía
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: typeof User;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
      highlight 
        ? 'border-white/20 bg-white/10' 
        : 'border-white/10 bg-white/5 hover:bg-white/10'
    }`}>
      <Icon className="mt-0.5 h-4 w-4 text-white/50 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-white/50">{label}</p>
        <p className="truncate text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}