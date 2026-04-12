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
      <span className="h-px w-full bg-gradient-to-r from-transparent via-sumac/35 to-transparent" />
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
      <div className="relative size-10 overflow-hidden rounded-full border-2 border-sumac/30 bg-parchment/90 shadow-md ring-1 ring-sumac/15 sm:size-11">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-sumac/10" />
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
        "surface-menu-callout relative mx-auto max-w-2xl rounded-[22px] px-5 py-4 sm:px-6 sm:py-5",
        className,
      )}
    >
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
        "space-y-1.5 text-sm font-medium leading-[2] text-sumac-deep/88 sm:text-base",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StorySection() {
  return (
    <section
      id="story"
      className="section-pad relative scroll-mt-20 overflow-x-hidden bg-musakhan-atmosphere"
    >
      <SectionContainer className="relative z-[1] min-w-0">
        <div
          className={cn(
            "menu-printed-sheet relative z-0 w-full overflow-hidden rounded-sm border-2 border-sumac/30 text-sumac-deep shadow-lg",
          )}
        >
            <div
              className="tatreez-band tatreez-band-thin relative z-[1] w-full shrink-0"
              aria-hidden
            />

            <div className="relative z-[1] px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10 md:px-12 lg:px-16">
              <div className="mx-auto w-full max-w-3xl text-center lg:max-w-4xl">
                <StoryOliveDot className="mb-4 sm:mb-5" />

                <h2 className="font-heading text-[2rem] font-extrabold leading-none tracking-tight text-sumac-deep sm:text-[2.35rem] md:text-[2.65rem]">
                  حكاية المسخن
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-sumac-deep/80 sm:text-[15px]">
                  نكهة من البيت، وذاكرة من الأرض، وروح تجتمع حولها العائلة.
                </p>

                <MarkedBlock className="mt-6">
                  <p className="text-sm font-semibold leading-[1.95] sm:text-base">
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

                <StoryTextGroup className="mx-auto max-w-xl">
                  <p>لم يكن المسخن مجرد طعام،</p>
                  <p>بل رائحة بيت،</p>
                  <p>وجمعة أهل،</p>
                  <p>وحكاية أرض.</p>
                </StoryTextGroup>

                <div className="mx-auto mt-6 flex justify-center sm:mt-7">
                  <span
                    className="size-2.5 rounded-full bg-heritage shadow-[0_0_0_4px_rgba(186,191,31,0.25)] ring-1 ring-sumac/25"
                    aria-hidden
                  />
                </div>

                <p className="mx-auto mt-6 max-w-md text-sm font-medium tracking-[0.01em] text-sumac-deep/85 sm:text-base">
                  في مهرجان المسخن المقدسي – عين القدس
                </p>

                <MarkedBlock className="mt-3 max-w-xl">
                  <p className="text-base font-bold leading-[1.8] sm:text-lg">
                    نعيد الحكاية من جديد.
                  </p>
                </MarkedBlock>

                <StoryDivider className="mt-8 sm:mt-10" />
              </div>
            </div>

            <div
              className="tatreez-band tatreez-band-thin relative z-[1] mt-2 w-full"
              aria-hidden
            />
        </div>
      </SectionContainer>
    </section>
  );
}
