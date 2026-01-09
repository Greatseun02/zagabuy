"use client";

import { BaseDataGrid } from "@/components/BaseDataGrid";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { useReadUsersByRoleIdQuery } from "@/services/userService";
import { RoleEnum } from "@/utilities/enums/roleEnum";
import { useMemo } from "react";
import { userColumns } from "./AdminAffiliateContent";

export default function AdminMerchantContent() {
  const { data: response, isLoading } = useReadUsersByRoleIdQuery(
    RoleEnum.MERCHANT
  );

  const merchants = useMemo(() => {
    return response?.data || [];
  }, [response]);

  return (
    <DashboardPageLayout
      title="View all Merchants"
      description="Manage and view all merchants in the system."
    >
      <BaseDataGrid
        data={merchants}
        mode="client"
        rowId="userId"
        columns={userColumns}
        loading={isLoading}
      />
    </DashboardPageLayout>
  );
}
