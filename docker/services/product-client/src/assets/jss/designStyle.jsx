const designStyle = (theme) => ({
    blueprintDesignBody: {
        width: '100%',
        height: '100%',
        fontColor: theme.palette.text.default,
        borderRadius: theme.spacing(0.5),
        backgroundColor: theme.palette.primary.dark
    },
    blueprintContent: {
        flexGrow: 1,
        position: 'relative',
        height: '100%',
        color: theme.palette.text.default
    },
    blueprintContentToolbar: {
        padding: `${theme.layoutSpacing(16)} ${theme.layoutSpacing(24)}`,
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: theme.layoutSpacing(8),
        borderBottom: `1px solid ${theme.IndustryDashboard.border.light}`
    },
    blueprintContentGridContainer: {
        position: 'relative',
        height: 'calc(100% - ' + theme.layoutSpacing(64) + ')'
    },
    blueprintNodeDetailsButton: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(14),
        fontWeight: 500,
        textTransform: 'none',
        border: 'transparent',
        '& svg': {
            marginRight: theme.layoutSpacing(4),
            fill: theme.palette.text.default
        }
    },
    blueprintNodeDetailsCancelButton: {
        color: theme.palette.text.default,
        textTransform: 'none',
        border: 'transparent',
        '& svg': {
            fill: theme.palette.error.main
        }
    },
    blueprintAddWidgetButton: {
        textTransform: 'none',
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(24)}`,
        fontWeight: 500,
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(15)
    },
    blueprintAddWidgetButtonLabel: {
        paddingLeft: theme.spacing(0.25),
        paddingTop: theme.spacing(0.25)
    },
    blueprintContentWrapper: {
        position: 'relative',
        height: '100%',
        boxShadow: 'none'
    },
    blueprintContentDroppable: {
        width: '100%',
        height: '100%'
    },
    addWidgetHeaderContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        paddingRight: 0
    },
    blueprintAddWidgetHeader: {
        color: theme.palette.text.default,
        fontDamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(20),
        fontStyle: 'normal',
        fontWeight: '500'
    },
    blueprintAddWidgetClose: {
        fontSize: '1rem'
    },
    blueprintAddWidgetCloseButton: {
        cursor: 'pointer',
        '& svg': {
            fill: `${theme.palette.icons.closeIcon} !important`
        }
    },
    blueprintAddWidgetCloseLabel: {
        paddingLeft: theme.spacing(0.25),
        fontSize: '1.2rem'
    },
    draggableChip: {
        margin: theme.spacing(1),
        fontSize: '1.25rem',
        padding: theme.spacing(1),
        width: '100%',
        color: theme.palette.text.white,
        borderRadius: theme.spacing(0.5)
    },
    blueprintAddWidgetGroupBody: {
        width: '100%',
        paddingRight: theme.spacing(3),
        maxHeight: theme.spacing(30),
        overflowX: 'hidden',
        overflowY: 'scroll'
    },
    accordion: {
        '&:before': {
            backgroundColor: theme.palette.separator.grey + '!important'
        },
        '&:hover': {
            backgroundColor: theme.palette.background.tableHeader,
            fontWeight: 'bold',
            opacity: 1,
            color: theme.palette.text.revamp + '! important'
        }
    },
    firstAccordion: {
        '&:before': {
            backgroundColor: 'transparent' + '!important'
        },
        '&:hover': {
            backgroundColor: theme.palette.background.tableHeader,
            fontWeight: 'bold',
            opacity: 1,
            color: theme.palette.text.revamp + '! important'
        }
    },
    searchContainer: {
        position: 'relative'
    },
    search: {
        position: 'absolute',
        top: 8,
        left: 2,
        zIndex: 1,
        marginRight: '1rem',
        fontSize: '3rem',
        fill: theme.palette.text.revamp
    },
    expandIcon: {
        fontSize: '3rem',
        fill: theme.palette.text.default
    },
    widgetTypeName: {
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: '400',
        '&:hover': {
            color: theme.palette.text.revamp + '! important'
        }
    },
    blueprintAddWidgetGroupCustomBody: {
        width: '100%',
        paddingRight: theme.spacing(3)
    },
    blueprintDroppableContainer: {
        width: '100%',
        height: theme.spacing(75)
    },
    blueprintDroppableContainerLoading: {
        width: '100%',
        height: theme.spacing(75),
        margin: 'auto',
        fontSize: '1.5rem',
        color: theme.palette.text.default
    },
    blueprintActionsMenuContainer: {
        maxHeight: '30rem'
    },
    blueprintActionsMenuItem: {
        fontSize: '1.5rem',
        color: theme.palette.primary.contrastText + ' !important',
        '&:hover': {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.light
        }
    },
    blueprintActionsMenuItemSelected: {
        fontSize: '1.5rem',
        color: theme.palette.primary.main + ' !important',
        backgroundColor: theme.palette.primary.contrastText + ' !important'
    },
    blueprintAlertMessage: {
        top: '-' + theme.spacing(0.8),
        position: 'relative',
        fontSize: '2.5rem',
        paddingLeft: theme.spacing(1)
    },
    blueprintAlertIcon: {
        fontSize: '3.5rem'
    },
    blueprintAlertSuccess: {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.text.default,
        borderRadius: theme.spacing(0.5),
        padding: theme.spacing(1)
    },
    blueprintAlertError: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.text.default,
        borderRadius: theme.spacing(0.5),
        padding: theme.spacing(1)
    },
    blueprintWidgetComponentContainer: {
        position: 'relative',
        padding: theme.spacing(2),
        cursor: 'pointer',
        color: theme.palette.text.default
    },
    blueprintWidgetComponentLabel: {},
    blueprintWidgetComponentIcon: {
        display: 'flex',
        gap: theme.layoutSpacing(18),
        flexWrap: 'wrap',
        '& svg': {
            width: '3.5rem',
            height: '3.5rem',
            border: `1px solid ${theme.palette.text.default}`,
            padding: theme.layoutSpacing(8),
            color: theme.palette.text.default
        }
    },
    demo: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(20),
        fontWeight: '500',
        display: 'flex',
        gap: theme.layoutSpacing(8),
        alignItems: 'center',
        cursor: 'pointer',
        padding: '0.4rem',
        '& svg': {
            fontSize: theme.layoutSpacing(18),
            color: theme.palette.text.default
        }
    },
    blueprintNodeDetailsHeader: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: '500',
        paddingLeft: theme.layoutSpacing(8),
        margin: `${theme.layoutSpacing(20)} ${theme.layoutSpacing(0)}`,
        marginTop: theme.layoutSpacing(60)
    },
    blueprintEditorContainer: {
        margin: `${theme.layoutSpacing(24)} ${theme.layoutSpacing(0)}`,
        border: `2px solid ${theme.palette.border.grey}`,
        borderRadius: theme.spacing(0.5),
        width: 'calc(100%)',
        height: '75rem'
    },
    blueprintEditorBody: {
        width: '100%',
        height: theme.spacing(80),
        '& div.monaco-editor .margin, .monaco-editor, .monaco-editor-background, .monaco-editor .inputarea.ime-input':
            {
                backgroundColor: theme.palette.background.pureWhite
            }
    },
    blueprintSmallEditorBody: {
        width: '100%',
        height: theme.spacing(50)
    },
    blueprintOutputsCheckbox: {
        cursor: 'pointer'
    },
    blueprintEditorTabs: {
        '& .MuiTab-root': {
            color: theme.palette.text.default,
            fontFamily: theme.title.h1.fontFamily,
            textTransform: 'none',
            fontWeight: '500',
            fontSize: theme.layoutSpacing(18),
            padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(12)}`,
            borderRadius: 0,
            borderBottom: `2px solid ${theme.palette.border.grey}`,
            minHeight: theme.layoutSpacing(8)
        },
        '& .MuiTabs-root': {
            minHeight: theme.layoutSpacing(8) + '!important'
        },
        '& .Mui-selected': {
            borderBottom: `3px solid ${theme.palette.icons.closeIcon}`,
            color: theme.palette.text.revamp,
            '& .MuiTab-wrapper': {
                color: theme.palette.icons.closeIcon
            }
        },
        '& .MuiTabs-indicator': {
            display: 'none'
        },
        '& .MuiTab-wrapper': {
            color: theme.palette.text.revamp
        }
    },
    blueprintBackToDesignButton: {
        marginLeft: '0rem',
        paddingLeft: 0,
        outline: 'none',
        border: 'none',
        textTransform: 'none',
        fontSize: theme.layoutSpacing(15),
        marginBottom: theme.spacing(2),
        '& svg': {
            marginRight: '1rem'
        },
        '&:focus': {
            border: 'none !important',
            outline: 'none !important'
        },
        '&:active': {
            border: 'none !important',
            outline: 'none !important'
        },
        '&:hover': {
            boxShadow: 'none',
            border: 'none !important'
        }
    },
    blueprintSaveCodeButton: {
        marginBottom: theme.spacing(2),
        textTransform: 'none'
    },
    myLineDecoration: {
        backgroundColor: theme.palette.primary.contrastText,
        width: theme.spacing(0.5) + ' !important',
        marginLeft: theme.spacing(0.5)
    },
    icons: {
        color: theme.palette.text.default,
        width: theme.layoutSpacing(24),
        height: theme.layoutSpacing(24),
        '& svg': {
            stroke: `${theme.palette.icons.closeIcon} !important`,
            '& path': {
                fill: `${theme.palette.icons.closeIcon} !important`
            }
        }
    },
    buttonContianer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.layoutSpacing(10)
    },
    blueprintToolbarRight: {
        display: 'flex',
        alignItems: 'center',
        fontSize: theme.layoutSpacing(18),
        gap: theme.layoutSpacing(16),
        '& div > svg': {
            width: theme.layoutSpacing(25),
            height: theme.layoutSpacing(25),
            cursor: 'pointer',
            fill: theme.palette.icons.closeIcon,
            margin: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(8)}`
        }
    },
    defaultIcon: {
        '& svg': {
            fill: `${theme.palette.text.default} !important`
        }
    },
    defaultIconInfo: {
        '& svg': {
            fill: `${theme.palette.text.default} !important`,
            width: `${theme.layoutSpacing(22)} !important`,
            height: `${theme.layoutSpacing(22)} !important`
        }
    },
    defaultIconZoomMap: {
        '& svg': {
            fill: `${theme.palette.text.default} !important`,
            width: `${theme.layoutSpacing(24)} !important`,
            height: `${theme.layoutSpacing(24)} !important`
        }
    },
    reset: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        color: theme.palette.icons.closeIcon
    },
    refreshIcon: {
        color: theme.palette.icons.closeIcon
    },
    saveBtn: {
        marginLeft: '2rem'
    },
    title: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(18),
        fontWeight: '500',
        letterSpacing: '0.5px'
    },
    sepratorLine: {
        border: `1px solid ${theme.IndustryDashboard.border.light}`,
        borderBottom: 'none',
        marginBottom: theme.layoutSpacing(10)
    },
    cardHeader: {
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(0)}`
    },
    card: {
        boxShadow: 'none',
        borderRadius: 0,
        marginTop: `${theme.layoutSpacing(12)} !important`,
        '& .MuiCardContent-root': {
            padding: 0,
            paddingRight: theme.layoutSpacing(24)
        },
        borderRight: `1px solid ${theme.IndustryDashboard.border.light}`
    },
    closeIcon: {
        cursor: 'pointer',
        '$ svg': {
            width: theme.layoutSpacing(14),
            height: theme.layoutSpacing(14)
        }
    },
    customLabel: {
        color: theme.palette.text.revamp,
        fontSize: theme.layoutSpacing(15),
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.layoutSpacing(0.35),
        '&.MuiInputLabel-shrink': {
            transform: `translate(${theme.layoutSpacing(12)}, ${theme.layoutSpacing(
                8
            )}) scale(0.75)`,
            fontWeight: '500',
            fontSize: theme.layoutSpacing(20)
        },
        '&.Mui-error': {
            color: theme.palette.text.error
        },
        '&.Mui-disabled': {
            color: theme.palette.text.revamp
        }
    },
    summary: {
        padding: 0,
        marginTop: theme.layoutSpacing(48)
    },
    accordionHeader: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(20),
        fontWeight: '500'
    },
    blueprintNodeDetails: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.layoutSpacing(6),
        fontSize: theme.layoutSpacing(18),
        padding: theme.layoutSpacing(8),
        cursor: 'pointer',
        color: theme.palette.text.default,
        fontWeight: '500',
        fontFamily: theme.title.h1.fontFamily
    },
    cardContianer: {
        boxShadow: 'none'
    },
    seprator: {
        height: theme.layoutSpacing(28),
        width: '1px',
        backgroundColor: theme.palette.text.default,
        marginRight: '2rem',
        marginLeft: '3rem'
    }
});

export default designStyle;
