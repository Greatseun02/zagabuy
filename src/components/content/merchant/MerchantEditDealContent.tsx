"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useReadDealByDealIdQuery,
  useReadDealQuery,
} from "@/services/dealService";
import NotFound from "@/components/ui/NotFound";
import CreateOrUpdateDealForm from "@/components/forms/CreateOrUpdateDealForm";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { toast } from "sonner";
import Loader from "@/components/ui/loader";

export default function MerchantEditDealContent() {
  const params = useParams();
  const router = useRouter();
  const dealId = params?.dealId ?? "";

  const { data, isLoading } = useReadDealByDealIdQuery(dealId as string);

  if (isLoading) {
    return <Loader />;
  }

  if (!data?.data) {
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
    <DashboardPageLayout
      title={`Edit Deal`}
      description="Edit deal information."
    >
      <div className="mt-6 max-w-6xl mx-auto">
        <CreateOrUpdateDealForm
          title={`Edit ${data?.data?.dealTitle}`}
          isUpdate
          initialValues={{
            ...data?.data,
            dealImagesUrl: data?.data?.dealImages,
          }}
        />
      </div>
    </DashboardPageLayout>
  );
}
