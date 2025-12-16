"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface StatsCardProps {
  total: number;
  loading?: boolean;
  title?: string;
  description?: string;
}

export function StatsCard({
  total,
  loading = false,
  title = "إجمالي المصروفات",
  description,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="text-2xl font-bold">{formatCurrency(total)}</div>
        )}
      </CardContent>
    </Card>
  );
}
