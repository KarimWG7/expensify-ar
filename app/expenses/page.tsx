import { getExpenses } from "@/actions/expenses";
import { getCategories } from "@/actions/categories";
import { getPaymentMethods } from "@/actions/payment-methods";
import { ExpensesClient } from "@/components/expenses/expenses-client";

export default async function ExpensesPage() {
  const expenses = await getExpenses();
  const categories = await getCategories();
  const paymentMethods = await getPaymentMethods();

  return (
    <ExpensesClient
      initialExpenses={expenses || []}
      categories={categories || []}
      paymentMethods={paymentMethods || []}
    />
  );
}
