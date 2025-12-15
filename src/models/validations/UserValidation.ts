import * as Yup from "yup";

export class UserValidation {
  // static specialCharactersRegex = /^[a-zA-Z0-9 ]+$/;
  static specialCharactersRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*$/;
  static addUser = Yup.object().shape({
    userFirstName: Yup.string()
      .required("First Name Is Required.")
      .matches(
        this.specialCharactersRegex,
        "Special characters are not allowed"
      ),
    userEmail: Yup.string()
      .email("Invalid email address")
      .required("Email Is Required."),
    userLastName: Yup.string()
      .required("Last Name Is Required.")
      .matches(
        this.specialCharactersRegex,
        "Special characters are not allowed"
      ),
    userPhoneNumber: Yup.string().required("Phone Number Is Required."),
    userRoleId: Yup.number()
      .positive("Role is Required")
      .required("Role Is Required."),
  });
  static inviteTeamMember = Yup.object().shape({
    userCountryCode: Yup.string().required("Member Country Code Is Required."),
    userFirstName: Yup.string().required("Member First Name Is Required."),
    userLastName: Yup.string().required("Member Last Name Is Required."),
    userEmail: Yup.string().required("Member Email Is Required."),
    userRoleId: Yup.number()
      .positive("Member Role Is Required.")
      .required("Member Role Is Required."),
    userPhone: Yup.string().required("Member Phone Is Required."),
  });
}
