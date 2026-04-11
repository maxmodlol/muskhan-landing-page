"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { StampCtaLink } from "@/components/landing/StampCtaLink";
import { useCart } from "@/contexts/cart-context";
import {
  getFeaturedMenuItem,
  getMenuGridItems,
  MENU_FIXED_SECTIONS,
  MENU_INTRO_TITLE,
  type MenuItemRecord,
} from "@/data/menu";
import { cn } from "@/lib/utils";
import { toEasternArabicNumerals } from "@/lib/eastern-arabic-numerals";

function MenuAddControl({
  item,
  className,
}: {
  item: MenuItemRecord;
  className?: string;
}) {
  const { addItem, setQty, lines } = useCart();
  const qty = lines.find((l) => l.itemId === item.id)?.qty ?? 0;

  if (qty === 0) {
    return (
      <div className={cn("shrink-0", className)}>
        <button
          type="button"
          onClick={() => addItem(item)}
          aria-label={`أضف ${item.name} إلى الطلب`}
          className={cn(
            "flex size-11 items-center justify-center rounded-full border-2 border-sumac/35 bg-white/75 text-sumac-deep shadow-[0_2px_8px_-2px_rgba(89,42,68,0.2)] transition",
            "hover:border-heritage hover:bg-heritage/30 hover:shadow-md",
            "active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage focus-visible:ring-offset-2 focus-visible:ring-offset-blush",
          )}
        >
          <Plus className="size-5" aria-hidden strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border-2 border-sumac/40 bg-white/90 p-0.5 shadow-[0_2px_10px_-2px_rgba(89,42,68,0.18)] ring-1 ring-heritage/15",
        className,
      )}
      dir="ltr"
    >
      <button
        type="button"
        onClick={() => setQty(item.id, qty - 1)}
        aria-label="تقليل الكمية"
        className="flex size-10 items-center justify-center rounded-full text-sumac-deep transition hover:bg-blush/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage/50"
      >
        <Minus className="size-4" aria-hidden strokeWidth={2.5} />
      </button>
      <span className="min-w-[2rem] px-0.5 text-center text-sm font-extrabold tabular-nums text-sumac-deep">
        {toEasternArabicNumerals(String(qty))}
      </span>
      <button
        type="button"
        onClick={() => addItem(item)}
        aria-label="زيادة الكمية"
        className="flex size-10 items-center justify-center rounded-full text-sumac-deep transition hover:bg-blush/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage/50"
      >
        <Plus className="size-4" aria-hidden strokeWidth={2.5} />
      </button>
    </div>
  );
}

function MenuDishRow({ item }: { item: MenuItemRecord }) {
  return (
    <article
      dir="rtl"
      className="border-b border-sumac/12 pb-7 last:border-b-0 last:pb-0"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:gap-4">
          {item.image ? (
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[14rem] shrink-0 overflow-hidden rounded-sm border border-sumac/25 shadow-md sm:mx-0 sm:aspect-square sm:h-[5.25rem] sm:w-[5.25rem] sm:max-w-none">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(max-width:640px) 280px, 84px"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="min-w-0 flex-1 text-right">
            <h3 className="font-heading text-lg font-bold leading-snug text-sumac-deep sm:text-xl">
              {item.name}
            </h3>
            {item.description ? (
              <p
                className={cn(
                  "menu-desc-bars mt-2 inline-block max-w-xl text-pretty text-sm leading-[1.75] text-sumac-deep/88 sm:text-base",
                )}
              >
                {item.description}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-sumac/10 pt-3 sm:flex-col sm:items-end sm:justify-start sm:border-t-0 sm:pt-0.5">
          <p
            className="font-heading text-xl font-extrabold tabular-nums tracking-tight text-sumac-deep sm:text-2xl"
            dir="ltr"
          >
            {item.price}
          </p>
          <MenuAddControl item={item} />
        </div>
      </div>
    </article>
  );
}

function MenuFeaturedBlock({ item }: { item: MenuItemRecord }) {
  const { addItem, setQty, lines } = useCart();
  const qty = lines.find((l) => l.itemId === item.id)?.qty ?? 0;
  return (
    <div
      className={cn(
        "relative mb-10 overflow-hidden rounded-sm border-2 border-sumac/45 bg-white/25 p-5 shadow-inner ring-1 ring-heritage/30 sm:p-6",
      )}
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-l from-transparent via-heritage/80 to-transparent"
        aria-hidden
      />
      <div className="mb-3 flex justify-center sm:justify-end">
        <span className="rounded-full border border-heritage/50 bg-sumac/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-cream sm:text-xs">
          عرض مميز
        </span>
      </div>

      <div
        dir="rtl"
        className="flex flex-col gap-5 sm:flex-row sm:items-stretch sm:gap-6"
      >
        {item.image ? (
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-sm border border-sumac/30 shadow-[0_12px_32px_-16px_rgba(89,42,68,0.35)] sm:aspect-auto sm:h-[min(12rem,36vh)] sm:w-[min(42%,14rem)] sm:max-w-[220px]">
            <Image
              src={item.image}
              alt={item.name}
              fill
              priority
              sizes="(max-width:640px) 100vw, 220px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col text-right">
          <h3 className="font-heading text-xl font-extrabold leading-tight text-sumac-deep sm:text-2xl">
            {item.name}
          </h3>
          {item.description ? (
            <p className="menu-desc-bars mt-2 inline-block text-sm font-medium leading-relaxed text-sumac-deep/90 sm:text-base">
              {item.description}
            </p>
          ) : null}
          {item.featuredIncludes?.length ? (
            <ul className="mt-4 space-y-2 border-t border-sumac/15 pt-4 text-sm text-sumac-deep/95 sm:text-base">
              {item.featuredIncludes.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-heritage"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-end gap-4">
            <p
              className="font-heading text-2xl font-extrabold tabular-nums text-sumac-deep sm:text-3xl"
              dir="ltr"
            >
              {item.price}
            </p>
            {qty === 0 ? (
              <button
                type="button"
                onClick={() => addItem(item)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-sumac/40 bg-sumac px-6 text-sm font-bold text-cream shadow-md transition hover:bg-sumac-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage focus-visible:ring-offset-2 focus-visible:ring-offset-blush"
              >
                <Plus className="size-4" aria-hidden strokeWidth={2.5} />
                أضف الكومبو
              </button>
            ) : (
              <div
                className="inline-flex items-center gap-1 rounded-full border-2 border-sumac/45 bg-white/90 p-1 shadow-md ring-1 ring-heritage/20"
                dir="ltr"
              >
                <button
                  type="button"
                  onClick={() => setQty(item.id, qty - 1)}
                  aria-label="تقليل الكمية"
                  className="flex size-10 items-center justify-center rounded-full bg-sumac/10 text-sumac-deep transition hover:bg-sumac/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage/50"
                >
                  <Minus className="size-4" aria-hidden strokeWidth={2.5} />
                </button>
                <span className="min-w-[2.75rem] px-1 text-center text-base font-extrabold tabular-nums text-sumac-deep">
                  {toEasternArabicNumerals(String(qty))}
                </span>
                <button
                  type="button"
                  onClick={() => addItem(item)}
                  aria-label="زيادة الكمية"
                  className="flex size-10 items-center justify-center rounded-full bg-sumac text-cream shadow-sm transition hover:bg-sumac-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage/50"
                >
                  <Plus className="size-4" aria-hidden strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuFixedBlock({
  title,
  lines,
}: {
  title: string;
  lines: readonly string[];
}) {
  return (
    <div className="mb-9 text-center last:mb-0">
      <h3 className="mx-auto inline-block min-w-[min(100%,14rem)] border-b-2 border-sumac/30 pb-2 font-heading text-base font-extrabold text-sumac-deep sm:text-lg">
        {title}
      </h3>
      <ul className="mx-auto mt-4 max-w-md space-y-2.5 text-right">
        {lines.map((line) => (
          <li
            key={line}
            className="text-sm font-semibold leading-relaxed text-sumac-deep/95 sm:text-base"
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MenuSection() {
  const featured = getFeaturedMenuItem();
  const gridItems = getMenuGridItems();

  return (
    <section
      id="menu"
      className="section-pad scroll-mt-20 overflow-x-hidden bg-musakhan-atmosphere"
    >
      <SectionContainer className="min-w-0">
        <div className="mx-auto max-w-2xl px-2 sm:max-w-3xl sm:px-4 lg:max-w-3xl">
          <div
            className={cn(
              "menu-printed-sheet relative overflow-hidden rounded-sm border-2 border-sumac/30",
              "px-0 pb-0 pt-0 shadow-lg",
            )}
          >
            <div
              className="tatreez-band tatreez-band-thin relative z-[1] w-full shrink-0"
              aria-hidden
            />

            <div className="relative z-[1] px-5 pb-10 pt-8 sm:px-10 sm:pb-12 sm:pt-10">
              <header className="mb-8 text-center">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-sumac-deep/55 sm:text-xs">
                  عين القدس
                </p>
                <h2 className="mt-2 font-heading text-2xl font-extrabold leading-tight text-sumac-deep sm:text-3xl md:text-[2rem]">
                  أطباق مهرجان المسخن
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-sumac-deep/80 sm:text-base">
                  قائمة مطعمية — أضف ما تشتهي إلى طلبك، ثم أكمِل الحجز
                </p>
              </header>

              <div className="mx-auto mb-10 max-w-lg border-2 border-sumac/35 bg-white/30 px-4 py-3.5 text-center shadow-[inset_0_1px_0_rgba(255,253,248,0.65)] sm:px-6 sm:py-4">
                <p className="font-heading text-sm font-extrabold text-sumac-deep sm:text-base">
                  {MENU_INTRO_TITLE}
                </p>
              </div>

              <div className="mx-auto max-w-lg">
                {MENU_FIXED_SECTIONS.map((block) => (
                  <MenuFixedBlock
                    key={block.id}
                    title={block.title}
                    lines={block.lines}
                  />
                ))}
              </div>

              <div
                className="mx-auto my-10 h-px max-w-xs bg-linear-to-r from-transparent via-sumac/35 to-transparent"
                aria-hidden
              />

              <h3 className="text-center font-heading text-xl font-extrabold text-sumac-deep sm:text-2xl">
                قائمة المسخن
              </h3>
              <p className="mx-auto mt-2 max-w-md text-center text-sm text-sumac-deep/75 sm:text-base">
                مسخن عين القدس — مذاق المطبخ المقدسي
              </p>

              <div className="mx-auto mt-10 max-w-2xl">
                {featured ? <MenuFeaturedBlock item={featured} /> : null}

                <div className="space-y-0">
                  {gridItems.map((item) => (
                    <MenuDishRow key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <div
                className="tatreez-band tatreez-band-thin relative z-[1] mt-12 w-full"
                aria-hidden
              />

              <div className="mt-8 flex flex-col items-center gap-2 sm:mt-10">
                <StampCtaLink
                  href="#booking"
                  label="إتمام الحجز — الانتقال إلى نموذج الحجز"
                  caption="إتمام الحجز"
                />
                <p className="rounded-md bg-white/80 px-2 py-1 text-center text-[0.7rem] font-semibold text-sumac-deep/90 ring-1 ring-sumac/10 sm:text-xs">
                  الطلب والمقاعد في خطوة واحدة
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
