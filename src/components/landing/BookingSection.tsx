"use client";

import * as React from "react";
import { Loader2, MapPin, Phone, Sparkles, Upload } from "lucide-react";
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

const PEOPLE_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8+"] as const;

export function BookingSection() {
  const [people, setPeople] = React.useState<string>("");
  const [peopleError, setPeopleError] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!people) {
      setPeopleError(true);
      return;
    }
    setPeopleError(false);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("الرجاء رفع صورة إثبات الدفع");
      return;
    }

    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("guest_count", people === "8+" ? "9" : people);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "تعذّر إرسال الطلب");
        return;
      }
      setSubmitted(true);
      form.reset();
      setPeople("");
      setFileName(null);
    } catch {
      setError("خطأ في الاتصال. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="booking"
      className="section-pad relative scroll-mt-10 overflow-x-hidden bg-linear-to-b from-parchment via-cream/30 to-parchment"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_10px,rgba(63,42,26,0.04)_10px,rgba(63,42,26,0.04)_11px)] opacity-60"
        aria-hidden
      />
      <SectionContainer className="relative z-10 min-w-0">
        <SectionDivider />
        <header className="mx-auto mt-4 max-w-2xl text-center sm:mt-5 md:mt-6">
          <div className="mx-auto mb-3 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sumac/25 bg-cream/90 px-3 py-1 text-xs font-semibold text-earth ring-1 ring-sumac/15 sm:text-sm">
              <Sparkles className="size-3.5 text-sumac-muted" aria-hidden />
              حجز سريع
            </span>
          </div>
          <h2 className="font-heading text-2xl font-extrabold leading-tight text-olive [text-shadow:0_1px_0_rgba(255,253,248,0.6)] sm:text-3xl md:text-[2rem]">
            احجز مقعدك
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-xs font-medium text-sumac-deep/90 sm:text-sm">
            نكهة السماق والبصل — كما في بيوت القدس
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-earth/88 sm:text-base md:text-lg">
            املأ النموذج وسنتواصل معك لتأكيد موعدك في المهرجان
          </p>
        </header>

        <div className="mx-auto mt-8 max-w-lg md:mt-10 md:max-w-xl">
          <div className="overflow-hidden rounded-2xl border border-earth/12 bg-linear-to-b from-parchment via-cream/90 to-parchment shadow-[0_28px_64px_-32px_rgba(63,42,26,0.22)] ring-1 ring-sumac/20">
            <div
              className="tatreez-band tatreez-band-thin w-full"
              aria-hidden
            />
            <div className="relative border-b border-gold/20 bg-linear-to-l from-earth via-sumac-deep/85 to-olive-deep px-5 py-4 text-center sm:px-8 sm:py-5">
              <div
                className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-l from-transparent via-sumac-muted/80 to-transparent"
                aria-hidden
              />
              <p className="font-heading text-lg font-bold text-cream sm:text-xl">
                نموذج الحجز
              </p>
              <p className="mt-1 text-xs text-cream/85 sm:text-sm">
                جميع الحقول المطلوبة تساعدنا على خدمتك بأفضل شكل
              </p>
            </div>

            {submitted ? (
              <p
                className="px-4 py-8 text-center text-base font-medium text-olive sm:px-6"
                role="status"
              >
                تم استلام طلبك. سنتواصل معك قريبًا لتأكيد الحجز.
              </p>
            ) : (
              <form
                onSubmit={(e) => void handleSubmit(e)}
                encType="multipart/form-data"
                className="flex flex-col gap-5 px-4 py-7 sm:gap-6 sm:px-7 sm:py-8"
              >
                {error ? (
                  <p
                    className="rounded-xl border border-destructive/35 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}

                <input
                  type="hidden"
                  name="guest_count"
                  value={people === "8+" ? "9" : people}
                />

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="full_name"
                    className="text-sm font-semibold text-earth"
                  >
                    الاسم
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    required
                    minLength={2}
                    autoComplete="name"
                    placeholder="أدخل اسمك الكامل..."
                    className="landing-input"
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
                    name="phone"
                    type="tel"
                    required
                    minLength={8}
                    dir="ltr"
                    className="landing-input text-left"
                    placeholder="05X-XXXXXXX"
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
                      {PEOPLE_OPTIONS.map((n) => (
                        <SelectItem key={n} value={n} className="text-base">
                          {n === "8+"
                            ? "8+ أشخاص"
                            : `${n} ${n === "1" ? "شخص" : "أشخاص"}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {peopleError ? (
                    <p className="text-sm text-destructive">
                      يرجى اختيار عدد الأشخاص
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
                    name="note"
                    rows={4}
                    placeholder="أي ملاحظات أو طلبات خاصة..."
                    className="landing-textarea"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-earth">
                    إثبات الدفع
                  </span>
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
                    className={cn(
                      "flex min-h-[128px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-earth/22 bg-cream/70 px-4 py-6 text-center transition hover:border-gold/45 hover:bg-cream focus-visible:ring-2 focus-visible:ring-gold/35 focus-visible:outline-none sm:min-h-[144px]",
                    )}
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-linear-to-b from-earth to-olive text-cream shadow-md ring-1 ring-gold/25">
                      <Upload className="size-6" aria-hidden />
                    </span>
                    <span className="text-sm font-semibold text-earth sm:text-base">
                      اضغط لرفع صورة إثبات الدفع
                    </span>
                    <span className="text-xs text-earth/55 sm:text-sm">
                      PNG, JPG حتى 10MB
                    </span>
                    {fileName ? (
                      <span className="mt-1 max-w-full truncate text-xs font-medium text-olive">
                        {fileName}
                      </span>
                    ) : null}
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-14 w-full rounded-full border-0 bg-linear-to-l from-earth via-olive to-olive-deep text-base font-bold text-cream shadow-[0_16px_40px_-14px_rgba(63,42,26,0.48)] ring-2 ring-gold/30 transition hover:brightness-105 disabled:opacity-60 sm:h-[3.75rem] sm:text-lg"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin" aria-hidden />
                      جاري الإرسال…
                    </span>
                  ) : (
                    "تأكيد الحجز"
                  )}
                </Button>
              </form>
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
