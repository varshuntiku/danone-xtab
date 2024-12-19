const horizontalScrollStyle = (theme) => ({
    container: {
        height: '100%',
        width: '100%',
        position: 'relative',
        isolation: 'isolate'
    },
    scrollContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        overflow: 'hidden',
        scrollBehavior: 'smooth'
    },
    cardContainer: {
        height: '100%'
    },
    card: {
        width: '200px',
        height: '100%',
        border: '1px solid green'
    },
    scrollButton: {
        width: theme.spacing(5),
        aspectRatio: 1,
        background: theme.palette.background.default,
        backgroundBlendMode: 'overlay',
        position: 'absolute',
        left: theme.spacing(-1),
        top: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        translate: '0 -50%',
        cursor: 'pointer',
        transition: '0.5s',
        opacity: 0.8,
        zIndex: 100,
        border: 'none',
        backgroundColor: 'transparent',
        '& svg': {
            color: theme.palette.text.default,
            fontSize: theme.spacing(4)
        },
        '&:hover': {
            opacity: 1
        }
    },
    scrollRightButton: {
        left: 'auto',
        right: theme.spacing(-1),
        rotate: '180deg'
    },
    scrollRightButtonInitiatives: {
        left: 'auto',
        right: theme.spacing(-1.5),
        rotate: '180deg'
    },
    scrollButtonDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed'
    }
});

export default horizontalScrollStyle;
