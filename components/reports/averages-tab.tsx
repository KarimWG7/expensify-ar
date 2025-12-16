"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { getMonthlyAverage, getWeeklyAverage } from "@/actions/reports";
import { Spinner } from "@/components/ui/spinner";

export default function ReportsAverages() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [monthlyAvg, setMonthlyAvg] = useState<number | null>(null);
  const [weeklyAvg, setWeeklyAvg] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // last 5 years
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const monthly = await getMonthlyAverage(selectedYear);
      const weekly = await getWeeklyAverage(selectedYear, selectedMonth);
      setMonthlyAvg(monthly);
      setWeeklyAvg(weekly);
      setLoading(false);
    }
    fetchData();
  }, [selectedYear, selectedMonth]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>المتوسط الشهري</CardTitle>
          <Select
            value={selectedYear.toString()}
            onValueChange={(val) => setSelectedYear(Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر السنة" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Spinner className="mx-auto" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyAvg || 0)}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            متوسط المصروفات الشهرية خلال السنة
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>المتوسط الأسبوعي</CardTitle>
          <Select
            value={selectedMonth.toString()}
            onValueChange={(val) => setSelectedMonth(Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الشهر" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Spinner className="mx-auto" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(weeklyAvg || 0)}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            متوسط المصروفات الأسبوعية خلال الشهر
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
