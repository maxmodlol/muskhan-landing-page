import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Server Components / Route Handlers: pass the cookie store from `await cookies()`.
 *
 * @example
 * const cookieStore = await cookies()
 * const supabase = createClient(cookieStore)
 */
export function createClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and a publishable or anon key (see .env.example)"
    )
  }
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from a Server Component where cookies are read-only; middleware refresh applies.
        }
      },
    },
  })
}
