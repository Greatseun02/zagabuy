import { combineReducers } from "@reduxjs/toolkit";

import { authStore } from "@/stores/authStore";
import { BaseService } from "@/configs/serviceConfig";

import { user } from "@/stores/user";
import { fileStore } from "./fileStore";

export const rootReducer = combineReducers({
  auth: authStore.reducer,
  user: user.reducer,
  file: fileStore.reducer,
  [BaseService.appClient.reducerPath]: BaseService.appClient.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
