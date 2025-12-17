"use client";

import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { appConfig } from "@/configs/appConfig";
import { BaseResponse } from "@/utilities/types";
import { BaseUtil } from "@/utilities/baseUtil";
import { RootState } from "@/stores";
import { ApiTagsEnum } from "@/utilities/enums/apiTagsEnum";
import { authStore } from "@/stores/authStore";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import { toast } from "sonner";

// Extended FetchArgs to include expected response codes
interface ExtendedFetchArgs extends FetchArgs {
  expectedResponseCodes?: string[]; // Response codes that should not trigger error handling
  // skipGlobalErrorHandling?: boolean; // Completely skip global error handling
}

const handleApiError = (
  error: FetchBaseQueryError,
  api: BaseQueryApi,
  expectedResponseCodes?: string[]
) => {
  const status = error.status;
  const data = error.data as BaseResponse;
  const defaultMessage = "An unexpected error occurred";
  const message = data?.responseMessage || defaultMessage;
  const responseCode = data?.responseCode;
  // Skip error handling if this response code is expected by the caller

  // Handle session expiration
  if (
    message.includes("JWT") ||
    message.toLowerCase().includes("invalid authorization token")
  ) {
    // show a unique toast for session expiry
    toast.error("Session expired, kindly login", { id: "session-expired" });
    // clear auth state
    api.dispatch(authStore.action.logout());
    // redirect to login when possible
    if (typeof window !== "undefined") {
      try {
        window.location.href = RouteConstant.auth.login.path;
      } catch (e) {
        // fallback: no-op
      }
    }
    return;
  }

  // Handle specific error types
  switch (status) {
    case 400:
      // Don't show toast for validation errors - let form handle them
      break;
    case 403:
      toast.error("Forbidden resource", { id: "forbidden" });
      break;
    case 404:
      toast.error("Resource not found", { id: "not-found" });
      break;
    case 500:
      toast.error("Server error", { id: "server-error" });
      break;
    case "FETCH_ERROR":
      toast.error("Network error, please check your connection", {
        id: "network-error",
      });
      break;
    case "TIMEOUT_ERROR":
      toast.error("Request timed out, try again later", {
        id: "timeout-error",
      });
      break;
    default:
      if (
        message &&
        message !== defaultMessage &&
        !(
          expectedResponseCodes &&
          responseCode &&
          expectedResponseCodes.includes(responseCode)
        )
      ) {
        toast.error(message, {
          id: `error-${status}`,
        });
      }
  }
};

const baseQuery = fetchBaseQuery({
  baseUrl: appConfig[`baseUrl${appConfig.stage}`],
  prepareHeaders: (headers, { getState }) => {
    const authState = (getState() as RootState).auth;
    const token = authState?.token || "";

    // Ensure the Authorization header uses Bearer scheme unless already present
    const authHeader = token
      ? token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`
      : "";
    if (authHeader) headers.set("Authorization", authHeader);

    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    return headers;
  },
  timeout: 29000,
  referrerPolicy: "no-referrer",
});

const baseQueryWithErrorHandling: BaseQueryFn<
  string | ExtendedFetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  BaseUtil.logger("requestArgument: ", args);

  // Extract our custom properties
  let expectedResponseCodes: string[] | undefined;
  let cleanArgs = args;

  if (typeof args === "object" && "expectedResponseCodes" in args) {
    expectedResponseCodes = args.expectedResponseCodes;
    // skipGlobalErrorHandling = args.skipGlobalErrorHandling || false;

    // Remove our custom properties before passing to baseQuery
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { expectedResponseCodes: _, ...rest } = args;
    cleanArgs = rest;
  }

  const result = await baseQuery(cleanArgs, api, extraOptions);

  // Handle API errors
  if (result.error) {
    handleApiError(result.error, api, expectedResponseCodes);
  }

  // Check for custom business logic errors
  if (
    result.data &&
    !BaseUtil.isApiResponseSuccessful(result.data as BaseResponse)
  ) {
    handleApiError(
      {
        status: "CUSTOM_ERROR",
        data: result.data,
        error: "",
      },
      api,
      expectedResponseCodes
    );
  }

  BaseUtil.logger("result: ", result);
  return result;
};
// Create base API instance
const baseApi = createApi({
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: Object.values(ApiTagsEnum),
  endpoints: () => ({}),
  keepUnusedDataFor: 60, // 60 seconds cache lifetime
  refetchOnReconnect: true,
});

export const BaseService = {
  appClient: baseApi,
};
