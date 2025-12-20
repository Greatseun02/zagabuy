export type ReadAllUsersResponse = {
  data: {
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
  }[];
  responseCode: string;
  responseMessage: string;
};
