"use client";

import React from "react";
import CreateOrUpdateDealForm from "@/components/forms/CreateOrUpdateDealForm";
import { useRouter } from "next/navigation";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { toast } from "sonner";
import Typography from "@/components/ui/typography";

export default function MerchantNewDealContent() {
  return (
    <DashboardPageLayout title="Create Deal" description="Create new deal">
      <div className="mt-6 max-w-6xl mx-auto">
        <CreateOrUpdateDealForm isUpdate={false} title="Create New Deal" />
      </div>
    </DashboardPageLayout>
  );
}
