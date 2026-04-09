import {SVGProps} from "react"

export const DropdownIcon = (props: SVGProps<SVGSVGElement> & { type?: "opened" | "closed" }) => {
    if (props?.type == "closed") {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 15 15"
                {...props}
                style={{width: "15px", height: "15px", ...props.style}}
                className={`icon ${props.className}`}
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill={"currentColor"}
                    strokeWidth={.1}
                    d="M2.558 6.295a.25.25 0 0 1 0-.353l.884-.884a.25.25 0 0 1 .353 0L8 9.263l4.204-4.205a.25.25 0 0 1 .354 0l.884.884a.25.25 0 0 1 0 .353l-5.265 5.266a.25.25 0 0 1-.354 0L2.558 6.295Z"
                />
            </svg>
        )
    }
    return (<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 15 15"
        strokeWidth={.1}
        {...props}
        style={{width: "15px", height: "15px", ...props.style}}
        className={`icon ${props.className}`}
    >
        <path d="m7 2.827-4.95 4.95L.634 6.363 7 0l6.364 6.364-1.414 1.414L7 2.827Z"/>
    </svg>)
}

export default DropdownIcon
