"use client";

import * as React from "react";
import {
  Building2,
  Check,
  ChevronLeft,
  Copy,
  Loader2,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { getPublicPaymentInstructions } from "@/config/payment-public";
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

function CopyValueButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = React.useState(false);
  if (!value) return null;
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => {
          setDone(true);
          window.setTimeout(() => setDone(false), 2000);
        });
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-sumac/25 bg-cream/90 px-2.5 py-1.5 text-xs font-bold text-sumac-deep transition hover:border-heritage/50 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage/50"
    >
      {done ? (
        <Check className="size-3.5 text-olive" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
      {done ? "تم النسخ" : label}
    </button>
  );
}

export function BookingSection() {
  const PAYMENT = getPublicPaymentInstructions();

  const [step, setStep] = React.useState<1 | 2>(1);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

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
  const [capacityHint, setCapacityHint] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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

  async function goToPaymentStep() {
    setError(null);
    setCapacityHint(null);
    if (!people) {
      setPeopleError(true);
      return;
    }
    setPeopleError(false);

    const snap = await refreshCapacity();
    if (!snap) {
      setCapacityHint("تعذّر التحقق من السعة. حدّث الصفحة أو تواصل معنا.");
      return;
    }

    const req = requestedGuests(people);
    if (snap.isFull) {
      setCapacityHint("الفعالية محجوزة بالكامل.");
      return;
    }
    if (req > snap.remaining) {
      const ar = toEasternArabicNumerals(snap.remaining);
      setCapacityHint(
        snap.remaining === 1
          ? "تبقّى مقعد واحد فقط."
          : `تبقّى ${ar} مقاعد فقط.`,
      );
      return;
    }

    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (capacityBlocksSubmit) {
      setError("لا يمكن إرسال الحجز حالياً — تحقق من السعة أو حدّث الصفحة.");
      return;
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("الرجاء إدخال الاسم في الخطوة الأولى.");
      setStep(1);
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError("الرجاء إدخال رقم هاتف صالح في الخطوة الأولى.");
      setStep(1);
      return;
    }
    if (!people) {
      setPeopleError(true);
      setStep(1);
      return;
    }

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("الرجاء رفع صورة إثبات التحويل.");
      return;
    }

    setLoading(true);
    const fd = new FormData();
    fd.set("full_name", fullName.trim());
    fd.set("phone", phone.trim());
    fd.set("guest_count", people === "8+" ? "9" : people);
    fd.set("note", note.trim());
    fd.set("payment", file);

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
      setStep(1);
      setFullName("");
      setPhone("");
      setPeople("");
      setNote("");
      setFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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

  const stepper = (
    <div
      className="mb-6 flex items-center justify-center gap-2 sm:mb-8 sm:gap-3"
      aria-hidden
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold sm:text-sm",
          step === 1
            ? "bg-sumac text-cream shadow-md ring-2 ring-heritage/40"
            : "bg-cream/80 text-earth/55 ring-1 ring-earth/10",
        )}
      >
        <span
          className={cn(
            "flex size-6 items-center justify-center rounded-full text-[0.7rem] sm:size-7",
            step === 1 ? "bg-cream/20" : "bg-earth/10",
          )}
        >
          ١
        </span>
        بياناتك
      </div>
      <span className="h-px w-8 bg-gradient-to-l from-heritage/50 to-transparent sm:w-12" />
      <span className="h-px w-8 bg-gradient-to-r from-sumac/30 to-transparent sm:w-12" />
      <div
        className={cn(
          "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold sm:text-sm",
          step === 2
            ? "bg-sumac text-cream shadow-md ring-2 ring-heritage/40"
            : "bg-cream/80 text-earth/55 ring-1 ring-earth/10",
        )}
      >
        <span
          className={cn(
            "flex size-6 items-center justify-center rounded-full text-[0.7rem] sm:size-7",
            step === 2 ? "bg-cream/20" : "bg-earth/10",
          )}
        >
          ٢
        </span>
        الدفع والإثبات
      </div>
    </div>
  );

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
                  : "bg-heritage/20 text-sumac-deep",
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

  const step1Body = (
    <div
      className="flex flex-col gap-5 sm:gap-6"
      aria-hidden={step !== 1 && !prefersReducedMotion}
    >
      {capacityHint ? (
        <p
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm font-medium text-destructive"
          role="alert"
        >
          {capacityHint}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="full_name" className="text-sm font-semibold text-earth">
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
        <Label htmlFor="phone" className="text-sm font-semibold text-earth">
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
        <Label htmlFor="people" className="text-sm font-semibold text-earth">
          عدد الأشخاص
        </Label>
        <Select
          value={people}
          onValueChange={(v) => {
            setPeople(v ?? "");
            setPeopleError(false);
            setCapacityHint(null);
          }}
          disabled={capacityBlocksSubmit || peopleOptions.length === 0}
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
          <p className="text-sm text-destructive">يرجى اختيار عدد الأشخاص</p>
        ) : null}
        {capacity.status === "ready" &&
        !capacity.isFull &&
        peopleOptions.length > 0 ? (
          <p className="text-xs leading-relaxed text-earth/60">
            يمكنك اختيار حتى{" "}
            <span className="font-bold text-sumac-deep">
              {toEasternArabicNumerals(Math.min(9, capacity.remaining))} أشخاص
            </span>{" "}
            بحسب المقاعد المتبقية.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="note" className="text-sm font-semibold text-earth">
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

      <Button
        type="button"
        disabled={capacityBlocksSubmit}
        onClick={() => void goToPaymentStep()}
        className="h-12 w-full rounded-full border-0 bg-linear-to-l from-sumac via-sumac-deep to-olive-deep text-base font-bold text-cream shadow-[0_14px_36px_-14px_rgba(140,48,72,0.45)] ring-2 ring-heritage/35 transition hover:brightness-105 sm:h-14 sm:text-lg"
      >
        متابعة إلى الدفع
      </Button>
    </div>
  );

  const step2Body = (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="flex flex-col gap-5 sm:gap-6"
      aria-hidden={step !== 2 && !prefersReducedMotion}
    >
      <div className="rounded-2xl border-2 border-sumac/35 bg-linear-to-br from-parchment via-cream/95 to-parchment p-4 shadow-[inset_0_1px_0_rgba(255,253,248,0.65),0_16px_40px_-22px_rgba(140,48,72,0.2)] ring-1 ring-heritage/25 sm:p-5">
        <div className="flex items-start gap-3 border-b border-earth/10 pb-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sumac/10 text-sumac ring-1 ring-heritage/30">
            <ShieldCheck className="size-6" aria-hidden strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1 text-right">
            <p className="flex items-center justify-end gap-1.5 font-heading text-base font-extrabold text-earth sm:text-lg">
              <Lock className="size-4 text-sumac" aria-hidden />
              تفاصيل التحويل الآمن
            </p>
            <p className="mt-1 text-xs leading-relaxed text-earth/72 sm:text-sm">
              انسخ البيانات بدقة، نفّذ التحويل، ثم ارفع صورة واضحة للإيصال أو
              لقطة شاشة التطبيق. لن يُعتمد الحجز بدون إثبات الدفع.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {PAYMENT.isConfigured ? (
            <>
              {PAYMENT.bankName ? (
                <div className="flex items-start justify-between gap-2 border-b border-earth/10 pb-3 text-right">
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-earth/45">
                      البنك
                    </p>
                    <p className="mt-0.5 flex items-center justify-end gap-2 font-semibold text-earth">
                      <Building2
                        className="size-4 shrink-0 text-sumac-muted"
                        aria-hidden
                      />
                      {PAYMENT.bankName}
                    </p>
                  </div>
                </div>
              ) : null}
              {PAYMENT.branch ? (
                <div className="border-b border-earth/10 pb-3 text-right">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wider text-earth/45">
                    الفرع
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-earth">
                    {PAYMENT.branch}
                  </p>
                </div>
              ) : null}
              {PAYMENT.accountHolder ? (
                <div className="border-b border-earth/10 pb-3 text-right">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wider text-earth/45">
                    اسم صاحب الحساب
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-earth">
                    {PAYMENT.accountHolder}
                  </p>
                </div>
              ) : null}
              {PAYMENT.accountNumber ? (
                <div className="flex flex-col gap-2 border-b border-earth/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1 text-right">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-earth/45">
                      رقم الحساب
                    </p>
                    <p
                      className="mt-1 break-all font-mono text-base font-bold tracking-wide text-sumac-deep sm:text-lg"
                      dir="ltr"
                    >
                      {PAYMENT.accountNumber}
                    </p>
                  </div>
                  <CopyValueButton
                    value={PAYMENT.accountNumber}
                    label="نسخ الرقم"
                  />
                </div>
              ) : null}
              {PAYMENT.iban ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1 text-right">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-earth/45">
                      الآيبان (IBAN)
                    </p>
                    <p
                      className="mt-1 break-all font-mono text-sm font-bold text-earth sm:text-base"
                      dir="ltr"
                    >
                      {PAYMENT.iban}
                    </p>
                  </div>
                  <CopyValueButton value={PAYMENT.iban} label="نسخ الآيبان" />
                </div>
              ) : null}
              {PAYMENT.transferNote ? (
                <p className="rounded-lg border border-heritage/35 bg-heritage/10 px-3 py-2 text-xs font-medium text-earth sm:text-sm">
                  {PAYMENT.transferNote}
                </p>
              ) : null}
            </>
          ) : (
            <div className="rounded-xl border border-gold/35 bg-cream/80 px-3 py-3 text-center text-sm text-earth/85">
              <p className="font-semibold text-earth">
                تفاصيل الحساب تُضبط من إعدادات الموقع
              </p>
              <p className="mt-1 text-xs text-earth/65">
                أضف المتغيرات <span dir="ltr">NEXT_PUBLIC_PAYMENT_*</span> في
                ملف البيئة، أو تواصل معنا هاتفياً لاستلام بيانات التحويل قبل
                الدفع.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-heritage/55 bg-linear-to-b from-cream/90 to-parchment/80 p-4 ring-1 ring-sumac/15 sm:p-5">
        <p className="text-center font-heading text-sm font-extrabold text-sumac-deep sm:text-base">
          ارفع إثبات التحويل
        </p>
        <p className="mt-1 text-center text-xs text-earth/70 sm:text-sm">
          صورة واضحة للإيصال أو لقطة شاشة — PNG أو JPG حتى 10 ميجابايت
        </p>
        <input
          ref={fileInputRef}
          type="file"
          name="payment"
          accept="image/png,image/jpeg"
          required
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            setFileName(f ? f.name : null);
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-earth/15 bg-cream/70 px-4 py-5 text-center transition hover:border-sumac/35 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage/45 sm:min-h-[160px]"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-linear-to-b from-sumac to-sumac-deep text-cream shadow-lg ring-2 ring-heritage/40">
            <Upload className="size-7" aria-hidden />
          </span>
          <span className="text-sm font-bold text-earth sm:text-base">
            اضغط لاختيار الصورة
          </span>
          {fileName ? (
            <span className="max-w-full truncate text-xs font-semibold text-olive">
              {fileName}
            </span>
          ) : (
            <span className="text-xs text-earth/50">لم يُختَر ملف بعد</span>
          )}
        </button>
      </div>

      {error ? (
        <p
          className="rounded-xl border border-destructive/35 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row-reverse sm:justify-between">
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-full border-2 border-earth/20 bg-cream/80 text-earth hover:bg-cream sm:h-12 sm:min-w-[8rem]"
          onClick={() => {
            setStep(1);
            setError(null);
            setCapacityHint(null);
          }}
        >
          <ChevronLeft className="ms-1 size-4" aria-hidden />
          رجوع
        </Button>
        <Button
          type="submit"
          disabled={loading || capacityBlocksSubmit}
          className="h-12 flex-1 rounded-full border-0 bg-linear-to-l from-sumac via-sumac-deep to-olive-deep text-base font-bold text-cream shadow-[0_16px_40px_-14px_rgba(140,48,72,0.45)] ring-2 ring-heritage/40 transition hover:brightness-105 disabled:opacity-60 sm:h-14 sm:text-lg"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-5 animate-spin" aria-hidden />
              جاري الإرسال…
            </span>
          ) : (
            "إرسال الحجز وإثبات الدفع"
          )}
        </Button>
      </div>
    </form>
  );

  const flipShell = prefersReducedMotion ? (
    <div className="min-h-0">{step === 1 ? step1Body : step2Body}</div>
  ) : (
    <div className="booking-flip-perspective min-h-[28rem] sm:min-h-[32rem]">
      <div
        className="booking-flip-inner relative min-h-[28rem] sm:min-h-[32rem]"
        data-step={step}
      >
        <div
          className={cn(
            "booking-flip-face absolute inset-0 overflow-y-auto scrollbar-musakhan rounded-b-2xl px-4 py-6 sm:px-7 sm:py-8",
            step !== 1 && "pointer-events-none",
          )}
          aria-hidden={step !== 1}
        >
          {step1Body}
        </div>
        <div
          className={cn(
            "booking-flip-face booking-flip-face--back absolute inset-0 overflow-y-auto scrollbar-musakhan rounded-b-2xl px-4 py-6 sm:px-7 sm:py-8",
            step !== 2 && "pointer-events-none",
          )}
          aria-hidden={step !== 2}
        >
          {step2Body}
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="booking"
      className="bg-musakhan-atmosphere section-pad relative scroll-mt-10 overflow-x-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_10px,rgba(63,42,26,0.04)_10px,rgba(63,42,26,0.04)_11px)] opacity-60"
        aria-hidden
      />
      <SectionContainer className="relative z-10 min-w-0">
        <SectionDivider />
        <header className="mx-auto mt-4 max-w-2xl text-center sm:mt-5 md:mt-6">
          <div className="mx-auto mb-3 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sumac/30 bg-cream/90 px-3 py-1 text-xs font-semibold text-earth ring-1 ring-heritage/30 sm:text-sm">
              <Sparkles className="size-3.5 text-heritage-muted" aria-hidden />
              حجز بخطوتين
            </span>
          </div>
          <h2 className="font-heading text-2xl font-extrabold leading-tight text-olive [text-shadow:0_1px_0_rgba(255,253,248,0.6)] sm:text-3xl md:text-[2rem]">
            احجز مقعدك
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-xs font-medium text-sumac-deep/90 sm:text-sm">
            بياناتك أولاً، ثم تحويل آمن وإثبات واضح
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
          <div className="overflow-hidden rounded-2xl border border-earth/12 bg-linear-to-b from-parchment via-cream/90 to-parchment shadow-[0_28px_64px_-32px_rgba(63,42,26,0.22)] ring-1 ring-sumac/20">
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
                نموذج الحجز والدفع
              </p>
              <p className="mt-1 text-xs text-cream/85 sm:text-sm">
                الخطوة ١: معلوماتك · الخطوة ٢: التحويل وإثبات الدفع
              </p>
            </div>

            {submitted ? (
              <p
                className="px-4 py-10 text-center text-base font-medium text-olive sm:px-6"
                role="status"
              >
                تم استلام طلبك وإثبات الدفع. سنتواصل معك قريباً لتأكيد الحجز.
              </p>
            ) : (
              <div className="px-1 pb-1 pt-4 sm:px-2 sm:pt-5">
                {stepper}
                {capacityBanner}
                {flipShell}
              </div>
            )}
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-gold/30 bg-linear-to-b from-cream via-parchment to-cream/95 shadow-[0_12px_40px_-16px_rgba(63,42,26,0.16)] ring-1 ring-earth/8 sm:mt-10">
            <div
              className="h-1 w-full bg-linear-to-l from-transparent via-gold/70 to-transparent"
              aria-hidden
            />
            <div className="px-5 py-6 text-center sm:px-8 sm:py-8">
              <div className="mx-auto flex max-w-sm flex-col items-center gap-1">
                <span className="flex items-center justify-center gap-2 text-earth">
                  <span className="flex size-9 items-center justify-center rounded-full bg-olive/12 text-olive ring-1 ring-gold/25 sm:size-10">
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
                href="tel:+972501234567"
                className="mt-5 inline-flex items-center justify-center rounded-full border border-gold/40 bg-linear-to-b from-cream to-parchment px-6 py-2.5 text-lg font-bold tracking-wide text-earth shadow-sm ring-1 ring-gold/20 transition hover:border-gold/60 hover:bg-cream hover:text-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 sm:mt-6 sm:px-8 sm:text-xl"
                dir="ltr"
              >
                050-XXXX-XXX
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
