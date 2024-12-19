const huggingFaceModelsStyle = (theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginBottom: theme.spacing(1),
        background: theme.palette.primary.dark
    },
    tasks: {
        flex: 0.75,
        borderRight: '1px solid ' + theme.palette.separator.grey
    },
    models: {
        flex: 2
    }
});

export default huggingFaceModelsStyle;
