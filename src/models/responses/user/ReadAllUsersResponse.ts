import { BaseResponse } from "@/utilities/types";

export type ReadAllUsersResponse = BaseResponse<UserEntity[]>;

export type UserEntity = {
  userCreatedAt: string;
  userDisplayName: string;
  userEmail: string;
  userFirstName: string;
  userId: number;
  userLastName: string;
  userMerchantScore: number;
  userPassword: string;
  userPhoneNumber: string;
  userProfilePictureUrl: string;
  userRoleId: number;
  userStatus: string;
  userUpdatedAt: string;
  userUsername: string;
};
