const connectedSystemSolutionsStyle = (theme, props) => ({
    container: {
        width: (props) => props?.width || '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        position: 'relative',
        border: (props) => (props?.border ? '10px solid' : null),
        borderImageSlice: (props) => (props?.border ? 1 : null),
        borderWidth: (props) => (props?.border ? '1px' : null),
        borderImageSource: (props) =>
            props?.border
                ? `linear-gradient(to bottom, ${theme.palette.primary.light}, transparent)`
                : null,
        padding: '2.5px 5px 0'
    },
    solutionsHeader: {
        color: theme.palette.text.default,
        fontSize: theme.spacing(2.5),
        fontWeight: 400
    },
    solutionsContainer: {
        flex: 1,
        transition: 'opacity 0.5s'
    },
    solutionsContainerDisabled: {
        opacity: '0.5 !important'
    }
});

export default connectedSystemSolutionsStyle;
