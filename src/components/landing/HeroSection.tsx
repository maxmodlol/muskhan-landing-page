"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { cn } from "@/lib/utils";

/** Real olive branch — editorial crop, soft blend into hero */
const OLIVE_BRANCH_SRC =
  "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=720&q=85";

function FloatingOliveBranch({
  className,
  flip,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-[1] w-[min(42vw,13.5rem)] select-none sm:w-[min(36vw,15rem)] md:w-[min(32vw,17rem)]",
        flip ? "animate-hero-float-delayed" : "animate-hero-float",
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(
          "relative aspect-[3/5] w-full drop-shadow-[0_12px_28px_rgba(63,42,26,0.22)]",
          flip && "scale-x-[-1]",
        )}
      >
        <Image
          src={OLIVE_BRANCH_SRC}
          alt=""
          fill
          sizes="(max-width: 768px) 42vw, 272px"
          className="object-cover object-[center_35%] contrast-[1.03] saturate-[0.92] [mask-image:linear-gradient(105deg,black_42%,transparent_100%)] [-webkit-mask-image:linear-gradient(105deg,black_42%,transparent_100%)]"
        />
      </div>
    </div>
  );
}

export function HeroSection() {
  const [parallax, setParallax] = React.useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    function onChange() {
      setPrefersReducedMotion(mq.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (prefersReducedMotion) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setParallax({ x: px * 18, y: py * 14 });
  }

  function handleMouseLeave() {
    setParallax({ x: 0, y: 0 });
  }

  return (
    <section
      id="top"
      className="relative isolate min-h-[72svh] overflow-hidden sm:min-h-[82svh] lg:min-h-screen"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-[-8%] will-change-transform"
          style={{
            transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) scale(1.07)`,
            transition: prefersReducedMotion
              ? undefined
              : "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <Image
            src="/hero-olive.jpg"
            alt="خلفية مهرجان المسخن — عين القدس"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[2] bg-linear-to-b from-parchment/50 via-cream/15 to-earth/55" />
      <div
        className="animate-hero-glow pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_90%_50%_at_50%_18%,rgba(195,211,0,0.14)_0%,transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_70%_45%_at_80%_85%,rgba(140,48,72,0.12)_0%,transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_60%_40%_at_15%_75%,rgba(140,48,72,0.1)_0%,transparent_48%)]"
        aria-hidden
      />

      <SectionContainer className="relative z-10 flex min-h-[72svh] flex-col px-5 pb-8 pt-8 sm:min-h-[82svh] sm:px-6 sm:pb-10 sm:pt-10 lg:min-h-screen lg:pb-14 lg:pt-12">
        <div className="flex flex-1 flex-col justify-center py-4 sm:py-6 md:py-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center lg:max-w-5xl">
            <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4">
              <span className="h-px w-14 bg-gradient-to-l from-transparent via-heritage/70 to-sumac/40 sm:w-20" />
              <span className="size-2 shrink-0 rotate-45 border border-heritage/80 bg-musakhan-atmosphere/95 shadow-[0_0_0_1px_rgba(140,48,72,0.2)]" />
              <span className="h-px w-14 bg-gradient-to-r from-transparent via-heritage/70 to-sumac/40 sm:w-20" />
            </div>

            <div className="rounded-full border border-heritage/45 bg-cream/92 px-5 py-2 text-xs font-bold tracking-wide text-earth shadow-[0_10px_32px_-14px_rgba(140,48,72,0.35)] ring-1 ring-sumac/20 backdrop-blur-md sm:px-7 sm:text-sm md:text-base">
              <span className="text-sumac-deep">عين القدس</span>
              <span className="mx-2 text-earth/35" aria-hidden>
                ·
              </span>
              <span className="text-olive">مهرجان المسخن</span>
            </div>

            <h1 className="font-heading mt-5 max-w-[14ch] text-balance text-[clamp(2rem,6.5vw,4.75rem)] font-extrabold leading-[1.04] tracking-tight text-earth [text-shadow:0_1px_0_rgba(255,253,248,0.92),0_0_24px_rgba(235,227,214,0.5)] sm:mt-6 sm:max-w-none sm:text-[clamp(2.65rem,5.2vw,5.25rem)]">
              مهرجان المسخن الفلسطيني
            </h1>

            <p className="mt-3 max-w-xl text-pretty text-[clamp(0.95rem,2.4vw,1.2rem)] leading-relaxed text-earth/90 sm:mt-4 sm:max-w-2xl md:text-lg">
              حكاية خبزة من طابون عين القدس
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-6">
              <span className="rounded-lg border border-earth/10 bg-musakhan-atmosphere/75 px-3 py-1 text-[0.7rem] font-semibold text-earth/75 backdrop-blur-sm sm:text-xs">
                طابون · زيت زيتون · سماق
              </span>
              <span className="hidden h-4 w-px bg-gradient-to-b from-transparent via-heritage/50 to-transparent sm:block" />
              <span className="rounded-lg border border-sumac/20 bg-sumac/10 px-3 py-1 text-[0.7rem] font-semibold text-sumac-deep sm:text-xs">
                أصالة المطبخ المقدسي
              </span>
            </div>

            <Link
              href="#booking"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-linear-to-l from-sumac via-sumac-deep to-olive-deep px-10 py-3.5 text-sm font-bold text-cream shadow-[0_18px_44px_-14px_rgba(140,48,72,0.55),0_0_0_1px_rgba(195,211,0,0.25)] ring-2 ring-heritage/50 ring-offset-2 ring-offset-transparent transition hover:brightness-[1.04] hover:ring-heritage/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream/90 sm:mt-8 sm:min-h-[3.25rem] sm:px-12 sm:text-base"
            >
              احجز تجربتك الآن
            </Link>
          </div>
        </div>

        <a
          href="#loyalty"
          className="group relative z-20 mx-auto mt-auto flex flex-col items-center gap-2 rounded-2xl px-4 py-2 transition sm:pb-2"
          aria-label="انتقل للأسفل"
        >
          <span className="text-center text-sm font-bold tracking-wide text-earth md:text-base">
            اكتشف المزيد
          </span>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-heritage/55 bg-cream/95 text-sumac-deep shadow-[0_6px_20px_-6px_rgba(140,48,72,0.35)] transition group-hover:border-heritage group-hover:bg-cream group-hover:text-sumac md:size-8">
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
