"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ReservationRow } from "@/types/reservation";
import { cn } from "@/lib/utils";

type Stats = { total: number; totalGuests: number; today: number };

export default function AdminDashboardPage() {
  const router = useRouter();
  const [rows, setRows] = React.useState<ReservationRow[]>([]);
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(
    null,
  );
  const [deleteDialogError, setDeleteDialogError] = React.useState<
    string | null
  >(null);

  const [eventMaxGuests, setEventMaxGuests] = React.useState<number | null>(
    null,
  );
  const [eventMaxInput, setEventMaxInput] = React.useState("");
  const [settingsError, setSettingsError] = React.useState<string | null>(null);
  const [settingsSaving, setSettingsSaving] = React.useState(false);
  const [settingsSaved, setSettingsSaved] = React.useState(false);

  const load = React.useCallback(async () => {
    setError(null);
    setSettingsError(null);
    setLoading(true);
    try {
      const [resList, resSettings] = await Promise.all([
        fetch("/api/admin/reservations", { credentials: "include" }),
        fetch("/api/admin/settings", { credentials: "include" }),
      ]);

      const listData = (await resList.json()) as {
        reservations?: ReservationRow[];
        stats?: Stats;
        error?: string;
      };

      if (!resList.ok) {
        if (resList.status === 401) {
          router.replace("/admin/login");
          return;
        }
        setError(listData.error ?? "فشل التحميل");
        setLoading(false);
        return;
      }

      setRows(listData.reservations ?? []);
      setStats(listData.stats ?? null);

      const settingsData = (await resSettings.json()) as {
        maxGuests?: number;
        error?: string;
      };
      if (resSettings.ok && typeof settingsData.maxGuests === "number") {
        setEventMaxGuests(settingsData.maxGuests);
        setEventMaxInput(String(settingsData.maxGuests));
      } else {
        setEventMaxGuests(null);
        setSettingsError(
          settingsData.error ??
            "تعذّر تحميل سعة الفعالية (تحقق من جدول event_settings في README).",
        );
      }
    } catch {
      setError("خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  }, [router]);

  async function saveEventCapacity() {
    setSettingsError(null);
    setSettingsSaved(false);
    const n = parseInt(eventMaxInput.trim(), 10);
    if (!Number.isFinite(n) || n < 1) {
      setSettingsError("أدخل عدداً صحيحاً أكبر من صفر.");
      return;
    }
    setSettingsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxGuests: n }),
      });
      const data = (await res.json()) as { maxGuests?: number; error?: string };
      if (!res.ok) {
        setSettingsError(data.error ?? "فشل الحفظ");
        return;
      }
      if (typeof data.maxGuests === "number") {
        setEventMaxGuests(data.maxGuests);
        setEventMaxInput(String(data.maxGuests));
      }
      setSettingsSaved(true);
      window.setTimeout(() => setSettingsSaved(false), 3000);
    } catch {
      setSettingsError("خطأ في الاتصال");
    } finally {
      setSettingsSaving(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [load]);

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/admin/login");
    router.refresh();
  }

  function openDeleteDialog(id: string) {
    setDeleteDialogError(null);
    setDeleteTargetId(id);
  }

  async function confirmDelete() {
    if (!deleteTargetId) return;
    setDeletingId(deleteTargetId);
    setDeleteDialogError(null);
    try {
      const res = await fetch(`/api/admin/reservations/${deleteTargetId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setDeleteDialogError(data.error ?? "فشل الحذف");
        return;
      }
      setDeleteTargetId(null);
      await load();
    } catch {
      setDeleteDialogError("خطأ في الاتصال. حاول مرة أخرى.");
    } finally {
      setDeletingId(null);
    }
  }

  function guestLabel(n: number) {
    return n === 9 ? "8+" : String(n);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTargetId(null);
            setDeleteDialogError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف الحجز</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا السجل نهائياً مع صورة إثبات الدفع من التخزين. لا يمكن
              التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteDialogError ? (
            <p
              className="mt-3 rounded-xl border border-destructive/35 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {deleteDialogError}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel type="button">إلغاء</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              className="h-10 w-full rounded-full font-semibold sm:w-auto sm:min-w-[7rem]"
              disabled={deletingId !== null}
              onClick={() => void confirmDelete()}
            >
              {deletingId ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  جاري الحذف…
                </span>
              ) : (
                "حذف نهائياً"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="flex flex-col gap-4 border-b border-earth/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-olive sm:text-3xl">
            الحجوزات
          </h1>
          <p className="mt-1 text-sm text-earth/70">
            مهرجان المسخن — لوحة التحكم
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full border-earth/25 px-4",
            )}
          >
            الموقع
          </Link>
          <Button
            type="button"
            variant="outline"
            className="gap-2 rounded-full border-earth/25"
            onClick={() => void handleLogout()}
          >
            <LogOut className="size-4" aria-hidden />
            خروج
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center gap-2 text-earth/70">
          <Loader2 className="size-8 animate-spin" aria-hidden />
          <span>جاري التحميل…</span>
        </div>
      ) : error ? (
        <p className="mt-8 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-6 text-center text-destructive">
          {error}
        </p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-earth/10 bg-cream/90 p-5 shadow-sm ring-1 ring-gold/10">
              <p className="text-sm font-medium text-earth/70">
                إجمالي الحجوزات
              </p>
              <p className="mt-2 font-heading text-3xl font-extrabold text-earth">
                {stats?.total ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-earth/10 bg-cream/90 p-5 shadow-sm ring-1 ring-gold/10">
              <p className="text-sm font-medium text-earth/70">إجمالي الضيوف</p>
              <p className="mt-2 font-heading text-3xl font-extrabold text-earth">
                {stats?.totalGuests ?? 0}
              </p>
              {eventMaxGuests !== null ? (
                <p className="mt-2 text-xs text-earth/60">
                  من أصل{" "}
                  <span className="font-semibold text-olive">
                    {eventMaxGuests}
                  </span>{" "}
                  مقعداً للفعالية
                </p>
              ) : null}
            </div>
            <div className="rounded-2xl border border-earth/10 bg-cream/90 p-5 shadow-sm ring-1 ring-gold/10">
              <p className="text-sm font-medium text-earth/70">حجوزات اليوم</p>
              <p className="mt-2 font-heading text-3xl font-extrabold text-earth">
                {stats?.today ?? 0}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-earth/12 bg-musakhan-atmosphere/90 p-5 shadow-sm ring-1 ring-sumac/15 sm:p-6">
            <h2 className="font-heading text-lg font-extrabold text-olive sm:text-xl">
              سعة الفعالية (الحد الأقصى للضيوف)
            </h2>
            <p className="mt-1 text-sm text-earth/70">
              يحدّ هذا الرقم السعة المعروضة في نموذج الحجز ويُقارَن مع مجموع{" "}
              <code className="rounded bg-earth/5 px-1 text-xs">
                guest_count
              </code>{" "}
              في الحجوزات.
            </p>
            {settingsError ? (
              <p
                className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {settingsError}
              </p>
            ) : null}
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="event_max_guests" className="text-earth">
                  العدد الأقصى (شخصاً)
                </Label>
                <Input
                  id="event_max_guests"
                  type="number"
                  min={1}
                  max={10000}
                  dir="ltr"
                  className="h-11 max-w-[12rem] rounded-xl border-earth/20 text-left font-mono text-base"
                  value={eventMaxInput}
                  onChange={(e) => {
                    setEventMaxInput(e.target.value);
                    setSettingsSaved(false);
                  }}
                  disabled={loading || settingsSaving}
                />
              </div>
              <Button
                type="button"
                className="h-11 rounded-full px-8 font-bold"
                disabled={loading || settingsSaving}
                onClick={() => void saveEventCapacity()}
              >
                {settingsSaving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    جاري الحفظ…
                  </span>
                ) : settingsSaved ? (
                  "تم الحفظ"
                ) : (
                  "حفظ السعة"
                )}
              </Button>
            </div>
          </div>

          {rows.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-dashed border-earth/20 bg-musakhan-atmosphere/80 py-16 text-center text-earth/65">
              لا توجد حجوزات بعد.
            </p>
          ) : (
            <div className="mt-8 overflow-x-auto rounded-2xl border border-earth/10 bg-cream/50 shadow-sm ring-1 ring-earth/5">
              <table className="w-full min-w-[720px] border-collapse text-right text-sm">
                <thead>
                  <tr className="border-b border-earth/15 bg-musakhan-atmosphere/90">
                    <th className="px-3 py-3 font-semibold text-olive sm:px-4">
                      الاسم
                    </th>
                    <th className="px-3 py-3 font-semibold text-olive sm:px-4">
                      الهاتف
                    </th>
                    <th className="px-3 py-3 font-semibold text-olive sm:px-4">
                      الضيوف
                    </th>
                    <th className="px-3 py-3 font-semibold text-olive sm:px-4">
                      ملاحظة
                    </th>
                    <th className="px-3 py-3 font-semibold text-olive sm:px-4">
                      إثبات الدفع
                    </th>
                    <th className="px-3 py-3 font-semibold text-olive sm:px-4">
                      التاريخ
                    </th>
                    <th className="px-3 py-3 font-semibold text-olive sm:px-4">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-earth/10 last:border-0"
                    >
                      <td className="max-w-[140px] px-3 py-3 align-top font-medium sm:px-4">
                        {r.full_name}
                      </td>
                      <td className="px-3 py-3 align-top sm:px-4" dir="ltr">
                        {r.phone}
                      </td>
                      <td className="px-3 py-3 align-top sm:px-4">
                        {guestLabel(r.guest_count)}
                      </td>
                      <td className="max-w-[200px] px-3 py-3 align-top text-earth/85 sm:px-4">
                        {r.note ?? "—"}
                      </td>
                      <td className="px-3 py-3 align-top sm:px-4">
                        {r.payment_proof_view_url ? (
                          <a
                            href={r.payment_proof_view_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-olive underline underline-offset-2"
                          >
                            عرض الصورة
                          </a>
                        ) : r.payment_proof_url ? (
                          <span
                            className="text-earth/60"
                            title="تعذّر إنشاء رابط مؤقّت"
                          >
                            غير متاح
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 align-top text-earth/80 sm:px-4">
                        {new Date(r.created_at).toLocaleString("ar-EG", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-3 py-3 align-top sm:px-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
                          disabled={deletingId !== null}
                          onClick={() => openDeleteDialog(r.id)}
                        >
                          {deletingId === r.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" aria-hidden />
                          )}
                          حذف
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
