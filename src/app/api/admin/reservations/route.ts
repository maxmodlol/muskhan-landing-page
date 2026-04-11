import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE_NAME, verifyAdminJwt } from "@/lib/auth"
import { createServerSupabaseAdmin } from "@/lib/supabase-admin"
import { isSupabaseConfigured } from "@/lib/supabase"
import type { ReservationRow } from "@/types/reservation"

async function requireAdmin(): Promise<boolean> {
  const jar = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifyAdminJwt(token)
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 })
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase غير مُعدّ" }, { status: 503 })
  }

  let supabase
  try {
    supabase = createServerSupabaseAdmin()
  } catch {
    return NextResponse.json({ error: "خطأ في الاتصال" }, { status: 500 })
  }

  const { data: rows, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: "فشل جلب البيانات" }, { status: 500 })
  }

  const list = (rows ?? []) as ReservationRow[]
  const total = list.length
  const totalGuests = list.reduce((s, r) => s + (r.guest_count ?? 0), 0)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const todayCount = list.filter(
    (r) => new Date(r.created_at).getTime() >= startOfToday.getTime()
  ).length

  return NextResponse.json({
    reservations: list,
    stats: {
      total,
      totalGuests,
      today: todayCount,
    },
  })
}
