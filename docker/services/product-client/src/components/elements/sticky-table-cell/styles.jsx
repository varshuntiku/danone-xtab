const stickyTableCellStyles = (theme) => ({
    head: {
        backgroundColor: theme.palette.background.tableHeader,
        color: theme.palette.text.revamp,
        position: 'sticky',
        border: 'none',
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.title.h1.fontFamily,
        zIndex: 2,
        '&.right': {
            right: 0
        },
        '&.left': {
            left: 0
        },
        textTransform: 'capitalize'
    },
    body: {
        color: theme.palette.text.titleText,
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(14),
        minWidth: theme.spacing(10),
        position: 'sticky',
        border: 'none',
        zIndex: 1,
        '&.right': {
            right: 0
        },
        '&.left': {
            left: 0
        }
    }
});

export default stickyTableCellStyles;
