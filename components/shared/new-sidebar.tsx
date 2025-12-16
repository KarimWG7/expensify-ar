"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Receipt,
  FolderKanban,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Wallet,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { signOut } from "@/actions/auth";
import { toast } from "sonner";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, setUser } = useAppStore();

  const isAdmin = user?.role === "admin";

  const routes = [
    { label: "لوحة التحكم", icon: LayoutDashboard, href: "/dashboard" },
    { label: "المصروفات", icon: Receipt, href: "/expenses" },
    { label: "الفئات", icon: FolderKanban, href: "/categories" },
    { label: "التقارير", icon: BarChart3, href: "/reports" },
    ...(isAdmin ? [{ label: "المستخدمين", icon: Users, href: "/users" }] : []),
    { label: "الإعدادات", icon: Settings, href: "/settings" },
  ];

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    toast.success("تم تسجيل الخروج بنجاح");
  };

  return (
    <Sidebar side="right">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-3">
          <Wallet className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">إكسبنسيفاي</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => {
            const Icon = route.icon;
            const active = pathname === route.href;

            return (
              <SidebarMenuItem key={route.href}>
                <SidebarMenuButton asChild isActive={active}>
                  <Link href={route.href} className="flex gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{route.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
