"use client";

import {
  BaseDataGrid,
  BaseDataGridProps,
  BaseDataGridRef,
} from "@/components/BaseDataGrid";
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

  const columns: BaseDataGridProps["columns"] = [
    {
      id: "dealImageUrl" as keyof DealEntity,
      accessorKey: "dealImageUrl" as keyof DealEntity,
      header: "Image",
      cell(props) {
        const url = props.getValue<string>();
        return (
          <div className="w-12 h-12 overflow-hidden rounded-md ">
            <img
              src={`${url}`}
              alt="Deal Image"
              className="w-full h-full object-cover"
            />
          </div>
        );
      },
    },
    {
      id: "deal",
      accessorKey: "deal",
      header: "Deal",
      cell(props) {
        const title = props.row.original.dealTitle;
        const description = props.row.original.dealDescription;
        return (
          <div>
            <Typography weight="medium">{title}</Typography>
            <Typography size="sm" color="muted-foreground">
              {description}
            </Typography>
          </div>
        );
      },
    },
    {
      id: "price",
      accessorKey: "price",
      header: "Price",
      cell(props) {
        const oldPrice = props.row.original.dealOldPrice;
        const newPrice = props.row.original.dealPrice;

        return (
          <div>
            <Typography weight="semibold">
              {StringUtil.formatCurrency(newPrice)}
            </Typography>
            <Typography
              weight="regular"
              color="muted-foreground"
              className="line-through leading-0 mt-2"
              size="xs"
            >
              {StringUtil.formatCurrency(oldPrice)}
            </Typography>
          </div>
        );
      },
    },

    {
      id: "dealExpiryDate" as keyof DealEntity,
      accessorKey: "dealExpiryDate" as keyof DealEntity,
      header: "Expiry Date",
      cell(props) {
        const expiry = props.getValue();
        return <ExpiryDisplay expiresAt={expiry as string} />;
      },
    },
    {
      id: "dealVisibility",
      accessorKey: "dealVisibility",
      header: "Visibility",
      cell(props) {
        const visibility = props.getValue<"PUBLIC" | "PRIVATE">();
        return (
          <Typography
            className="px-2 py-1 rounded-md text-center font-medium text-xs"
            color={visibility === "PUBLIC" ? "success" : "warning"}
            style={{
              backgroundColor: visibility === "PUBLIC" ? "#dcfce7" : "#fef3c7",
            }}
          >
            {visibility === "PUBLIC" ? "Public" : "Private"}
          </Typography>
        );
      },
    },
    {
      id: "status",
      accessorKey: "dealStatus",
      header: "Status",
      cell(props) {
        const status = props.getValue<"PENDING" | "ACTIVE" | "REJECTED">();

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
      label: "Approve Deal",
      icon: CheckCircle,
      onClick(row) {
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
                response?.responseMessage || "Approved Deal Successfully."
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
      label: "Reject Deal",
      icon: XCircle,
      onClick(row) {
        confirm.show({
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
                response?.responseMessage || "Rejected Deal Successfully."
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
          data={response?.data || []}
          columns={columns}
          rowId="dealId"
          pageSizeOptions={[10, 25]}
          onRefresh={refetch}
          mode="client"
          loading={isLoading}
          colActions={colActions}
          rowOptions={rowOptions}
        />
      </div>
    </DashboardPageLayout>
  );
}
