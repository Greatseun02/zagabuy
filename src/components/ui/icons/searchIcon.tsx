import type {SVGProps} from 'react';

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}
                 className={`icon ${props.className}`}>
        <g fill="none" stroke="currentColor">
            <circle cx={11} cy={11} r={6}></circle>
            <path strokeLinecap="round" d="m20 20l-3-3"></path>
        </g>
    </svg>);
}

export default SearchIcon;
