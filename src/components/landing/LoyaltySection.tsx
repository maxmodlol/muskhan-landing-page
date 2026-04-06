import Image from "next/image";
import Link from "next/link";
import { LoyaltyVideoFrame } from "@/components/landing/LoyaltyVideoFrame";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { SectionDivider } from "@/components/landing/SectionDivider";
import { cn } from "@/lib/utils";

const STAMP_SLOTS = [1, 2, 3, 4, 5] as const;

function TatreezBand({ wide }: { wide?: boolean }) {
  return (
    <div
      className={cn(
        "tatreez-band w-full",
        wide ? "tatreez-band-wide" : "tatreez-band-thin",
      )}
      aria-hidden
    />
  );
}

export function LoyaltySection() {
  return (
    <section
      id="loyalty"
      className="section-pad relative scroll-mt-20 overflow-x-hidden bg-musakhan-atmosphere"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_20%,rgba(140,48,72,0.08)_0%,transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] paper-grain"
        aria-hidden
      />

      <TatreezBand wide />

      <SectionContainer className="relative z-10">
        <SectionDivider />
        <header className="mx-auto mt-4 max-w-4xl text-center sm:mt-6">
          <p className="font-heading text-lg font-bold leading-snug text-earth sm:text-xl md:text-2xl">
            سافر في ذواقة القدس الأصيلة
          </p>
          <p className="mt-3 text-sm leading-relaxed text-earth/85 sm:text-base md:text-lg">
            جواز سفر المسخن — خمسة أختام، ثم هدية من المطبخ
          </p>
        </header>

        <div className="mx-auto mt-6 w-full max-w-4xl sm:mt-8 md:mt-10">
          <LoyaltyVideoFrame />

          {/* Booklet / passport — same width as video (max-w-4xl column) */}
          <div
            className={cn(
              "relative mt-8 border-[7px] border-passport shadow-[0_20px_50px_-18px_rgba(21,34,56,0.55),inset_0_0_80px_rgba(62,42,26,0.06)]",
              "rounded-sm sm:mt-10 sm:border-[9px] md:mt-12",
            )}
          >
            <div
              className="absolute inset-0 rounded-sm bg-linear-to-b from-passport-deep/40 to-transparent opacity-50"
              aria-hidden
            />
            <div className="relative bg-[#f1e6d8] paper-grain">
              <div className="border-b-2 border-earth/15 border-double px-4 py-3 sm:px-6 sm:py-4">
                <p className="text-center font-heading text-base font-extrabold tracking-wide text-earth sm:text-lg">
                  جواز سفر المسخن
                </p>
                <p className="mt-1 text-center text-[0.65rem] font-medium text-earth/55 sm:text-xs">
                  Musakhan Passport · عين القدس
                </p>
              </div>

              <div className="grid gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 md:grid-cols-2 md:gap-10 md:py-10">
                {/* Text “page” */}
                <div className="flex flex-col justify-center border-earth/20 text-right md:border-l md:border-double md:pl-8">
                  <p className="text-sm leading-[1.85] text-earth/92 sm:text-base">
                    يحمل حامل هذا الجواز، بعد جمع{" "}
                    <span className="font-bold text-sumac-deep">
                      خمسة أختام
                    </span>{" "}
                    (خمس زيارات أو طلبات مسخن مسجّلة)، حقّه في استلام{" "}
                    <span className="whitespace-nowrap border-b border-dashed border-sumac/50 pb-0.5 font-semibold text-sumac-deep">
                      بطاقة خصم 20٪
                    </span>{" "}
                    صالحة لمدة شهر كامل.
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-earth/70 sm:text-sm">
                    الأختام توثّق مشاركتك في المهرجان — كختم على صفحة من رحلة
                    الذوق.
                  </p>
                </div>

                {/* Stamps */}
                <div>
                  <p className="mb-4 text-center font-heading text-sm font-bold text-earth sm:mb-5 sm:text-base">
                    أختام الرحلة
                  </p>
                  <div className="flex flex-row-reverse flex-wrap items-center justify-center gap-3 sm:gap-4">
                    {STAMP_SLOTS.map((n) => (
                      <div
                        key={n}
                        className={cn(
                          "flex size-12 items-center justify-center rounded-full border-[2.5px] border-dashed border-earth/35 bg-[#e8dfd2]/90 text-sm font-bold text-earth/50 sm:size-14",
                          n === 3 &&
                            "border-0 border-solid bg-sumac text-cream shadow-[0_4px_14px_-2px_rgba(140,48,72,0.5)] ring-2 ring-heritage/45",
                        )}
                        aria-hidden
                      >
                        {n === 3 ? (
                          <span className="text-xl leading-none">✓</span>
                        ) : (
                          <span className="opacity-55">{n}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-center text-[0.7rem] text-earth/55 sm:text-xs">
                    مثال: الختم الثالث مكتمل — الباقي في انتظار زياراتك
                  </p>

                  <div className="mt-6 flex flex-col items-center gap-2 sm:mt-8">
                    <p className="text-center text-[0.65rem] font-semibold uppercase tracking-wider text-earth/45 sm:text-xs">
                      ختم الترحيب
                    </p>
                    <div
                      className="relative w-[min(72%,11.5rem)] drop-shadow-[0_10px_22px_rgba(63,42,26,0.12)] sm:w-48"
                      style={{ transform: "rotate(-5.5deg)" }}
                    >
                      <Image
                        src="/passport-welcome-stamp.png"
                        alt="مرحباً بكم — نتمنى لكم رحلة سعيدة — Jerusalem Eye"
                        width={384}
                        height={384}
                        className="h-auto w-full opacity-[0.94] mix-blend-multiply contrast-[1.02]"
                        sizes="(max-width: 640px) 72vw, 192px"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-4 mb-6 border-t border-earth/15 border-dashed sm:mx-6" />

              <div className="mx-4 mb-6 flex justify-center sm:mx-8">
                <div className="border-2 border-heritage/35 bg-sumac px-8 py-4 text-center text-cream shadow-[inset_0_2px_0_rgba(255,253,248,0.12)] ring-1 ring-sumac-deep/40 sm:px-10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cream/90">
                    المكافأة
                  </p>
                  <p className="mt-1 font-heading text-4xl font-extrabold tabular-nums sm:text-5xl">
                    20٪
                  </p>
                  <p className="mt-1 text-sm text-cream/95">خصم لمدة شهر</p>
                </div>
              </div>

              <p className="pb-6 text-center font-mono text-[0.6rem] text-earth/40 sm:text-[0.65rem]">
                ‎MP‑JRS‑2026 · عين القدس
              </p>
            </div>
          </div>

          {/* Traditional note blocks — framed, no rounded “app” cards */}
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6">
            <div className="border-y-4 border-earth/20 border-double bg-cream/50 px-4 py-5 text-right sm:px-5 sm:py-6">
              <p className="font-heading text-base font-bold text-sumac-deep sm:text-lg">
                كيف يُجمع الختم؟
              </p>
              <p className="mt-2 text-sm leading-relaxed text-earth/88 sm:text-base">
                كل طلب مسخن مؤكّد أو حضور في موعد المهرجان = ختم واحد يدوَّن لك
                عند الاستلام أو التسليم.
              </p>
            </div>
            <div className="border-y-4 border-earth/20 border-double bg-cream/50 px-4 py-5 text-right sm:px-5 sm:py-6">
              <p className="font-heading text-base font-bold text-sumac-deep sm:text-lg">
                متى تستلم البطاقة؟
              </p>
              <p className="mt-2 text-sm leading-relaxed text-earth/88 sm:text-base">
                بعد الختم الخامس نسلّمك بطاقة الخصم — تصلح لكل أصناف المسخن في
                المهرجان طوال الشهر التالي.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center sm:mt-10">
            <Link
              href="#booking"
              className="group inline-flex min-h-12 w-full max-w-md flex-col items-center justify-center gap-1 border-2 border-sumac bg-cream/90 px-6 py-4 text-center text-earth shadow-[0_10px_28px_-12px_rgba(140,48,72,0.3)] ring-1 ring-heritage/25 transition hover:bg-sumac hover:text-cream hover:ring-heritage/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage focus-visible:ring-offset-2 focus-visible:ring-offset-parchment sm:min-h-[3.25rem] sm:px-10"
            >
              <span className="font-heading text-lg font-bold sm:text-xl">
                ابدأ رحلتك — احجز الآن
              </span>
              <span className="text-xs text-earth/70 transition group-hover:text-cream/90 sm:text-sm">
                من الطابون إلى ختمك الأول
              </span>
            </Link>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
