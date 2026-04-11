import { cn } from "@/lib/utils";

/**
 * Calm section break: repeating olive “tile” line + small center ornament (restored feel).
 */
export function SectionDivider({ className }: { className?: string }) {
  const tileBar =
    "h-2.5 flex-1 max-w-[44%] rounded-[1px] bg-[repeating-linear-gradient(90deg,rgba(124,130,42,0.92)_0px,rgba(124,130,42,0.92)_5px,transparent_5px,transparent_7px)] shadow-[inset_0_-1px_0_rgba(0,0,0,0.06)] sm:h-3 sm:max-w-[46%]";

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-0 px-2 py-2 sm:px-4",
        className,
      )}
      aria-hidden
    >
      <div className={tileBar} />
      <div className="mx-2 flex shrink-0 items-center gap-1.5 px-0.5 sm:mx-3">
        <span className="h-px w-5 bg-cream/50 sm:w-6" />
        <span className="size-1.5 rotate-45 border border-cream/55 bg-heritage/90 shadow-[inset_0_1px_0_rgba(255,253,248,0.35)]" />
        <span className="h-px w-5 bg-cream/50 sm:w-6" />
      </div>
      <div className={tileBar} />
    </div>
  );
}
