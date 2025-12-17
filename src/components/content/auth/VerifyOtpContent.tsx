"use client";

import AuthLayout from "@/components/layouts/AuthLayout";
import { useOtp } from "@/utilities/context/otpContext";
import VerifyOtpForm from "./forms/VerifyOtpForm";
import VerifyOtpIcon from "@/components/ui/icons/verifyOtpIcon";
import Typography from "@/components/ui/typography";

export default function VerifyOtpContent() {
  const { config } = useOtp();

  return (
    <AuthLayout
      pageTitle={config?.title ?? "Verify OTP"}
      actionable={{
        text:
          config?.subtitle ?? "We've sent a verification code to your email",
      }}
    >
      <div className="w-fit">
        <div className="mb-10 flex justify-center">
          <VerifyOtpIcon />
        </div>
        <VerifyOtpForm />
        <Typography className="mt-2 text-center" size="sm">
          Didn&apos;t receive the code?{" "}
          <Typography
            className="cursor-pointer"
            onClick={config?.onResend}
            component="span"
            color="muted-foreground"
            weight="semibold"
          >
            Resend OTP
          </Typography>
        </Typography>
      </div>
    </AuthLayout>
  );
}
