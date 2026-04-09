"use client";

import React from "react";
import Typography from "../ui/typography";

export type BaseFormLayoutProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  title?: string;
  description?: string;
  /** Visual variant to change background / accent */
};

const BaseFormLayout = ({
  children,
  title,
  description,
  className,
  style,
  ...props
}: BaseFormLayoutProps) => {
  return (
    <form
      {...props}
      className={`w-full p-6  rounded-2xl border flex gap-6 flex-col ${className ?? ""} backdrop-blur-2xl`}
    >
      {title && (
        <header className="mb-2">
          <Typography weight="semibold" size="2xl" color="foreground">
            {title}
          </Typography>
          {description && (
            <Typography color="muted-foreground" size="sm" className="mt-1">
              {description}
            </Typography>
          )}
        </header>
      )}

      <div className="flex flex-col gap-6">{children}</div>
    </form>
  );
};

export default BaseFormLayout;
