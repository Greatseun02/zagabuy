import { BaseResponse } from "@/utilities/types";
import { UserEntity } from "./ReadAllUsersResponse";

export type ReadByUserIdResponse = BaseResponse<UserEntity>;
