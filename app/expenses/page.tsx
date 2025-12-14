"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, type ExpenseFormData } from "@/lib/validations/expense";

export default function ExpensesPage() {
  const { user } = useAppStore();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
  });

  useEffect(() => {
    if (user) {
      loadExpenses();
      loadCategories();
      loadPaymentMethods();
    }
  }, [user]);

  const loadExpenses = async () => {
    const { data } = await supabase
      .from("expenses")
      .select(`
        *,
        categories(name, color),
        paymentMethods(name)
      `)
      .eq("user_id", user!.id)
      .order("date", { ascending: false });
    setExpenses(data || []);
  };

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user!.id);
    setCategories(data || []);
  };

  const loadPaymentMethods = async () => {
    const { data } = await supabase
      .from("paymentMethods")
      .select("*")
      .or(`user_id.eq.${user!.id},type.eq.admin_defined`);
    setPaymentMethods(data || []);
  };

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      if (editingExpense) {
        const oldCategoryId = editingExpense.category_id;
        const oldAmount = Number(editingExpense.amount);

        const { error } = await supabase
          .from("expenses")
          .update({
            amount: data.amount,
            date: data.date,
            notes: data.notes || null,
            category_id: data.category_id || null,
            payment_method_id: data.payment_method_id || null,
          })
          .eq("id", editingExpense.id);

        if (error) throw error;

        if (oldCategoryId) {
          await supabase.rpc("decrement", {
            row_id: oldCategoryId,
            x: oldAmount,
          }).single();
        }

        if (data.category_id) {
          const { data: category } = await supabase
            .from("categories")
            .select("expenses_count, total_expenses_amount")
            .eq("id", data.category_id)
            .single();

          await supabase
            .from("categories")
            .update({
              expenses_count: (category?.expenses_count || 0) + (oldCategoryId === data.category_id ? 0 : 1),
              total_expenses_amount: (Number(category?.total_expenses_amount) || 0) + data.amount - (oldCategoryId === data.category_id ? oldAmount : 0),
            })
            .eq("id", data.category_id);
        }

        toast.success("تم تحديث المصروف بنجاح");
      } else {
        const { error } = await supabase
          .from("expenses")
          .insert({
            ...data,
            user_id: user!.id,
            notes: data.notes || null,
            category_id: data.category_id || null,
            payment_method_id: data.payment_method_id || null,
          });

        if (error) throw error;

        if (data.category_id) {
          const { data: category } = await supabase
            .from("categories")
            .select("expenses_count, total_expenses_amount")
            .eq("id", data.category_id)
            .single();

          await supabase
            .from("categories")
            .update({
              expenses_count: (category?.expenses_count || 0) + 1,
              total_expenses_amount: (Number(category?.total_expenses_amount) || 0) + data.amount,
            })
            .eq("id", data.category_id);
        }

        toast.success("تم إضافة المصروف بنجاح");
      }

      setIsDialogOpen(false);
      setEditingExpense(null);
      reset();
      loadExpenses();
      loadCategories();
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setValue("amount", Number(expense.amount));
    setValue("date", expense.date);
    setValue("notes", expense.notes || "");
    setValue("category_id", expense.category_id);
    setValue("payment_method_id", expense.payment_method_id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (expense: any) => {
    if (!confirm("هل أنت متأكد من حذف هذا المصروف؟")) return;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", expense.id);

    if (error) {
      toast.error("حدث خطأ");
      return;
    }

    if (expense.category_id) {
      const { data: category } = await supabase
        .from("categories")
        .select("expenses_count, total_expenses_amount")
        .eq("id", expense.category_id)
        .single();

      await supabase
        .from("categories")
        .update({
          expenses_count: Math.max(0, (category?.expenses_count || 0) - 1),
          total_expenses_amount: Math.max(0, (Number(category?.total_expenses_amount) || 0) - Number(expense.amount)),
        })
        .eq("id", expense.category_id);
    }

    toast.success("تم حذف المصروف بنجاح");
    loadExpenses();
    loadCategories();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingExpense(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">المصروفات</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingExpense(null)}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة مصروف
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExpense ? "تعديل المصروف" : "إضافة مصروف جديد"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>المبلغ</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
              </div>
              <div>
                <Label>التاريخ</Label>
                <Input type="date" {...register("date")} />
                {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
              </div>
              <div>
                <Label>الفئة</Label>
                <Select
                  onValueChange={(value) => setValue("category_id", parseInt(value))}
                  defaultValue={editingExpense?.category_id?.toString()}
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
                  onValueChange={(value) => setValue("payment_method_id", parseInt(value))}
                  defaultValue={editingExpense?.payment_method_id?.toString()}
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
                <Button type="submit" className="flex-1">حفظ</Button>
                <Button type="button" variant="outline" onClick={handleDialogClose}>إلغاء</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>التاريخ</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>طريقة الدفع</TableHead>
              <TableHead>الملاحظات</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.date}</TableCell>
                <TableCell>
                  {expense.categories?.name || "-"}
                </TableCell>
                <TableCell>{expense.paymentMethods?.name || "-"}</TableCell>
                <TableCell>{expense.notes || "-"}</TableCell>
                <TableCell className="font-bold">{formatCurrency(Number(expense.amount))}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(expense)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(expense)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
