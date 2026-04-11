import { toEasternArabicNumerals } from "@/lib/eastern-arabic-numerals";
import { parseMenuPriceToNumber } from "@/lib/parse-menu-price";

type OrderLine = { id: string; name: string; price: string; qty: number };

function parseOrderLines(raw: string | null | undefined): OrderLine[] | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const out: OrderLine[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const o = row as Record<string, unknown>;
      const id = typeof o.id === "string" ? o.id : "";
      const name = typeof o.name === "string" ? o.name : "";
      const price = typeof o.price === "string" ? o.price : "";
      const qty = typeof o.qty === "number" ? o.qty : NaN;
      if (!id || !name || !Number.isFinite(qty) || qty < 1) continue;
      out.push({ id, name, price, qty });
    }
    return out.length ? out : null;
  } catch {
    return null;
  }
}

/** Admin table cell: parsed menu lines with per-line and order totals. */
export function MenuOrderCell({ raw }: { raw: string | null | undefined }) {
  const lines = parseOrderLines(raw);
  if (!lines?.length) {
    return <span className="text-earth/50">—</span>;
  }
  const total = lines.reduce(
    (s, l) => s + parseMenuPriceToNumber(l.price) * l.qty,
    0,
  );
  return (
    <div className="max-w-[min(100%,22rem)] space-y-2 text-xs leading-snug">
      <ul className="space-y-1.5">
        {lines.map((l) => {
          const sub = parseMenuPriceToNumber(l.price) * l.qty;
          return (
            <li
              key={`${l.id}-${l.qty}-${l.price}`}
              className="rounded-lg border border-earth/12 bg-musakhan-atmosphere/80 px-2.5 py-2"
            >
              <p className="font-semibold text-earth">{l.name}</p>
              <div
                className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.7rem] text-earth/75"
                dir="ltr"
              >
                <span>{l.price}</span>
                <span>× {toEasternArabicNumerals(String(l.qty))}</span>
                <span className="font-bold text-olive">
                  {toEasternArabicNumerals(String(sub))} ₪
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <p
        className="border-t border-earth/15 pt-1.5 font-heading text-[0.8rem] font-extrabold text-olive"
        dir="ltr"
      >
        المجموع {toEasternArabicNumerals(String(total))} ₪
      </p>
    </div>
  );
}
