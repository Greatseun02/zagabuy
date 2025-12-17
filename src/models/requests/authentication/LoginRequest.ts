export type LoginRequest = {
  userEmail: string;
  userPassword: string;
};

export const loginRequestInit: LoginRequest = {
  userEmail: "",
  userPassword: "",
};
