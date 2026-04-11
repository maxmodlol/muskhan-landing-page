import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE_NAME, verifyAdminJwt } from "@/lib/auth"
import { createServerSupabaseAdmin } from "@/lib/supabase-admin"
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

  const { data: deleted, error: delErr } = await supabase
    .from("reservations")
    .delete()
    .eq("id", id)
    .select("id")

  if (delErr) {
    console.error(delErr)
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 })
  }
  if (!deleted?.length) {
    return NextResponse.json({ error: "السجل غير موجود" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
