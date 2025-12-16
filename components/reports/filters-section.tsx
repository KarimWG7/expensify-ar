"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReportsStore } from "@/lib/store/reports-store";
import { createClient } from "@/lib/supabase/client";

export default function ReportsFilters({
  fetchFilteredExpenses,
}: {
  fetchFilteredExpenses: () => void;
}) {
  const { filters, setFilters, resetFilters } = useReportsStore();
  const [categories, setCategories] = useState<
    { id: number; name: string; color: string | null }[]
  >([]);

  useEffect(() => {
    async function fetchCategories() {
      const supabase = await createClient();
      const { data } = await supabase
        .from("categories")
        .select("id,name,color");
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {/* Year */}
      <Select
        value={filters.year?.toString()}
        onValueChange={(val) =>
          setFilters({
            year: Number(val),
            month: undefined,
            from: undefined,
            to: undefined,
          })
        }
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

      {/* Month */}
      <Select
        value={filters.month?.toString()}
        onValueChange={(val) =>
          setFilters({ month: Number(val), from: undefined, to: undefined })
        }
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

      {/* Category */}
      <Select
        value={filters.categoryId?.toString()}
        onValueChange={(val) => setFilters({ categoryId: Number(val) })}
      >
        <SelectTrigger>
          <SelectValue placeholder="اختر الفئة" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id?.toString()}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date from */}
      <Input
        type="date"
        value={filters.from || ""}
        onChange={(e) =>
          setFilters({
            from: e.target.value,
            year: undefined,
            month: undefined,
          })
        }
        placeholder="من تاريخ"
      />

      {/* Date to */}
      <Input
        type="date"
        value={filters.to || ""}
        onChange={(e) =>
          setFilters({ to: e.target.value, year: undefined, month: undefined })
        }
        placeholder="إلى تاريخ"
      />

      {/* Min Amount */}
      <Input
        type="number"
        value={filters.minAmount || ""}
        onChange={(e) => setFilters({ minAmount: Number(e.target.value) })}
        placeholder="أقل من"
      />

      {/* Max Amount */}
      <Input
        type="number"
        value={filters.maxAmount || ""}
        onChange={(e) => setFilters({ maxAmount: Number(e.target.value) })}
        placeholder="أعلى من"
      />

      {/* Buttons */}
      <div className="flex gap-2 col-span-full">
        <Button onClick={() => setFilters({})} variant="secondary">
          إعادة تعيين
        </Button>
        <Button onClick={() => fetchFilteredExpenses()}>بحث</Button>
      </div>
    </div>
  );
}
