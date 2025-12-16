"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ExpenseList } from "./expense-list";
import { ExpenseDialog } from "./expense-dialog";
import type { Expense, Category, PaymentMethod } from "@/lib/supabase";

interface ExpensesClientProps {
  initialExpenses: Expense[];
  categories: Category[];
  paymentMethods: PaymentMethod[];
}

export function ExpensesClient({
  initialExpenses,
  categories,
  paymentMethods,
}: ExpensesClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setEditingExpense(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="md:text-3xl font-bold">المصروفات</h1>
        <Button
          onClick={() => {
            setEditingExpense(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          إضافة مصروف
        </Button>
      </div>

      <ExpenseList expenses={initialExpenses} onEdit={handleEdit} />

      <ExpenseDialog
        open={isDialogOpen}
        onOpenChange={handleClose}
        expense={editingExpense}
        categories={categories}
        paymentMethods={paymentMethods}
        onSuccess={() => {}}
      />
    </div>
  );
}
