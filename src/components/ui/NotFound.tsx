import React from "react";

type NotFoundProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

export default function NotFound({
  title = "Not Found",
  description = "The requested resource could not be found.",
  children,
}: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {/* placeholder icon area - replace image later */}
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
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-2 text-center max-w-md">
        {description}
      </p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
