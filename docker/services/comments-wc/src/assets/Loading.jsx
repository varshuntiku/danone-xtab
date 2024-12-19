import React from 'react';

const Loader = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        height="60"
        width="60"
        className="loader"
    >
        <g>
            <circle cx="73.801" cy="68.263" r="5">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    calcMode="spline"
                    values="0 50 50;360 50 50"
                    times="0;1"
                    keySplines="0.5 0 0.5 1"
                    repeatCount="indefinite"
                    dur="1.492s"
                    begin="0s"
                />
            </circle>
            <circle cx="68.263" cy="73.801" r="5">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    calcMode="spline"
                    values="0 50 50;360 50 50"
                    times="0;1"
                    keySplines="0.5 0 0.5 1"
                    repeatCount="indefinite"
                    dur="1.492s"
                    begin="-0.062s"
                />
            </circle>
            <circle cx="61.481" cy="77.716" r="5">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    calcMode="spline"
                    values="0 50 50;360 50 50"
                    times="0;1"
                    keySplines="0.5 0 0.5 1"
                    repeatCount="indefinite"
                    dur="1.492s"
                    begin="-0.125s"
                />
            </circle>
            <circle cx="53.916" cy="79.743" r="5">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    calcMode="spline"
                    values="0 50 50;360 50 50"
                    times="0;1"
                    keySplines="0.5 0 0.5 1"
                    repeatCount="indefinite"
                    dur="1.492s"
                    begin="-0.187s"
                />
            </circle>
            <circle cx="46.084" cy="79.743" r="5">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    calcMode="spline"
                    values="0 50 50;360 50 50"
                    times="0;1"
                    keySplines="0.5 0 0.5 1"
                    repeatCount="indefinite"
                    dur="1.492s"
                    begin="-0.25s"
                />
            </circle>
            <circle cx="38.519" cy="77.716" r="5">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    calcMode="spline"
                    values="0 50 50;360 50 50"
                    times="0;1"
                    keySplines="0.5 0 0.5 1"
                    repeatCount="indefinite"
                    dur="1.492s"
                    begin="-0.312s"
                />
            </circle>
            <circle cx="31.737" cy="73.801" r="5">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    calcMode="spline"
                    values="0 50 50;360 50 50"
                    times="0;1"
                    keySplines="0.5 0 0.5 1"
                    repeatCount="indefinite"
                    dur="1.492s"
                    begin="-0.375s"
                />
            </circle>
            <circle cx="26.199" cy="68.263" r="5">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    calcMode="spline"
                    values="0 50 50;360 50 50"
                    times="0;1"
                    keySplines="0.5 0 0.5 1"
                    repeatCount="indefinite"
                    dur="1.492s"
                    begin="-0.437s"
                />
            </circle>
            <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="spline"
                values="0 50 50;0 50 50"
                times="0;1"
                keySplines="0.5 0 0.5 1"
                repeatCount="indefinite"
                dur="1.492s"
            />
        </g>
    </svg>
);

export default Loader;
