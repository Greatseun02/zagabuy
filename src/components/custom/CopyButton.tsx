/**
 * Zagabuy Platform - Copy Button Component
 *
 * Button to copy promo codes and links with feedback.
 */

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/utilities/constants";
import { toast } from "sonner";

interface CopyButtonProps {
  value: string;
  displayValue?: string;
  successMessage?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  copyVariant?: "icon" | "default";
}

export function CopyButton({
  value,
  displayValue,
  successMessage = UI_TEXT.SUCCESS.CODE_COPIED,
  variant = "outline",
  size = "icon-sm",
  className,
  copyVariant = "icon",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback for non-HTTPS or unsupported browsers
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success(successMessage);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard.");
    }
  };

  if (copyVariant === "icon") {
    return (
      <Button
        variant={variant}
        size="icon"
        onClick={handleCopy}
        className={className}
        data-testid="button-copy"
        title={copied ? "Copied!" : "Copy to clipboard"}
      >
        {copied ? (
          <Check className="h-4 w-4 text-success" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn("gap-2", className)}
      data-testid="button-copy"
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <Check className="h-4 w-4 text-success" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {displayValue || value}
    </Button>
  );
}
