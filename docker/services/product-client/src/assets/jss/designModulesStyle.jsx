const designModulesStyle = (theme) => ({
    designCard: {
        margin: 0,
        height: '100%'
    },
    designWidgetHeader: {
        color: theme.palette.primary.contrastText
    },
    designWidgetBody: {
        color: theme.palette.text.default,
        paddingTop: theme.spacing(1),
        fontWeight: '300'
    }
});

export default designModulesStyle;
