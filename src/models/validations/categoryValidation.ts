import * as yup from "yup";

export const CreateCategoryValidationSchema = yup.object({
  categoryName: yup.string().required(),
  categorySlug: yup.string(),
  categoryStatus: yup.string(),
});

export const UpdateCategoryValidationSchema = yup.object({
  categoryId: yup.number().required(),
  categoryName: yup.string().required(),
  categorySlug: yup.string(),
  categoryStatus: yup.string().required(),
});

export const DeleteCategoryValidationSchema = yup.object({
  categoryId: yup.number().required(),
});
