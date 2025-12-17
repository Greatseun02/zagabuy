import * as Yup from "yup";

export class AuthValidation {
  static specialCharactersRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*$/;
  static initiateEnrollment = Yup.object().shape({
    userEmail: Yup.string().email("Invalid email address"),
    userPassword: Yup.string().required("Password Is Required."),
    userFirstName: Yup.string().required("First Name Is Required."),
    userLastName: Yup.string().required("Last Name Is Required."),
    userRoleId: Yup.number()
      .required("Role Is Required.")
      .typeError("RoleId is a number"),
    userDisplayName: Yup.string(),
  });

  static login = Yup.object().shape({
    userEmail: Yup.string()
      .email("Invalid email address")
      .required("Email Is Required."),
    userPassword: Yup.string().required("Password Is Required."),
  });

  static completePasswordReset = Yup.object().shape({
    userPassword: Yup.string().required("Password Is Required."),
    userPasswordConfirmation: Yup.string()
      .equals([Yup.ref("userPassword"), null], "Passcode Does Not Match")
      .required("Confirm Password Is Required."),
    // otp: Yup.string().required("OTP is Required."),
    userEmail: Yup.string().required("User Email is Required"),
  });

  static initiatePasswordReset = Yup.object().shape({
    userEmail: Yup.string().required("User Email is Required"),
  });

  static changePassword = Yup.object().shape({
    customerPassword: Yup.string()
      .min(4, "Passcode Must Not Be Less Than 4")
      .max(4, "Passcode Must Not Be Less Than 4")
      .required("Passcode Is Required."),
    customerPasswordConfirmation: Yup.string()
      .equals([Yup.ref("customerPassword"), null], "Passcode Does Not Match")
      .required("Confirm Passcode Is Required."),
  });
  static contactSupport = Yup.object().shape({
    contactEmail: Yup.string(),
    contactMessage: Yup.string().required("Message is Required."),
    contactSubject: Yup.string().required("Subject is Required."),
  });
}
