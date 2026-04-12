"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ShoppingBag,
} from "lucide-react";
import { CartOrderSheet } from "@/components/landing/CartOrderSheet";
import { useCart } from "@/contexts/cart-context";
import { toEasternArabicNumerals } from "@/lib/eastern-arabic-numerals";
import { parseMenuPriceToNumber } from "@/lib/parse-menu-price";
import { cn } from "@/lib/utils";
import { getBookingTarget, scrollToSection } from "@/lib/landing-navigation";

const PREVIEW_MAX = 3;

const DOCK_EXPANDED_KEY = "musakhan-cart-dock-expanded";

export function CartDock({ className }: { className?: string }) {
  const { lines, totalItemCount } = useCart();
  const [editOpen, setEditOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(true);

  React.useLayoutEffect(() => {
    try {
      if (localStorage.getItem(DOCK_EXPANDED_KEY) === "0") {
        setExpanded(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setExpandedPersist = React.useCallback((next: boolean) => {
    setExpanded(next);
    try {
      localStorage.setItem(DOCK_EXPANDED_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  if (totalItemCount === 0) return null;

  const totalPrice = lines.reduce(
    (sum, line) =>
      sum + parseMenuPriceToNumber(line.price) * Number(line.qty || 0),
    0,
  );

  const previewLines = lines.slice(0, PREVIEW_MAX);
  const remainingLinesCount = Math.max(0, lines.length - previewLines.length);

  const goPrimary = () => {
    const target = getBookingTarget(totalItemCount > 0);
    scrollToSection(target, target === "booking" ? 140 : 110);
  };

  return (
    <>
      <CartOrderSheet open={editOpen} onOpenChange={setEditOpen} />
      {!expanded ? (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-6 sm:start-6 sm:justify-start",
            className,
          )}
        >
          <button
            type="button"
            onClick={() => setExpandedPersist(true)}
            className={cn(
              "font-heading flex max-w-[min(100%,20rem)] items-center gap-3 rounded-full border border-sumac/30 bg-linear-to-l from-sumac via-sumac-deep to-sumac px-4 py-2.5 text-cream shadow-[0_8px_28px_-8px_rgba(61,36,51,0.45)] ring-1 ring-heritage/40 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage focus-visible:ring-offset-2",
            )}
            dir="rtl"
            aria-expanded="false"
            aria-label="عرض سلة الطلب"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cream/15 ring-1 ring-white/25">
              <ShoppingBag className="size-4" aria-hidden strokeWidth={2} />
            </span>
            <span className="min-w-0 flex-1 text-right">
              <span className="block text-[0.65rem] font-semibold uppercase tracking-wide text-cream/85">
                سلة الطلب
              </span>
              <span className="mt-0.5 flex flex-wrap items-baseline justify-end gap-2 font-heading text-sm font-bold tabular-nums">
                <span>
                  {toEasternArabicNumerals(String(totalItemCount))}{" "}
                  {totalItemCount === 1 ? "صنف" : "أصناف"}
                </span>
                <span dir="ltr" className="text-cream/95">
                  · {toEasternArabicNumerals(String(totalPrice))} ₪
                </span>
              </span>
            </span>
            <ChevronUp
              className="size-5 shrink-0 opacity-90"
              aria-hidden
              strokeWidth={2}
            />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-6 sm:start-6 sm:justify-start",
            className,
          )}
        >
          <div
            className={cn(
              "menu-printed-sheet relative z-0 w-full max-w-md overflow-hidden rounded-2xl border-2 border-sumac/30 text-sumac-deep shadow-lg backdrop-blur-md sm:max-w-sm",
            )}
            dir="rtl"
            aria-expanded="true"
          >
            <button
              type="button"
              onClick={() => setExpandedPersist(false)}
              className="absolute left-3 top-3 z-10 flex size-9 items-center justify-center rounded-full border border-sumac/15 bg-cream/90 text-sumac-deep/70 shadow-sm transition hover:bg-blush/40 hover:text-sumac-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage/50"
              aria-label="إخفاء السلة"
            >
              <ChevronDown className="size-4" aria-hidden strokeWidth={2} />
            </button>

            <div className="relative z-[1] flex items-start justify-between gap-3 px-4 py-3 pl-14">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sumac text-cream shadow-inner ring-1 ring-heritage/35">
                  <ShoppingBag className="size-5" aria-hidden strokeWidth={2} />
                </span>

                <div className="min-w-0 flex-1 text-right">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-sumac-deep/75">سلة الطلب</p>
                    <p
                      className="text-xs font-bold text-sumac-deep tabular-nums"
                      dir="ltr"
                    >
                      المجموع: {toEasternArabicNumerals(String(totalPrice))} ₪
                    </p>
                  </div>

                  <p className="mt-0.5 truncate font-heading text-sm font-bold text-sumac-deep">
                    {toEasternArabicNumerals(String(totalItemCount))}{" "}
                    {totalItemCount === 1 ? "صنف" : "أصناف"}
                  </p>

                  <ul className="mt-2.5 space-y-2" aria-label="أصناف مختارة">
                    {previewLines.map((line) => {
                      const unit = parseMenuPriceToNumber(line.price);
                      const lineTotal = unit * line.qty;
                      return (
                        <li
                          key={line.itemId}
                          className="surface-menu-callout flex items-start justify-between gap-3 rounded-xl px-3 py-2 shadow-[inset_0_1px_0_rgba(255,253,248,0.7)]"
                        >
                          <div className="min-w-0 flex-1 text-right">
                            <p className="truncate text-[0.8rem] font-bold leading-tight text-sumac-deep">
                              {line.name}
                            </p>
                            <p className="mt-0.5 text-[0.68rem] font-medium text-sumac-deep/65">
                              × {toEasternArabicNumerals(String(line.qty))}
                            </p>
                          </div>
                          <p
                            className="shrink-0 pt-0.5 text-[0.78rem] font-extrabold tabular-nums text-sumac-deep"
                            dir="ltr"
                          >
                            {toEasternArabicNumerals(String(lineTotal))}
                          </p>
                        </li>
                      );
                    })}
                  </ul>

                  {remainingLinesCount > 0 ? (
                    <p className="mt-2 text-center text-[0.72rem] font-semibold text-sumac-deep/65">
                      + {toEasternArabicNumerals(String(remainingLinesCount))}{" "}
                      {remainingLinesCount === 1 ? "صنف آخر" : "أصناف أخرى"}
                    </p>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={goPrimary}
                className="font-heading shrink-0 self-center rounded-full bg-linear-to-l from-sumac via-sumac-deep to-sumac px-4 py-2.5 text-sm font-bold text-cream shadow-md ring-1 ring-heritage/40 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage focus-visible:ring-offset-2"
              >
                إتمام الحجز
              </button>
            </div>

            <div className="relative z-[1] flex flex-wrap items-center justify-between gap-2 border-t border-sumac/12 px-3 pb-3 pt-2">
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-sumac-deep/75 transition hover:bg-sumac/5 hover:text-sumac-deep"
              >
                <ChevronLeft className="size-3.5" aria-hidden />
                تعديل الطلب
              </button>

              <p className="text-[0.72rem] font-medium text-sumac-deep/60">
                راجع أصنافك أو أكمل الحجز
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
