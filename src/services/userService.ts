import { BaseService } from "@/configs/serviceConfig";
import { ApiRequestMethodsEnum } from "@/utilities/enums/apiRequestMethodsEnum";
import { ApiTagsEnum } from "@/utilities/enums/apiTagsEnum";
import { UpdateUserRequest } from "@/models/requests/user/UpdateUserRequest";
import { UpdateUserResponse } from "@/models/responses/user/UpdateUserResponse";
import { CreateUserRequest } from "@/models/requests/user/CreateUserRequest";
import { CreateUserResponse } from "@/models/responses/user/CreateUserResponse";
import { DeleteUserRequest } from "@/models/requests/user/DeleteUserRequest";
import { DeleteUserResponse } from "@/models/responses/user/DeleteUserResponse";
import { ReadAllUsersResponse } from "@/models/responses/user/ReadAllUsersResponse";
import { ReadByUserIdResponse } from "@/models/responses/user/ReadByUserIdResponse";

const controller = "user";
export const userService = BaseService.appClient.injectEndpoints({
  endpoints: (builder) => ({
    readAllUsers: builder.query<ReadAllUsersResponse, void>({
      query: () => ({
        url: `/${controller}/read`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: (results) =>
        results && results.data
          ? [
              ...results.data.map((result) => ({
                type: ApiTagsEnum.Deal,
                id: result.userId,
              })),
              { type: ApiTagsEnum.Deal, id: "LIST" },
            ]
          : [{ type: ApiTagsEnum.Deal, id: "LIST" }],
    }),
    readUsersByRoleId: builder.query<ReadAllUsersResponse, string | number>({
      query: (roleId) => ({
        url: `/${controller}/read-by-user-role-id/${roleId}`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: [{ type: ApiTagsEnum.User, id: "LIST" }],
    }),
    readUsersByUserId: builder.query<ReadByUserIdResponse, string | number>({
      query: (userId) => ({
        url: `/${controller}/read-by-user-id/${userId}`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: (result) => [
        { type: ApiTagsEnum.User, id: result?.data?.userId },
      ],
    }),
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: (updateUserRequest) => ({
        url: `/${controller}/update`,
        method: ApiRequestMethodsEnum.POST,
        body: updateUserRequest,
      }),
      invalidatesTags: (_, __, args) => [
        { type: ApiTagsEnum.User, id: args.userId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useReadAllUsersQuery,
  useLazyReadAllUsersQuery,
  useReadUsersByRoleIdQuery,
  useReadUsersByUserIdQuery,
  useLazyReadUsersByRoleIdQuery,
  useUpdateUserMutation,
} = userService;
