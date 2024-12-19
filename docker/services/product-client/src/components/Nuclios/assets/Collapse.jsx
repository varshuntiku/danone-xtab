import React from 'react';

function Collapse({ color, ...props }) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill={color}
            {...props}
        >
            <rect width="24" height="24" fill="none" />
            <path d="M11.5 5L5.41421 11.0858C4.63317 11.8668 4.63317 13.1332 5.41421 13.9142L11.5 20L12.9167 18.5833L8.24264 13.9093C7.46159 13.1282 7.46159 11.8619 8.24264 11.0808L12.9117 6.41174L11.5 5Z" />
            <path d="M16.5 5L10.4142 11.0858C9.63317 11.8668 9.63317 13.1332 10.4142 13.9142L16.5 20L17.9167 18.5833L13.2426 13.9093C12.4616 13.1282 12.4616 11.8619 13.2426 11.0808L17.9117 6.41174L16.5 5Z" />
        </svg>
    );
}

export default Collapse;
