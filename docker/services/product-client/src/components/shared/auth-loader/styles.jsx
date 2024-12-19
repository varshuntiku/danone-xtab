const authLoaderStyles = (theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(80),
        width: '100%',
        alignSelf: 'flex-start',
        paddingTop: theme.layoutSpacing(130)
    },
    logoContainer: {
        width: '100%',
        display: 'flex',
        '& svg': {
            fill: 'rgba(255, 138, 138, 1) !important',
            margin: 'auto',
            width: '100%',
            height: theme.layoutSpacing(29)
        }
    },
    loaderContainer: {
        display: 'flex',
        height: '16px',
        justifyContent: 'space-between',
        padding: `0 ${theme.layoutSpacing(120)}`,
        width: '100%',
        boxSizing: 'border-box'
    },
    step: {
        width: '8px',
        height: '8px',
        background: '#9080a3',
        transition: '100ms'
    },
    activeStep: {
        width: '8px',
        height: '16px',
        background: theme.palette.primary.contrastText,
        translate: '0 -5px'
    }
});

export default authLoaderStyles;
