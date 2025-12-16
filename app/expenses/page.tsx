"use client";

import { useEffect, useState } from "react";
import { getExpenses } from "@/actions/expenses";
import { getCategories } from "@/actions/categories";
import { getPaymentMethods } from "@/actions/payment-methods";
import { ExpensesClient } from "@/components/expenses/expenses-client";
import { ExpenseListSkeleton } from "@/components/expenses/expenses-list-skeleton";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getExpenses(), getCategories(), getPaymentMethods()])
      .then(([expensesData, categoriesData, paymentMethodsData]) => {
        setExpenses(expensesData || []);
        setCategories(categoriesData || []);
        setPaymentMethods(paymentMethodsData || []);
      })
      .catch(() => {
        // handle errors here if needed
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ExpenseListSkeleton />;

  return (
    <ExpensesClient
      initialExpenses={expenses}
      categories={categories}
      paymentMethods={paymentMethods}
    />
  );
}
