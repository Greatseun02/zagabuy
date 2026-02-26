import * as yup from "yup";

export const ValidateBvnValidationSchema = yup.object().shape({
  bvn: yup
    .string()
    .required("BVN is required")
    .matches(/^\d{11}$/, "BVN must be 11 digits"),
  dob: yup
    .string()
    .required("Date of birth is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  reference: yup
    .string()
    .optional()
    .min(3, "Reference must be at least 3 characters"),
});

export const ValidateNinValidationSchema = yup.object().shape({
  idNumber: yup
    .string()
    .required("NIN is required")
    .matches(/^\d{11}$/, "NIN must be 11 digits"),
  dob: yup
    .string()
    .required("Date of birth is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  reference: yup
    .string()
    .optional()
    .min(3, "Reference must be at least 3 characters"),
});
