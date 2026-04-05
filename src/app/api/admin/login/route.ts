import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE_NAME, createAdminJwt, verifyAdminCredentials } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string
      password?: string
    }
    if (!verifyAdminCredentials(body.username, body.password)) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 })
    }
    const token = await createAdminJwt()
    if (!token) {
      return NextResponse.json(
        { error: "إعدادات الخادم غير مكتملة (ADMIN_SESSION_SECRET)" },
        { status: 500 }
      )
    }
    const jar = await cookies()
    jar.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}
