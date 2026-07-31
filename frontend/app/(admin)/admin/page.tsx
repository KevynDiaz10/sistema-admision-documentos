"use client";

import { useMemo, useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  GraduationCap,
  ChevronRight,
  LogOut,
  FileText,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ============================================================
// TIPOS
// ============================================================
type Estatus = 'pendiente' | 'aprobado' | 'rechazado';

interface Perfil {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  correo: string;
  telefono: string;
  carrera: string;
  semestre: string | null;
}

interface Solicitud {
  id: number;
  id_perfil: number;
  estatus: Estatus;
  carrera: string;
  comentarios: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  perfiles: Perfil;
}

interface AdminState {
  data: Solicitud[];
  loading: boolean;
  error: string | null;
}

// ============================================================
// CONFIGURACIÓN DE ESTADOS
// ============================================================
const statusConfig: Record<Estatus, {
  label: string;
  className: string;
  icon: typeof Clock;
  bgColor: string;
  dotColor: string;
}> = {
  pendiente: {
    label: 'Pendiente',
    className: 'border-amber-500/30 text-amber-600 bg-amber-50 dark:bg-amber-950/30',
    icon: Clock,
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    dotColor: 'bg-amber-500',
  },
  aprobado: {
    label: 'Aprobado',
    className: 'border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
    icon: CheckCircle2,
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    dotColor: 'bg-emerald-500',
  },
  rechazado: {
    label: 'Rechazado',
    className: 'border-red-500/30 text-red-600 bg-red-50 dark:bg-red-950/30',
    icon: XCircle,
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    dotColor: 'bg-red-500',
  },
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function AdminPanel() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [state, setState] = useState<AdminState>({
    data: [],
    loading: true,
    error: null,
  });
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Estatus | "all">("pendiente");

  // Verificar autenticación y rol
  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (sessionStatus === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (session?.user?.role !== "admin") {
      router.push("/unauthorized");
      return;
    }

    fetchStudents();
  }, [sessionStatus, session, router]);

  const fetchAllSolicitudes = async (): Promise<Solicitud[]> => {
    const response = await fetch(`/api/auth/admin/solicitudes`);
    if (!response.ok) throw new Error("Error al obtener solicitudes");
    const data = await response.json();
    return data || [];
  };
  
  const fetchStudents = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const solicitudes = await fetchAllSolicitudes();
      setState({
        data: solicitudes,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Error al cargar los datos",
      }));
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login', redirect: true });
  };

  const getUserInitials = () => {
    if (session?.user?.name) {
      const names = session.user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return session.user.name.substring(0, 2).toUpperCase();
    }
    return 'AD';
  };

  // Estadísticas
  const counts = useMemo(
    () => ({
      total: state.data.length,
      pending: state.data.filter((s) => s.estatus === "pendiente").length,
      approved: state.data.filter((s) => s.estatus === "aprobado").length,
      rejected: state.data.filter((s) => s.estatus === "rechazado").length,
    }),
    [state.data],
  );

  // Filtrado
  const filtered = useMemo(() => {
    return state.data.filter((s) => {
      const matchStatus = tab === "all" || s.estatus === tab;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        s.perfiles.nombres.toLowerCase().includes(q) ||
        s.perfiles.apellidos.toLowerCase().includes(q) ||
        s.perfiles.cedula.includes(q) ||
        s.id.toString().includes(q) ||
        s.carrera.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [state.data, tab, query]);

  // Estado de carga
  if (sessionStatus === "loading" || state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-800 via-blue-900 to-blue-950">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
          <p className="mt-4 text-sm text-white/80">
            {sessionStatus === "loading" ? "Verificando sesión..." : "Cargando solicitudes..."}
          </p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (state.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-800 via-blue-900 to-blue-950">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-4 text-lg font-semibold text-white">Error al cargar los datos</h2>
          <p className="mt-2 text-sm text-white/70">{state.error}</p>
          <button
            onClick={fetchStudents}
            className="mt-4 rounded-md bg-white/20 px-4 py-2 text-sm text-white hover:bg-white/30 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-800 via-blue-900 to-blue-950">
      <Toaster position="top-right" richColors />

      {/* ===== HEADER ===== */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight text-white">
                Panel de Admisiones
              </h1>
              <p className="text-xs text-white/70">
                Revisión de solicitudes de estudiantes
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="gap-1.5 border-amber-500/30 bg-amber-500/20 text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              {counts.pending} por revisar
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/10">
                  <Avatar className="h-8 w-8 ring-2 ring-white/20">
                    {session?.user?.image ? (
                      <AvatarImage src={session.user.image} alt={session.user.name || "Admin"} />
                    ) : (
                      <AvatarFallback className="bg-white/20 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user?.name || "Administrador"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user?.email || "admin@example.com"}
                    </p>
                    {session?.user?.role === "admin" && (
                      <Badge variant="secondary" className="mt-1 w-fit text-xs">
                        Administrador
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* Tarjetas de estadísticas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Solicitudes"
            value={counts.total}
            icon={FileText}
            tone="text-blue-300"
            bgTone="bg-white/10"
          />
          <StatCard
            label="Pendientes"
            value={counts.pending}
            icon={Clock}
            tone="text-amber-300"
            bgTone="bg-amber-500/20"
          />
          <StatCard
            label="Aprobados"
            value={counts.approved}
            icon={UserCheck}
            tone="text-emerald-300"
            bgTone="bg-emerald-500/20"
          />
          <StatCard
            label="Rechazados"
            value={counts.rejected}
            icon={UserX}
            tone="text-red-300"
            bgTone="bg-red-500/20"
          />
        </div>

        {/* Lista de solicitudes */}
        <Card className="mt-6 border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base text-white">Solicitudes</CardTitle>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Buscar por nombre, cédula o carrera..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-8 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40"
                />
              </div>
            </div>

            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as Estatus | "all")}
              className="mt-3"
            >
              <TabsList className="bg-white/10 border border-white/10">
                <TabsTrigger 
                  value="pendiente"
                  className="data-[state=active]:bg-amber-500/30 data-[state=active]:text-amber-300 text-white/70"
                >
                  Pendientes ({counts.pending})
                </TabsTrigger>
                <TabsTrigger 
                  value="aprobado"
                  className="data-[state=active]:bg-emerald-500/30 data-[state=active]:text-emerald-300 text-white/70"
                >
                  Aprobados ({counts.approved})
                </TabsTrigger>
                <TabsTrigger 
                  value="rechazado"
                  className="data-[state=active]:bg-red-500/30 data-[state=active]:text-red-300 text-white/70"
                >
                  Rechazados ({counts.rejected})
                </TabsTrigger>
                <TabsTrigger 
                  value="all"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                >
                  Todos ({counts.total})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-2 p-3 pt-0">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-12">
                <FileText className="h-12 w-12 text-white/30" />
                <p className="mt-3 text-sm text-white/60">
                  {state.data.length === 0
                    ? "No hay solicitudes registradas en el sistema"
                    : "Sin solicitudes en esta vista"}
                </p>
              </div>
            )}

            {filtered.map((solicitud) => {
              const config = statusConfig[solicitud.estatus];
              const Icon = config.icon;

              return (
                <Link
                  key={solicitud.id_perfil}
                  href={`/admin/solicitud/${solicitud.id_perfil}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-lg"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-white">
                        {solicitud.perfiles.nombres} {solicitud.perfiles.apellidos}
                      </p>
                      <Badge
                        variant="outline"
                        className={`gap-1.5 ${config.className}`}
                      >
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>
                    <p className="mt-1 flex items-center gap-2 text-xs text-white/60">
                      <span className="font-mono">#{solicitud.id}</span>
                      <span>·</span>
                      <span>{solicitud.carrera}</span>
                      <span>·</span>
                      <span>C.I: {solicitud.perfiles.cedula}</span>
                      <span>·</span>
                      <span>{new Date(solicitud.fecha_actualizacion).toLocaleDateString('es-ES')}</span>
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40 shrink-0" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// ============================================================
// COMPONENTE STATCARD
// ============================================================
function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  bgTone,
}: {
  label: string;
  value: number;
  icon: typeof Clock;
  tone: string;
  bgTone: string;
}) {
  return (
    <Card className={`border-white/10 ${bgTone} backdrop-blur-sm shadow-lg transition-transform hover:scale-[1.02]`}>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-white/70">{label}</p>
          <p className={`mt-1 text-3xl font-bold ${tone}`}>{value}</p>
        </div>
        <div className={`rounded-full p-3 ${bgTone}`}>
          <Icon className={`h-6 w-6 ${tone}`} />
        </div>
      </CardContent>
    </Card>
  );
}