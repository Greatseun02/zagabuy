"use client";

import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import DashboardOverviewCards, {
  DashboardOverviewCardsProps,
} from "@/components/ui/dashboardOverviewCards";
import DashboardBarChart from "@/components/ui/dashboardBarChart";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import {
  ClipboardCheck,
  Clock,
  Clock3,
  DollarSign,
  LucideIcon,
  MousePointerClick,
  ShoppingBag,
  ShoppingBagIcon,
  Store,
  TrendingUpIcon,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardPerformanceStatsCard, {
  DashboardPerformanceStatsCardProps,
} from "./cards/DashboardPerformanceStatsCard";
import RecentActivityItem, {
  RecentActivityItemProps,
} from "@/components/custom/RecentActivityItem";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ReactNode, useMemo } from "react";
import Typography from "@/components/ui/typography";
import { useReadAuditLogQuery } from "@/services/auditLogService";
import { TimeUtil } from "@/utilities/timeUtil";
import { StringUtil } from "@/utilities/stringUtil";
import { useReadAdminDashboardQuery } from "@/services/adminDashboardService";
import {
  useReadDealAdminQuery,
  useReadDealByStatusQuery,
  useReadDealQuery,
} from "@/services/dealService";

export default function AdminDashboardContent() {
  const { data: adminDashboardData, isLoading: isLoadingAdminDashboard } =
    useReadAdminDashboardQuery();
  const { data: deals, isLoading: isLoadingDeals } = useReadDealAdminQuery();
  const { data: recentActivities, isLoading: isLoadingAuditLogs } =
    useReadAuditLogQuery();

  const { data } = useReadDealByStatusQuery("a");

  const pendingReviews = useMemo(() => {
    return adminDashboardData?.data?.[0]?.totalPending;
    // return deals?.data?.filter(
    //   (deal) => deal.dealStatus.toLowerCase().trim() === "pending",
    // ).length;
  }, [deals?.data]);

  const dashboardStats = useMemo(() => {
    const allDeals = deals?.data || [];

    const totalAmount = allDeals.reduce(
      (sum, deal) => sum + (parseFloat(String(deal.dealPrice)) || 0),
      0,
    );

    const totalDiscount = allDeals.reduce((sum, deal) => {
      const oldPrice = parseFloat(String(deal.dealOldPrice)) || 0;
      const currentPrice = parseFloat(String(deal.dealPrice)) || 0;
      return sum + (oldPrice - currentPrice);
    }, 0);

    // Status breakdown
    const totalActive = allDeals.filter(
      (d) => d.dealStatus?.toLowerCase() === "active",
    ).length;
    const totalPending = allDeals.filter(
      (d) => d.dealStatus?.toLowerCase() === "pending",
    ).length;
    const totalDeactivated = allDeals.filter(
      (d) =>
        d.dealStatus?.toLowerCase() === "deactivated" ||
        d.dealStatus?.toLowerCase() === "rejected",
    ).length;

    // Visibility breakdown
    const totalPublic = allDeals.filter(
      (d) => d.dealVisibility?.toLowerCase() === "public",
    ).length;
    const totalPrivate = allDeals.filter(
      (d) => d.dealVisibility?.toLowerCase() === "private",
    ).length;

    // Top merchants by deal count
    const merchantDealCount: {
      [key: string]: { name: string; count: number };
    } = {};
    allDeals.forEach((deal) => {
      const merchantName = deal.userDisplayName || "N/A";
      if (merchantDealCount[merchantName]) {
        merchantDealCount[merchantName].count += 1;
      } else {
        merchantDealCount[merchantName] = { name: merchantName, count: 1 };
      }
    });

    const sortedMerchants = Object.values(merchantDealCount).sort(
      (a, b) => b.count - a.count,
    );
    const topMerchant = sortedMerchants[0];
    const top5Merchants = sortedMerchants.slice(0, 5);

    return {
      totalAmount,
      totalDiscount,
      topMerchant: topMerchant?.name || "N/A",
      topMerchantDeals: topMerchant?.count || 0,
      statusBreakdown: { totalActive, totalPending, totalDeactivated },
      visibilityBreakdown: { totalPublic, totalPrivate },
      top5Merchants,
    };
  }, [deals?.data]);

  const dashboardOverviewCardsConfig: DashboardOverviewCardsProps[] = [
    {
      header: "Total Deals",
      text: isLoadingDeals
        ? "Loading..."
        : StringUtil.compact(deals?.data?.length || 0),
      Icon: ShoppingBag,
    },
    {
      header: "Total Active Deals",
      text: isLoadingAdminDashboard
        ? "Loading..."
        : adminDashboardData?.data &&
          StringUtil.compact(dashboardStats.statusBreakdown.totalActive),

      Icon: ShoppingBag,
    },
    {
      header: "Pending Review",
      text: isLoadingAdminDashboard
        ? "Loading..."
        : StringUtil.compact(adminDashboardData?.data?.[0]?.totalPending || 0),
      Icon: Clock,
    },
    {
      header: "Rejected Deals",
      text: isLoadingDeals
        ? "Loading..."
        : StringUtil.compact(dashboardStats.statusBreakdown.totalDeactivated),
      Icon: ShoppingBag,
    },
    {
      header: "Total Merchants",
      text: isLoadingAdminDashboard
        ? "Loading..."
        : adminDashboardData?.data?.[0].totalMerchants &&
          StringUtil.compact(adminDashboardData?.data?.[0].totalMerchants),
      Icon: Store,
    },
    {
      header: "Total Amount",
      text: isLoadingDeals
        ? "Loading..."
        : StringUtil.formatCurrency(String(dashboardStats.totalAmount)),
      Icon: DollarSign,
    },
    {
      header: "Total Discounts",
      text: isLoadingDeals
        ? "Loading..."
        : StringUtil.formatCurrency(String(dashboardStats.totalDiscount)),
      Icon: DollarSign,
    },
    {
      header: "Top Merchant",
      text: isLoadingDeals ? "Loading..." : dashboardStats.topMerchant,
      footer: `${dashboardStats.topMerchantDeals} deals`,
      Icon: Store,
    },
  ];

  const quickActions: {
    title: string;
    description: string;
    icon: LucideIcon;
    link: string;
  }[] = [
    {
      title: "Review Pending Deals",
      description: `${pendingReviews || 0} deal awaiting approval`,
      icon: Clock3,
      link: RouteConstant.admin.moderation.path,
    },
    {
      title: "Manage Merchants",
      description: "View and manage merchant accounts",
      icon: Store,
      link: RouteConstant.admin.merchants.path,
    },
    {
      title: "Browse All Deals",
      description: "View and manage platform deals",
      icon: ShoppingBagIcon,
      link: RouteConstant.admin.moderation.path,
    },
  ];

  const router = useRouter();

  return (
    <DashboardPageLayout
      title="Admin Dashboard"
      description="Platform overview and management"
      actionConfigs={[
        {
          text: `Review Queue ${pendingReviews || 0}`,
          startIcon: <ClipboardCheck />,
          variant: "primary",
          size: "medium",
          onClick() {
            router.push(RouteConstant.admin.moderation.path);
          },
        },
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {dashboardOverviewCardsConfig.map((config, index) => (
          <DashboardOverviewCards
            key={index}
            {...config}
            isLoading={isLoadingAdminDashboard || isLoadingDeals}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardBarChart
          title="Deal Status Overview"
          description="Distribution of deals across all lifecycle stages"
          isLoading={isLoadingDeals}
          items={[
            {
              label: "Active",
              value: dashboardStats.statusBreakdown.totalActive,
              total: deals?.data?.length || 1,
              color: "hsl(var(--success))",
            },
            {
              label: "Pending Review",
              value: dashboardStats.statusBreakdown.totalPending,
              total: deals?.data?.length || 1,
              color: "hsl(var(--warning))",
            },
            {
              label: "Deactivated",
              value: dashboardStats.statusBreakdown.totalDeactivated,
              total: deals?.data?.length || 1,
              color: "hsl(var(--destructive))",
            },
          ]}
        />
        <DashboardBarChart
          title="Deal Visibility Split"
          description="How deals are distributed by audience visibility"
          isLoading={isLoadingDeals}
          items={[
            {
              label: "Public",
              value: dashboardStats.visibilityBreakdown.totalPublic,
              total: deals?.data?.length || 1,
              color: "hsl(var(--primary))",
            },
            {
              label: "Private",
              value: dashboardStats.visibilityBreakdown.totalPrivate,
              total: deals?.data?.length || 1,
              color: "hsl(var(--muted-foreground))",
            },
          ]}
        />
        <DashboardBarChart
          title="Top Performing Merchants"
          description="Merchants ranked by number of deals posted"
          isLoading={isLoadingDeals}
          items={dashboardStats.top5Merchants.map((m) => ({
            label: m.name,
            value: m.count,
            color: "hsl(var(--primary))",
          }))}
        />
      </div>
      <div className="flex gap-8">
        {/* Recent Activities Card */}

        <Card
          className="space-y-5 flex-8/12 h-fit max-h-100 overflow-y-auto"
          rounded={"lg"}
          size={"lg"}
          isLoading={isLoadingAuditLogs}
        >
          <CardHeader
            className="border rounded-md p-4 bg-sidebar"
            title="Recent Activities"
          >
            <CardTitle children="Recent Activities" />
            <CardDescription children="Latest platform events" />
          </CardHeader>

          <div className="space-y-3 divide-y ">
            {recentActivities?.data?.map((activity, index) => (
              <RecentActivityItem
                key={index}
                title={StringUtil.convertToSentenceCase(
                  activity.auditLogAction,
                )}
                description={activity.auditLogModule}
                time={TimeUtil.timeAgo(activity.auditLogCreatedAt)}
                type={activity.auditLogModule}
              />
            ))}
          </div>
        </Card>
        {/* Quick Actions Card */}
        <Card className="space-y-5 flex-4/12" rounded={"lg"} size={"lg"}>
          <CardHeader title="Quick Actions">
            <CardTitle children="Quick Actions" />
            <CardDescription children="Common administrative tasks" />
          </CardHeader>
          <div className="flex flex-col gap-3">
            {quickActions.map((quickAction, index) => (
              <Link
                className="bg-secondary/80 px-4 py-3 rounded-lg grid grid-cols-[auto_1fr] gap-4 hover:bg-secondary/70 transition items-center"
                href={quickAction.link}
                key={index}
              >
                <div className="bg-secondary">
                  <quickAction.icon className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <Typography weight="medium">{quickAction.title}</Typography>
                  <Typography size="xs" color="muted-foreground">
                    {quickAction.description}
                  </Typography>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
