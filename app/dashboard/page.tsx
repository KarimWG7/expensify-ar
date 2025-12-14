"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet2, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { format, startOfMonth, endOfMonth, startOfYear, subMonths } from "date-fns";
import { ar } from "date-fns/locale";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DashboardPage() {
  const { user } = useAppStore();
  const [stats, setStats] = useState({
    monthTotal: 0,
    yearTotal: 0,
    topCategory: "",
    dailyAverage: 0,
  });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

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

    const monthTotal = monthExpenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

    const { data: yearExpenses } = await supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", user.id)
      .gte("date", yearStart);

    const yearTotal = yearExpenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

    const { data: categories } = await supabase
      .from("categories")
      .select("name, total_expenses_amount")
      .eq("user_id", user.id)
      .order("total_expenses_amount", { ascending: false })
      .limit(1)
      .maybeSingle();

    const dailyAverage = monthExpenses && monthExpenses.length > 0
      ? monthTotal / new Date().getDate()
      : 0;

    setStats({
      monthTotal,
      yearTotal,
      topCategory: categories?.name || "لا يوجد",
      dailyAverage,
    });

    const monthlyChartData = [];
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(now, i);
      const monthStart = format(startOfMonth(date), "yyyy-MM-dd");
      const monthEnd = format(endOfMonth(date), "yyyy-MM-dd");

      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", user.id)
        .gte("date", monthStart)
        .lte("date", monthEnd);

      const total = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
      monthlyChartData.push({
        month: format(date, "MMM", { locale: ar }),
        total,
      });
    }
    setMonthlyData(monthlyChartData);

    const { data: categoriesWithExpenses } = await supabase
      .from("categories")
      .select("name, total_expenses_amount, color")
      .eq("user_id", user.id)
      .gt("total_expenses_amount", 0)
      .order("total_expenses_amount", { ascending: false })
      .limit(5);

    const pieData = categoriesWithExpenses?.map((cat: any, idx) => ({
      name: cat.name,
      value: Number(cat.total_expenses_amount),
      color: cat.color || CHART_COLORS[idx % CHART_COLORS.length],
    })) || [];

    setCategoryData(pieData);

    const { data: recent } = await supabase
      .from("expenses")
      .select(`
        id,
        amount,
        date,
        notes,
        categories(name),
        paymentMethods(name)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setRecentExpenses(recent || []);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المصروفات هذا الشهر</CardTitle>
            <Wallet2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthTotal)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المصروفات هذا العام</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.yearTotal)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أكثر فئة صرفًا</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topCategory}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الصرف اليومي</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.dailyAverage)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>المصروفات الشهرية</CardTitle>
            <CardDescription>إجمالي المصروفات لآخر 12 شهر</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المصروفات حسب الفئة</CardTitle>
            <CardDescription>نسبة المصروفات هذا الشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>أحدث المعاملات</CardTitle>
            <CardDescription>آخر 5 مصروفات</CardDescription>
          </div>
          <Link href="/expenses">
            <Button variant="outline">عرض الكل</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>طريقة الدفع</TableHead>
                <TableHead>الملاحظات</TableHead>
                <TableHead>المبلغ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentExpenses.map((expense: any) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.categories?.name || "-"}</TableCell>
                  <TableCell>{expense.paymentMethods?.name || "-"}</TableCell>
                  <TableCell>{expense.notes || "-"}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(Number(expense.amount))}
                  </TableCell>
                </TableRow>
              ))}
              {recentExpenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    لا توجد مصروفات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
