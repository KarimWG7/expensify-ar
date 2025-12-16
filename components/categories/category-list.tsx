"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import type { Category } from "@/lib/supabase"; // Or define type locally if prefer decoupled
import { deleteCategory } from "@/actions/categories";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export function CategoryList({ categories, onEdit }: CategoryListProps) {
  const handleDelete = async (category: any) => {
    const result = await deleteCategory(category.id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("تم حذف الفئة بنجاح");
  };

  const renderIcon = (iconName: string, className: string = "h-6 w-6") => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <div style={{ color: category.color || "#3b82f6" }}>
                {renderIcon(category.icon)}
              </div>
              {category.name}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(category)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle dir="rtl">هل أنت متأكد؟</AlertDialogTitle>
                    <AlertDialogDescription dir="rtl">
                      حذف هذه الفئة سيؤدي إلى حذف جميع المصروفات المرتبطة بها
                      نهائيًا. لا يمكن التراجع عن هذا الإجراء.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter dir="rtl">
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => handleDelete(category)}
                    >
                      حذف
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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
      ))}
    </div>
  );
}
