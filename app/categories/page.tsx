"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormData } from "@/lib/validations/category";
import * as LucideIcons from "lucide-react";

const iconOptions = [
  "ShoppingCart", "Home", "Car", "Coffee", "Heart", "Briefcase",
  "Book", "Smartphone", "Utensils", "Plane", "Gift", "Zap"
];

export default function CategoriesPage() {
  const { user } = useAppStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const selectedIcon = watch("icon");
  const selectedColor = watch("color");

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user!.id)
      .order("name");
    setCategories(data || []);
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(data)
          .eq("id", editingCategory.id);
        if (error) throw error;
        toast.success("تم تحديث الفئة بنجاح");
      } else {
        const { error } = await supabase
          .from("categories")
          .insert({
            ...data,
            user_id: user!.id,
            expenses_count: 0,
            total_expenses_amount: 0,
          });
        if (error) throw error;
        toast.success("تم إضافة الفئة بنجاح");
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      reset();
      loadCategories();
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setValue("icon", category.icon);
    setValue("color", category.color || "#3b82f6");
    setIsDialogOpen(true);
  };

  const handleDelete = async (category: any) => {
    if (category.expenses_count > 0) {
      toast.error("لا يمكن حذف فئة تحتوي على مصروفات");
      return;
    }
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (error) {
      toast.error("حدث خطأ");
      return;
    }
    toast.success("تم حذف الفئة بنجاح");
    loadCategories();
  };

  const renderIcon = (iconName: string, className: string = "h-6 w-6") => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الفئات</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCategory(null); reset(); }}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة فئة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>الاسم</Label>
                <Input {...register("name")} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div>
                <Label>الأيقونة</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {iconOptions.map((icon) => (
                    <Button
                      key={icon}
                      type="button"
                      variant={selectedIcon === icon ? "default" : "outline"}
                      size="icon"
                      onClick={() => setValue("icon", icon)}
                    >
                      {renderIcon(icon)}
                    </Button>
                  ))}
                </div>
                {errors.icon && <p className="text-sm text-destructive">{errors.icon.message}</p>}
              </div>
              <div>
                <Label>اللون</Label>
                <Input type="color" {...register("color")} defaultValue="#3b82f6" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">حفظ</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                <Button size="icon" variant="ghost" onClick={() => handleEdit(category)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(category)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">عدد المصروفات:</span>
                  <span className="font-medium">{formatNumber(category.expenses_count)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الإجمالي:</span>
                  <span className="font-bold">{formatCurrency(Number(category.total_expenses_amount))}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
