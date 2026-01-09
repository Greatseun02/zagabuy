import { BaseService } from "@/configs/serviceConfig";
import { ReadAdminDashboardResponse } from "@/models/responses/adminDashboardResponse";

import { ApiRequestMethodsEnum } from "@/utilities/enums/apiRequestMethodsEnum";
import { ApiTagsEnum } from "@/utilities/enums/apiTagsEnum";

const controller = "admin-dashboard";

export const adminDashboardService = BaseService.appClient.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    readAdminDashboard: builder.query<ReadAdminDashboardResponse, void>({
      query: () => ({
        url: `/${controller}/read`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: [{ type: ApiTagsEnum.AdminDashboard, id: "LIST" }],
    }),
  }),
});

export const { useReadAdminDashboardQuery, useLazyReadAdminDashboardQuery } =
  adminDashboardService;
