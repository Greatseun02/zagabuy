import { Button as BaseButton } from "@/components/ui/button";
import { Input as BaseInput } from "@/components/ui/input";
import { completeEnrollmentRequestInit } from "@/models/requests/authentication/CompleteEnrollmentRequest";
import { completePasswordResetRequestInit } from "@/models/requests/authentication/CompletePasswordResetRequest";
import { AuthValidation } from "@/models/validations/AuthValidation";
import {
  useCompletePasswordResetMutation,
  useResendOtpMutation,
} from "@/services/authService";
import { BaseUtil } from "@/utilities/baseUtil";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import { useOtp } from "@/utilities/context/otpContext";
import { useFormik } from "formik";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CompleteForgotPasswordForm({
  userEmail,
  setEmail,
}: {
  userEmail: string;
  setEmail: (email: string) => void;
}) {
  const [completePasswordReset] = useCompletePasswordResetMutation();
  const [resendOtp] = useResendOtpMutation();
  const router = useRouter();
  const { showOtp } = useOtp();

  const formik = useFormik({
    initialValues: { ...completePasswordResetRequestInit, userEmail },
    async onSubmit(data) {
      //show otp
      showOtp({
        title: "Verify OTP",
        subtitle: `Enter password sent to your email ${userEmail} to reset password`,
        //complete reset
        async onValidOtpEntered(otp) {
          const completePasswordResetResponse = await completePasswordReset({
            ...data,
            otp,
            userEmail,
          }).unwrap();

          //redirect to login if success
          if (BaseUtil.isApiResponseSuccessful(completePasswordResetResponse)) {
            toast.success(
              completePasswordResetResponse.responseMessage ??
                "Password Successfuly Reset"
            );
            router.push(RouteConstant.auth.login.path);
          }
        },
        numberOfInputs: 6,
        //resend otp logic
        async onResend() {
          const resendResponse = await resendOtp({ userEmail }).unwrap();
          if (BaseUtil.isApiResponseSuccessful(resendResponse)) {
            toast.success(
              resendResponse.responseMessage ?? "Password Successfuly Reset"
            );
          }
        },
      });
    },
    validationSchema: AuthValidation.completePasswordReset,
  });
  return (
    <>
      <BaseInput
        name={"userPassword"}
        formik={formik}
        label="Enter Password"
        placeholder="********"
        type="password"
      />
      <BaseInput
        name={"userPasswordConfirmation"}
        formik={formik}
        label="Confirm Password"
        placeholder="********"
        type="password"
      />
      <div className="flex gap-2">
        <BaseButton
          className="flex-1"
          onClick={() => setEmail("")}
          isLoading={formik.isSubmitting}
          variant={"outline"}
          startIcon={<ArrowLeft />}
        >
          Back
        </BaseButton>
        <BaseButton
          className="flex-1"
          onClick={() => formik.submitForm()}
          isLoading={formik.isSubmitting}
        >
          Submit
        </BaseButton>
      </div>
    </>
  );
}
