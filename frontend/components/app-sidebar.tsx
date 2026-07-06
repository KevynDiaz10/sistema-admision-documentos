"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookCheck,
  BookOpen,
  Bot,
  Command,
  Files,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import { signOut } from "next-auth/react";

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Documentos",
      url: "#",
      icon: Files,
      isActive: true,
      items: [
        {
          title: "Asignar",
          url: "#",
        },
        {
          title: "Revisar",
          url: "#",
        },
        {
          title: "Actualizar",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="text-white">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Collapsible>
          <SidebarMenuItem onClick={() => signOut()}>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="Logout" className="bg-red-500/80 hover:bg-red-500/70">
                <LogOut />
                <span>logout</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
