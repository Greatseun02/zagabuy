"use client";

import React from "react";
import {useRouter} from "next/navigation";
import type {Route} from "next";
import type {ICellRendererParams} from "ag-grid-community";
import BaseButton from "@/components/ui/button/baseButton";
import Typography from "@/components/ui/typography/typography";

/**
 * Link appearance variant
 */
export type LinkVariant = "link" | "button";

/**
 * Type-safe parameters for NavigationLinkRenderer
 */
export interface NavigationLinkRendererParams<TData = any>
    extends ICellRendererParams<TData, any, any> {
    /** Function to generate href from row data */
    href: (data: TData) => string;
    /** Link or button appearance */
    variant?: LinkVariant;
    /** Open in new tab */
    target?: "_self" | "_blank";
    /** Link text (defaults to field value) */
    linkText?: (data: TData) => string;
    /** Optional custom link renderer */
    linkRenderer?: (data: TData, href: string) => React.ReactNode;
}

/**
 * NavigationLinkRenderer - Displays a clickable link that navigates to a route
 *
 * Usage:
 * ```tsx
 * {
 *   field: 'name',
 *   cellRenderer: NavigationLinkRenderer,
 *   cellRendererParams: {
 *     href: (app) => ROUTES.ADMIN.APP_DETAIL(app.id),
 *     variant: 'link',
 *     target: '_self',
 *   } as NavigationLinkRendererParams<App>
 * }
 * ```
 */
export const NavigationLinkRenderer = <
    TData extends Record<string, any> = Record<string, any>
>(
    props: NavigationLinkRendererParams<TData>
) => {
    const {value, data, href, variant = "link", target = "_self", linkText} =
        props;

    const router = useRouter();

    if (!data) return null;

    const routeHref = href(data);
    const displayText = linkText ? linkText(data) : String(value || "");

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (target === "_blank") {
            window.open(routeHref, "_blank");
        } else {
            router.push(routeHref as Route);
        }
    };

    // Link variant - looks like a text link
    if (variant === "link") {
        return (
            <a
                href={routeHref}
                onClick={handleClick}
                target={target}
                className="text-primary hover:text-primary/80 underline underline-offset-4 hover:underline-offset-2 transition-all cursor-pointer"
            >
                <Typography size="sm" color="primary">
                    {displayText}
                </Typography>
            </a>
        );
    }

    // Button variant - looks like a button
    return (
        <BaseButton
            href={routeHref as any}
            target={target}
            text={displayText}
            variant="ghost"
            size="x-small"
            className="text-primary hover:text-primary/80 hover:bg-primary/10"
        />
    );
};

export default NavigationLinkRenderer;
