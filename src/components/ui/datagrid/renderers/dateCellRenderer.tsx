"use client";

import React from "react";
import {ICellRendererParams} from "ag-grid-community";
import {TimeUtil} from "@/utilities/timeUtil";

export interface DateCellRendererProps<T = Record<string, unknown>>
    extends ICellRendererParams {
    title: string;
    data: T;
    value: string;
    onClick?: (data: T) => void;
    path?: string;
}

export function DateCellRenderer<T = Record<string, unknown>>({
                                                                  title,
                                                                  data,
                                                                  value,
                                                                  onClick,
                                                              }: DateCellRendererProps<T>) {
    const {formattedTime, formattedDate} = TimeUtil.getFormatDateTime(value);

    const handleClick = () => {
        if (onClick) onClick(data);
    };

    return (
        <div
            className="flex flex-col cursor-pointer"
            onClick={handleClick}
            title={title}
        >
            {formattedDate && formattedTime && <p>{`${formattedDate}: ${formattedTime}`}</p>}
            {formattedDate && !formattedTime && <p>{formattedDate}</p>}
            {!formattedDate && formattedTime && <p>{formattedTime}</p>}
        </div>
    );
}

export default DateCellRenderer;
