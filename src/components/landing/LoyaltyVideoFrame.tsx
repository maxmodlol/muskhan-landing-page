"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type LoyaltyVideoFrameProps = {
  className?: string;
  /** When set, renders a responsive 16:9 iframe; otherwise shows a styled placeholder */
  embedUrl?: string;
  title?: string;
};

export function LoyaltyVideoFrame({
  className,
  embedUrl,
  title = "فيديو عن جواز سفر المسخن",
}: LoyaltyVideoFrameProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-earth/15 bg-linear-to-br from-cream/90 via-parchment to-cream/70 shadow-[0_20px_50px_-24px_rgba(89,42,68,0.32),inset_0_1px_0_rgba(255,253,248,0.65)] ring-1 ring-heritage/25 sm:rounded-3xl",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(186,191,31,0.14)_0%,transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(89,42,68,0.08)_0%,transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] paper-grain mix-blend-multiply"
        aria-hidden
      />

      <div className="relative aspect-video w-full">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            className="absolute inset-0 size-full rounded-[inherit]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div
              className="flex size-16 items-center justify-center rounded-full border-2 border-heritage/55 bg-sumac/95 text-cream shadow-[0_12px_32px_-12px_rgba(89,42,68,0.5)] ring-4 ring-cream/30 sm:size-[4.5rem]"
              aria-hidden
            >
              <Play className="size-8 translate-x-0.5 fill-current sm:size-9" />
            </div>
            <div>
              <p className="font-heading text-base font-bold text-earth sm:text-lg">
                شاهد تجربة المهرجان
              </p>
              <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-earth/65 sm:text-sm">
                سيتم إضافة الفيديو هنا قريبًا — الإطار جاهز للربط بمصدر الفيديو.
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        className="flex items-center justify-between gap-3 border-t border-earth/10 bg-cream/40 px-4 py-2.5 backdrop-blur-[2px] sm:px-5 sm:py-3"
        dir="rtl"
      >
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-earth/45 sm:text-xs">
          عين القدس · المسخن
        </span>
        <span className="h-px min-w-[2rem] flex-1 bg-gradient-to-l from-transparent via-heritage/45 to-transparent sm:min-w-[3rem]" />
        <span className="text-[0.65rem] text-earth/55 sm:text-xs">
          {embedUrl ? "فيديو" : "معاينة"}
        </span>
      </div>
    </div>
  );
}
