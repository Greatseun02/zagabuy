import { FormikValues, useFormik } from "formik";
import { LucideIcon } from "lucide-react";
import { CSSProperties } from "react";
import { IconType } from "./iconTypes";

// Re-export icon types for convenient access
export type {
  IconType,
  IconRenderProps,
  IconConfig,
  IconPosition,
  IconPositionProps,
  IconPropKey,
  UniversalSVGProps,
  SmartSVGProps,
} from "./iconTypes";

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

export type sidebarDataType = {
  label: string;
  href: string;
  icon: LucideIcon;
  showBadge?: boolean;
};
