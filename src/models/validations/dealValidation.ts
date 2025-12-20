import * as yup from "yup";

export const CreateDealValidationSchema = yup.object({
  dealDescription: yup.string().required(),
  dealExpiryDate: yup.date().required(),
  dealImagesUrl: yup.array().of(yup.string()).required(),
  dealOldPrice: yup.number().required(),
  dealPrice: yup.number().required(),
  dealPromoCode: yup.string().required(),
  dealTitle: yup.string().required(),
  dealUrl: yup.string().required(),
  // dealVisibility: yup.string().required(),
});

export const UpdateDealValidationSchema = yup.object({
  dealDescription: yup.string().required(),
  dealExpiryDate: yup.string().required(),
  dealId: yup.number().required(),
  dealOldPrice: yup.number().required(),
  dealPrice: yup.number().required(),
  dealStatus: yup.string().required(),
  dealTitle: yup.string().required(),
  userDisplayName: yup.string().required(),
  userEmail: yup.string().required(),
  userFirstName: yup.string().required(),
  userLastName: yup.string().required(),
  userUsername: yup.string().required(),
});

export const DeleteDealValidationSchema = yup.object({
  dealId: yup.number().required(),
});
