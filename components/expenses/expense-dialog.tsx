"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, type ExpenseFormData } from "@/lib/validations/expense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createExpense, updateExpense } from "@/actions/expenses";
import { Loader2 } from "lucide-react";

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: any | null;
  categories: any[];
  paymentMethods: any[];
  onSuccess: () => void;
}

export function ExpenseDialog({
  open,
  onOpenChange,
  expense,
  categories,
  paymentMethods,
  onSuccess,
}: ExpenseDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (expense) {
      setValue("amount", Number(expense.amount));
      setValue("date", expense.date);
      setValue("notes", expense.notes || "");
      setValue("category_id", expense.category_id);
      setValue("payment_method_id", expense.payment_method_id);
    } else {
      reset({
        amount: undefined,
        date: new Date().toISOString().split("T")[0], // Default to today
        notes: "",
        category_id: undefined,
        payment_method_id: undefined,
      });
    }
  }, [expense, setValue, reset]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      setLoading(true);
      if (expense) {
        const result = await updateExpense(expense.id, data, {
          category_id: expense.category_id,
          amount: Number(expense.amount),
        });
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("تم تحديث المصروف بنجاح");
      } else {
        const result = await createExpense(data);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("تم إضافة المصروف بنجاح");
      }
      onOpenChange(false);
      reset();
      onSuccess();
    } catch (error) {
      toast.error("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {expense ? "تعديل المصروف" : "إضافة مصروف جديد"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>المبلغ</Label>
            <Input
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>
          <div>
            <Label>التاريخ</Label>
            <Input type="date" {...register("date")} />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>
          <div>
            <Label>الفئة</Label>
            <Select
              onValueChange={(value) =>
                setValue("category_id", parseInt(value))
              }
              defaultValue={expense?.category_id?.toString()}
              key={
                expense?.category_id ? `cat-${expense.category_id}` : "cat-new"
              } // Force re-render on edit change might help, but defaultValue is uncontrolled.
              // React Hook Form `setValue` covers the value update. `defaultValue` is for initial render.
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>طريقة الدفع</Label>
            <Select
              onValueChange={(value) =>
                setValue("payment_method_id", parseInt(value))
              }
              defaultValue={expense?.payment_method_id?.toString()}
              key={
                expense?.payment_method_id
                  ? `pm-${expense.payment_method_id}`
                  : "pm-new"
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((pm) => (
                  <SelectItem key={pm.id} value={pm.id.toString()}>
                    {pm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>الملاحظات</Label>
            <Input {...register("notes")} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {loading ? (
                <>
                  جاري الحفظ ...
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "حفظ"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
