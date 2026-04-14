import { BaseService } from "@/configs/serviceConfig";
import {
  CreateDealRequest,
  DeleteDealRequest,
  GetDealImagesPresignedUrlRequest,
  UpdateDealRequest,
} from "@/models/requests/dealRequest";
import {
  CreateDealResponse,
  DealEntity,
  DeleteDealResponse,
  GetDealImagesPresignedUrlResponse,
  ReadDealResponse,
  ReadDealResponseByDealId,
  UpdateDealResponse,
} from "@/models/responses/dealResponse";
import { ApiRequestMethodsEnum } from "@/utilities/enums/apiRequestMethodsEnum";
import { ApiTagsEnum } from "@/utilities/enums/apiTagsEnum";

const controller = "deal";

export const dealService = BaseService.appClient.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createDeal: builder.mutation<CreateDealResponse, CreateDealRequest>({
      query: (data) => ({
        url: `/${controller}/create`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: [{ type: ApiTagsEnum.Deal, id: "LIST" }],
    }),
    readDeal: builder.query<ReadDealResponse, void>({
      query: () => ({
        url: `/${controller}/read`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: (results) =>
        results && results.data
          ? [
              ...results.data.map((result) => ({
                type: ApiTagsEnum.Deal,
                id: result.dealId,
              })),
              { type: ApiTagsEnum.Deal, id: "LIST" },
            ]
          : [{ type: ApiTagsEnum.Deal, id: "LIST" }],
    }),
    readDealByUser: builder.query<ReadDealResponse, void>({
      query: () => ({
        url: `/${controller}/read-by-deal-user-id/`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: (results) =>
        results && results.data
          ? [
              ...results.data.map((result) => ({
                type: ApiTagsEnum.Deal,
                id: result.dealId,
              })),
              { type: ApiTagsEnum.Deal, id: "LIST" },
            ]
          : [{ type: ApiTagsEnum.Deal, id: "LIST" }],
    }),
    readDealAdmin: builder.query<ReadDealResponse, void>({
      query: () => ({
        url: `/${controller}/read/admin`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: (results) =>
        results && results.data
          ? [
              ...results.data.map((result) => ({
                type: ApiTagsEnum.Deal,
                id: result.dealId,
              })),
              { type: ApiTagsEnum.Deal, id: "LIST" },
            ]
          : [{ type: ApiTagsEnum.Deal, id: "LIST" }],
    }),
    readDealByStatus: builder.query<ReadDealResponse, string>({
      query: (dealStatus) => ({
        url: `/${controller}/read-by-deal-status/${dealStatus}`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: (results) =>
        results && results.data
          ? [
              ...results.data.map((result) => ({
                type: ApiTagsEnum.Deal,
                id: result.dealId,
              })),
              { type: ApiTagsEnum.Deal, id: "LIST" },
            ]
          : [{ type: ApiTagsEnum.Deal, id: "LIST" }],
    }),
    readDealByDealId: builder.query<ReadDealResponseByDealId, string | number>({
      query: (args) => ({
        url: `${controller}/read-by-deal-id/${args}`,
      }),
      providesTags: (result) => [
        {
          type: ApiTagsEnum.Deal,
          id: result?.data?.dealId,
        },
        { type: ApiTagsEnum.Deal, id: "LIST" },
      ],
    }),
    updateDeal: builder.mutation<UpdateDealResponse, UpdateDealRequest>({
      query: (data) => ({
        url: `/${controller}/update`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: (request, __, args) => [
        { type: ApiTagsEnum.Deal, id: args.dealId },
      ],
    }),
    deleteDeal: builder.mutation<DeleteDealResponse, DeleteDealRequest>({
      query: (data) => ({
        url: `/${controller}/delete`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: () => [{ type: ApiTagsEnum.Deal, id: "LIST" }],
    }),
    getDealImagesPresignedUrl: builder.mutation<
      GetDealImagesPresignedUrlResponse,
      GetDealImagesPresignedUrlRequest
    >({
      query: (data) => ({
        url: `/${controller}/images/presigned-url`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateDealMutation,
  useUpdateDealMutation,
  useReadDealQuery,
  useLazyReadDealQuery,
  useReadDealByUserQuery,
  useLazyReadDealAdminQuery,
  useReadDealAdminQuery,
  useLazyReadDealByUserQuery,
  useReadDealByDealIdQuery,
  useReadDealByStatusQuery,
  useLazyReadDealByStatusQuery,
  useDeleteDealMutation,
  useGetDealImagesPresignedUrlMutation,
} = dealService;
