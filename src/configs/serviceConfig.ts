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
// import { toastUtil } from "@/utilities/toastUtil";
import { RootState } from "@/stores";
import { ApiTagsEnum } from "@/utilities/enums/apiTagsEnum";
import { authStore } from "@/stores/authStore";
import { RouteConstant } from "@/utilities/constants/routeConstant";
// import { ModalUtil } from "qucoon-components";
// import { ModalEnum } from "@/utilities/enums/modalEnum";
// import RouterUtil from "@/utilities/routerUtil";

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
    // toastUtil.showUniqueToast(
    //   "session-expired",
    //   "Session expired, kindly login",
    //   "error"
    // );
    api.dispatch(authStore.action.logout());
    if (typeof window !== "undefined") {
      // RouterUtil.navigate(RouteConstant.auth.login.path);
      // console.log("window:", window)
      // window.history.pushState(null, "", RouteConstant.authentication.login.path,)
      // window.location.href = RouteConstant.authentication.login.path;
    }
    return;
  }

  // Handle specific error types
  switch (status) {
    case 400:
      // Don't show toast for validation errors - let form handle them
      break;
    case 403:
      // toastUtil.showUniqueToast("forbidden", "Forbidden resource", "error");
      break;
    case 404:
      // toastUtil.showUniqueToast("not-found", "Resource not found", "error");
      break;
    case 500:
      // toastUtil.showUniqueToast("server-error", "Server error", "error");
      break;
    case "FETCH_ERROR":
      // toastUtil.showUniqueToast(
      //   "network-error",
      //   "Network error, please check your connection",
      //   "error"
      // );
      break;
    case "TIMEOUT_ERROR":
      // toastUtil.showUniqueToast(
      //   "timeout-error",
      //   "Request timed out, try again later",
      //   "error"
      // );
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
        // ModalUtil.getInstance().open(ModalEnum.AppErrorModal, {
        //   message: message,
        //   title: "Error Occurred",
        // });
        // toastUtil.showUniqueToast(`error-${status}`, message, "error");
      }
  }
};

const baseQuery = fetchBaseQuery({
  baseUrl: appConfig[`baseUrl${appConfig.stage}`],
  prepareHeaders: (headers, { getState }) => {
    const authState = (getState() as RootState).auth;
    const token = authState?.token || "";

    headers.set("Authorization", `${token}`);

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
  // let skipGlobalErrorHandling = false;
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

  // Skip all error handling if requested
  // if (skipGlobalErrorHandling) {
  //     return result;
  // }

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
