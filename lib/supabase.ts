import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  role: 'admin' | 'user';
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
  type: 'user_defined' | 'admin_defined';
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
