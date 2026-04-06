import { cn } from "@/lib/utils"

export function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-2",
        className
      )}
      aria-hidden
    >
      <span className="h-px w-10 bg-gradient-to-l from-earth/15 via-heritage/50 to-sumac/40 sm:w-14 md:w-20" />
      <span className="size-2 rotate-45 border border-heritage/55 bg-parchment shadow-[inset_0_0_0_1px_rgba(140,48,72,0.2)]" />
      <span className="h-px w-10 bg-gradient-to-r from-earth/15 via-heritage/50 to-sumac/40 sm:w-14 md:w-20" />
    </div>
  )
}
