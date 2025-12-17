"use client";

import AuthLayout from "@/components/layouts/AuthLayout";
import { useOtp } from "@/utilities/context/otpContext";
import VerifyOtpForm from "./forms/VerifyOtpForm";
import VerifyOtpIcon from "@/components/ui/icons/verifyOtpIcon";

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
      </div>
    </AuthLayout>
  );
}
