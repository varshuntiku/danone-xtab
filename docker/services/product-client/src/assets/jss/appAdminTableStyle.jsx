const appAdminTableStyle = (theme) => ({
    main: {
        padding: '4rem',
        paddingTop: '1.5rem'
    },
    inputConatiner: {
        width: '28%',
        position: 'relative'
    },
    input: {
        fontSize: '1.8rem',
        backgroundColor: theme.palette.background.pureWhite,
        color: theme.palette.text.default,
        border: `2px solid ${theme.palette.border.grey}`,
        outline: 'none',
        padding: '1.3rem',
        paddingLeft: '5rem',
        width: '100%'
    },
    searchIcon: {
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        fontSize: '3rem',
        opacity: '0.5',
        backgroundColor: 'tranparent'
    },
    createNew: {
        float: 'right',
        marginBottom: '2rem'
    },
    resetBtn: {
        marginRight: theme.spacing(2),
        float: 'right',
        margin: '1.6rem 1.6rem',
        fontSize: theme.layoutSpacing(18),
        textTransform: 'none',
        '& .MuiButton-label': {
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(16)
        },
        '&.MuiButton-outlined': {
            borderColor: theme.palette.text.default
        },
        '& svg': {
            fill: theme.palette.text.default + ' !important'
        },
        '&:hover': {
            boxShadow: 'none',
            outline: 'none',
            border: 'none'
        }
    },
    outlinedBtnStyle: {
        border: 'none'
    },
    paginationWrapper: {
        '& .MuiToolbar-root': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(1.7)
        },
        '& .MuiTablePagination-caption': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(1.7)
        },
        '& .MuiTablePagination-selectIcon': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(1.7)
        }
    },
    cursorPointer: {
        '&:hover': {
            cursor: 'pointer'
        }
    },
    booleanCheckIcon: {
        color: theme.palette.success.main
    },
    booleanClearIcon: {
        color: theme.palette.error.main
    },
    deleteIcon: {
        color: theme.palette.error.main + ' !important'
    }
});

export default appAdminTableStyle;
