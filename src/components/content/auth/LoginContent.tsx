import AuthLayout from "@/components/layouts/AuthLayout";
import LoginForm from "./forms/LoginForm";
import ZagabuyLogo from "@/components/custom/ZagabuyLogo";

export default function LoginContent() {
  return (
    <AuthLayout pageTitle="Login to your account">
      <LoginForm />
    </AuthLayout>
  );
}
