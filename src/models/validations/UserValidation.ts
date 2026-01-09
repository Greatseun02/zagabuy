import * as Yup from "yup";

export class UserValidation {
  // static specialCharactersRegex = /^[a-zA-Z0-9 ]+$/;
  static specialCharactersRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*$/;
  static EditUserProfileSchema = Yup.object().shape({
    userFirstName: Yup.string(),
    userId: Yup.number(),
    userLastName: Yup.string(),
    userPhoneNumber: Yup.string(),
    userUsername: Yup.string(),
  });
}
