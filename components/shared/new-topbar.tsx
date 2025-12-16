"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAppStore } from "@/lib/store";

export function Topbar() {
  const { user } = useAppStore();

  const getInitials = (email: string) => email.substring(0, 2).toUpperCase();

  return (
    <div className="h-16 border-b bg-card px-6 flex items-center justify-between">
      {/* Right side trigger (RTL friendly) */}
      <SidebarTrigger />

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user?.email}</p>
          <p className="text-xs text-muted-foreground">
            {user?.role === "admin" ? "مدير" : "مستخدم"}
          </p>
        </div>
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.email ? getInitials(user.email) : "؟"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
