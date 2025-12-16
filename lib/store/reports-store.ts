import { create } from "zustand";
import { Expense, Category } from "@/lib/supabase";

interface ReportsState {
  filters: {
    year?: number;
    month?: number;
    from?: string;
    to?: string;
    minAmount?: number;
    maxAmount?: number;
    categoryId?: number;
  };
  expenses: Expense[];
  total: number;
  categoryData: { name: string; value: number; color: string }[];
  loading: boolean;
  page: number;
  pageSize: number;
  setFilters: (filters: Partial<ReportsState["filters"]>) => void;
  resetFilters: () => void;
  setExpenses: (expenses: Expense[]) => void;
  setTotal: (total: number) => void;
  setCategoryData: (data: ReportsState["categoryData"]) => void;
  setLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  filters: {},
  expenses: [],
  total: 0,
  categoryData: [],
  loading: false,
  page: 1,
  pageSize: 10,
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: {}, page: 1 }),
  setExpenses: (expenses) => set({ expenses }),
  setTotal: (total) => set({ total }),
  setCategoryData: (categoryData) => set({ categoryData }),
  setLoading: (loading) => set({ loading }),
  setPage: (page) => set({ page }),
}));
