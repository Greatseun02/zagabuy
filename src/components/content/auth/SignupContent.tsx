import AuthLayout from "@/components/layouts/AuthLayout";
import SignupForm from "./forms/SignupForm";

export default function SignupContent() {
  return (
    <AuthLayout
      pageTitle="Create your account"
      actionable={{
        text: "Already have an account?",
        linkText: "Log in",
        linkHref: "/auth/login",
      }}
    >
      <SignupForm />
    </AuthLayout>
  );
}
