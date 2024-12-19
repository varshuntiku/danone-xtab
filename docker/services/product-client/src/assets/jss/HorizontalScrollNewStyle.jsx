const HorizontalScrollNewStyle = (theme) => ({
    container: {
        height: '100%',
        width: '100%',
        position: 'relative',
        isolation: 'isolate',
        paddingLeft: '2rem',
        paddingRight: '2rem'
    },
    scrollContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        overflow: 'hidden',
        scrollBehavior: 'smooth'
    },
    cardContainer: {
        height: '100%',
        width: '100%'
    },
    card: {
        width: '200px',
        height: '100%',
        border: '1px solid green'
    },
    scrollButton: {
        width: theme.spacing(5),
        aspectRatio: 1,
        // border: '1px solid ' + theme.palette.text.default,
        // background: theme.palette.background.default,
        backgroundBlendMode: 'overlay',
        position: 'absolute',
        left: '-1rem',
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
        right: 0,
        rotate: '180deg'
    },
    scrollRightButtonInitiatives: {
        left: 'auto',
        right: '-1rem',
        rotate: '180deg'
    },
    scrollButtonDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed'
    },
    disable: {
        opacity: '0.3',
        pointerEvents: 'none',
        '&:hover': {
            opacity: 0.3
        }
    }
});

export default HorizontalScrollNewStyle;
