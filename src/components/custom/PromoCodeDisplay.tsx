/**
 * Zagabuy Platform - Promo Code Display Component
 *
 * Display promo codes with integrated copy functionality.
 */

import { cn } from "@/lib/utils";
import { CopyButton } from "./CopyButton";

interface PromoCodeDisplayProps {
  code: string;
  className?: string;
  onCopied?: () => void;
}

export function PromoCodeDisplay({
  code,
  className,
  onCopied,
}: PromoCodeDisplayProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-3 bg-muted rounded-md border border-dashed",
        className
      )}
      data-testid="promo-code-display"
    >
      <code className="flex-1 font-sans text-sm font-medium tracking-wider">
        {code}
      </code>
      <CopyButton
        value={code}
        variant="transparent"
        size="icon"
        successMessage="Promo code copied!"
      />
    </div>
  );
}
