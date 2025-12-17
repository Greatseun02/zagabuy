"use client";

import { Button } from "@/components/ui/button";
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
    <form onSubmit={() => config?.onValidOtpEntered(otp)}>
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
      <Button type="submit" width={"full"} variant={"primary"} className="mt-5">
        Verify Otp
      </Button>
    </form>
  );
}
