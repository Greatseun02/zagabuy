"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LoginRequest,
  loginRequestInit,
} from "@/models/requests/authentication/LoginRequest";
import { AuthValidation } from "@/models/validations/AuthValidation";
import { useLoginMutation } from "@/services/authService";
import { BaseUtil } from "@/utilities/baseUtil";
import { Formik } from "@/utilities/types";
import { useFormik } from "formik";
import { toast } from "sonner";

export default function LoginForm() {
  const [login] = useLoginMutation();

  const handleLoginSubmit = async (data: LoginRequest) => {
    const response = await login(data).unwrap();

    if (BaseUtil.isApiResponseSuccessful(response)) {
      toast.success("Login successful!");
      //perform redirect logic
    }
  };

  const formik: Formik<LoginRequest> = useFormik({
    initialValues: loginRequestInit,
    onSubmit: handleLoginSubmit,
    validationSchema: AuthValidation.login,
  });
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        placeholder="Enter Email:"
        formik={formik}
        name=""
        type="email"
      />
      <Input
        label="Password"
        placeholder="Enter Password:"
        formik={formik}
        name="userPassword"
        type="password"
      />
      <Button isLoading={formik.isSubmitting} type="submit">
        Login
      </Button>
    </form>
  );
}
