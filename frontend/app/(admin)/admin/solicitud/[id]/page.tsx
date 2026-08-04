"use client";

import { notFound, useRouter } from "next/navigation";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  Hash,
  BadgeCheck,
  CalendarDays,
  RotateCcw,
  MessageSquare,
  FileText,
  Download,
  Eye,
  Image as ImageIcon,
  IdCard,
  BookOpen,
  Home,
  Cake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

// ============================================================
// TIPOS
// ============================================================
type Estatus = "pendiente" | "aprobado" | "rechazado";

interface DocumentoEstudiante {
  id: number;
  tipo: string;
  nombre_archivo: string;
  mime_type: string;
  tamano: number;
  creado_en: string;
}

interface SolicitudData {
  id: number;
  id_perfil: number | null;
  estatus: Estatus | null;
  carrera: string | null;
  comentarios: string | null;
  fecha_creacion: string | null;
  fecha_actualizacion: string | null;
  perfiles: {
    id: number;
    nombres: string;
    apellidos: string;
    cedula: string;
    correo: string;
    telefono: string;
    carrera: string;
    semestre: string | null;
    fecha_nacimiento: string | null;
    genero: string | null;
    direccion: string | null;
    perfil_documentos?: DocumentoEstudiante[];
  };
}

// ============================================================
// CONFIGURACIÓN
// ============================================================
const statusConfig: Record<
  Estatus,
  {
    label: string;
    className: string;
    icon: typeof Clock;
    bgCard: string;
  }
> = {
  pendiente: {
    label: "Pendiente",
    className: "border-amber-500/30 text-amber-400 bg-amber-500/20",
    icon: Clock,
    bgCard: "bg-amber-500/10 border-amber-500/20",
  },
  aprobado: {
    label: "Aprobado",
    className: "border-emerald-500/30 text-emerald-400 bg-emerald-500/20",
    icon: CheckCircle2,
    bgCard: "bg-emerald-500/10 border-emerald-500/20",
  },
  rechazado: {
    label: "Rechazado",
    className: "border-red-500/30 text-red-400 bg-red-500/20",
    icon: XCircle,
    bgCard: "bg-red-500/10 border-red-500/20",
  },
};

const tipoDocumentoLabels: Record<string, string> = {
  fondoNegro: "Fondo Negro",
  cedulaFile: "Cédula de Identidad",
  notas: "Notas Certificadas",
  fotoCarnet: "Foto Carnet",
  titulo: "Título de Bachiller",
  partidaNacimiento: "Partida de nacimiento",
  opsu: "Opsu",
};

const generoLabels: Record<string, string> = {
  masculino: "Masculino",
  femenino: "Femenino",
  otro: "Otro",
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
interface PageParams {
  params: Promise<{ id: string }>;
}

export default function SolicitudPage({ params }: PageParams) {
  const { id } = use(params);
  const router = useRouter();

  const [solicitud, setSolicitud] = useState<SolicitudData | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentDraft, setCommentDraft] = useState("");
  const [confirm, setConfirm] = useState<{ status: Estatus } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentoPreview, setDocumentoPreview] =
    useState<DocumentoEstudiante | null>(null);

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/auth/admin/solicitudes?perfilId=${id}`,
        );

        if (!response.ok) throw new Error("Error al cargar los datos");

        const data = await response.json();

        let solicitudData = null;
        if (Array.isArray(data) && data.length > 0) {
          solicitudData = data[0];
        } else if (!Array.isArray(data) && data) {
          solicitudData = data;
        } else {
          throw new Error("No se encontró la solicitud");
        }

        setSolicitud(solicitudData);
        if (solicitudData.comentarios) {
          setCommentDraft(solicitudData.comentarios);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("No se encontró la solicitud");
        setSolicitud(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, [id]);

  // ============================================================
  // MANEJADORES DE DOCUMENTOS
  // ============================================================
  const handleViewDocument = (documento: DocumentoEstudiante) => {
    setDocumentoPreview(documento);
  };

  const handleDownloadDocument = async (documento: DocumentoEstudiante) => {
    try {
      const response = await fetch(
        `/api/auth/admin/documentos/${documento.id}`,
      );

      if (!response.ok) throw new Error("Error al descargar el documento");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = documento.nombre_archivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Documento descargado correctamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al descargar el documento");
    }
  };

  const getDocumentIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return ImageIcon;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ============================================================
  // MANEJADORES DE ESTADO Y COMENTARIOS
  // ============================================================
  const updateStatus = async (status: Estatus) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `/api/auth/admin/solicitudes?id=${solicitud!.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            estatus: status,
            comentarios: commentDraft.trim() || undefined,
          }),
        },
      );

      const text = await response.text();
      if (!text) throw new Error("Respuesta vacía del servidor");

      const result = JSON.parse(text);

      if (!response.ok)
        throw new Error(result.error || "Error al actualizar la solicitud");

      if (result.data) {
        setSolicitud((prev) => ({
          ...result.data,
          perfiles: {
            ...result.data.perfiles,
            perfil_documentos:
              prev?.perfiles.perfil_documentos ||
              result.data.perfiles?.perfil_documentos ||
              [],
          },
        }));
      }

      setConfirm(null);

      toast.success(`Solicitud ${statusConfig[status].label.toLowerCase()}`, {
        description: `La solicitud #${solicitud!.id} ha sido ${statusConfig[status].label.toLowerCase()}`,
      });

      setTimeout(() => router.push("/admin"), 600);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al actualizar la solicitud",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveCommentOnly = async () => {
    if (!commentDraft.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `/api/auth/admin/solicitudes?id=${solicitud!.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            estatus: solicitud!.estatus,
            comentarios: commentDraft.trim(),
          }),
        },
      );

      const text = await response.text();
      if (!text) throw new Error("Respuesta vacía del servidor");

      const result = JSON.parse(text);

      if (!response.ok)
        throw new Error(result.error || "Error al guardar el comentario");

      if (result.data) {
        setSolicitud((prev) => ({
          ...result.data,
          perfiles: {
            ...result.data.perfiles,
            perfil_documentos:
              prev?.perfiles.perfil_documentos ||
              result.data.perfiles?.perfil_documentos ||
              [],
          },
        }));
      }

      toast.success("Comentario guardado");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al guardar el comentario",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "No disponible";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBirthDate = (date: string | null) => {
    if (!date) return "No disponible";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ============================================================
  // ESTADOS DE CARGA Y ERROR
  // ============================================================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-800 via-blue-900 to-blue-950">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
          <p className="mt-4 text-sm text-white/80">Cargando solicitud...</p>
        </div>
      </div>
    );
  }

  if (!solicitud) {
    notFound();
  }

  const estatus = solicitud.estatus || "pendiente";
  const config = statusConfig[estatus];
  const StatusIcon = config.icon;
  const documentos = solicitud.perfiles.perfil_documentos || [];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-800 via-blue-900 to-blue-950">
      <Toaster position="top-right" richColors />

      {/* ===== HEADER ===== */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al panel
          </Link>
          <div className="flex items-center gap-2">
            <Badge className={`gap-1.5 ${config.className}`}>
              <StatusIcon className="h-3.5 w-3.5" />
              {config.label}
            </Badge>
            {estatus !== "pendiente" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirm({ status: "pendiente" })}
                disabled={isSubmitting}
                className="gap-1.5 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Revertir
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-6">
        {/* ===== INFORMACIÓN DE LA SOLICITUD ===== */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-base text-white">
              Información de la Solicitud
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={Hash}
                label="N° Solicitud"
                value={`#${solicitud.id}`}
              />
              <InfoRow
                icon={StatusIcon}
                label="Estado"
                value={config.label}
                valueClassName={config.className.split(" ")[1]}
              />
              <InfoRow
                icon={GraduationCap}
                label="Carrera"
                value={solicitud.carrera || "No especificada"}
              />
              <InfoRow
                icon={Calendar}
                label="Fecha Creación"
                value={formatDate(solicitud.fecha_creacion)}
              />
              <InfoRow
                icon={CalendarDays}
                label="Última Actualización"
                value={formatDate(solicitud.fecha_actualizacion)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ===== DATOS DEL ESTUDIANTE ===== */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <User className="h-4 w-4" />
              Datos del Estudiante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow
                icon={User}
                label="Nombre Completo"
                value={`${solicitud.perfiles.nombres} ${solicitud.perfiles.apellidos}`}
                highlight
              />
              <InfoRow
                icon={IdCard}
                label="Cédula"
                value={solicitud.perfiles.cedula}
              />
              <InfoRow
                icon={Mail}
                label="Correo"
                value={solicitud.perfiles.correo}
              />
              <InfoRow
                icon={Phone}
                label="Teléfono"
                value={solicitud.perfiles.telefono}
              />
              <InfoRow
                icon={BookOpen}
                label="Carrera"
                value={solicitud.perfiles.carrera}
              />
              <InfoRow
                icon={GraduationCap}
                label="Semestre"
                value={solicitud.perfiles.semestre || "No especificado"}
              />
              <InfoRow
                icon={Cake}
                label="Fecha Nacimiento"
                value={formatBirthDate(solicitud.perfiles.fecha_nacimiento)}
              />
              <InfoRow
                icon={BadgeCheck}
                label="Género"
                value={
                  generoLabels[solicitud.perfiles.genero || ""] ||
                  solicitud.perfiles.genero ||
                  "No especificado"
                }
              />
              <InfoRow
                icon={Home}
                label="Dirección"
                value={solicitud.perfiles.direccion || "No especificada"}
              />
            </div>
          </CardContent>
        </Card>

        {/* ===== DOCUMENTOS DEL ESTUDIANTE ===== */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <FileText className="h-4 w-4" />
              Documentos del Estudiante
            </CardTitle>
            <p className="text-sm text-white/60">
              {documentos.length} documento{documentos.length !== 1 ? "s" : ""}{" "}
              cargado{documentos.length !== 1 ? "s" : ""}
            </p>
          </CardHeader>
          <CardContent>
            {documentos.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {documentos.map((doc) => {
                  const DocIcon = getDocumentIcon(doc.mime_type);
                  return (
                    <div
                      key={doc.id}
                      className="group rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <DocIcon className="h-5 w-5 text-blue-300" />
                          <span className="text-sm font-medium text-white">
                            {tipoDocumentoLabels[doc.tipo] || doc.tipo}
                          </span>
                        </div>
                        <Badge className="border-white/20 bg-white/10 text-white/70 text-xs">
                          {doc.mime_type?.includes("wordprocessingml.document")
                            ? "DOCX"
                            : doc.mime_type?.split("/")[1]?.toUpperCase()}
                        </Badge>
                      </div>

                      <p
                        className="text-xs text-white/50 mb-1 truncate"
                        title={doc.nombre_archivo}
                      >
                        {doc.nombre_archivo}
                      </p>

                      <p className="text-xs text-white/40 mb-3">
                        {formatFileSize(doc.tamano)} •{" "}
                        {new Date(doc.creado_en).toLocaleDateString()}
                      </p>

                      <div className="flex gap-2">
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
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-white/20" />
                <p className="mt-2 text-sm text-white/50">
                  No hay documentos cargados para este estudiante
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ===== COMENTARIOS ===== */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <MessageSquare className="h-4 w-4" />
              Comentarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {solicitud.comentarios && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white/60">
                  Comentario actual:
                </h4>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-sm text-white/80 whitespace-pre-wrap">
                    {solicitud.comentarios}
                  </p>
                </div>
              </div>
            )}

            <div
              className={
                solicitud.comentarios ? "border-t border-white/10 pt-4" : ""
              }
            >
              <h4 className="text-sm font-medium text-white/60 mb-2">
                {solicitud.comentarios
                  ? "Editar comentario:"
                  : "Agregar comentario:"}
              </h4>
              <div className="space-y-3">
                <Textarea
                  placeholder="Escribe un comentario sobre esta solicitud..."
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                  rows={4}
                  disabled={isSubmitting}
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-white/40 resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={saveCommentOnly}
                    disabled={
                      !commentDraft.trim() ||
                      isSubmitting ||
                      commentDraft === solicitud.comentarios
                    }
                    className="bg-blue-600/40 text-blue-200 hover:bg-blue-600/60 hover:text-white border border-blue-500/30 transition-all"
                  >
                    {isSubmitting ? "Guardando..." : "Guardar Comentario"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== CAMBIAR ESTADO ===== */}
        <Card className={`backdrop-blur-sm shadow-xl ${config.bgCard}`}>
          <CardHeader>
            <CardTitle className="text-base text-white">
              Cambiar Estado de Admisión
            </CardTitle>
            <p className="text-sm text-white/60">
              Estado actual:{" "}
              <span className="font-medium text-white">{config.label}</span>
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              onClick={() => setConfirm({ status: "pendiente" })}
              disabled={isSubmitting || estatus === "pendiente"}
              className="bg-amber-600/40 text-amber-200 hover:bg-amber-600/60 hover:text-white border border-amber-500/30 transition-all"
            >
              <Clock className="mr-1.5 h-4 w-4" />
              Pendiente
            </Button>

            <Button
              onClick={() => setConfirm({ status: "aprobado" })}
              disabled={isSubmitting || estatus === "aprobado"}
              className="bg-emerald-600/40 text-emerald-200 hover:bg-emerald-600/60 hover:text-white border border-emerald-500/30 transition-all"
            >
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              Aprobar
            </Button>

            <Button
              onClick={() => setConfirm({ status: "rechazado" })}
              disabled={isSubmitting || estatus === "rechazado"}
              className="bg-red-600/40 text-red-200 hover:bg-red-600/60 hover:text-white border border-red-500/30 transition-all"
            >
              <XCircle className="mr-1.5 h-4 w-4" />
              Rechazar
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* ===== VISOR DE DOCUMENTOS ===== */}
      <Dialog
        open={!!documentoPreview}
        onOpenChange={(open) => !open && setDocumentoPreview(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-sky-950 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              {documentoPreview && (
                <>
                  {tipoDocumentoLabels[documentoPreview.tipo] ||
                    documentoPreview.tipo}
                  <Badge className="border-white/20 bg-white/10 text-white/80">
                    {documentoPreview.nombre_archivo}
                  </Badge>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {documentoPreview && (
                <span>
                  {formatFileSize(documentoPreview.tamano)} • Subido el{" "}
                  {new Date(documentoPreview.creado_en).toLocaleDateString()}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto bg-black/20 rounded-lg">
            {documentoPreview && (
              <>
                {documentoPreview.mime_type.startsWith("image/") ? (
                  <div className="flex items-center justify-center p-4">
                    <img
                      src={`/api/auth/admin/documentos/${documentoPreview.id}`}
                      alt={documentoPreview.nombre_archivo}
                      className="max-w-full max-h-[65vh] object-contain rounded-lg"
                      onError={() => toast.error("Error al cargar la imagen")}
                    />
                  </div>
                ) : documentoPreview.mime_type === "application/pdf" || "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                  <div className="w-full h-full min-h-[65vh]">
                    <iframe
                      src={`/api/auth/admin/documentos/${documentoPreview.id}`}
                      className="w-full h-full min-h-[65vh] rounded-lg"
                      title={documentoPreview.nombre_archivo}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-16 w-16 text-white/20" />
                    <p className="mt-4 text-sm text-white/60">
                      Vista previa no disponible para este tipo de archivo
                    </p>
                    <Button
                      className="mt-4 bg-emerald-600/40 text-emerald-200 hover:bg-emerald-600/60 hover:text-white border border-emerald-500/30 transition-all"
                      onClick={() =>
                        documentoPreview &&
                        handleDownloadDocument(documentoPreview)
                      }
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Descargar archivo
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDocumentoPreview(null)}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              Cerrar
            </Button>
            {documentoPreview && (
              <Button
                onClick={() => handleDownloadDocument(documentoPreview)}
                className="bg-emerald-600/40 text-emerald-200 hover:bg-emerald-600/60 hover:text-white border border-emerald-500/30 transition-all"
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== DIÁLOGO DE CONFIRMACIÓN ===== */}
      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent className="bg-sky-950 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              Confirmar: {confirm && statusConfig[confirm.status].label}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {solicitud.perfiles.nombres} {solicitud.perfiles.apellidos} — N°
              Solicitud: {solicitud.id}
              <br />
              <span className="mt-2 block text-sm">
                Estado actual:{" "}
                <span className="font-medium text-white">{config.label}</span>
                <br />
                Nuevo estado:{" "}
                <span
                  className={`font-medium ${
                    confirm?.status === "aprobado"
                      ? "text-emerald-400"
                      : confirm?.status === "rechazado"
                        ? "text-red-400"
                        : "text-amber-400"
                  }`}
                >
                  {confirm && statusConfig[confirm.status].label}
                </span>
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-white/60">Comentario (opcional):</p>
            <Textarea
              placeholder="Agrega un comentario sobre esta decisión..."
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              rows={4}
              disabled={isSubmitting}
              className="border-white/20 bg-white/10 text-white placeholder:text-white/40 resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setConfirm(null)}
              disabled={isSubmitting}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => confirm && updateStatus(confirm.status)}
              disabled={isSubmitting}
              className={
                confirm?.status === "rechazado"
                  ? "bg-red-600/40 text-red-200 hover:bg-red-600/60 hover:text-white border border-red-500/30"
                  : confirm?.status === "aprobado"
                    ? "bg-emerald-600/40 text-emerald-200 hover:bg-emerald-600/60 hover:text-white border border-emerald-500/30"
                    : "bg-amber-600/40 text-amber-200 hover:bg-amber-600/60 hover:text-white border border-amber-500/30"
              }
            >
              {isSubmitting ? "Procesando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// COMPONENTE INFOROW
// ============================================================
function InfoRow({
  icon: Icon,
  label,
  value,
  highlight = false,
  valueClassName,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  highlight?: boolean;
  valueClassName?: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
        highlight
          ? "border-white/20 bg-white/10"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <Icon className="mt-0.5 h-4 w-4 text-white/50 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-white/50">{label}</p>
        <p
          className={`truncate text-sm font-medium text-white ${valueClassName || ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
