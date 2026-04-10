"use client";

import BaseDataGrid, {
  BaseDataGridProps,
  BaseDataGridRef,
} from "@/components/ui/datagrid/baseDataGrid";
import { ExpiryDisplay } from "@/components/custom/countdown/ExpiryDisplay";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import Typography from "@/components/ui/typography";
import { useAppModal } from "@/hooks/useAppModal";
import { DealEntity } from "@/models/responses/dealResponse";
import {
  useReadDealByStatusQuery,
  useReadDealQuery,
  useUpdateDealMutation,
} from "@/services/dealService";
import { BaseUtil } from "@/utilities/baseUtil";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import { DealStatusEnum } from "@/utilities/enums/dealStatusEnum";
import { StringUtil } from "@/utilities/stringUtil";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ColumnType } from "@/components/ui/datagrid/types";

export default function AdminModerationContent() {
  const gridRef = useRef<BaseDataGridRef>(null);

  const {
    data: response,
    isLoading,
    refetch,
  } = useReadDealByStatusQuery("PENDING");

  const [updateDeal, { isLoading: isLoadingUpdateDealMutation }] =
    useUpdateDealMutation();

  const confirm = useAppModal(ConfirmationModal);
  const router = useRouter();

  const columns: ColumnType[] = [
    {
      field: "dealImageUrl",
      headerName: "Image",
      cellRenderer: (row: DealEntity) => (
        <div className="w-12 h-12 overflow-hidden rounded-md">
          <img
            src={`${row.dealUrl}`}
            alt="Deal Image"
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      field: "dealTitle",
      headerName: "Deal",
      cellRenderer: (row: DealEntity) => (
        <div>
          <Typography weight="medium">{row.dealTitle}</Typography>
          <Typography size="sm" color="muted-foreground">
            {row.dealDescription}
          </Typography>
        </div>
      ),
    },
    {
      field: "dealPrice",
      headerName: "Price",
      isCurrency: true,
      cellRenderer: (row: DealEntity) => (
        <div>
          <Typography weight="semibold">
            {StringUtil.formatCurrency(String(row.dealPrice))}
          </Typography>
          <Typography
            weight="regular"
            color="muted-foreground"
            className="line-through leading-0 mt-2"
            size="xs"
          >
            {StringUtil.formatCurrency(String(row.dealOldPrice))}
          </Typography>
        </div>
      ),
    },
    {
      field: "dealExpiryDate",
      headerName: "Expiry Date",
      isDate: true,
      cellRenderer: (row: DealEntity) => (
        <ExpiryDisplay expiresAt={row.dealExpiryDate} />
      ),
    },
    {
      field: "dealVisibility",
      headerName: "Visibility",
      cellRenderer: (row: DealEntity) => (
        <Typography
          className="px-2 py-1 rounded-md text-center font-medium text-xs"
          color={row.dealVisibility === "PUBLIC" ? "success" : "warning"}
          style={{
            backgroundColor:
              row.dealVisibility === "PUBLIC" ? "#dcfce7" : "#fef3c7",
          }}
        >
          {row.dealVisibility === "PUBLIC" ? "Public" : "Private"}
        </Typography>
      ),
    },
    {
      field: "dealStatus",
      headerName: "Status",
      cellRenderer: (row: DealEntity) => {
        const status = row.dealStatus;
        return (
          <Typography
            color={
              status === "ACTIVE"
                ? "success"
                : status === "PENDING"
                  ? "warning"
                  : status === "REJECTED"
                    ? "error"
                    : "primary"
            }
            className={`${
              status === "ACTIVE"
                ? "bg-green-100"
                : status === "PENDING"
                  ? "bg-orange-100"
                  : status === "REJECTED"
                    ? "bg-red-100"
                    : ""
            } px-2 text-center`}
          >
            {status}
          </Typography>
        );
      },
    },
  ];

  const colActions: BaseDataGridProps["colActions"] = {
    view: {
      onClick(row) {
        router.push(`${RouteConstant.deals.path}/${row.dealId}`);
      },
    },
  };

  const rowOptions: BaseDataGridProps["rowOptions"] = [
    {
      optionName: "Approve Deal",
      onClick(data) {
        const row = data as unknown as DealEntity;
        confirm.show({
          title: "Approve Deal",
          description:
            "Are you sure you want to approve this deal? This action cannot be undone.",
          onConfirm: async () => {
            const response = await updateDeal({
              dealId: row.dealId,
              dealStatus: DealStatusEnum.ACTIVE,
            }).unwrap();

            if (BaseUtil.isApiResponseSuccessful(response)) {
              toast.success(
                response?.responseMessage || "Approved Deal Successfully.",
              );
            }
          },
          confirmButtonProps: {
            isLoading: isLoadingUpdateDealMutation,
          },
        });
      },
    },
    {
      optionName: "Reject Deal",
      onClick(data) {
        const row = data as unknown as DealEntity;
        confirm.show({
          maxWidth: "sm",
          title: "Reject Deal",
          description:
            "Are you sure you want to reject this deal? This action cannot be undone.",
          onConfirm: async () => {
            const response = await updateDeal({
              dealId: row.dealId,
              dealStatus: DealStatusEnum.REJECTED,
            }).unwrap();

            if (BaseUtil.isApiResponseSuccessful(response)) {
              toast.success(
                response?.responseMessage || "Rejected Deal Successfully.",
              );
            }
          },
          confirmButtonProps: {
            isLoading: isLoadingUpdateDealMutation,
          },
        });
      },
    },
  ];

  return (
    <DashboardPageLayout
      title="Moderation Queue"
      description="Approve or Reject deals"
    >
      <div className="mt-6">
        <BaseDataGrid
          ref={gridRef}
          rows={response?.data || []}
          columns={columns}
          uniqueRowId="dealId"
          paginationMode="client"
          isLoading={isLoading}
          colActions={colActions}
          rowOptions={rowOptions}
        />
      </div>
    </DashboardPageLayout>
  );
}
