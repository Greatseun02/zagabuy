"use client";

import {
  BaseDataGrid,
  BaseDataGridRef,
  RowOption,
} from "@/components/ui/datagrid/baseDataGrid";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import {
  useReadUsersByRoleIdQuery,
  useUpdateUserMutation,
} from "@/services/userService";
import { RoleEnum } from "@/utilities/enums/roleEnum";
import { useMemo, useRef } from "react";
import { userColumns } from "./AdminAffiliateContent";
import { Trash } from "lucide-react";
import { UserEntity } from "@/models/responses/user/ReadAllUsersResponse";
import { UserStatusEnum } from "@/utilities/enums/appEnum";
import { BaseUtil } from "@/utilities/baseUtil";
import { toast } from "sonner";

export default function AdminMerchantContent() {
  const { data: response, isLoading } = useReadUsersByRoleIdQuery(
    RoleEnum.MERCHANT,
  );
  const tableRef = useRef<BaseDataGridRef>(null);

  const [updateUser] = useUpdateUserMutation();

  const handleDeactivateAccount = async (data: UserEntity) => {
    try {
      const response = await updateUser({
        ...data,
        userStatus: UserStatusEnum.INACTIVE,
      }).unwrap();
      if (!BaseUtil.isApiResponseSuccessful(response)) {
        toast.error("Failed to deactivate account");
      } else {
        toast.success("Deactivated User Successfully.");
      }

      tableRef.current?.refetch();
    } catch (e) {
      toast.error("Failed to deactivate account");
    }
  };

  const merchants = useMemo(() => {
    return response?.data || [];
  }, [response]);

  const rowOptions: RowOption[] = [
    {
      label: "Deactivate Account",
      icon: Trash,
      onClick: (rowData: UserEntity) => handleDeactivateAccount(rowData),
      danger: true,
    },
  ];

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
        rowOptions={rowOptions}
      />
    </DashboardPageLayout>
  );
}
