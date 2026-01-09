"use client";

import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import DashboardOverviewCards, {
  DashboardOverviewCardsProps,
} from "@/components/ui/dashboardOverviewCards";
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
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import Typography from "@/components/ui/typography";
import { useReadAuditLogQuery } from "@/services/auditLogService";
import { TimeUtil } from "@/utilities/timeUtil";
import { StringUtil } from "@/utilities/stringUtil";
import { Skeleton } from "@/components/ui/skeleton";
import { useReadAdminDashboardQuery } from "@/services/adminDashboardService";

export default function AdminDashboardContent() {
  const { data: adminDashboardData, isLoading: isLoadingAdminDashboard } =
    useReadAdminDashboardQuery();

  const dashboardOverviewCardsConfig: DashboardOverviewCardsProps[] = [
    {
      header: "Total Deals",
      text: isLoadingAdminDashboard
        ? "Loading..."
        : adminDashboardData?.data?.[0].totalDeals &&
          StringUtil.compact(adminDashboardData?.data?.[0].totalDeals),
      footer: isLoadingAdminDashboard
        ? "Loading..."
        : adminDashboardData?.data?.[0].totalPending &&
          `${StringUtil.compact(
            adminDashboardData?.data?.[0].totalPending
          )} pending`,
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
      header: "Total Affiliates",
      text: isLoadingAdminDashboard
        ? "Loading..."
        : adminDashboardData?.data?.[0].totalAffiliates &&
          StringUtil.compact(adminDashboardData?.data?.[0].totalAffiliates),
      Icon: Users,
    },
    {
      header: "Pending Review",
      text: isLoadingAdminDashboard
        ? "Loading..."
        : adminDashboardData?.data?.[0].totalPending &&
          StringUtil.compact(adminDashboardData?.data?.[0].totalPending),
      Icon: Clock,
    },
  ];

  const dashboardPerformanceStatsCardConfig: DashboardPerformanceStatsCardProps[] =
    [
      {
        header: {
          children: "Click Performance",
          startIcon: <MousePointerClick />,
        },
        contents: [
          {
            label: {
              children: "Today",
            },
            text: {
              children: isLoadingAdminDashboard
                ? "Loading..."
                : adminDashboardData?.data?.[0].clicksToday
                ? StringUtil.compact(adminDashboardData?.data?.[0].clicksToday)
                : 0,
            },
          },
          {
            label: {
              children: "This Month",
            },
            text: {
              children: isLoadingAdminDashboard
                ? "Loading..."
                : adminDashboardData?.data?.[0].clicksThisMonth
                ? StringUtil.compact(
                    adminDashboardData?.data?.[0].clicksThisMonth
                  )
                : 0,
            },
          },
        ],
      },
      // {
      //   header: {
      //     children: "CTR",
      //     startIcon: <TrendingUpIcon />,
      //   },
      //   contents: [
      //     {
      //       label: {
      //         children: "Today",
      //       },
      //       text: {
      //         children: adminDashboardData?.data?.,
      //       },
      //     },
      //     {
      //       label: {
      //         children: "This Month",
      //       },
      //       text: {
      //         children: "60%",
      //       },
      //     },
      //   ],
      // },
    ];

  // const recentActivities: RecentActivityItemProps[] = [
  //   {
  //     title: "New merchant registered",
  //     description: "A new merchant has been registered.",
  //     time: "2 min ago",
  //     type: "merchant",
  //   },
  //   {
  //     title: "New merchant registered",
  //     description: "A new merchant has been registered.",
  //     time: "2 min ago",
  //     type: "merchant",
  //   },
  //   {
  //     title: "New merchant registered",
  //     description: "A new merchant has been registered.",
  //     time: "2 min ago",
  //     type: "merchant",
  //   },
  //   {
  //     title: "New merchant registered",
  //     description: "A new merchant has been registered.",
  //     time: "2 min ago",
  //     type: "merchant",
  //   },
  //   {
  //     title: "New merchant registered",
  //     description: "A new merchant has been registered.",
  //     time: "2 min ago",
  //     type: "merchant",
  //   },
  //   {
  //     title: "New merchant registered",
  //     description: "A new merchant has been registered.",
  //     time: "2 min ago",
  //     type: "merchant",
  //   },
  //   {
  //     title: "New merchant registered",
  //     description: "A new merchant has been registered.",
  //     time: "2 min ago",
  //     type: "merchant",
  //   },
  //   {
  //     title: "New merchant registered",
  //     description: "A new merchant has been registered.",
  //     time: "2 min ago",
  //     type: "merchant",
  //   },
  //   {
  //     title: "New merchant registered",
  //     description: "A new merchant has been registered.",
  //     time: "2 min ago",
  //     type: "merchant",
  //   },
  //   {
  //     title: "Deal approved",
  //     description: "Your deal has been approved.",
  //     time: "1 hour ago",
  //     type: "approved",
  //   },
  //   {
  //     title: "Payment received",
  //     description: "Payment received from a customer.",
  //     time: "3 hours ago",
  //     type: "payment",
  //   },
  // ];

  const { data: recentActivities, isLoading: isLoadingAuditLogs } =
    useReadAuditLogQuery();

  const quickActions: {
    title: string;
    description: string;
    icon: LucideIcon;
    link: string;
  }[] = [
    {
      title: "Review Pending Deals",
      description: `${1} deal awaiting approval`,
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
          text: `Review Queue ${1}`,
          startIcon: <ClipboardCheck />,
          variant: "primary",
          size: "medium",
          onClick() {
            router.push(RouteConstant.admin.moderation.path);
          },
        },
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardOverviewCardsConfig.map((config, index) => (
          <DashboardOverviewCards key={index} {...config} />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dashboardPerformanceStatsCardConfig.map((card, index) => (
          <DashboardPerformanceStatsCard key={index} {...card} />
        ))}
      </div>
      <div className="flex gap-8">
        {/* Recent Activities Card */}

        <Card
          className="space-y-5 flex-8/12 h-fit max-h-100 overflow-y-auto"
          rounded={"lg"}
          size={"lg"}
          isLoading={isLoadingAuditLogs}
        >
          <CardHeader title="Recent Activities">
            <CardTitle children="Recent Activities" />
            <CardDescription children="Latest platform events" />
          </CardHeader>

          <div className="space-y-3">
            {recentActivities?.data?.map((activity, index) => (
              <RecentActivityItem
                key={index}
                title={StringUtil.convertToSentenceCase(
                  activity.auditLogAction
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
