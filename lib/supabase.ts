import { createClient } from "./supabase/client";

export const supabase = createClient();

// Re-export types if they are still needed and valid,
// or import them from where they are defined if they were manual types.
// The previous file had manual types. I should preserve them.

export type User = {
  id: string;
  email: string;
  role: "admin" | "user";
  approved: boolean;
  created_at: string;
};

export type Category = {
  id: number;
  name: string;
  icon: string;
  color: string | null;
  expenses_count: number;
  total_expenses_amount: number;
  user_id: string;
  created_at: string;
};

export type PaymentMethod = {
  id: number;
  name: string;
  type: "user_defined" | "admin_defined";
  user_id: string | null;
  created_at: string;
};

export type Expense = {
  id: number;
  amount: number;
  date: string;
  notes: string | null;
  category_id: number | null;
  payment_method_id: number | null;
  user_id: string;
  created_at: string;
};
