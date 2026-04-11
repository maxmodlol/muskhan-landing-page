import { BookingSection } from "@/components/landing/BookingSection";
import { CartDock } from "@/components/landing/CartDock";
import { HeroSection } from "@/components/landing/HeroSection";
import { LoyaltySection } from "@/components/landing/LoyaltySection";
import { MenuSection } from "@/components/landing/MenuSection";
import { StorySection } from "@/components/landing/StorySection";
import { CartProvider } from "@/contexts/cart-context";

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
