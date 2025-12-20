"use client";

import BaseCreateOrUpdateForm, {
  BaseCreateOrUpdateFormProps,
} from "@/components/forms/BaseCreateOrUpdateForm";
import {
  CreateTagRequest,
  UpdateTagRequest,
  CreateTagInit,
  UpdateTagInit,
} from "@/models/requests/tagRequest";
import {
  useCreateTagsMutation,
  useUpdateTagsMutation,
} from "@/services/tagService";
import { Input } from "@/components/ui/input";
import { Formik } from "@/utilities/types";
import {
  CreateTagValidationSchema,
  UpdateTagValidationSchema,
} from "@/models/validations/tagValidation";
import { AnyObjectSchema } from "yup";

export type CreateOrUpdateTagRequest = CreateTagRequest | UpdateTagRequest;
export type CreateOrUpdateTagFormProps = Partial<
  BaseCreateOrUpdateFormProps<
    CreateOrUpdateTagRequest,
    CreateTagRequest,
    UpdateTagRequest
  >
>;

export const CreateOrUpdateTagForm = ({
  initialValues,
  isUpdate = false,
  onSuccessfulSubmission,
  ...rest
}: CreateOrUpdateTagFormProps) => {
  const [createTag] = useCreateTagsMutation();
  const [updateTag] = useUpdateTagsMutation();

  const renderFields = (
    formik: Formik<CreateTagRequest | UpdateTagRequest>
  ) => (
    <div className="space-y-4">
      <div>
        <Input
          label="Tag Name"
          id="tagName"
          name="tagName"
          type="text"
          placeholder="e.g., Trending"
          value={formik.values.tagName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.tagName && formik.errors.tagName
              ? (formik.errors.tagName as string)
              : undefined
          }
        />
      </div>

      <div>
        <Input
          label="Tag Slug"
          id="tagSlug"
          name="tagSlug"
          type="text"
          placeholder="e.g., trending"
          value={formik.values.tagSlug}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.tagSlug && formik.errors.tagSlug
              ? (formik.errors.tagSlug as string)
              : undefined
          }
        />
        <p className="text-xs text-gray-500 mt-1">
          URL-friendly name (lowercase, hyphens only)
        </p>
      </div>
    </div>
  );

  const baseCreateOrUpdateTagFormConfig: BaseCreateOrUpdateFormProps<
    CreateOrUpdateTagRequest,
    CreateTagRequest,
    UpdateTagRequest
  > = {
    isUpdate,
    onSuccessfulSubmission,
    createAction: (request) => {
      return createTag(request).unwrap();
    },
    updateAction: (request) => {
      return updateTag(request).unwrap();
    },
    renderFields,
    initialValues:
      initialValues ??
      (isUpdate
        ? (UpdateTagInit as UpdateTagRequest)
        : (CreateTagInit as CreateTagRequest)),
    validationSchema: (isUpdate
      ? UpdateTagValidationSchema
      : CreateTagValidationSchema) as AnyObjectSchema,
    createBtnText: "Create Tag",
    updateBtnText: "Update Tag",
    ...rest,
  };

  return <BaseCreateOrUpdateForm {...baseCreateOrUpdateTagFormConfig} />;
};
