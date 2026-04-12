import dynamic from "next/dynamic";
import { HeroSection } from "@/components/landing/HeroSection";
import { CartProvider } from "@/contexts/cart-context";

const LoyaltySection = dynamic(
  () =>
    import("@/components/landing/LoyaltySection").then((m) => ({
      default: m.LoyaltySection,
    })),
);

const StorySection = dynamic(
  () =>
    import("@/components/landing/StorySection").then((m) => ({
      default: m.StorySection,
    })),
);

const MenuSection = dynamic(
  () =>
    import("@/components/landing/MenuSection").then((m) => ({
      default: m.MenuSection,
    })),
);

const BookingSection = dynamic(
  () =>
    import("@/components/landing/BookingSection").then((m) => ({
      default: m.BookingSection,
    })),
);

const CartDock = dynamic(
  () =>
    import("@/components/landing/CartDock").then((m) => ({
      default: m.CartDock,
    })),
);

export default function Home() {
  return (
    <CartProvider>
      <main className="min-h-screen overflow-x-hidden pb-24 sm:pb-8">
        <HeroSection />
        <LoyaltySection />
        <StorySection />
        <MenuSection />
        <BookingSection />
      </main>
      <CartDock />
    </CartProvider>
  );
}
