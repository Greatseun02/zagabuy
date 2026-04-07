"use client";

import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import EditMerchantProfileForm from "./forms/EditMerchantProfileForm";

export default function MerchantProfileContent() {
  return (
    <DashboardPageLayout
      title="Merchant Profile"
      subtitle="Manage and update your merchant account information"
    >
      <EditMerchantProfileForm />
    </DashboardPageLayout>
  );
}
