"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function Topbar() {
  const { user } = useAppStore();

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="h-16 border-b bg-card px-6 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في المصروفات..."
            className="pr-10"
          />
        </div>
      </div>
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
