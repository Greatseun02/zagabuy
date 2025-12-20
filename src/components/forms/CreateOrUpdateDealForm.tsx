"use client";

import { useCallback, useState } from "react";
import BaseFileUpload, { FileItem } from "@/components/custom/BaseFileUpload";
import {
  CreateDealInit,
  CreateDealRequest,
  UpdateDealInit,
  UpdateDealRequest,
} from "@/models/requests/dealRequest";
import BaseCreateOrUpdateForm, {
  BaseCreateOrUpdateFormProps,
} from "./BaseCreateOrUpdateForm";
import {
  useCreateDealMutation,
  useUpdateDealMutation,
  useGetDealImagesPresignedUrlMutation,
} from "@/services/dealService";
import { Formik } from "@/utilities/types";
import { AnyObjectSchema } from "yup";
import {
  CreateDealValidationSchema,
  UpdateDealValidationSchema,
} from "@/models/validations/dealValidation";
import { Input } from "../ui/input";
import ModernDatePicker from "../ui/modernDatePicker/ModernDatePicker";
import { FileUploadUtil } from "@/utilities/fileUploadUtil";
import { useUploadFileHandler } from "@/utilities/hooks/useUploadFileHandler";
import { BaseUtil } from "@/utilities/baseUtil";

export type CreateOrUdpdateDealFormRequest =
  | CreateDealRequest
  | UpdateDealRequest;

export type CreateOrUpdateDealFormProps = Partial<
  BaseCreateOrUpdateFormProps<
    CreateOrUdpdateDealFormRequest,
    CreateDealRequest,
    UpdateDealRequest
  >
>;

export default function CreateOrUpdateDealForm({
  initialValues,
  isUpdate = false,
  onSuccessfulSubmission,
  ...rest
}: CreateOrUpdateDealFormProps) {
  const [createDeal] = useCreateDealMutation();
  const [updateDeal] = useUpdateDealMutation();
  const [getPresignedUrl] = useGetDealImagesPresignedUrlMutation();

  const handleGetPresignedUrl = useCallback(
    async (args: { fileName: string; contentType?: string }) => {
      const response = await getPresignedUrl({
        fileName: args.fileName,
        contentType: args.contentType || "",
      }).unwrap();

      return response ?? {};
    },
    [getPresignedUrl]
  );

  const { uploadFileHandler } = useUploadFileHandler(handleGetPresignedUrl);

  const [files, setFiles] = useState<FileItem[]>([]);

  const renderFields = (
    formik: Formik<CreateDealRequest | UpdateDealRequest>
  ) => (
    <>
      <Input
        label="Deal Name"
        placeholder="Enter name"
        formik={formik}
        name={"dealTitle"}
      />
      <Input
        label="Description"
        placeholder="Enter description"
        formik={formik}
        name={"dealDescription"}
      />
      <Input
        label="Price"
        placeholder="Enter price"
        formik={formik}
        name={"dealPrice"}
      />
      <Input
        label="Old Price"
        placeholder="Enter old price"
        formik={formik}
        name={"dealOldPrice"}
      />
      <Input
        label="Promo Code"
        placeholder="Enter promo code e.g MYPROMOCODE"
        formik={formik}
        name={"dealPromoCode"}
      />
      <Input
        label="Deal Url"
        placeholder="https://www.deal.com/123"
        formik={formik}
        name={"dealUrl"}
      />
      <ModernDatePicker
        label="Expiry Date"
        placeholder="Enter expiry date"
        formik={formik}
        dateFormat={"date-only"}
        name={"dealExpiryDate"}
      />
      <BaseFileUpload
        label="Deal Images"
        maxFiles={3}
        accept={["image/*"]}
        uploadHandler={uploadFileHandler}
        autoUpload={false}
        error={formik.errors.dealImagesUrl as string}
        onUploadComplete={(result) => {
          const { url } = result as { url: string };
          formik.setFieldValue("dealImagesUrl", [
            ...formik.values.dealImagesUrl,
            url,
          ]);
        }}
        value={files}
        onChange={(files) => setFiles([...files])}
        validate={(value) => {
          try {
            FileUploadUtil.baseFileValidation(1, 3).validateSync(value);
            return null;
          } catch (err: any) {
            return err.message;
          }
        }}
      />
    </>
  );

  const baseCreateOrUpdateDealFormConfig: BaseCreateOrUpdateFormProps<
    CreateOrUdpdateDealFormRequest,
    CreateDealRequest,
    UpdateDealRequest
  > = {
    isUpdate,
    onSuccessfulSubmission,
    createAction: (request) => {
      return createDeal(request).unwrap();
    },
    updateAction: (request) => {
      return updateDeal(request).unwrap();
    },
    renderFields,
    initialValues:
      initialValues ??
      (isUpdate
        ? (UpdateDealInit as UpdateDealRequest)
        : (CreateDealInit as CreateDealRequest)),
    validationSchema: (isUpdate
      ? UpdateDealValidationSchema
      : CreateDealValidationSchema) as AnyObjectSchema,
    createBtnText: "Create Deal",
    updateBtnText: "Update Deal",
    // ...rest,
  };

  return <BaseCreateOrUpdateForm {...baseCreateOrUpdateDealFormConfig} />;
}
