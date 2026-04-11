-- Remove legacy payment proof column; menu order is stored in `menu_order` (JSON text).
-- Run in Supabase SQL Editor or via `supabase db push` if you use the CLI.

alter table public.reservations
  drop column if exists payment_proof_url;
