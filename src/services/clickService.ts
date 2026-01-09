import { BaseService } from "@/configs/serviceConfig";
import {
  CreateClickRequest,
  DeleteClickRequest,
  UpdateClickRequest,
} from "@/models/requests/clickRequest";
import {
  CreateClickResponse,
  DeleteClickResponse,
  ReadClickResponse,
  UpdateClickResponse,
} from "@/models/responses/clickResponse";
import { ApiRequestMethodsEnum } from "@/utilities/enums/apiRequestMethodsEnum";
import { ApiTagsEnum } from "@/utilities/enums/apiTagsEnum";

const controller = "click-event";

export const clickService = BaseService.appClient.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createClick: builder.mutation<CreateClickResponse, CreateClickRequest>({
      query: (data) => ({
        url: `/${controller}/create`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: (_, __, args) => [
        { type: ApiTagsEnum.Click, id: "LIST" },
        { type: ApiTagsEnum.Deal, id: "LIST" },
        { type: ApiTagsEnum.Deal, id: args?.clickEventDealId },
      ],
    }),
    readClick: builder.query<ReadClickResponse, void>({
      query: () => ({
        url: `/${controller}/read`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: (results) =>
        results && results.data
          ? [
              ...results.data.map((result) => ({
                type: ApiTagsEnum.Click,
                id: result.clickEventId,
              })),
              { type: ApiTagsEnum.Click, id: "LIST" },
            ]
          : [{ type: ApiTagsEnum.Click, id: "LIST" }],
    }),

    updateClick: builder.mutation<UpdateClickResponse, UpdateClickRequest>({
      query: (data) => ({
        url: `/${controller}/update`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: (request, __, args) => [
        { type: ApiTagsEnum.Click, id: args.clickEventId },
      ],
    }),
    deleteClick: builder.mutation<DeleteClickResponse, DeleteClickRequest>({
      query: (data) => ({
        url: `/${controller}/delete`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: () => [{ type: ApiTagsEnum.Click, id: "LIST" }],
    }),
  }),
});

export const {
  useCreateClickMutation,
  useUpdateClickMutation,
  useReadClickQuery,
  useLazyReadClickQuery,
  useDeleteClickMutation,
} = clickService;
