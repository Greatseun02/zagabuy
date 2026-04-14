import {
  ClipboardCheck,
  LayoutDashboard,
  Store,
  Users,
  Package,
} from "lucide-react";
import { RouteConstant } from "../constants/routeConstant";
import { sidebarDataType } from "../types";

export const adminSideBarData: sidebarDataType[] = [
  {
    label: "Dashboard",
    href: RouteConstant.admin.dashboard.path,
    icon: LayoutDashboard,
  },
  {
    label: "Moderation Queue",
    href: RouteConstant.admin.moderation.path,
    icon: ClipboardCheck,
    showBadge: true,
  },
  {
    label: "Deals",
    href: RouteConstant.admin.deals.path,
    icon: Package,
  },
  {
    label: "Merchants",
    href: RouteConstant.admin.merchants.path,
    icon: Store,
  },
  // {
  //   label: "Affiliates",
  //   href: RouteConstant.admin.affiliates.path,
  //   icon: Users,
  // },
  {
    label: "Categories",
    href: RouteConstant.admin.categories.path,
    icon: Users,
  },
  {
    label: "Tags",
    href: RouteConstant.admin.tags.path,
    icon: Users,
  },
];
