"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { RouteConstant } from "@/utilities/constants/routeConstant";

type OtpConfig = {
  title: string;
  subtitle: string;
  onValidOtpEntered: (otp: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
  numberOfInputs?: number;
};

type OtpContextType = {
  showOtp: (config: OtpConfig) => void;
  config: OtpConfig | null;
};

export const otpDefaultConfig: Omit<OtpConfig, "numberOfInputs"> & {
  numberOfInputs: number;
} = {
  numberOfInputs: 6,
  title: "Verify OTP",
  subtitle: "We've sent a verification code to your email",
  onValidOtpEntered: () => {},
};

const OtpContext = createContext<OtpContextType | undefined>(undefined);

export const OtpProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [config, setConfig] = useState<OtpConfig | null>(null);

  const showOtp = (userConfig: OtpConfig) => {
    // Merge user config with defaults
    const mergedConfig: OtpConfig = {
      title: userConfig?.title ?? otpDefaultConfig.title,
      subtitle: userConfig?.subtitle ?? otpDefaultConfig.subtitle,
      onValidOtpEntered:
        userConfig?.onValidOtpEntered ?? otpDefaultConfig.onValidOtpEntered,
      onResend: userConfig?.onResend ?? otpDefaultConfig.onResend,
      numberOfInputs:
        userConfig?.numberOfInputs ?? otpDefaultConfig.numberOfInputs,
    } as OtpConfig;

    setConfig(mergedConfig);
    router.push(RouteConstant.auth.verifyOtp.path);
  };

  return (
    <OtpContext.Provider value={{ showOtp, config }}>
      {children}
    </OtpContext.Provider>
  );
};

export const useOtp = () => {
  const context = useContext(OtpContext);
  if (!context) {
    throw new Error("useOtp must be used within an OtpProvider");
  }
  return context;
};
