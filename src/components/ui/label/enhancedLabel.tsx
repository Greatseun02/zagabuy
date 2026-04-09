import React, {
  CSSProperties,
  SVGProps,
  useState,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import Typography from "../typography";
import { IconRenderProps, IconType } from "@/utilities/types/iconTypes";
import { useIconRenderer } from "@/utilities/helpers/iconRenderer";

// =============================================================================
// DEFAULT ICON COMPONENTS
// =============================================================================

const RequiredIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="6"
    height="6"
    viewBox="0 0 6 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="3" cy="3" r="3" fill="currentColor" />
  </svg>
);

const InfoIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 7V11M8 5H8.01"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AdditionIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 3V13M3 8H13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WarningIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.86603 3.5C8.48113 2.83333 7.51887 2.83333 7.13397 3.5L1.40192 13.25C1.01702 13.9167 1.49815 14.75 2.26795 14.75H13.732C14.5018 14.75 14.983 13.9167 14.5981 13.25L8.86603 3.5Z"
      fill="currentColor"
      opacity="0.1"
    />
    <path
      d="M8 6V9M8 12H8.01M8.86603 3.5C8.48113 2.83333 7.51887 2.83333 7.13397 3.5L1.40192 13.25C1.01702 13.9167 1.49815 14.75 2.26795 14.75H13.732C14.5018 14.75 14.983 13.9167 14.5981 13.25L8.86603 3.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const OptionalIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2 2"
      fill="none"
    />
  </svg>
);

// =============================================================================
// TOOLTIP COMPONENT
// =============================================================================

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  maxWidth?: string;
  minWidth?: string;
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  maxWidth = "300px",
  minWidth = "100px",
  delay = 500,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  // Create portal container on mount
  useEffect(() => {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.pointerEvents = "none";
    container.style.zIndex = "99999";
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
      // Calculate position when showing
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const tooltipWidth = Math.min(parseInt(maxWidth) || 300, 300); // Estimate width
        const tooltipHeight = 40; // Estimate height

        let top = 0;
        let left = 0;

        switch (position) {
          case "top":
            top = rect.top - tooltipHeight - 10;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          case "bottom":
            top = rect.bottom + 10;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          case "left":
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.left - tooltipWidth - 10;
            break;
          case "right":
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.right + 10;
            break;
        }
        setTooltipPosition({ top, left });
      }
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const tooltipStyles: CSSProperties = {
    position: "absolute",
    backgroundColor: "#1f2937",
    color: "white",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "0.875rem",
    lineHeight: 1.5,
    maxWidth,
    minWidth,
    width: "max-content",
    pointerEvents: isVisible ? "auto" : "none",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? "visible" : "hidden",
    transition: "opacity 0.2s ease-in-out, visibility 0.2s ease-in-out",
    whiteSpace: "normal",
    wordBreak: "break-word",
    hyphens: "auto",
    top: `${tooltipPosition.top}px`,
    left: `${tooltipPosition.left}px`,
  };
  const arrowStyles: CSSProperties = {
    position: "absolute",
    width: 0,
    height: 0,
    ...(position === "top" && {
      bottom: "-6px",
      left: "50%",
      transform: "translateX(-50%)",
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      borderTop: "6px solid #1f2937",
    }),
    ...(position === "bottom" && {
      top: "-6px",
      left: "50%",
      transform: "translateX(-50%)",
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      borderBottom: "6px solid #1f2937",
    }),
    ...(position === "left" && {
      right: "-6px",
      top: "50%",
      transform: "translateY(-50%)",
      borderTop: "6px solid transparent",
      borderBottom: "6px solid transparent",
      borderLeft: "6px solid #1f2937",
    }),
    ...(position === "right" && {
      left: "-6px",
      top: "50%",
      transform: "translateY(-50%)",
      borderTop: "6px solid transparent",
      borderBottom: "6px solid transparent",
      borderRight: "6px solid #1f2937",
    }),
  };

  return (
    <div
      ref={triggerRef}
      style={{ display: "inline-flex", alignItems: "center" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {portalContainer &&
        createPortal(
          <div style={tooltipStyles}>
            {content}
            <div style={arrowStyles} />
          </div>,
          portalContainer,
        )}
    </div>
  );
};

// =============================================================================
// DEFAULT ICON TYPES
// =============================================================================

export type DefaultIconType =
  | "required"
  | "info"
  | "addition"
  | "warning"
  | "optional";

// =============================================================================
// DEFAULT ICON CONFIGURATION
// =============================================================================

export interface DefaultIconConfig {
  component: IconType;
  defaultSize: string;
  defaultColor: string;
  defaultProps?: IconRenderProps;
  className?: string;
}

const DEFAULT_ICONS: Record<DefaultIconType, DefaultIconConfig> = {
  required: {
    component: RequiredIcon,
    defaultSize: "0.5em",
    defaultColor: "var(--color-error-500)",
    className: "enhanced-label-required-icon",
  },
  info: {
    component: InfoIcon,
    defaultSize: "1em",
    defaultColor: "#3b82f6",
    className: "enhanced-label-info-icon",
  },
  addition: {
    component: AdditionIcon,
    defaultSize: "1em",
    defaultColor: "#10b981",
    className: "enhanced-label-addition-icon",
  },
  warning: {
    component: WarningIcon,
    defaultSize: "1em",
    defaultColor: "#f59e0b",
    className: "enhanced-label-warning-icon",
  },
  optional: {
    component: OptionalIcon,
    defaultSize: "1em",
    defaultColor: "#6b7280",
    className: "enhanced-label-optional-icon",
  },
};

// =============================================================================
// ENHANCED LABEL PROPS
// =============================================================================

export type EnhancedLabelProps = {
  /** The label text */
  label?: string;
  /** Default icon type - convenient presets */
  defaultIcon?: DefaultIconType;
  /** Position for the default icon */
  defaultIconPosition?: "start" | "end";
  /** Override default icon size */
  defaultIconSize?: string;
  /** Override default icon color */
  defaultIconColor?: string;
  /** Additional props for default icon */
  defaultIconProps?: IconRenderProps;
  /** Custom icon to display alongside the label (in addition to default icon) */
  icon?: IconType;
  /** Icon position relative to the label */
  iconPosition?: "start" | "end";
  /** Props for the custom icon */
  iconProps?: IconRenderProps;
  /** Custom icon size */
  iconSize?: string;
  /** Custom style for the label container */
  style?: CSSProperties;
  /** Custom style for the label text */
  labelStyle?: CSSProperties;
  /** Additional CSS classes */
  className?: string;
  /** Typography props to pass through */
  typographyProps?: Partial<React.ComponentProps<typeof Typography>>;
  /** Whether to show both default and custom icons */
  showBothIcons?: boolean;
  /** Gap between icons and text */
  iconGap?: string;
  // Legacy props for backward compatibility
  required?: boolean;
  requiredIcon?: IconType;
  requiredIconSize?: string;
  requiredIconProps?: IconRenderProps;
  showRequiredWithIcon?: boolean;
  /** Optional action button displayed to the right of the label (e.g., "+ New Customer") */
  actionText?: string;
  /** Called when the action button is clicked */
  onActionClick?: () => void;
  /** Arbitrary content rendered on the right side of the label row (e.g., a toggle control) */
  rightContent?: React.ReactNode;
  /** Tooltip text to show on info icon hover */
  tooltipText?: string;
  /** Position for tooltip */
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  /** Delay in milliseconds before showing tooltip */
  tooltipDelay?: number;
  /** Maximum width for tooltip */
  tooltipMaxWidth?: string;
  /** Minimum width for tooltip */
  tooltipMinWidth?: string;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Enhanced label component with flexible icon support using IconRenderer
 */
const EnhancedLabel: React.FC<EnhancedLabelProps> = ({
  label,
  defaultIcon,
  defaultIconPosition = "end",
  defaultIconSize,
  defaultIconColor,
  defaultIconProps,
  icon,
  iconPosition = "start",
  iconProps,
  iconSize = "1em",
  style,
  labelStyle,
  className,
  typographyProps,
  showBothIcons = true,
  iconGap = "0.25rem",
  required = false,
  requiredIcon,
  requiredIconSize,
  requiredIconProps,
  showRequiredWithIcon = true,
  actionText,
  onActionClick,
  rightContent,
  tooltipText,
  tooltipPosition = "top",
  tooltipDelay = 500,
  tooltipMaxWidth = "300px",
  tooltipMinWidth = "100px",
}) => {
  const { render: renderIcon } = useIconRenderer({
    defaultClassName: "enhanced-label-icon",
    addDefaultClassName: true,
  });

  // Don't render anything if no label and no action/right content
  if (!label && !actionText && !rightContent) return null;

  // Handle legacy support - convert old required prop to new defaultIcon system
  const effectiveDefaultIcon =
    defaultIcon || (required ? "required" : undefined);
  const effectiveShowBothIcons =
    showBothIcons && (showRequiredWithIcon ?? true);

  /**
   * Render a default icon from the preset configurations
   */
  const renderDefaultIcon = () => {
    if (!effectiveDefaultIcon) return null;

    const iconConfig = DEFAULT_ICONS[effectiveDefaultIcon];

    // Support legacy requiredIcon override
    const iconComponent = requiredIcon || iconConfig.component;

    // Determine size with legacy support
    const size = defaultIconSize || requiredIconSize || iconConfig.defaultSize;

    // Determine color
    const color = defaultIconColor || iconConfig.defaultColor;

    // Combine all props with proper precedence
    const combinedProps: IconRenderProps = {
      ...iconConfig.defaultProps,
      ...defaultIconProps,
      ...requiredIconProps, // Legacy support
      size,
      style: {
        color,
        ...iconConfig.defaultProps?.style,
        ...defaultIconProps?.style,
        ...requiredIconProps?.style, // Legacy support
      },
      className:
        [
          iconConfig.className,
          defaultIconProps?.className,
          requiredIconProps?.className, // Legacy support
        ]
          .filter(Boolean)
          .join(" ") || undefined,
    };

    return renderIcon(iconComponent, combinedProps);
  };

  /**
   * Render a tooltip icon if tooltipText is provided
   */
  const renderTooltipIcon = () => {
    if (!tooltipText) return null;

    const iconConfig = DEFAULT_ICONS["info"];

    const tooltipIconProps: IconRenderProps = {
      ...iconConfig.defaultProps,
      size: iconConfig.defaultSize,
      style: {
        color: iconConfig.defaultColor,
        cursor: "help",
        ...iconConfig.defaultProps?.style,
      },
      className:
        `enhanced-label-tooltip-icon ${iconConfig.className || ""}`.trim(),
    };

    const tooltipIconElement = renderIcon(
      iconConfig.component,
      tooltipIconProps,
    );

    if (!tooltipIconElement) return null;

    return (
      <Tooltip
        content={tooltipText}
        position={tooltipPosition}
        delay={tooltipDelay}
        maxWidth={tooltipMaxWidth}
        minWidth={tooltipMinWidth}
      >
        {tooltipIconElement}
      </Tooltip>
    );
  };

  /**
   * Render a custom icon
   */
  const renderCustomIcon = () => {
    if (!icon) return null;

    const customIconProps: IconRenderProps = {
      ...iconProps,
      size: iconSize,
      className:
        `enhanced-label-custom-icon ${iconProps?.className || ""}`.trim(),
    };

    return renderIcon(icon, customIconProps);
  };

  // Determine what icons to show and where
  const shouldShowDefaultIcon = !!effectiveDefaultIcon;
  const shouldShowTooltipIcon = !!tooltipText;
  const shouldShowCustomIcon = !!icon;
  const shouldShowBoth =
    effectiveShowBothIcons && shouldShowDefaultIcon && shouldShowCustomIcon;

  // Icon configuration for easy management
  interface IconSlot {
    key: string;
    element: React.ReactElement | null;
    position: "start" | "end";
  }

  const iconSlots: IconSlot[] = [];

  // Add default icon
  if (shouldShowDefaultIcon) {
    iconSlots.push({
      key: "default",
      element: renderDefaultIcon(),
      position: defaultIconPosition,
    });
  }

  // Add tooltip icon
  if (shouldShowTooltipIcon) {
    iconSlots.push({
      key: "tooltip",
      element: renderTooltipIcon(),
      position: "end",
    });
  }

  // Add custom icon (only if both should show, or if default icon shouldn't show)
  if (shouldShowCustomIcon && (shouldShowBoth || !shouldShowDefaultIcon)) {
    iconSlots.push({
      key: "custom",
      element: renderCustomIcon(),
      position: iconPosition,
    });
  }

  // Organize icons by position
  const startIcons = iconSlots.filter((slot) => slot.position === "start");
  const endIcons = iconSlots.filter((slot) => slot.position === "end");

  return (
    <div
      className={`enhanced-label ${className || ""}`.trim()}
      style={{
        display: "flex",
        alignItems: "center",
        gap: iconGap,
        width: "100%",
        justifyContent:
          actionText || rightContent ? "space-between" : undefined,
        ...style,
      }}
    >
      {/* Start icons */}
      {startIcons.map(({ key, element }) => (
        <React.Fragment key={`start-${key}`}>{element}</React.Fragment>
      ))}

      {/* Label text */}
      <Typography
        variant="text"
        component="span"
        size="sm"
        weight="medium"
        style={labelStyle}
        className="enhanced-label-text"
        {...typographyProps}
      >
        {label}
      </Typography>

      {/* End icons */}
      {endIcons.map(({ key, element }) => (
        <React.Fragment key={`end-${key}`}>{element}</React.Fragment>
      ))}

      {actionText && (
        <button
          type="button"
          onClick={onActionClick}
          className="text-xs text-primary hover:underline ml-auto flex-shrink-0"
        >
          {actionText}
        </button>
      )}
      {rightContent && (
        <div className="ml-auto flex-shrink-0">{rightContent}</div>
      )}
    </div>
  );
};

/**
 * Utility function to get default icon configuration
 */
export const getDefaultIconConfig = (
  type: DefaultIconType,
): DefaultIconConfig => {
  return DEFAULT_ICONS[type];
};

export default EnhancedLabel;
