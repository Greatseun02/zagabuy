import React from "react";
import Typography from "@/components/ui/typography";
import { Button as BaseButton } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";

type ActionButtonProps = Omit<ButtonProps, "children"> & {
  text: string;
};

type NotFoundProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionButton?: ActionButtonProps;
  secondaryActionButton?: ActionButtonProps;
  children?: React.ReactNode;
};

const DefaultIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="text-gray-400"
  >
    <path d="M12 2 L12 12" />
    <circle cx="12" cy="16" r="1" />
  </svg>
);

export default function NotFound({
  title = "Not Found",
  description = "The requested resource could not be found.",
  icon,
  actionButton,
  secondaryActionButton,
  children,
}: NotFoundProps) {
  const displayIcon = icon ?? <DefaultIcon />;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="p-15 text-secondary-foreground rounded-full bg-secondary flex items-center justify-center mb-4">
        {displayIcon}
      </div>
      <Typography component="h3" variant="display" size="md" weight="semibold">
        {title}
      </Typography>
      <Typography
        component="p"
        variant="text"
        size="sm"
        color="muted-foreground"
        className="mt-2 text-center max-w-md"
      >
        {description}
      </Typography>
      <div className="flex gap-3 mt-4">
        {actionButton && (
          <BaseButton {...actionButton}>{actionButton.text}</BaseButton>
        )}
        {secondaryActionButton && (
          <BaseButton {...secondaryActionButton}>
            {secondaryActionButton.text}
          </BaseButton>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
