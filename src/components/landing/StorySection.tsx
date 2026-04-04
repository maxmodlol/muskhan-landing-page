import type { ReactNode } from "react"
import Image from "next/image"
import { SectionContainer } from "@/components/landing/SectionContainer"
import { cn } from "@/lib/utils"

function StoryDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto flex h-px w-20 items-center justify-center sm:w-24",
        className
      )}
      aria-hidden
    >
      <span className="h-px w-full bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
    </div>
  )
}

function StoryOliveDot({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto flex size-11 items-center justify-center sm:size-12",
        className
      )}
      aria-hidden
    >
      <div className="relative size-9 overflow-hidden rounded-full shadow-md ring-2 ring-gold/35 sm:size-10">
        <div className="mask-olive-foliage absolute inset-0 scale-110">
          <Image
            src="/olive.jpg"
            alt=""
            fill
            sizes="40px"
            className="object-cover object-[center_25%]"
          />
        </div>
      </div>
    </div>
  )
}

function MarkedBlock({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative mx-auto max-w-lg rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4",
        "border border-gold/40 bg-gradient-to-br from-cream/18 via-cream/8 to-transparent",
        "shadow-[inset_0_1px_0_rgba(255,252,245,0.35),0_8px_28px_-12px_rgba(0,0,0,0.25)]",
        "ring-1 ring-gold/25 backdrop-blur-[2px]",
        className
      )}
    >
      <span
        className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent opacity-90"
        aria-hidden
      />
      {children}
    </div>
  )
}

export function StorySection() {
  return (
    <section
      id="story"
      className={cn(
        "relative scroll-mt-20 overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24",
        "bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(212,184,130,0.22)_0%,transparent_50%),radial-gradient(ellipse_80%_55%_at_100%_100%,rgba(245,236,214,0.14)_0%,transparent_45%),repeating-linear-gradient(135deg,#5f6d3e_0px,#5f6d3e_14px,#525f36_14px,#525f36_16px)]"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(255,250,240,0.06)_0%,transparent_70%)]"
        aria-hidden
      />

      <SectionContainer className="relative">
        <div className="mx-auto max-w-xl animate-in fade-in text-center duration-700">
          <StoryOliveDot className="mb-3 sm:mb-4" />

          <h2 className="font-heading text-2xl font-extrabold leading-tight text-[#faf7ef] [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] sm:text-[1.75rem] md:text-[2rem]">
            حكاية المسخن
          </h2>

          <MarkedBlock className="mt-4">
            <p className="text-sm font-medium leading-relaxed text-[#fffdf8] sm:text-base md:text-base">
              وُلِد المسخن في بيوتنا
              <br />
              يوم كان موسم الزيتون يجمع العائلة حول الطابون.
            </p>
          </MarkedBlock>

          <StoryDivider className="my-5 sm:my-6" />

          <div className="space-y-1 text-sm leading-relaxed text-[#f5f0e3]/95 sm:text-base md:text-base">
            <p>خبز ساخن،</p>
            <p>زيت زيتون بلدي،</p>
            <p>بصل وسماق...</p>
            <p>ودجاج مطبوخ على مهل.</p>
          </div>

          <StoryDivider className="my-5 sm:my-6" />

          <div className="space-y-1 text-sm leading-relaxed text-[#f5f0e3]/95 sm:text-base md:text-base">
            <p>لم يكن المسخن مجرد طعام...</p>
            <p>بل رائحة بيت،</p>
            <p>وجمعة أهل،</p>
            <p>وحكاية أرض.</p>
          </div>

          <div className="mx-auto mt-5 flex justify-center sm:mt-6">
            <span
              className="size-2 rounded-full bg-gold shadow-[0_0_0_2px_rgba(250,247,239,0.25)]"
              aria-hidden
            />
          </div>

          <p className="mx-auto mt-5 max-w-md text-sm text-[#f5f0e3]/95 sm:mt-6 sm:text-base">
            في مهرجان المسخن المقدسي – عين القدس
          </p>

          <MarkedBlock className="mt-2">
            <p className="text-base font-semibold leading-relaxed text-[#fffdf8] sm:text-lg">
              نعيد الحكاية من جديد.
            </p>
          </MarkedBlock>

          <StoryDivider className="mt-6 sm:mt-8" />
        </div>
      </SectionContainer>
    </section>
  )
}
