const appScreenStyle = (theme) => ({
    body: {
        height: 'calc(100% - 5rem)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        '@media (max-width:1600px)': {
            height: 'calc(100% - 7rem)'
        },
        '@media (max-width:1350px)': {
            height: 'calc(100% - 8rem)'
        }
    },
    bodyStepperComponent: {
        height: 'calc(100% - 1rem)'
    },
    noTitleBody: {
        height: 'calc(100% - 2.75rem)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
    },
    gridContainer: {
        margin: `0 ${theme.layoutSpacing(8)}`,
        height: '91%',
        flexGrow: 1,
        position: 'relative',
        background: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        borderTop: `1px solid ${theme.palette.separator.grey}`
    },
    gridBody: {
        height: '100%',
        position: 'relative'
    },
    gridLabelContainer: {
        position: 'relative',
        height: '15%'
    },
    gridLabelBody: {
        height: '100%',
        width: 'auto',
        position: 'relative',
        margin: 0,
        padding: 0,
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        '& .MuiGrid-item > div': {
            borderRight: `1px solid ${theme.palette.separator.grey}`,
            padding: `0 ${theme.layoutSpacing(16)} ${theme.layoutSpacing(4)}`
        },
        '& .MuiGrid-item:last-child > div': {
            borderRight: 'none',
            paddingRight: theme.layoutSpacing(16)
        },
        '& .MuiGrid-item:first-child > div': {
            paddingLeft: theme.layoutSpacing(16)
        },
        '& .MuiGrid-item': {
            height: '100%',
            padding: `${theme.layoutSpacing(15)} 0`
        }
    },
    gridGraphContainer: {
        height: '85%',
        position: 'relative'
    },
    gridGraphNoLabelContainer: {
        paddingBottom: 0,
        height: '100%',
        position: 'relative'
    },
    gridGraphNoLabelProgressContainer:{
        paddingBottom: 0,
        height: '85%',
        position: 'relative'
    },
    gridContainerWithBottomBorder: {
        borderBottom: `1px solid ${theme.palette.separator.grey}`
    },
    gridGraphBody: {
        height: '100%',
        position: 'relative',
        '& div': {
            boxShadow: 'none'
        },
        padding: '2rem 0',
        [theme.breakpoints.down(theme.breakpoints.values.desktop_sm)]: {
            padding: '1.5rem 0'
        }
    },
    gridGraphFullContainer: {
        height: '100%',
        position: 'relative'
    },
    gridGraphHalfContainer: {
        height: '49%',
        position: 'relative'
    },
    iconButtonProgress: {
        position: 'absolute',
        top: '40%',
        right: '50%',
        color: theme.palette.primary.contrastText
    },
    widgetContent: {
        width: '100%',
        height: '100%',
        position: 'relative',
        boxShadow: 'none',
        borderRadius: 0
    },
    ratingButton: {
        position: 'sticky',
        float: 'right',
        zIndex: '99'
    },
    actionElement: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing(1, 2, 0, 2),
        gap: '0.5rem',
        alignItems: 'center',
        '&:empty': {
            display: 'none'
        }
    },
    stepperButtons: {
        position: 'fixed',
        bottom: 16,
        right: 36,
        zIndex: 10
    },
    stepperContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        zIndex: 10,
        background: theme.palette.background.pureWhite
    },
    stepperActionButton: {
        marginRight: '2rem',
        width: '14rem',
        padding: `${theme.layoutSpacing(6)} ${theme.layoutSpacing(16)} !important`
    },
    disabledBtn: {
        color: `${theme.palette.primary.contrastTextLight} !important`
    },
    gridItemStyle: {
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        '&:last-child': {
            borderRight: 'none'
        }
    },
    gridCustomItemStyle: {
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        '&:last-child': {
            borderRight: 'none'
        },
        '&.MuiGrid-item': {
            padding: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(24)} ${theme.layoutSpacing(
                12
            )}`
        },
        '&.MuiGrid-item:first-child': {
            paddingLeft: theme.layoutSpacing(16)
        },
        '&.MuiGrid-item:last-child': {
            paddingRight: theme.layoutSpacing(16)
        }
    },
    gridVerticalItemStyle: {
        '&.MuiGrid-item': {
            padding: `0 ${theme.layoutSpacing(16)}`
        },
        '& > div': {
            borderBottom: `1px solid ${theme.palette.separator.grey}`,
            borderRadius: 0,
            padding: `${theme.layoutSpacing(20)} ${theme.layoutSpacing(8)}`
        },
        '&:last-child > div': {
            borderBottom: 'none'
        },
        height: 'var(--itemHeight)'
    },
    gridParentItemStyle: {
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        '&:last-child': {
            borderBottom: 'none'
        },
        '&.MuiGrid-item': {
            padding: `${theme.layoutSpacing(16)} 0`,
            '&:last-child': {
                paddingBottom: `${theme.layoutSpacing(8)}`
            }
        },
        '&:last-child > div > div': {
            paddingBottom: `${theme.layoutSpacing(12)}`
        },
        height: 'var(--itemHeight,49%)'
    },
    gridChildContainer: {
        padding: 0,
        margin: 0
    },
    gridVerticalChildContainer: {
        padding: 0,
        margin: 0,
        width: 'auto'
    },
    gridChildItem: {
        '&.MuiGrid-item': {
            padding: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(24)}`,
            '&:first-child': {
                paddingLeft: theme.layoutSpacing(16)
            },
            '&:last-child': {
                paddingRight: theme.layoutSpacing(16)
            }
        }
    },
    gridVerticalParentItemStyle: {
        '&.MuiGrid-item': {
            padding: 0
        },
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        '&:last-child': {
            borderRight: 'none',
            '& > div > div': {
                paddingRight: 0,
                '& > div': {
                    paddingRight: theme.layoutSpacing(16)
                }
            }
        },
        '&:first-child > div > .MuiGrid-item': {
            paddingLeft: 0,
            '& > div': {
                paddingLeft: theme.layoutSpacing(16)
            }
        },
        '& > div > .MuiGrid-item:first-child > div': {
            paddingTop: `${theme.layoutSpacing(4)}`
        }
    },
    gridItemCustomOneStyle: {
        borderRight: 'none',
        '&.MuiGrid-item': {
            padding: `0 0 ${theme.layoutSpacing(16)}`
        },
        '& > div': {
            borderRadius: 0,
            borderRight: `1px solid ${theme.palette.separator.grey}`,
            padding: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(24)} ${theme.layoutSpacing(
                4
            )}`
        },
        '&:first-child > div': {
            padding: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(24)} ${theme.layoutSpacing(
                4
            )} ${theme.layoutSpacing(16)}`
        },
        '&:nth-child(3n) > div': {
            borderRight: 'none',
            padding: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(16)} ${theme.layoutSpacing(
                4
            )} ${theme.layoutSpacing(24)}`
        },
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        '&:last-child': {
            borderBottom: 'none',
            '&.MuiGrid-item': {
                paddingTop: theme.layoutSpacing(16),
                paddingBottom: 0,
                '& > div': {
                    paddingBottom: theme.layoutSpacing(12)
                }
            }
        },
        '&:nth-last-child(2)': {
            borderBottom: 'none',
            '&.MuiGrid-item': {
                paddingTop: theme.layoutSpacing(16),
                paddingBottom: 0,
                '& > div': {
                    paddingBottom: theme.layoutSpacing(12)
                }
            }
        },
        '&:nth-last-child(3)': {
            borderBottom: 'none',
            '&.MuiGrid-item': {
                paddingTop: theme.layoutSpacing(16),
                paddingBottom: 0,
                '& > div': {
                    paddingBottom: theme.layoutSpacing(12)
                }
            }
        },
        '&.MuiGrid-item:nth-last-child(3n) > div': {
            paddingLeft: theme.layoutSpacing(16)
        }
    },
    gridItemCustomTwoStyle: {
        border: 'none',
        '&.MuiGrid-item': {
            padding: 0
        },
        '& > div': {
            borderRadius: 0,
            borderRight: `1px solid ${theme.palette.separator.grey}`,
            padding: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(24)} ${theme.layoutSpacing(
                4
            )} ${theme.layoutSpacing(16)}`
        },
        '&:nth-child(2n) > div': {
            borderRight: 'none',
            padding: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(16)} ${theme.layoutSpacing(
                4
            )} ${theme.layoutSpacing(24)}`
        },
        '&:first-child': {
            borderBottom: `1px solid ${theme.palette.separator.grey}`
        },
        '&:nth-child(2)': {
            borderBottom: `1px solid ${theme.palette.separator.grey}`
        },
        '&.MuiGrid-item:first-child': {
            paddingBottom: theme.layoutSpacing(16)
        },
        '&.MuiGrid-item:nth-child(2)': {
            paddingBottom: theme.layoutSpacing(16)
        },
        '&.MuiGrid-item:nth-last-child(2)': {
            paddingTop: theme.layoutSpacing(16),
            '& > div': {
                paddingBottom: `${theme.layoutSpacing(12)}`
            }
        },
        '&.MuiGrid-item:last-child': {
            paddingTop: theme.layoutSpacing(16),
            '& > div': {
                paddingBottom: `${theme.layoutSpacing(12)}`
            }
        }
    },
    gridItemsWrapper: {
        padding: `${theme.layoutSpacing(16)} 0 ${theme.layoutSpacing(8)}`,
        margin: 0,
        width: 'auto'
    },
    gridParentContainer: {
        padding: 0,
        margin: 0,
        gap: 0,
        width: 'auto'
    },
    gridVerticalParentContainer: {
        gap: 0,
        margin: 0,
        padding: `${theme.layoutSpacing(16)} 0 ${theme.layoutSpacing(8)}`,
        width: 'auto'
    },
    gridContainerLoading: {
        margin: `0 ${theme.layoutSpacing(8)}`,
        height: '92%',
        flexGrow: 1,
        position: 'relative',
        background: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        borderTop: `none`
    },
    videoCloseBtn: {
        marginBottom: theme.layoutSpacing(18)
    },
    bottomStepperActionButton: {
        display: 'flex',
        width: '100%',
        justifyContent: 'end',
        backgroundColor: theme.palette.background.pureWhite,
        right: 0,
        bottom: 0,
        marginTop: theme.layoutSpacing(16),
        padding: '0 5rem !important'
    },
    progressBarWrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modifyProgressBarWrapper: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 100
    }
});

export default appScreenStyle;
