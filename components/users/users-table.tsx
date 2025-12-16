"use client";

import { toggleUserApproval } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useUsersStore } from "@/lib/store/users-store";
import { DeleteUserDialog } from "./delete-user-dialog";
import { deleteUser } from "@/actions/auth";

export function UsersTable() {
  const { users, updateUserApproval, removeUser } = useUsersStore();

  const handleToggle = async (id: string, approved: boolean) => {
    const res = await toggleUserApproval(id, approved);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
    updateUserApproval(id, !approved);
    toast.success(approved ? "تم إلغاء التفعيل" : "تم التفعيل");
  };

  const handleDelete = async (id: string) => {
    const res = await deleteUser(id);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
    removeUser(id);
    toast.success("تم حذف المستخدم");
  };

  return (
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

              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggle(user.id, user.approved)}
                >
                  {user.approved ? "إلغاء التفعيل" : "تفعيل"}
                </Button>

                <DeleteUserDialog onConfirm={() => handleDelete(user.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
