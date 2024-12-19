const designNodeWidgetStyle = (theme) => ({
    selectedStyle: {
        outline: `3px solid ${theme.palette.icons.closeIcon}`,
        '&:after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            border: `3px solid ${theme.palette.background.pureWhite}`
        }
    },
    commentIconStyle: {
        position: 'absolute',
        top: theme.layoutSpacing(2),
        right: theme.layoutSpacing(-1.4),
        zIndex: '-1'
    }
});

export default designNodeWidgetStyle;
