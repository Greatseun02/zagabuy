"use client";

import BaseFormLayout, {
  BaseFormLayoutProps,
} from "@/components/layouts/baseFormLayout";
import { FormikConfig, FormikValues, useFormik } from "formik";
import { BaseUtil } from "@/utilities/baseUtil";
import { ReactNode, useEffect, useState } from "react";
import { BaseResponse } from "@/utilities/types";
import { toast } from "sonner";
import { Button as BaseButton } from "@/components/ui/button";
import { Formik } from "@/utilities/types";
import { AnyObjectSchema } from "yup";

export interface BaseCreateOrUpdateFormProps<
  T extends FormikValues,
  CreateRequest extends T = T,
  UpdateRequest extends T = T,
  CreateResponse extends BaseResponse = BaseResponse,
  UpdateResponse extends BaseResponse = BaseResponse,
> extends Pick<BaseFormLayoutProps, "title" | "description"> {
  initialValues: T;
  onSuccessfulSubmission?: (response: CreateResponse | UpdateResponse) => void;
  submitBtnProps?: React.ComponentProps<typeof BaseButton>;
  isUpdate?: boolean;
  validationSchema: AnyObjectSchema;
  createAction: (request: CreateRequest) => Promise<CreateResponse>;
  updateAction: (request: UpdateRequest) => Promise<UpdateResponse>;
  updateBtnText?: string;
  createBtnText?: string;
  readAction?: () => Promise<BaseResponse>;
  children?: ReactNode;
  renderFields?: (formik: Formik<T>) => ReactNode;
}

const BaseCreateOrUpdateForm = <
  T extends FormikValues,
  CreateRequest extends T = T,
  UpdateRequest extends T = T,
  CreateResponse extends BaseResponse = BaseResponse,
  UpdateResponse extends BaseResponse = BaseResponse,
>({
  initialValues,
  onSuccessfulSubmission,
  submitBtnProps,
  isUpdate = false,
  validationSchema,
  createAction,
  updateBtnText,
  createBtnText,
  updateAction,
  readAction,
  children,
  renderFields,
  title,
  description,
}: BaseCreateOrUpdateFormProps<
  T,
  CreateRequest,
  UpdateRequest,
  CreateResponse,
  UpdateResponse
>) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit: FormikConfig<T>["onSubmit"] = async (
    values,
    formikHelper,
  ) => {
    try {
      const castedValues = validationSchema?.cast?.(values, {
        stripUnknown: true,
      }) as CreateRequest | UpdateRequest;

      setIsLoading(true);
      const response = isUpdate
        ? await updateAction(castedValues as UpdateRequest)
        : await createAction(castedValues as CreateRequest);

      if (response && BaseUtil.isApiResponseSuccessful(response)) {
        // toast.success("Operation successful");
        formikHelper.resetForm();
        if (readAction) await readAction();
        onSuccessfulSubmission?.(response);
      } else {
        toast.error(response?.responseMessage ?? "Operation failed");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const formik: Formik<T> = useFormik<T>({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema,
    enableReinitialize: true,
  });

  useEffect(() => {
    // Helpful during development — remove or guard in production
    console.debug("formik", formik.values, formik.errors);
  }, [formik.values, formik.errors]);

  return (
    <BaseFormLayout
      title={title}
      description={description}
      onSubmit={formik.handleSubmit}
    >
      {renderFields ? renderFields(formik) : children}

      <div className="flex items-center gap-3">
        <BaseButton
          type="submit"
          {...submitBtnProps}
          isLoading={isLoading || submitBtnProps?.isLoading}
          variant={submitBtnProps?.variant ?? "primary"}
          width={submitBtnProps?.width ?? "auto"}
        >
          {isUpdate ? (updateBtnText ?? "Update") : (createBtnText ?? "Create")}
        </BaseButton>

        {submitBtnProps?.variant !== "ghost" && (
          <BaseButton
            type="button"
            variant="secondary"
            onClick={() => formik.resetForm()}
          >
            Reset
          </BaseButton>
        )}
      </div>
    </BaseFormLayout>
  );
};

export default BaseCreateOrUpdateForm;
