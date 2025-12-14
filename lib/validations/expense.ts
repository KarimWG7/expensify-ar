import { z } from 'zod';

export const expenseSchema = z.object({
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  notes: z.string().optional(),
  category_id: z.number().optional(),
  payment_method_id: z.number().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
