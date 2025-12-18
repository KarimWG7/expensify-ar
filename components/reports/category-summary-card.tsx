"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface Props {
  category: {
    id: number;
    name: string;
    icon: string;
    color: string | null;
    expenses_count: number;
    total_expenses_amount: number;
  };
}

export function CategorySummaryCard({ category }: Props) {
  const Icon = (LucideIcons as any)[category.icon] || LucideIcons.Folder;

  return (
    <Card className="print-only">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2 card-title">
          <span style={{ color: category.color || "#3b82f6" }}>
            <Icon size={18} />
          </span>
          {category.name}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">عدد المصروفات:</span>
            <span className="font-medium">
              {formatNumber(category.expenses_count)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">الإجمالي:</span>
            <span className="font-bold">
              {formatCurrency(Number(category.total_expenses_amount))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
