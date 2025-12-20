import { BaseService } from "@/configs/serviceConfig";
import {
  CreateCategoryRequest,
  DeleteCategoryRequest,
  UpdateCategoryRequest,
} from "@/models/requests/categoryRequest";
import {
  CreateCategoryResponse,
  DeleteCategoryResponse,
  ReadCategoryResponse,
  UpdateCategoryResponse,
} from "@/models/responses/categoryResponse";
import { ApiRequestMethodsEnum } from "@/utilities/enums/apiRequestMethodsEnum";
import { ApiTagsEnum } from "@/utilities/enums/apiTagsEnum";

const controller = "category";

export const categoryService = BaseService.appClient.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createcategory: builder.mutation<
      CreateCategoryResponse,
      CreateCategoryRequest
    >({
      query: (data) => ({
        url: `/${controller}/create`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: [{ type: ApiTagsEnum.Category, id: "LIST" }],
    }),
    readcategory: builder.query<ReadCategoryResponse, void>({
      query: () => ({
        url: `/${controller}/read`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: (results) =>
        results && results.data
          ? [
              ...results.data.map((result) => ({
                type: ApiTagsEnum.Category,
                id: result.categoryId,
              })),
              { type: ApiTagsEnum.Category, id: "LIST" },
            ]
          : [{ type: ApiTagsEnum.Category, id: "LIST" }],
    }),

    updatecategory: builder.mutation<
      UpdateCategoryResponse,
      UpdateCategoryRequest
    >({
      query: (data) => ({
        url: `/${controller}/update`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: (request, __, args) => [
        { type: ApiTagsEnum.Category, id: args.categoryId },
      ],
    }),
    deletecategory: builder.mutation<
      DeleteCategoryResponse,
      DeleteCategoryRequest
    >({
      query: (data) => ({
        url: `/${controller}/delete`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: () => [{ type: ApiTagsEnum.Category, id: "LIST" }],
    }),
  }),
});

export const {
  useCreatecategoryMutation,
  useUpdatecategoryMutation,
  useReadcategoryQuery,
  useLazyReadcategoryQuery,
  useDeletecategoryMutation,
} = categoryService;
