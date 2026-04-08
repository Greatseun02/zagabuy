"use client";

import React from "react";
import EditIcon from "@/components/icon/editIcon";
import {cn} from "@/utilities/helpers/cn";

export type EditActionRendererProps<T = Record<string, unknown>> = {
    title?: string;
    data?: T;
    onClick?: (value?: T) => Promise<void>;
};

export function EditActionRenderer<T = Record<string, unknown>>({
                                                                    title,
                                                                    data,
                                                                    onClick,
                                                                }: EditActionRendererProps<T>) {
    const handleClick = () => {
        if (onClick) {
            void onClick(data);
        }
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
            <EditIcon className="w-5 h-5"/>
        </div>
    );
}

export default EditActionRenderer;
