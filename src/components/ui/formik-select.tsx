"use client";

import React, { useEffect, useState } from "react";
import { FormikValues } from "formik";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Formik } from "@/utilities/types";

/**
 * Option type for FormikSelect component
 */
export type FormikSelectOption<V = string | number> = {
  value: V;
  label: string;
  group?: string;
  disabled?: boolean;
};

/**
 * FormikSelect component props - wrapper around Radix Select with Formik integration
 */
export type FormikSelectProps<
  T extends FormikValues = any,
  V = string | number
> = {
  /** Label for the select */
  label?: string;
  /** Helper/descriptive text */
  helperText?: string;
  /** Error message (takes precedence over helperText) */
  error?: string;
  /** Options to display */
  options: FormikSelectOption<V>[];
  /** Placeholder when no option is selected */
  placeholder?: string;
  /** Size variant */
  size?: "sm" | "default";
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Callback when value changes */
  onValueChange?: (value: V, prevValue?: V) => void;
  /** Formik instance for form integration */
  formik?: Formik<T>;
  /** Field name for Formik */
  name?: string;
  /** Controlled value */
  value?: V;
  /** Custom container className */
  containerClassName?: string;
};

/**
 * FormikSelect - A reusable select component with Formik integration
 * Built on top of Radix UI Select for accessibility and flexibility
 *
 * @example
 * ```tsx
 * const [formik] = useFormik({
 *   initialValues: { country: "" },
 *   onSubmit: (values) => console.log(values),
 * });
 *
 * <FormikSelect
 *   label="Country"
 *   name="country"
 *   formik={formik}
 *   options={[
 *     { value: "us", label: "United States" },
 *     { value: "uk", label: "United Kingdom" },
 *   ]}
 *   placeholder="Choose a country..."
 * />
 * ```
 */
const FormikSelect = React.forwardRef<HTMLDivElement, FormikSelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      placeholder = "Select an option",
      size = "default",
      disabled = false,
      onValueChange,
      formik,
      name = "",
      value,
      containerClassName,
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = useState<string | number>("");

    // Get value from prop, formik, or local state
    const syncValue = value !== undefined ? value : formik?.values?.[name];

    useEffect(() => {
      if (syncValue !== undefined) {
        setSelectedValue(syncValue);
      }
    }, [syncValue]);

    // Check for error
    const hasError =
      error ||
      (formik && name && formik.touched?.[name] && formik.errors?.[name]);

    // Handle value change
    const handleValueChange = (newValue: string | number) => {
      const prevValue = selectedValue;
      setSelectedValue(newValue);
      onValueChange?.(newValue, prevValue);

      if (formik && name) {
        formik.setFieldValue(name, newValue, true); // validate immediately
        formik.setFieldTouched(name, true, false); // mark touched, don't revalidate again
      }
    };

    // Group options by group property
    const groupedOptions = options.reduce((acc, opt) => {
      const groupKey = opt.group || "__ungrouped__";
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(opt);
      return acc;
    }, {} as Record<string, FormikSelectOption[]>);

    return (
      <div ref={ref} className={cn("w-full space-y-1.5", containerClassName)}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}

        {/* Select Trigger */}
        <Select
          value={String(selectedValue)}
          onValueChange={(val) => handleValueChange(val)}
          disabled={disabled}
        >
          <SelectTrigger
            size={size}
            className={cn(
              hasError &&
                "border-destructive bg-destructive/5 focus-visible:ring-destructive"
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          {/* Select Content */}
          <SelectContent>
            {Object.entries(groupedOptions).map(([groupKey, groupOptions]) => (
              <React.Fragment key={groupKey}>
                {groupKey !== "__ungrouped__" && (
                  <SelectLabel>{groupKey}</SelectLabel>
                )}
                {groupOptions.map((option) => (
                  <SelectItem
                    key={String(option.value)}
                    value={String(option.value)}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>

        {/* Helper/Error Text */}
        {(helperText || hasError) && (
          <p
            className={cn(
              "text-xs font-medium",
              hasError ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {error ||
              (formik && name && formik.errors?.[name]
                ? String(formik.errors[name])
                : helperText)}
          </p>
        )}
      </div>
    );
  }
);

FormikSelect.displayName = "FormikSelect";

export { FormikSelect };
export default FormikSelect;
