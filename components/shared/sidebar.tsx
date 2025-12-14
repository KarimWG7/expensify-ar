"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  FolderKanban,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAppStore();

  const isAdmin = user?.role === "admin";

  const routes = [
    {
      label: "لوحة التحكم",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "المصروفات",
      icon: Receipt,
      href: "/expenses",
      active: pathname === "/expenses",
    },
    {
      label: "الفئات",
      icon: FolderKanban,
      href: "/categories",
      active: pathname === "/categories",
    },
    {
      label: "التقارير",
      icon: BarChart3,
      href: "/reports",
      active: pathname === "/reports",
    },
    ...(isAdmin
      ? [
          {
            label: "المستخدمين",
            icon: Users,
            href: "/users",
            active: pathname === "/users",
          },
        ]
      : []),
    {
      label: "الإعدادات",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("تم تسجيل الخروج بنجاح");
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-card border-l">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Wallet className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">إكسبنسيفاي</h1>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link key={route.href} href={route.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors cursor-pointer",
                  route.active ? "bg-primary text-primary-foreground" : ""
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{route.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-5 w-5" />
          <span>تسجيل الخروج</span>
        </Button>
      </div>
    </div>
  );
}
