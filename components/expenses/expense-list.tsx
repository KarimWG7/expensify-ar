"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card as CardComponent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { deleteExpense } from "@/actions/expenses";
import { toast } from "sonner";

interface ExpenseListProps {
  expenses: any[]; // define strict type if possible
  onEdit: (expense: any) => void;
  pageSize?: number; // optional
}

export function ExpenseList({
  expenses,
  onEdit,
  pageSize = 10,
}: ExpenseListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(expenses.length / pageSize);

  const currentExpenses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return expenses.slice(start, end);
  }, [expenses, currentPage, pageSize]);

  const handleDelete = async (expense: any) => {
    if (!confirm("هل أنت متأكد من حذف هذا المصروف؟")) return;

    const result = await deleteExpense(expense.id, {
      category_id: expense.category_id,
      amount: Number(expense.amount),
    });

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("تم حذف المصروف بنجاح");
  };

  return (
    <CardComponent>
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
          {currentExpenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.date}</TableCell>
              <TableCell>{expense.categories?.name || "-"}</TableCell>
              <TableCell>{expense.paymentMethods?.name || "-"}</TableCell>
              <TableCell>{expense.notes || "-"}</TableCell>
              <TableCell className="font-bold">
                {formatCurrency(Number(expense.amount))}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(expense)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(expense)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </CardComponent>
  );
}
