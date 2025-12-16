"use server";

import { createClient } from "@/lib/supabase/server";
import { Expense } from "@/lib/supabase";

interface Filters {
  year?: number;
  month?: number;
  from?: string;
  to?: string;
  minAmount?: number;
  maxAmount?: number;
  categoryId?: number;
}

export async function getMonthlyAverage(year: number): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expenses")
    .select("amount")
    .gte("date", `${year}-01-01`)
    .lte("date", `${year}-12-31`);

  if (error) {
    console.error("Error fetching monthly average:", error);
    return 0;
  }

  if (!data || data.length === 0) return 0;

  const total = data.reduce((acc, item) => acc + Number(item.amount), 0);
  return total / 12; // monthly average
}

export async function getWeeklyAverage(
  year: number,
  month: number
): Promise<number> {
  const supabase = await createClient();

  const start = new Date(year, month - 1, 1).toISOString();
  const end = new Date(year, month, 0).toISOString();

  const { data, error } = await supabase
    .from("expenses")
    .select("amount")
    .gte("date", start)
    .lte("date", end);

  if (error) {
    console.error("Error fetching weekly average:", error);
    return 0;
  }

  if (!data || data.length === 0) return 0;

  const total = data.reduce((acc, item) => acc + Number(item.amount), 0);
  return total / 4; // approximate weekly average
}

// export async function fetchExpenses(
//   filters: Filters,
//   page: number,
//   pageSize = 10
// ) {
//   const supabase = await createClient();
//   let query = supabase
//     .from("expenses")
//     .select("*, category:category_id(name,color)")
//     .order("date", { ascending: false });

//   // Date filters
//   if (filters.from) query = query.gte("date", filters.from);
//   if (filters.to) query = query.lte("date", filters.to);
//   if (filters.year && !filters.from && !filters.to)
//     query = query
//       .gte("date", `${filters.year}-01-01`)
//       .lte("date", `${filters.year}-12-31`);
//   if (filters.month && !filters.from && !filters.to && filters.year) {
//     query = query.gte(
//       "date",
//       `${filters.year}-${String(filters.month).padStart(2, "0")}-01`
//     );
//     query = query.lte(
//       "date",
//       `${filters.year}-${String(filters.month).padStart(2, "0")}-31`
//     );
//   }

//   if (filters.minAmount) query = query.gte("amount", filters.minAmount);
//   if (filters.maxAmount) query = query.lte("amount", filters.maxAmount);
//   if (filters.categoryId) query = query.eq("category_id", filters.categoryId);

//   const { data, error, count } = await query
//     .range((page - 1) * pageSize, page * pageSize - 1)
//     .maybeSingle();

//   if (error) {
//     console.error(error);
//     return { expenses: [], total: 0, categoryData: [] };
//   }

//   const expenses = data || [];

//   // Total amount
//   const total = expenses.reduce((acc: number, e: Expense) => acc + e.amount, 0);

//   // Pie chart data
//   const categoryMap: Record<string, { value: number; color: string }> = {};
//   expenses.forEach((e: any) => {
//     if (!e.category) return;
//     if (!categoryMap[e.category.name])
//       categoryMap[e.category.name] = {
//         value: 0,
//         color: e.category.color || "#8884d8",
//       };
//     categoryMap[e.category.name].value += e.amount;
//   });
//   const categoryData = Object.entries(categoryMap).map(
//     ([name, { value, color }]) => ({ name, value, color })
//   );
//   console.log(categoryData, expenses, total);

//   return { expenses, total, categoryData };
// }

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*");
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export async function getFilteredExpenses(filters: any) {
  const supabase = await createClient();
  let query = supabase.from("expenses").select(`*, category:category_id(name)`);

  // if (filters.category) query = query.eq("category_id", filters.category);
  if (filters.category && filters.category.length > 0) {
    query = query.in("category_id", filters.category);
  }

  if (filters.year && !filters.from && !filters.to) {
    query = query
      .gte("date", `${filters.year}-01-01`)
      .lte("date", `${filters.year}-12-31`);
  }

  if (filters.month && !filters.from && !filters.to) {
    const year = filters.year || new Date().getFullYear();
    const start = new Date(year, filters.month - 1, 1).toISOString();
    const end = new Date(year, filters.month, 0).toISOString();
    query = query.gte("date", start).lte("date", end);
  }

  if (filters.from) {
    query = query.gte(
      "date",
      filters.from.toISOString().split("T")[0] // YYYY-MM-DD
    );
  }

  if (filters.to) {
    query = query.lte("date", filters.to.toISOString().split("T")[0]);
  }

  if (filters.minAmount) query = query.gte("amount", filters.minAmount);
  if (filters.maxAmount) query = query.lte("amount", filters.maxAmount);

  const { data, error } = await query.order("date", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((exp) => ({
    ...exp,
    category_name: exp.category?.name,
  }));
}
