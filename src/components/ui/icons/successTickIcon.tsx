import * as React from "react";
import {SVGProps} from "react";

const SuccessTickIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M16.6663 5L7.49967 14.1667L3.33301 10"
            stroke="#0D968F"
            strokeWidth={1.66667}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
export default SuccessTickIcon;
