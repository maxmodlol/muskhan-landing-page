import type { ReactNode } from "react";
import Image from "next/image";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { cn } from "@/lib/utils";

function StoryDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto flex h-px w-24 items-center justify-center sm:w-32",
        className,
      )}
      aria-hidden
    >
      <span className="h-px w-full bg-gradient-to-r from-transparent via-[#f1e5cf]/40 to-transparent" />
    </div>
  );
}

function StoryOliveDot({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto flex size-12 items-center justify-center sm:size-14",
        className,
      )}
      aria-hidden
    >
      <div className="relative size-10 overflow-hidden rounded-full border border-[#f6ecd8]/20 bg-[#6d7348]/85 shadow-[0_12px_30px_-18px_rgba(24,18,10,0.45)] sm:size-11">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
        <div className="mask-olive-foliage absolute inset-0 scale-110">
          <Image
            src="/olive.jpg"
            alt=""
            fill
            sizes="44px"
            className="object-cover object-[center_25%] opacity-90"
          />
        </div>
      </div>
    </div>
  );
}

function MarkedBlock({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto max-w-xl rounded-[22px] px-5 py-4 sm:px-6 sm:py-5",
        "border border-[#f2e6d2]/16 bg-[rgba(98,70,49,0.72)]",
        "text-[#fffaf3] shadow-[0_20px_45px_-28px_rgba(20,14,8,0.45)]",
        "backdrop-blur-[3px]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-white/5" />
      <span
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#fff5e4]/18 to-transparent"
        aria-hidden
      />
      {children}
    </div>
  );
}

function StoryTextGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-1.5 text-sm font-medium leading-[2] text-[#f7efdf]/84 sm:text-base",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Small warm tatreez-inspired side frame.
 * Subtle and decorative only — not strong like the poster.
 */
function TatreezSide({
  side,
  className,
}: {
  side: "left" | "right";
  className?: string;
}) {
  const isLeft = side === "left";

  return (
    <div
      className={cn(
        "pointer-events-none absolute top-0 hidden h-full w-[92px] md:block lg:w-[108px]",
        isLeft ? "left-0" : "right-0",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-y-10 flex w-full items-center justify-center">
        <div className="relative h-[78%] w-full">
          {/* outer soft fade */}
          <div
            className={cn(
              "absolute inset-y-0 w-full opacity-[0.18]",
              isLeft
                ? "bg-gradient-to-r from-[#d3d94e]/20 via-[#8b315d]/14 to-transparent"
                : "bg-gradient-to-l from-[#d3d94e]/20 via-[#8b315d]/14 to-transparent",
            )}
          />

          {/* vertical plum motif */}
          <div
            className={cn(
              "absolute inset-y-0 w-[18px] opacity-[0.36]",
              isLeft ? "left-8 lg:left-10" : "right-8 lg:right-10",
              "bg-[linear-gradient(to_bottom,#7c3658_0_8px,transparent_8px_16px,#7c3658_16px_24px,transparent_24px_32px)]",
              "[background-size:18px_32px]",
              "[clip-path:polygon(50%_0,65%_10%,50%_20%,35%_10%,50%_0,100%_25%,65%_35%,100%_45%,65%_55%,100%_65%,65%_75%,100%_85%,50%_100%,35%_90%,50%_80%,65%_90%,50%_100%,0_75%,35%_65%,0_55%,35%_45%,0_35%,35%_25%,0_15%)]",
            )}
          />

          {/* lime triangular edge */}
          <div
            className={cn(
              "absolute inset-y-0 w-[22px] opacity-[0.48]",
              isLeft ? "left-1" : "right-1",
              "bg-[linear-gradient(to_bottom,#c7d236_0_10px,transparent_10px_20px)] [background-size:22px_20px]",
              isLeft
                ? "[clip-path:polygon(0_0,100%_10px,0_20px,100%_30px,0_40px,100%_50px,0_60px,100%_70px,0_80px,100%_90px,0_100%)]"
                : "[clip-path:polygon(100%_0,0_10px,100%_20px,0_30px,100%_40px,0_50px,100%_60px,0_70px,100%_80px,0_90px,100%_100%)]",
            )}
          />

          {/* inner black stitch line */}
          <div
            className={cn(
              "absolute inset-y-0 w-[4px] rounded-full bg-black/35",
              isLeft ? "left-[28px]" : "right-[28px]",
            )}
          />

          {/* small top accent */}
          <div
            className={cn(
              "absolute top-2 size-8 opacity-[0.38]",
              isLeft ? "left-[34px]" : "right-[34px]",
              "rotate-45 border border-[#d7d85f]/60 bg-[radial-gradient(circle,#d7d85f_0_18%,transparent_18%)]",
            )}
          />
        </div>
      </div>
    </div>
  );
}

export function StorySection() {
  return (
    <section
      id="story"
      className={cn(
        "relative scroll-mt-20 overflow-hidden py-14 sm:py-18 md:py-22 lg:py-28",
        "bg-[#6f7644]",
      )}
    >
      {/* base tone */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#7d8650_0%,#6a7242_34%,#5b6238_100%)]" />
      </div>

      {/* warm center glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,240,208,0.10),transparent_32%),radial-gradient(circle_at_center,rgba(255,244,225,0.04),transparent_46%)]" />
      </div>

      {/* soft vignette */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_34%,rgba(34,30,18,0.08)_72%,rgba(19,16,10,0.18)_100%)]" />
      </div>

      {/* tiny woven texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-soft-light"
        aria-hidden
      >
        <div className="h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.8)_0,rgba(255,255,255,0.8)_1px,transparent_1px,transparent_12px),linear-gradient(180deg,rgba(255,255,255,0.45)_0,rgba(255,255,255,0.45)_1px,transparent_1px,transparent_12px)]" />
      </div>

      {/* soft grain */}
      <div
        className="paper-grain pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light"
        aria-hidden
      />

      {/* subtle tatreez frame */}
      <TatreezSide side="left" />
      <TatreezSide side="right" />

      {/* center glow behind content */}
      <div
        className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,240,205,0.08),transparent_65%)] blur-3xl"
        aria-hidden
      />

      <SectionContainer className="relative z-[1]">
        <div className="mx-auto max-w-xl text-center sm:max-w-2xl">
          <StoryOliveDot className="mb-4 sm:mb-5" />

          <h2 className="font-heading text-[2rem] font-extrabold leading-none tracking-tight text-[#fff8ed] drop-shadow-[0_2px_10px_rgba(30,25,12,0.18)] sm:text-[2.35rem] md:text-[2.65rem]">
            حكاية المسخن
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#f6eddc]/72 sm:text-[15px]">
            نكهة من البيت، وذاكرة من الأرض، وروح تجتمع حولها العائلة.
          </p>

          <MarkedBlock className="mt-6">
            <p className="text-sm font-semibold leading-[1.95] text-[#fffaf2] sm:text-base">
              وُلِد المسخن في بيوتنا
              <br />
              يوم كان موسم الزيتون يجمع العائلة حول الطابون.
            </p>
          </MarkedBlock>

          <StoryDivider className="my-7 sm:my-8" />

          <StoryTextGroup>
            <p>خبز ساخن،</p>
            <p>زيت زيتون بلدي،</p>
            <p>بصل وسماق،</p>
            <p>ودجاج مطبوخ على مهل.</p>
          </StoryTextGroup>

          <StoryDivider className="my-7 sm:my-8" />

          <StoryTextGroup className="mx-auto max-w-md">
            <p>لم يكن المسخن مجرد طعام،</p>
            <p>بل رائحة بيت،</p>
            <p>وجمعة أهل،</p>
            <p>وحكاية أرض.</p>
          </StoryTextGroup>

          <div className="mx-auto mt-6 flex justify-center sm:mt-7">
            <span
              className="size-2.5 rounded-full bg-[#f7ecd8] shadow-[0_0_0_5px_rgba(247,236,216,0.08)]"
              aria-hidden
            />
          </div>

          <p className="mx-auto mt-6 max-w-md text-sm font-medium tracking-[0.01em] text-[#f5ead7]/86 sm:text-base">
            في مهرجان المسخن المقدسي – عين القدس
          </p>

          <MarkedBlock className="mt-3 max-w-md">
            <p className="text-base font-bold leading-[1.8] text-[#fffaf2] sm:text-lg">
              نعيد الحكاية من جديد.
            </p>
          </MarkedBlock>

          <StoryDivider className="mt-8 sm:mt-10" />
        </div>
      </SectionContainer>
    </section>
  );
}
