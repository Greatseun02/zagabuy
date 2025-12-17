"use client";

import { Button } from "@/components/ui/button";
import FormikSelect from "@/components/ui/formik-select";
import { Input } from "@/components/ui/input";
import {
  InitiateEnrollmentRequest,
  initiateEnrollmentRequestInit,
} from "@/models/requests/authentication/InitiateEnrollmentRequest";
import { AuthValidation } from "@/models/validations/AuthValidation";
import {
  useCompleteEnrollmentMutation,
  useInitiateEnrollmentMutation,
  useResendOtpMutation,
} from "@/services/authService";
import { BaseUtil } from "@/utilities/baseUtil";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import { useOtp } from "@/utilities/context/otpContext";
import { RoleEnum } from "@/utilities/enums/roleEnum";
import { Formik } from "@/utilities/types";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignupForm() {
  const [signup] = useInitiateEnrollmentMutation();
  const [completeSignup] = useCompleteEnrollmentMutation();
  const [resendOtp] = useResendOtpMutation();
  const { showOtp } = useOtp();
  const router = useRouter();

  //handle signup logic
  const handleSignup = async (data: InitiateEnrollmentRequest) => {
    // Signup logic here
    const response = await signup(data).unwrap();

    //verify otp
    if (BaseUtil.isApiResponseSuccessful(response)) {
      showOtp({
        title: "Verify your email",
        subtitle: `We've sent a verification code to your email ${data.userEmail}.`,
        numberOfInputs: 6,
        //submit otp and complete onboard
        async onValidOtpEntered(otp) {
          //complete onboarding api call
          const completeEnrollmentResponse = await completeSignup({
            userEmail: data.userEmail,
            otp,
          }).unwrap();

          //if success, toast and push to login
          if (BaseUtil.isApiResponseSuccessful(completeEnrollmentResponse)) {
            toast.success("Completed signup successfully.");
            router.push(RouteConstant.auth.login.path);
          }
        },
        //resend otp
        onResend: async () => {
          const resendOtpResponse = await resendOtp({
            userEmail: data.userEmail,
          }).unwrap();
        },
      });
    }
  };

  //handle formik
  const formik: Formik<InitiateEnrollmentRequest> = useFormik({
    initialValues: initiateEnrollmentRequestInit,
    onSubmit: handleSignup,
    validationSchema: AuthValidation.initiateEnrollment,
  });

  return (
    <>
      <div className="flex gap-2">
        <Input
          label="First Name"
          placeholder="John"
          formik={formik}
          name="userFirstName"
          containerClassName="flex-1"
        />
        <Input
          label="Last Name"
          placeholder="Doe"
          formik={formik}
          name="userLastName"
          containerClassName="flex-1"
        />
      </div>
      <Input
        label="Email"
        placeholder="johndoe@gmail.com"
        formik={formik}
        name="userEmail"
        type="email"
      />

      <Input
        label="Password"
        placeholder="**********"
        formik={formik}
        name="userPassword"
        type="password"
      />
      <FormikSelect
        label="Role"
        placeholder="Merchant | Affiliate"
        formik={formik}
        options={[
          {
            label: "Merchant",
            value: RoleEnum.MERCHANT,
          },
          {
            label: "Affiliate",
            value: RoleEnum.AFFILIATE,
          },
        ]}
        name="userRoleId"
      />
      <Input
        label="Merchant display name (optional)"
        placeholder="Enter display name (e.g Zagabuy Store)"
        formik={formik}
        name="userDisplayName"
      />
      <Button onClick={formik.submitForm} isLoading={formik.isSubmitting}>
        Sign up
      </Button>
    </>
  );
}
