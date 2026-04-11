"use client";

import * as React from "react";
import {
  Loader2,
  MapPin,
  Minus,
  Phone,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { DEFAULT_EVENT_MAX_GUESTS } from "@/lib/booking-capacity";
import { toEasternArabicNumerals } from "@/lib/eastern-arabic-numerals";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { SectionDivider } from "@/components/landing/SectionDivider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { parseMenuPriceToNumber } from "@/lib/parse-menu-price";

type CapacityOk = {
  ok: true;
  totalCapacity: number;
  bookedSeats: number;
  remaining: number;
  isFull: boolean;
};

type CapacityResponse = CapacityOk | { ok: false; error: string };

function isCapacityOk(data: CapacityResponse): data is CapacityOk {
  return data.ok === true;
}

function requestedGuests(people: string): number {
  if (!people) return 0;
  if (people === "8+") return 9;
  const n = parseInt(people, 10);
  return Number.isFinite(n) ? n : 0;
}

function buildPeopleOptions(remaining: number): readonly string[] {
  if (remaining <= 0) return [];
  const max = Math.min(9, remaining);
  const out: string[] = [];
  for (let i = 1; i <= Math.min(8, max); i++) out.push(String(i));
  if (remaining >= 9) out.push("8+");
  return out;
}

export function BookingSection() {
  const { lines, setQty, removeLine, clear: clearCart } = useCart();

  const orderTotal = React.useMemo(
    () =>
      lines.reduce(
        (sum, l) => sum + parseMenuPriceToNumber(l.price) * l.qty,
        0,
      ),
    [lines],
  );

  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [people, setPeople] = React.useState("");
  const [note, setNote] = React.useState("");

  const [capacity, setCapacity] = React.useState<
    | { status: "loading" }
    | { status: "error"; message: string }
    | {
        status: "ready";
        totalCapacity: number;
        bookedSeats: number;
        remaining: number;
        isFull: boolean;
      }
  >({ status: "loading" });

  const [peopleError, setPeopleError] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const refreshCapacity =
    React.useCallback(async (): Promise<CapacityOk | null> => {
      try {
        const res = await fetch("/api/reservations/capacity", {
          cache: "no-store",
        });
        const data = (await res.json()) as CapacityResponse;
        if (!res.ok || !isCapacityOk(data)) {
          const message = !isCapacityOk(data)
            ? data.error
            : "تعذّر التحقق من السعة.";
          setCapacity({ status: "error", message });
          return null;
        }
        setCapacity({
          status: "ready",
          totalCapacity: data.totalCapacity,
          bookedSeats: data.bookedSeats,
          remaining: data.remaining,
          isFull: data.isFull,
        });
        return data;
      } catch {
        setCapacity({
          status: "error",
          message: "تعذّر الاتصال بالخادم للتحقق من السعة.",
        });
        return null;
      }
    }, []);

  React.useEffect(() => {
    void refreshCapacity();
  }, [refreshCapacity]);

  React.useEffect(() => {
    if (capacity.status !== "ready") return;
    const req = requestedGuests(people);
    if (req > 0 && req > capacity.remaining) {
      setPeople("");
    }
  }, [capacity, people]);

  const peopleOptions =
    capacity.status === "ready"
      ? buildPeopleOptions(capacity.remaining)
      : ([] as string[]);

  const capacityBlocksSubmit =
    capacity.status === "loading" ||
    capacity.status === "error" ||
    (capacity.status === "ready" && capacity.isFull);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (lines.length === 0) {
      setError("أضف أطباقاً من قائمة المهرجان قبل إرسال الحجز.");
      return;
    }

    if (capacityBlocksSubmit) {
      setError("لا يمكن إرسال الحجز حالياً — تحقق من السعة أو حدّث الصفحة.");
      return;
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("الرجاء إدخال الاسم الكامل.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError("الرجاء إدخال رقم هاتف صالح.");
      return;
    }
    if (!people) {
      setPeopleError(true);
      setError("يرجى اختيار عدد الأشخاص.");
      return;
    }
    setPeopleError(false);

    const snap = await refreshCapacity();
    if (!snap) {
      setError("تعذّر التحقق من السعة. حدّث الصفحة أو تواصل معنا.");
      return;
    }
    const req = requestedGuests(people);
    if (snap.isFull) {
      setError("الفعالية محجوزة بالكامل.");
      return;
    }
    if (req > snap.remaining) {
      const ar = toEasternArabicNumerals(snap.remaining);
      setError(
        snap.remaining === 1
          ? "تبقّى مقعد واحد فقط."
          : `تبقّى ${ar} مقاعد فقط.`,
      );
      return;
    }

    setLoading(true);
    const fd = new FormData();
    fd.set("full_name", fullName.trim());
    fd.set("phone", phone.trim());
    fd.set("guest_count", people === "8+" ? "9" : people);
    fd.set("note", note.trim());
    fd.set(
      "menu_order",
      JSON.stringify(
        lines.map((l) => ({
          id: l.itemId,
          name: l.name,
          price: l.price,
          qty: l.qty,
        })),
      ),
    );

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "تعذّر إرسال الطلب");
        if (res.status === 409) void refreshCapacity();
        return;
      }
      setSubmitted(true);
      setFullName("");
      setPhone("");
      setPeople("");
      setNote("");
      clearCart();
      void refreshCapacity();
    } catch {
      setError("خطأ في الاتصال. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  const bookedPct =
    capacity.status === "ready"
      ? Math.min(100, (capacity.bookedSeats / capacity.totalCapacity) * 100)
      : 0;

  const capacityBanner = (
    <div
      className="mb-5 rounded-xl border border-earth/12 bg-cream/60 px-3 py-3 sm:px-4"
      role="status"
      aria-live="polite"
    >
      {capacity.status === "loading" ? (
        <p className="flex items-center justify-center gap-2 text-sm text-earth/70">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          جاري التحقق من المقاعد المتاحة…
        </p>
      ) : null}
      {capacity.status === "error" ? (
        <p className="text-center text-sm font-medium text-destructive">
          {capacity.message}
        </p>
      ) : null}
      {capacity.status === "ready" ? (
        <div className="space-y-2 text-right">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-earth/75 sm:text-sm">
            <span className="font-semibold text-earth">
              السعة:{" "}
              <span className="tabular-nums text-sumac-deep" dir="ltr">
                {toEasternArabicNumerals(capacity.bookedSeats)}/
                {toEasternArabicNumerals(capacity.totalCapacity)}
              </span>{" "}
              شخصاً محجوزاً
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold sm:text-xs",
                capacity.isFull
                  ? "bg-destructive/15 text-destructive"
                  : "bg-heritage/25 text-sumac-deep",
              )}
            >
              {capacity.isFull
                ? "مكتمل"
                : `متبقٍّ ${toEasternArabicNumerals(capacity.remaining)}`}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-earth/10">
            <div
              className="h-full rounded-full bg-linear-to-l from-heritage via-sumac to-sumac-deep transition-[width] duration-500"
              style={{ width: `${bookedPct}%` }}
            />
          </div>
          {capacity.isFull ? (
            <p className="text-center text-sm font-bold text-destructive">
              الفعالية محجوزة بالكامل — نعتذر، لا تتوفر مقاعد حالياً.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  return (
    <section
      id="booking"
      className="bg-musakhan-atmosphere section-pad relative scroll-mt-10 overflow-x-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_10px,rgba(61,36,51,0.04)_10px,rgba(61,36,51,0.04)_11px)] opacity-60"
        aria-hidden
      />
      <SectionContainer className="relative z-10 min-w-0">
        <SectionDivider />
        <header className="mx-auto mt-4 max-w-2xl text-center sm:mt-5 md:mt-6">
          <div className="mx-auto mb-3 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sumac/30 bg-cream/90 px-3 py-1 text-xs font-semibold text-earth ring-1 ring-heritage/30 sm:text-sm">
              <Sparkles className="size-3.5 text-sumac-muted" aria-hidden />
              حجز مع طلبك
            </span>
          </div>
          <h2 className="font-heading text-2xl font-extrabold leading-tight text-sumac-deep [text-shadow:0_1px_0_rgba(255,253,248,0.6)] sm:text-3xl md:text-[2rem]">
            احجز مقعدك
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-xs font-medium text-earth/90 sm:text-sm">
            اختر أطباقك من القائمة، ثم أكمِل بياناتك — خطوة واحدة
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-earth/88 sm:text-base md:text-lg">
            السعة الإجمالية{" "}
            <span className="font-bold text-sumac-deep">
              {toEasternArabicNumerals(
                capacity.status === "ready"
                  ? capacity.totalCapacity
                  : DEFAULT_EVENT_MAX_GUESTS,
              )}{" "}
              أشخاص
            </span>
            — يتم التحديث لحظياً حسب الحجوزات المؤكدة.
          </p>
        </header>

        <div className="mx-auto mt-8 max-w-lg md:mt-10 md:max-w-xl">
          <div className="overflow-hidden rounded-2xl border border-earth/12 bg-linear-to-b from-parchment via-cream/90 to-parchment shadow-[0_28px_64px_-32px_rgba(61,36,51,0.22)] ring-1 ring-sumac/20">
            <div
              className="tatreez-band tatreez-band-thin w-full"
              aria-hidden
            />
            <div className="relative border-b border-heritage/25 bg-linear-to-l from-sumac-deep via-sumac to-olive-deep px-5 py-4 text-center sm:px-8 sm:py-5">
              <div
                className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-l from-transparent via-heritage/75 to-transparent"
                aria-hidden
              />
              <p className="font-heading text-lg font-bold text-cream sm:text-xl">
                نموذج الحجز
              </p>
              <p className="mt-1 text-xs text-cream/88 sm:text-sm">
                الطلب · بياناتك · المقاعد
              </p>
            </div>

            {submitted ? (
              <p
                className="px-4 py-10 text-center text-base font-medium text-sumac-deep sm:px-6"
                role="status"
              >
                تم استلام طلبك. سنتواصل معك قريباً لتأكيد الحجز والتفاصيل.
              </p>
            ) : (
              <form
                onSubmit={(e) => void handleSubmit(e)}
                className="space-y-0 px-1 pb-1 pt-4 sm:px-2 sm:pt-5"
              >
                <div className="scrollbar-musakhan max-h-none overflow-visible px-4 py-1 sm:px-7 sm:py-2">
                  {capacityBanner}

                  <div className="mb-6 rounded-2xl border border-sumac/20 bg-linear-to-br from-blush/25 via-parchment/90 to-cream/80 p-4 ring-1 ring-heritage/20 sm:p-5">
                    <h3 className="text-center font-heading text-sm font-bold text-sumac-deep sm:text-base">
                      ملخص الطلب
                    </h3>
                    {lines.length === 0 ? (
                      <p className="mt-3 text-center text-sm leading-relaxed text-earth/70">
                        لم تُضف أطباق بعد. انتقل إلى{" "}
                        <a
                          href="#menu"
                          className="font-bold text-sumac underline-offset-2 hover:underline"
                        >
                          قائمة المهرجان
                        </a>{" "}
                        واضغط «أضف» على الأصناف التي تفضّلها.
                      </p>
                    ) : (
                      <ul className="mt-4 space-y-3">
                        {lines.map((line) => (
                          <li
                            key={line.itemId}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-earth/10 bg-cream/70 px-3 py-2.5 text-right sm:gap-3"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-earth">
                                {line.name}
                              </p>
                              <p className="text-xs text-earth/60">
                                {line.price} · الكمية{" "}
                                {toEasternArabicNumerals(String(line.qty))}
                                {" · "}
                                <span className="font-semibold text-sumac-deep/90" dir="ltr">
                                  {toEasternArabicNumerals(
                                    String(
                                      parseMenuPriceToNumber(line.price) *
                                        line.qty,
                                    ),
                                  )}{" "}
                                  ₪
                                </span>
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                className="flex size-9 items-center justify-center rounded-lg border border-earth/15 bg-parchment text-earth transition hover:bg-blush/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage/50"
                                onClick={() =>
                                  setQty(line.itemId, line.qty - 1)
                                }
                                aria-label="تقليل الكمية"
                              >
                                <Minus className="size-4" aria-hidden />
                              </button>
                              <button
                                type="button"
                                className="flex size-9 items-center justify-center rounded-lg border border-earth/15 bg-parchment text-earth transition hover:bg-blush/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage/50"
                                onClick={() =>
                                  setQty(line.itemId, line.qty + 1)
                                }
                                aria-label="زيادة الكمية"
                              >
                                <Plus className="size-4" aria-hidden />
                              </button>
                              <button
                                type="button"
                                className="flex size-9 items-center justify-center rounded-lg border border-destructive/25 text-destructive transition hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30"
                                onClick={() => removeLine(line.itemId)}
                                aria-label="حذف من الطلب"
                              >
                                <Trash2 className="size-4" aria-hidden />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    {lines.length > 0 ? (
                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-earth/15 pt-3">
                        <span className="text-sm font-bold text-sumac-deep">
                          المجموع
                        </span>
                        <span
                          className="font-heading text-lg font-extrabold tabular-nums text-sumac-deep"
                          dir="ltr"
                        >
                          {toEasternArabicNumerals(String(orderTotal))} ₪
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-5 sm:gap-6">
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="full_name"
                        className="text-sm font-semibold text-earth"
                      >
                        الاسم الكامل
                      </Label>
                      <Input
                        id="full_name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        minLength={2}
                        autoComplete="name"
                        placeholder="أدخل اسمك كما سيظهر في الحجز…"
                        className="landing-input"
                        disabled={capacityBlocksSubmit}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-semibold text-earth"
                      >
                        رقم الهاتف
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        required
                        minLength={8}
                        dir="ltr"
                        className="landing-input text-left"
                        placeholder="05X-XXXXXXX"
                        disabled={capacityBlocksSubmit}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="people"
                        className="text-sm font-semibold text-earth"
                      >
                        عدد الأشخاص
                      </Label>
                      <Select
                        value={people}
                        onValueChange={(v) => {
                          setPeople(v ?? "");
                          setPeopleError(false);
                        }}
                        disabled={
                          capacityBlocksSubmit || peopleOptions.length === 0
                        }
                      >
                        <SelectTrigger
                          id="people"
                          aria-invalid={peopleError}
                          className={cn(
                            "landing-input flex h-12 w-full min-w-0 items-center justify-between px-4 text-right [&>span]:line-clamp-1",
                            peopleError &&
                              "border-destructive focus-visible:ring-destructive/30",
                          )}
                        >
                          <SelectValue placeholder="اختر العدد" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-earth/15">
                          {peopleOptions.map((n) => (
                            <SelectItem key={n} value={n} className="text-base">
                              {n === "8+"
                                ? "٨+ أشخاص (٩)"
                                : `${toEasternArabicNumerals(n)} ${n === "1" ? "شخص" : "أشخاص"}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {peopleError ? (
                        <p className="text-sm text-destructive">
                          يرجى اختيار عدد الأشخاص
                        </p>
                      ) : null}
                      {capacity.status === "ready" &&
                      !capacity.isFull &&
                      peopleOptions.length > 0 ? (
                        <p className="text-xs leading-relaxed text-earth/60">
                          يمكنك اختيار حتى{" "}
                          <span className="font-bold text-sumac-deep">
                            {toEasternArabicNumerals(
                              Math.min(9, capacity.remaining),
                            )}{" "}
                            أشخاص
                          </span>{" "}
                          بحسب المقاعد المتبقية.
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="note"
                        className="text-sm font-semibold text-earth"
                      >
                        ملاحظة (اختياري)
                      </Label>
                      <Textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        placeholder="حساسيات، مناسبة، وقت مفضل…"
                        className="landing-textarea"
                        disabled={capacityBlocksSubmit}
                      />
                    </div>

                    {error ? (
                      <p
                        className="rounded-xl border border-destructive/35 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
                        role="alert"
                      >
                        {error}
                      </p>
                    ) : null}

                    <Button
                      type="submit"
                      disabled={loading || capacityBlocksSubmit}
                      className="h-12 w-full rounded-full border-0 bg-linear-to-l from-sumac via-sumac-deep to-olive-deep text-base font-bold text-cream shadow-[0_16px_40px_-14px_rgba(89,42,68,0.45)] ring-2 ring-heritage/40 transition hover:brightness-105 disabled:opacity-60 sm:h-14 sm:text-lg"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2
                            className="size-5 animate-spin"
                            aria-hidden
                          />
                          جاري الإرسال…
                        </span>
                      ) : (
                        "إرسال طلب الحجز"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-gold/30 bg-linear-to-b from-cream via-parchment to-cream/95 shadow-[0_12px_40px_-16px_rgba(61,36,51,0.16)] ring-1 ring-earth/8 sm:mt-10">
            <div
              className="h-1 w-full bg-linear-to-l from-transparent via-gold/70 to-transparent"
              aria-hidden
            />
            <div className="px-5 py-6 text-center sm:px-8 sm:py-8">
              <div className="mx-auto flex max-w-sm flex-col items-center gap-1">
                <span className="flex items-center justify-center gap-2 text-earth">
                  <span className="flex size-9 items-center justify-center rounded-full bg-sumac/10 text-sumac-deep ring-1 ring-blush/40 sm:size-10">
                    <Phone
                      className="size-4 sm:size-[1.125rem]"
                      aria-hidden
                      strokeWidth={2.25}
                    />
                  </span>
                </span>
                <p className="mt-2 font-heading text-base font-bold text-earth sm:text-lg">
                  للاستفسارات والمحجوزات
                </p>
              </div>

              <a
                href="tel:+972533891377"
                className="mt-5 inline-flex items-center justify-center rounded-full border border-gold/40 bg-linear-to-b from-cream to-parchment px-6 py-2.5 text-lg font-bold tracking-wide text-earth shadow-sm ring-1 ring-gold/20 transition hover:border-gold/60 hover:bg-cream hover:text-sumac-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 sm:mt-6 sm:px-8 sm:text-xl"
                dir="ltr"
              >
                053-3891377
              </a>

              <div
                className="mx-auto my-5 h-px w-24 max-w-[min(100%,12rem)] bg-gradient-to-r from-transparent via-gold/55 to-transparent sm:my-6"
                aria-hidden
              />

              <p className="mx-auto flex max-w-md items-start justify-center gap-2.5 text-sm leading-relaxed text-earth/88 sm:text-base">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-gold sm:size-5"
                  aria-hidden
                  strokeWidth={2.25}
                />
                <span className="text-pretty font-medium text-earth/95">
                  عين القدس، المدينة القديمة
                </span>
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
