export type InitiateEnrollmentRequest = {
  userEmail: string;
  userPassword: string;
  userFirstName: string;
  userLastName: string;
  userRoleId: string;
};

export const initiateEnrollmentRequestInit: InitiateEnrollmentRequest = {
  userEmail: "",
  userPassword: "",
  userFirstName: "",
  userLastName: "",
  userRoleId: "",
};
