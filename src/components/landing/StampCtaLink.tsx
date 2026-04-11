"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type StampCtaLinkProps = {
  href: string;
  label: string;
  caption?: string;
  className?: string;
};

export function StampCtaLink({
  href,
  label,
  caption,
  className,
}: StampCtaLinkProps) {
  const isHashLink = href.startsWith("#");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHashLink) return;

    e.preventDefault();

    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const offset = 140; // 🔥 tweak this (120–160 best for your layout)

    const y = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-label={label}
      className={cn(
        "group inline-flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sumac/40 focus-visible:ring-offset-2 focus-visible:ring-offset-parchment",
        className,
      )}
    >
      <span
        className={cn(
          "relative flex size-14 min-h-[3.5rem] min-w-[3.5rem] items-center justify-center rounded-full bg-white p-[3px] shadow-[0_4px_14px_-2px_rgba(26,26,26,0.12),0_2px_0_rgba(89,42,68,0.08)] ring-[1.5px] ring-black/10 transition",
          "sm:size-[3.75rem] sm:min-h-[3.75rem] sm:min-w-[3.75rem]",
          "group-hover:shadow-[0_6px_20px_-2px_rgba(89,42,68,0.2)] group-hover:ring-heritage/50",
          "group-active:scale-[0.96]",
          "-rotate-[4deg] group-hover:-rotate-[2deg]",
        )}
      >
        <span
          className="pointer-events-none absolute inset-[2px] rounded-full border border-dashed border-sumac/20 opacity-80"
          aria-hidden
        />
        <Image
          src="/passport-welcome-stamp.png"
          alt=""
          width={256}
          height={256}
          className="size-full rounded-full object-contain"
          sizes="64px"
        />
      </span>

      {caption && (
        <span
          className={cn(
            "max-w-[11rem] rounded-md px-2.5 py-1 text-center text-[0.65rem] font-bold leading-tight shadow-sm ring-1 ring-black/5 sm:max-w-[13rem] sm:text-[0.7rem]",
            "bg-white/95 text-sumac-deep sm:bg-white sm:text-sumac-deep",
          )}
        >
          {caption}
        </span>
      )}
    </Link>
  );
}
