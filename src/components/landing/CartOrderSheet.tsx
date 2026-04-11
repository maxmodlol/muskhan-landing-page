"use client";

import * as React from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ImageIcon,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { toEasternArabicNumerals } from "@/lib/eastern-arabic-numerals";
import { parseMenuPriceToNumber } from "@/lib/parse-menu-price";
import { cn } from "@/lib/utils";
import { getBookingTarget, scrollToSection } from "@/lib/landing-navigation";

type CartOrderSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CartOrderSheet({ open, onOpenChange }: CartOrderSheetProps) {
  const { lines, setQty, removeLine, totalItemCount } = useCart();
  const panelRef = React.useRef<HTMLDivElement>(null);

  const totalPrice = React.useMemo(
    () =>
      lines.reduce(
        (sum, line) =>
          sum + parseMenuPriceToNumber(line.price) * Number(line.qty || 0),
        0,
      ),
    [lines],
  );

  React.useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  React.useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!open) return null;

  const goBooking = () => {
    onOpenChange(false);
    const target = getBookingTarget(totalItemCount > 0);
    scrollToSection(target, target === "booking" ? 140 : 110);
  };

  const goMenu = () => {
    onOpenChange(false);
    scrollToSection("menu", 110);
  };

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-order-sheet-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-earth/50 backdrop-blur-[3px] transition-opacity"
        aria-label="إغلاق"
        onClick={() => onOpenChange(false)}
      />

      <div className="pointer-events-none fixed inset-0 z-[61] flex items-end justify-center p-0 sm:items-center sm:p-4">
        <div
          ref={panelRef}
          tabIndex={-1}
          className={cn(
            "pointer-events-auto flex max-h-[min(92vh,860px)] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] border border-sumac/25 bg-linear-to-b from-parchment via-cream/98 to-blush/30 shadow-[0_-12px_48px_-16px_rgba(61,36,51,0.45)] ring-1 ring-heritage/35 sm:max-h-[min(88vh,800px)] sm:rounded-3xl",
          )}
          dir="rtl"
        >
          <div className="relative shrink-0 border-b border-earth/12 bg-linear-to-l from-sumac-deep/95 via-sumac to-olive-deep/90 px-4 py-4 text-cream sm:px-5 sm:py-5">
            <div
              className="absolute inset-x-0 top-0 h-px bg-linear-to-l from-transparent via-heritage/70 to-transparent"
              aria-hidden
            />
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-cream/15 text-cream shadow-inner ring-1 ring-white/25">
                  <ShoppingBag className="size-6" aria-hidden strokeWidth={2} />
                </span>
                <div className="min-w-0 text-right">
                  <h2
                    id="cart-order-sheet-title"
                    className="font-heading text-lg font-bold leading-tight sm:text-xl"
                  >
                    ملخص طلبك
                  </h2>
                  <p className="mt-1 text-sm text-cream/88">
                    راجع الأصناف، عدّل الكميات، أو أضف المزيد من القائمة
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/80"
                aria-label="إغلاق"
              >
                <X className="size-5" strokeWidth={2} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/15 bg-black/10 px-3 py-2.5 text-sm sm:text-base">
              <span className="font-semibold text-cream/95">
                {toEasternArabicNumerals(String(totalItemCount))}{" "}
                {totalItemCount === 1 ? "صنف" : "أصناف"}
              </span>
              <span className="font-heading text-lg font-extrabold tabular-nums" dir="ltr">
                المجموع {toEasternArabicNumerals(String(totalPrice))} ₪
              </span>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5">
            {lines.length === 0 ? (
              <p className="py-8 text-center text-sm font-medium text-earth/70">
                السلة فارغة. أضف أصنافاً من القائمة.
              </p>
            ) : (
              <ul className="space-y-3">
                {lines.map((line) => {
                  const unit = parseMenuPriceToNumber(line.price);
                  const lineTotal = unit * line.qty;
                  return (
                    <li
                      key={line.itemId}
                      className="rounded-2xl border border-earth/12 bg-white/55 p-3 shadow-[inset_0_1px_0_rgba(255,253,248,0.85)] ring-1 ring-heritage/15"
                    >
                      <div className="flex gap-3">
                        {line.image ? (
                          <div className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-xl border border-earth/12 bg-cream">
                            <Image
                              src={line.image}
                              alt=""
                              fill
                              sizes="72px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className="flex size-[4.5rem] shrink-0 items-center justify-center rounded-xl border border-earth/12 bg-linear-to-br from-blush/35 to-cream/90 text-earth/30"
                            aria-hidden
                          >
                            <ImageIcon className="size-8" strokeWidth={1.5} />
                          </div>
                        )}
                        <div className="min-w-0 flex-1 text-right">
                          <p className="font-heading text-[0.95rem] font-bold leading-snug text-sumac-deep sm:text-base">
                            {line.name}
                          </p>
                          <p className="mt-0.5 text-xs text-earth/65" dir="ltr">
                            {line.price}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <div
                              className="inline-flex items-center gap-0.5 rounded-full border-2 border-sumac/30 bg-cream/90 p-0.5 shadow-sm"
                              dir="ltr"
                            >
                              <button
                                type="button"
                                className="flex size-9 items-center justify-center rounded-full text-sumac-deep transition hover:bg-blush/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage/50"
                                onClick={() =>
                                  setQty(line.itemId, line.qty - 1)
                                }
                                aria-label="تقليل الكمية"
                              >
                                <Minus className="size-4" aria-hidden />
                              </button>
                              <span className="min-w-[2.25rem] text-center text-sm font-extrabold tabular-nums text-sumac-deep">
                                {toEasternArabicNumerals(String(line.qty))}
                              </span>
                              <button
                                type="button"
                                className="flex size-9 items-center justify-center rounded-full text-sumac-deep transition hover:bg-blush/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage/50"
                                onClick={() =>
                                  setQty(line.itemId, line.qty + 1)
                                }
                                aria-label="زيادة الكمية"
                              >
                                <Plus className="size-4" aria-hidden />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLine(line.itemId)}
                              className="inline-flex items-center gap-1 rounded-full border border-destructive/20 px-2.5 py-1.5 text-xs font-bold text-destructive transition hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30"
                            >
                              <Trash2 className="size-3.5" aria-hidden />
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end border-t border-earth/10 pt-2">
                        <p
                          className="text-sm font-extrabold tabular-nums text-sumac-deep"
                          dir="ltr"
                        >
                          {toEasternArabicNumerals(String(lineTotal))} ₪
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="shrink-0 border-t border-earth/12 bg-cream/90 px-3 py-3 sm:px-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3">
              <button
                type="button"
                onClick={goMenu}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-sumac/25 bg-white/80 px-4 py-3 text-sm font-bold text-sumac-deep shadow-sm transition hover:bg-blush/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage"
              >
                <ChevronLeft className="size-4" aria-hidden />
                إضافة من القائمة
              </button>
              <button
                type="button"
                onClick={goBooking}
                className="rounded-xl bg-linear-to-l from-sumac via-sumac-deep to-sumac px-4 py-3 text-sm font-bold text-cream shadow-md ring-1 ring-heritage/40 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage focus-visible:ring-offset-2"
              >
                إتمام الحجز
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
