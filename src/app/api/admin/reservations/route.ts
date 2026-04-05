import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE_NAME, verifyAdminJwt } from "@/lib/auth"
import { createServerSupabaseAdmin } from "@/lib/supabase-admin"
import { BUCKET, proofObjectPathFromDb } from "@/lib/reservation-utils"
import { isSupabaseConfigured } from "@/lib/supabase"
import type { ReservationRow } from "@/types/reservation"

const SIGNED_URL_EXPIRES_SEC = 60 * 60 // 1 hour — enough for admin review

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

  const withSignedUrls = await Promise.all(
    list.map(async (row) => {
      const objectPath = proofObjectPathFromDb(row.payment_proof_url)
      if (!objectPath) {
        return { ...row, payment_proof_view_url: null as string | null }
      }
      const { data, error: signErr } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(objectPath, SIGNED_URL_EXPIRES_SEC)
      if (signErr) {
        console.error(signErr)
        return { ...row, payment_proof_view_url: null as string | null }
      }
      return { ...row, payment_proof_view_url: data.signedUrl }
    })
  )
  const total = list.length
  const totalGuests = list.reduce((s, r) => s + (r.guest_count ?? 0), 0)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const todayCount = list.filter(
    (r) => new Date(r.created_at).getTime() >= startOfToday.getTime()
  ).length

  return NextResponse.json({
    reservations: withSignedUrls,
    stats: {
      total,
      totalGuests,
      today: todayCount,
    },
  })
}
