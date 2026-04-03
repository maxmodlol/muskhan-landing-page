import Link from "next/link"
import { ClipboardList, Gift } from "lucide-react"
import { SectionContainer } from "@/components/landing/SectionContainer"
import { SectionDivider } from "@/components/landing/SectionDivider"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const stamps = [5, 4, 3, 2, 1] as const

export function LoyaltySection() {
  return (
    <section
      id="loyalty"
      className="relative scroll-mt-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cream via-cream to-cream py-16 sm:py-20 md:py-24"
    >
      <SectionContainer>
        <SectionDivider />
        <header className="mx-auto mt-4 max-w-3xl text-center sm:mt-6">
          <h2 className="font-heading text-2xl font-extrabold text-olive sm:text-3xl md:text-4xl lg:text-[2.5rem]">
            جواز سفر المسخن – عين القدس
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-olive/85 sm:text-base md:text-lg">
            رحلة من خمسة أختام إلى عالم النكهات
          </p>
        </header>

        <div className="mx-auto mt-10 grid max-w-6xl gap-8 md:mt-14 md:grid-cols-2 md:gap-10 lg:gap-14">
          <div className="order-2 flex flex-col gap-4 md:order-1 md:gap-5">
            <Card className="border-0 bg-white shadow-lg ring-0">
              <CardContent className="flex flex-col gap-3 pt-6 sm:pt-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold text-white shadow-sm">
                    <ClipboardList className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-heading text-lg font-bold text-olive sm:text-xl">
                    كيف يعمل؟
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-earth/90 sm:text-base">
                  كل طلب مسخن = ختم واحد في جوازك
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-lg ring-0">
              <CardContent className="flex flex-col gap-3 pt-6 sm:pt-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-olive text-cream shadow-sm">
                    <Gift className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-heading text-lg font-bold text-olive sm:text-xl">
                    المكافأة
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-earth/90 sm:text-base">
                  بعد 5 أختام تحصل على كرت خصم 20٪ لمدة شهر
                </p>
              </CardContent>
            </Card>

            <Link
              href="#booking"
              className="rounded-2xl bg-linear-to-l from-earth to-gold p-6 text-center text-white shadow-lg transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:outline-none sm:p-7"
            >
              <p className="font-heading text-lg font-bold sm:text-xl">
                ابدأ رحلتك اليوم!
              </p>
              <p className="mt-2 text-sm text-white/90 sm:text-base">
                كل وجبة مسخن تقربك من الخصم
              </p>
            </Link>
          </div>

          <div className="order-1 md:order-2">
            <div
              className={cn(
                "relative mx-auto max-w-md overflow-hidden rounded-2xl border-2 border-gold bg-olive p-5 shadow-2xl sm:p-6 md:max-w-none",
                "animate-in fade-in slide-in-from-bottom-4 duration-700"
              )}
            >
              <div className="absolute inset-x-8 top-0 h-0 border-x-[transparent] border-t-[28px] border-x-[18px] border-t-gold sm:border-t-[32px]" />
              <div className="pt-8 text-center sm:pt-10">
                <p className="font-heading text-lg font-bold text-gold sm:text-xl">
                  جواز سفر المسخن
                </p>
                <p className="mt-1 text-xs font-medium tracking-wide text-gold/90 uppercase">
                  Musakhan Passport
                </p>
                <p className="mt-2 text-sm text-cream/90">عين القدس • Ein Al-Quds</p>
              </div>

              <div className="my-5 h-px bg-gold/70 sm:my-6" />

              <div>
                <p className="mb-4 text-center text-sm font-semibold text-gold sm:mb-5 sm:text-base">
                  أختام الرحلة
                </p>
                <div className="flex flex-row-reverse flex-wrap items-center justify-center gap-2 sm:gap-3">
                  {stamps.map((n) => (
                    <div
                      key={n}
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full border-2 border-dashed border-gold/80 text-sm font-bold text-gold sm:size-12",
                        n === 1 &&
                          "border-0 bg-gold text-white shadow-md ring-2 ring-gold/40"
                      )}
                    >
                      {n === 1 ? (
                        <span className="text-lg leading-none" aria-hidden>
                          ✓
                        </span>
                      ) : (
                        <span>{n}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gold px-4 py-4 text-center text-earth shadow-inner sm:mt-8 sm:py-5">
                <p className="text-sm font-bold sm:text-base">المكافأة</p>
                <p className="mt-1 font-heading text-3xl font-extrabold sm:text-4xl">
                  20%
                </p>
                <p className="mt-1 text-xs sm:text-sm">خصم لمدة شهر</p>
              </div>

              <p className="mt-4 text-center text-[0.65rem] text-cream/60 sm:text-xs">
                No. XXXX-XXXX-XXXX
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}
