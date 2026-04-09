import * as yup from "yup";

export const CreateDealValidationSchema = yup.object({
  dealDescription: yup
    .string()
    .required()
    .min(2, "Description must be at least 2 characters")
    .max(250, "Description cannot exceed 250 characters"),
  dealExpiryDate: yup.date().required(),
  dealImagesUrl: yup.array().of(yup.string()).required(),
  dealOldPrice: yup
    .number()
    .required()
    .moreThan(0, "Old price must be greater than 0"),
  dealPrice: yup.number().required(),
  dealPromoCode: yup.string().required(),
  dealTitle: yup.string().required(),
  dealUrl: yup.string().required(),
  dealVisibility: yup.string().required(),
});

export const UpdateDealValidationSchema = yup.object({
  dealId: yup.number().required(),
  dealDescription: yup
    .string()
    .required()
    .min(2, "Description must be at least 2 characters")
    .max(250, "Description cannot exceed 250 characters"),
  dealExpiryDate: yup.string().required(),
  dealImagesUrl: yup.array().of(yup.string()).required(),
  dealOldPrice: yup
    .number()
    .required()
    .moreThan(0, "Old price must be greater than 0"),
  dealPrice: yup.number().required(),
  dealPromoCode: yup.string().required(),
  dealTitle: yup.string().required(),
  dealUrl: yup.string().required(),
  dealStatus: yup.string().required(),
  // userDisplayName: yup.string().required(),
  // userEmail: yup.string().required(),
  // userFirstName: yup.string().required(),
  // userLastName: yup.string().required(),
  // userUsername: yup.string().required(),
});

export const DeleteDealValidationSchema = yup.object({
  dealId: yup.number().required(),
});
