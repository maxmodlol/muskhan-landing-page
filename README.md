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
  payment_proof_url text,
  created_at timestamptz not null default now()
);

-- سياسات RLS: للـ MVP يمكن تعطيل RLS على الجدول أو رفض كل شيء للـ anon لأن الإدخال يتم عبر Service Role من الخادم فقط.
```

### 2) دلو التخزين `payment-proofs`

- أنشئ bucket باسم **`payment-proofs`**.
- اجعله **Public** لعرض روابط الصور في لوحة التحكم (أو استخدم روابط موقّعة لاحقاً).
- لا حاجة لسياسات معقدة إذا كان الرفع يتم فقط من API الخادم باستخدام **Service Role**.

### 3) متغيرات البيئة

| المتغير | الوصف |
|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | رابط المشروع |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | مفتاح anon (للاستخدامات العامة لاحقاً؛ الحجز الحالي يعتمد على Service Role) |
| `SUPABASE_SERVICE_ROLE_KEY` | **سري** — للخادم فقط (رفع الملفات + إدراج الصفوف) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | دخول لوحة التحكم |
| `ADMIN_SESSION_SECRET` | **16 حرفاً على الأقل** — لتوقيع كوكي الجلسة |

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
