const appWidgetLabelStyle = (theme) => ({
    labelLoader: {
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(2),
        color: theme.palette.primary.contrastText
    },
    graphLabel: {
        color: theme.palette.text.default,
        '& h5': {
            fontSize: '2rem'
        },
        '& h6': {
            fontSize: '1.5rem'
        },
        position: 'relative',
        animation: 'move-text 0.5s forwards',
        opacity: 0,
        animationDelay: '0.60s',
        animationTimingFunction: 'ease-out',
        marginLeft: '24px'
    },
    graphActionsBar: {
        display: 'flex',
        gridGap: '0.5rem',
        alignItems: 'center',
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1)
    },
    graphLabelContainer: {
        height: '100%',
        // display: 'flex',
        // flexDirection: 'column',
        // justifyContent: 'space-between',
        '&:hover': {
            '& $storyCheckbox': {
                visibility: 'visible !important'
            }
        }
    },
    kpiGrpahCont: {
        boxShadow: 'none',
        border: '1px solid' + theme.palette.text.default
    },
    //for containers with more than 3 KPIs
    lengthyCustomLabel: {
        display: 'grid',
        gridTemplateColumns: '1fr 0.1fr',
        gridTemplateRows: 'auto',
        gap: theme.spacing(2),
        justifyContent: 'start',
        alignItems: 'center',
        '& >*': {
            gridColumn: 1
        }
    },
    lengthyLabelWithGraph: {
        display: 'grid',
        gridTemplateColumns: '1fr 0.1fr',
        gridTemplateRows: 'auto',
        gap: theme.spacing(2),
        justifyContent: 'start',
        alignItems: 'end',
        '& >*': {
            gridColumn: 1
        }
    },
    //for containers will less than 3 KPIs
    shortCustomLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr 0.2fr',
        gap: '2rem',
        gridTemplateRows: 'auto' /* Single row for top alignment */
    },

    exceptional: {
        alignItems: 'center',
        position: 'absolute',
        top: '3px !important',
        '&:hover': {
            '& $storyCheckbox': {
                visibility: 'visible !important'
            }
        }
    },

    exceptionalTwo: {
        position: 'relative',
        top: theme.layoutSpacing(-8.3)
    },
    graphSubLabel: {
        fontWeight: '300 !important',
        color: theme.palette.text.default
    },
    graphSubLabelEmpty: {
        fontWeight: '300 !important',
        color: theme.palette.primary.dark
    },
    graphDataContainer: {
        bottom: 0,
        right: 0,
        width: '100%'
    },
    customGraphDataContainer: {
        display: 'flex'
    },
    graphDataContainerScoreCard: {
        position: 'absolute',
        width: '99.5%',
        height: '100%'
    },
    graphData: {
        position: 'relative',
        padding: theme.spacing(1),
        textAlign: 'right',
        float: 'right',
        fontWeight: '300 !important',
        width: '100%'
    },
    graphDataExtra: {
        position: 'relative',
        textAlign: 'right',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '1rem',
        '& h5': {
            fontSize: '1.35rem',
            [theme.breakpoints.down(theme.breakpoints.values.desktop_sm)]: {
                fontSize: '1.05rem'
            }
        },
        padding: 0,
        paddingRight: '0.8rem',
        '@media (max-height:560px)': {
            paddingTop: '0rem'
        }
    },
    customGraphDataExtra: {
        alignItems: 'baseline'
    },
    graphDataLabel: {
        position: 'relative',
        color: theme.palette.text.default,
        textAlign: 'left',
        fontWeight: '400 !important',
        letterSpacing: '0.06rem',
        opacity: '0.85',
        lineHeight: '2.93rem'
    },
    graphDataExtraLabel: {
        position: 'relative',
        color: theme.palette.text.default,
        textAlign: 'right',
        fontWeight: '500 !important',
        fontSize: '1.5rem',
        letterSpacing: '0.06rem'
    },
    graphDataExtraLabelUp: {
        position: 'relative',
        color: theme.palette.text.indicatorGreenText,
        textAlign: 'right',
        '& .MuiSvgIcon-root': {
            color: 'var(--svg-bgColor)'
        },
        '& path': {
            fill: 'var(--svg-bgColor)'
        }
    },
    graphDataExtraLabelDown: {
        position: 'relative',
        color: theme.palette.error.main,
        textAlign: 'left',
        fontWeight: '500 !important',
        '& .MuiSvgIcon-root': {
            color: 'var(--svg-bgColor)'
        },
        '& path': {
            fill: 'var(--svg-bgColor)'
        }
    },
    graphDataExtraIcon: {
        transform: 'rotate(180deg)'
    },
    graphDataExtraIconPercent: {
        transform: 'rotate(180deg)',
        '& path': {
            fill: theme.palette.icons.indicatorRed
        }
    },
    skeletonWave: {
        background: '#C4C4C4',
        opacity: '10%',
        '&:after': {
            animation: 'MuiSkeleton-keyframes-wave 0.2s linear 0.5s infinite'
        }
    },
    graphLabelWrapper: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        position: 'relative'
    },
    storyCheckbox: {
        transform: 'scale(1.5)',
        padding: theme.layoutSpacing(4),
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    kpiDataExtraIcon: {
        position: 'absolute',
        left: theme.spacing(0),
        top: theme.spacing(3),
        fontSize: '3rem'
    },
    graphLabelKPI: {
        flexDirection: 'column',
        alignItems: 'baseline',
        textTransform: 'capitalize',
        display: '-webkit-box',
        '-webkit-line-clamp': '2',
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
        '& h6': {
            fontSize: '1.5rem'
        },
        position: 'relative',
        '& h5': {
            fontSize: '1.9rem',
            [theme.breakpoints.down(theme.breakpoints.values.desktop_sm)]: {
                fontSize: '1.75rem'
            }
        }
    },

    kpistorybtn: {
        alignItems: 'center',
        position: 'absolute',
        top: theme.layoutSpacing(3.5),
        left: theme.layoutSpacing(21)
    },

    kpiBtnGroup: {
        alignItems: 'center',
        position: 'absolute',
        top: theme.layoutSpacing(3.5),
        right: theme.layoutSpacing(21),
        '& svg': {
            fill: `${theme.palette.text.revamp} !important`
        }
    },
    kpiBtnGroupOne: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: theme.layoutSpacing(5),
        right: theme.layoutSpacing(2)
    },
    kpiBtnGrpForLessKpi: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: theme.layoutSpacing(5),
        right: theme.layoutSpacing(21)
    },
    kpiBtnGrp: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: theme.layoutSpacing(2.8),
        right: theme.layoutSpacing(2)
    },
    tooltipPoper: {
        zIndex: 1299
    },
    toolTipStyle: {
        padding: '1.2rem 1.2rem 2rem 1.2rem',
        backgroundColor: theme.palette.primary.tooltip,
        position: 'relative',
        top: '-2.5rem',
        minWidth: '300px',
        maxWidth: '450px',
        height: 'fit-content',
        textAlign: 'start',
        fontSize: '1.8rem',
        borderRadius: '0.5rem',
        color: theme.palette.text.default,
        boxShadow:
            localStorage.getItem('codx-products-theme') === 'light'
                ? '0px 0px 0px rgba(0,0,0,0.18),-5px 3px 9px rgba(0,0,0,0.18), 5px 3px 9px rgba(0,0,0,0.18)'
                : '0px 0px 0px rgba(0,20,45,0.20),-4px 5px 3px rgba(0,24,54,0.20), 4px 5px 3px rgba(0,24,54,0.20)',
        fontWeight: '300'
    },
    graphLabelHighlightContainer: {
        height: '100%',
        position: 'relative',
        '&:hover': {
            '& $storyCheckbox': {
                visibility: 'visible !important'
            }
        },
        overflow: 'hidden',
        borderBottomLeftRadius: '5px',
        '&:after': {
            content: 'no-open-quote',
            position: 'absolute',
            bottom: 0,
            left: 0,
            margin: '-1.5rem',
            height: '25%',
            width: '3rem',
            backgroundColor: '#AA7EF0',
            transform: 'rotate(45deg)'
        }
    },
    variantPercentageExtraIcon: { fontSize: '3rem' },
    variantPercentageExtraLabel: {
        position: 'relative',
        textAlign: 'left',
        fontWeight: '500 !important',
        fontSize: '2rem',
        color: theme.palette.text.default,
        marginTop: '1rem'
    },
    variantPercentageExtraLabel2: {
        position: 'relative',
        textAlign: 'left',
        fontWeight: '500 !important',
        fontSize: '2rem',
        color: theme.palette.text.default,
        marginTop: '1rem',
        marginBottom: '-2.5rem'
    },
    variantPercentageRootDiv: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2,1fr)',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: '0rem',
        right: 0,
        width: '100%',
        '@media (max-height: 560px)': {
            bottom: '-1rem'
        }
    },
    variantPercentageRootDiv2: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2,1fr)',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: '-1.5rem',
        right: 0,
        width: '100%',
        '@media (max-height: 560px)': {
            bottom: '-1rem'
        }
    },
    variantPercentageArrowValueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        position: 'relative',
        textAlign: 'left',
        fontWeight: '500 !important',
        letterSpacing: '0.06rem',
        color: theme.palette.text.default
    },
    variantPercentageValue: {
        fontSize: '4rem',
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default,
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
    },
    variantPercentageValue2: {
        fontSize: '4rem',
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default,
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        marginBottom: '-2.5rem'
    },
    variantPercentageProgress: {
        color: theme.palette.text.contrastText,
        position: 'absolute',
        left: '0rem'
    },
    circular: {
        position: 'relative',
        marginLeft: '3rem',
        display: 'flex'
    },
    bottom: {
        color: theme.palette.text.light
    },
    extraTitle: {
        color: theme.palette.text.default,
        '& h5': {
            fontSize: '2.2rem'
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    extraTitle2: {
        color: theme.palette.text.default,
        '& h5': {
            fontSize: '2.2rem'
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '-2.5rem'
    },
    circularProgress: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    variantScoreCardRootDiv: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        fontSize: '4rem',
        color: theme.palette.text.default
    },
    scoreStyle: {
        fontFamily: theme.title.h1.fontFamily
    },
    kpiTitle: {
        color: theme.palette.text.default
    },
    percentageVariantKpi: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2,1fr)',
        justifyContent: 'space-between',
        right: 0,
        padding: '.7rem',
        width: '100%'
    },
    indicatorWrapper: {
        display: 'flex',
        alignItems: 'end',
        background: `${theme.palette.icons.indicatorGreen}33`,
        padding: `${theme.layoutSpacing(1)} ${theme.layoutSpacing(4)}`,
        borderRadius: '2px'
    },
    downIndicatorWrapper: {
        background: `${theme.palette.icons.indicatorRed}1A`
    },
    iconStyle: {
        width: theme.layoutSpacing(16),
        height: theme.layoutSpacing(12)
    },
    customIconStyle: {
        width: '1.16rem',
        height: '1.16rem',
        marginBottom: '0.164rem'
    },
    extraLabelStyle: {
        marginLeft: `${theme.layoutSpacing(4)}`
    },
    customLabelWrapperStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:hover': {
            '& $storyCheckbox': {
                visibility: 'visible !important'
            }
        }
    },
    labelWrapperStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '&:hover': {
            '& $storyCheckbox': {
                visibility: 'visible !important'
            }
        }
    },
    widgetContent: {
        width: '100%',
        height: '100%',
        position: 'relative',
        boxShadow: 'none',
        borderRadius: 0,
        '&:hover': {
            '& $storyCheckbox': {
                visibility: 'visible !important'
            }
        }
    },
    subTitle: {
        fontSize: theme.layoutSpacing(16) + '! important',
        fontFamily: theme.body.B5.fontFamily
    },
    headerTooltip: {
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(15),
        textTransform: 'capitalize',
        padding: theme.layoutSpacing(12),
        backgroundColor: theme.palette.primary.tooltip,
        height: 'fit-content',
        textAlign: 'start',
        borderRadius: '0.5rem',
        color: theme.palette.text.default,
        boxShadow:
            localStorage.getItem('codx-products-theme') === 'light'
                ? '0px 0px 0px rgba(0,0,0,0.18),-5px 3px 9px rgba(0,0,0,0.18), 5px 3px 9px rgba(0,0,0,0.18)'
                : '0px 0px 0px rgba(0,20,45,0.20),-4px 5px 3px rgba(0,24,54,0.20), 4px 5px 3px rgba(0,24,54,0.20)',
        fontWeight: '300'
    },
    plotlyHolder: {
        cursor: 'pointer',
        marginBottom: '1rem',
        position: 'absolute',
        right: '-0.5rem',
        top: '4rem',
        height: theme.spacing(7),
        width: theme.spacing(14),
        '@media (max-height:600px)': {
            right: '-1rem',
            width: theme.spacing(15)
        },

        overflow: 'hidden'
    },
    shortPlotlyHolder: {
        top: '2rem'
    },
    singlePlotlyHolder: {
        cursor: 'pointer',
        marginBottom: '1rem',
        top: '4rem',
        position: 'static',
        height: theme.spacing(7),
        width: theme.spacing(14),
        '@media (max-height:600px)': {
            right: '-1rem',
            width: theme.spacing(15)
        },

        overflow: 'hidden'
    },
    connSystemCardPlot: {
        height: theme.spacing(7),
        width: theme.spacing(20),
        marginLeft: '1rem',
        marginBottom: '1rem',
        '& .js-fill': {
            fill: 'url(#graph-gradient) !important'
        },
        color: theme.palette.text.default,
        overflow: 'hidden'
    },
    connSystemCardPlotBig: {
        height: theme.spacing(7),
        width: theme.spacing(10),
        marginLeft: '1rem',
        marginBottom: '1rem',
        '& .js-fill': {
            fill: 'url(#graph-gradient) !important'
        },
        color: theme.palette.text.default
    },
    plotlyPopUpHide: {
        disply: 'none'
    },
    plotlyPopup: {
        zIndex: 10000,
        position: 'absolute',
        height: '300px',
        width: '400px',
        background: theme.palette.background.modelBackground,
        top: '130%',
        left: '10%',
        padding: '1rem',
        boxShadow: '0px 2px 24px 0px rgba(151, 151, 151, 0.4)'
    },
    plotlyPopupLeft: {
        zIndex: 10000,
        position: 'absolute',
        height: '300px',
        width: '400px',
        background: theme.palette.background.modelBackground,
        top: '130%',
        right: '10%',
        padding: '1rem',
        boxShadow: '0px 2px 24px 0px rgba(151, 151, 151, 0.4)'
    },
    legendContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '3rem'
    },
    legendHolder: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
    },
    legendColor: {
        width: '2rem',
        height: '0.8rem',
        background: `var(--background,${theme.palette.text.default})`,
        borderRadius: '1px'
    },
    legendValue: {
        color: theme.palette.text.default,
        fontSize: '1.6rem',
        fontWeight: theme.title.h1.fontWeight,
        fontFamily: theme.body.B1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing
    },
    infoHolder: {
        color: theme.palette.text.default,
        fontSize: '1.6rem',
        fontWeight: theme.title.h6.fontWeight,
        fontFamily: theme.body.B1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing
    },
    popupLegend: {
        zIndex: 10000,
        position: 'absolute',
        height: 'auto',
        width: 'auto',
        background: theme.palette.background.modelBackground,
        top: '130%',
        left: '10%',
        padding: '1rem',
        boxShadow: '0px 2px 24px 0px rgba(151, 151, 151, 0.4)'
    },
    popupLegendLeft: {
        zIndex: 10000,
        position: 'absolute',
        height: 'auto',
        width: 'auto',
        background: theme.palette.background.modelBackground,
        top: '130%',
        right: '10%',
        padding: '1rem',
        boxShadow: '0px 2px 24px 0px rgba(151, 151, 151, 0.4)'
    },
    regularDataContainer: {
        display: 'flex'
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
        position: 'absolute',
        top: '-0.2rem',
        right: '0',
        cursor: 'pointer'
    },
    InfoIcon: {
        padding: '4px'
    }
});

export default appWidgetLabelStyle;
