"use client"

import Link from "next/link";
import {
  Home,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 font-headline font-semibold text-lg">
          <Logo className="h-6 w-6 text-primary" />
          <span className="hidden group-data-[state=expanded]:inline">Hitched Alert</span>
        </Link>
      </SidebarHeader>
      
      <SidebarMenu className="flex-1">
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={isActive("/")} tooltip="Dashboard">
            <Link href="/">
              <Home />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={isActive("/settings")} tooltip="Settings">
            <Link href="/settings">
              <Settings />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      
      <SidebarFooter>
        {/* Can add user profile section here */}
      </SidebarFooter>
    </Sidebar>
  );
}
