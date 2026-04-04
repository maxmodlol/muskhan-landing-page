import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { SectionContainer } from "@/components/landing/SectionContainer"
import { cn } from "@/lib/utils"

/** Olive beside title: no frame — white areas blend into the hero via multiply. */
function OliveBesideTitle({
  className,
  objectPosition = "object-[center_24%]",
}: {
  className?: string
  objectPosition?: string
}) {
  return (
    <div
      className={cn(
        "pointer-events-none hidden shrink-0 select-none sm:block",
        className
      )}
      aria-hidden
    >
      <div className="relative h-[4.5rem] w-[3.4rem] md:h-[5rem] md:w-[3.75rem]">
        <Image
          src="/olive.jpg"
          alt=""
          fill
          sizes="80px"
          className={cn(
            "object-cover mix-blend-multiply contrast-[1.05]",
            objectPosition
          )}
        />
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] min-h-[min(100dvh,900px)] flex-col overflow-hidden"
    >
      <Image
        src="/hero-olive.jpg"
        alt="خلفية زيتون ومهرجان المسخن"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-linear-to-b from-cream/42 via-olive/5 to-earth/10"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_88%_50%_at_50%_0%,rgba(245,236,214,0.55)_0%,transparent_52%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_85%_15%,rgba(184,148,92,0.08)_0%,transparent_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-parchment/78 via-parchment/14 to-transparent"
        aria-hidden
      />

      <SectionContainer className="relative z-10 flex min-h-[100svh] min-h-[min(100dvh,900px)] flex-1 flex-col px-5 pb-8 pt-16 sm:px-6 sm:pb-10 sm:pt-20 md:pt-24 lg:pt-28">
        <div className="flex flex-1 flex-col items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-14">
          <div className="flex w-full max-w-3xl flex-col items-center sm:max-w-4xl md:max-w-5xl">
            <div className="mb-5 flex items-center justify-center gap-2 sm:mb-6 md:mb-7">
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-earth/35 sm:w-20" />
              <span className="size-2 shrink-0 rounded-full bg-gold shadow-[0_0_0_2px_rgba(250,247,239,0.5)]" />
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-earth/35 sm:w-20" />
            </div>

            <div className="rounded-full border border-gold/35 bg-cream/92 px-6 py-2.5 text-sm font-bold text-earth shadow-md ring-1 ring-gold/20 backdrop-blur-sm sm:px-7 sm:text-base md:text-lg">
              عين القدس
            </div>

            <div className="mt-7 flex w-full max-w-4xl flex-col items-center gap-4 sm:mt-8 sm:flex-row sm:justify-center sm:gap-5 md:mt-10 md:gap-6">
              <OliveBesideTitle />
              <h1 className="font-heading max-w-[20ch] text-[1.85rem] font-extrabold leading-[1.15] text-earth [text-shadow:0_1px_0_rgba(255,253,248,0.92),0_0_20px_rgba(235,227,214,0.55)] sm:max-w-[24ch] sm:text-[2.25rem] sm:leading-[1.12] md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                مهرجان المسخن المقدسي
              </h1>
              <OliveBesideTitle objectPosition="object-[center_28%]" />
            </div>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-earth/88 sm:mt-6 sm:max-w-xl sm:text-lg md:mt-8 md:text-xl md:leading-relaxed">
              حكاية خبزة من طابون عين القدس
            </p>

            <Link
              href="#booking"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-linear-to-l from-earth via-olive to-olive-deep px-10 py-3.5 text-base font-bold text-cream shadow-[0_12px_32px_-10px_rgba(63,42,26,0.45)] ring-1 ring-gold/30 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream/90 sm:mt-8 sm:min-h-[3.35rem] sm:px-12 sm:text-lg md:mt-10"
            >
              احجز تجربتك الآن
            </Link>
          </div>
        </div>

        <a
          href="#loyalty"
          className="group mx-auto mt-6 flex flex-col items-center gap-3 rounded-2xl px-5 py-2 transition sm:mt-8 md:mt-10 md:flex-row md:gap-4 md:px-8 md:py-3 md:hover:bg-cream/25"
          aria-label="انتقل للأسفل"
        >
          <span className="text-center text-base font-bold tracking-wide text-earth md:text-lg">
            اكتشف المزيد
          </span>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-gold/55 bg-cream/90 text-earth shadow-[0_4px_16px_-4px_rgba(63,42,26,0.2)] transition group-hover:border-gold group-hover:bg-cream group-hover:text-gold md:size-12">
            <ChevronDown
              className="size-6 stroke-[2.5] transition group-hover:translate-y-0.5 md:size-7"
              aria-hidden
            />
          </span>
        </a>
      </SectionContainer>
    </section>
  )
}
