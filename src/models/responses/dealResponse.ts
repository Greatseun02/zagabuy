import { BaseResponse } from "@/utilities/types";

export type CreateDealResponse = BaseResponse<null>;

export type UpdateDealResponse = BaseResponse<null>;

export type DeleteDealResponse = BaseResponse<null>;

export type ReadDealResponse = BaseResponse<DealEntity[]>;

export type DealEntity = {
  dealDescription: string;
  dealExpiryDate: string;
  dealId: number;
  dealOldPrice: number;
  dealPrice: number;
  dealStatus: string;
  dealTitle: string;
  userDisplayName: string;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  userUsername: string;
};

export type GetDealImagesPresignedUrlResponse = {
  expiresIn: number;
  key: string;
  url: string;
};
