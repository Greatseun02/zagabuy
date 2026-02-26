"use client";

import { useFormik } from "formik";
import {
  ValidateBvnRequest,
  ValidateBvnInit,
} from "@/models/requests/wallet/ValidateBvnRequest";
import { useValidateBvnMutation } from "@/services/walletService";
import { ValidateBvnValidationSchema } from "@/models/validations/walletValidation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BaseUtil } from "@/utilities/baseUtil";
import { toast } from "sonner";

interface ValidateBvnFormProps {
  onSuccessfulSubmission?: () => void;
}

export const ValidateBvnForm = ({
  onSuccessfulSubmission,
}: ValidateBvnFormProps) => {
  const [validateBvn] = useValidateBvnMutation();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<ValidateBvnRequest>({
    initialValues: ValidateBvnInit,
    validationSchema: ValidateBvnValidationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await validateBvn(values).unwrap();

        if (response && BaseUtil.isApiResponseSuccessful(response)) {
          toast.success("BVN validated successfully");
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
        id="bvn"
        name="bvn"
        label="BVN (11 digits)"
        type="text"
        placeholder="Enter your BVN"
        value={formik.values.bvn}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.bvn && formik.errors.bvn
            ? (formik.errors.bvn as string)
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Validating..." : "Validate BVN"}
      </Button>
    </form>
  );
};
