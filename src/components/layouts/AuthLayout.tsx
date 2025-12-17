"use client";

import { ReactNode } from "react";
// import AuthAnimation from "@/assets/animations/authAnimation.lottie";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import ZagabuyLogo from "../custom/ZagabuyLogo";
import Typography from "../ui/typography";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import Link from "next/link";

export type AuthLayoutProps = {
  children: ReactNode;
  pageTitle: string;
  actionable?: {
    text?: string;
    linkText?: string;
    linkHref?: string;
  };

  showLogo?: boolean;
};

export default function AuthLayout({
  children,
  showLogo = true,
  pageTitle,
  actionable = {
    linkHref: RouteConstant.auth.signup.path,
    linkText: "Create an account",
    text: "New to Zagabuy?",
  },
}: AuthLayoutProps) {
  return (
    <div className="flex h-dvh relative ">
      {showLogo && (
        <ZagabuyLogo
          showText={true}
          className="mb-5 self-center absolute top-3 left-5"
        />
      )}

      <div className="flex-1 items-center flex max-md:hidden">
        <DotLottieReact
          src="https://lottie.host/beed97f9-5692-4043-af3d-1ed2ff7668d3/kkR7gBUGxw.lottie"
          loop
          autoplay
          className="h-fit"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center w-full h-full px-6 py-8">
          <div className="w-full flex flex-col">
            <div className="mb-14">
              <Typography size="2xl" weight="semibold" font="mono">
                {pageTitle}
              </Typography>
              {actionable && (
                <div className="flex gap-1 text-sm">
                  <Typography size="sm" component="span">
                    {actionable.text}
                  </Typography>
                  {actionable.linkHref && actionable.linkText && (
                    <Link
                      href={actionable.linkHref}
                      aria-label={actionable.linkText}
                    >
                      <Typography
                        size="sm"
                        color="muted-foreground"
                        component="span"
                        className="underline hover:text-accent transition-all duration-300 ease-in-out"
                      >
                        {actionable.linkText}
                      </Typography>
                    </Link>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
