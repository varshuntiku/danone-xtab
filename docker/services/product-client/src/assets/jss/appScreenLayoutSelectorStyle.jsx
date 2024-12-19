const appScreenLayoutSelectorStyle = (theme) => ({
    // needed
    layoutGridRoot: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        height: '100%'
    },
    layoutGrid: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        maxHeight: 'calc(100vh - 48rem)',
        background: theme.palette.primary.dark,
        borderRadius: theme.spacing(1),
        padding: theme.spacing(2),
        width: '100%'
    },
    layoutGridTile: {
        width: 'auto !important',
        height: 'auto !important',
        padding: `${theme.spacing(1)} !important`
    }
});

export default appScreenLayoutSelectorStyle;
