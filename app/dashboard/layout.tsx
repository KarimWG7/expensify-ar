"use client";

// import { Sidebar } from "@/components/shared/sidebar";
// import { Topbar } from "@/components/shared/topbar";
import { AuthProvider } from "@/components/shared/auth-provider";
import { AppSidebar } from "@/components/shared/new-sidebar";
import { Topbar } from "@/components/shared/new-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto bg-background p-6">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
