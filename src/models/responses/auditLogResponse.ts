import { BaseResponse } from "@/utilities/types";

export type CreateAuditLogResponse = BaseResponse<null>;

export type UpdateAuditLogResponse = BaseResponse<null>;

export type DeleteAuditLogResponse = BaseResponse<null>;

export type ReadAuditLogResponse = BaseResponse<AuditLogEntity[]>;

export type AuditLogEntity = {
  auditLogAction: string;
  auditLogCreatedAt: string;
  auditLogId: number;
  auditLogModule: string;
  auditLogRequest: string;
  auditLogResponse: string;
  auditLogResponseCode: string;
  auditLogResponseMessage: string;
  auditLogStatus: string;
  auditLogUpdatedAt: string;
  auditLogUserId: number;
};
