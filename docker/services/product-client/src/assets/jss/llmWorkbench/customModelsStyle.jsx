const customModelsStyle = (theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%'
    },
    uploadContainer: {
        background: theme.palette.primary.main,
        width: '50%',
        height: '80%'
    },
    wrapper: {
        border: `dashed 1px ${theme.palette.border.dashboard}`,
        '& svg': {
            fontSize: '10rem',
            strokeWidth: '0.5rem'
        },
        margin: theme.spacing(3)
    },
    uploadButton: {
        display: 'none'
    },
    browse: {
        padding: 0,
        minWidth: 0,
        textTransform: 'capitalize'
    },
    fileBox: {
        margin: theme.spacing(3),
        border: `1px solid ${theme.palette.border.dashboard}`,
        '& .delete-icon': { color: '#E13655' }
    },
    text: {
        color: theme.palette.text.default
    }
});

export default customModelsStyle;
