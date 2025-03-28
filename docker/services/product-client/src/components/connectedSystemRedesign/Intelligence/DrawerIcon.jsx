import React from 'react';

function DrawerIcon({ color }) {
    return (
        <svg
            width="5"
            height="10"
            viewBox="0 0 5 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1.2503 0.5L4.33609 3.5858C5.11714 4.3668 5.11713 5.6332 4.33609 6.4142L1.2503 9.5L0.725302 8.975L0.200301 8.45L2.2361 6.4142C3.0171 5.6332 3.0171 4.3668 2.2361 3.5858L0.200301 1.55L1.2503 0.5Z"
                fill={color}
            />
        </svg>
    );
}

export default DrawerIcon;
