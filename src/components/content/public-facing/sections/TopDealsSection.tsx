"use client";

import { useReadDealQuery } from "@/services/dealService";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { DealGrid } from "@/components/custom/reusable-deals/DealGrid";
import { DealGridSkeleton } from "@/components/custom/reusable-deals/DealGridSkeleton";
import { NoDealsFound } from "@/components/custom/reusable-deals/NoDealsFound";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import DealUtil from "@/utilities/dealUtil";

export default function TopDealsSection() {
  const { data: dealsResponse, isLoading } = useReadDealQuery();
  const allDeals = dealsResponse?.data ?? [];
  const deals = DealUtil.getDealsByType(allDeals, "top", 4, true);

  return (
    <section
      className="container mx-auto px-4 py-8"
      data-testid="section-featured"
    >
      <SectionHeader
        title="Top Deals"
        description="Hand-picked deals you don't want to miss"
        action={{ label: "View All", href: RouteConstant.deals.path }}
      />
      {isLoading ? (
        <DealGridSkeleton count={4} />
      ) : deals && deals.length > 0 ? (
        <DealGrid deals={deals} />
      ) : (
        <NoDealsFound />
      )}
    </section>
  );
}
