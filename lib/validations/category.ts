import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'اسم الفئة مطلوب'),
  icon: z.string().min(1, 'الأيقونة مطلوبة'),
  color: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
