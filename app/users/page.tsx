"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function UsersPage() {
  const { user: currentUser } = useAppStore();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      loadUsers();
    }
  }, [currentUser]);

  const loadUsers = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers(data || []);
  };

  const toggleApproval = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("users")
      .update({ approved: !currentStatus })
      .eq("id", userId);

    if (error) {
      toast.error("حدث خطأ");
      return;
    }

    toast.success(currentStatus ? "تم إلغاء الموافقة" : "تمت الموافقة على المستخدم");
    loadUsers();
  };

  if (currentUser?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-muted-foreground">غير مصرح لك بالوصول إلى هذه الصفحة</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">المستخدمين</h1>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مستخدم
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>الدور</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>تاريخ الإنشاء</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? "مدير" : "مستخدم"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.approved ? "default" : "destructive"}>
                    {user.approved ? "مفعل" : "غير مفعل"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString("ar")}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleApproval(user.id, user.approved)}
                  >
                    {user.approved ? "إلغاء التفعيل" : "تفعيل"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
