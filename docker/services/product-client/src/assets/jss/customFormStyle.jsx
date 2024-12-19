import { alpha } from '@material-ui/core';

const customFormStyle = (theme) => ({
    customFormSectionHeader: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(14),
        fontWeight: '500',
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.layoutSpacing(0.35),
        marginBottom: theme.layoutSpacing(4)
    },
    uploadHeaderStyle: {
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(14),
        lineHeight: 'normal',
        letterSpacing: 0
    },
    AdminOverviewFormHeader: {
        marginBottom: theme.layoutSpacing(16),
        fontWeight: 400,
        fontFamily: theme.body.B1.fontFamily,
        letterSpacing: 0
    },
    customFormSectionHeaderRight: {
        float: 'right',
        color: theme.palette.primary.contrastText,
        marginRight: theme.spacing(1),
        cursor: 'pointer',
        '&:hover': {
            opacity: '0.5'
        }
    },
    createNewButton: {
        float: 'right',
        margin: theme.spacing(2, 2),
        '& svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        },
        '& .MuiButton-outlined.Mui-disabled': {
            color: theme.palette.text.default
        }
    },
    uploadLogoContainer: {
        width: theme.spacing(25),
        height: theme.spacing(25),
        position: 'relative',
        backgroundColor: theme.palette.primary.light,
        border: '2px dashed ' + theme.palette.text.default,
        '&:hover': {
            opacity: '0.75'
        }
    },
    uploadLogoLabel: {
        color: theme.palette.text.default,
        position: 'absolute',
        bottom: theme.spacing(5),
        width: '100%',
        textAlign: 'center',
        fontSize: '1.5rem'
    },
    modulesContainer: {
        padding: theme.spacing(2),
        '& > div': {
            rowGap: theme.layoutSpacing(23)
        }
    },
    moduleItem: {
        float: 'left',
        backgroundColor: theme.palette.primary.light,
        width: theme.spacing(30),
        height: theme.spacing(30),
        borderRadius: theme.spacing(0.5),
        margin: theme.spacing(2),
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
            opacity: '0.7'
        },
        textAlign: 'center',
        padding: theme.spacing(4, 0)
    },
    appModuleItem: {
        float: 'left',
        // backgroundColor: theme.palette.primary.dark,
        width: theme.spacing(30),
        height: theme.spacing(37.5),
        borderRadius: theme.spacing(0.5),
        margin: theme.spacing(2),
        position: 'relative',
        '&:hover': {
            opacity: '0.7'
        },
        textAlign: 'center'
        // padding: theme.spacing(4, 3.75)
    },
    moduleItemLogo: {
        color: theme.palette.text.default,
        margin: theme.spacing(3, 0, 0, 0)
    },
    moduleHeader: {
        border: '1 px solid red',
        height: '30rem',
        padding: '3rem 2rem 1rem 2rem'
    },
    moduleContent: {
        height: theme.spacing(21)
    },
    moduleDescription: {
        // margin: theme.spacing(0, 0, 0, 3)
    },
    moduleFooter: {
        height: theme.spacing(5),
        position: 'relative'
    },
    moduleItemTitle: {
        color: theme.palette.text.default,
        margin: theme.spacing(2, 0)
    },
    moduleItemDesc: {
        color: theme.palette.text.default,
        margin: theme.spacing(1, 0)
    },
    moduleItemEnabledContainer: {
        color: theme.palette.text.default,
        backgroundColor: theme.palette.success.main,
        position: 'absolute',
        width: '20rem',
        padding: theme.spacing(1, 0),
        align: 'center',
        bottom: 0,
        fontSize: '1.5rem'
    },
    moduleItemEnabledIcon: {
        position: 'absolute',
        left: theme.spacing(7)
        // top: theme.spacing(2)
    },
    actionToolbar: {
        margin: theme.spacing(2),
        marginTop: theme.layoutSpacing(3),
        marginLeft: theme.layoutSpacing(0),
        alignSelf: 'start'
    },
    actionBackButton: {
        float: 'left',
        color: theme.palette.text.default,
        textTransform: 'none',
        paddingLeft: '0',
        paddingRight: '0'
    },
    actionNextButton: {
        float: 'right',
        textTransform: 'none',
        height: theme.layoutSpacing(36),
        '& span': {
            textTransform: 'capitalize',
            fontFamily: theme.body.B1.fontFamily,
            fontSize: theme.layoutSpacing(16),
            fontWeight: 500,
            letterSpacing: theme.layoutSpacing(0.5)
        }
    },
    resetActionNextButton: {
        textTransform: 'none',
        border: 'none',
        height: theme.layoutSpacing(36),
        '& span': {
            fontWeight: 500,
            lineHeight: 'normal',
            letterSpacing: theme.layoutSpacing(0.5),
            fontSize: theme.layoutSpacing(16)
        },
        '&:hover': {
            backgroundColor: theme.palette.background.plainBtnBg,
            color: theme.palette.icons.closeIcon,
            border: 'none !important',
            boxShadow: 'none !important',
            opacity: 1,
            '& svg': {
                color: theme.palette.text.peachText
            }
        },
        '&:active': {
            color: theme.palette.text.revamp,
            backgroundColor: theme.palette.background.plainBtnBg,
            border: 'none !important',
            boxShadow: 'none !important',
            opacity: 1,
            '& svg': {
                color: theme.palette.text.peachText
            }
        },
        '&:focus': {
            outline: 'none',
            '&:after': {
                border: `0.5px solid ${theme.palette.background.plainBtnBg} !important`
            },
            color: theme.palette.text.revamo,
            backgroundColor: theme.palette.background.plainBtnBg
        },
        '&:disabled': {
            border: 'none !important'
        }
    },
    customNextButtonStyle: {
        width: theme.layoutSpacing(141)
    },
    buttonsContainer: {
        '& .MuiGrid-item': {
            padding: theme.layoutSpacing(10)
        }
    },
    screenConfigIconContainer: {
        paddingTop: '30px',
        margin: '0 0 14px 0',
        cursor: 'pointer'
    },
    screenConfigIcon: {
        position: 'relative',
        top: '-' + theme.spacing(1.5),
        cursor: 'pointer',
        color: theme.palette.text.default
    },
    screenConfigDeleteIcon: {
        position: 'relative',
        top: '-' + theme.spacing(1.5),
        cursor: 'pointer'
    },
    screenHierarchyItem: {},
    screenHierarchyItemSecond: {
        // paddingLeft: "16px"
    },
    screenHierarchyItemThird: {
        // paddingLeft: "32px"
    },
    screenConfigIdLabel: {
        paddingTop: '20px'
    },
    checkboxContainer: {
        padding: theme.spacing(1.5),
        fontSize: theme.spacing(2.5),
        color: theme.palette.text.titleText
    },
    checkbox: {
        transform: 'scale(2)'
    },
    adminTableSectionHeader: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.text.default,
        padding: theme.spacing(1, 0, 1, 4),
        marginBottom: theme.spacing(2)
    },
    adminFormSectionHeader: {
        color: theme.palette.text.default,
        padding: theme.spacing(1, 0)
    },
    adminFormSectionTabBody: {},
    adminFormSectionCodeEditor: {
        width: '100%',
        height: theme.spacing(50)
    },
    adminFormSectionFileUpload: {
        marginTop: theme.spacing(1)
    },
    sectionEditorHeading: {
        color: theme.palette.text.titleText,
        fontSize: '2rem',
        letterSpacing: '0.1em',
        opacity: 0.8,
        marginBottom: theme.spacing(1)
    },
    sectionEditorSubHeading: {
        color: theme.palette.text.titleText,
        fontSize: '1.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8,
        marginBottom: theme.spacing(1)
    },
    filterContainer: {
        marginLeft: '1rem',
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    filterSubContainer: {
        marginLeft: 'auto'
    },
    // added later, can be moved to other styles file
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
    subSectionTabBody: {
        minHeight: theme.spacing(70),
        padding: theme.spacing(2),
        position: 'relative'
    },
    inputCheckbox: {
        paddingLeft: theme.spacing(1),
        '& .MuiFormControlLabel-label': {
            color: theme.palette.text.revamp,
            fontSize: theme.layoutSpacing(15),
            fontFamily: theme.body.B1.fontFamily,
            letterSpacing: theme.layoutSpacing(0.35),
            marginLeft: theme.layoutSpacing(-8),
            '&.Mui-disabled': {
                color: alpha(theme.palette.text.default, 0.7)
            }
        },
        '& svg': {
            width: '2rem',
            height: '2rem'
        },
        '&[readOnly]': {
            pointerEvents: 'none'
        },
        '&.Mui-disabled': {
            '& svg': {
                opacity: 0.7
            }
        }
    },
    customInputCheckbox: {
        marginTop: theme.layoutSpacing(24)
    },
    codeTemplateItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    previewBtnContainer: {
        display: 'flex',
        width: '100%',
        marginBottom: '2rem'
    },
    viewDocs: {
        fontSize: '1.2rem',
        flexBasis: '8em',
        color: theme.palette.primary.contrastText,
        cursor: 'pointer'
    },
    f1: {
        fontSize: '1.5rem'
    },
    defaultColor: {
        color: theme.palette.text.default
    },
    widgetConfigFormControl: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    widgetConfigSelect: {
        backgroundColor: theme.palette.primary.dark,
        borderRadius: theme.spacing(0.5),
        '& .MuiInput-underline': {
            '&:after': {
                borderColor: theme.palette.border.grey,
                borderWidth: '1px'
            },
            '&:before': {
                borderColor: theme.palette.border.grey,
                borderWidth: '1px'
            },
            '&:hover:not(.Mui-disabled):before': {
                borderBottomColor: theme.palette.border.grey
            }
        },
        '& .MuiFilledInput-root': {
            background: `${theme.palette.background.tableSelcted}!important`,
            height: theme.layoutSpacing(56),
            marginTop: 0,
            '&:before': {
                borderBottomColor: theme.palette.border.grey
            },
            '&:hover': {
                background: theme.palette.background.tableSelcted,
                '&:before': {
                    borderBottomColor: theme.palette.border.grey
                }
            },
            '&:focus': {
                background: theme.palette.background.tableSelcted,
                '&:after': {
                    borderBottomColor: theme.palette.border.inputOnFoucs
                }
            },
            '& .MuiSelect-select': {
                padding: `${theme.layoutSpacing(25)} ${theme.layoutSpacing(
                    12
                )} ${theme.layoutSpacing(8)}`,
                '&:focus': {
                    background: theme.palette.background.tableSelcted
                }
            }
        },
        height: theme.layoutSpacing(56),
        '& .MuiFilledInput-underline.Mui-focused:after': {
            borderBottomColor: theme.palette.border.inputOnFoucs,
            borderWidth: '1px'
        },
        '& .MuiFilledInput-underline.Mui-focused svg': {},
        '& svg': {
            width: theme.layoutSpacing(24),
            height: theme.layoutSpacing(24)
        }
    },
    input: {
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.body.B5.fontFamily,
        color: theme.palette.text.revamp,
        padding: `${theme.layoutSpacing(25)} ${theme.layoutSpacing(12)} ${theme.layoutSpacing(8)}`,
        letterSpacing: theme.layoutSpacing(0.5)
    },
    menu: {
        '& .MuiMenu-paper': {
            borderRadius: '2px'
        },
        '& ul': {
            padding: 0
        },
        '& li': {
            minHeight: theme.layoutSpacing(40),
            padding: `${theme.layoutSpacing(10)} ${theme.layoutSpacing(16)}`,
            margin: 0,
            fontSize: theme.layoutSpacing(15),
            color: theme.palette.text.revamp,
            letterSpacing: theme.layoutSpacing(0.5),
            '&:hover': {
                background: theme.palette.background.menuItemHover
            }
        },
        '& * .Mui-selected': {
            backgroundColor: alpha(theme.palette.background.menuItemFocus, 0.6)
        },
        ...theme.overrides.MuiCssBaseline
    },
    widgetConfigCheckboxLabel: {
        color: theme.palette.text.revamp,
        fontSize: theme.layoutSpacing(15),
        fontFamily: theme.body.B1.fontFamily,
        zIndex: 1,
        paddingLeft: theme.layoutSpacing(12),
        transform: `translate(0, ${theme.layoutSpacing(18)})`,
        letterSpacing: 0,
        lineHeight: 'normal',
        '&.MuiInputLabel-shrink': {
            transform: `translate(${theme.layoutSpacing(12)}, ${theme.layoutSpacing(4)}) scale(1)`,
            paddingLeft: 0,
            fontSize: theme.layoutSpacing(13),
            fontWeight: '500'
        },
        '&.Mui-error': {
            color: theme.palette.text.error
        },
        '&.Mui-disabled': {
            color: alpha(theme.palette.text.revamp, 0.6)
        },
        '&.Mui-focused': {
            color: theme.palette.background.infoBgDark
        }
    },
    widgetConfigIcon: {
        color: theme.palette.text.default
    },
    layoutQuestionToolbar: {
        display: 'flex',
        gap: '1rem',
        marginTop: '3rem'
    },
    editorSectionLong: {
        height: `calc(100vh - 46rem)`
    },
    editorSectionShort: {
        height: `calc(100vh - 50.8rem)`
    },
    editorSectionSmall: {
        height: `calc(100vh - 70.8rem)`
    },
    outputSection: {
        height: '11rem',
        marginBottom: 0
    },
    cloneApplication: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80%',
        gap: '2.4rem',
        position: 'relative',
        boxShadow: 'none',
        border: `1px solid ${alpha(theme.palette.text.revamp, 0.1)}`,
        margin: `${theme.layoutSpacing(24)} 0 ${theme.layoutSpacing(38)}`,
        borderRadius: 0
    },
    infoIcon: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        '& svg': {
            color: 'unset !important',
            fill: `unset !important`,
            stroke: `unset !important`
        }
    },
    overflowXHidden: {
        overflowX: 'hidden',
        background: theme.palette.background.pureWhite,
        maxWidth: theme.layoutSpacing(854),
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(44)}`
    },
    resDialog: {
        '& .MuiDialog-container .MuiDialog-paper': {
            '& .MuiDialogTitle-root': {
                padding: '1rem 2rem'
            }
        }
    },
    resDialogContent: {
        padding: '3rem 2rem 2rem 2rem',
        width: '80rem',
        '& .MuiTypography-h5': {
            marginTop: '1rem',
            color: theme.palette.text.default
        },
        '&.MuiDialogContent-dividers': {
            borderBottomColor: theme.palette.border.colorWithOpacity
        },
        overflow: 'hidden'
    },
    addResponsibility: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        '& .MuiButton-root': {
            marginLeft: '1rem'
        }
    },
    moduleItem: {
        marginRight: theme.layoutSpacing(50),
        minHeight: '35rem'
    },
    availableResponsibility: {
        padding: '1rem',
        '& .MuiChip-outlined': {
            fontSize: '1.5rem',
            margin: '0.5rem',
            border: '1px solid ' + theme.palette.primary.contrastText,
            '& .MuiChip-deleteIcon': {
                color: theme.palette.text.titleText,
                opacity: '60%'
            }
        },
        overflowY: 'scroll',
        maxHeight: '60rem'
    },
    importantNote: {
        marginTop: '2rem',
        fontSize: '1.5rem',
        color: '#ff9800'
    },
    moduleActionBtns: {
        paddingTop: theme.layoutSpacing(48)
    },
    dialogTitle: {
        backgroundColor: theme.palette.background.pureWhite,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: 'normal',
        fontSize: theme.layoutSpacing(22),
        letterSpacing: theme.layoutSpacing(1),
        color: theme.palette.text.titleText
    },
    dialogPaper: {
        background: theme.palette.background.pureWhite,
        maxWidth: theme.layoutSpacing(854),
        borderRadius: 0
    },
    dailogContent: {
        paddingLeft: theme.layoutSpacing(44),
        paddingRight: theme.layoutSpacing(44),
        paddingTop: theme.layoutSpacing(40)
    },
    dialogAction: {
        paddingBottom: theme.layoutSpacing(28),
        paddingTop: theme.layoutSpacing(48),
        paddingRight: theme.layoutSpacing(44)
    },
    sepratorLine: {
        width: 'calc(100% - 32px)',
        marginTop: 0,
        marginBottom: 0
    },
    moduleSectionHeader: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(14),
        fontWeight: '500',
        fontFamily: theme.body.B1.fontFamily,
        letterSpacing: theme.layoutSpacing(0.35),
        marginBottom: theme.layoutSpacing(4),
        paddingLeft: '1.6rem',
        paddingTop: '1rem'
    },
    iconColor: {
        fill: theme.palette.text.secondaryText
    },
    drawerContainer: {
        '& .MuiDialog-paperScrollPaper': {
            maxHeight: 'unset',
            height: 'calc(48% - 1rem)',
            borderRadius: 0
        }
    },
    functionDialogStyle: {
        overflowY: 'hidden'
    }
});

export default customFormStyle;
