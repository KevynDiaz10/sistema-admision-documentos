"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Document } from "./components/documents";
import { useEffect, useState } from "react";

export default function Page() {
  const { data: session } = useSession();
  const [documentos, setDocumentos] = useState<any>(null);
  const [loading, setLoading] = useState(false);

 
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-sky-800 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <span className="text-gray-300 text-sm">Dashboard</span>
          </div>
        </header>
        <div className="p-2 flex gap-3">
          <section>
            <div className="w-[310px] h-full p-4 bg-[#1E293B] border border-[#27344a] rounded-lg space-y-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-10 h-10 rounded-full" />
                </div>
                <p className="text-slate-400 text-sm">{session?.user?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-white text-sm">
                  Carrera:{" "}
                  <span className="text-slate-400 font-medium">
                    Informática
                  </span>
                </p>
                <p className="text-white text-sm">
                  Identidad:{" "}
                  <span className="text-slate-400 font-medium">31.285257</span>
                </p>
                <p className="text-white text-sm">
                  Modalidad:{" "}
                  <span className="text-slate-400 font-medium">virtual</span>
                </p>
              </div>
            </div>
          </section>
          {loading? documentos.map((item: any) => (
            <Document
              key={item.tipo_documento}
              titulo={item.tipo_documento}
              state={item.estado}
            />
          )): <p>Cargando documentos...</p>}
        </div>
        <div className="p-2">
          <h1>Recientes</h1>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
