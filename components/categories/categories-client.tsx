"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryList } from "./category-list";
import { CategoryDialog } from "./category-dialog";
import type { Category } from "@/lib/supabase";

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الفئات</h1>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="ml-2 h-4 w-4" />
          إضافة فئة
        </Button>
      </div>

      <CategoryList categories={initialCategories} onEdit={handleEdit} />

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={handleClose}
        category={editingCategory}
        onSuccess={() => {}} // RevalidatePath handles data refresh, so no manual reload needed on client usually if we trust server action to revalidate
      />
    </div>
  );
}
