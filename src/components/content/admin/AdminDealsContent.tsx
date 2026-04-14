"use client";

import { useRef, useMemo, useState } from "react";
import {
  BaseDataGrid,
  BaseDataGridProps,
  type BaseDataGridRef,
} from "@/components/ui/datagrid/baseDataGrid";
import { ExpiryDisplay } from "@/components/custom/countdown/ExpiryDisplay";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { ViewAdminDealModal } from "@/components/modals/ViewAdminDealModal";
import Typography from "@/components/ui/typography";
import { useAppModal } from "@/hooks/useAppModal";
import { DealEntity } from "@/models/responses/dealResponse";
import {
  useUpdateDealMutation,
  useDeleteDealMutation,
  useLazyReadDealAdminQuery,
} from "@/services/dealService";
import { BaseUtil } from "@/utilities/baseUtil";
import { DealStatusEnum } from "@/utilities/enums/dealStatusEnum";
import {
  StatusRenderer,
  type StatusMap,
} from "@/components/ui/datagrid/renderers/statusRenderer";
import { StringUtil } from "@/utilities/stringUtil";
import { toast } from "sonner";
import { ICellRendererParams } from "ag-grid-community";

export default function AdminDealsContent() {
  const gridRef = useRef<BaseDataGridRef>(null);
  const [total, setTotal] = useState(0);

  const [fetchDealsAdmin] = useLazyReadDealAdminQuery();
  const [updateDeal] = useUpdateDealMutation();
  const [deleteDeal] = useDeleteDealMutation();

  const confirm = useAppModal(ConfirmationModal);
  const viewDeal = useAppModal(ViewAdminDealModal);

  const handleFetchRows: BaseDataGridProps["fetchRows"] = async () => {
    const deals = (await fetchDealsAdmin().unwrap())?.data;

    setTotal(deals?.length ?? 0);

    return { data: deals || [] };
  };

  const columns: BaseDataGridProps["columns"] = useMemo(
    () => [
      {
        field: "dealId",
        headerName: "ID",
      },
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
        cellRenderer: StatusRenderer,
        cellRendererParams: {
          statusMap: {
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
          } satisfies StatusMap,
          className: "py-1.5 px-6 text-xs",
        },
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
    view: {
      onClick(row) {
        const deal = row as unknown as DealEntity;
        viewDeal.show({
          title: deal.dealTitle,
          maxWidth: "default",
          deal: { ...deal },
        });
      },
    },
  };

  const rowOptions: BaseDataGridProps["rowOptions"] = [
    {
      optionName: "Activate Deal",
      onClick(data, tableAction) {
        const row = data as unknown as DealEntity;
        confirm.show({
          title: `Activate "${row.dealTitle}"?`,
          description:
            "This will set the deal status to Active. The deal will be visible to users.",
          confirmText: "Activate",
          onConfirm: async () => {
            try {
              const response = await updateDeal({
                dealId: row.dealId,
                dealStatus: DealStatusEnum.ACTIVE,
              }).unwrap();
              if (BaseUtil.isApiResponseSuccessful(response)) {
                toast.success(
                  response?.responseMessage || "Activated Deal Successfully.",
                );
              }
              tableAction?.refresh();
            } catch {
              toast.error("Failed to activate deal");
              tableAction?.refresh();
            }
          },
        });
      },
    },
    {
      optionName: "Deactivate Deal",
      onClick(data, tableAction) {
        const row = data as unknown as DealEntity;
        confirm.show({
          title: `Deactivate "${row.dealTitle}"?`,
          description:
            "This will set the deal status to Rejected. The deal will no longer be visible to users.",
          confirmText: "Deactivate",
          confirmVariant: "destructive",
          onConfirm: async () => {
            try {
              const response = await updateDeal({
                dealId: row.dealId,
                dealStatus: DealStatusEnum.REJECTED,
              }).unwrap();
              if (BaseUtil.isApiResponseSuccessful(response)) {
                toast.success(
                  response?.responseMessage || "Deactivated Deal Successfully.",
                );
              }
              tableAction?.refresh();
            } catch {
              toast.error("Failed to deactivate deal");
              tableAction?.refresh();
            }
          },
        });
      },
    },
    {
      optionName: "Delete Deal",
      onClick(data, tableAction) {
        const row = data as unknown as DealEntity;
        confirm.show({
          title: `Delete "${row.dealTitle}"?`,
          description:
            "This action cannot be undone. All data associated with this deal will be permanently removed.",
          confirmText: "Delete",
          confirmVariant: "destructive",
          onConfirm: async () => {
            try {
              const response = await deleteDeal({
                dealId: row.dealId,
              }).unwrap();
              if (BaseUtil.isApiResponseSuccessful(response)) {
                toast.success(
                  response?.responseMessage || "Deleted Deal Successfully.",
                );
              }
              tableAction?.refresh();
            } catch {
              toast.error("Failed to delete deal");
              tableAction?.refresh();
            }
          },
        });
      },
    },
  ];

  return (
    <DashboardPageLayout
      title="Deals"
      description="Manage and view all deals in the system."
    >
      <div className="mt-6">
        <BaseDataGrid
          title={`${total} Total Deals`}
          ref={gridRef}
          fetchRows={handleFetchRows}
          columns={columns}
          uniqueRowId="dealId"
          autogenerateColumns={false}
          colActions={colActions}
          rowOptions={rowOptions}
        />
      </div>
    </DashboardPageLayout>
  );
}
