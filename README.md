# Expensify - إكسبنسيفاي

تطبيق عربي RTL لتتبع المصروفات العائلية مع نظام مستخدمين متعدد.

## المميزات

- واجهة عربية بالكامل مع تخطيط RTL
- نظام مستخدمين (Admin/User) مع التحكم بالصلاحيات
- إدارة المصروفات بشكل كامل (إضافة، تعديل، حذف)
- تصنيف المصروفات بفئات مخصصة مع أيقونات وألوان
- طرق دفع قابلة للتخصيص
- لوحة تحكم تفاعلية مع مخططات بيانية
- تقارير وإحصائيات مفصلة
- وضع فاتح/داكن
- حماية البيانات مع Row Level Security

## التقنيات المستخدمة

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v3
- ShadCN UI
- Supabase (Auth + Database)
- Zustand (إدارة الحالة)
- React Hook Form + Zod (التحقق من النماذج)
- Recharts (المخططات البيانية)
- Lucide React (الأيقونات)

## متطلبات التشغيل

- Node.js 18 أو أحدث
- حساب Supabase

## التثبيت

1. تثبيت المكتبات:
```bash
npm install
```

2. إعداد متغيرات البيئة:
الملف `.env.local` موجود بالفعل مع بيانات Supabase

3. قاعدة البيانات:
تم إنشاء الجداول والسياسات تلقائياً في Supabase

## التشغيل

### وضع التطوير:
```bash
npm run dev
```

افتح المتصفح على: http://localhost:3000

### البناء للإنتاج:
```bash
npm run build
npm start
```

## هيكل قاعدة البيانات

### جدول users
- id (uuid) - معرف المستخدم من Supabase Auth
- email (text) - البريد الإلكتروني
- role (text) - الدور: admin أو user
- approved (boolean) - حالة الموافقة
- created_at (timestamptz) - تاريخ الإنشاء

### جدول expenses
- id (serial) - المعرف
- amount (numeric) - المبلغ
- date (text) - التاريخ
- notes (text) - ملاحظات
- category_id (integer) - معرف الفئة
- payment_method_id (integer) - معرف طريقة الدفع
- user_id (uuid) - معرف المستخدم
- created_at (timestamptz) - تاريخ الإنشاء

### جدول categories
- id (serial) - المعرف
- name (text) - الاسم
- icon (text) - الأيقونة
- color (text) - اللون
- expenses_count (integer) - عدد المصروفات
- total_expenses_amount (numeric) - إجمالي المصروفات
- user_id (uuid) - معرف المستخدم
- created_at (timestamptz) - تاريخ الإنشاء

### جدول paymentMethods
- id (serial) - المعرف
- name (text) - الاسم
- type (text) - النوع: user_defined أو admin_defined
- user_id (uuid) - معرف المستخدم (null للطرق العامة)
- created_at (timestamptz) - تاريخ الإنشاء

## الصفحات

- `/` - صفحة تسجيل الدخول
- `/dashboard` - لوحة التحكم الرئيسية
- `/expenses` - إدارة المصروفات
- `/categories` - إدارة الفئات
- `/reports` - التقارير والإحصائيات
- `/users` - إدارة المستخدمين (للمدراء فقط)
- `/settings` - الإعدادات (تغيير كلمة المرور)

## ملاحظات مهمة

### المستخدمون
- لا يوجد تسجيل عام
- المدراء فقط يمكنهم إنشاء مستخدمين
- يجب الموافقة على المستخدمين قبل السماح لهم بالدخول

### الأمان
- Row Level Security (RLS) مفعل على جميع الجداول
- كل مستخدم يرى بياناته فقط
- المدراء لديهم صلاحيات إضافية

### العملة
- جميع المبالغ بالدينار الكويتي (KWD)
- التنسيق العربي للأرقام

## الدعم والمساعدة

للمزيد من المعلومات:
- Supabase: https://supabase.com/docs
- Next.js: https://nextjs.org/docs
- ShadCN UI: https://ui.shadcn.com
