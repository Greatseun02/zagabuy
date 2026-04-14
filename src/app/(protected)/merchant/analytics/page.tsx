import MerchantAnalyticsContent from "@/components/content/merchant/MerchantAnalyticsContent";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import { redirect } from "next/navigation";

export default function page() {
  redirect(RouteConstant.merchant.dashboard.path);
  // return <MerchantAnalyticsContent />;
}
