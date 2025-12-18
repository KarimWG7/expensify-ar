"use server";

import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { cache } from "react";

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

export const getYearlyExpensesReport = async (year: number) => {
  const supabase = await createClient();

  const start = `${year}-01-01`;
  const end = `${year}-12-31`;

  const { data, error } = await supabase
    .from("expenses")
    .select(
      `
        amount,
        category:category_id (
          id,
          name,
          icon,
          color
        )
      `
    )
    .gte("date", start)
    .lte("date", end);

  if (error) {
    console.error(error);
    throw error;
  }

  let totalAmount = 0;
  const categoryMap = new Map<number, any>();

  for (const exp of data) {
    totalAmount += exp.amount;

    if (!exp.category) continue;

    const id = exp.category.id;

    if (!categoryMap.has(id)) {
      categoryMap.set(id, {
        id,
        name: exp.category.name,
        icon: exp.category.icon,
        color: exp.category.color,
        expenses_count: 0,
        total_expenses_amount: 0,
      });
    }

    const cat = categoryMap.get(id);
    cat.expenses_count += 1;
    cat.total_expenses_amount += exp.amount;
  }

  const categories = Array.from(categoryMap.values());

  const pieChartData = categories.map((cat) => ({
    name: cat.name,
    value: cat.total_expenses_amount,
    color: cat.color,
  }));

  return {
    year,
    totalAmount,
    categories,
    pieChartData,
  };
};
