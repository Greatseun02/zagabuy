"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initiatePasswordResetRequestInit } from "@/models/requests/authentication/InitiatePasswordResetRequest";
import { AuthValidation } from "@/models/validations/AuthValidation";
import { useInitiatePasswordResetMutation } from "@/services/authService";
import { BaseUtil } from "@/utilities/baseUtil";
import { useFormik } from "formik";
import { toast } from "sonner";

export default function InitiateForgotPasswordForm({
  setEmail,
}: {
  setEmail: (email: string) => void;
}) {
  //Get Api Func
  const [initiateForgotPassword] = useInitiatePasswordResetMutation();
  //Formik Logic
  const formik = useFormik({
    initialValues: initiatePasswordResetRequestInit,
    //Call Endpoint, If Success Set Email
    async onSubmit(values) {
      const initiateForgotPasswordResponse = await initiateForgotPassword({
        userEmail: values.userEmail,
      }).unwrap();

      if (BaseUtil.isApiResponseSuccessful(initiateForgotPasswordResponse)) {
        toast.success("User Account Found.");
        setEmail(values.userEmail);
      }
    },
    validationSchema: AuthValidation.initiatePasswordReset,
  });
  return (
    <>
      <Input
        label="Email"
        placeholder="johndoe@gmail.com"
        formik={formik}
        name="userEmail"
      />
      <Button
        onClick={() => formik.handleSubmit()}
        isLoading={formik.isSubmitting}
      >
        Submit
      </Button>
    </>
  );
}
