/**
 * Festival menu — prices in Eastern Arabic numerals per brief.
 * `image` optional: items without photos use text-forward layout in the UI.
 */
export type MenuItemRecord = {
  id: string;
  name: string;
  /** Eastern Arabic numerals + currency, e.g. "٨٥ شيكل" */
  price: string;
  description?: string;
  image?: string;
  /** Hero-style featured strip (مسخن قدسي) */
  featured?: boolean;
  /** Bullets for featured combo only */
  featuredIncludes?: readonly string[];
};

export const MENU_FEATURED_ID = "musakhan-quds" as const;

export const MENU_ITEMS: readonly MenuItemRecord[] = [
  {
    id: MENU_FEATURED_ID,
    name: "مسخن قدسي",
    price: "٨٥ شيكل",
    description:
      "نص دجاجة مع بصل وسماق وزيت زيتون — نكهة الطابون كما في بيوت القدس.",
    image: "/offer.jpg",
    featured: true,
    featuredIncludes: ["نص دجاجة مسخن", "2 رول مسخن", "فتة مسخن"],
  },
  {
    id: "fatta",
    name: "فتة مسخن",
    price: "٥٨ شيكل",
    description: "خبز طابون، لبن، دجاج مسخن",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "roll",
    name: "مسخن رول",
    price: "٤٨ شيكل",
    description: "لفائف شراك محشية دجاج",
    image:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pizza",
    name: "بيتزا مسخن",
    price: "٥٥ شيكل",
    description: "عجينة طازجة مع دجاج مسخن",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "calzone",
    name: "كلزوني مسخن",
    price: "٥٢ شيكل",
    description: "عجينة محشية دجاج",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "salad",
    name: "سلطة مسخن",
    price: "٤٢ شيكل",
    description: "خضار موسمية مع زيت زيتون وسماق",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "kebab",
    name: "كباب مسخن",
    price: "٩٨ شيكل",
    description: "كباب دجاج بنكهة السماق والبصل على خبز الطابون",
  },
  {
    id: "steak",
    name: "ستيك مسخن",
    price: "٦٩ شيكل",
    description: "ستيك دجاج على خبزة طابون",
  },
  {
    id: "fettuccine",
    name: "فتتشيني مسخن",
    price: "٦٨ شيكل",
    description: "فتتشيني كريمي مع قطع دجاج مسخن",
  },
  {
    id: "burger",
    name: "بيرغر مسخن",
    price: "٦٥ شيكل",
    description: "بيرغر دجاج مسخن مع خبزة طابون وصلصة البيت",
  },
] as const;

export function getFeaturedMenuItem(): MenuItemRecord | undefined {
  return MENU_ITEMS.find((i) => i.featured);
}

export function getMenuGridItems(): readonly MenuItemRecord[] {
  return MENU_ITEMS.filter((i) => !i.featured);
}
