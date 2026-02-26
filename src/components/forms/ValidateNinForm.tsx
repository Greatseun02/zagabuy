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
      <Input
        id="idNumber"
        name="idNumber"
        label="NIN (11 digits)"
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

      <Input
        id="dob"
        name="dob"
        label="Date of Birth"
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

      <Input
        id="firstName"
        name="firstName"
        label="First Name"
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

      <Input
        id="lastName"
        name="lastName"
        label="Last Name"
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

      <Input
        id="reference"
        name="reference"
        label="Reference"
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Validating..." : "Validate NIN"}
      </Button>
    </form>
  );
};
