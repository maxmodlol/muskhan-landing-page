import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseAdmin } from "@/lib/supabase-admin"
import { BUCKET, sanitizeFilename } from "@/lib/reservation-utils"
import { isSupabaseConfigured } from "@/lib/supabase"

const MAX_BYTES = 10 * 1024 * 1024

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
  const file = form.get("payment")

  if (!full_name || full_name.length < 2) {
    return NextResponse.json({ error: "الرجاء إدخال الاسم" }, { status: 400 })
  }
  if (!phone || phone.length < 8) {
    return NextResponse.json({ error: "الرجاء إدخال رقم هاتف صالح" }, { status: 400 })
  }

  let guest_count = parseInt(guestRaw, 10)
  if (guestRaw === "9" || guestRaw === "8+") guest_count = 9
  if (Number.isNaN(guest_count) || guest_count < 1 || guest_count > 50) {
    return NextResponse.json({ error: "الرجاء اختيار عدد الضيوف" }, { status: 400 })
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "الرجاء رفع صورة إثبات الدفع" }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "حجم الملف يجب أن لا يتجاوز 10 ميجابايت" }, { status: 400 })
  }
  const mime = file.type
  if (mime !== "image/png" && mime !== "image/jpeg") {
    return NextResponse.json({ error: "يُسمح بصور PNG أو JPG فقط" }, { status: 400 })
  }

  const buf = Buffer.from(await file.arrayBuffer())
  const objectPath = `proofs/${Date.now()}-${sanitizeFilename(file.name)}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, buf, { contentType: mime, upsert: false })

  if (uploadError) {
    console.error(uploadError)
    return NextResponse.json(
      { error: "فشل رفع الملف. تحقق من إعدادات التخزين في Supabase." },
      { status: 500 }
    )
  }

  const { error: insertError } = await supabase.from("reservations").insert({
    full_name,
    phone,
    guest_count,
    note: note || null,
    /** Object path in bucket (private bucket — no public URL stored). */
    payment_proof_url: objectPath,
  })

  if (insertError) {
    console.error(insertError)
    await supabase.storage.from(BUCKET).remove([objectPath])
    return NextResponse.json(
      { error: "فشل حفظ الحجز. تحقق من الجدول في Supabase." },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
