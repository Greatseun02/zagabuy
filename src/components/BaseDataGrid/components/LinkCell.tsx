import React from "react";

export default function LinkCell({
  href,
  children,
  external,
}: {
  href?: string;
  children?: any;
  external?: boolean;
}) {
  if (!href) return <>{children}</>;
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-indigo-600 underline hover:text-indigo-800"
    >
      {children ?? href}
    </a>
  );
}
