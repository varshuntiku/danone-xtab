const styledTableCellStyles = (theme) => ({
    head: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.text.titleText,
        fontSize: theme.spacing(1.75),
        height: theme.spacing(7.5),
        border: 'none',
        padding: theme.spacing(0.5, 2)
    },
    body: {
        fontSize: theme.spacing(1.75),
        border: 'none',
        color: theme.palette.text.titleText,
        padding: theme.spacing(0.5, 2)
    }
});

export default styledTableCellStyles;
