"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/validations/auth";
import { updatePassword } from "@/actions/auth";

export function SettingsClient() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      const result = await updatePassword(data.newPassword);
      if (result.error) {
        toast.error("حدث خطأ في تغيير كلمة المرور");
        return;
      }

      toast.success("تم تغيير كلمة المرور بنجاح");
      reset();
    } catch (error) {
      toast.error("حدث خطأ في تغيير كلمة المرور");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">الإعدادات</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>تغيير كلمة المرور</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>كلمة المرور الجديدة</Label>
              <Input type="password" {...register("newPassword")} />
              {errors.newPassword && (
                <p className="text-sm text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div>
              <Label>تأكيد كلمة المرور</Label>
              <Input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              تغيير كلمة المرور
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
