import * as React from "react";

const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M12 5C21 5 21 5 21 12C21 19 21 19 12 19C3 19 3 19 3 12C3 5 3 5 12 5Z"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M10 8.5L16 12L10 15.5V8.5Z"
            fill="white"
        />
    </svg>
);

export default YouTubeIcon;