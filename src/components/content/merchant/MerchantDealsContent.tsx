"use client";

import { useMemo, useRef } from "react";
import {
  BaseDataGrid,
  type BaseDataGridRef,
  type BaseDataGridProps,
} from "@/components/ui/datagrid/baseDataGrid";
import {
  useDeleteDealMutation,
  useLazyReadDealByUserQuery,
  useReadDealByUserQuery,
} from "@/services/dealService";
import { useAppModal } from "@/hooks/useAppModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { ViewMerchantDealModal } from "@/components/modals/ViewMerchantDealModal";
import { UpdateMerchantDealModal } from "@/components/modals/UpdateMerchantDealModal";
import { UpdateMerchantDealVisibilityModal } from "@/components/modals/UpdateMerchantDealVisibilityModal";
import { ViewMerchantDealAnalyticsModal } from "@/components/modals/ViewMerchantDealAnalyticsModal";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { toast } from "sonner";
import { DealEntity } from "@/models/responses/dealResponse";
import Typography from "@/components/ui/typography";
import { StringUtil } from "@/utilities/stringUtil";
import {
  StatusRenderer,
  type StatusMap,
} from "@/components/ui/datagrid/renderers/statusRenderer";
import DashboardOverviewCards, {
  DashboardOverviewCardsProps,
} from "@/components/ui/dashboardOverviewCards";
import DashboardBarChart from "@/components/ui/dashboardBarChart";
import {
  PlusIcon,
  ShoppingBag,
  Eye,
  EyeOff,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { ExpiryDisplay } from "@/components/custom/countdown/ExpiryDisplay";
import { BaseUtil } from "@/utilities/baseUtil";
import { ICellRendererParams } from "ag-grid-community";
import { useRouter } from "next/navigation";
import { RouteConstant } from "@/utilities/constants/routeConstant";

export default function MerchantDealsContent() {
  const gridRef = useRef<BaseDataGridRef>(null);
  const [fetchDeals] = useLazyReadDealByUserQuery();
  const [deleteDeal] = useDeleteDealMutation();
  const { data: dealsData, isLoading: isLoadingDeals } =
    useReadDealByUserQuery();
  const router = useRouter();

  const stats = useMemo(() => {
    const deals = dealsData?.data || [];
    const totalDeals = deals.length;
    const totalActive = deals.filter(
      (d) => d.dealStatus?.toLowerCase() === "active",
    ).length;
    const totalPending = deals.filter(
      (d) => d.dealStatus?.toLowerCase() === "pending",
    ).length;
    const totalRejected = deals.filter(
      (d) =>
        d.dealStatus?.toLowerCase() === "rejected" ||
        d.dealStatus?.toLowerCase() === "deactivated",
    ).length;
    const totalPublic = deals.filter(
      (d) => d.dealVisibility?.toLowerCase() === "public",
    ).length;
    const totalPrivate = deals.filter(
      (d) => d.dealVisibility?.toLowerCase() === "private",
    ).length;
    const totalAmount = deals.reduce(
      (sum, deal) => sum + (parseFloat(String(deal.dealPrice)) || 0),
      0,
    );
    const totalDiscount = deals.reduce((sum, deal) => {
      const oldPrice = parseFloat(String(deal.dealOldPrice)) || 0;
      const currentPrice = parseFloat(String(deal.dealPrice)) || 0;
      return sum + (oldPrice - currentPrice);
    }, 0);

    return {
      totalDeals,
      totalActive,
      totalPending,
      totalRejected,
      totalPublic,
      totalPrivate,
      totalAmount,
      totalDiscount,
    };
  }, [dealsData?.data]);
  const confirm = useAppModal(ConfirmationModal);
  const viewDealModal = useAppModal(ViewMerchantDealModal);
  const updateDealModal = useAppModal(UpdateMerchantDealModal);
  const visibilityModal = useAppModal(UpdateMerchantDealVisibilityModal);
  const analyticsModal = useAppModal(ViewMerchantDealAnalyticsModal);

  const handleFetchRows: BaseDataGridProps["fetchRows"] = async () => {
    const response = await fetchDeals().unwrap();

    return {
      data: response?.data || [],
    };
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
        updateDealModal.show({
          title: `Edit "${row.dealTitle}"`,
          maxWidth: "default",
          deal: row,
          onSuccess: () => gridRef.current?.actions.refresh(),
        });
      },
    },
    delete: {
      autoRefresh: false,
      async onClick(data) {
        const row = data as unknown as DealEntity;
        confirm.show({
          maxWidth: "md",
          title: "Delete Deal",
          description: `Are you sure you want to delete the deal "${row.dealTitle}"?`,
          onConfirm: async () => {
            const res = await deleteDeal({
              dealId: row.dealId,
            }).unwrap();
            if (BaseUtil.isApiResponseSuccessful(res)) {
              toast.success("Deal deleted successfully");
              gridRef.current?.actions.refresh();
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
        viewDealModal.show({
          title: row.dealTitle,
          deal: row,
          maxWidth: "default",
        });
      },
    },
  };

  const rowOptions: BaseDataGridProps["rowOptions"] = [
    {
      optionName: "View Analytics",
      onClick(data) {
        const row = data as unknown as DealEntity;
        analyticsModal.show({
          title: `${row.dealTitle} — Analytics`,
          maxWidth: "2xl",
          deal: row,
        });
      },
    },
    {
      optionName: "Change Visibility",
      onClick(data) {
        const row = data as unknown as DealEntity;
        visibilityModal.show({
          title: `Visibility — ${row.dealTitle}`,
          maxWidth: "md",
          deal: row,
          onSuccess: () => gridRef.current?.actions.refresh(),
        });
      },
    },
  ];

  const statsCards: DashboardOverviewCardsProps[] = [
    {
      header: "Total Deals",
      text: StringUtil.compact(stats.totalDeals),
      Icon: ShoppingBag,
    },
    {
      header: "Total Active",
      text: StringUtil.compact(stats.totalActive),
      footer: `${stats.totalPending} pending`,
      Icon: TrendingUp,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((card, index) => (
          <DashboardOverviewCards
            key={index}
            {...card}
            isLoading={isLoadingDeals}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DashboardBarChart
          title="Deal Status Overview"
          description="Current distribution of your deals by approval status"
          isLoading={isLoadingDeals}
          items={[
            {
              label: "Active",
              value: stats.totalActive,
              total: stats.totalDeals || 1,
              color: "hsl(var(--success))",
            },
            {
              label: "Pending Review",
              value: stats.totalPending,
              total: stats.totalDeals || 1,
              color: "hsl(var(--warning))",
            },
            {
              label: "Rejected",
              value: stats.totalRejected,
              total: stats.totalDeals || 1,
              color: "hsl(var(--destructive))",
            },
          ]}
        />
        <DashboardBarChart
          title="Audience Reach"
          description="Proportion of your deals visible to the public vs. private"
          isLoading={isLoadingDeals}
          items={[
            {
              label: "Public",
              value: stats.totalPublic,
              total: stats.totalDeals || 1,
              color: "hsl(var(--primary))",
            },
            {
              label: "Private",
              value: stats.totalPrivate,
              total: stats.totalDeals || 1,
              color: "hsl(var(--muted-foreground))",
            },
          ]}
        />
      </div>
      <div>
        <BaseDataGrid
          ref={gridRef}
          fetchRows={handleFetchRows}
          columns={columns}
          uniqueRowId="dealId"
          colActions={colActions}
          rowOptions={rowOptions}
          autogenerateColumns={false}
          showSerialNumberColumn={false}
        />
      </div>
    </DashboardPageLayout>
  );
}
