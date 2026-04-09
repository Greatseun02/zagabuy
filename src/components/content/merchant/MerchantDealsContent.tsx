"use client";

import React, { useMemo, useRef } from "react";
import {
  BaseDataGrid,
  type BaseDataGridRef,
  type BaseDataGridProps,
} from "@/components/ui/datagrid/baseDataGrid";
import { ColumnType } from "@/components/ui/datagrid/types";
import {
  useDeleteDealMutation,
  useLazyReadDealByUserQuery,
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
import {
  StatusRenderer,
  type StatusMap,
} from "@/components/ui/datagrid/renderers/statusRenderer";

import { PlusIcon } from "lucide-react";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import { ExpiryDisplay } from "@/components/custom/countdown/ExpiryDisplay";
import { BaseUtil } from "@/utilities/baseUtil";
import { ICellRendererParams } from "ag-grid-community";

export default function MerchantDealsContent() {
  const gridRef = useRef<BaseDataGridRef>(null);
  // const { data: response, isLoading, refetch } = useReadDealByUserQuery();
  const [fetchDeals] = useLazyReadDealByUserQuery();
  const [deleteDeal] = useDeleteDealMutation();
  const confirm = useAppModal(ConfirmationModal);
  const router = useRouter();

  const handleFetchRows: BaseDataGridProps["fetchRows"] = async () => {
    const response = await fetchDeals().unwrap();

    return {
      data: response?.data || [],
    };
  };

  const columns: BaseDataGridProps["columns"] = useMemo(
    () => [
      {
        field: "dealImages",
        headerName: "Image",
        cellRenderer: (params: ICellRendererParams) => {
          const urls = params.value as string[];
          return (
            <div className="w-16 h-10 overflow-hidden rounded-md">
              <img
                src={urls?.[0]}
                alt="Deal Image"
                className="w-full h-full object-cover"
              />
            </div>
          );
        },
      },
      {
        field: "dealTitle",
        headerName: "Deal",
        cellRenderer: (params: ICellRendererParams) => {
          const row = params.data as DealEntity;
          return (
            <div>
              <Typography weight="medium">{row.dealTitle}</Typography>
              <Typography size="sm" color="muted-foreground">
                {row.dealDescription}
              </Typography>
            </div>
          );
        },
      },
      {
        field: "dealPrice",
        headerName: "Price",
        cellRenderer: (params: ICellRendererParams) => {
          const row = params.data as DealEntity;
          return (
            <div className="py-4">
              <Typography weight="semibold">
                {StringUtil.formatCurrency(String(row?.dealPrice))}
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
          );
        },
      },
      {
        field: "dealExpiryDate",
        headerName: "Expiry Date",
        cellRenderer: (params: ICellRendererParams) => {
          return <ExpiryDisplay expiresAt={params.value as string} />;
        },
      },
      {
        field: "dealVisibility",
        headerName: "Visibility",
        cellRenderer: (params: ICellRendererParams) => (
          <StatusRenderer
            statusMap={
              {
                public: {
                  color: "hsl(var(--success))",
                  backgroundColor:
                    "color-mix(in srgb, hsl(var(--success)) 10%, transparent)",
                  label: "Public",
                },
                private: {
                  color: "hsl(var(--warning))",
                  backgroundColor:
                    "color-mix(in srgb, hsl(var(--warning)) 10%, transparent)",
                  label: "Private",
                },
              } satisfies StatusMap
            }
            className="py-1.5 px-6 text-xs"
            {...params}
          />
        ),
      },
      {
        field: "dealStatus",
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
            pending: {
              color: "hsl(var(--warning))",
              backgroundColor:
                "color-mix(in srgb, hsl(var(--warning)) 10%, transparent)",
              label: "Pending",
            },
            rejected: {
              color: "hsl(var(--destructive))",
              backgroundColor:
                "color-mix(in srgb, hsl(var(--destructive)) 10%, transparent)",
              label: "Rejected",
            },
          } satisfies StatusMap,
          className: "py-1.5 px-6 text-xs",
        },
      },
    ],
    [],
  );

  const colActions: BaseDataGridProps["colActions"] = {
    edit: {
      autoRefresh: false,
      onClick(data) {
        const row = data as unknown as DealEntity;
        router.push(
          `${RouteConstant.merchant.deals.editDeal.path}/${row.dealId}`,
        );
      },
    },
    delete: {
      autoRefresh: false,
      async onClick(data) {
        const row = data as unknown as DealEntity;
        confirm.show({
          title: "Delete Deal",
          description: `Are you sure you want to delete the deal "${row.dealTitle}"?`,
          onConfirm: async () => {
            const res = await deleteDeal({
              dealId: row.dealId,
            }).unwrap();
            if (BaseUtil.isApiResponseSuccessful(res)) {
              toast.success("Deal deleted successfully");
            }
            confirm.hide();
          },
          onCancel() {
            confirm.hide();
          },
        });
      },
    },
    view: {
      autoRefresh: false,
      onClick(data) {
        const row = data as unknown as DealEntity;
        router.push(
          `${RouteConstant.merchant.deals.viewDeal.path}/${row.dealId}`,
        );
      },
    },
  };

  const rowOptions: BaseDataGridProps["rowOptions"] = [
    {
      optionName: "View Analytics",
      onClick(data) {
        const row = data as unknown as DealEntity;
        router.push(
          `${RouteConstant.merchant.deals.viewDealAnalytics.path}/${row.dealId}`,
        );
      },
    },
    {
      optionName: "Change Visibility",
      onClick(data) {
        console.log("click");
      },
    },
  ];

  return (
    <DashboardPageLayout
      title="My Deals"
      description="Manage your deals"
      actionConfigs={[
        {
          text: "Create Deal",
          startIcon: <PlusIcon />,
          onClick: () =>
            router.push(RouteConstant.merchant.deals.createDeal.path),
        },
      ]}
    >
      <div className="mt-6">
        <BaseDataGrid
          ref={gridRef}
          fetchRows={handleFetchRows}
          columns={columns}
          uniqueRowId="dealId"
          paginationMode="client"
          colActions={colActions}
          rowOptions={rowOptions}
          autogenerateColumns={false}
          showSerialNumberColumn={false}
        />
      </div>
    </DashboardPageLayout>
  );
}
