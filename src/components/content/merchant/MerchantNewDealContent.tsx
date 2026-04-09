"use client";

import React from "react";
import CreateOrUpdateDealForm from "@/components/forms/CreateOrUpdateDealForm";
import { useRouter } from "next/navigation";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { toast } from "sonner";

export default function MerchantNewDealContent() {
  return (
    <DashboardPageLayout title="Create Deal" description="Create new deal">
      <div className="mt-6 max-w-3xl ">
        <div>
          <CreateOrUpdateDealForm isUpdate={false} />
        </div>
      </div>
    </DashboardPageLayout>
  );
}
