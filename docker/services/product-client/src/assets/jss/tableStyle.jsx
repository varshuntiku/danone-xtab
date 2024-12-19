const tableStyle = (theme) => ({
    tableCell: {
        '&.MuiTableCell-head': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontSize: '1.5rem'
        },
        '&.MuiTableCell-body': {
            color: theme.palette.text.default,
            fontSize: '1.5rem'
        },
        '&.MuiTableCell-root': {
            borderColor: theme.palette.text.default
        }
    },
    tableDataRow: {
        root: {
            '&:nth-of-type(even)': {
                backgroundColor: theme.palette.primary.main
            },
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.primary.light
            }
        }
    },
    tableSuccessColor: {
        color: theme.palette.success.main
    }
});

export default tableStyle;
