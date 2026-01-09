import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReadAllUsersResponse } from "@/models/responses/user/ReadAllUsersResponse";
import { ReadByUserIdResponse } from "@/models/responses/user/ReadByUserIdResponse";

export type UserState = {
  loading: boolean;
  readAllUsers: ReadAllUsersResponse["data"];
  readByEntityId: ReadByUserIdResponse["data"][];
  activeUser: ReadByUserIdResponse["data"];
};

const initialState: UserState = {
  loading: false,
  readAllUsers: [] as ReadAllUsersResponse["data"],
  readByEntityId: [] as NonNullable<ReadByUserIdResponse["data"]>[],
  activeUser: {} as NonNullable<ReadByUserIdResponse["data"]>,
};

const action = {
  // readAllUsers: createAsyncThunk(
  //     "user/action/readAllUsers",
  //     async (_, thunkAPI) => {
  //         try {
  //             const response: ReadAllUsersResponse = (await UserService.readAllUsers(thunkAPI)).data;
  //             return response
  //         } catch (e: any) {
  //             return thunkAPI.rejectWithValue(e?.message as string);
  //         }
  //     }
  // ),
  // readByEntityId: createAsyncThunk(
  //     "user/action/readByEntityId",
  //     async (_, thunkAPI) => {
  //         try {
  //             const response: ReadByUserIdResponse = (await UserService.readByEntityId(thunkAPI)).data;
  //             return response
  //         } catch (e: any) {
  //             return thunkAPI.rejectWithValue(e?.message as string);
  //         }
  //     }
  // ),
  // updateUser: createAsyncThunk(
  //     "user/action/updateUser",
  //     async (data: UpdateUserRequest, thunkAPI) => {
  //         try {
  //             const response: UpdateUserResponse = (await UserService.updateUser(data, thunkAPI)).data;
  //             return response
  //         } catch (e: any) {
  //             return thunkAPI.rejectWithValue(e?.message as string);
  //         }
  //     }
  // ),
  // createUser: createAsyncThunk(
  //     "user/action/createUser",
  //     async (data: CreateUserRequest, thunkAPI) => {
  //         try {
  //             const response: CreateUserResponse = (await UserService.createUser(data, thunkAPI)).data;
  //             return response
  //         } catch (e: any) {
  //             return thunkAPI.rejectWithValue(e?.message as string);
  //         }
  //     }
  // ),
  // deleteUser: createAsyncThunk(
  //     "user/action/deleteUser",
  //     async (data: DeleteUserRequest, thunkAPI) => {
  //         try {
  //             const response: DeleteUserResponse = (await UserService.deleteUser(data, thunkAPI)).data;
  //             return response
  //         } catch (e: any) {
  //             return thunkAPI.rejectWithValue(e?.message as string);
  //         }
  //     }
  // ),
};
const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    reset: () => ({ ...initialState }),
    setActiveUser: (
      state,
      action: PayloadAction<ReadByUserIdResponse["data"]>
    ) => {
      state.activeUser = action.payload;
    },
    resetActiveUser: (state) => {
      state.activeUser = {} as ReadByUserIdResponse["data"];
    },
  },
  extraReducers: (builder) => {
    // builder
    //     .addCase(action.readAllUsers.pending, (state) => {
    //         state.loading = true;
    //     })
    //     .addCase(action.readAllUsers.fulfilled, (state, action: PayloadAction<ReadAllUsersResponse>) => {
    //         state.loading = false;
    //         if (action.payload.responseCode == BaseEnum.RESPONSE_CODE_SUCCESS) {
    //             state.readAllUsers = action.payload.data
    //         }
    //     })
    //     .addCase(action.readByEntityId.pending, (state) => {
    //         state.loading = true;
    //     })
    //     .addCase(action.readByEntityId.fulfilled, (state, action: PayloadAction<ReadByUserIdResponse>) => {
    //         state.loading = false;
    //         if (action.payload.responseCode == BaseEnum.RESPONSE_CODE_SUCCESS) {
    //             state.readByEntityId = action.payload.data
    //         }
    //     })
    //     .addCase(action.updateUser.pending, (state) => {
    //         state.loading = true;
    //     })
    //     .addCase(action.updateUser.fulfilled, (state) => {
    //         state.loading = false;
    //     })
    //     .addCase(action.createUser.pending, (state) => {
    //         state.loading = true;
    //     })
    //     .addCase(action.createUser.fulfilled, (state) => {
    //         state.loading = false;
    //     })
    //     .addCase(action.deleteUser.pending, (state) => {
    //         state.loading = true;
    //     })
    //     .addCase(action.deleteUser.fulfilled, (state) => {
    //         state.loading = false;
    //     })
  },
});

export const user = {
  reducer: slice.reducer,
  action: action,
  mutation: slice.actions,
};
