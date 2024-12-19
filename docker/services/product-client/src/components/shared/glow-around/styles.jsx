const glowAroundAnimationStyles = (theme) => {
    const lineBlurCommons = {
        height: 'calc(100% - 96px) !important',
        width: 'calc(100% - 96px) !important',
        fill: 'transparent',
        stroke: theme.palette.primary.contrastText,
        strokeDasharray: '5px 95px',
        strokeDashoffset: '-17px',
        transition: 'stroke-dashoffset 2s ease-in, opacity 2s ease-in',
        rx: theme.spacing(1),
        x: '48px',
        y: '48px',
        opacity: 0,
        animation: '$go-around 5s ease-in'
    };
    return {
        glowAround: {
            position: 'absolute',
            inset: '-50px',
            height: 'calc(100% + 100px) !important',
            width: 'calc(100% + 100px) !important',
            borderRadius: 'inherit',
            zIndex: -1
        },
        glowAround__blur: {
            ...lineBlurCommons,
            strokeWidth: '2px',
            filter: 'blur(5px)'
        },
        glowAround__line: {
            ...lineBlurCommons,
            strokeWidth: '1.5px'
        },
        '@keyframes go-around': {
            '0%': {
                opacity: 0
            },
            '5%': {
                strokeDashoffset: '-20px'
            },
            '20%': {
                opacity: 1
            },
            '90%': {
                opacity: 1
            },
            '100%': {
                strokeDashoffset: '-95px',
                opacity: 0
            }
        }
    };
};

export default glowAroundAnimationStyles;
