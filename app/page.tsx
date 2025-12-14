"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (userData && userData.approved) {
          setUser(userData);
          router.push("/dashboard");
        }
      }
    };
    checkSession();
  }, [router, setUser]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        toast.error("خطأ في تسجيل الدخول");
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .maybeSingle();

        console.log(userError, userData);

        if (userError || !userData) {
          toast.error("المستخدم غير موجود");
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        if (!userData.approved) {
          toast.error("حسابك غير مفعل. يرجى الانتظار حتى يتم الموافقة عليه");
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        setUser(userData);
        toast.success("تم تسجيل الدخول بنجاح");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("حدث خطأ غير متوقع");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">مرحبًا بعودتك</CardTitle>
          <CardDescription>سجل الدخول إلى حسابك لإدارة نفقاتك</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
