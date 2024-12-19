import { alpha } from '@material-ui/core';

const appScreenAdminStyle = (theme) => ({
    body: {
        height: 'calc(100% - ' + theme.spacing(6) + ')',
        position: 'relative'
    },
    noTitleBody: {
        height: '100%',
        position: 'relative'
    },
    gridContainer: {
        padding: theme.spacing(1, 2, 0, 2),
        height: 'calc(100vh - 19rem)',
        overflow: 'auto',
        position: 'relative'
    },

    layoutContent: {
        width: '100%',
        height: '100%',
        padding: theme.spacing(2),
        borderRadius: theme.spacing(1),
        position: 'relative'
    },
    radio: {
        color: theme.palette.text.default
    },
    radioChecked: {
        color: theme.palette.primary.contrastText
    },
    filterAccordionContainer: {
        width: '100%'
    },
    previewFilterPaper: {
        height: theme.spacing(120),
        background: theme.palette.background.paper
    },
    previewFilterHeading: {
        background: theme.palette.background.pureWhite,
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8,
        fontFamily: theme.body.B5.fontFamily
    },
    previewFilterActionIcon: {
        position: 'absolute',
        top: '4px',
        right: 0
    },
    previewFilterContainer: {
        height: '100%',
        width: '100%',
        position: 'relative'
    },
    previewGraphContainer: {
        height: theme.spacing(100),
        width: '100%',
        position: 'relative'
    },
    colorContrast: {
        color: theme.palette.primary.contrastText
    },
    colorDefault: {
        color: theme.palette.text.default
    },
    letterSpacing1: {
        letterSpacing: '0.02em'
    },
    fontSize1: {
        fontSize: '1.6rem'
    },
    fontSize2: {
        fontSize: '1.4rem'
    },
    fontSize3: {
        fontSize: '1.2rem'
    },
    pale: {
        fontWeight: 100
    },
    iconContainer: {
        '& svg': {
            fontSize: '3rem',
            color: theme.palette.primary.main
        },
        '& .MuiStepIcon-text': {
            fontSize: '10px',
            fill: theme.palette.text.default
        },
        '& .MuiStepIcon-active': {
            color: theme.palette.primary.contrastText,
            '& .MuiStepIcon-text': {
                fill: theme.palette.primary.dark
            },

            '&:host': {
                position: 'absolute',
                content: '""',
                top: 0,
                left: 0,
                transform: 'scale(1.01)',
                background: 'red'
            }
        },
        '& .MuiStepIcon-completed': {
            color: theme.palette.primary.contrastText
        }
    },
    clickable: {
        cursor: 'pointer'
    },
    darkStroke: {
        stroke: theme.palette.primary.dark
    },
    tick: {
        color: theme.palette.primary.dark
    },
    widgetLayoutConfigFormControl: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        margin: theme.spacing(0, 1),
        float: 'right',
        width: theme.spacing(25)
    },
    widgetLayoutConfigFormControlOrientation: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        margin: theme.spacing(0, 1),
        float: 'right',
        width: theme.spacing(25)
    },
    widgetConfigLabel: {
        padding: theme.spacing(1),
        color: theme.palette.text.revamp,
        fontSize: theme.layoutSpacing(22),
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.layoutSpacing(0.35)
    },
    widgetConfigRoot: {
        '& .MuiFormLabel-root.Mui-focused': {
            color: theme.palette.text.revamp
        },
        '& .MuiFormLabel-root.Mui-disabled': {
            color: alpha(theme.palette.text.default, 0.7)
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.border.inputOnFoucs
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: theme.palette.border.grey
        },
        '& .MuiFilledInput-underline.Mui-focused:after': {
            borderBottomColor: theme.palette.border.inputOnFoucs
        },
        '& .MuiInput-underline.Mui-focused:not(.Mui-disabled):after': {
            borderBottomColor: theme.palette.border.inputOnFoucs,
            borderWidth: '1px'
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: theme.palette.text.revamp,
            borderWidth: '1px'
        },
        '&.Mui-disabled:before': {
            borderBottom: `1px solid ${alpha(theme.palette.text.revamp, 0.4)}`
        },
        '&.Mui-error:after': {
            borderBottomColor: theme.palette.text.error,
            borderWidth: '1px'
        },
        '& svg': {
            color: theme.palette.text.default
        },
        padding: theme.spacing(1),
        backgroundColor: theme.palette.primary.dark,
        borderRadius: theme.spacing(0.5),
        color: theme.palette.text.default,
        // marginBottom: theme.spacing(2),
        '& .MuiFormHelperText-root': {
            color: theme.palette.text.default,
            fontSize: '1.25rem',
            fontStyle: 'italic'
        }
    },
    widgetConfigInput: {
        paddingTop: '0.2rem',
        fontSize: theme.layoutSpacing(15),
        fontFamily: theme.body.B5.fontFamily,
        color: theme.palette.text.revamp,
        letterSpacing: theme.layoutSpacing(0.5),
        lineHeight: 'normal',
        '&.Mui-disabled': {
            color: alpha(theme.palette.text.revamp, 0.6)
        }
    },
    screenLayoutLabel: {
        color: theme.palette.text.default
    },
    iconButtonProgress: {
        position: 'absolute',
        top: '25%',
        right: '50%',
        color: theme.palette.primary.contrastText
    },
    screenBreadcrumbContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing(1, 2),
        paddingTop: 0,
        paddingLeft: theme.spacing(3)
    },
    screenTabDivider: {
        float: 'left',
        margin: theme.spacing(0, 4),
        fontSize: '1.75rem',
        color: theme.palette.text.default
    },
    dialogActions: {
        '& .MuiButton-outlined': {
            color: theme.palette.border.buttonOutline + '!important',
            borderColor: theme.palette.border.buttonOutline + '!important'
        },
        '& .MuiButton-contained': {
            backgroundColor: theme.palette.border.buttonOutline
        }
    },
    screenBodyLoader: {
        position: 'absolute',
        height: 'calc(100vh - 16rem)',
        width: '100%',
        backgroundColor: theme.palette.text.light,
        zIndex: '999',
        borderRadius: theme.spacing(0.5)
    },
    overviewContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: theme.spacing(3)
    },
    screenImageContianer: {
        marginTop: '4rem'
    },
    screenImageItem: {
        width: '15rem',
        height: '15rem',
        background: theme.palette.primary.light,
        opacity: 0.7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.text.default,
        textTransform: 'uppercase',
        padding: '2rem 1rem',
        flexDirection: 'column',
        boxShadow: 'none',
        cursor: 'pointer',
        transitionDuration: '300ms',
        position: 'relative',
        gap: '1rem',
        '&:hover': {
            opacity: 1
        },
        '&[disabled]': {
            pointerEvents: 'none',
            opacity: 0.7,
            borderStyle: 'dashed',
            borderWidth: '2px'
        }
    },
    nextBtn: {
        '&:hover': {
            backgroundColor: 'transparent'
        },
        '& svg': {
            width: '3.5rem',
            height: '3.5rem'
        }
    },
    prevBtn: {
        '&:hover': {
            backgroundColor: 'transparent'
        },
        '& svg': {
            width: '3.5rem',
            height: '3.5rem'
        }
    },
    selectedScreenImageItem: {
        border: `3px solid ${theme.palette.primary.contrastText}`,
        color: theme.palette.text.contrastText,
        opacity: 1,
        '& $screenImage': {
            fill: theme.palette.primary.contrastText
        }
    },
    screenImage: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        fill: theme.palette.text.default
    },
    wizardContainer: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        border: `2px solid ${theme.palette.primary.dark}`,
        borderRight: 0,
        borderLeft: 0,
        overflow: 'hidden'
    },
    wizardItem: {
        border: `0.4rem solid ${theme.palette.primary.dark}`,
        padding: '0rem 2rem 0rem 4.2rem',
        position: 'relative',
        background:
            theme.props.mode === 'light'
                ? theme.palette.background.greyishBlue
                : theme.palette.primary.light,
        height: '5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
            '& $screenTabHeader': {
                opacity: 0.5
            }
        },
        '&::after': {
            top: '50%',
            right: '-0.4rem',
            content: '""',
            position: 'absolute',
            transform: 'translate(100%, -50%)',
            borderWidth: '2.5rem',
            borderColor: `transparent transparent transparent ${theme.palette.primary.dark}`,
            borderStyle: 'solid',
            zIndex: 1,
            pointerEvents: 'none'
        },
        '&::before': {
            top: '50%',
            right: 0,
            content: '""',
            zIndex: 2,
            position: 'absolute',
            transform: 'translate(100%, -50%)',
            borderWidth: '2.1rem',
            borderColor: `transparent transparent transparent ${
                theme.props.mode === 'light'
                    ? theme.palette.border.greyishBlue
                    : theme.palette.primary.light
            }`,
            borderStyle: 'solid',
            pointerEvents: 'none'
        },
        '&:disabled': {
            opacity: 0.5
        }
    },
    selectedWizardItem: {
        '&$wizardItem': {
            background: theme.palette.background.wizardBackground,

            '&::before': {
                borderLeft: `2.4rem solid ${theme.palette.background.wizardBackground}`
            },
            '& $screenTabHeader': {
                color: theme.palette.primary.contrastText,
                opacity: 1,
                fontFamily: theme.title.h1.fontFamily,
                fontWeight: '500'
            }
        }
    },
    screenTabHeader: {
        float: 'left',
        cursor: 'pointer',
        fontSize: '1.75rem',
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: '400'
    },
    previewBtn: {
        cursor: 'pointer',
        fontSize: '1.5rem',
        color: theme.palette.text.contrastText,
        fontWeight: 600,
        textDecoration: 'underline',
        '&:hover': {
            opacity: 0.75
        }
    },
    unsavedIndicator: {
        position: 'absolute',
        right: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        color: theme.palette.text.unsavedText
    },
    dialogContent: {
        maxHeight: '44vh',
        overflow: 'auto'
    },
    errorHeading: {
        fontSize: '1.75rem',
        fontWeight: 'bold'
    },
    errorWidgetInsight: {
        border: theme.spacing(0.5) + ' solid ' + theme.palette.error.main,
        borderLeft: theme.spacing(2) + ' solid ' + theme.palette.error.main,
        color: theme.palette.text.default,
        fontSize: '2rem',
        borderRadius: '5px',
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    warningWidgetInsight: {
        border: theme.spacing(0.5) + ' solid ' + theme.palette.warning.main,
        borderLeft: theme.spacing(2) + ' solid ' + theme.palette.warning.main,
        color: theme.palette.text.default,
        fontSize: '2rem',
        borderRadius: '5px 0 0 5px',
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
        '& div > div': {
            color: theme.palette.warning.main
        }
    },
    overviewContent: {
        flex: 1,
        paddingLeft: '1rem',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '2rem'
    },
    dialogTitle: {
        background: theme.palette.background.pureWhite,
        padding: theme.layoutSpacing(20)
    },
    dialogTitleCustomLayout: {
        background: theme.palette.background.pureWhite,
        padding: theme.layoutSpacing(20),
        borderBottom: `1px solid ${theme.palette.text.default}29`,
        paddingBottom: '1rem',
        marginBottom: '1rem'
    },
    fieldsWrapper: {
        display: 'flex',
        flexDirection: 'column'
    },
    overviewForm: {
        border: `1px solid ${alpha(theme.palette.text.revamp, 0.1)}`,
        padding: theme.layoutSpacing(20),
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        justifyItems: 'center',
        '& .MuiGrid-item': {
            padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(8)}`
        }
    },
    overviewFormFields: {
        paddingRight: `${theme.layoutSpacing(24)}!important`
    },
    uploadContianer: {
        marginBottom: theme.layoutSpacing(20.1)
    },
    drawerExitAdminButtonIcon: {
        marginRight: theme.spacing(1)
    },
    drawerExitAdminButton: {
        margin: theme.spacing(1, 2),
        float: 'left',
        padding: theme.spacing(0.5, 2.5),
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.background.plainBtnBg,
            color: theme.palette.icons.closeIcon,
            opacity: 1,
            '& svg': {
                color: `${theme.palette.icons.closeIcon} !important`
            }
        },
        '&:focus': {
            '&:after': {
                border: `0.5px solid ${theme.palette.background.plainBtnBg} !important`
            },
            backgroundColor: theme.palette.background.plainBtnBg
        }
    },
    modalDailogContent: {
        padding: `${theme.layoutSpacing(40)} ${theme.layoutSpacing(44)} !important`,
        minWidth: theme.layoutSpacing(500)
    },
    modalDialogTitle: {
        backgroundColor: theme.palette.background.pureWhite,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: 'normal',
        fontSize: theme.layoutSpacing(22),
        letterSpacing: theme.layoutSpacing(1),
        color: theme.palette.text.titleText,
        padding: theme.layoutSpacing(16),
        minWidth: theme.layoutSpacing(500),
        display: 'flex',
        alignItems: 'center'
    },
    closeIcon: {
        marginLeft: '3rem',
        position: 'absolute',
        padding: 0,
        top: 18,
        right: 10,
        '& svg': {
            color: theme.palette.text.default
        }
    },
    sepratorLine: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 32px)'
    },
    uploadIcon: {
        marginTop: '2rem'
    },
    subSectionsTabs: {
        minHeight: 'auto',
        '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.dark,
            height: '100%',
            zIndex: -1,
            borderRadius: theme.spacing(1, 1, 0, 0)
        },
        '& .MuiTab-root': {
            borderRadius: theme.spacing(1, 1, 0, 0),
            minHeight: '4.8rem',
            padding: theme.spacing(1, 2)
        },
        '& .Mui-selected': {
            color: `${theme.palette.primary.contrastText} !important`
        }
    },
    customLayoutInfo: {
        fontSize: theme.title.h2.fontSize,
        width: '100%',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: theme.title.h1.fontFamily
    },
    layoutPopUpHeading: {
        background: theme.palette.background.pureWhite,
        color: theme.palette.text.default,
        fontSize: '2.5rem',
        letterSpacing: theme.title.h1.letterSpacing,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h1.fontWeight
    },
    noLayoutContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '3rem',
        marginTop: '10rem',
        height: '40vh'
    },
    noLayoutImage: {
        height: '4rem',
        width: '4rem'
    },
    subSectionsTabsLayout: {
        minHeight: '2.8rem !Important',
        display: 'flex',
        gap: '2rem',
        borderBottom: `1px solid ${theme.palette.text.default}30`,
        '& .MuiTabs-flexContainer': {
            gap: '2rem'
        },
        '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.dark,
            height: '100%',
            zIndex: -1,
            borderRadius: theme.spacing(1, 1, 0, 0)
        },
        '& .MuiTab-root': {
            borderRadius: theme.spacing(1, 1, 0, 0),
            padding: theme.spacing(0.5, 1)
        },
        '& .Mui-selected': {
            color: `${theme.palette.primary.contrastText} !important`,
            borderBottom: `2px solid ${theme.palette.primary.contrastText}`
        }
    },
    layoutTab: {
        minHeight: '2rem !important',
        fontSize: '1.5rem !Important'
    },
    closeIconStyle: {
        cursor: 'pointer',
        height: '2.5rem',
        width: '2.5rem',
        fill: theme.palette.icons.closeIcon,
        '&:hover': {
            opacity: '0.75'
        }
    }
});

export default appScreenAdminStyle;
