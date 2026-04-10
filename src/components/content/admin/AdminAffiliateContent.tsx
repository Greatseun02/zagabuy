"use client";

import { useRef, useMemo } from "react";
import { useLazyReadUsersByRoleIdQuery } from "@/services/userService";
import { RoleEnum } from "@/utilities/enums/roleEnum";
import {
  BaseDataGrid,
  BaseDataGridProps,
  type BaseDataGridRef,
} from "@/components/ui/datagrid/baseDataGrid";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import {
  StatusRenderer,
  type StatusMap,
} from "@/components/ui/datagrid/renderers/statusRenderer";

export default function AdminAffiliateContent() {
  const gridRef = useRef<BaseDataGridRef>(null);

  const [fetchAffiliates] = useLazyReadUsersByRoleIdQuery();

  const handleFetchRows: BaseDataGridProps["fetchRows"] = async () => {
    const response = await fetchAffiliates(RoleEnum.AFFILIATE).unwrap();
    return {
      data: response?.data || [],
    };
  };

  const columns: BaseDataGridProps["columns"] = useMemo(
    () => [
      {
        field: "userFirstName",
        headerName: "First Name",
      },
      {
        field: "userLastName",
        headerName: "Last Name",
      },
      {
        field: "userEmail",
        headerName: "Email",
      },
      {
        field: "userPhoneNumber",
        headerName: "Phone Number",
      },
      {
        field: "userStatus",
        headerName: "Status",
        cellRenderer: StatusRenderer,
        cellRendererParams: {
          statusMap: {
            active: {
              color: "hsl(var(--success))",
              backgroundColor:
                "color-mix(in srgb, hsl(var(--success)) 10%, transparent)",
              label: "Active",
            },
            inactive: {
              color: "hsl(var(--muted-foreground))",
              backgroundColor:
                "color-mix(in srgb, hsl(var(--muted-foreground)) 10%, transparent)",
              label: "Inactive",
            },
          } satisfies StatusMap,
          className: "py-1.5 px-6 text-xs",
        },
      },
    ],
    [],
  );

  return (
    <DashboardPageLayout
      title="View all Affiliates"
      description="Manage and view all affiliates in the system."
    >
      <div className="mt-6">
        <BaseDataGrid
          ref={gridRef}
          fetchRows={handleFetchRows}
          columns={columns}
          uniqueRowId="userId"
          autogenerateColumns={false}
        />
      </div>
    </DashboardPageLayout>
  );
}
