"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Check if admin
  const { data: currentUser } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentUser?.role !== "admin") {
    throw new Error("Forbidden");
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function toggleUserApproval(
  userId: string,
  currentStatus: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check if admin
  const { data: currentUser } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentUser?.role !== "admin") {
    return { error: "Forbidden" };
  }

  const { error } = await supabase
    .from("users")
    .update({ approved: !currentStatus })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/users");
  return { success: true };
}
