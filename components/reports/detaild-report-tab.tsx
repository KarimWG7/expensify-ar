"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import ExpensesPieChart from "@/components/shared/pie-chart-card";
import ExpensesTable from "./expenses-table";
import { getCategories, getFilteredExpenses } from "@/actions/reports";
import { Spinner } from "@/components/ui/spinner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Check, Loader2 } from "lucide-react";
import { DatePicker } from "../ui/date-picker";

type FormValues = {
  from?: Date;
  to?: Date;
  minAmount?: number | "";
  maxAmount?: number | "";
  category?: number[];
  year?: number;
  month?: number;
};

export default function ReportsDetailed() {
  const { control, handleSubmit, reset, watch } = useForm<FormValues>();
  const [categories, setCategories] = useState<
    { id: number; name: string; color?: string }[]
  >([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [categoryData, setCategoryData] = useState<
    { name: string; value: number; color?: string }[]
  >([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  const onSearch = async (values: FormValues) => {
    setLoading(true);
    const filteredExpenses = await getFilteredExpenses(values);
    setExpenses(filteredExpenses);

    // compute category stats
    const catMap: Record<
      number,
      { name: string; value: number; color?: string }
    > = {};
    filteredExpenses.forEach((exp) => {
      if (!exp.category_id) return;
      if (!catMap[exp.category_id]) {
        const cat = categories.find((c) => c.id === exp.category_id);
        if (!cat) return;
        catMap[exp.category_id] = {
          name: cat.name,
          value: 0,
          color: cat.color || "#8884d8",
        };
      }
      catMap[exp.category_id].value += exp.amount;
    });
    setCategoryData(Object.values(catMap));

    const total = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
    setTotalAmount(total);

    setLoading(false);
  };

  const onReset = () => {
    reset({
      year: undefined,
      month: undefined,
      from: undefined,
      to: undefined,
      minAmount: "",
      maxAmount: "",
      category: [],
    });
    setExpenses([]);
    setCategoryData([]);
    setTotalAmount(0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filters */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>الفلاتر</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              control={control}
              name="year"
              render={({ field: { value, onChange, ...restField } }) => (
                <Select
                  value={value !== undefined ? String(value) : ""}
                  onValueChange={(stringValue) => {
                    const numericValue = stringValue
                      ? Number(stringValue)
                      : undefined;
                    onChange(numericValue);
                  }}
                  {...restField}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر السنة" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              control={control}
              name="month"
              render={({ field: { value, onChange, ...restField } }) => (
                <Select
                  value={value !== undefined ? String(value) : ""}
                  onValueChange={(stringValue) => {
                    const numericValue = stringValue
                      ? Number(stringValue)
                      : undefined;
                    onChange(numericValue);
                  }}
                  {...restField}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الشهر" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              control={control}
              name="category"
              render={({ field: { value = [], onChange } }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="w-full justify-between text-muted-foreground"
                      variant="outline"
                    >
                      {value.length === 0
                        ? "اختر الفئة"
                        : categories
                            .filter((c) => value.includes(c.id))
                            .map((c) => c.name)
                            .join(", ")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="بحث..." />
                      <CommandList>
                        {categories.map((cat) => (
                          <CommandItem
                            key={cat.id}
                            onSelect={() => {
                              if (value.includes(cat.id)) {
                                onChange(value.filter((v) => v !== cat.id));
                              } else {
                                onChange([...value, cat.id]);
                              }
                            }}
                          >
                            {cat.name}
                            {value.includes(cat.id) && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />

            {/* From / To Dates */}
            <Controller
              control={control}
              name="from"
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="من تاريخ"
                />
              )}
            />
            <Controller
              control={control}
              name="to"
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="إلى تاريخ"
                />
              )}
            />
            {/* Min / Max Amount */}
            <Controller
              control={control}
              name="minAmount"
              render={({ field }) => (
                <Input {...field} type="number" placeholder="الحد الادني" />
              )}
            />
            <Controller
              control={control}
              name="maxAmount"
              render={({ field }) => (
                <Input {...field} type="number" placeholder="الحد الاقصي" />
              )}
            />
          </CardContent>
          <CardContent className="flex gap-2">
            <Button onClick={handleSubmit(onSearch)}>
              {loading ? (
                <>
                  جاري البحث...
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "بحث"
              )}
            </Button>
            <Button variant="outline" onClick={onReset}>
              إعادة تعيين
            </Button>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>إجمالي المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Spinner className="mx-auto" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(totalAmount)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart */}
      <ExpensesPieChart categoryData={categoryData} />

      {/* Expenses Table */}
      <ExpensesTable expenses={expenses} loading={loading} />
    </div>
  );
}
