import { SectionContainer } from "@/components/landing/SectionContainer";
import { SectionDivider } from "@/components/landing/SectionDivider";
import { StampCtaLink } from "@/components/landing/StampCtaLink";
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_20%,rgba(89,42,68,0.07)_0%,transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28] paper-grain mix-blend-multiply"
        aria-hidden
      />

      <SectionContainer className="relative z-10">
        <SectionDivider />
        <header className="mx-auto mt-4 max-w-4xl text-center sm:mt-6">
          <p className="font-heading text-lg font-bold leading-snug text-sumac-deep sm:text-xl md:text-2xl [text-shadow:0_1px_0_rgba(255,253,248,0.45)]">
            سافر في ذواقة القدس الأصيلة
          </p>
          <p className="mt-3 text-sm font-medium leading-relaxed text-sumac-deep/88 sm:text-base md:text-lg">
            جواز سفر المسخن — خمسة أختام، ثم هدية من المطبخ
          </p>
        </header>

        <div className="mx-auto mt-6 w-full max-w-4xl sm:mt-8 md:mt-10">
          <div
            className={cn(
              "relative border-[7px] border-passport shadow-[0_20px_50px_-18px_rgba(42,24,34,0.45),inset_0_0_80px_rgba(89,42,68,0.05)]",
              "rounded-sm sm:border-[9px]",
            )}
          >
            <div
              className="absolute inset-0 rounded-sm bg-linear-to-b from-passport-deep/35 to-transparent opacity-50"
              aria-hidden
            />
            <div className="menu-printed-sheet relative z-0 overflow-hidden text-sumac-deep">
              <div className="relative z-[1] border-b-2 border-sumac/15 border-double px-4 py-3 sm:px-6 sm:py-4">
                <p className="text-center font-heading text-base font-extrabold tracking-wide text-sumac-deep sm:text-lg">
                  جواز سفر المسخن
                </p>
                <p className="mt-1 text-center text-[0.65rem] font-medium text-sumac-deep/55 sm:text-xs">
                  Musakhan Passport · عين القدس
                </p>
              </div>

              <div className="relative z-[1] grid gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 md:grid-cols-2 md:gap-10 md:py-10">
                <div className="flex flex-col justify-center border-sumac/20 text-right md:border-l md:border-double md:pl-8">
                  <p className="text-sm leading-[1.85] text-sumac-deep/92 sm:text-base">
                    يحمل حامل هذا الجواز، بعد جمع{" "}
                    <span className="font-bold text-sumac-deep">
                      خمسة أختام
                    </span>{" "}
                    (خمس زيارات أو طلبات مسخن مسجّلة)، حقّه في استلام{" "}
                    <span className="whitespace-nowrap border-b border-dashed border-sumac/45 pb-0.5 font-semibold text-sumac-deep">
                      بطاقة خصم 20٪
                    </span>{" "}
                    صالحة لمدة شهر كامل.
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-sumac-deep/70 sm:text-sm">
                    الأختام توثّق مشاركتك في المهرجان — كختم على صفحة من رحلة
                    الذوق.
                  </p>
                </div>

                <div>
                  <p className="mb-4 text-center font-heading text-sm font-bold text-sumac-deep sm:mb-5 sm:text-base">
                    أختام الرحلة
                  </p>
                  <div className="flex flex-row-reverse flex-wrap items-center justify-center gap-3 sm:gap-4">
                    {STAMP_SLOTS.map((n) => (
                      <div
                        key={n}
                        className={cn(
                          "flex size-12 items-center justify-center rounded-full border-[2.5px] border-dashed border-sumac/35 bg-parchment/85 text-sm font-bold text-sumac-deep/50 sm:size-14",
                          n === 3 &&
                            "border-0 border-solid bg-sumac text-cream shadow-[0_4px_14px_-2px_rgba(89,42,68,0.45)] ring-2 ring-heritage/50",
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
                  <p className="mt-5 text-center text-[0.7rem] text-sumac-deep/55 sm:text-xs">
                    مثال: الختم الثالث مكتمل — الباقي في انتظار زياراتك
                  </p>
                </div>
              </div>

              <div className="relative z-[1] mx-4 mb-6 border-t border-sumac/15 border-dashed sm:mx-6" />

              <div className="relative z-[1] mx-4 mb-6 flex justify-center sm:mx-8">
                <div className="border-2 border-heritage/40 bg-sumac px-8 py-4 text-center text-cream shadow-[inset_0_2px_0_rgba(255,253,248,0.12)] ring-1 ring-sumac-deep/35 sm:px-10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cream/90">
                    المكافأة
                  </p>
                  <p className="mt-1 font-heading text-4xl font-extrabold tabular-nums sm:text-5xl">
                    20٪
                  </p>
                  <p className="mt-1 text-sm text-cream/95">خصم لمدة شهر</p>
                </div>
              </div>

              <p className="relative z-[1] pb-6 text-center font-mono text-[0.6rem] text-sumac-deep/40 sm:text-[0.65rem]">
                ‎MP‑JRS‑2026 · عين القدس
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6">
            <div className="surface-menu-callout rounded-sm px-4 py-5 text-right sm:px-5 sm:py-6">
              <p className="font-heading text-base font-bold text-sumac-deep sm:text-lg">
                كيف يُجمع الختم؟
              </p>
              <p className="mt-2 text-sm leading-relaxed text-sumac-deep/88 sm:text-base">
                كل طلب مسخن مؤكّد أو حضور في موعد المهرجان = ختم واحد يدوَّن لك
                عند الاستلام أو التسليم.
              </p>
            </div>
            <div className="surface-menu-callout rounded-sm px-4 py-5 text-right sm:px-5 sm:py-6">
              <p className="font-heading text-base font-bold text-sumac-deep sm:text-lg">
                متى تستلم البطاقة؟
              </p>
              <p className="mt-2 text-sm leading-relaxed text-sumac-deep/88 sm:text-base">
                بعد الختم الخامس نسلّمك بطاقة الخصم — تصلح لكل أصناف المسخن في
                المهرجان طوال الشهر التالي.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2 sm:mt-10">
            <StampCtaLink
              href="#booking"
              label="ابدأ رحلتك — الانتقال إلى نموذج الحجز"
              caption="احجز الآن"
            />
            <p className="rounded-md bg-white/80 px-2 py-1 text-center text-[0.65rem] font-semibold text-sumac-deep/90 ring-1 ring-sumac/10 sm:text-xs">
              من الطابون إلى ختمك الأول
            </p>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
