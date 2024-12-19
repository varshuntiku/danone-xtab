import React from 'react';

const Archive = ({ color = '#000000', className }) => (
    <svg
        width="19"
        height="18"
        viewBox="0 0 19 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M2.46875 4.5L2.20286 3.64914C2.10224 3.32717 2.34278 3 2.6801 3H16.3199C16.6572 3 16.8978 3.32717 16.7971 3.64914L16.5312 4.5"
            stroke={color}
            strokeWidth="0.75"
        />
        <path
            d="M4.48363 2L4.17355 1.35885C4.09326 1.19283 4.2142 1 4.39861 1H15.6014C15.7858 1 15.9067 1.19283 15.8265 1.35885L15.5164 2"
            stroke={color}
            strokeWidth="0.75"
        />
        <path
            d="M1.12586 5.375H17.8808C18.2537 5.375 18.5437 5.69952 18.5018 6.07011L17.3603 16.1823C17.2676 17.004 16.5725 17.625 15.7456 17.625H3.32114C2.49784 17.625 1.80463 17.0093 1.70749 16.1917L0.505225 6.07375C0.461047 5.70195 0.751447 5.375 1.12586 5.375Z"
            stroke={color}
            strokeWidth="0.75"
        />
        <rect x="5" y="12" width="9.6381" height="1.09524" rx="0.547619" fill={color} />
    </svg>
);

export default Archive;
