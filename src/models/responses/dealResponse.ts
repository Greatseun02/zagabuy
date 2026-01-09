import { BaseResponse } from "@/utilities/types";

export type CreateDealResponse = BaseResponse<null>;

export type UpdateDealResponse = BaseResponse<null>;

export type DeleteDealResponse = BaseResponse<null>;

export type ReadDealResponse = BaseResponse<DealEntity[]>;

export type ReadDealResponseByDealId = BaseResponse<DealEntity>;

export type DealEntity = {
  clickCount: number;
  dealApprovedBy: number;
  dealCreatedAt: string;
  dealDescription: string;
  dealExpiryDate: string;
  dealId: number;
  dealImages: string[];
  dealOldPrice: number;
  dealPrice: number;
  dealPromoCode: string;
  dealStatus: string;
  dealTitle: string;
  dealUrl: string;
  dealUserId: number;
  dealViews: number;
  dealVisibility: string;
  userDisplayName: string;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
};

export type GetDealImagesPresignedUrlResponse = {
  expiresIn: number;
  key: string;
  url: string;
};
