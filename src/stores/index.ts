import { combineReducers } from "@reduxjs/toolkit";

import { authStore } from "@/stores/authStore";
import { BaseService } from "@/configs/serviceConfig";

import { user } from "@/stores/user";

export const rootReducer = combineReducers({
  auth: authStore.reducer,

  user: user.reducer,

  [BaseService.appClient.reducerPath]: BaseService.appClient.reducer,
  // authentication: authentication.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
