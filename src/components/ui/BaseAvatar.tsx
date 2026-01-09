"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Shield } from "lucide-react";

export type BaseAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export type BaseAvatarProps = {
  /** Image URL to display as avatar */
  image?: string;
  /** Text/initials to generate avatar from (uses dicebear API) */
  text?: string;
  /** Icon to display in fallback */
  icon?: ReactNode;
  /** Size of the avatar */
  size?: BaseAvatarSize;
  /** Additional class names */
  className?: string;
  /** Alt text for image */
  alt?: string;
};

// Size mappings for avatar dimensions
const sizeMap: Record<BaseAvatarSize, string> = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

// Icon size mappings (relative to avatar size)
const iconSizeMap: Record<BaseAvatarSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

export default function BaseAvatar({
  image,
  text,
  icon,
  size = "sm",
  className,
  alt = "Avatar",
}: BaseAvatarProps) {
  // Generate dicebear avatar URL from text (initials)
  const dicebearUrl = text
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        text
      )}`
    : null;

  // Determine which image source to use (priority: explicit image > dicebear generated)
  const imageSource = image || dicebearUrl;

  // Determine fallback icon (priority: explicit icon > shield default)
  const fallbackIcon = icon || (
    <Shield className={cn("text-muted-foreground", iconSizeMap[size])} />
  );

  return (
    <Avatar className={cn(sizeMap[size], className)}>
      {imageSource && <AvatarImage src={imageSource} alt={alt} />}
      <AvatarFallback className="text-xs bg-muted flex items-center justify-center">
        {fallbackIcon}
      </AvatarFallback>
    </Avatar>
  );
}
