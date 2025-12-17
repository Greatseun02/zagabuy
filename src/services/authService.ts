import { BaseService } from "@/configs/serviceConfig";
import { ApiRequestMethodsEnum } from "@/utilities/enums/apiRequestMethodsEnum";
import { ApiTagsEnum } from "@/utilities/enums/apiTagsEnum";
import { LoginRequest } from "@/models/requests/authentication/LoginRequest";
import { LoginResponse } from "@/models/responses/authentication/LoginResponse";
import { InitiateEnrollmentRequest } from "@/models/requests/authentication/InitiateEnrollmentRequest";
import { InitiateEnrollmentResponse } from "@/models/responses/authentication/InitiateEnrollmentResponse";
import { ResendOtpRequest } from "@/models/requests/authentication/ResendOtpRequest";
import { ResendOtpResponse } from "@/models/responses/authentication/ResendOtpResponse";
import { CompleteEnrollmentRequest } from "@/models/requests/authentication/CompleteEnrollmentRequest";
import { CompleteEnrollmentResponse } from "@/models/responses/authentication/CompleteEnrollmentResponse";
import { ChangePasswordRequest } from "@/models/requests/authentication/ChangePasswordRequest";
import { ChangePasswordResponse } from "@/models/responses/authentication/ChangePasswordResponse";
import { InitiatePasswordResetRequest } from "@/models/requests/authentication/InitiatePasswordResetRequest";
import { InitiatePasswordResetResponse } from "@/models/responses/authentication/InitiatePasswordResetResponse";
import { CompletePasswordResetRequest } from "@/models/requests/authentication/CompletePasswordResetRequest";
import { CompletePasswordResetResponse } from "@/models/responses/authentication/CompletePasswordResetResponse";
import { authStore } from "@/stores/authStore";
import { BaseUtil } from "@/utilities/baseUtil";

const controller = "authentication";
export const authenticationService = BaseService.appClient.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: `/${controller}/login`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          //handle error
          const { data } = await queryFulfilled;
          if (BaseUtil.isApiResponseSuccessful(data)) {
            dispatch(authStore.mutation.setCoreAuthState(data));
          }
          //   else {

          //   }
        } catch (error) {
          // Handle login error
          BaseUtil.logger("Login failed:", error);
        }
      },
      invalidatesTags: [{ type: ApiTagsEnum.Authentication, id: "LIST" }],
    }),
    initiateEnrollment: builder.mutation<
      InitiateEnrollmentResponse,
      InitiateEnrollmentRequest
    >({
      query: (data) => ({
        url: `/${controller}/initiate-enrollment`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: [{ type: ApiTagsEnum.Authentication, id: "LIST" }],
    }),
    completeEnrollment: builder.mutation<
      CompleteEnrollmentResponse,
      CompleteEnrollmentRequest
    >({
      query: (data) => ({
        url: `/${controller}/complete-enrollment`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: [{ type: ApiTagsEnum.Authentication, id: "LIST" }],
    }),
    resendOtp: builder.mutation<ResendOtpResponse, ResendOtpRequest>({
      query: (data) => ({
        url: `/${controller}/resend-otp`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: [{ type: ApiTagsEnum.Authentication, id: "LIST" }],
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (data) => ({
        url: `/${controller}/change-password`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: [{ type: ApiTagsEnum.Authentication, id: "LIST" }],
    }),
    initiatePasswordReset: builder.mutation<
      InitiatePasswordResetResponse,
      InitiatePasswordResetRequest
    >({
      query: (data) => ({
        url: `/${controller}/initiate-password-reset`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: [{ type: ApiTagsEnum.Authentication, id: "LIST" }],
    }),
    completePasswordReset: builder.mutation<
      CompletePasswordResetResponse,
      CompletePasswordResetRequest
    >({
      query: (data) => ({
        url: `/${controller}/complete-password-reset`,
        method: ApiRequestMethodsEnum.POST,
        body: data,
      }),
      invalidatesTags: [{ type: ApiTagsEnum.Authentication, id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useInitiateEnrollmentMutation,
  useCompleteEnrollmentMutation,
  useResendOtpMutation,
  useChangePasswordMutation,
  useInitiatePasswordResetMutation,
  useCompletePasswordResetMutation,
} = authenticationService;
