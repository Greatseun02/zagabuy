import { FormikValues, useFormik } from "formik";
import { CSSProperties } from "react";

export type Formik<Values extends FormikValues = FormikValues> = ReturnType<
  typeof useFormik<Values>
>;

export interface CustomCSSProperties extends CSSProperties {
  [key: `--${string}`]: string | number;
}

export type BaseResponse<T = any> = {
  responseCode: string;
  responseMessage: string;
  data?: T;
};

export type BaseErrorResponse = {
  type: string;
  title: string;
  status: number;
  errors: {
    [key: string]: string[];
  };
  traceId: string;
};

export type ReadJson = {
  showAllFields: boolean;
  fields: [
    {
      key: string;
      label: string;
    }
  ];
  readEndpoint: string;
  uniqueColId: string; // the unique field for the entity
};

export type ModuleJson = [
  {
    moduleName: string;
    moduleItems: [
      {
        title: string;
        tabRoute: string; // the route to the page to find the appropriate component
      }
    ];
  }
];

export type formJson = [
  {
    name: string; //fieldName,
    label: string; // custom display label
    valueDataType: string | number | boolean | object | null | undefined;
    inputType:
      | "button"
      | "checkbox"
      | "color"
      | "date"
      | "datetime-local"
      | "email"
      | "file"
      | "hidden"
      | "image"
      | "month"
      | "number"
      | "password"
      | "radio"
      | "range"
      | "reset"
      | "search"
      | "submit"
      | "tel"
      | "text"
      | "time"
      | "url"
      | "week"
      | "select";
  }
];

/**
 * Normalized user object for application use
 */
export interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  status: string;

  // Role information
  // role: string;
  // roleId: number;
  // roleLevel: number; // Computed from role hierarchy

  // Permissions (from privileges field)
  permissions: string[];

  // Entity (company) information
  entity: {
    id: string;
    firsId: string;
    companyName: string;
    tin: string;
    sector: string;
  };

  // Current business context
  currentBusiness: {
    id: number;
    reference: string;
    firsId: string;
    tin: string;
  };

  // All businesses user has access to
  businesses: Array<{
    id: number;
    reference: string;
    firsId: string;
    tin: string;
    status: string;
  }>;

  // Metadata
  createdAt: string;
  updatedAt: string;
}
