import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    iconContainer: {
        width: '16px',
        height: '16px',
        marginLeft: '12px'
    }
}));

const SortIcon = ({}) => {
    const classes = useStyles();

    return (
        <div className={classes.iconContainer}>
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g
                    id="sort-arrows-couple-pointing-up-and-down 10"
                    clip-path="url(#clip0_3093_257379)"
                >
                    <g id="Group">
                        <g id="Group_2">
                            <path
                                id="Vector"
                                d="M2.91092 6.54539H13.0926C13.2896 6.54539 13.4601 6.47347 13.6039 6.3295C13.7478 6.18558 13.82 6.01515 13.82 5.81818C13.82 5.6212 13.7478 5.45085 13.6039 5.30673L8.5131 0.215882C8.36926 0.0721198 8.19887 0 8.00177 0C7.80468 0 7.63429 0.0721198 7.49033 0.215882L2.39948 5.30673C2.25551 5.45069 2.18359 5.6212 2.18359 5.81818C2.18359 6.01511 2.25551 6.18558 2.39948 6.3295C2.5436 6.47347 2.71398 6.54539 2.91092 6.54539Z"
                                fill="#929BA7"
                            />
                            <path
                                id="Vector_2"
                                d="M13.0926 9.45508H2.91092C2.71383 9.45508 2.54344 9.52704 2.39948 9.67084C2.25551 9.8148 2.18359 9.98519 2.18359 10.1822C2.18359 10.3791 2.25551 10.5497 2.39948 10.6935L7.49033 15.7843C7.63445 15.9283 7.80484 16.0003 8.00177 16.0003C8.19871 16.0003 8.36926 15.9283 8.5131 15.7843L13.6039 10.6935C13.7478 10.5497 13.82 10.3791 13.82 10.1821C13.82 9.98519 13.7478 9.8148 13.6039 9.6708C13.4601 9.52688 13.2896 9.45508 13.0926 9.45508Z"
                                fill="#929BA7"
                            />
                        </g>
                    </g>
                </g>
                <defs>
                    <clipPath id="clip0_3093_257379">
                        <rect width="16" height="16" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
};
export default SortIcon;
