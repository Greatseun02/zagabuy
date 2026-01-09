import { BaseService } from "@/configs/serviceConfig";
import {
  CreateAuditLogRequest,
  DeleteAuditLogRequest,
  UpdateAuditLogRequest,
} from "@/models/requests/auditLogRequest";
import {
  CreateAuditLogResponse,
  DeleteAuditLogResponse,
  ReadAuditLogResponse,
  UpdateAuditLogResponse,
} from "@/models/responses/auditLogResponse";
import { ApiRequestMethodsEnum } from "@/utilities/enums/apiRequestMethodsEnum";
import { ApiTagsEnum } from "@/utilities/enums/apiTagsEnum";

const controller = "audit-log";

export const auditLogService = BaseService.appClient.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createAuditLog: builder.mutation<
      CreateAuditLogResponse,
      CreateAuditLogRequest
    >({
      query: (data) => ({
        url: `/${controller}/create`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: [{ type: ApiTagsEnum.AuditLog, id: "LIST" }],
    }),
    readAuditLog: builder.query<ReadAuditLogResponse, void>({
      query: () => ({
        url: `/${controller}/read`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: (results) =>
        results && results.data
          ? [
              ...results.data.map((result) => ({
                type: ApiTagsEnum.AuditLog,
                id: result.auditLogId,
              })),
              { type: ApiTagsEnum.AuditLog, id: "LIST" },
            ]
          : [{ type: ApiTagsEnum.AuditLog, id: "LIST" }],
    }),

    updateAuditLog: builder.mutation<
      UpdateAuditLogResponse,
      UpdateAuditLogRequest
    >({
      query: (data) => ({
        url: `/${controller}/update`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: (request, __, args) => [
        { type: ApiTagsEnum.AuditLog, id: args.auditLogId },
      ],
    }),
    deleteAuditLog: builder.mutation<
      DeleteAuditLogResponse,
      DeleteAuditLogRequest
    >({
      query: (data) => ({
        url: `/${controller}/delete`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: () => [{ type: ApiTagsEnum.AuditLog, id: "LIST" }],
    }),
  }),
});

export const {
  useCreateAuditLogMutation,
  useUpdateAuditLogMutation,
  useReadAuditLogQuery,
  useLazyReadAuditLogQuery,
  useDeleteAuditLogMutation,
} = auditLogService;
