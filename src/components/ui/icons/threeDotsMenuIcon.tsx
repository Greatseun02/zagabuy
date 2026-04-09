import {SVGProps} from "react";

function ThreeDotsMenuIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="20"
            fill="none"
            viewBox="0 0 21 20"
            {...props}
            className={`icon ${props.className}`}>
            <g>
                <path
                    fill="currentColor"
                    d="M10.5 2.5c-.688 0-1.25.563-1.25 1.25 0 .688.563 1.25 1.25 1.25.688 0 1.25-.563 1.25-1.25 0-.688-.563-1.25-1.25-1.25zm0 12.5c-.688 0-1.25.563-1.25 1.25 0 .688.563 1.25 1.25 1.25.688 0 1.25-.563 1.25-1.25 0-.688-.563-1.25-1.25-1.25zm0-6.25c-.688 0-1.25.563-1.25 1.25 0 .688.563 1.25 1.25 1.25.688 0 1.25-.563 1.25-1.25 0-.688-.563-1.25-1.25-1.25z"
                ></path>
            </g>
        </svg>
    );
}

export default ThreeDotsMenuIcon;
