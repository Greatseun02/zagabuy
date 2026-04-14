import AdminAffiliateContent from "@/components/content/admin/AdminAffiliateContent";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import { redirect } from "next/navigation";

export default function page() {
  redirect(RouteConstant.admin.merchants.path);
  // return <AdminAffiliateContent />;
}
