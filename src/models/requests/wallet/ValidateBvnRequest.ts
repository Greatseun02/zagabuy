export type ValidateBvnRequest = {
  bvn: string;
  dob: string;
  firstName: string;
  lastName: string;
  reference: string;
};

export const ValidateBvnInit: ValidateBvnRequest = {
  bvn: "",
  dob: "",
  firstName: "",
  lastName: "",
  reference: "Zagabuy",
};
