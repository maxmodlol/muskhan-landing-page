import { NextRequest, NextResponse } from "next/server"
import { getCapacitySnapshot, MAX_PARTY_GUESTS } from "@/lib/booking-capacity"
import { toEasternArabicNumerals } from "@/lib/eastern-arabic-numerals"
import { createServerSupabaseAdmin } from "@/lib/supabase-admin"
import { isSupabaseConfigured } from "@/lib/supabase"

type OrderLine = { id: string; name: string; price: string; qty: number }

function parseMenuOrder(raw: string): OrderLine[] | null {
  const s = raw.trim()
  if (!s) return null
  try {
    const parsed = JSON.parse(s) as unknown
    if (!Array.isArray(parsed) || parsed.length === 0) return null
    const out: OrderLine[] = []
    for (const row of parsed) {
      if (!row || typeof row !== "object") return null
      const o = row as Record<string, unknown>
      const id = typeof o.id === "string" ? o.id : ""
      const name = typeof o.name === "string" ? o.name : ""
      const price = typeof o.price === "string" ? o.price : ""
      const qty = typeof o.qty === "number" ? o.qty : NaN
      if (!id || !name || !Number.isFinite(qty) || qty < 1 || qty > 999) {
        return null
      }
      out.push({ id, name, price, qty })
    }
    return out
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "الحجز غير مفعّل بعد. يرجى التواصل مع الدعم." },
      { status: 503 }
    )
  }

  let supabase
  try {
    supabase = createServerSupabaseAdmin()
  } catch {
    return NextResponse.json({ error: "إعدادات الخادم غير مكتملة" }, { status: 503 })
  }

  const form = await request.formData()
  const full_name = String(form.get("full_name") ?? "").trim()
  const phone = String(form.get("phone") ?? "").trim()
  const guestRaw = String(form.get("guest_count") ?? "").trim()
  const note = String(form.get("note") ?? "").trim()
  const menuOrderRaw = String(form.get("menu_order") ?? "").trim()

  if (!full_name || full_name.length < 2) {
    return NextResponse.json({ error: "الرجاء إدخال الاسم" }, { status: 400 })
  }
  if (!phone || phone.length < 8) {
    return NextResponse.json({ error: "الرجاء إدخال رقم هاتف صالح" }, { status: 400 })
  }

  let guest_count = parseInt(guestRaw, 10)
  if (guestRaw === "9" || guestRaw === "8+") guest_count = 9
  if (
    Number.isNaN(guest_count) ||
    guest_count < 1 ||
    guest_count > MAX_PARTY_GUESTS
  ) {
    return NextResponse.json({ error: "الرجاء اختيار عدد الضيوف" }, { status: 400 })
  }

  const orderLines = parseMenuOrder(menuOrderRaw)
  if (!orderLines) {
    return NextResponse.json(
      { error: "الرجاء إضافة أطباق من القائمة إلى طلبك" },
      { status: 400 }
    )
  }

  let snapshot
  try {
    snapshot = await getCapacitySnapshot(supabase)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: "تعذّر التحقق من السعة. حاول لاحقاً." },
      { status: 503 },
    )
  }

  if (snapshot.isFull) {
    return NextResponse.json(
      { error: "الفعالية محجوزة بالكامل — لا تتوفر مقاعد حالياً." },
      { status: 409 },
    )
  }

  if (guest_count > snapshot.remaining) {
    const ar = toEasternArabicNumerals(snapshot.remaining)
    return NextResponse.json(
      {
        error:
          snapshot.remaining === 0
            ? "الفعالية محجوزة بالكامل."
            : `تبقّى ${ar} مقعداً فقط — اختر عدداً أصغر.`,
      },
      { status: 409 },
    )
  }

  const snapshotConfirm = await getCapacitySnapshot(supabase)
  if (guest_count > snapshotConfirm.remaining) {
    const ar = toEasternArabicNumerals(snapshotConfirm.remaining)
    return NextResponse.json(
      {
        error:
          snapshotConfirm.remaining === 0
            ? "الفعالية محجوزة بالكامل."
            : `تبقّى ${ar} مقعداً فقط — رُبما اكتملت السعة للتو.`,
      },
      { status: 409 },
    )
  }

  const menu_order_json = JSON.stringify(orderLines)

  const { error: insertError } = await supabase.from("reservations").insert({
    full_name,
    phone,
    guest_count,
    note: note || null,
    menu_order: menu_order_json,
  })

  if (insertError) {
    console.error(insertError)
    return NextResponse.json(
      {
        error:
          "فشل حفظ الحجز. تحقق من الجدول في Supabase (عمود menu_order مطلوب — انظر README).",
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
