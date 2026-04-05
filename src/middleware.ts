import { type NextRequest, NextResponse } from "next/server"
import { COOKIE_NAME, verifyAdminJwt } from "@/lib/auth"
import { updateSession } from "@/utils/supabase/middleware"

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach(({ name, value }) => {
    to.cookies.set(name, value)
  })
}

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token) {
      const redirect = NextResponse.redirect(new URL("/admin/login", request.url))
      copyCookies(response, redirect)
      return redirect
    }
    const ok = await verifyAdminJwt(token)
    if (!ok) {
      const redirect = NextResponse.redirect(new URL("/admin/login", request.url))
      copyCookies(response, redirect)
      return redirect
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets — required so Supabase can refresh auth cookies.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
