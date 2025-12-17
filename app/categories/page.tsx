// app/categories/page.tsx
import { Suspense } from "react";
import { getCategories } from "@/actions/categories";
import { CategoriesClient } from "@/components/categories/categories-client";
import { CategoryListSkeleton } from "@/components/categories/categories-list-skeleton";

async function CategoriesData() {
  const categories = await getCategories();

  return <CategoriesClient initialCategories={categories || []} />;
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CategoryListSkeleton />}>
      <CategoriesData />
    </Suspense>
  );
}
