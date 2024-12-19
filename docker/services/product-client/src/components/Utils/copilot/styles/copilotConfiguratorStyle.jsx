import { alpha, makeStyles } from '@material-ui/core';

const copilotConfiguratorStyle = makeStyles((theme) => ({
    typography: {
        color: theme.palette.text.revamp,
        '&.MuiTypography-h2': {
            fontFamily: theme.title.h1.fontFamily,
            fontSize: theme.layoutSpacing(56),
            fontWeight: 500,
            lineHeight: theme.layoutSpacing(72.5),
            letterSpacing: theme.layoutSpacing(1)
        },
        '&.MuiTypography-h3': {
            fontFamily: theme.title.h1.fontFamily,
            fontSize: theme.layoutSpacing(32),
            fontWeight: 500,
            lineHeight: theme.layoutSpacing(26),
            letterSpacing: theme.layoutSpacing(1)
        },
        '&.MuiTypography-h4': {
            fontSize: theme.layoutSpacing(20),
            fontWeight: 400,
            lineHeight: theme.layoutSpacing(30)
        },
        '&.MuiTypography-h5': {
            fontSize: theme.layoutSpacing(15.6),
            fontWeight: 400,
            lineHeight: theme.layoutSpacing(15.6)
        },
        '&.MuiTypography-h6': {
            fontSize: theme.layoutSpacing(13.5),
            fontWeight: 400,
            lineHeight: theme.layoutSpacing(15.6)
        },
        '&.MuiTypography-subtitle1': {
            fontSize: theme.layoutSpacing(16),
            fontWeight: 500,
            lineHeight: theme.layoutSpacing(19.2)
        },
        '&.MuiTypography-subtitle2': {
            fontSize: theme.layoutSpacing(13),
            fontWeight: 400,
            lineHeight: theme.layoutSpacing(15.6)
        }
    },

    formControl: {
        '& .MuiFormLabel-root': {
            color: alpha(theme.palette.text.default, 0.7),
            fontSize: theme.layoutSpacing(14.52)
        },
        '& .MuiOutlinedInput-notchedOutline legend': {
            fontSize: '1em'
        },
        '& .MuiOutlinedInput-root input, .MuiOutlinedInput-input': {
            fontWeight: 400,
            fontSize: theme.layoutSpacing(15),
            color: theme.palette.text.default,
            lineHeight: theme.layoutSpacing(18),

            '&::-webkit-input-placeholder': {
                letterSpacing: theme.layoutSpacing(0.5)
            }
        },
        '& .MuiOutlinedInput-root .MuiSelect-icon': {
            color: theme.palette.text.contrastText,
            top: 'inherit'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.default, 0.2)
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.default, 0.4)
        },
        '& .MuiOutlinedInput-root:focus-within .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.default, 0.7),
            borderWidth: '1px'
        },
        '& .MuiInputLabel-root.Mui-disabled': {
            opacity: '0.7'
        },
        '& .MuiOutlinedInput-root.Mui-disabled': {
            opacity: '0.7',
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.text.default, 0.2)
            }
        },
        '& .MuiOutlinedInput-multiline': {
            // padd
        },
        '& .MuiOutlinedInput-root': {
            borderRadius: theme.layoutSpacing(2)
        }
    },

    inputLabel: {
        fontSize: theme.layoutSpacing(14),
        color: theme.palette.text.revamp,
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(16.8),
        marginBottom: theme.layoutSpacing(8),

        '& sup': {
            fontSize: theme.layoutSpacing(14),
            fontWeight: 500,
            lineHeight: theme.layoutSpacing(19),
            letterSpacing: theme.layoutSpacing(0.34),
            color: theme.palette.text.error
        }
    },

    inputDropdownSelect: {
        '& .MuiListItem-button': {
            color: theme.palette.text.contrastText,

            '& .MuiCheckbox-root .MuiSvgIcon-root': {
                width: theme.layoutSpacing(16),
                height: theme.layoutSpacing(16)
            }
        },
        '& .MuiListItem-button:hover': {
            backgroundColor: theme.palette.background.menuItemHover
        },
        '& .MuiListItem-root.Mui-selected': {
            backgroundColor: alpha(theme.palette.background.menuItemFocus, 0.6)
        }
    },

    title1: {
        fontSize: theme.layoutSpacing(18),
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(21.6),
        color: theme.palette.text.revamp
    },

    title2: {
        fontSize: theme.layoutSpacing(15.6),
        color: theme.palette.text.revamp,
        fontWeight: 500,
        letterSpacing: theme.layoutSpacing(0.52),
        marginBottom: theme.layoutSpacing(5.2)
    },

    helperLabel: {
        fontSize: theme.layoutSpacing(13),
        fontWeight: 400,
        lineHeight: theme.layoutSpacing(15.6),
        color: theme.palette.text.revamp
    },

    label1: {
        color: theme.palette.text.contrastText,
        fontWeight: 500,
        fontSize: theme.layoutSpacing(16.6),
        lineHeight: theme.layoutSpacing(24.9),
        letterSpacing: theme.layoutSpacing(0.52)
    },

    linkActionButton: {
        color: theme.palette.text.revamp,
        fontWeight: 500,
        fontSize: theme.layoutSpacing(16.6),
        letterSpacing: theme.layoutSpacing(0.52),
        lineHeight: theme.layoutSpacing(19.91),
        textDecoration: 'underline'
    },

    formControlLabel: {
        '& .MuiFormControlLabel-label': {
            fontWeight: 400,
            fontSize: theme.layoutSpacing(16),
            lineHeight: theme.layoutSpacing(19.2),
            letterSpacing: theme.layoutSpacing(0.5)
        },
        '& .MuiIconButton-label svg': {
            color: theme.palette.text.contrastText,
            width: theme.layoutSpacing(24),
            height: theme.layoutSpacing(24)
        },
        '& .MuiIconButton-root.Mui-disabled .MuiIconButton-label svg': {
            color: theme.palette.action.disabledBackground
        },
        '& .MuiFormControlLabel-label.Mui-disabled': {
            color: theme.palette.action.disabledBackground
        }
    },

    fontOpacity80: {
        opacity: '80%'
    },

    fontOpacity60: {
        opacity: '60%'
    },

    toolTagsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.layoutSpacing(10.37),
        margin: theme.layoutSpacing(4.15, 0)
    },

    toolTag: {
        background: theme.palette.background.chipRevampBg,
        padding: theme.layoutSpacing(2.1, 8.3),
        borderRadius: theme.layoutSpacing(4),
        display: 'inline',
        fontSize: theme.layoutSpacing(14),
        fontWeight: '400',
        lineHeight: theme.layoutSpacing(24),
        color: theme.palette.text.revamp
    },

    border: {
        border: '1px solid transparent',
        position: 'relative',

        '&::before': {
            content: "''",
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: '100%',
            width: 'calc(100% - 1rem)',
            borderTop: `1px solid #BF99BD`,
            borderBottom: `1px solid #BF99BD`,
            pointerEvents: 'none'
        },

        '&::after': {
            content: "''",
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            margin: 'auto',
            height: 'calc(100% - 1rem)',
            width: '100%',
            borderLeft: `1px solid #BF99BD`,
            borderRight: `1px solid #BF99BD`,
            pointerEvents: 'none'
        }
    },

    fontStyle1: {
        fontSize: theme.layoutSpacing(16),
        lineHeight: theme.layoutSpacing(24),
        fontWeight: 500
    },

    fontStyle2: {
        fontSize: theme.layoutSpacing(18),
        lineHeight: theme.layoutSpacing(36),
        letterSpacing: theme.layoutSpacing(0.5),
        fontWeight: 500
    },

    fontStyle3: {
        fontFamily: 'Graphik',
        fontSize: theme.layoutSpacing(18),
        lineHeight: theme.layoutSpacing(28),
        // letterSpacing: theme.layoutSpacing(1),
        fontWeight: 400
    },

    fontStyle4: {
        fontFamily: 'Graphik Compact',
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(26),
        letterSpacing: theme.layoutSpacing(1),
        textAlign: 'left'
    },

    tooltip: {
        fontSize: theme.layoutSpacing(13),
        margin: theme.layoutSpacing(8, 0),
        background: alpha(theme.palette.background.tooltipBg, 0.8),
        color: theme.palette.text.white,
        fontWeight: 400,

        '& .MuiTooltip-arrow': {
            color: alpha(theme.palette.background.tooltipBg, 0.8)
        }
    },

    listItemText: {
        fontSize: theme.layoutSpacing(16),
        fontWeight: 400,
        lineHeight: theme.layoutSpacing(20),
        textAlign: 'left',
        color: theme.palette.text.revamp
    },

    tabs: {
        minHeight: theme.layoutSpacing(48),
        '& .MuiTabs-scroller': {
            marginTop: theme.layoutSpacing(16),

            '& .MuiTabs-flexContainer': {
                borderBottom: '1px solid ' + alpha(theme.palette.border.loginGrid, 0.16),
                width: 'max-content',

                '& .MuiTab-root': {
                    fontWeight: 400,
                    fontSize: theme.layoutSpacing(18),
                    lineHeight: theme.layoutSpacing(21.6),
                    borderRadius: theme.layoutSpacing(0.5),
                    textTransform: 'capitalize',
                    minHeight: theme.layoutSpacing(48),
                    padding: theme.layoutSpacing(6, 12),
                    maxWidth: 'fit-content',

                    '&.Mui-selected': {
                        fontWeight: 500,
                        color: theme.palette.text.contrastText + '!important'
                    }
                }
            },
            '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.text.contrastText
            }
        }
    },

    tabPanel: {
        padding: theme.layoutSpacing(28, 4),
        maxHeight: `calc(100% - ${theme.layoutSpacing(72)})`,
        overflow: 'auto',
        '& > ul > li': {
            borderRadius: theme.layoutSpacing(6),
            border: '1px solid',
            borderColor: alpha(theme.palette.border.loginGrid, 0.4),
            padding: theme.layoutSpacing(0, 12)
        }
    },

    deleteButton: {
        '& .MuiIconButton-label svg': {
            color: theme.palette.icons.grey
        }
    },

    confirmDialog: {
        background: theme.palette.background.modelBackground,
        '& .MuiDialogTitle-root': {
            fontFamily: theme.title.h1.fontFamily,
            fontSize: theme.layoutSpacing(22),
            fontWeight: 400,
            lineHeight: theme.layoutSpacing(29),
            letterSpacing: theme.layoutSpacing(1),
            background: theme.palette.background.modelBackground,

            '& .MuiButtonBase-root .MuiIconButton-label': {
                fill: theme.palette.text.contrastText
            }
        },
        '& .MuiDialogContent-root': {
            padding: theme.layoutSpacing(32, 20),
            fontFamily: 'Graphik',
            fontSize: theme.layoutSpacing(15),
            fontWeight: 400,
            lineHeight: theme.layoutSpacing(18),
            letterSpacing: theme.layoutSpacing(0.35),

            '& br': {
                display: 'none'
            }
        },
        '& .MuiDialogActions-root': {
            paddingTop: 0,
            paddingBottom: theme.layoutSpacing(28),
            paddingLeft: theme.layoutSpacing(20),
            paddingRight: theme.layoutSpacing(20)
        }
    },

    button: {
        '&.MuiButton-root': {
            borderRadius: theme.layoutSpacing(2)
        },

        '& .MuiButton-label': {
            fontFamily: 'Graphik',
            fontSize: theme.layoutSpacing(16),
            // fontWeight: 500,
            letterSpacing: theme.layoutSpacing(0.5)
        },
        '&.MuiButton-text': {
            backgroundColor: 'transparent !important'
        }
    },

    chips: {
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: theme.layoutSpacing(10.368),
        '& .MuiChip-root:not(:last-child)': {
            marginRight: theme.layoutSpacing(12)
        },
        '& .MuiChip-root': {
            backgroundColor: theme.palette.background.chipRevampBg,
            height: theme.layoutSpacing(32),

            '& .MuiChip-label': {
                fontSize: theme.layoutSpacing(14),
                fontWeight: 400,
                lineHeight: theme.layoutSpacing(24),
                color: theme.palette.text.revamp
            }
        }
    },

    label2: {
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(20),
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(24),
        letterSpacing: theme.layoutSpacing(1),
        color: theme.palette.text.revamp
    },

    addButton: {
        '& .MuiIconButton-root': {
            backgroundColor: theme.palette.text.contrastText,
            opacity: 1,
            '& svg': {
                transform: 'rotate(45deg)',
                fill: theme.palette.text.btnTextColor
            }
        }
    },
    selectMenuPaper: {
        // transform: `translateY(${theme.layoutSpacing(64)}) !important`,
        marginTop: 'auto'
    },
    model: {
        display: 'flex',
        flexDirection: 'row',
        gap: '0.6rem'
    },
    addIconBtn: {
        border: '1px solid ' + alpha(theme.palette.text.default, 0.2),
        padding: theme.spacing(0.7),
        borderRadius: 0,
        marginRight: 0,
        width: theme.layoutSpacing(45),
        '& svg': {
            fontSize: 'x-large',
            stroke: alpha(theme.palette.primary.contrastText, 0.5)
        },
        '&.Mui-disabled': {
            opacity: 0.7
        }
    },
    iconTooltip: {
        fontSize: '1.6rem',
        padding: '0.4rem 1rem',
        position: 'relative',
        top: '-2rem',
        left: '0.5rem',
        backgroundColor: theme.palette.primary.contrastText,
        '@media(max-width:1500px)': {
            top: '-3rem'
        }
    },
    iconTooltipSmall: {
        fontSize: theme.layoutSpacing(10),
        top: theme.layoutSpacing(-10)
    },
    arrow: {
        '&:before': {
            backgroundColor: theme.palette.primary.contrastText
        }
    }
}));

export default copilotConfiguratorStyle;
