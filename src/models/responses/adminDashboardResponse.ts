import { BaseResponse } from "@/utilities/types";

export type CreateAdminDashboardResponse = BaseResponse<null>;

export type UpdateAdminDashboardResponse = BaseResponse<null>;

export type DeleteAdminDashboardResponse = BaseResponse<null>;

export type ReadAdminDashboardResponse = BaseResponse<AdminDashboardEntity[]>;

export type AdminDashboardEntity = {
  clicksThisMonth: number;
  clicksToday: number;
  revenueThisMonth: number;
  revenueToday: number;
  totalAffiliates: number;
  totalMerchants: number;
  totalPending: number;
  totalDeals: number;
};
