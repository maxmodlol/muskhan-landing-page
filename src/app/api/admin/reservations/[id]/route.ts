import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE_NAME, verifyAdminJwt } from "@/lib/auth"
import { createServerSupabaseAdmin } from "@/lib/supabase-admin"
import { BUCKET, proofObjectPathFromDb } from "@/lib/reservation-utils"
import { isSupabaseConfigured } from "@/lib/supabase"

async function requireAdmin(): Promise<boolean> {
  const jar = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifyAdminJwt(token)
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 })
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase غير مُعدّ" }, { status: 503 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: "معرّف غير صالح" }, { status: 400 })
  }

  let supabase
  try {
    supabase = createServerSupabaseAdmin()
  } catch {
    return NextResponse.json({ error: "خطأ في الاتصال" }, { status: 500 })
  }

  const { data: row, error: fetchErr } = await supabase
    .from("reservations")
    .select("payment_proof_url")
    .eq("id", id)
    .single()

  if (fetchErr || !row) {
    return NextResponse.json({ error: "السجل غير موجود" }, { status: 404 })
  }

  const url = row.payment_proof_url as string | null
  if (url) {
    const path = proofObjectPathFromDb(url)
    if (path) {
      await supabase.storage.from(BUCKET).remove([path])
    }
  }

  const { error: delErr } = await supabase.from("reservations").delete().eq("id", id)
  if (delErr) {
    console.error(delErr)
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
