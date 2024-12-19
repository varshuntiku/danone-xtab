const codxTableStyle = (theme) => ({
    headRow: {
        height: theme.layoutSpacing(44),
        background: theme.palette.background.tableHeader
    },
    nestedHeadRow: {
        height: theme.layoutSpacing(36)
    },
    headCell: {
        padding: `${theme.layoutSpacing(12)} ${theme.layoutSpacing(16)}`,
        color: theme.palette.text.table,
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        '&:first-child': {
            borderTopLeftRadius: '4px'
        },
        '&:last-child': {
            borderTopRightRadius: '4px'
        },
        fontSize: theme.layoutSpacing(16),
        letterSpacing: theme.layoutSpacing(1),
        fontWeight: 500,
        fontFamily: theme.typography.fonts.primaryFont,
        lineHeight: 'normal'
    },
    nestedHeadCell: {
        paddingTop: theme.layoutSpacing(8),
        paddingBottom: theme.layoutSpacing(8)
    },
    contentRow: {
        height: theme.layoutSpacing(53),
        '&:hover': {
            background: theme.palette.background.tableHover
        }
    },
    nestedContentRow: {
        height: theme.layoutSpacing(40)
    },
    contentCell: {
        padding: theme.layoutSpacing(16),
        color: theme.palette.text.table,
        borderBottom: `1px solid ${theme.palette.separator.tableContent}`,
        fontSize: theme.layoutSpacing(14),
        letterSpacing: '0.5px'
    },
    nestedContentCell: {
        paddingTop: theme.layoutSpacing(10),
        paddingBottom: theme.layoutSpacing(10)
    },
    iconCell: {
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(4)}`,
        width: theme.layoutSpacing(24),
        borderBottom: `1px solid ${theme.palette.separator.tableContent}`,
        '& .MuiIconButton-root': {
            marginRight: theme.layoutSpacing(0)
        },
        '& .MuiIconButton-sizeSmall': {
            padding: theme.layoutSpacing(0)
        }
    },
    headerIconcell: {
        borderBottom: `1px solid ${theme.palette.separator.grey}`
    },
    cellWithNoBorder: {
        borderBottom: 'none'
    },
    rightIcon: {
        fill: theme.palette.text.table
    },
    headCellBold: {
        fontWeight: '500'
    },
    arrowDownIcon: {
        fill: theme.palette.icons.selectedBlue
    },
    childCell: {
        padding: 0,
        paddingLeft: theme.layoutSpacing(8),
        borderBottom: 'none'
    },
    cellWithOutIcon: {
        visibility: 'hidden'
    },
    tableLeftBorder: {
        borderLeft: `1px solid ${theme.palette.separator.tableContent}`
    },
    selectedParentRow: {
        backgroundColor: theme.palette.background.tableSelcted
    },
    initialChild: {
        paddingTop: theme.layoutSpacing(8)
    },
    lastChild: {
        borderBottom: `1px solid ${theme.palette.separator.tableContent}`,
        paddingBottom: theme.layoutSpacing(8)
    },
    hightlightText: {
        backgroundColor: theme.palette.background.highlightText,
        color: theme.palette.text.default
    },
    formControl: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        '& .MuiSelect-select:focus': {
            backgroundColor: 'transparent',
            borderBottom: 'none'
        },
        '& .MuiSelect-iconOpen': {
            fill: theme.palette.background.infoBgDark
        },
        '& .MuiInput-underline': {
            '&:before': {
                borderBottom: 'none'
            },
            '&:after': {
                borderBottom: 'none'
            },
            '&:hover:not($disabled):before': {
                borderBottom: 'none'
            }
        }
    },
    input: {
        '& input': {
            color: theme.palette.text.default,
            fontSize: '1.5rem'
        },
        '&:before': {
            borderColor: `${theme.palette.text.default} !important`
        }
    },
    selectEmpty: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        borderBottom: 'none',
        '& svg': {
            fontSize: '3rem'
        }
    },
    menuItem: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        fontFamily: theme.body.B5.fontFamily,
        backgroundColor: theme.palette.background.pureWhite,
        '&:hover': {
            backgroundColor: theme.palette.background.menuItemHover
        }
    },
    selected: {
        backgroundColor: `${theme.palette.background.menuItemFocus} !important`,
        color: theme.palette.text.default,
        fontWeight: 400
    },
    icon: {
        fill: theme.palette.text.default,
        transform: 'scale(2.3)'
    },
    radioText: {
        fontSize: '1.3rem'
    },
    menuBarLabel: {
        fontSize: '5.5rem'
    }
});

export default codxTableStyle;
