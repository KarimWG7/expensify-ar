import { z } from 'zod';

export const paymentMethodSchema = z.object({
  name: z.string().min(1, 'اسم طريقة الدفع مطلوب'),
  type: z.enum(['user_defined', 'admin_defined']),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
