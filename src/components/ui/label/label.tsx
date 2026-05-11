"use client";

import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { IconRenderProps, IconType } from "@/utilities/types/iconTypes";
import { useIconRenderer } from "@/utilities/helpers/iconRenderer";

export interface LabelProps {
  /** The label text */
  label: string;
  /** Whether the field is required */
  required?: boolean;
  /** Icon to display */
  icon?: IconType;
  /** Icon position */
  iconPosition?: "left" | "right";
  /** Props for the icon */
  iconProps?: IconRenderProps;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: CSSProperties;
  /** HTML for attribute */
  htmlFor?: string;
}

const RequiredIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 0L4.8 2.4H7.2L5.2 3.6L6 6L4 4.8L2 6L2.8 3.6L0.8 2.4H3.2L4 0Z"
      fill="currentColor"
    />
  </svg>
);

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      label,
      required = false,
      icon,
      iconPosition = "left",
      iconProps,
      className,
      style,
      htmlFor,
    },
    ref,
  ) => {
    const { render: renderIcon } = useIconRenderer();

    const renderedIcon = icon
      ? renderIcon(icon, {
          className: "shrink-0",
          ...iconProps,
        })
      : null;

    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium text-gray-900",
          className,
        )}
        style={style}
      >
        {icon && iconPosition === "left" && renderedIcon}
        <span>{label}</span>
        {required && (
          <RequiredIcon className="text-error-500 shrink-0 ml-0.5" />
        )}
        {icon && iconPosition === "right" && renderedIcon}
      </label>
    );
  },
);

Label.displayName = "Label";

export default Label;
