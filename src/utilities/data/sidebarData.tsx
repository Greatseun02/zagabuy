// import { RouteConstant } from "@/utilities/constants/routeConstant";
// import InfoCircledIcon from "@/components/icon/InfoCircledIcon";
// import RouterUtil from "@/utilities/routerUtil";
// import { SidebarItemProps } from "@/components/ui/menu/Sidebar";
// import { BaseSidebarModuleConfig } from "qucoon-components";
// import InvoiceIcon from "@/components/icon/InvoiceIcon";
// import PadlockIcon from "@/components/icon/PadlockIcon";
// import SupportIcon from "@/components/icon/SupportIcon";
// import SettingsIcon from "@/components/icon/SettingsIcon";
// import { Money16Regular } from "@fluentui/react-icons";
// import { LayoutDashboardIcon, User } from "lucide-react";

// export const sidebarItemsConfig: BaseSidebarModuleConfig[] = [
//   {
//     moduleName: "Dashboard",
//     moduleIcon: <LayoutDashboardIcon />,
//     // moduleRoute: RouteConstant.dashboard.home.path,
//     // moduleItems: [
//     //     {
//     //         title: "Overview",
//     //         tabRoute: RouteConstant.dashboard.home.path,
//     //     },
//     // ],
//   },
//   {
//     moduleName: "Sales",
//     moduleIcon: <Money16Regular />,
//     moduleItems: [
//       {
//         title: "Items",
//         tabRoute: RouteConstant.sales.products.path,
//       },
//       {
//         title: "Customers",
//         tabRoute: RouteConstant.sales.customers.path,
//       },
//     ],
//   },
//   {
//     moduleName: "E-Invoice",
//     moduleIcon: InvoiceIcon,
//     moduleRoute: RouteConstant.eInvoice.invoiceDrafts.path,
//     moduleItems: [
//       {
//         title: "Pending Invoice",
//         tabRoute: RouteConstant.eInvoice.invoiceDrafts.path,
//       },
//       {
//         title: "Create an Invoice",
//         tabRoute: RouteConstant.eInvoice.createInvoice.path,
//       },
//       {
//         title: "Sent Invoice",
//         tabRoute: RouteConstant.eInvoice.sentInvoice.path,
//       },
//       {
//         title: "Received Invoice",
//         tabRoute: RouteConstant.eInvoice.receivedInvoices.path,
//       },
//     ],
//   },
//   {
//     moduleName: "User Management",
//     moduleIcon: <User />,
//     moduleItems: [
//       {
//         title: "All Users",
//         tabRoute: RouteConstant.userManagement.home.path,
//       },
//       {
//         title: "Roles",
//         tabRoute: RouteConstant.userManagement.roles.path,
//       },
//     ],
//   },
//   {
//     moduleName: "Audit Log",
//     moduleIcon: PadlockIcon,
//     moduleRoute: RouteConstant.auditLog.home.path,
//     // moduleItems: [
//     //     {
//     //         title: "Audit Logs",
//     //         tabRoute: RouteConstant.auditLog.home.path,
//     //     },
//     // ]
//   },
//   {
//     moduleName: "Support",
//     moduleRoute: RouteConstant.support.home.path,
//     moduleIcon: SupportIcon,
//     // moduleItems: [
//     //     {
//     //         title: "Support",
//     //         tabRoute: RouteConstant.support.home.path,
//     //     },
//     // ]
//   },
//   {
//     moduleName: "Settings",
//     moduleRoute: RouteConstant.settings.home.path,
//     moduleIcon: SettingsIcon,
//     // moduleItems: [
//     //     {
//     //         title: "Settings",
//     //         tabRoute: RouteConstant.settings.home.path,
//     //     },
//     // ]
//   },
// ];

// export const sidebarBottomMenuConfig: SidebarItemProps[] = [
//   {
//     moduleItems: [
//       {
//         title: "Logout",
//         icon: InfoCircledIcon,
//         onClick: () => {
//           RouterUtil.navigate(RouteConstant.auth.login.path);
//         },
//         // tabRoute: RouteConstant.dashboard.auditLog.path
//       },
//       // {
//       //     title: "Settings",
//       //     icon: SettingsIcon,
//       //     // tabRoute: RouteConstant.dashboard.settings.path
//       // },
//     ],
//   },
// ];
