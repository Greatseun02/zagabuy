export type CreateDealRequest = {
  dealDescription: string;
  dealExpiryDate: string;
  dealImagesUrl: string[];
  dealOldPrice: number;
  dealPrice: number;
  dealPromoCode: string;
  dealTitle: string;
  dealUrl: string;
  dealVisibility: string;
};

export type UpdateDealRequest = {
  dealApprovedBy: number;
  dealDescription: string;
  dealExpiryDate: string;
  dealId: number;
  dealImagesUrl: string[];
  dealOldPrice: number;
  dealPrice: number;
  dealPromoCode: string;
  dealStatus: string;
  dealTitle: string;
  dealUrl: string;
  dealUserId: number;
  dealVisibility: string;
};

export type DeleteDealRequest = {
  dealId: number;
};

export const CreateDealInit: CreateDealRequest = {
  dealDescription: "",
  dealExpiryDate: "",
  dealImagesUrl: [],
  dealOldPrice: 0,
  dealPrice: 0,
  dealPromoCode: "",
  dealTitle: "",
  dealUrl: "",
  dealVisibility: "",
};

export const UpdateDealInit: UpdateDealRequest = {
  dealApprovedBy: 0,
  dealDescription: "",
  dealExpiryDate: "",
  dealId: 0,
  dealImagesUrl: [],
  dealOldPrice: 0,
  dealPrice: 0,
  dealPromoCode: "",
  dealStatus: "",
  dealTitle: "",
  dealUrl: "",
  dealUserId: 0,
  dealVisibility: "",
};

export type GetDealImagesPresignedUrlRequest = {
  contentType: string;
  fileName: string;
};
