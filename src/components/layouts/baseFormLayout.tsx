"use client";

import React from "react";

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
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        ...style,
      }}
      className={`w-full p-4 rounded-lg  ${className ?? ""}`}
    >
      {title && (
        <header className="mb-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              {description}
            </p>
          )}
        </header>
      )}

      <div className="flex flex-col gap-6">{children}</div>
    </form>
  );
};

export default BaseFormLayout;
