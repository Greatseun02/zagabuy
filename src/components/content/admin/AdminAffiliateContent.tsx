"use client";

import { BaseDataGrid, BaseDataGridProps } from "@/components/BaseDataGrid";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { ReadAllUsersResponse } from "@/models/responses/user/ReadAllUsersResponse";
import { useLazyReadUsersByRoleIdQuery } from "@/services/userService";
import { RoleEnum } from "@/utilities/enums/roleEnum";
import { useState } from "react";

export const userColumns: BaseDataGridProps["columns"] = [
  {
    id: "userFirstName" as keyof NonNullable<ReadAllUsersResponse["data"][0]>,
    header: "First Name",
    accessorKey: "userFirstName",
  },
  {
    id: "userLastName" as keyof NonNullable<ReadAllUsersResponse["data"][0]>,
    header: "Last Name",
    accessorKey: "userLastName",
  },
  {
    id: "userEmail" as keyof NonNullable<ReadAllUsersResponse["data"][0]>,
    header: "Email",
    accessorKey: "userEmail",
  },

  {
    id: "userPhoneNumber" as keyof NonNullable<ReadAllUsersResponse["data"][0]>,
    header: "Phone Number",
    accessorKey: "userPhoneNumber",
  },
  {
    id: "userStatus" as keyof NonNullable<ReadAllUsersResponse["data"][0]>,
    header: "Status",
    accessorKey: "userStatus",
  },
];

export default function AdminAffiliateContent() {
  const [fetchMerchants] = useLazyReadUsersByRoleIdQuery();
  const [affiliates, setAffiliates] = useState<any>([]);

  const fetchData: BaseDataGridProps["fetchData"] = async (params) => {
    const response = await fetchMerchants(RoleEnum.AFFILIATE).unwrap();
    const rows = response?.data || [];
    setAffiliates(rows);
    return {
      rows,
      total: rows.length,
    };
  };

  return (
    <DashboardPageLayout
      title="View all Affiliates"
      description="Manage and view all affiliates in the system."
    >
      <BaseDataGrid
        fetchData={fetchData}
        data={affiliates}
        mode="server"
        autoGenerateColumns={true}
        columns={userColumns}
      />
    </DashboardPageLayout>
  );
}
