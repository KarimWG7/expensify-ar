"use server";

import { createClient } from "@/lib/supabase/server";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { ar } from "date-fns/locale";

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export async function getDashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const now = new Date();
  const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");
  const yearStart = format(startOfYear(now), "yyyy-MM-dd");

  const { data: monthExpenses } = await supabase
    .from("expenses")
    .select("amount")
    .eq("user_id", user.id)
    .gte("date", monthStart)
    .lte("date", monthEnd);

  const monthTotal =
    monthExpenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

  const { data: yearExpenses } = await supabase
    .from("expenses")
    .select("amount")
    .eq("user_id", user.id)
    .gte("date", yearStart);

  const yearTotal =
    yearExpenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

  const { data: topCategory } = await supabase
    .from("categories")
    .select("name, total_expenses_amount")
    .eq("user_id", user.id)
    .order("total_expenses_amount", { ascending: false })
    .limit(1)
    .maybeSingle();

  const dailyAverage =
    monthExpenses && monthExpenses.length > 0 ? monthTotal / now.getDate() : 0;

  // Monthly Chart Data
  const monthlyChartData = [];
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(now, i);
    const mStart = format(startOfMonth(date), "yyyy-MM-dd");
    const mEnd = format(endOfMonth(date), "yyyy-MM-dd");

    const { data: expenses } = await supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", user.id)
      .gte("date", mStart)
      .lte("date", mEnd);

    const total =
      expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
    monthlyChartData.push({
      month: format(date, "MMM", { locale: ar }),
      total,
    });
  }

  // Category Pie Data
  const { data: categoriesWithExpenses } = await supabase
    .from("categories")
    .select("name, total_expenses_amount, color")
    .eq("user_id", user.id)
    .gt("total_expenses_amount", 0)
    .order("total_expenses_amount", { ascending: false })
    .limit(5);

  const pieData =
    categoriesWithExpenses?.map((cat: any, idx: number) => ({
      name: cat.name,
      value: Number(cat.total_expenses_amount),
      color: cat.color || CHART_COLORS[idx % CHART_COLORS.length],
    })) || [];

  // Recent Expenses
  const { data: recentExpenses } = await supabase
    .from("expenses")
    .select(
      `
      id,
      amount,
      date,
      notes,
      categories(name),
      paymentMethods(name)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    stats: {
      monthTotal,
      yearTotal,
      topCategory: topCategory?.name || "لا يوجد",
      dailyAverage,
    },
    monthlyData: monthlyChartData,
    categoryData: pieData,
    recentExpenses: recentExpenses || [],
  };
}
