import { BaseResponse } from "@/utilities/types";

export type CreateClickResponse = BaseResponse<null>;

export type UpdateClickResponse = BaseResponse<null>;

export type DeleteClickResponse = BaseResponse<null>;

export type ReadClickResponse = BaseResponse<ClickEntity[]>;

export type ClickEntity = {
  clickEventCreatedAt: string;
  clickEventDealId: number;
  clickEventHash: string;
  clickEventId: number;
  clickEventIp: string;
  clickEventStatus: string;
  clickEventUpdatedAt: string;
};
