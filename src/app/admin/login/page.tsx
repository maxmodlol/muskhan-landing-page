"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "فشل تسجيل الدخول")
        return
      }
      router.push("/admin/dashboard")
      router.refresh()
    } catch {
      setError("حدث خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-sumac/15 bg-cream/90 p-8 shadow-[0_24px_60px_-28px_rgba(89,42,68,0.18)] ring-1 ring-sumac/15">
        <h1 className="font-heading text-center text-xl font-extrabold text-sumac-deep sm:text-2xl">
          لوحة التحكم
        </h1>
        <p className="mt-2 text-center text-sm text-sumac-deep/75">تسجيل دخول المشرف فقط</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {error ? (
            <p
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-user">اسم المستخدم</Label>
            <Input
              id="admin-user"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="landing-input"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-pass">كلمة المرور</Label>
            <Input
              id="admin-pass"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="landing-input"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="font-heading h-12 w-full rounded-full bg-linear-to-l from-sumac via-sumac-deep to-olive-deep font-bold text-cream ring-2 ring-heritage/35"
          >
            {loading ? "جاري الدخول…" : "دخول"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-sumac-deep/60">
          <Link href="/" className="font-medium text-sumac-deep underline-offset-4 hover:underline">
            العودة للموقع
          </Link>
        </p>
      </div>
    </main>
  )
}
