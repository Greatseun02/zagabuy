"use client";

import BaseCreateOrUpdateForm from "@/components/forms/BaseCreateOrUpdateForm";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateCategoryInit,
  UpdateCategoryInit,
} from "@/models/requests/categoryRequest";
import {
  useCreatecategoryMutation,
  useUpdatecategoryMutation,
} from "@/services/categoryService";
import * as yup from "yup";
import { Input as BaseInput } from "@/components/ui/input";
import { FormikValues } from "formik";
import { Formik } from "@/utilities/types";
import {
  CreateCategoryValidationSchema,
  UpdateCategoryValidationSchema,
} from "@/models/validations/categoryValidation";

interface CreateOrUpdateCategoryFormProps {
  initialValues?: UpdateCategoryRequest;
  isUpdate?: boolean;
  onSuccessfulSubmission?: () => void;
}

export const CreateOrUpdateCategoryForm = ({
  initialValues,
  isUpdate = false,
  onSuccessfulSubmission,
}: CreateOrUpdateCategoryFormProps) => {
  const [createCategory] = useCreatecategoryMutation();
  const [updateCategory] = useUpdatecategoryMutation();

  const handleCreateCategory = async (request: CreateCategoryRequest) => {
    return createCategory(request).unwrap();
  };

  const handleUpdateCategory = async (request: UpdateCategoryRequest) => {
    return updateCategory(request).unwrap();
  };

  return (
    <BaseCreateOrUpdateForm<
      CreateCategoryRequest | UpdateCategoryRequest,
      CreateCategoryRequest,
      UpdateCategoryRequest
    >
      title={isUpdate ? "Update Category" : "Create Category"}
      description={
        isUpdate
          ? "Update the category details below."
          : "Add a new category to your store."
      }
      initialValues={
        initialValues || (CreateCategoryInit as UpdateCategoryRequest)
      }
      isUpdate={isUpdate}
      validationSchema={
        isUpdate
          ? UpdateCategoryValidationSchema
          : CreateCategoryValidationSchema
      }
      createAction={handleCreateCategory}
      updateAction={handleUpdateCategory}
      createBtnText="Create Category"
      updateBtnText="Update Category"
      onSuccessfulSubmission={onSuccessfulSubmission}
      renderFields={(
        formik: Formik<CreateCategoryRequest | UpdateCategoryRequest>
      ) => (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <BaseInput
              id="categoryName"
              name="categoryName"
              type="text"
              placeholder="e.g., Electronics"
              value={formik.values.categoryName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.categoryName && formik.errors.categoryName
                  ? (formik.errors.categoryName as string)
                  : undefined
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Slug
            </label>
            <BaseInput
              id="categorySlug"
              name="categorySlug"
              type="text"
              placeholder="e.g., electronics"
              value={formik.values.categorySlug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.categorySlug && formik.errors.categorySlug
                  ? (formik.errors.categorySlug as string)
                  : undefined
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly name (lowercase, hyphens only)
            </p>
          </div>
        </div>
      )}
    />
  );
};
