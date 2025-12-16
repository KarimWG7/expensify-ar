"use server";

import { createClient } from "@/lib/supabase/server";
import {
  categorySchema,
  type CategoryFormData,
} from "@/lib/validations/category";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createCategory(formData: CategoryFormData) {
  const result = categorySchema.safeParse(formData);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("categories").insert({
    ...result.data,
    user_id: user.id,
    expenses_count: 0,
    total_expenses_amount: 0,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/categories");
  return { success: true };
}

export async function updateCategory(id: number, formData: CategoryFormData) {
  const result = categorySchema.safeParse(formData);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("categories")
    .update(result.data)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/categories");
  return { success: true };
}

export async function deleteCategory(id: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/categories");
  return { success: true };
}
