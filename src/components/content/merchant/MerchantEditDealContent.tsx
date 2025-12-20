"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useReaddealQuery } from "@/services/dealService";
import NotFound from "@/components/ui/NotFound";
import CreateOrUpdateDealForm from "@/components/forms/CreateOrUpdateDealForm";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { toast } from "sonner";

export default function MerchantEditDealContent() {
  const params = useParams();
  const router = useRouter();
  const dealId = params?.dealId ?? "";

  const { data: dealsResp } = useReaddealQuery();

  const deal = useMemo(() => {
    return dealsResp?.data?.find(
      (d: any) => String(d.dealId) === String(dealId)
    );
  }, [dealsResp, dealId]);

  if (!deal) {
    return (
      <DashboardPageLayout title="Deal not found">
        <NotFound
          title="Deal not found"
          description={`We couldn't find a deal with id ${dealId}.`}
        />
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout title={`Edit: ${deal.dealTitle}`}>
      <div className="mt-6 max-w-3xl">
        <CreateOrUpdateDealForm
          isUpdate
          initialValues={{
            title: deal.dealTitle,
            price: deal.dealPrice ?? deal.dealOldPrice ?? 0,
            quantity: 1,
            images: [],
          }}
          onSubmit={async (values) => {
            // map and call update mutation here if needed
            toast.success("Deal updated (mock)");
            router.push("/merchant/deals");
          }}
        />
      </div>
    </DashboardPageLayout>
  );
}
