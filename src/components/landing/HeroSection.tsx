import Image from "next/image"
import Link from "next/link"
import { SectionContainer } from "@/components/landing/SectionContainer"
import { cn } from "@/lib/utils"

function OlivePanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "hidden h-36 w-10 shrink-0 overflow-hidden rounded-md bg-slate-200/90 shadow-sm sm:block md:h-44 md:w-12 lg:h-52 lg:w-14",
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 40 200"
        className="h-full w-full text-olive"
        fill="currentColor"
      >
        <path d="M20 8c-2 18-8 32-8 52 0 14 4 26 8 38 4-12 8-24 8-38 0-20-6-34-8-52zM12 95c-4 8-6 18-6 28 0 22 8 40 14 52 2-16-2-34-8-80zM28 95c6 46 10 64 8 80 6-12 14-30 14-52 0-10-2-20-6-28z" />
        <ellipse cx="20" cy="168" rx="10" ry="24" opacity="0.35" />
      </svg>
    </div>
  )
}

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] min-h-[min(100dvh,900px)] flex-col justify-center overflow-hidden py-16 sm:py-20 md:py-24"
    >
      <Image
        src="https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=2400&q=80"
        alt="إطلالة على المدينة القديمة والقبة الصخرية"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-linear-to-b from-olive/75 via-olive/45 to-cream"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-cream via-transparent to-transparent opacity-95"
        aria-hidden
      />

      <SectionContainer className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 h-px w-24 bg-gold/90 sm:mb-8 sm:w-32 md:w-40" />

        <div className="flex w-full max-w-4xl flex-col items-center gap-6 sm:gap-8 md:flex-row md:items-center md:justify-center md:gap-6 lg:gap-10">
          <OlivePanel className="order-2 md:order-1" />
          <div className="order-1 flex max-w-xl flex-col items-center gap-4 px-1 sm:gap-5 md:order-2">
            <span className="rounded-full bg-gold px-5 py-2 text-sm font-bold text-white shadow-md sm:text-base md:px-6 md:py-2.5">
              عين القدس
            </span>
            <h1 className="font-heading text-3xl leading-tight font-extrabold text-[#4a4a29] sm:text-4xl md:text-5xl lg:text-6xl xl:text-[3.25rem] xl:leading-[1.15]">
              <span className="block">مهرجان المسخن المقدسي</span>
              <span className="mt-2 block sm:mt-3">– عين القدس</span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-[#4a4a29] sm:text-lg md:text-xl">
              حكاية خبزة من طابون عين القدس
            </p>
            <Link
              href="#booking"
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-linear-to-l from-gold to-earth px-8 py-3 text-base font-bold text-white shadow-lg transition hover:scale-[1.02] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream/80 focus-visible:outline-none active:scale-[0.99] sm:min-h-14 sm:px-10 sm:text-lg"
            >
              احجز تجربتك الآن
            </Link>
          </div>
          <OlivePanel className="order-3" />
        </div>

        <div className="mt-10 h-px w-24 bg-gold/90 sm:mt-14 sm:w-32 md:w-40" />

        <a
          href="#loyalty"
          className="mt-8 flex flex-col items-center gap-2 text-earth/70 transition hover:text-earth"
          aria-label="انتقل للأسفل"
        >
          <span className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-earth/40 pt-1.5">
            <span className="size-1.5 animate-bounce rounded-full bg-gold" />
          </span>
        </a>
      </SectionContainer>
    </section>
  )
}
