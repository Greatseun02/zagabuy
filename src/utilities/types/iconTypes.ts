import React, { FunctionComponent, JSX, SVGProps } from "react";

/**
 * Universal icon type that works across React 18 and 19
 * Supports multiple icon formats for maximum flexibility
 */
export type UniversalSVGProps = Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
  ref?: React.Ref<SVGSVGElement> | React.LegacyRef<SVGSVGElement> | string;
};

/**
 * Smart SVG props type that adapts to React 18/19 differences
 */
export type SmartSVGProps = Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
  ref?: React.Ref<SVGSVGElement> | React.LegacyRef<SVGSVGElement> | string;
};

/**
 * Flexible icon type supporting multiple formats
 * - string: URL or base64 encoded image
 * - ReactElement: Pre-rendered element like <Icon />
 * - FunctionComponent: Icon component
 * - Function: Dynamic icon renderer
 * - IconSpec object: { icon: Component, className?: string, style?: CSSProperties }
 */
export type IconType<P = SVGProps<SVGSVGElement>> =
  | string
  | React.ReactElement
  | FunctionComponent<P>
  | ((props: P) => JSX.Element)
  | {
      icon: FunctionComponent<P> | ((props: P) => JSX.Element);
      className?: string;
      style?: React.CSSProperties;
      [key: string]: any;
    }
  | null
  | undefined;

/**
 * Props for configuring icon rendering
 */
export interface IconRenderProps
  extends Omit<SmartSVGProps, "width" | "height"> {
  /** Icon size - applies to both width and height */
  size?: string | number;
  /** Explicit width (overrides size) */
  width?: string | number;
  /** Explicit height (overrides size) */
  height?: string | number;
  /** CSS class name */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
  /** Alt text for string-based icons (URLs/images) */
  alt?: string;
}

/**
 * Configuration for default icon behavior
 */
export interface IconConfig {
  /** Default size when none specified */
  defaultSize: string | number;
  /** Default props to apply to all icons */
  defaultProps?: IconRenderProps;
  /** Whether to add default className */
  addDefaultClassName?: boolean;
  /** Default className to add */
  defaultClassName?: string;
}

/**
 * Icon position type for components that support multiple icons
 */
export type IconPosition =
  | "start"
  | "end"
  | "top"
  | "bottom"
  | "left"
  | "right";

/**
 * Props for components that accept icons with positions
 */
export interface IconPositionProps {
  /** Start/left icon */
  startIcon?: IconType;
  /** End/right icon */
  endIcon?: IconType;
  /** Top icon */
  topIcon?: IconType;
  /** Bottom icon */
  bottomIcon?: IconType;
  /** Props for start icon */
  startIconProps?: IconRenderProps;
  /** Props for end icon */
  endIconProps?: IconRenderProps;
  /** Props for top icon */
  topIconProps?: IconRenderProps;
  /** Props for bottom icon */
  bottomIconProps?: IconRenderProps;
}

/**
 * Utility type for extracting icon prop names
 */
export type IconPropKey = `${IconPosition}Icon` | `${IconPosition}IconProps`;
