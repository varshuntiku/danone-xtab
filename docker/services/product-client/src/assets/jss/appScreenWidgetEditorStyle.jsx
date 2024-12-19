import { alpha } from '@material-ui/core';
// import { green, grey } from '@material-ui/core/colors';

const appScreenWidgetEditorStyle = (theme) => ({
    widgetEditorPaper: {
        background: theme.palette.primary.main,
        height: '100%'
    },
    screenWidgetTabHeader: {
        float: 'left',
        cursor: 'pointer',
        fontSize: '1.75rem',
        color: theme.palette.text.default,
        '&:hover': {
            opacity: '0.5'
        }
    },
    screenWidgetTabHeaderSelected: {
        float: 'left',
        fontSize: '1.75rem',
        color: theme.palette.primary.contrastText
    },
    screenWidgetTabDivider: {
        float: 'left',
        margin: theme.spacing(0, 4),
        fontSize: '1.75rem',
        color: theme.palette.text.default
    },
    widgetEditorActionIcon: {
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
        height: theme.spacing(75),
        width: '100%',
        position: 'relative'
    },
    widgetConfigFormControl2: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        height: theme.layoutSpacing(56),
        marginTop: theme.layoutSpacing(16),
        '& .MuiFormHelperText-root': {
            fontSize: theme.layoutSpacing(13),
            color: theme.palette.text.error
        },
        '& .MuiFilledInput-underline.Mui-focused:after': {
            borderBottomColor: theme.palette.background.infoBgDark,
            borderWidth: '1px'
        },
        '& .MuiFilledInput-underline.Mui-focused svg': {
            color: theme.palette.background.infoBgDark
        },
        '& .MuiFilledInput-root': {
            height: theme.layoutSpacing(56),
            '& input': {
                fontSize: theme.layoutSpacing(15),
                fontFamily: theme.body.B5.fontFamily,
                color: theme.palette.text.revamp,
                padding: `${theme.layoutSpacing(25)} ${theme.layoutSpacing(
                    12
                )} ${theme.layoutSpacing(8)}`,
                letterSpacing: theme.layoutSpacing(0.5)
            },
            '&.Mui-disabled': {
                background: theme.palette.background.tableSelcted,
                '&:hover': {
                    background: theme.palette.background.tableSelcted
                },
                '&:before': {
                    borderBottom: `1px solid ${alpha(theme.palette.text.revamp, 0.4)}`
                }
            },
            '&:before': {
                borderBottomColor: theme.palette.border.grey
            },
            background: `${theme.palette.background.tableSelcted}!important`,
            '&:hover': {
                background: theme.palette.background.tableSelcted,
                '&:before': {
                    borderBottomColor: theme.palette.border.inputOnFoucs
                }
            },
            '&:focus': {
                background: theme.palette.background.tableSelcted,
                '&:after': {
                    borderBottomColor: theme.palette.border.inputOnFoucs
                }
            },
            '&.Mui-error:after': {
                borderBottomColor: theme.palette.text.error,
                borderWidth: '1px'
            },
            '&.Mui-error': {
                background: theme.palette.background.tableSelcted
            }
        }
    },
    widgetConfigLabel2: {
        zIndex: 1,
        '&.MuiInputLabel-shrink': {
            transform: `translate(${theme.layoutSpacing(12)}, ${theme.layoutSpacing(
                4
            )}) scale(1)!important`,
            transformOrigin: 'top left',
            fontSize: theme.layoutSpacing(13),
            fontWeight: '500'
        },
        color: theme.palette.text.revamp,
        fontSize: theme.layoutSpacing(15),
        fontFamily: theme.body.B1.fontFamily,
        letterSpacing: 0,
        lineHeight: 'normal',
        '&.MuiInputLabel-filled.Mui-error': {
            color: theme.palette.text.error
        },
        '&.MuiInputLabel-filled.Mui-disabled': {
            color: alpha(theme.palette.text.revamp, 0.6)
        },
        '&.MuiInputLabel-filled.Mui-focused': {
            color: theme.palette.background.infoBgDark
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
    widgetConfigRoot: {
        '& .MuiFormLabel-root.Mui-disabled': {
            color: alpha(theme.palette.text.default, 0.7)
        },
        '& label.Mui-focused': {
            color: theme.palette.text.default
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: `${alpha(theme.palette.text.default, 0.7)} !important`
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.text.default
        },
        '& .MuiInput:after': {
            borderBottomColor: 'transparent'
        },
        '& svg': {
            color: theme.palette.text.default
        },
        height: theme.layoutSpacing(56),
        '& .MuiFormHelperText-root': {
            fontSize: theme.layoutSpacing(13),
            color: theme.palette.text.error
        },
        '& .MuiFilledInput-underline.Mui-focused:after': {
            borderBottomColor: theme.palette.background.infoBgDark,
            borderWidth: '1px'
        },
        '& .MuiFilledInput-underline.Mui-focused svg': {
            color: theme.palette.background.infoBgDark
        },
        '& .MuiFilledInput-root': {
            height: theme.layoutSpacing(56),
            '& input': {
                fontSize: theme.layoutSpacing(15),
                fontFamily: theme.body.B5.fontFamily,
                color: theme.palette.text.revamp,
                padding: `${theme.layoutSpacing(25)} ${theme.layoutSpacing(
                    12
                )} ${theme.layoutSpacing(8)}`,
                letterSpacing: theme.layoutSpacing(0.5)
            },
            '&.Mui-disabled': {
                background: theme.palette.background.tableSelcted,
                '&:hover': {
                    background: theme.palette.background.tableSelcted
                },
                '&:before': {
                    borderBottom: `1px solid ${alpha(theme.palette.text.revamp, 0.4)}`
                }
            },
            '&:before': {
                borderBottomColor: theme.palette.border.grey
            },
            background: `${theme.palette.background.tableSelcted}!important`,
            '&:hover': {
                background: theme.palette.background.tableSelcted,
                '&:before': {
                    borderBottomColor: theme.palette.text.revamp
                }
            },
            '&:focus': {
                background: theme.palette.background.tableSelcted,
                '&:after': {
                    borderBottomColor: theme.palette.border.inputOnFoucs
                }
            },
            '&.Mui-error:after': {
                borderBottomColor: theme.palette.text.error,
                borderWidth: '1px'
            },
            '&.Mui-error': {
                background: theme.palette.background.tableSelcted
            }
        }
    },
    widgetConfigInput: {
        padding: `${theme.layoutSpacing(25)} ${theme.layoutSpacing(12)} ${theme.layoutSpacing(8)}`,
        '&.Mui-disabled': {
            color: alpha(theme.palette.text.revamp, 0.6)
        },
        '& h5': {
            fontSize: theme.layoutSpacing(15),
            fontFamily: theme.body.B5.fontFamily,
            color: theme.palette.text.revamp,
            letterSpacing: theme.layoutSpacing(0.5)
        }
    },
    widgetConfigCheckbox: {
        cursor: 'pointer'
    },
    youtQuestionToolbar: {
        marginTop: '1rem',
        display: 'flex',
        gap: '1rem'
    },
    editWidgetConfigButton: {
        padding: theme.spacing(0, 0.5),
        minWidth: theme.spacing(2),
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
    iconButtonProgress: {
        position: 'absolute',
        top: '25%',
        right: '50%',
        color: theme.palette.primary.contrastText
    },
    renderOverviewFormRoot: {
        background: theme.palette.primary.dark,
        padding: theme.spacing(8, 5),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '@media (min-width:1500px)': {
            padding: '3.4rem 4rem'
        },
        '@media (min-width:1300px)': {
            padding: '0rem 4rem'
        }
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
    linkKpiStyle: {
        alignItems: 'center',
        verticalAlign: 'center',
        marginTop: '4rem'
    },
    iconPositionWrapper: {
        '&.MuiGrid-item': {
            paddingLeft: theme.layoutSpacing(24)
        }
    },
    /*PowerBI Configuration styles */
    powerBIConfigBody: {
        padding: theme.spacing(2),
        height: theme.spacing(80),
        position: 'relative'
    },
    powerBIConfigFormWrapper: {
        '&.MuiGrid-item': {
            paddingRight: theme.layoutSpacing(24),
            paddingTop: theme.spacing(2)
        }
    },
    checkBox: {
        padding: '0.5rem',
        width: '2rem',
        height: '2rem'
    },
    loader: {
        padding: '0.5rem',
        width: '2rem',
        height: '2rem',
        color: theme.palette.text.contrastText,
        stroke: theme.palette.text.contrastText
    },
    commentSelector: {
        marginTop: '2rem',
        fontSize: '1.6rem',
        fontWeight: '500',
        display: 'inline-flex',
        alignItems: 'center',
        color: theme.palette.text.default,
        '& svg': {
            stroke: theme.palette.text.contrastText
        }
    },
    tableauFormWrapper: {
        '&.MuiGrid-item': {
            paddingRight: theme.layoutSpacing(24),
            paddingTop: theme.spacing(2)
        }
    },
    saveBtnContainer: {
        display: 'flex',
        padding: '1rem',
        justifyContent: 'right',
        alignItems: 'flex-start',
        gap: '1px',
        '& button': {
            minWidth: 'max-content'
        },
        marginRight:'32px'
    },
});

export default appScreenWidgetEditorStyle;
