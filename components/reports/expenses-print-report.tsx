"use client";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ExpensesPieChart from "../shared/pie-chart-card";
import { CategorySummaryCard } from "./category-summary-card";
import { forwardRef } from "react";

type Props = {
  year: number;
  totalAmount: number;
  categories: any[];
  pieChartData: any[];
};

export const ExpensesPrintReport = forwardRef<HTMLDivElement, Props>(
  ({ year, totalAmount, categories, pieChartData }, ref) => {
    return (
      <div ref={ref} dir="rtl" className="bg-white text-black space-y-6 py-10">
        {/* TOTAL */}
        <Card>
          <CardHeader>
            <CardTitle className="card-title">
              إجمالي المصروفات خلال عام {year}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {formatCurrency(totalAmount)}
          </CardContent>
        </Card>

        {/* PIE */}
        <ExpensesPieChart categoryData={pieChartData} />

        {/* LIST */}
        <h2 className="text-xl font-bold">
          اجمالي المصروفات لكل فئة خلال سنه {year}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c: any) => (
            <CategorySummaryCard key={c.id} category={c} />
          ))}
        </div>
      </div>
    );
  }
);
ExpensesPrintReport.displayName = "ExpensesPrintReport";
