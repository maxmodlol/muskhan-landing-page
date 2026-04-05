import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { cn } from "@/lib/utils";

/** Olive beside title: no frame — white areas blend into the hero via multiply. */
function OliveBesideTitle({
  className,
  objectPosition = "object-[center_24%]",
}: {
  className?: string;
  objectPosition?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none hidden shrink-0 select-none sm:block",
        className,
      )}
      aria-hidden
    >
      <div className="relative h-[4.25rem] w-[3.2rem] md:h-[4.75rem] md:w-[3.6rem]">
        <Image
          src="/olive.jpg"
          alt=""
          fill
          sizes="80px"
          className={cn(
            "object-cover mix-blend-multiply contrast-[1.05]",
            objectPosition,
          )}
        />
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
    id="top"
    className="relative isolate min-h-[68svh] sm:min-h-[78svh] lg:min-h-screen overflow-hidden"
    >
    <Image
      src="/hero-olive.jpg"
      alt="خلفية زيتون ومهرجان المسخن"
      fill
      priority
      sizes="100vw"
      className="object-cover object-center"
    />
  
    <div className="absolute inset-0 bg-linear-to-b from-cream/35 via-cream/10 to-parchment/70" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_12%,rgba(255,248,235,0.45)_0%,transparent_65%)]" />
  
    <SectionContainer className="relative z-10 flex min-h-[68svh] sm:min-h-[78svh] lg:min-h-screen flex-col px-5 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-8 lg:pb-10 lg:pt-10">
    <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <div className="mb-2 flex items-center justify-center gap-2 sm:mb-3">
            <span className="h-px w-12 bg-gradient-to-l from-transparent via-sumac/40 to-earth/30 sm:w-16" />
            <span className="size-2 shrink-0 rotate-45 border border-sumac/55 bg-parchment/95 shadow-[0_0_0_1px_rgba(184,148,92,0.35)]" />
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-sumac/40 to-earth/30 sm:w-16" />
          </div>
  
          <div className="rounded-full border border-sumac/35 bg-cream/95 px-4 py-2 text-xs font-bold tracking-wide text-earth shadow-[0_8px_24px_-12px_rgba(63,42,26,0.18)] ring-1 ring-gold/20 backdrop-blur-md sm:px-6 sm:text-sm md:text-base">
            عين القدس
          </div>
  
          <div className="mt-3 flex w-full items-center justify-center gap-2 sm:mt-4 sm:gap-3">
            <OliveBesideTitle />
            <h1 className="font-heading max-w-[11ch] text-center text-balance text-[clamp(1.9rem,7vw,4.4rem)] font-extrabold leading-[1.05] tracking-tight text-earth [text-shadow:0_1px_0_rgba(255,253,248,0.92),0_0_18px_rgba(235,227,214,0.45)] sm:max-w-none sm:text-[clamp(2.7rem,5vw,5rem)]">
              مهرجان المسخن الفلسطيني
            </h1>
            <OliveBesideTitle objectPosition="object-[center_28%]" />
          </div>
  
          <p className="mt-2 max-w-xl text-pretty text-[clamp(0.95rem,2.5vw,1.15rem)] leading-relaxed text-earth/88 sm:mt-3 sm:max-w-2xl md:text-lg">
            حكاية خبزة من طابون عين القدس
          </p>
  
          <Link
            href="#booking"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-linear-to-l from-earth via-sumac-deep/90 to-olive-deep px-8 py-3 text-sm font-bold text-cream shadow-[0_14px_36px_-12px_rgba(63,42,26,0.5),0_0_0_1px_rgba(116,58,66,0.35)] ring-2 ring-gold/30 ring-offset-2 ring-offset-transparent transition hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sumac/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream/90 sm:mt-5 sm:min-h-[3rem] sm:px-10 sm:text-base"
          >
            احجز تجربتك الآن
          </Link>
        </div>
      </div>
  
      <a
        href="#loyalty"
        className="group absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 rounded-2xl px-3 py-2 transition sm:bottom-6 lg:bottom-8"
        aria-label="انتقل للأسفل"
      >
        <span className="text-center text-sm font-bold tracking-wide text-earth md:text-base">
          اكتشف المزيد
        </span>
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-gold/55 bg-cream/90 text-earth shadow-[0_4px_16px_-4px_rgba(63,42,26,0.2)] transition group-hover:border-gold group-hover:bg-cream group-hover:text-gold md:size-7">
          <ChevronDown
            className="size-4 stroke-[1.5] transition group-hover:translate-y-0.5"
            aria-hidden
          />
        </span>
      </a>
    </SectionContainer>
  </section>
  );
}