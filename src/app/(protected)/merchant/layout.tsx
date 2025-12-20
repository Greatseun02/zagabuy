"use client";

import { MerchantLayout } from "@/components/layouts/MerchantLayout";
import { RoleGuard } from "@/components/custom/guards/RoleGuard";
import { RouteConstant as ROUTES } from "@/utilities/constants/routeConstant";
import { RoleEnum } from "@/utilities/enums/roleEnum";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard
      allowedRoles={[RoleEnum.AFFILIATE, RoleEnum.MERCHANT]}
      redirectPath={ROUTES.app.path}
    >
      <MerchantLayout>{children}</MerchantLayout>
    </RoleGuard>
  );
}
