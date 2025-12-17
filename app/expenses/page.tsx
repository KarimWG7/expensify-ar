// app/expenses/page.tsx (Server Component)
import { Suspense } from "react";
import { getExpenses } from "@/actions/expenses";
import { getCategories } from "@/actions/categories";
import { getPaymentMethods } from "@/actions/payment-methods";
import { ExpensesClient } from "@/components/expenses/expenses-client";
import { ExpenseListSkeleton } from "@/components/expenses/expenses-list-skeleton";

async function ExpensesData() {
  const [expenses, categories, paymentMethods] = await Promise.all([
    getExpenses(),
    getCategories(),
    getPaymentMethods(),
  ]);

  return (
    <ExpensesClient
      initialExpenses={expenses || []}
      categories={categories || []}
      paymentMethods={paymentMethods || []}
    />
  );
}

export default function ExpensesPage() {
  return (
    <Suspense fallback={<ExpenseListSkeleton />}>
      <ExpensesData />
    </Suspense>
  );
}
