import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** Browser / Client Components */
export function createClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and a publishable or anon key (see .env.example)"
    )
  }
  return createBrowserClient(supabaseUrl, supabaseKey)
}
