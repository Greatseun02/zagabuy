export type UpdateUserRequest = {
  userEmail?: string;
  userFirstName?: string;
  userId: number;
  userLastName?: string;
  userPassword?: string;
  userPhoneNumber?: string;
  userProfilePictureUrl?: string;
  userRoleId?: number;
  userStatus?: string;
  userUsername?: string;
};
export const updateUserRequestInit: UpdateUserRequest = {
  userEmail: "",
  userFirstName: "",
  userId: 0,
  userLastName: "",
  userPassword: "",
  userPhoneNumber: "",
  userProfilePictureUrl: "",
  userRoleId: 0,
  userStatus: "",
  userUsername: "",
};
