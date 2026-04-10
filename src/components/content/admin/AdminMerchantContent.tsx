"use client";

import { useRef, useMemo } from "react";
import {
  BaseDataGrid,
  BaseDataGridProps,
  type BaseDataGridRef,
} from "@/components/ui/datagrid/baseDataGrid";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import {
  useLazyReadUsersByRoleIdQuery,
  useUpdateUserMutation,
} from "@/services/userService";
import { RoleEnum } from "@/utilities/enums/roleEnum";
import { UserEntity } from "@/models/responses/user/ReadAllUsersResponse";
import { UserStatusEnum } from "@/utilities/enums/appEnum";
import { BaseUtil } from "@/utilities/baseUtil";
import { toast } from "sonner";
import {
  StatusRenderer,
  type StatusMap,
} from "@/components/ui/datagrid/renderers/statusRenderer";
import { useAppModal } from "@/hooks/useAppModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

export default function AdminMerchantContent() {
  const gridRef = useRef<BaseDataGridRef>(null);
  const confirmDeactivate = useAppModal(ConfirmationModal);

  const [fetchMerchants] = useLazyReadUsersByRoleIdQuery();
  const [updateUser] = useUpdateUserMutation();

  const handleFetchRows: BaseDataGridProps["fetchRows"] = async () => {
    const response = await fetchMerchants(RoleEnum.MERCHANT).unwrap();
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

  const rowOptions: BaseDataGridProps["rowOptions"] = [
    {
      autoRefresh: false,
      optionName: "Activate Account",
      onClick: async (data, tableAction) => {
        const row = data as unknown as UserEntity;
        confirmDeactivate.show({
          title: `Activate "${row.userDisplayName}"?`,
          description:
            "This will change the account status to Active. The merchant will be able to access their account again.",
          confirmText: "Activate",
          onConfirm: async () => {
            try {
              const response = await updateUser({
                ...row,
                userStatus: UserStatusEnum.ACTIVE,
              }).unwrap();
              if (!BaseUtil.isApiResponseSuccessful(response)) {
                toast.error("Failed to activate account");
              } else {
                toast.success("Activated User Successfully.");
              }
              tableAction?.refresh();
            } catch {
              toast.error("Failed to activate account");
              tableAction?.refresh();
            }
          },
        });
      },
    },
    {
      autoRefresh: false,
      optionName: "Deactivate Account",
      onClick: async (data) => {
        const row = data as unknown as UserEntity;
        confirmDeactivate.show({
          title: `Deactivate "${row.userDisplayName}"?`,
          description:
            "This will change the account status from Active to Inactive. The merchant will no longer be able to access their account.",
          confirmText: "Deactivate",
          confirmVariant: "destructive",
          onConfirm: async () => {
            try {
              const response = await updateUser({
                ...row,
                userStatus: UserStatusEnum.INACTIVE,
              }).unwrap();
              if (!BaseUtil.isApiResponseSuccessful(response)) {
                toast.error("Failed to deactivate account");
              } else {
                toast.success("Deactivated User Successfully.");
              }
            } catch {
              toast.error("Failed to deactivate account");
            }
          },
        });
      },
    },
  ];

  return (
    <DashboardPageLayout
      title="View all Merchants"
      description="Manage and view all merchants in the system."
    >
      <div className="mt-6">
        <BaseDataGrid
          ref={gridRef}
          fetchRows={handleFetchRows}
          columns={columns}
          uniqueRowId="userId"
          autogenerateColumns={false}
          rowOptions={rowOptions}
        />
      </div>
    </DashboardPageLayout>
  );
}
