import React from "react";
import {renderIcon} from "@/utilities/helpers/iconRenderer";

export type IconWrapperProps = {
    /** Icon to render (SVG or component) */
    icon: React.ReactElement;
    /** Button size in pixels */
    size?: number;
    /** Loading state: show spinner */
    isLoading?: boolean;
    /** Helper text displayed below the icon */
    helperText?: string;
    /** CSS color for icon (overrides default) */
    iconColor?: string;
    /** CSS color for background */
    backgroundColor?: string;
    /** CSS color for outline */
    outlineColor?: string;
    /** CSS blend mode for icon */
    blendMode?: React.CSSProperties['mixBlendMode'];
    /** Additional styles for button wrapper */
    wrapperStyle?: React.CSSProperties;
    /** Additional styles for container */
    containerStyle?: React.CSSProperties;
    /** Additional styles for helper text */
    helperTextStyle?: React.CSSProperties;
    /** Click handler */
    onClick?: () => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'>;

const IconWrapper: React.FC<IconWrapperProps> = ({
                                                     icon,
                                                     size = 40,
                                                     isLoading = false,
                                                     helperText,
                                                     iconColor,
                                                     backgroundColor,
                                                     outlineColor,
                                                     blendMode,
                                                     wrapperStyle,
                                                     containerStyle,
                                                     helperTextStyle,
                                                     onClick,
                                                     ...props
                                                 }) => {
    // Inline styles for wrapper
    const buttonStyles: React.CSSProperties = {
        width: size,
        height: size,
        backgroundColor,
        borderColor: outlineColor,
        borderWidth: outlineColor ? '2px' : undefined,
        borderStyle: outlineColor ? 'solid' : undefined,
        mixBlendMode: blendMode,
        ...wrapperStyle,
    };

    const iconElement = renderIcon(icon, {
        size,
        style: {color: iconColor, fill: iconColor, mixBlendMode: blendMode},
    });

    return (
        <div className="inline-flex flex-col items-center gap-1" style={containerStyle}>
            <button
                className="flex items-center justify-center rounded-full border-2 border-transparent p-0 cursor-pointer transition-colors duration-200 disabled:cursor-default disabled:opacity-60"
                style={buttonStyles}
                onClick={onClick}
                disabled={isLoading || !onClick}
                {...props}
            >
                {isLoading ? (
                    <span
                        className="block w-1em h-1em border-2 border-current border-t-transparent rounded-full animate-spin"
                        style={{width: size * 0.5, height: size * 0.5}}
                    />
                ) : iconElement}
            </button>
            {helperText && (
                <span className="text-xs text-gray-700 text-center" style={helperTextStyle}>
                    {helperText}
                </span>
            )}
        </div>
    );
};

export default IconWrapper;
