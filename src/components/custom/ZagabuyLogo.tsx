"use client";

import { ShoppingBag, TrendingUp, Zap } from "lucide-react";

interface LogoProps {
  /**
   * Size of the logo
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Show full text or just icon
   * @default true
   */
  showText?: boolean;
  /**
   * Use alternate icon (TrendingUp instead of ShoppingBag)
   * @default false
   */
  variant?: "bag" | "trending" | "zap";
  /**
   * Additional CSS classes
   */
  className?: string;
}

const sizeConfigs = {
  sm: {
    containerPadding: "p-1.5",
    iconSize: 16,
    textSize: "text-sm",
    spacing: "gap-1.5",
  },
  md: {
    containerPadding: "p-2",
    iconSize: 24,
    textSize: "text-lg",
    spacing: "gap-2",
  },
  lg: {
    containerPadding: "p-3",
    iconSize: 32,
    textSize: "text-2xl",
    spacing: "gap-3",
  },
  xl: {
    containerPadding: "p-4",
    iconSize: 40,
    textSize: "text-3xl",
    spacing: "gap-4",
  },
};

export default function ZagabuyLogo({
  size = "md",
  showText = true,
  variant = "bag",
  className = "",
}: LogoProps) {
  const config = sizeConfigs[size];

  const iconMap = {
    bag: ShoppingBag,
    trending: TrendingUp,
    zap: Zap,
  };

  const IconComponent = iconMap[variant];

  return (
    <div
      className={`flex items-center ${config.spacing} ${className}`}
      aria-label="Zagabuy Logo"
    >
      {/* Icon Container */}
      <div
        className={`
          relative ${config.containerPadding}
          bg-gradient-to-br from-[hsl(230,80%,55%)] to-[hsl(170,60%,45%)]
          rounded-lg
          shadow-lg
          hover:shadow-xl
          transition-shadow
          duration-300
          flex
          items-center
          justify-center
          group
        `}
      >
        {/* Accent Glow */}
        <div
          className={`
            absolute
            inset-0
            rounded-lg
            bg-gradient-to-br
            from-[hsl(230,80%,55%)]
            to-[hsl(170,60%,45%)]
            opacity-0
            group-hover:opacity-20
            blur-lg
            transition-opacity
            duration-300
          `}
        />

        {/* Icon */}
        <IconComponent
          size={config.iconSize}
          className="relative text-white stroke-[2.5]"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Accent Corner Indicator */}
        <div
          className={`
            absolute
            bottom-0
            right-0
            w-2
            h-2
            rounded-full
            bg-[hsl(142,71%,45%)]
            shadow-md
          `}
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`
              ${config.textSize}
              font-heading
              font-bold
              bg-gradient-to-r
              from-[hsl(230,80%,55%)]
              to-[hsl(170,60%,45%)]
              bg-clip-text
              text-transparent
              tracking-tight
            `}
          >
            Zagabuy
          </span>
          <span
            className={`
              text-xs
              font-primary
              text-[hsl(220,10%,45%)]
              dark:text-[hsl(220,10%,60%)]
              font-medium
              tracking-wide
              uppercase
              letter-spacing: 0.05em
            `}
          >
            Marketplace
          </span>
        </div>
      )}
    </div>
  );
}
