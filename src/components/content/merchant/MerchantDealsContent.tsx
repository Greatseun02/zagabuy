"use client";

import React, { useMemo, useRef } from "react";
import {
  BaseDataGrid,
  BaseDataGridProps,
  type BaseDataGridRef,
} from "@/components/BaseDataGrid";
import {
  useDeleteDealMutation,
  useReadDealByUserQuery,
} from "@/services/dealService";
import { useAppModal } from "@/hooks/useAppModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DealEntity } from "@/models/responses/dealResponse";
import Typography from "@/components/ui/typography";
import { StringUtil } from "@/utilities/stringUtil";

import { BarChart2, Globe } from "lucide-react";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import { ExpiryDisplay } from "@/components/custom/countdown/ExpiryDisplay";
import { CreateDealRequest } from "@/models/requests/dealRequest";
import { BaseUtil } from "@/utilities/baseUtil";

export default function MerchantDealsContent() {
  const gridRef = useRef<BaseDataGridRef>(null);
  // const [filter, setFilter] = useState<Record<string, string>>({})
  // const { data: response, isLoading, refetch } = useReadDealQuery({item: filter.item});
  const { data: response, isLoading, refetch } = useReadDealByUserQuery();
  const [deleteDeal] = useDeleteDealMutation();
  const confirm = useAppModal(ConfirmationModal);
  const router = useRouter();

  const columns: BaseDataGridProps["columns"] = [
    {
      id: "dealImages" as keyof DealEntity,
      accessorKey: "dealImages" as keyof DealEntity,
      header: "Image",
      cell(props) {
        const url = props.getValue<string[]>();
        return (
          <div className="w-12 h-12 overflow-hidden rounded-md ">
            <img
              src={`${url[0]}`}
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
      id: "dealVisibility" as keyof CreateDealRequest,
      accessorKey: "dealVisibility" as keyof CreateDealRequest,
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
    edit: {
      onClick(row: DealEntity) {
        router.push(
          `${RouteConstant.merchant.deals.editDeal.path}/${row.dealId}`
        );
      },
    },
    delete: {
      onClick(row) {
        confirm.show({
          title: "Delete Deal",
          description: `Are you sure you want to delete the deal "${row.dealTitle}"?`,
          onConfirm: async () => {
            const response = await deleteDeal({
              dealId: row.dealId,
            }).unwrap();
            if (BaseUtil.isApiResponseSuccessful(response)) {
              toast.success("Deal deleted successfully");
            }
            refetch();
            confirm.hide();
          },
          onCancel() {
            confirm.hide();
          },
        });
      },
    },
    view: {
      onClick(row) {
        router.push(
          `${RouteConstant.merchant.deals.viewDeal.path}/${row.dealId}`
        );
      },
    },
  };

  const rowOptions: BaseDataGridProps["rowOptions"] = [
    {
      label: "View Analytics",
      icon: BarChart2,
      onClick(row) {
        router.push(
          `${RouteConstant.merchant.deals.viewDealAnalytics.path}/${row.dealId}`
        );
      },
    },
    {
      label: "Change Visibility",
      icon: Globe,
      onClick(row) {
        console.log("click");
      },
    },
  ];

  return (
    <DashboardPageLayout title="My Deals" description="Manage your deals">
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
