/**
 * Zagabuy Platform - Share Button Component
 *
 * Button to share deals and content with integrated icon feedback.
 */

import { Share2 } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  onClick?: () => void;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function ShareButton({
  onClick,
  variant = "ghost",
  size = "small",
  className,
  showLabel = false,
  label = "Share",
}: ShareButtonProps) {
  const handleShare = async () => {
    if (onClick) {
      onClick();
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out",
          text: "Found an amazing deal",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      console.log("Web Share API not supported");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={cn("gap-2", className)}
      data-testid="button-share"
      title="Share this deal"
    >
      <Share2 className="h-4 w-4" />
      {showLabel && label}
    </Button>
  );
}
