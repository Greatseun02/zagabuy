"use client";

import { AdminLayout } from "@/components/layouts/AdminLayout";
import { RoleGuard } from "@/components/custom/guards/RoleGuard";
import { RouteConstant as ROUTES } from "@/utilities/constants/routeConstant";
import { ReactNode } from "react";
import { RoleEnum } from "@/utilities/enums/roleEnum";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={[RoleEnum.ADMIN]} redirectPath={ROUTES.app.path}>
      <AdminLayout>{children}</AdminLayout>
    </RoleGuard>
  );
}
