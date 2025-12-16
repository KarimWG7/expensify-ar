"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createUser } from "@/actions/auth";
import { useUsersStore } from "@/lib/store/users-store";
import { toast } from "sonner";

export function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
  const addUser = useUsersStore((s) => s.addUser);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);

    startTransition(async () => {
      const res = await createUser(null, formData);

      if (res?.error || !res.user) {
        setError(res.error);
        return;
      }

      addUser(res.user);
      toast.success("تم إنشاء المستخدم بنجاح");
      onSuccess(); // 👈 close dialog
    });
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>إضافة مستخدم جديد</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <Input
            name="email"
            type="email"
            placeholder="البريد الإلكتروني"
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="كلمة المرور"
            required
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="تأكيد كلمة المرور"
            required
          />

          <Select name="role" defaultValue="user">
            <SelectTrigger>
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">مستخدم</SelectItem>
              <SelectItem value="admin">مسؤول</SelectItem>
            </SelectContent>
          </Select>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "جارٍ الإضافة..." : "إضافة المستخدم"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
