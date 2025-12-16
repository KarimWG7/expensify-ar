"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categorySchema,
  type CategoryFormData,
} from "@/lib/validations/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import { createCategory, updateCategory } from "@/actions/categories";

const iconOptions = [
  "ShoppingCart",
  "Home",
  "Car",
  "Coffee",
  "Heart",
  "Briefcase",
  "Book",
  "Smartphone",
  "Utensils",
  "Plane",
  "Gift",
  "Zap",
];

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: any | null; // using any to match existing flexibility or define strict type
  onSuccess: () => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      color: "#3b82f6",
    },
  });

  const selectedIcon = watch("icon");

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("icon", category.icon);
      setValue("color", category.color || "#3b82f6");
    } else {
      reset({
        name: "",
        icon: "",
        color: "#3b82f6",
      });
    }
  }, [category, setValue, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setLoading(true);
      if (category) {
        const result = await updateCategory(category.id, data);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("تم تحديث الفئة بنجاح");
      } else {
        const result = await createCategory(data);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("تم إضافة الفئة بنجاح");
      }
      onOpenChange(false);
      reset();
      onSuccess(); // Triggers reload if needed or just handled by revalidatePath
    } catch (error) {
      toast.error("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (iconName: string, className: string = "h-6 w-6") => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "تعديل الفئة" : "إضافة فئة جديدة"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>الاسم</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
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
            {errors.icon && (
              <p className="text-sm text-destructive">{errors.icon.message}</p>
            )}
          </div>
          <div>
            <Label>اللون</Label>
            <Input type="color" {...register("color")} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {loading ? (
                <>
                  جاري الحفظ ...
                  <LucideIcons.Loader2 className="ml-2 h-4 w-4 animate-spin" />
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
