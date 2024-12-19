const appWidgetGraphStyle = (theme) => ({
    graphLoader: {
        height: '100%',
        width: '100%'
    },
    graphLoaderIcon: {
        position: 'absolute',
        left: '49%',
        top: '50%',
        zIndex: 1000
    },
    graphLoaderColor: {
        color: theme.palette.primary.contrastText + ' !important'
    },
    skeletonWave: {
        background: '#C4C4C4 ',
        opacity: '10%',
        borderRadius: theme.spacing(1),
        '&:after': {
            animation: 'MuiSkeleton-keyframes-wave 0.6s linear 0s infinite'
        }
    },

    graphBody: {
        padding: 0,
        height: '100%',
        position: 'relative',
        '& :hover': {
            '& $storyCheckbox': {
                visibility: 'visible !important'
            }
        }
    },
    graphWrapper: {
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
    },
    graphHalfWrapper: {
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
    },
    graphLabel: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.default,
        fontSize: theme.title.h2.fontSize,
        '& h5.MuiTypography-root.MuiTypography-h5': {
            color: theme.palette.text.default,
            // fontSize: theme.layoutSpacing(16),
            fontWeight: '500',
            letterSpacing: theme.layoutSpacing(0.5),
            fontFamily: theme.body.B5.fontFamily,
            paddingLeft: theme.layoutSpacing(15),
            textTransform: 'capitalize',
            opacity: 1,
            fontSize: theme.layoutSpacing(16)
        },
        '& h6': {
            fontSize: '1.5rem'
        },
        position: 'relative',
        animation: 'move-text 0.5s forwards',
        bottom: '-1em',
        opacity: 0,
        animationDelay: '0.60s',
        animationTimingFunction: 'ease-out',
        textTransform: theme.title.h2.textTransform,
        letterSpacing: theme.title.h4.letterSpacing,
        fontWeight: theme.title.h2.fontWeight,
        lineHeight: 'normal',
        fontFamily: theme.title.h2.fontFamily,
        '& .Mui-checked': {
            '&:hover': {
                backgroundColor: 'transparent'
            }
        },
        justifyContent: 'flex-start'
    },
    graphLabelNoCasing: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.default,
        fontSize: theme.title.h2.fontSize,
        '& h5.MuiTypography-root.MuiTypography-h5': {
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(18),
            fontWeight: 'normal',
            letterSpacing: theme.layoutSpacing(0.5),
            fontFamily: theme.title.h1.fontFamily,
            paddingLeft: theme.layoutSpacing(15)
        },
        '& h6': {
            fontSize: '1.5rem'
        },
        position: 'relative',
        animation: 'move-text 0.5s forwards',
        bottom: '-1em',
        opacity: 0,
        animationDelay: '0.60s',
        animationTimingFunction: 'ease-out',
        letterSpacing: theme.title.h4.letterSpacing,
        fontWeight: theme.title.h2.fontWeight,
        lineHeight: 'normal',
        fontFamily: theme.title.h2.fontFamily,
        '& .Mui-checked': {
            '&:hover': {
                backgroundColor: 'transparent'
            }
        }
    },
    graphLabelTwo: {
        '& h5.MuiTypography-root.MuiTypography-h5': {
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(18),
            fontWeight: '400',
            letterSpacing: 0,
            lineHeight: 'normal',
            fontFamily: theme.body.B1.fontFamily,
            margin: `${theme.layoutSpacing(10)} ${theme.layoutSpacing(10)}`,
            opacity: 1,
            textTransform: 'capitalize',
            paddingLeft: theme.layoutSpacing(8)
        }
    },
    graphLabelTwoNoCasing: {
        '& h5.MuiTypography-root.MuiTypography-h5': {
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(18),
            fontWeight: '400',
            letterSpacing: 0,
            lineHeight: 'normal',
            fontFamily: theme.body.B1.fontFamily,
            margin: `${theme.layoutSpacing(10)} ${theme.layoutSpacing(10)}`,
            opacity: 1,
            paddingLeft: theme.layoutSpacing(8)
        }
    },
    graphActionsBar: {
        display: 'flex',
        gridGap: '0.5rem',
        alignItems: 'center',
        marginLeft: 'auto',
        paddingLeft: theme.spacing(2),
        paddingBottom: theme.layoutSpacing(28),
        position: 'relative'
    },
    plotActionsBar: {
        paddingBottom: theme.layoutSpacing(8)
    },
    diagnosemeApp: {
        display: 'none'
    },
    actionsBarItem: {
        display: 'flex',
        gap: theme.layoutSpacing(12)
    },
    actionsBarItemLeftContainer: {
        position: 'relative',
        marginLeft: theme.spacing(2),
        float: 'left'
    },
    commentIcon: {
        padding: '0.5rem',
        margin: '1rem',
        '&:hover': { borderRadius: '9999px', background: theme.palette.background.selected },
        '& svg': {
            width: '2rem',
            height: '2rem',
            stroke: `${theme.palette.text.contrastText} !important`,
            fill: theme.palette.text.constratText
        }
    },
    downloadButton: {
        padding: theme.spacing(0.5),
        minWidth: theme.spacing(5)
    },
    graphActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: `${theme.layoutSpacing(10)} ${theme.layoutSpacing(24)}`,
        backgroundColor: theme.palette.primary.light,
        position: 'relative',
        '&:after': {
            position: 'absolute',
            content: '""',
            left: theme.layoutSpacing(8),
            right: theme.layoutSpacing(8),
            width: `calc(100% -${theme.layoutSpacing(8)})`,
            bottom: 0,
            height: '1px',
            backgroundColor: theme.palette.separator.grey
        }
    },
    graphContainer: {
        overflowY: 'auto',
        position: 'relative',
        animation: 'graph-view-animateIn 0.75s forwards',
        bottom: '-1em',
        opacity: 0,
        animationDelay: '0.400s',
        animationTimingFunction: 'ease-in-out',
        flex: 1,
        overflowX: 'hidden'
    },
    graphContainerDiagnoseme: {
        overflowY: 'hidden',
        position: 'relative',
        animation: 'graph-view-animateIn 0.75s forwards',
        bottom: '-1em',
        opacity: 0,
        animationDelay: '0.400s',
        animationTimingFunction: 'ease-in-out',
        flex: 1,
        overflowX: 'hidden'
    },
    halfSearchBar: {
        width: theme.layoutSpacing(472)
    },
    simulateButton: {},
    simulatorButtons: {
        marginRight: theme.spacing(2),
        textTransform: 'capitalize',
        '& .MuiButton-label': {
            color: theme.palette.icons.closeIcon,
            textTransform: 'capitalize'
        },
        '&.MuiButton-outlined': {
            borderColor: theme.palette.icons.closeIcon,
            textTransform: 'capitalize'
        }
    },
    simulatorButtonsContained: {
        marginRight: theme.spacing(2),
        textTransform: 'capitalize',
        '& .MuiButton-label': {
            color: theme.button.applyButton.color,
            fontFamily: theme.title.h1.fontFamily,
            textTransform: 'capitalize'
        },
        '&.MuiButton-contained': {
            textTransform: 'capitalize',
            color: theme.button.applyButton.color,
            backgroundColor: theme.palette.text.sidebarSelected
        }
    },
    simulatorTableHeaders: {
        width: '100%'
    },
    simulatorTableHeaderText: {
        fontSize: theme.layoutSpacing(16),
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: '500'
    },
    simulatorTableCell: {
        width: '100%',
        textAlign: 'start',
        color: theme.palette.text.default,
        fontFamily: theme.body.B5.fontFamily
    },
    simulatorTableCellText: {
        color: theme.palette.text.default,
        textAlign: 'right',
        marginTop: theme.spacing(2),
        fontSize: theme.layoutSpacing(18),
        fontWeight: '400',
        '&.MuiTypography-root[data-variant="h5"]': {
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(16),
            fontWeight: 'normal',
            letterSpacing: theme.layoutSpacing(0.5),
            fontFamily: theme.body.B1.fontFamily
        }
    },
    simulatorTableCellInput: {
        marginLeft: theme.spacing(2),
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            backgroundColor: theme.palette.text.white,
            border: '2px solid ' + theme.palette.border.grey,
            color: '#092743',
            textAlign: 'right',
            padding: theme.spacing(0.5, 1),
            marginTop: theme.spacing(1),
            fontSize: '1.5rem',
            borderRadius: '5px'
        }
    },
    simulatorTableFirstColCell: {
        width: '100%',
        marginTop: theme.spacing(2)
    },
    simulatorTableFirstColCellText: {
        color: theme.palette.text.default,
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: '400'
    },
    graphSimulatorContainer: {
        height: '100%',
        position: 'relative',
        backgroundColor: theme.palette.primary.light
    },
    graphSimulatorHalfContainer: {
        height: '40%',
        position: 'relative',
        marginBottom: theme.spacing(7.5)
    },
    simulatorBody: {
        '&.MuiGrid-item': {
            padding: `0 ${theme.layoutSpacing(24)}`,
            borderRight: `1px solid ${theme.palette.text.default}26`
        }
    },
    simulatorBodyFirst: {
        '&.MuiGrid-item': {
            borderRight: 'none'
        }
    },
    simulatorBodyLast: {
        '&.MuiGrid-item': {
            borderRight: 'none'
        }
    },
    simulatorBodyContainer: {
        height: 'calc(100% - ' + theme.spacing(7) + ')',
        overflowY: 'auto',
        position: 'relative',
        marginTop: '0.5rem',

        '@media (min-height: 1000px)': {
            height: 'calc(100% - ' + theme.spacing(8.2) + ')'
        }
    },
    simulatorBodyContainerMultiple: {
        height: 'calc(100% - ' + theme.spacing(12.5) + ')',
        overflowY: 'auto',
        position: 'relative',
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(25)}`
    },
    simulatorFormDivider: {
        borderBottom: '1px solid ' + theme.palette.separator.grey,
        paddingTop: theme.spacing(1.5)
    },
    simulatorSliderLabel: {
        padding: theme.spacing(1, 0),
        '&.MuiTypography-root[data-variant="h5"]': {
            color: theme.palette.text.revamp,
            fontSize: theme.layoutSpacing(16),
            fontWeight: 'normal',
            letterSpacing: 0,
            fontFamily: theme.body.B1.fontFamily,
            opacity: 1,
            textTransform: 'capitalize',
            lineHeight: 'normal'
        }
    },
    simulatorSliderInput: {
        margin: theme.spacing(0.35, 0),
        color: theme.palette.text.default,
        '& .MuiSlider-rail': {
            backgroundColor: theme.palette.background.simulatorRail
        }
    },
    simulatorSliderInputBox: {
        marginLeft: theme.layoutSpacing(30),
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            border: '1px solid ' + theme.palette.border.grey,
            color: theme.palette.text.revamp,
            textAlign: 'right',
            padding: theme.spacing(0.3, 1),
            margin: theme.spacing(0.6, 0),
            borderRadius: '2px',
            fontSize: theme.layoutSpacing(15),
            fontWeight: 'normal',
            letterSpacing: 0,
            fontFamily: theme.body.B1.fontFamily,
            background: theme.palette.background.pureWhite,
            lineHeight: 'normal',
            height: theme.layoutSpacing(32)
        }
    },
    simulatorRowWrapper: {
        alignItems: 'center'
    },
    simulatorSectionHeader: {
        padding: theme.spacing(1, 0),
        '&.MuiTypography-root[data-variant="h5"]': {
            color: theme.palette.text.revamp,
            fontSize: theme.layoutSpacing(16),
            fontWeight: '500',
            letterSpacing: 0,
            fontFamily: theme.body.B1.fontFamily,
            opacity: 1,
            textTransform: 'capitalize',
            lineHeight: 'normal'
        }
    },
    simulatorOptimizeCellLabel: {
        float: 'left',
        fontSize: '1.5rem',
        padding: theme.spacing(1, 0),
        textTransform: 'capitalize !important',
        '&.MuiTypography-root[data-variant="h5"]': {
            color: theme.palette.text.revamp,
            fontSize: theme.layoutSpacing(16),
            fontWeight: 'normal',
            letterSpacing: 0,
            fontFamily: theme.body.B1.fontFamily,
            opacity: 1,
            textTransform: 'capitalize',
            lineHeight: 'normal'
        }
    },
    simulatorOptimizeCellInput: {
        marginLeft: theme.spacing(2),
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            border: '1px solid ' + theme.palette.border.grey,
            color: theme.palette.text.revamp,
            textAlign: 'right',
            padding: theme.spacing(0.3, 1),
            margin: theme.spacing(0.6, 0),
            borderRadius: '2px',
            fontSize: theme.layoutSpacing(15),
            fontWeight: 'normal',
            letterSpacing: 0,
            fontFamily: theme.body.B1.fontFamily,
            background: theme.palette.background.pureWhite,
            lineHeight: 'normal',
            height: theme.layoutSpacing(32)
        }
    },
    graphFilterMenuItem: {
        fontSize: '1.5rem',
        fontFamily: theme.body.B5.fontFamily,
        color: theme.palette.text.default + ' !important',
        maxHeight: theme.layoutSpacing(38.2) + ' !important',
        minHeight: theme.layoutSpacing(38.2) + ' !important',
        padding: theme.layoutSpacing(10.5),
        '&:hover': {
            color: theme.palette.text.default,
            backgroundColor: theme.palette.background.menuItemHover
        }
    },
    graphFilterMenuItemSelected: {
        fontSize: `${theme.layoutSpacing(13.1)} !important`,
        color: theme.palette.text.default + ' !important',
        fontFamily: theme.body.B5.fontFamily + ' !important',
        fontWeight: '400',
        padding: theme.layoutSpacing(10.5),
        letterSpacing: '0.5px',
        backgroundColor: theme.palette.background.menuItemFocus + '99 !important'
    },
    graphFilterMenuSearchItem: {
        fontSize: '1.5rem',
        maxHeight: theme.layoutSpacing(38.2) + ' !important',
        minHeight: theme.layoutSpacing(38.2) + ' !important',
        padding: theme.layoutSpacing(10.5),
        color: theme.palette.primary.contrastText + ' !important'
    },
    graphFilterMenuSearchInput: {
        width: '100%',
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            textAlign: 'left',
            padding: theme.spacing(1, 1),
            width: '100%',
            margin: theme.spacing(0.6, 0),
            fontSize: '1.5rem',
            '&:focus': {
                borderBottom: `1px solid ${theme.palette.border.inputFocus}`
            }
        }
    },
    graphFilterMenuSearchIcon: {
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(1.2)
    },
    filterMenuContainer: {
        maxHeight: '30rem'
    },
    gridTableBody: {
        width: '100%',
        height: '100%'
    },
    graphOptionContainer: {
        // float: 'right',
        position: 'relative',
        backgroundColor: theme.palette.background.pureWhite,
        height: theme.layoutSpacing(28),
        border: `1px solid ${theme.palette.border.grey}`,
        zIndex: '100',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '&:hover': {
            cursor: 'pointer',
            border: `1px solid ${theme.palette.text.default}`
        }
    },
    graphToggleContainer: {
        backgroundColor: 'transparent'
    },
    graphOptionLabel: {
        float: 'left',
        position: 'relative',
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(16)}`,
        color: theme.palette.text.default,
        fontFamily: theme.body.B5.fontFamily,
        height: '100%',
        fontWeight: 500,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '&.MuiTypography-root[data-variant="h5"]': {
            fontSize: theme.layoutSpacing(13.8),
            fontWeight: 500,
            fontFamily: theme.body.B5.fontFamily,
            letterSpacing: '0.5px',
            textTransform: 'capitalize'
        }
    },
    graphOptionContainerOne: {
        position: 'relative',
        backgroundColor: theme.palette.background.pureWhite,
        height: theme.layoutSpacing(38.2),
        zIndex: '100',
        display: 'flex',
        justifyContent: 'center'
    },
    graphOptionLabelone: {
        float: 'left',
        position: 'relative',
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(13.2),
        fontFamily: theme.body.B5.fontFamily,
        height: '100%',
        fontWeight: 500,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        padding: `${theme.layoutSpacing(10.5)}`,
        '&.MuiTypography-root[data-variant="h5"]': {
            fontSize: theme.layoutSpacing(13.2),
            fontWeight: 500,
            fontFamily: theme.body.B5.fontFamily
        }
    },
    graphHideUpdateMenu: {
        display: 'none'
    },
    toolBarText: {
        float: 'left',
        position: 'relative',
        padding: theme.spacing(0.5, 0),
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1.5),
        color: theme.palette.text.default,
        fontWeight: 500,
        fontSize: '1.5rem'
    },
    graphOptionValue: {
        float: 'left',
        position: 'relative',
        padding: theme.spacing(0.5, 0),
        paddingRight: theme.spacing(4),
        color: theme.palette.background.infoBgDark,
        cursor: 'pointer',
        '&:hover': {
            borderRadius: theme.spacing(0.5)
        },
        '& svg': {
            fill: theme.palette.text.revamp
        }
    },
    graphOptionValueOne: {
        float: 'left',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: `${theme.layoutSpacing(10.5)}`,
        color: theme.palette.background.infoBgDark,
        cursor: 'pointer',
        '&:hover': {
            borderRadius: theme.spacing(0.5)
        }
    },
    graphOptionValueType: {
        fontWeight: '500 !important',
        fontSize: `${theme.layoutSpacing(13.8)} !important`,
        fontFamily: `${theme.body.B5.fontFamily} !important`,
        color: theme.palette.text.hightlightFilter,
        letterSpacing: '0.5px',
        textTransform: 'capitalize !important'
    },
    graphOptionIcon: {
        position: 'absolute',
        right: theme.spacing(0.4),
        top: theme.spacing(0.5),
        fontWeight: 700
    },
    graphOptionMenu: {
        position: 'absolute'
    },
    storyCheckbox: {
        transform: 'scale(1.5)',
        paddingBottom: theme.layoutSpacing(28),

        '&:hover': {
            backgroundColor: 'transparent'
        },
        marginRight: '0 !important'
    },
    plotStoryCheckbox: {
        paddingTop: theme.layoutSpacing(0) + '!important',
        paddingBottom: '0.3rem !important'
    },
    downloadButtonSingleTable: {
        padding: theme.spacing(0.5),
        minWidth: theme.spacing(5),
        backgroundColor: 'transparent',
        border: '1px solid ' + theme.palette.primary.contrastText,
        color: theme.palette.primary.contrastText,
        borderRadius: theme.spacing(0.5),
        cursor: 'pointer',
        '&:hover': {
            opacity: '0.75',
            backgroundColor: theme.palette.primary.light,
            border: '1px solid ' + theme.palette.primary.contrastText,
            color: theme.palette.primary.contrastText
        }
    },
    graphGridContainer: {
        padding: theme.spacing(2),
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        height: 'auto'
    },
    graphTitleTypography: {
        color: theme.palette.text.revamp,
        opacity: '1',
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(18),
        letterSpacing: 0,
        fontWeight: 400,
        textTransform: 'capitalize'
    },
    actionsBarItemSimulator: {
        float: 'right',
        position: 'relative',
        margin: theme.spacing(1)
    },
    actionBar: {
        display: 'flex',
        justifyContent: 'space-between',
        '& h5': {
            marginTop: '0px'
        }
    },
    graphenlargeicon: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    actionCancel: {
        fontWeight: 400,
        color: theme.palette.text.default,
        fontSize: '1.8rem',
        padding: '8px',
        cursor: 'default'
    },
    iconStyles: {
        width: '3rem',
        height: '3rem',
        objectFit: 'contain',
        borderRadius: '50%',
        marginRight: '2rem'
    },
    widgetHeadWrapper: {
        paddingBottom: theme.layoutSpacing(28),
        gridArea: 'labelHead',
        display: 'flex'
    },
    plotHeadWrapper: {
        paddingBottom: theme.layoutSpacing(8)
    },

    customWidgetHeadOne: {
        //paddingBottom: theme.layoutSpacing(27.5)
    },
    resetIcon: {
        paddingRight: '0.2rem',
        fontSize: '2rem'
    },
    searchContainer: {
        display: 'flex',
        gap: theme.layoutSpacing(4)
    },
    downloadIcon: {
        marginRight: '-1rem',
        padding: '1rem',
        '& svg': {
            fill: theme.palette.text.default
        }
    },
    box: {
        paddingTop: theme.layoutSpacing(0),
        marginBottom: 0
    },
    labelWrapper: {
        justifyContent: 'center'
    },
    readOnlyHeaderContainer: {
        fontWeight: '500',
        fontSize: theme.layoutSpacing(16),
        letterSpacing: theme.layoutSpacing(0.5),
        fontFamily: theme.title.h1.fontFamily,
        padding: `${theme.layoutSpacing(5)} ${theme.layoutSpacing(25)}`
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 5,
        '& svg': {
            cursor: 'pointer',
            '& path': {
                fill: theme.palette.icons.contrast
            }
        }
    },
    simulatorWithoutClose: {
        backgroundColor: theme.palette.background.pureWhite,
        marginLeft: theme.layoutSpacing(-12),
        marginRight: theme.layoutSpacing(-8)
    },
    outlinedBtnStyle: {
        border: 'none'
    },
    filterOptionsWithDownload: {
        // position: 'absolute',
        // bottom: '-1rem',
        // left: '-15rem',
    },
    renderContainer: {
        height: '100%',
        width: '100%'
    },
    multipleUpdateMenuTrigger: {
        height: theme.layoutSpacing(32),
        border: `1px solid ${theme.palette.border.grey}`,
        fontSize: theme.layoutSpacing(12.2),
        fontFamily: theme.body.B5.fontFamily,
        color: theme.palette.text.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.layoutSpacing(7),
        padding: theme.spacing(0, 1),
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1.5),
        cursor: 'pointer',
        '&:hover': {
            border: `1px solid ${theme.palette.text.default}`
        },
        '& svg': {
            fontSize: theme.layoutSpacing(26),
            fill: theme.palette.text.default
        }
    },
    shortUpdateMenu: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.layoutSpacing(11)
    },
    multipleMenuContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedValues: {
        fontSize: theme.layoutSpacing(14),
        backgroundColor: theme.palette.background.menuItemFocus,
        padding: '10px',
        borderRadius: '22px',
        fontFamily: theme.body.B5.fontFamily
    },
    selectedLabel: {
        backgroundColor: theme.palette.background.menuItemHover
    },
    selectedOption: {
        border: `1px solid ${theme.palette.background.infoBgDark}`,
        '& svg': {
            fill: theme.palette.background.infoBgDark
        }
    },
    chip: {
        backgroundColor: theme.palette.background.filterCategorySelected,
        fontSize: theme.layoutSpacing(14),
        fontFamily: theme.body.B5.fontFamily,
        color: theme.palette.text.revamp,
        height: theme.layoutSpacing(22),
        fontWeight: '400',
        lineHeight: theme.layoutSpacing(16),
        padding: `${theme.layoutSpacing(6)} ${theme.layoutSpacing(8)}`,
        '& .MuiChip-label': {
            padding: 0
        },
        marginTop: theme.layoutSpacing(0.5)
    },
    numberChip: {
        backgroundColor: theme.palette.background.pureWhite,
        color: theme.palette.background.infoBgDark,
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: '500',
        '& .MuiChip-label': {
            padding: 0
        }
    },
    toolTipStyle: {
        padding: '1rem',
        backgroundColor: theme.palette.background.tooltipBackground,
        position: 'relative',
        top: '-2rem',
        ZIndex: 10,
        height: 'fit-content',
        textAlign: 'start',
        fontSize: theme.layoutSpacing(14),
        borderRadius: '0.5rem',
        color: theme.palette.text.tooltipTextColor,
        fontWeight: '500',
        letterSpacing: '0.35%',
        lineHeight: '15.23px',
        maxWidth: theme.layoutSpacing(200),
        fontFamily: theme.body.B5.fontFamily
    },
    arrowStyle: {
        '&:before': {
            backgroundColor: theme.palette.background.tooltipBackground
        },
        fontSize: theme.layoutSpacing(10.2)
    },
    actionsBarItemOne: {
        display: 'flex',
        justifyContent: 'end',
        marginBottom: theme.layoutSpacing(2)
    },
    noPaddingMargin: {
        padding: '0 !important',
        margin: '0 !important'
    },
    ValueIconContianer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '106%'
    },
    visualTooltip: {
        fontFamily: theme.body.B5.fontFamily,
        fontSize: '1.6rem',
        maxWidth: '35rem',
        maxHeight: '28rem',
        margin: '0.3rem',
        textAlign: 'left',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 12,
        lineHeight: '2.3rem',
        letterSpacing: theme.title.h1.letterSpacing,
        backgroundColor: theme.palette.background.tooltipBackground,
        color: theme.palette.text.tooltipTextColor,
        padding: '4px 8px'
    },
    visualTooltipContainer: {
        padding: '1rem'
    },
    visualTooltipContainerIcon: {
        marginRight: '-5rem',
        padding: '6rem'
    },
    InfoIcon: {
        padding: '4px'
    },
    highlighterStyles: {
        '&$graphBody': {
            animation: '$blink-animation 1.5s linear 5 forwards',
            padding: theme.layoutSpacing(4),
            // boxShadow: '0px 0px 1970.64px 0px #2B70C2, 0px 0px 1126.08px 0px #2B70C2, 0px 0px 656.88px 0px #2B70C2, 0px 0px 328.44px 0px #2B70C2, 0px 0px 93.84px 0px #2B70C2, 0px 0px 46.92px 0px #2B70C2',
            boxShadow: '0 0 10px 10px lightblue'
        }
    },
    '@keyframes blink-animation': {
        to: {
            boxShadow: 'none'
        }
    },
    widgetActionInfoIcon: {
        marginTop: '.2rem',
        cursor: 'pointer',
        color: '#ffbd33',
        '&:hover': {
            transform: 'scale(.8)',
            transition: '1s'
        }
    },
    paperVisible: {
        position: 'absolute',
        top: '4rem',
        right: '-1rem',
        zIndex: 3,
        padding: '1.7rem',
        width: 'auto',
        minWidth: '28rem',
        border: '1px solid ' + theme.palette.border.colorWithOpacity
    },
    columnSelection: {
        color: theme.palette.text.default,
        fontSize: '1.2rem'
    },
    columnDiv: {
        display: 'flex',
        gap: '1rem'
    },
    formControlLabel: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: '2rem'
    },
    rowDiv: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: '2rem'
    },
    radioGroup: {
        marginBottom: '1.2rem'
    },
    downloadFiletable: {
        position: 'relative'
    },
    rowIndexdiv: {
        display: 'flex'
    },
    downloadlabel: {
        fontSize: '1.3rem',
        fontWeight: '520'
    },
    downloadButtonDiv: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    }
});

export default appWidgetGraphStyle;
