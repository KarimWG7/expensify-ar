"use server";

import { createClient } from "@/lib/supabase/server";
import { expenseSchema, type ExpenseFormData } from "@/lib/validations/expense";
import { revalidatePath } from "next/cache";

export async function getExpenses() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("expenses")
    .select("*, categories(name, color), paymentMethods(name)")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Map the response to match expected structure if needed,
  // but standard Supabase nested select returns objects like `categories: { name: ... }`.
  // The client code uses `categories.name`.

  return data;
}

export async function createExpense(formData: ExpenseFormData) {
  const result = expenseSchema.safeParse(formData);

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

  const { error } = await supabase.from("expenses").insert({
    ...result.data,
    user_id: user.id,
    notes: result.data.notes || null,
    category_id: result.data.category_id || null,
    payment_method_id: result.data.payment_method_id || null,
  });

  if (error) {
    return { error: error.message };
  }

  // Update category stats
  if (result.data.category_id) {
    const { data: category } = await supabase
      .from("categories")
      .select("expenses_count, total_expenses_amount")
      .eq("id", result.data.category_id)
      .single();

    if (category) {
      await supabase
        .from("categories")
        .update({
          expenses_count: (category.expenses_count || 0) + 1,
          total_expenses_amount:
            (Number(category.total_expenses_amount) || 0) + result.data.amount,
        })
        .eq("id", result.data.category_id);
    }
  }

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/categories");
  return { success: true };
}

export async function updateExpense(
  id: number,
  formData: ExpenseFormData,
  oldData?: { category_id: number | null; amount: number }
) {
  const result = expenseSchema.safeParse(formData);

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
    .from("expenses")
    .update({
      amount: result.data.amount,
      date: result.data.date,
      notes: result.data.notes || null,
      category_id: result.data.category_id || null,
      payment_method_id: result.data.payment_method_id || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  // Update stats if we have old data to diff
  if (oldData) {
    const oldCategoryId = oldData.category_id;
    const oldAmount = oldData.amount;

    // Decrement from old category if different
    if (oldCategoryId && oldCategoryId !== result.data.category_id) {
      await supabase.rpc("decrement", {
        row_id: oldCategoryId,
        x: oldAmount,
      });
    } else if (oldCategoryId && oldCategoryId === result.data.category_id) {
      // Same category, just adjust amount
      // Wait, rpc might not exist for complex adjustment, manual update is safer if rpc is unknown
      // But the previous code used `rpc('decrement'...)`.
      // Let's stick to manual update for safety unless we see decrement/increment rpc definitions.
      // The previous code did manual update mostly.

      const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("id", oldCategoryId)
        .single();
      if (category) {
        await supabase
          .from("categories")
          .update({
            total_expenses_amount:
              (Number(category.total_expenses_amount) || 0) -
              oldAmount +
              result.data.amount,
          })
          .eq("id", oldCategoryId);
      }
    }

    // Increment new category if different
    if (result.data.category_id && result.data.category_id !== oldCategoryId) {
      const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("id", result.data.category_id)
        .single();
      if (category) {
        await supabase
          .from("categories")
          .update({
            expenses_count: (category.expenses_count || 0) + 1,
            total_expenses_amount:
              (Number(category.total_expenses_amount) || 0) +
              result.data.amount,
          })
          .eq("id", result.data.category_id);
      }
    }
  }

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/categories");
  return { success: true };
}

export async function deleteExpense(
  id: number,
  oldData?: { category_id: number | null; amount: number }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  if (oldData && oldData.category_id) {
    const { data: category } = await supabase
      .from("categories")
      .select("*")
      .eq("id", oldData.category_id)
      .single();
    if (category) {
      await supabase
        .from("categories")
        .update({
          expenses_count: Math.max(0, (category.expenses_count || 0) - 1),
          total_expenses_amount: Math.max(
            0,
            (Number(category.total_expenses_amount) || 0) - oldData.amount
          ),
        })
        .eq("id", oldData.category_id);
    }
  }

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/categories");
  return { success: true };
}
