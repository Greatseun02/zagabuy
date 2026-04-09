"use client";

import { Button as BaseButton } from "@/components/ui/button";
import { Input as BaseInput } from "@/components/ui/input";
import Typography from "@/components/ui/typography";
import {
  LoginRequest,
  loginRequestInit,
} from "@/models/requests/authentication/LoginRequest";
import { AuthValidation } from "@/models/validations/AuthValidation";
import { useLoginMutation } from "@/services/authService";
import { BaseUtil } from "@/utilities/baseUtil";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import { RoleEnum } from "@/utilities/enums/roleEnum";
import { Formik } from "@/utilities/types";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginForm() {
  const [login] = useLoginMutation();
  const router = useRouter();

  const handleLoginSubmit = async (data: LoginRequest) => {
    const response = await login(data).unwrap();

    if (BaseUtil.isApiResponseSuccessful(response)) {
      toast.success("Login successful!");
      //perform redirect logic
      if (response.userRoleId === RoleEnum.ADMIN) {
        router.push(RouteConstant.admin.dashboard.path);
      } else if (
        response.userRoleId === RoleEnum.MERCHANT ||
        response.userRoleId === RoleEnum.AFFILIATE
      ) {
        router.push(RouteConstant.merchant.dashboard.path);
      }
    }
  };

  const formik: Formik<LoginRequest> = useFormik({
    initialValues: loginRequestInit,
    onSubmit: handleLoginSubmit,
    validationSchema: AuthValidation.login,
  });
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <BaseInput
        label="Email"
        placeholder="Enter Email:"
        formik={formik}
        name="userEmail"
        type="email"
      />
      <BaseInput
        label="Password"
        placeholder="Enter Password:"
        formik={formik}
        name="userPassword"
        type="password"
      />
      <div className="flex flex-col gap-1">
        <BaseButton isLoading={formik.isSubmitting} type="submit">
          Login
        </BaseButton>
        <Link href={RouteConstant.auth.forgotPassword.path}>
          <Typography size="sm" weight="regular" color="muted-foreground">
            Forgot Password?
          </Typography>
        </Link>
      </div>
    </form>
  );
}
