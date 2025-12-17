import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginResponse } from "@/models/responses/authentication/LoginResponse";

export type AuthState = {
  token: string;
  loading: boolean;
  userInfo: Omit<LoginResponse, "responseCode" | "responseMessage">;
};

const initialState: AuthState = {
  token: "",
  loading: false,
  userInfo: {} as Omit<LoginResponse, "responseCode" | "responseMessage">,
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
  },
});

export const authStore = {
  reducer: slice.reducer,
  action: action,
  mutation: slice.actions,
};
