import { RoleEnum } from "@/utilities/enums/roleEnum";

export type InitiateEnrollmentRequest = {
  userEmail: string;
  userPassword: string;
  userFirstName: string;
  userLastName: string;
  userRoleId: string;
  userDisplayName: string;
};

export const initiateEnrollmentRequestInit: InitiateEnrollmentRequest = {
  userEmail: "",
  userPassword: "",
  userFirstName: "",
  userLastName: "",
  userRoleId: String(RoleEnum.MERCHANT),
  userDisplayName: "",
};
