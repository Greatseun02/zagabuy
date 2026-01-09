import CategoryNavSection from "@/components/content/public-facing/sections/CategoryNavSection";
import { HeroSection } from "@/components/content/public-facing/sections/HeroSection";
import TopDealsSection from "@/components/content/public-facing/sections/TopDealsSection";
import TrendingDealsSection from "@/components/content/public-facing/sections/TrendingDealsSection";

export default function page() {
  return (
    <>
      <HeroSection />
      {/* <CategoryNavSection /> */}
      <TopDealsSection />
      <TrendingDealsSection />
    </>
  );
}
