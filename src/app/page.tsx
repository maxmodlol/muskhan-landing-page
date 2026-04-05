import { BookingSection } from "@/components/landing/BookingSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { LoyaltySection } from "@/components/landing/LoyaltySection";
import { MenuSection } from "@/components/landing/MenuSection";
import { StorySection } from "@/components/landing/StorySection";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <HeroSection />
      <LoyaltySection />
      <StorySection />
      <MenuSection />
      <BookingSection />
    </main>
  );
}
