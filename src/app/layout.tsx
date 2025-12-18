import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  GlobalModalProvider,
  ReduxProvider,
  ThemeProvider,
  ToastProvider,
} from "@/components/custom/providers";
import ThemeSwitcher from "@/components/custom/ThemeSwitcher";
import { IBM_Plex_Sans } from "next/font/google";
import { Montserrat } from "next/font/google";
import { OtpProvider } from "@/utilities/context/otpContext";

export const metadata: Metadata = {
  title: "ZagaBuy",
  description: "List your products and get live analytics.",
};

export const inter = IBM_Plex_Sans({
  variable: "--font-primary",
  subsets: ["latin"],
});

export const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased relative`}
      >
        <ThemeProvider>
          <OtpProvider>
            <ToastProvider />
            <ReduxProvider>
              <GlobalModalProvider>{children}</GlobalModalProvider>
              {/* <ThemeSwitcher /> */}
            </ReduxProvider>
          </OtpProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
