"use client";

import { useFormik } from "formik";
import {
  ValidateNinRequest,
  ValidateNinInit,
} from "@/models/requests/wallet/ValidateNinRequest";
import { useValidateNinMutation } from "@/services/walletService";
import { ValidateNinValidationSchema } from "@/models/validations/walletValidation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BaseUtil } from "@/utilities/baseUtil";
import { toast } from "sonner";

interface ValidateNinFormProps {
  onSuccessfulSubmission?: () => void;
}

export const ValidateNinForm = ({
  onSuccessfulSubmission,
}: ValidateNinFormProps) => {
  const [validateNin] = useValidateNinMutation();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<ValidateNinRequest>({
    initialValues: ValidateNinInit,
    validationSchema: ValidateNinValidationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await validateNin(values).unwrap();

        if (response && BaseUtil.isApiResponseSuccessful(response)) {
          toast.success("NIN validated successfully");
          formik.resetForm();
          onSuccessfulSubmission?.();
        } else {
          toast.error(response?.responseMessage ?? "Validation failed");
        }
      } catch (err: any) {
        toast.error(err?.message ?? "Validation failed");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          NIN (11 digits)
        </label>
        <Input
          id="idNumber"
          name="idNumber"
          type="text"
          placeholder="Enter your NIN"
          value={formik.values.idNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.idNumber && formik.errors.idNumber
              ? (formik.errors.idNumber as string)
              : undefined
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <Input
          id="dob"
          name="dob"
          type="date"
          value={formik.values.dob}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.dob && formik.errors.dob
              ? (formik.errors.dob as string)
              : undefined
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Enter your first name"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.firstName && formik.errors.firstName
              ? (formik.errors.firstName as string)
              : undefined
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Last Name
        </label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Enter your last name"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.lastName && formik.errors.lastName
              ? (formik.errors.lastName as string)
              : undefined
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reference
        </label>
        <Input
          id="reference"
          name="reference"
          type="text"
          placeholder="Enter a reference"
          value={formik.values.reference}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.reference && formik.errors.reference
              ? (formik.errors.reference as string)
              : undefined
          }
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Validating..." : "Validate NIN"}
      </Button>
    </form>
  );
};
