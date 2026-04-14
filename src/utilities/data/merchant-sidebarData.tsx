import {
  ChartColumn,
  ClipboardCheck,
  LayoutDashboard,
  Store,
  User,
  Users,
} from "lucide-react";
import { RouteConstant } from "../constants/routeConstant";
import { sidebarDataType } from "../types";

export const merchantSideBarData: sidebarDataType[] = [
  {
    label: "Dashboard",
    href: RouteConstant.merchant.dashboard.path,
    icon: LayoutDashboard,
  },
  {
    label: "My Deals",
    href: RouteConstant.merchant.deals.path,
    icon: Users,
  },
  // {
  //   label: "Analytics",
  //   href: RouteConstant.merchant.analytics.path,
  //   icon: ChartColumn,
  // },
  {
    label: "Profile",
    href: RouteConstant.merchant.profile.path,
    icon: User,
  },
];
