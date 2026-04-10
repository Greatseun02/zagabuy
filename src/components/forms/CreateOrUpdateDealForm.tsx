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
import { Input as BaseInput } from "../ui/input";
import ModernDatePicker from "../ui/modernDatePicker/ModernDatePicker";
import { FileUploadUtil } from "@/utilities/fileUploadUtil";
import { useUploadFileHandler } from "@/utilities/hooks/useUploadFileHandler";
import { toast } from "sonner";
import DealUtil from "@/utilities/dealUtil";

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
  submitBtnProps,
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
    [getPresignedUrl],
  );

  const { uploadFileHandler, isUploading } = useUploadFileHandler(
    handleGetPresignedUrl,
  );

  const [files, setFiles] = useState<FileItem[]>(
    initialValues?.dealImagesUrl?.map((url, index) => ({
      url,
      id: String(index),
      name: DealUtil.getFileNameFromUrl(url),
    })) || [],
  );

  const renderFields = (
    formik: Formik<CreateDealRequest | UpdateDealRequest>,
  ) => (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
        <BaseInput
          label="Deal Name"
          placeholder="Enter name"
          formik={formik}
          name={"dealTitle"}
          containerClassName="flex-1 basis-250px"
        />
        <BaseInput
          label="Old Price"
          placeholder="Enter old price"
          formik={formik}
          name={"dealOldPrice"}
          containerClassName="flex-1"
          formatDecimalNumberWithCommas
        />
        <BaseInput
          label="New Price"
          placeholder="Enter price"
          formik={formik}
          name={"dealPrice"}
          containerClassName="flex-1"
          formatDecimalNumberWithCommas
        />
        <BaseInput
          label="Promo Code"
          placeholder="Enter promo code e.g MYPROMOCODE"
          formik={formik}
          name={"dealPromoCode"}
          containerClassName="flex-1"
        />
        <BaseInput
          label="Deal Url"
          placeholder="https://www.deal.com/123"
          formik={formik}
          name={"dealUrl"}
          containerClassName="flex-1"
        />
        <ModernDatePicker
          label="Expiry Date"
          placeholder="Enter expiry date"
          formik={formik}
          dateFormat={"date-only"}
          name={"dealExpiryDate"}
          className="flex-1"
        />
      </div>
      <BaseInput
        label="Description"
        placeholder="Enter description"
        formik={formik}
        name={"dealDescription"}
        multiline
        className="h-25"
        containerClassName="w-full"
      />
      <BaseFileUpload
        label="Deal Images"
        maxFiles={3}
        accept={["image/*"]}
        uploadHandler={uploadFileHandler}
        autoUpload={false}
        error={formik.errors.dealImagesUrl as string}
        onUploadComplete={(result) => {
          FileUploadUtil.handleUploadComplete(
            result,
            formik as Formik<CreateOrUdpdateDealFormRequest>,
            "dealImagesUrl",
          );
        }}
        value={files}
        onChange={(files) => setFiles([...files])}
        onFileRemove={(file) => {
          FileUploadUtil.handleFileRemove<CreateOrUdpdateDealFormRequest>(
            file,
            formik as Formik<CreateOrUdpdateDealFormRequest>,
            "dealImagesUrl",
          );
        }}
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
    onSuccessfulSubmission: (response) => {
      setFiles([]);
      onSuccessfulSubmission?.(response);
      toast.success("Success");
    },
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
    submitBtnProps: {
      isLoading: isUploading,
      ...submitBtnProps,
    },
    ...rest,
  };

  return <BaseCreateOrUpdateForm {...baseCreateOrUpdateDealFormConfig} />;
}
