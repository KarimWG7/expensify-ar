"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/actions/categories";
import { CategoriesClient } from "@/components/categories/categories-client";
import { CategoryListSkeleton } from "@/components/categories/categories-list-skeleton";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data || []))
      .catch(() => {
        // handle error if needed
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CategoryListSkeleton />;

  return <CategoriesClient initialCategories={categories} />;
}
