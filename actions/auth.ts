"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function login(formData: LoginFormData) {
  const supabase = await createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { error: "Incorrect email or password" };
  }

  if (session) {
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();
    if (!user) {
      await supabase.auth.signOut();
      return { error: "User record not found" };
    }
    if (!user.approved) {
      await supabase.auth.signOut();
      return { error: "Account not approved" };
    }
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function updatePassword(password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function createUser(_: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as "admin" | "user";

  if (!email || !password || !confirmPassword) {
    return { error: "كل الحقول مطلوبة" };
  }

  if (password !== confirmPassword) {
    return { error: "كلمتي المرور غير متطابقتان" };
  }

  // 1️⃣ Create auth user
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    console.log(error);
    return { error: error?.message || "فشل اضافة المستخدم" };
  }

  // 2️⃣ Insert into public.users
  const { error: dbError } = await supabaseAdmin.from("users").insert({
    id: data.user.id,
    email,
    role,
    approved: true,
  });

  if (dbError) {
    console.log(dbError);
    return { error: dbError.message };
  }

  return {
    success: true,
    user: {
      id: data.user.id,
      email,
      role,
      approved: true,
      created_at: new Date().toISOString(),
    },
  };
}

export async function deleteUser(userId: string) {
  if (!userId) {
    return { error: "معرف المستخدم غير صالح" };
  }

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
    userId
  );

  if (authError) {
    return { error: authError.message };
  }

  const { error: dbError } = await supabaseAdmin
    .from("users")
    .delete()
    .eq("id", userId);

  if (dbError) {
    return { error: dbError.message };
  }

  return { success: true };
}
