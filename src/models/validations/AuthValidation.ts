import * as Yup from "yup";

export class AuthValidation {
  static emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  // static specialCharactersRegex = /^[a-zA-Z0-9 ]+$/;
  static specialCharactersRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*$/;
  static newSignupForm = Yup.object().shape({
    userFirstName: Yup.string()
      .required("First Name Is Required.")
      .matches(
        this.specialCharactersRegex,
        "Special characters are not allowed"
      ),
    userEmail: Yup.string()
      .email("Invalid email address")
      .required("Email Is Required."),
    // userCountryCode: Yup.string().required("Country Code Is Required."),
    userPassword: Yup.string().required("Password Is Required."),
    businessName: Yup.string()
      .required("Business Name is required.")
      .matches(
        /^\w+(\s+\w+)+$/,
        "Business Name must contain at least two words separated by spaces."
      ),
    businessType: Yup.string().required("Business Type Is Required."),
    industryType: Yup.string().required("Industry Type Is Required."),
    businessRegistrationNumber: Yup.string().required(
      "Business Registration Number Is Required."
    ),
    // userConfirmPassword: Yup.string()
    //     .equals([Yup.ref("userPassword"), null], "Passcode Does Not Match")
    //     .required("Confirm Password Is Required."),
    userLastName: Yup.string()
      .required("Last Name Is Required.")
      .matches(
        this.specialCharactersRegex,
        "Special characters are not allowed"
      ),
    userPhone: Yup.string()
      .required("Phone Number Is Required.")
      .min(10, "Invalid Phone Number")
      .max(11, "Invalid Phone Number"),
  });
  // entityCompanyName
  // entitySector
  // entityTin
  // postalAddressCityName
  // postalAddressCountry
  // postalAddressLga
  // postalAddressPostalCode
  // postalAddressState
  // postalAddressStreetName
  // userEmail
  // userFirstName
  // userLastName
  // userPhoneNumber
  static createAccountStepOne = Yup.object().shape({
    entityCompanyName: Yup.string().required("Company Name is required."),
    // .matches(/^\w+(\s+\w+)+$/, "Business Name must contain at least two words separated by spaces."),
    entitySector: Yup.string().required("Business Type Is Required."),
    entityTin: Yup.string().required("TIN Is Required."),
  });
  static createAccountStepTwo = Yup.object().shape({
    postalAddressCityName: Yup.string().required("City Is Required."),
    postalAddressCountry: Yup.string().required("Country Is Required."),
    postalAddressLga: Yup.string().required("Lga Is Required."),
    postalAddressPostalCode: Yup.string().required("Postal Code Is Required."),
    postalAddressState: Yup.string().required("State Is Required."),
    postalAddressStreetName: Yup.string().required("Street Is Required."),
  });
  static createAccountStepThree = Yup.object().shape({
    userFirstName: Yup.string()
      .required("First Name Is Required.")
      .matches(
        this.specialCharactersRegex,
        "Special characters are not allowed"
      ),
    userEmail: Yup.string()
      .email("Invalid email address")
      .required("Email Is Required."),
    // userCountryCode: Yup.string().required("Country Code Is Required."),
    // userPassword: Yup.string().required("Password Is Required."),
    privacyAgreement: Yup.boolean().oneOf(
      [true],
      "You can only proceed after agreeing to terms & conditions."
    ),
    userLastName: Yup.string()
      .required("Last Name Is Required.")
      .matches(
        this.specialCharactersRegex,
        "Special characters are not allowed"
      ),
    userPhoneNumber: Yup.string()
      .required("Receiver's Phone is required")
      .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    // .min(10, "Invalid phone number")
    // .max(11, "Invalid phone number")
    userPassword: Yup.string().required("FIRS Password Is Required."),
    //
    // userPhoneNumber: Yup.string()
    //     .required("Phone Number Is Required.")
    //     .min(10, "Invalid Phone Number")
    //     .max(11, "Invalid Phone Number"),
  });
  static createAccountStepFour = Yup.object().shape({
    userPassword: Yup.string().required("Password Is Required."),
    userPasswordConfirmation: Yup.string()
      .equals([Yup.ref("userPassword"), null], "Password Does Not Match")
      .required("Confirm Password Is Required."),
  });

  static signupWithRubiesAddBusiness = Yup.object().shape({
    businessName: Yup.string()
      .required("Business Name is required.")
      .matches(
        /^\w+(\s+\w+)+$/,
        "Business Name must contain at least two words separated by spaces."
      ),
    businessType: Yup.string().required("Business Type Is Required."),
    industryType: Yup.string().required("Industry Type Is Required."),
    businessRegistrationNumber: Yup.string().required(
      "Business Registration Number Is Required."
    ),
  });
  static login = Yup.object().shape({
    userEmail: Yup.string()
      .email("Invalid email address")
      .required("Email Is Required."),
    userPassword: Yup.string().required("Password Is Required."),
  });
  static signupWithRubies = Yup.object().shape({
    userEmail: Yup.string()
      .email("Invalid email address")
      .required("Email Is Required."),
    userPassword: Yup.string().required("Password Is Required."),
  });
  static resetPasswordRequest = Yup.object().shape({
    userEmail: Yup.string()
      .email("Invalid email address")
      .required("Email Is Required."),
  });
  static resetPassword = Yup.object().shape({
    userPassword: Yup.string().required("Password Is Required."),
    userPasswordConfirmation: Yup.string()
      .equals([Yup.ref("userPassword"), null], "Passcode Does Not Match")
      .required("Confirm Password Is Required."),
  });
  static changePasscode = Yup.object().shape({
    customerOldPassword: Yup.string()
      .min(4, "Passcode Must Not Be Less Than 4")
      .max(4, "Passcode Must Not Be Less Than 4")
      .required("Old Passcode Is Required."),
    customerPassword: Yup.string()
      .min(4, "Passcode Must Not Be Less Than 4")
      .max(4, "Passcode Must Not Be Less Than 4")
      .required("New Passcode Is Required."),
    customerPasswordConfirmation: Yup.string()
      .equals([Yup.ref("customerPassword"), null], "Passcode Does Not Match")
      .required("Confirm Passcode Is Required."),
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
