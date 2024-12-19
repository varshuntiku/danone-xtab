const animatedHeaderStyles = (theme) => ({
    header: {
        textAlign: 'center',
        fontWeight: 'bold',
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: theme.palette.text.default
    },
    fixedText: {
        flex: 1
    },
    header__dynamicContainer: {
        perspective: theme.spacing(42.5),
        minHeight: theme.spacing(8.5),
        width: '100%',
        position: 'relative'
    },
    header__dynamicText: {
        position: 'absolute',
        width: '100%',
        height: theme.spacing(8.5),
        transformStyle: 'preserve-3d',
        animation: '$rotate 10s infinite',
        transform: 'rotateX(0deg)',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        '& li': {
            height: theme.spacing(8.5),
            width: '100%',
            display: 'block',
            textAlign: 'center',
            color: theme.palette.primary.contrastText,
            transformOrigin: 'center center',
            backfaceVisibility: 'hidden',
            '&:nth-child(1)': {
                transform: 'rotateY(0deg) translateZ(' + theme.spacing(4.25) + ')'
            },
            '&:nth-child(2)': {
                transform: 'rotateX(-90deg) translateZ(' + theme.spacing(-4.25) + ')'
            },
            '&:nth-child(3)': {
                transform:
                    'rotateX(180deg) translateY(' +
                    theme.spacing(17) +
                    ') translateZ(' +
                    theme.spacing(4.25) +
                    ')'
            },
            '&:nth-child(4)': {
                transform: 'rotateX(90deg) translateZ(' + theme.spacing(30) + ')'
            }
        }
    },
    '@keyframes rotate': {
        '0%': {
            transform: 'rotateX(0deg)'
        },
        '25%': {
            transform: 'rotateX(90deg)'
        },
        '50%': {
            transform: 'rotateX(180deg)'
        },
        '75%': {
            transform: 'rotateX(270deg)'
        },
        '100%': {
            transform: 'rotateX(360deg)'
        }
    }
});

export default animatedHeaderStyles;
