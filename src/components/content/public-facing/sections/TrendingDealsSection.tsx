"use client";

import { SectionHeader } from "@/components/custom/SectionHeader";
import { useReadDealQuery } from "@/services/dealService";
import { DealGrid } from "@/components/custom/reusable-deals/DealGrid";
import { DealGridSkeleton } from "@/components/custom/reusable-deals/DealGridSkeleton";
import { NoDealsFound } from "@/components/custom/reusable-deals/NoDealsFound";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import DealUtil from "@/utilities/dealUtil";

export default function TrendingDealsSection() {
  const { data: dealsResponse, isLoading } = useReadDealQuery();
  const allDeals = dealsResponse?.data ?? [];
  const deals = DealUtil.getDealsByType(allDeals, "trending", 8);

  return (
    <section
      className="container mx-auto px-4 py-8"
      data-testid="section-trending"
    >
      <SectionHeader
        title="Trending Now"
        description="Popular deals the community is loving"
        action={{ label: "See More", href: RouteConstant.deals.path }}
      />
      {isLoading ? (
        <DealGridSkeleton count={8} />
      ) : deals && deals.length > 0 ? (
        <DealGrid deals={deals} />
      ) : (
        <NoDealsFound />
      )}
    </section>
  );
}
