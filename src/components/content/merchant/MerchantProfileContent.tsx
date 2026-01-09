"use client";

import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import EditMerchantProfileForm from "./forms/EditMerchantProfileForm";

export default function MerchantProfileContent() {
  return (
    <DashboardPageLayout>
      <EditMerchantProfileForm />
    </DashboardPageLayout>
  );
}
