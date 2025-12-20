"use client";

import { BaseDataGrid, BaseDataGridProps } from "@/components/BaseDataGrid";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { ReadAllUsersResponse } from "@/models/responses/user/ReadAllUsersResponse";
import { useLazyReadUsersByRoleIdQuery } from "@/services/userService";
import { RoleEnum } from "@/utilities/enums/roleEnum";
import { useState } from "react";
import { userColumns } from "./AdminAffiliateContent";

export default function AdminMerchantContent() {
  const [fetchMerchants] = useLazyReadUsersByRoleIdQuery();
  const [merchants, setMerchants] = useState<ReadAllUsersResponse["data"]>([]);

  const fetchData: BaseDataGridProps["fetchData"] = async (params) => {
    const response = await fetchMerchants(RoleEnum.MERCHANT).unwrap();
    const rows = response?.data || [];
    setMerchants(rows);
    return {
      rows,
      total: rows.length,
    };
  };

  return (
    <DashboardPageLayout
      title="View all Merchants"
      description="Manage and view all merchants in the system."
    >
      <BaseDataGrid
        fetchData={fetchData}
        data={merchants}
        mode="server"
        rowId="userId"
        columns={userColumns}
      />
    </DashboardPageLayout>
  );
}
