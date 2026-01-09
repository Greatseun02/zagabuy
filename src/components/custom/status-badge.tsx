/**
 * Zagabuy Platform - Status Badge
 *
 * Consistent status badges for deals and accounts.
 */

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DealStatusEnum, AccountStatusEnum } from "@/utilities/enums/appEnum";
import { UI_TEXT } from "@/utilities/constants";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Pause,
  FileEdit,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

type DealStatus = DealStatusEnum;
type AccountStatus = AccountStatusEnum;

interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  icon: LucideIcon;
}

const dealStatusConfig: Record<DealStatus, StatusConfig> = {
  [DealStatusEnum.DRAFT]: {
    label: UI_TEXT.DEAL_STATUS.draft,
    variant: "secondary",
    icon: FileEdit,
  },
  [DealStatusEnum.PENDING]: {
    label: UI_TEXT.DEAL_STATUS.pending,
    variant: "outline",
    icon: Clock,
  },
  [DealStatusEnum.APPROVED]: {
    label: UI_TEXT.DEAL_STATUS.approved,
    variant: "default",
    icon: CheckCircle2,
  },
  [DealStatusEnum.REJECTED]: {
    label: UI_TEXT.DEAL_STATUS.rejected,
    variant: "destructive",
    icon: XCircle,
  },
  [DealStatusEnum.PAUSED]: {
    label: UI_TEXT.DEAL_STATUS.paused,
    variant: "outline",
    icon: Pause,
  },
  [DealStatusEnum.EXPIRED]: {
    label: UI_TEXT.DEAL_STATUS.expired,
    variant: "secondary",
    icon: AlertTriangle,
  },
};

const accountStatusConfig: Record<AccountStatus, StatusConfig> = {
  [AccountStatusEnum.PENDING]: {
    label: UI_TEXT.ACCOUNT_STATUS.pending,
    variant: "outline",
    icon: Clock,
  },
  [AccountStatusEnum.ACTIVE]: {
    label: UI_TEXT.ACCOUNT_STATUS.active,
    variant: "default",
    icon: CheckCircle2,
  },
  [AccountStatusEnum.SUSPENDED]: {
    label: UI_TEXT.ACCOUNT_STATUS.suspended,
    variant: "destructive",
    icon: Pause,
  },
  [AccountStatusEnum.REJECTED]: {
    label: UI_TEXT.ACCOUNT_STATUS.rejected,
    variant: "destructive",
    icon: XCircle,
  },
};

interface DealStatusBadgeProps {
  status: DealStatus | string;
  showIcon?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function DealStatusBadge({
  status,
  showIcon = true,
  size = "sm",
  className,
}: DealStatusBadgeProps) {
  const config =
    dealStatusConfig[status as DealStatus] ||
    dealStatusConfig[DealStatusEnum.DRAFT];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      size={size}
      rounded="md"
      startIcon={showIcon ? <Icon /> : undefined}
      className={className}
      data-testid={`badge-deal-status-${status}`}
    >
      {config.label}
    </Badge>
  );
}

interface AccountStatusBadgeProps {
  status: AccountStatus | string;
  showIcon?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function AccountStatusBadge({
  status,
  showIcon = true,
  size = "sm",
  className,
}: AccountStatusBadgeProps) {
  const config =
    accountStatusConfig[status as AccountStatus] ||
    accountStatusConfig[AccountStatusEnum.PENDING];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      size={size}
      rounded="md"
      startIcon={showIcon ? <Icon /> : undefined}
      className={className}
      data-testid={`badge-account-status-${status}`}
    >
      {config.label}
    </Badge>
  );
}

export interface DiscountBadgeProps {
  percentage: number;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function DiscountBadge({
  percentage,
  size = "sm",
  className,
}: DiscountBadgeProps) {
  if (percentage <= 0) return null;

  return (
    <Badge
      variant="destructive"
      size={size}
      rounded="md"
      className={cn("font-bold", className)}
      data-testid="badge-discount"
    >
      -{percentage}%
    </Badge>
  );
}

interface FeaturedBadgeProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function FeaturedBadge({ size = "sm", className }: FeaturedBadgeProps) {
  return (
    <Badge
      size={size}
      rounded="md"
      className={cn("font-semibold bg-accent px-4", className)}
      data-testid="badge-featured"
    >
      Featured
    </Badge>
  );
}
