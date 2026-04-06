import Image from "next/image";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { SectionDivider } from "@/components/landing/SectionDivider";
import {
  getFeaturedMenuItem,
  getMenuGridItems,
  type MenuItemRecord,
} from "@/data/menu";
import { cn } from "@/lib/utils";

function MenuPrice({ price }: { price: string }) {
  const parts = price.trim().split(/\s+/);
  const amount = parts[0] ?? price;
  const unit = parts.slice(1).join(" ") || "شيكل";
  return (
    <div
      className="flex shrink-0 flex-col items-end gap-0.5 rounded-xl border border-sumac/20 bg-linear-to-br from-cream/95 to-parchment/90 px-3 py-2 text-end shadow-[inset_0_1px_0_rgba(255,253,248,0.65),0_6px_18px_-10px_rgba(140,48,72,0.25)] ring-1 ring-heritage/25 sm:px-3.5 sm:py-2.5"
      dir="rtl"
    >
      <span className="font-heading text-lg font-extrabold tabular-nums tracking-tight text-sumac-deep sm:text-xl">
        {amount}
      </span>
      <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-earth/50 sm:text-xs">
        {unit}
      </span>
    </div>
  );
}

function EarthCorner() {
  return (
    <div
      className="pointer-events-none absolute top-0 right-0 z-10 size-0 border-t-[36px] border-l-[36px] border-t-sumac/75 border-l-transparent sm:border-t-[42px] sm:border-l-[42px]"
      aria-hidden
    />
  );
}

/** Warm “studio backdrop” so non-photo cards match the same frame as dishes — not a placeholder label. */
function MenuVisualBackdrop() {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-linear-to-br from-parchment via-cream to-[#e5dccf]"
      aria-hidden
    >
      <div className="absolute -end-[20%] -top-[25%] size-[min(85%,14rem)] rounded-full bg-heritage/20 blur-[48px] transition duration-700 group-hover:bg-heritage/28" />
      <div className="absolute -bottom-[30%] -start-[15%] size-[min(95%,15rem)] rounded-full bg-sumac/18 blur-[52px] transition duration-700 group-hover:bg-sumac/24" />
      <div className="absolute start-1/2 top-1/2 size-[min(55%,9rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-[36px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_70%_85%,rgba(140,48,72,0.08),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_25%_25%,rgba(195,211,0,0.1),transparent_50%)]" />
      <div className="absolute inset-0 paper-grain opacity-[0.22]" />
      <div className="absolute inset-[10%] rounded-xl border border-cream/45 bg-cream/[0.04] shadow-[inset_0_1px_0_rgba(255,253,248,0.35)] sm:inset-[12%]" />
      <div className="absolute inset-x-[14%] bottom-[18%] h-px bg-linear-to-l from-transparent via-heritage/35 to-transparent sm:inset-x-[16%]" />
    </div>
  );
}

/**
 * One card pattern for every dish: 4:3 visual on top, copy below.
 * With photo = real image; without = same layout, warm branded backdrop (no “missing image” messaging).
 */
function MenuDishCard({ item }: { item: MenuItemRecord }) {
  const hasImage = Boolean(item.image);

  return (
    <article
      className={cn(
        "group flex min-w-0 flex-col overflow-hidden rounded-2xl bg-parchment shadow-[0_8px_28px_-10px_rgba(63,42,26,0.14)] ring-1 ring-earth/10 transition",
        "hover:shadow-[0_16px_40px_-14px_rgba(140,48,72,0.18)] hover:ring-heritage/35",
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-parchment">
        {hasImage && item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <MenuVisualBackdrop />
        )}
        <EarthCorner />
        <div className="absolute start-3 bottom-3 z-[1]" dir="rtl">
          <MenuPrice price={item.price} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 pt-4 pb-5 text-right sm:gap-2.5 sm:px-5 sm:pt-5 sm:pb-6">
        <h3 className="font-heading text-lg font-bold text-earth sm:text-xl">
          {item.name}
        </h3>
        {item.description ? (
          <p className="text-sm leading-relaxed text-earth/78 sm:text-base">
            {item.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function MenuSection() {
  const featured = getFeaturedMenuItem();
  const gridItems = getMenuGridItems();

  return (
    <section
      id="menu"
      className="section-pad scroll-mt-20 overflow-x-hidden bg-cream"
    >
      <SectionContainer className="min-w-0">
        <div className="mx-auto w-full max-w-6xl">
          <SectionDivider />
          <header className="mx-auto mt-3 max-w-3xl text-center sm:mt-5">
            <h2 className="font-heading text-2xl font-extrabold leading-tight text-earth sm:text-3xl md:text-[2rem]">
              أطباق مهرجان المسخن
            </h2>
            <p className="mt-2.5 text-sm text-earth/88 sm:text-base md:text-lg">
              تذوق أصالة المطبخ الفلسطيني — قائمة كاملة بأسعار واضحة
            </p>
          </header>

          {featured ? (
            <div className="mt-6 sm:mt-8 md:mt-10">
              <div className="overflow-hidden rounded-2xl bg-earth shadow-[0_20px_56px_-22px_rgba(140,48,72,0.35)] ring-1 ring-heritage/35 sm:rounded-3xl">
                <div className="flex flex-col lg:flex-row lg:items-stretch">
                  <div className="group relative aspect-[4/3] w-full min-w-0 lg:aspect-auto lg:min-h-[320px] lg:w-1/2">
                    {featured.image ? (
                      <Image
                        src={featured.image}
                        alt={featured.name}
                        fill
                        priority
                        sizes="(max-width:1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 overflow-hidden">
                        <MenuVisualBackdrop />
                      </div>
                    )}
                    <span className="absolute top-4 right-4 rounded-full border border-heritage/50 bg-sumac/95 px-3 py-1.5 text-xs font-bold text-cream shadow-lg ring-1 ring-heritage/40 sm:text-sm">
                      العرض المميز
                    </span>
                  </div>
                  <div className="relative flex min-w-0 flex-1 flex-col justify-center gap-4 px-5 py-8 sm:px-8 sm:py-10">
                    <div
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(195,211,0,0.08)_0%,transparent_55%)]"
                      aria-hidden
                    />
                    <div className="relative text-right">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-heading text-2xl font-extrabold leading-tight text-cream sm:text-3xl">
                            {featured.name}
                          </h3>
                          <p className="mt-1 text-sm text-cream/90 sm:text-base">
                            أيقونة المهرجان — لشخصين
                          </p>
                        </div>
                        <MenuPrice price={featured.price} />
                      </div>
                      {featured.description ? (
                        <p className="mt-4 text-sm leading-relaxed text-cream/88 sm:text-base">
                          {featured.description}
                        </p>
                      ) : null}
                      {featured.featuredIncludes?.length ? (
                        <ul className="mt-5 flex flex-col gap-3 text-cream">
                          {featured.featuredIncludes.map((line) => (
                            <li
                              key={line}
                              className="flex items-center gap-3 text-sm sm:text-base"
                            >
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-heritage/90 text-sumac-deep shadow-sm">
                                <span className="text-xs font-bold" aria-hidden>
                                  ✓
                                </span>
                              </span>
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <a
                        href="#booking"
                        className="mt-6 inline-flex min-h-11 w-full min-w-0 items-center justify-center rounded-full border border-heritage/50 bg-cream px-6 text-sm font-bold text-sumac-deep shadow-md transition hover:border-heritage hover:bg-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage/50 sm:min-h-12 sm:w-auto sm:self-start sm:text-base"
                      >
                        اطلب الكومبو
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-8 sm:mt-10">
            <p className="text-center font-heading text-sm font-bold text-sumac-deep sm:text-base">
              القائمة
            </p>
            <div className="mx-auto mt-3 h-px max-w-xs bg-gradient-to-r from-transparent via-heritage/60 to-transparent" />
          </div>

          <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3">
            {gridItems.map((item) => (
              <MenuDishCard key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-8 flex justify-center sm:mt-10">
            <a
              href="#booking"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-sumac bg-sumac px-8 py-3 text-sm font-bold text-cream shadow-[0_12px_32px_-14px_rgba(140,48,72,0.4)] ring-2 ring-heritage/35 transition hover:bg-sumac-deep hover:ring-heritage/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:min-h-12 sm:px-10 sm:text-base"
            >
              احجز من القائمة
            </a>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
