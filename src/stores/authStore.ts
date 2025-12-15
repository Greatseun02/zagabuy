import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginResponse } from "@/models/responses/authentication/LoginResponse";
import { CompletePasswordResetRequest } from "@/models/requests/authentication/CompletePasswordResetRequest";
import { InitiatePasswordResetRequest } from "@/models/requests/authentication/InitiatePasswordResetRequest";
import { LoginRequest } from "@/models/requests/authentication/LoginRequest";
import { CompleteEnrollmentRequest } from "@/models/requests/authentication/CompleteEnrollmentRequest";
import { InitiateEnrollmentRequest } from "@/models/requests/authentication/InitiateEnrollmentRequest";
import { AppUser } from "@/utilities/types";

export type AuthState = {
  token: string;
  loading: boolean;
  userInfo: Omit<LoginResponse, "responseCode" | "responseMessage">;
  completeEnrollmentFlowPayload: CompleteEnrollmentRequest &
    InitiateEnrollmentRequest;
  completePasswordResetFlowPayload: CompletePasswordResetRequest &
    InitiatePasswordResetRequest;
  loginFlowPayload: LoginRequest;
  user: AppUser | null;
  // roleHierarchy: Record<string, number>;
};

const initialState: AuthState = {
  token: "",
  loading: false,
  userInfo: {} as Omit<LoginResponse, "responseCode" | "responseMessage">,
  completeEnrollmentFlowPayload: {} as CompleteEnrollmentRequest &
    InitiateEnrollmentRequest,
  completePasswordResetFlowPayload: {} as CompletePasswordResetRequest &
    InitiatePasswordResetRequest,
  loginFlowPayload: {} as LoginRequest,
  user: null,
  // roleHierarchy: STANDARD_ROLE_HIERARCHY,
};

/**
 * Transform backend login response to internal user format
 * This is the SINGLE transformation point - ensures consistency
 *
 * Time Complexity: O(n) where n = number of permissions
 * Space Complexity: O(n)
 */
const transformBackendUser = (
  response: LoginResponse,
  roleHierarchy: Record<string, number>
): AppUser => {
  return {
    id: response.userId.toString(),
    email: response.userEmail,
    firstName: response.userFirstName,
    lastName: response.userLastName,
    fullName: `${response.userFirstName} ${response.userLastName}`,
    phoneNumber: response.userPhoneNumber,
    status: response.userStatus,

    // role: response.userRoleName,
    // roleId: response.userRoleId,
    // roleLevel: getRoleLevel(response.userRoleName, roleHierarchy),

    // Backend sends "privileges", we normalize to "permissions"
    permissions: response.privileges || [],

    entity: {
      id: response.entityId,
      firsId: response.entityFirsId,
      companyName: response.entityCompanyName,
      tin: response.entityTin,
      sector: response.entitySector,
    },

    currentBusiness: {
      id: response.businesses[0]?.businessId || 0,
      reference: response.entityReference,
      firsId: response.entityFirsId,
      tin: response.entityTin,
    },

    businesses: response.businesses.map((b) => ({
      id: b.businessId,
      reference: b.businessReference,
      firsId: b.businessFirsId,
      tin: b.businessTin,
      status: b.businessStatus,
    })),

    createdAt: response.userCreatedAt,
    updatedAt: response.userUpdatedAt,
  };
};

const action = {
  logout: createAsyncThunk(
    "authentication/action/logout",
    async (_, thunkAPI) => {
      try {
        thunkAPI.dispatch(authStore.mutation.reset());
        return;
      } catch (e: any) {
        return thunkAPI.rejectWithValue(e?.message);
      }
    }
  ),
  // updateUserPermissions: (state, action: PayloadAction<{ role: string; permissions: string[]; roleLevel?: number }>) => {
  //     if (state.user) {
  //         state.user.role = action.payload.role;
  //         state.user.permissions = action.payload.permissions;
  //         if (action.payload.roleLevel !== undefined) {
  //             state.user.roleLevel = action.payload.roleLevel;
  //         }
  //     }
  // },
  //
  // grantPermission: (state, action: PayloadAction<string>) => {
  //     if (state.user && !state.user.permissions.includes(action.payload)) {
  //         state.user.permissions.push(action.payload);
  //     }
  // },
  //
  // revokePermission: (state, action: PayloadAction<string>) => {
  //     if (state.user) {
  //         state.user.permissions = state.user.permissions.filter(p => p !== action.payload);
  //     }
  // },
};
const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    reset: () => ({ ...initialState }),
    setCompleteEnrollmentFlowPayload: (
      state,
      {
        payload,
      }: {
        payload: AuthState["completeEnrollmentFlowPayload"];
      }
    ) => {
      state.completeEnrollmentFlowPayload = payload;
    },
    setCoreAuthState: (
      state,
      {
        payload,
      }: {
        payload: LoginResponse;
      }
    ) => {
      state.token = payload.token;
      state.userInfo = payload;
    },
    /**
     * Update user permissions dynamically
     * Use case: Admin grants new permission to user
     */
    grantPermission: (state, { payload }: PayloadAction<string>) => {
      if (state.user && !state.user.permissions.includes(payload)) {
        state.user.permissions.push(payload);
      }
    },

    revokePermission: (state, { payload }: PayloadAction<string>) => {
      if (state.user) {
        state.user.permissions = state.user.permissions.filter(
          (p) => p !== payload
        );
      }
    },

    /**
     * Bulk update permissions
     * Use case: Role change requires complete permission refresh
     */
    setPermissions: (state, { payload }: PayloadAction<string[]>) => {
      if (state.user) {
        state.user.permissions = payload;
      }
    },

    /**
     * Update role hierarchy (for custom roles)
     * Use case: Backend sends custom role levels
     */
    updateRoleHierarchy: (
      state,
      { payload }: PayloadAction<Record<string, number>>
    ) => {
      // state.roleHierarchy = { ...state.roleHierarchy, ...payload };
      // Recalculate user's role level if user exists
      // if (state.user) {
      //   state.user.roleLevel = getRoleLevel(
      //     state.user.role,
      //     state.roleHierarchy
      //   );
      // }
    },

    setCompletePasswordResetFlowPayload: (
      state,
      {
        payload,
      }: {
        payload: AuthState["completePasswordResetFlowPayload"];
      }
    ) => {
      state.completePasswordResetFlowPayload = payload;
    },
    setLoginFlowPayload: (
      state,
      {
        payload,
      }: {
        payload: AuthState["loginFlowPayload"];
      }
    ) => {
      state.loginFlowPayload = payload;
    },

    resetCompleteEnrollmentFlowPayload: (state) => {
      state.completeEnrollmentFlowPayload = {} as CompleteEnrollmentRequest &
        InitiateEnrollmentRequest;
    },
  },
});

export const authStore = {
  reducer: slice.reducer,
  action: action,
  mutation: slice.actions,
};
