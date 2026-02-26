export type ValidateNinRequest = {
  idNumber: string;
  dob: string;
  firstName: string;
  lastName: string;
  reference: string;
};

export const ValidateNinInit: ValidateNinRequest = {
  idNumber: "",
  dob: "",
  firstName: "",
  lastName: "",
  reference: "",
};
