"use client";

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
  useLazyReadDealByStatusQuery,
  useUpdateDealMutation,
  useReadDealAdminQuery,
} from "@/services/dealService";
import { BaseUtil } from "@/utilities/baseUtil";
import { DealStatusEnum } from "@/utilities/enums/dealStatusEnum";
import { StringUtil } from "@/utilities/stringUtil";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ICellRendererParams } from "ag-grid-community";
import { StatusMap } from "@/components/custom/statusIndicator";
import StatusRenderer from "@/components/ui/datagrid/renderers/statusRenderer";
import DashboardOverviewCards, {
  DashboardOverviewCardsProps,
} from "@/components/ui/dashboardOverviewCards";
import {
  DollarSign,
  Eye,
  EyeOff,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

export default function AdminModerationContent() {
  const gridRef = useRef<BaseDataGridRef>(null);
  const [total, setTotal] = useState(0);

  const [fetchDealsByStatus] = useLazyReadDealByStatusQuery();
  const [updateDeal, { isLoading: isLoadingUpdateDealMutation }] =
    useUpdateDealMutation();
  const { data: allDealsData, isLoading: isLoadingAllDeals } = useReadDealAdminQuery();

  const confirm = useAppModal(ConfirmationModal);
  const viewDeal = useAppModal(ViewAdminDealModal);

  const handleFetchRows: BaseDataGridProps["fetchRows"] = async () => {
    const response = await fetchDealsByStatus("PENDING").unwrap();
    setTotal(response?.data?.length ?? 0);
    return {
      data: response?.data || [],
    };
  };

  // Calculate stats for PENDING deals only
  const stats = useMemo(() => {
    const allDeals = allDealsData?.data || [];
    // Filter only pending deals
    const pendingDeals = allDeals.filter(
      (d) => d.dealStatus?.toLowerCase() === "pending"
    );

    const publicPendingDeals = pendingDeals.filter(
      (d) => d.dealVisibility?.toLowerCase() === "public"
    );
    const privatePendingDeals = pendingDeals.filter(
      (d) => d.dealVisibility?.toLowerCase() === "private"
    );

    const totalAmount = pendingDeals.reduce(
      (sum, deal) => sum + (parseFloat(String(deal.dealPrice)) || 0),
      0
    );
    const totalDiscount = pendingDeals.reduce((sum, deal) => {
      const oldPrice = parseFloat(String(deal.dealOldPrice)) || 0;
      const currentPrice = parseFloat(String(deal.dealPrice)) || 0;
      return sum + (oldPrice - currentPrice);
    }, 0);

    return {
      totalPendingReview: pendingDeals.length,
      totalPublic: publicPendingDeals.length,
      totalPrivate: privatePendingDeals.length,
      totalAmount,
      totalDiscount,
    };
  }, [allDealsData?.data]);

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
      optionName: "Approve Deal",
      onClick(data, tableAction) {
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
            tableAction?.refresh();
          },
          confirmButtonProps: {
            isLoading: isLoadingUpdateDealMutation,
          },
        });
      },
    },
    {
      optionName: "Reject Deal",
      onClick(data, tableAction) {
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
            tableAction?.refresh();
          },
          confirmButtonProps: {
            isLoading: isLoadingUpdateDealMutation,
          },
        });
      },
    },
  ];

  const statsCards: DashboardOverviewCardsProps[] = [
    {
      header: "Total Pending Review",
      text: StringUtil.compact(stats.totalPendingReview),
      Icon: ShoppingBag,
    },
    {
      header: "Total Public",
      text: StringUtil.compact(stats.totalPublic),
      Icon: Eye,
    },
    {
      header: "Total Private",
      text: StringUtil.compact(stats.totalPrivate),
      Icon: EyeOff,
    },
    {
      header: "Total Amount",
      text: StringUtil.formatCurrency(String(stats.totalAmount)),
      Icon: DollarSign,
    },
    {
      header: "Total Discounts",
      text: StringUtil.formatCurrency(String(stats.totalDiscount)),
      Icon: DollarSign,
    },
  ];

  return (
    <DashboardPageLayout
      title="Moderation Queue"
      description="Approve or Reject deals"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4 mb-6">
        {statsCards.map((card, index) => (
          <DashboardOverviewCards key={index} {...card} isLoading={isLoadingAllDeals} />
        ))}
      </div>
      <div className="mt-6">
        <BaseDataGrid
          title={`${total} Pending Approval`}
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
