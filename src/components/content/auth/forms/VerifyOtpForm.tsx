"use client";

import { Button as BaseButton } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { otpDefaultConfig, useOtp } from "@/utilities/context/otpContext";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";

export default function VerifyOtpForm() {
  const { config } = useOtp();

  const [otp, setOtp] = useState<string>("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        config?.onValidOtpEntered(otp);
      }}
    >
      <InputOTP
        maxLength={config?.numberOfInputs ?? otpDefaultConfig.numberOfInputs}
        pattern={REGEXP_ONLY_DIGITS}
        value={otp}
        onChange={setOtp}
      >
        <InputOTPGroup className="">
          {Array.from({
            length: config?.numberOfInputs ?? otpDefaultConfig.numberOfInputs,
          }).map((_, idx) => (
            <InputOTPSlot
              key={idx}
              index={idx}
              className="rounded-lg size-14"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <BaseButton type="submit" width={"full"} variant={"primary"} className="mt-5">
        Verify Otp
      </BaseButton>
    </form>
  );
}
