const appScreenFilterStyle = (theme) => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'none',
        zIndex: '2'
    },
    filterButton: {
        height: theme.layoutSpacing(32),
        minWidth: theme.layoutSpacing(99),
        color: `${theme.palette.text.contrastText} !important`,
        textTransform: 'none',
        padding: `0 ${theme.layoutSpacing(8)}`,
        borderColor: `${theme.palette.primary.contrastText} !important`,
        outlineColor: `${theme.palette.primary.contrastText} !important`,
        '& .MuiButton-label': {
            paddingLeft: theme.layoutSpacing(8),
            paddingRight: theme.layoutSpacing(8)
        },
        '& span': {
            fontSize: theme.layoutSpacing(16),
            fontFamily: theme.body.B1.fontFamily,
            fontWeight: 500,
            letterSpacing: theme.layoutSpacing(0.5)
        }
    },
    filterToolbarButtonCancel: {
        marginRight: theme.spacing(2),
        color: theme.palette.text.default,
        borderColor: theme.palette.text.default,
        '&:hover': {
            borderColor: theme.palette.text.default,
            backgroundColor: 'transparent',
            color: theme.palette.text.default
        }
    },
    filterToolbarButtonApply: {
        marginRight: theme.spacing(2),
        color: theme.button.applyButton.color,
        borderColor: theme.palette.text.default,
        backgroundColor: theme.palette.text.default,
        '&:hover': {
            borderColor: theme.palette.text.default,
            backgroundColor: theme.palette.text.default
        }
    },
    verticalLine: {
        height: '1.1rem',
        width: '0.1rem',
        backgroundColor: theme.palette.border.filterVerticalBorder,
        opacity: '60%'
    },
    filterRadioLabel: {
        fontSize: '1.5rem'
    },
    grow: {
        flexGrow: 1
    },
    hide: {
        display: 'none'
    },
    iconButtonProgress: {
        position: 'absolute',
        top: '25%',
        right: '50%',
        color: theme.palette.text.default
    },
    filtersGridBody: {
        padding: theme.spacing(1, 2)
    },
    filterCategoryBody: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: '0',
        borderTop: '1px solid rgba(151, 151, 151, 0.4)'
    },
    filterAppliedList: {
        display: 'flex',
        alignItems: 'center'
    },
    filterOptionContainer: {
        float: 'left',
        cursor: 'pointer',
        paddingLeft: '0.73rem',
        paddingRight: '0.74rem',
        '& :hover': {
            backgroundColor: theme.palette.primary.light,
            borderRadius: '0.5rem'
        }
    },
    filterOption: {
        padding: '0.8rem 0.72rem 0.8rem 0.72rem',
        margin: '0rem 0rem 0rem 0rem',
        cursor: 'pointer'
    },
    filterOptionHeader: {
        color: theme.palette.text.default,
        padding: '0.5rem 0rem 0.5rem 0rem',
        fontSize: theme.layoutSpacing(16),
        lineHeight: 'normal',
        fontWeight: 500,
        pointerEvents: 'none',
        fontFamily: theme.body.B1.fontFamily
    },
    filterOptionValue: {
        padding: '0.5rem 0rem 0.5rem 1rem',
        fontSize: theme.layoutSpacing(16),
        lineHeight: 'normal',
        fontWeight: 500,
        color: theme.palette.text.hightlightFilter,
        pointerEvents: 'none',
        fontFamily: theme.body.B3.fontFamily
    },
    filterFormControl: {
        margin: theme.spacing(2),
        color: theme.palette.text.default,
        '& h5': {
            fontWeight: '500',
            fontSize: '1.5rem'
        },
        '& .MuiFormControlLabel-label': {
            fontWeight: '400',
            fontSize: '1.5rem',
            color: theme.palette.text.default
        },
        '& svg': {
            width: '2rem',
            height: '2rem',
            color: theme.palette.text.default
        },
        '& .makeStyles-checkedLabel-505': {
            fontWeight: '500'
        },
        '& .MuiSlider-valueLabel': {
            fontSize: '1.5rem',
            fontWeight: '500'
        }
    },
    filterToolbarLabel: {
        color: theme.palette.text.default,
        marginRight: theme.spacing(1),
        width: theme.spacing(8)
    },
    filterFormOptionsContainer: {
        maxHeight: theme.spacing(18),
        overflow: 'auto',
        paddingLeft: '0.5rem'
    },
    radio: {
        color: theme.palette.text.default
    },
    radioChecked: {
        color: theme.palette.text.default
    },
    arrow: {
        color: theme.palette.primary.dark
    },
    tooltip: {
        border: '1px solid',
        borderColor: theme.palette.text.default,
        backgroundColor: theme.palette.primary.dark,
        maxWidth: 'none',
        width: '45rem',
        padding: '1rem 1.8rem 1rem 1.8rem'
    },
    tooltipText: {
        fontSize: '1.5rem',
        color: theme.palette.text.titleText,
        marginBottom: '1rem'
    },
    tooltipNote: {
        fontSize: '1.5rem',
        color: '#FE6A9C',
        marginBottom: '1rem'
    },
    buttonSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    tooltipButton: {
        borderRadius: '5rem'
    },
    tooltipSnack: {
        backgroundColor: '#F9E58B',
        fontSize: '1.5rem !important',
        color: theme.palette.text.breadcrumbText
    },
    snackIcon: {
        /* backgroundColor: 'rgba(255, 255, 255, 0.5)', */
        color: theme.palette.icons.backgroundColorWithOpacity
    }
});

export default appScreenFilterStyle;
