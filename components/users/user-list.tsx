"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Card needs wrapper from actual card component
import { Card as CardComponent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { toggleUserApproval } from "@/actions/users";
import { Plus } from "lucide-react";

interface UserListProps {
  users: any[];
}

export function UserList({ users }: UserListProps) {
  const handleToggleApproval = async (
    userId: string,
    currentStatus: boolean
  ) => {
    const result = await toggleUserApproval(userId, currentStatus);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(
      currentStatus ? "تم إلغاء الموافقة" : "تمت الموافقة على المستخدم"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">المستخدمين</h1>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مستخدم
        </Button>
      </div>
      <CardComponent>
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
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role === "admin" ? "مدير" : "مستخدم"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.approved ? "default" : "destructive"}>
                    {user.approved ? "مفعل" : "غير مفعل"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString("ar")}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleApproval(user.id, user.approved)}
                  >
                    {user.approved ? "إلغاء التفعيل" : "تفعيل"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardComponent>
    </div>
  );
}
