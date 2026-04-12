/**
 * Festival menu — copy aligned with printed menu references (عين القدس).
 * `price` uses Western digits + ₪ like the reference menus.
 */
export type MenuItemRecord = {
  id: string;
  name: string;
  /** e.g. "85 ₪" */
  price: string;
  description?: string;
  /** Highlighted combo row */
  featured?: boolean;
  /** Combo bullets */
  featuredIncludes?: readonly string[];
};

export type MenuFixedSection = {
  id: string;
  title: string;
  lines: readonly string[];
};

/** Printed menu header — all dishes served with */
export const MENU_INTRO_TITLE = "كل الأطباق تُقدّم مع:" as const;

/** Sauces & sides (included — not cart lines) */
export const MENU_FIXED_SECTIONS: readonly MenuFixedSection[] = [
  {
    id: "sauces",
    title: "صوصات عين القدس",
    lines: ["لبن كزبرة خضراء", "لبن خيار ونعنع", "لبن سادة"],
  },
  {
    id: "garnish",
    title: "التصليحة الرسمية",
    lines: ["بصل أخضر", "شرحات بندورة", "فلفل أخضر حار", "زيتون، جرجير"],
  },
] as const;

export const MENU_FEATURED_ID = "musakhan-combo" as const;

export const MENU_ITEMS: readonly MenuItemRecord[] = [
  {
    id: MENU_FEATURED_ID,
    name: "كومبو مسخن (لشخصين)",
    price: "190 ₪",
    description: "نصف دجاجة مسخن، رولان مسخن، فتة مسخن",
    featured: true,
    featuredIncludes: ["نصف دجاجة مسخن", "رولان مسخن", "فتة مسخن"],
  },
  {
    id: "musakhan-quds",
    name: "مسخن قدسي",
    price: "85 ₪",
    description:
      "نصف دجاج على خبز الطابون عين القدس، بصل وسماق تشويح بزيت الزيتون",
  },
  {
    id: "fatta",
    name: "فتة مسخن",
    price: "58 ₪",
    description: "خبز طابون محمص، لبن بالثوم، بصل وسماق، قطع دجاج مسخن",
  },
  {
    id: "steak",
    name: "ستيك مسخن",
    price: "69 ₪",
    description: "ستيك دجاج مسخن على خبزة عين القدس مع بصل وسماق وزيت زيتون",
  },
  {
    id: "roll",
    name: "مسخن رول",
    price: "48 ₪",
    description: "رولات شراك محشوة بدجاج مع بصل وسماق تشويح بزيت الزيتون",
  },
  {
    id: "pizza",
    name: "بيتزا مسخن",
    price: "55 ₪",
    description: "عجينة طازجة، دجاج مسخن، بصل وسماق",
  },
  {
    id: "calzone",
    name: "كلزوني مسخن",
    price: "52 ₪",
    description: "عجينة محشية، دجاج مسخن مع بصل وسماق",
  },
  {
    id: "salad",
    name: "سلطة المسخن",
    price: "42 ₪",
    description: "خس طازج، قطع دجاج مسخن، خبز محمص بالسماق، وصلصة لبن",
  },
  {
    id: "kebab",
    name: "كباب مسخن",
    price: "98 ₪",
    description: "كباب دجاج مع بصل وسماق وزيت زيتون، مغطى بعجينة مخبوزة",
  },
  {
    id: "fettuccine",
    name: "فوتتشيني مسخن",
    price: "68 ₪",
    description: "فوتتشيني مع شرائح صدر دجاج، يقدّم مع بصل وسماق وزيت زيتون",
  },
  {
    id: "burger",
    name: "بيرجر مسخن",
    price: "65 ₪",
    description: "صدر دجاج مشوي مع بصل وسماق وزيت زيتون، ملفوف بعجينة مخبوزة",
  },
] as const;

export function getFeaturedMenuItem(): MenuItemRecord | undefined {
  return MENU_ITEMS.find((i) => i.featured);
}

export function getMenuGridItems(): readonly MenuItemRecord[] {
  return MENU_ITEMS.filter((i) => !i.featured);
}
