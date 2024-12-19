const blockLoaderStyles = (theme) => ({
    loader: {
        width: theme.layoutSpacing(10),
        height: theme.layoutSpacing(20),
        backgroundColor: theme.ConnectedSystemDashboard.progressBlockUnfill
    },
    loaded: {
        backgroundColor: theme.palette.background.successDark
    }
});

export default blockLoaderStyles;
