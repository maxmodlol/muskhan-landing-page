# مهرجان المسخن — Landing (Next.js)

واجهة عربية RTL لمهرجان مسخن فلسطيني، مع حجز عبر Supabase ولوحة تحكم بسيطة للمشرف.

## التشغيل محلياً

1. انسخ المتغيرات:

   ```bash
   cp .env.example .env.local
   ```

2. املأ قيم Supabase ولوحة التحكم (انظر قسم Supabase أدناه).

3. ثبّت الحزم وشغّل:

   ```bash
   npm install
   npm run dev
   ```

4. الموقع: [http://localhost:3000](http://localhost:3000)  
   تسجيل المشرف: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Supabase — الجدول والتخزين

### 1) جدول `reservations`

نفّذ في SQL Editor (أو Migrations):

```sql
create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  guest_count integer not null,
  note text,
  -- JSON نصّي: مصفوفة [{ "id", "name", "price", "qty" }, ...]
  menu_order text,
  created_at timestamptz not null default now()
);

-- ترقية من مخطط قديم (بدون menu_order):
-- alter table public.reservations add column if not exists menu_order text;

-- إزالة عمود إثبات الدفع القديم (إن وُجد):
-- alter table public.reservations drop column if exists payment_proof_url;
-- (أو نفّذ ملف الهجرة في supabase/migrations/)

-- سياسات RLS: للـ MVP يمكن تعطيل RLS على الجدول أو رفض كل شيء للـ anon لأن الإدخال يتم عبر Service Role من الخادم فقط.
```

### 2) جدول `event_settings` (سعة الفعالية — يتحكم بها المشرف)

ينفَّذ مرة واحدة. بدون هذا الجدول، تُستخدم السعة من المتغير `EVENT_MAX_GUESTS` في البيئة ثم القيمة الافتراضية (٥٠).

```sql
create table public.event_settings (
  id smallint primary key default 1,
  max_guests integer not null default 50
    check (max_guests >= 1 and max_guests <= 10000),
  constraint event_settings_singleton check (id = 1)
);

insert into public.event_settings (id, max_guests)
values (1, 50)
on conflict (id) do nothing;
```

من لوحة التحكم يمكن تعديل **الحد الأقصى لعدد الضيوف** للفعالية؛ يُحتسب المحجوز من مجموع `guest_count` في `reservations`.

### 3) طلب القائمة

- يُخزَّن الطلب في عمود **`menu_order`** كنص JSON (مصفوفة أسطر: معرّف، اسم، سعر، كمية).
- لا يُطلب رفع ملفات أو إثبات دفع؛ يمكن حذف دلو `payment-proofs` من مشاريع قديمة إن لم تعد تُستخدم.

### 4) متغيرات البيئة

| المتغير | الوصف |
|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | رابط المشروع |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | مفتاح anon (للاستخدامات العامة لاحقاً؛ الحجز الحالي يعتمد على Service Role) |
| `SUPABASE_SERVICE_ROLE_KEY` | **سري** — للخادم فقط (رفع الملفات + إدراج الصفوف) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | دخول لوحة التحكم |
| `ADMIN_SESSION_SECRET` | **16 حرفاً على الأقل** — لتوقيع كوكي الجلسة |
| `EVENT_MAX_GUESTS` (اختياري) | سعة الفعالية عند تعذّر قراءة `event_settings` (افتراضي: ٥٠) |

انسخ من `.env.example` إلى `.env.local` ولا ترفع الأسرار إلى Git.

## البناء للإنتاج

```bash
npm run build
npm start
```

مناسب للنشر على **Vercel**: أضف نفس المتغيرات في إعدادات المشروع.

---

## Learn More (Next.js)

- [Next.js Documentation](https://nextjs.org/docs)
- [Deploying to Vercel](https://nextjs.org/docs/app/building-your-application/deploying)
