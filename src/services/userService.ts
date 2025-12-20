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
import { ReadByEntityIdResponse } from "@/models/responses/user/ReadByEntityIdResponse";

const controller = "user";
export const userService = BaseService.appClient.injectEndpoints({
  endpoints: (builder) => ({
    readAllUsers: builder.query<ReadAllUsersResponse, void>({
      query: () => ({
        url: `/${controller}/read`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: [{ type: ApiTagsEnum.User, id: "LIST" }],
    }),
    readUsersByRoleId: builder.query<ReadAllUsersResponse, string | number>({
      query: (roleId) => ({
        url: `/${controller}/read-by-user-role-id/${roleId}`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: [{ type: ApiTagsEnum.User, id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useReadAllUsersQuery,
  useLazyReadAllUsersQuery,
  useReadUsersByRoleIdQuery,
  useLazyReadUsersByRoleIdQuery,
} = userService;
