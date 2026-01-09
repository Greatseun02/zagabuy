"use client";

import { BaseDataGrid, BaseDataGridProps } from "@/components/BaseDataGrid";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { useReadUsersByRoleIdQuery } from "@/services/userService";
import { RoleEnum } from "@/utilities/enums/roleEnum";
import { useMemo } from "react";

export const userColumns: BaseDataGridProps["columns"] = [
  {
    id: "userFirstName",
    header: "First Name",
    accessorKey: "userFirstName",
  },
  {
    id: "userLastName",
    header: "Last Name",
    accessorKey: "userLastName",
  },
  {
    id: "userEmail",
    header: "Email",
    accessorKey: "userEmail",
  },
  {
    id: "userPhoneNumber",
    header: "Phone Number",
    accessorKey: "userPhoneNumber",
  },
  {
    id: "userStatus",
    header: "Status",
    accessorKey: "userStatus",
  },
];

export default function AdminAffiliateContent() {
  const { data: response, isLoading } = useReadUsersByRoleIdQuery(
    RoleEnum.AFFILIATE
  );

  const affiliates = useMemo(() => {
    return response?.data || [];
  }, [response]);

  return (
    <DashboardPageLayout
      title="View all Affiliates"
      description="Manage and view all affiliates in the system."
    >
      <BaseDataGrid
        data={affiliates}
        mode="client"
        columns={userColumns}
        loading={isLoading}
      />
    </DashboardPageLayout>
  );
}
