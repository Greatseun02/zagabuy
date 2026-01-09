export type CreateAuditLogRequest = {
  auditLogAction: string;
  auditLogModule: string;
  auditLogRequest: string;
  auditLogResponse: string;
  auditLogResponseCode: string;
  auditLogResponseMessage: string;
  auditLogStatus: string;
  auditLogUserId: number;
};

export type UpdateAuditLogRequest = {
  auditLogAction: string;
  auditLogId: number;
  auditLogModule: string;
  auditLogRequest: string;
  auditLogResponse: string;
  auditLogResponseCode: string;
  auditLogResponseMessage: string;
  auditLogStatus: string;
};

export type DeleteAuditLogRequest = {
  auditLogId: number;
};

export const CreateAuditLogInit: CreateAuditLogRequest = {
  auditLogAction: "string",
  auditLogModule: "string",
  auditLogRequest: "string",
  auditLogResponse: "string",
  auditLogResponseCode: "string",
  auditLogResponseMessage: "string",
  auditLogStatus: "string",
  auditLogUserId: 0,
};

export const UpdateAuditLogInit: UpdateAuditLogRequest = {
  auditLogAction: "",
  auditLogId: 0,
  auditLogModule: "",
  auditLogRequest: "",
  auditLogResponse: "",
  auditLogResponseCode: "",
  auditLogResponseMessage: "",
  auditLogStatus: "",
};
