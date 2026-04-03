import { cn } from "@/lib/utils"

export function SectionContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:max-w-[90rem]",
        className
      )}
      {...props}
    />
  )
}
