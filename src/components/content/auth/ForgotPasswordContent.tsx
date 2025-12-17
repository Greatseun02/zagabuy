"use client";

import { useState } from "react";
import InitiateForgotPasswordForm from "./forms/InitiateForgotPasswordForm";
import CompleteForgotPasswordForm from "./forms/CompleteForgotPasswordForm";

import AuthLayout from "@/components/layouts/AuthLayout";

export default function ForgotPasswordContent() {
  const [email, setEmail] = useState("");

  return (
    <AuthLayout pageTitle="Forgot Password Page">
      {email ? (
        <CompleteForgotPasswordForm userEmail={email} setEmail={setEmail} />
      ) : (
        <InitiateForgotPasswordForm setEmail={setEmail} />
      )}
    </AuthLayout>
  );
}
