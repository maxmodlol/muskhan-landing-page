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
      <span className="h-px w-10 bg-earth/30 sm:w-14 md:w-20" />
      <span className="size-1.5 rounded-full bg-olive" />
      <span className="h-px w-10 bg-earth/30 sm:w-14 md:w-20" />
    </div>
  )
}
