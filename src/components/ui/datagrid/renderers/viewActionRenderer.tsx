"use client";

import React from "react";
import {EyeIcon} from "@/components/icon/eyeVisibleIcon";
import {cn} from "@/utilities/helpers/cn";

/**
 * Props for the ViewActionRenderer component.
 *
 * @template TData - Type of the row or record being viewed.
 */
export interface ViewActionRendererProps<TData = Record<string, unknown>> {
    /** The data associated with this row or cell */
    data?: TData;

    /** Called when the view icon is clicked */
    onClick?: (value?: TData) => void;

    /** Optional title for tooltip */
    title?: string;
}

/**
 * A small icon button renderer that triggers a "view" action when clicked.
 * Typically used inside table cells (e.g., AG Grid).
 */
export function ViewActionRenderer<TData = Record<string, unknown>>({
                                                                        data,
                                                                        onClick,
                                                                        title,
                                                                    }: ViewActionRendererProps<TData>) {
    const handleClick = () => {
        if (onClick) onClick(data);
    };

    return (
        <div
            className={cn(
                "flex justify-center w-full text-muted-foreground",
                "transition-colors duration-150",
                onClick && "cursor-pointer hover:text-primary dark:hover:text-primary"
            )}
            onClick={handleClick}
            title={title}
        >
            <EyeIcon type="visible" className="w-5 h-5"/>
        </div>
    );
}

export default ViewActionRenderer;
