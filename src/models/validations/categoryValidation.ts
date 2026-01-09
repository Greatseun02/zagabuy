import * as yup from "yup";

export const CreateCategoryValidationSchema = yup.object({
  categoryName: yup
    .string()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be at most 50 characters"),
  categorySlug: yup
    .string()
    .required("Category slug is required")
    .min(2, "Category slug must be at least 2 characters")
    .max(50, "Category slug must be at most 50 characters")
    .matches(
      /^[a-z0-9-]+$/,
      "Category slug must contain only lowercase letters, numbers, and hyphens"
    ),
  categoryStatus: yup.string(),
});

export const UpdateCategoryValidationSchema = yup.object({
  categoryId: yup.number().required(),
  categoryName: yup
    .string()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be at most 50 characters"),
  categorySlug: yup
    .string()
    .required("Category slug is required")
    .min(2, "Category slug must be at least 2 characters")
    .max(50, "Category slug must be at most 50 characters")
    .matches(
      /^[a-z0-9-]+$/,
      "Category slug must contain only lowercase letters, numbers, and hyphens"
    ),
  categoryStatus: yup.string().required(),
});

export const DeleteCategoryValidationSchema = yup.object({
  categoryId: yup.number().required(),
});
