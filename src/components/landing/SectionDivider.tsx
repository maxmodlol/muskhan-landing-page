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
      <span className="h-px w-10 bg-gold/80 sm:w-14 md:w-20" />
      <span className="size-1.5 rounded-full bg-gold" />
      <span className="h-px w-10 bg-gold/80 sm:w-14 md:w-20" />
    </div>
  )
}
