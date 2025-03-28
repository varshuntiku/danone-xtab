import React from 'react';

function Notification({ color, width, height }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g opacity="0.6" clipPath="url(#clip0_2263_11636)">
                <path
                    d="M20 30C21.1 30 22 29.1 22 28H18C18 29.1 18.9 30 20 30ZM26 24V19C26 15.93 24.37 13.36 21.5 12.68V12C21.5 11.17 20.83 10.5 20 10.5C19.17 10.5 18.5 11.17 18.5 12V12.68C15.64 13.36 14 15.92 14 19V24L12 26V27H28V26L26 24ZM24 25H16V19C16 16.52 17.51 14.5 20 14.5C22.49 14.5 24 16.52 24 19V25Z"
                    fill={color}
                />
            </g>
            <defs>
                <clipPath id="clip0_2263_11636">
                    <rect width="24" height="24" fill="white" transform="translate(8 8)" />
                </clipPath>
            </defs>
        </svg>
    );
}

export default Notification;
