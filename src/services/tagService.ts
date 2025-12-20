import { BaseService } from "@/configs/serviceConfig";
import {
  CreateTagRequest,
  DeleteTagRequest,
  UpdateTagRequest,
} from "@/models/requests/tagRequest";
import {
  CreateTagResponse,
  DeleteTagResponse,
  ReadTagResponse,
  UpdateTagResponse,
} from "@/models/responses/tagResponse";
import { ApiRequestMethodsEnum } from "@/utilities/enums/apiRequestMethodsEnum";
import { ApiTagsEnum } from "@/utilities/enums/apiTagsEnum";

const controller = "tag";

export const tagsService = BaseService.appClient.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createTags: builder.mutation<CreateTagResponse, CreateTagRequest>({
      query: (data) => ({
        url: `/${controller}/create`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: [{ type: ApiTagsEnum.Tags, id: "LIST" }],
    }),
    readTags: builder.query<ReadTagResponse, void>({
      query: () => ({
        url: `/${controller}/read`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: (results) =>
        results && results.data
          ? [
              ...results.data.map((result) => ({
                type: ApiTagsEnum.Tags,
                id: result.tagId,
              })),
              { type: ApiTagsEnum.Tags, id: "LIST" },
            ]
          : [{ type: ApiTagsEnum.Tags, id: "LIST" }],
    }),

    updateTags: builder.mutation<UpdateTagResponse, UpdateTagRequest>({
      query: (data) => ({
        url: `/${controller}/update`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: (request, __, args) => [
        { type: ApiTagsEnum.Tags, id: args.tagId },
      ],
    }),
    deleteTags: builder.mutation<DeleteTagResponse, DeleteTagRequest>({
      query: (data) => ({
        url: `/${controller}/delete`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: () => [{ type: ApiTagsEnum.Tags, id: "LIST" }],
    }),
  }),
});

export const {
  useCreateTagsMutation,
  useUpdateTagsMutation,
  useReadTagsQuery,
  useLazyReadTagsQuery,
  useDeleteTagsMutation,
} = tagsService;
