import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  role: z.enum(['admin', 'user']),
  approved: z.boolean().default(false),
});

export type UserFormData = z.infer<typeof userSchema>;
