// app/dashboard/page.tsx
"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useState } from "react";

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
      </SidebarInset>
    </SidebarProvider>
  );
}
