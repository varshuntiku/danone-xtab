import { alpha } from '@material-ui/core';

export const solutionBluePrintStyles = (theme) => ({
    gridBg: {
        '--dot-bg': theme.palette.background.paper,
        '--dot-space': '20px',
        '--dot-size': '1.5px',
        '--dot-color': '#9ab6d7',
        background: `
            linear-gradient(90deg, var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
            linear-gradient(var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
            var(--dot-color)
        `
    },
    paper: {
        background: theme.palette.background.modelBackground,
        backdropFilter: 'blur(2rem)',
        borderRadius: 0,
        border: 'none',
        maxWidth: '90vw',
        minHeight: '95vh'
    },
    h4: {
        color: theme.palette.text.titleText,
        fontSize: '2rem',
        letterSpacing: '0.1em',
        fontWeight: '500'
    },
    h3: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        fontWeight: '500'
    },
    h2: {
        color: theme.palette.text.titleText,
        fontSize: '3rem',
        letterSpacing: '0.1em',
        fontWeight: '500'
    },
    title: {
        margin: 0,
        background: theme.palette.background.modelBackground,
        padding: `${theme.layoutSpacing(5)}  ${theme.layoutSpacing(7)} ${theme.layoutSpacing(
            5
        )} ${theme.layoutSpacing(30)}`,
        '& .MuiTypography-h4': {
            color: theme.palette.text.titleText,
            fontSize: '2.5rem',
            letterSpacing: '0.1em',
            fontWeight: '500'
        },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dialogContent: {
        paddingTop: '0.1rem !important',
        overflowX: 'hidden',
        overflowY: 'auto',
        '& .MuiTextField-root': {
            marginBottom: '0.5rem'
        }
    },
    closeIcon: {
        color: `${theme.palette.text.titleText} !important`,
        '& svg': {
            color: `${theme.palette.text.titleText} !important`
        }
    },
    navBarMain: {
        height: theme.layoutSpacing(40),
        padding: theme.layoutSpacing(20, 20),
        paddingTop: theme.layoutSpacing(23),
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        '& button': {
            height: theme.layoutSpacing(35)
        }
    },
    saveResetBtnContainer: {
        marginLeft: 'auto',
        display: 'flex',
        gap: theme.layoutSpacing(10)
    },
    browseBlueprintContainer: {
        height: 'calc(100% - ' + theme.spacing(5) + ')'
    },
    browseBlueprintListViewContainer: {
        transitionDuration: '300ms',
        overflowX: 'hidden',
        width: '20%',
        position: 'relative',
        overflowY: 'hidden'
    },
    sepratorline: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 5px)'
    },
    addFolderButton: {
        '& svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        },
        '& .MuiButton-outlined.Mui-disabled': {
            color: theme.palette.text.default
        }
    },
    link: {
        color: theme.palette.background.infoBgDark,
        fontSize: `${theme.layoutSpacing(18)} !important`,
        cursor: 'pointer',
        marginLeft: '2rem',
        fontWeight: 'bold'
    },
    textLink: {
        color: theme.palette.background.infoBgDark,
        fontSize: theme.layoutSpacing(16)
    },
    landingContainer: {
        width: '100%',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '& .addFolderContainer': {
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.background.infoBgDark}`,
            borderRadius: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: theme.layoutSpacing(30),
            paddingTop: theme.layoutSpacing(30)
        },
        '& .treeIconContainer': {
            background: '#d8e1ed',
            marginBottom: theme.layoutSpacing(50),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.layoutSpacing(35),
            borderRadius: theme.layoutSpacing(80)
        },
        '& .treeIcon': {
            color: '#2B70C2',
            fontSize: theme.layoutSpacing(60)
        },
        '& .MuiTypography-h3': {
            color: theme.palette.text.titleText,
            fontSize: theme.layoutSpacing(20),
            letterSpacing: '0.1em',
            textAlign: 'center',
            fontWeight: '500',
            width: '70%'
        }
    },
    browseBlueprintDrawerHandle: {
        position: 'absolute',
        top: '0rem',
        left: 0,
        transform: 'translate(-50%, 0)',
        zIndex: 1,
        border: `1px solid ${alpha(theme.palette.text.contrastText, 0.4)}`,
        boxShadow: `0px 0px 2px 1px ${alpha(theme.palette.text.black, 0.2)}`,
        backdropFilter: 'blur(10rem)'
    },
    browseBlueprintSideBarContainer: {
        padding: theme.layoutSpacing(25, 10),
        color: theme.palette.text.titleText,
        '& .MuiFormGroup-root': {
            marginLeft: '1rem'
        },
        '& .MuiTypography-h4': {
            fontWeight: '500',
            margin: '0.5rem 0'
        }
    },
    browseBlueprintSideBarLoadingContainer: {
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchField: {
        width: '95%',
        '& input': {
            padding: '1rem !important'
        },
        '& svg': {
            fill: theme.palette.text.default,
            height: theme.layoutSpacing(16),
            width: theme.layoutSpacing(16)
        },
        '& .MuiButtonBase-root': {
            paddingLeft: '1rem',
            padding: theme.layoutSpacing(8)
        },
        '& .MuiSvgIcon-root': {
            height: theme.layoutSpacing(24),
            width: theme.layoutSpacing(24)
        },
        '& .MuiInputBase-root': {
            paddingLeft: '1rem'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.border.grey
        },
        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.border.grey + ' !important',
            borderWidth: '2px'
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.default
        },
        '& .MuiInputBase-input': {
            fontSize: theme.layoutSpacing(15),
            color: theme.palette.text.default
        }
    },
    list: {
        flex: 1,
        height: '65vh',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16),
        listStyleType: 'none',
        padding: theme.layoutSpacing(1, 4),
        paddingRight: theme.layoutSpacing(25),
        margin: theme.layoutSpacing(0, -2),
        paddingTop: theme.layoutSpacing(15),
        paddingBottom: theme.layoutSpacing(15),
        position: 'relative'
    },
    expandedList: {
        height: '10vh !important'
    },
    listItem: {
        width: '100%',
        padding: theme.layoutSpacing(16),
        cursor: 'pointer',
        minHeight: theme.layoutSpacing(56),
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0px 1px 4px 0px #00000040',
        borderRadius: theme.layoutSpacing(4),
        justifyContent: 'space-between',
        '& .not_verified': {
            color: 'red'
        },
        '& .verified': {
            color: 'green'
        },
        '&:hover': {
            background: alpha(theme.palette.background.navLinkBackground, 0.4)
        },
        '& .MuiTypography-root': {
            fontSize: theme.layoutSpacing(22),
            fontFamily: theme.title.h1.fontFamily,
            color: theme.palette.text.default
        }
    },
    selectedListItem: {
        background: theme.palette.background.navLinkBackground
    },
    browseBlueprintTreeViewContainer: {
        paddingTop: `${theme.layoutSpacing(5)} !important`,
        paddingLeft: theme.layoutSpacing(20),
        paddingRight: theme.layoutSpacing(20),
        height: '83vh !important',
        borderLeft: '1px solid ' + theme.palette.separator.grey,
        position: 'relative'
    },
    treeViewContainer: {
        display: 'flex',
        minHeight: '69vh',
        maxHeight: '70vh',
        overflowY: 'scroll',
        padding: theme.layoutSpacing(10),
        '& .treeView': {
            flex: 2,
            overflow: 'scroll'
        },
        '& .preview': {
            flex: 2,
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            color: theme.palette.text.default,
            '& .previewContent': {
                maxWidth: '40vw',
                overflowX: 'scroll',
                '& section': {
                    height: '60vh !important',
                    overflow: 'hidden'
                },
                '@media (max-width: 900px)': {
                    maxWidth: '20vw'
                }
            },
            '& table': {
                fontSize: theme.layoutSpacing(12)
            },
            '& .loading': {
                width: '100%',
                height: '50vh',
                fontSize: theme.layoutSpacing(20),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }
        }
    },
    browseBpVisualGraphContainer: {
        display: 'flex',
        height: '85vh',
        padding: theme.layoutSpacing(10),
        '& .visualGraph': {
            width: '100%',
            overflow: 'scroll'
        },
        '& .preview': {
            width: '35vw',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            color: theme.palette.text.default,
            '& .previewContent': {
                maxWidth: '40vw',
                overflowX: 'scroll',
                '& section': {
                    height: '60vh !important',
                    overflow: 'hidden'
                },
                '@media (max-width: 900px)': {
                    maxWidth: '20vw'
                }
            },
            '& table': {
                fontSize: theme.layoutSpacing(12)
            },
            '& .loading': {
                width: '100%',
                height: '50vh',
                fontSize: theme.layoutSpacing(20),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }
        }
    },
    treeViewRoot: {
        flexGrow: 1,
        maxWidth: 400,
        '& .MuiTypography-h3': {
            display: 'flex',
            alignItems: 'center',
            gap: theme.layoutSpacing(5)
        },
        '& .MuiTreeItem-label': {
            color: theme.palette.text.titleText,
            margin: theme.layoutSpacing(4, 0)
        },
        '& .MuiSvgIcon-root': {
            fontSize: theme.layoutSpacing(20)
        }
    },
    browseBluePrintTreeViewFooterContainer: {
        height: theme.layoutSpacing(30),
        position: 'absolute',
        bottom: theme.layoutSpacing(5),
        borderTop: `1px solid ${theme.palette.border.loginGrid}`,
        paddingTop: theme.layoutSpacing(20),
        width: '100%',
        '& button': {
            height: theme.layoutSpacing(30),
            marginRight: theme.layoutSpacing(10)
        }
    },
    browseBluePrintTreeViewTopBar: {
        paddingLeft: theme.layoutSpacing(20),
        width: '100%',
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
        marginBottom: theme.layoutSpacing(10)
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
    react_flow_container: {
        height: '84vh',
        width: '100%'
        // position: 'relative'
    },
    browseBlueprintReactFlowContainer: {
        height: '80vh',
        width: '100%'
    },
    addNodeButton: {
        position: 'absolute',
        left: '1rem',
        top: '1rem'
    },
    loaderTextContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        '& .MuiTypography-h4': {
            fontSize: theme.layoutSpacing(19),
            width: theme.layoutSpacing(300),
            fontWeight: 'bold',
            textAlign: 'center',
            color: theme.palette.text.titleText
        },
        '& .treeIcon': {
            color: '#2B70C2',
            fontSize: theme.layoutSpacing(60),
            marginBottom: theme.layoutSpacing(60)
        }
    },
    imageIcon: {
        width: theme.layoutSpacing(20),
        height: theme.layoutSpacing(20)
    },
    textContent: {
        fontWeight: '300',
        textAlign: 'center',
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(20),
        marginTop: theme.spacing(2.5),
        marginBottom: theme.spacing(0.75)
    },
    addFolderMain: {
        display: 'flex'
        // position : 'relative'
    },
    folderDetailsContainer: {
        // width : theme.layoutSpacing(300),
        width: '25%',
        borderLeft: '1px solid ' + theme.palette.separator.grey,
        '& .MuiTypography-h4': {
            color: theme.palette.text.titleText,
            fontSize: '2rem',
            letterSpacing: '0.1em',
            fontWeight: '500'
        },
        '& .topBar': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: theme.layoutSpacing(20)
        },
        '& .closeIcon': {
            fontSize: '1rem !important',
            color: `${theme.palette.text.default} !important`,
            '& svg': {
                color: `${theme.palette.text.default} !important`
            }
        },
        '& .detailsContainer': {
            padding: theme.layoutSpacing(10, 30)
        },
        '& .deleteBtnContiner': {
            display: 'flex',
            justifyContent: 'end',
            paddingRight: theme.layoutSpacing(20),
            paddingTop: theme.layoutSpacing(5),
            '& button': {
                padding: '0px !important'
            }
        },
        '& .saveBtnContiner': {
            display: 'flex',
            justifyContent: 'end',
            paddingRight: theme.layoutSpacing(30)
        }
    },
    deleteTxt: {
        color: theme.palette.text.titleText,
        fontSize: '1.4rem',
        letterSpacing: '0.1em'
    },
    customNodeContainer: {
        padding: theme.layoutSpacing(10),
        color: theme.palette.text.titleText,
        width: '200px',
        height: '200px',
        overflowY: 'scroll',
        overflowX: 'scroll'
    },
    addCustomNodeContainer: {
        padding: theme.layoutSpacing(10),
        color: theme.palette.text.titleText,
        width: '50px',
        height: '50px',
        overflowY: 'scroll',
        overflowX: 'scroll'
    },
    customNodeTitle: {
        textAlign: 'center'
    },
    sbReactFlow: {
        '& .react-flow__handle': {
            width: '10px',
            height: '10px',
            minWidth: '7px',
            minHeight: '7px',
            background: '#2B70C2'
        },
        '& .selectable': {
            border: `1px solid #2B70C2`,
            borderRadius: '5px'
        },
        '& .selected': {
            border: '1.6px solid #2B70C2 !important'
        }
    },
    browseBpReactFlow: {
        '& .react-flow__handle': {
            width: '10px',
            height: '10px',
            minWidth: '7px',
            minHeight: '7px',
            background: '#2B70C2'
        },
        '& .selectable': {
            border: `1px solid #2B70C2`,
            borderRadius: '5px'
        },
        '& .selected': {
            border: '1.6px solid #2B70C2 !important'
        }
    },
    root: {
        borderRadius: 2,
        minWidth: '195px',
        background: theme.palette.background.paper,
        height: '100%'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        })
    },
    // expandIcon : {
    //     color : 'red'
    // },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    pointer: {
        cursor: 'pointer'
    },
    nodeHeaderContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        padding: theme.spacing(2, 2, 2, 1.5),
        height: '10rem',
        zIndex: 1,
        paddingBottom: theme.spacing(1),
        '& .MuiIconButton-root': {
            padding: theme.spacing(0.5, 1, 0.5, 1),

            '& svg': {
                fontSize: '3.5rem',
                color: '#2B70C2'
            }
        },
        '& .MuiIconButton-root:hover': {
            background: 'none'
        }
    },
    collapseContainer: {
        padding: theme.spacing(2, 2, 0.5, 1.5),
        height: '100%'
    },
    nodeHeader: {
        display: 'flex'
    },
    deleteIcon: {
        position: 'absolute',
        right: '0px',
        top: '0px'
    },
    reactFlowMainContainer: {
        display: 'flex',
        '& .react-flow__node-DynamicCustomNodeComponent': {
            height: 'auto !important'
        },
        '& .download-mode': {
            '& .selectable': {
                borderBottom: '2px solid #2B70C2 !important'
            }
        }
    },
    previewLabel: {
        fontSize: theme.layoutSpacing(14),
        fontWeight: '500',
        textAlign: 'center'
    },
    progressBarContainer: {
        width: '60rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '10vh',
        position: 'absolute',
        top: '40%',
        left: '35%'
    },
    fontSize1: {
        fontSize: '2rem',
        marginBottom: '1%',
        color: theme.palette.text.default
    },
    progressBar: {
        borderRadius: '4px',
        '& .MuiLinearProgress-bar': {
            boxShadow: '0px 0px 1px 0px black inset',
            backgroundColor: theme.props?.mode === 'dark' ? '#FFB547' : '#6883F7'
        }
    },
    navigationLink: {
        display: 'flex',
        height: '100%',
        top: 0,
        left: theme.spacing(4),
        color: theme.palette.text.revamp,
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(18),
        textDecoration: 'none',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: theme.layoutSpacing(36),
        alignItems: 'center',
        // marginRight : theme.layoutSpacing(65),
        '& svg': {
            color: theme.palette.text.revamp,
            fontSize: theme.spacing(2.5),
            marginRight: '1rem',
            marginBottom: '0.2rem'
        }
    },
    backTitle: {
        marginBottom: '0.3rem'
    },
    title1: {
        marginLeft: 'auto',
        marginRight: 'auto',
        color: theme.palette.text.revamp,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(24),
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 'normal',
        letterSpacing: '1px',
        marginBottom: '0.3rem'
    },
    exportBtnMenu: {
        zIndex: 2 + '!important'
    },
    dropdownItem: {
        fontSize: '15px',
        color: theme.palette.text.revamp,
        '&:hover': {
            borderColor: theme.palette.text.sidebarSelected
        }
    },
    arrowDropDownIcon: {
        color: theme.palette.text.btnTextColor
    },
    exportBtnGrp: {
        '& .MuiButton-label': {
            textTransform: 'none !important'
        }
    },
    browseBpReactFlowContainer: {
        paddingTop: `${theme.layoutSpacing(5)} !important`,
        height: '77.5vh !important',
        borderLeft: '1px solid ' + theme.palette.separator.grey,
        position: 'relative'
    },
    browseBpFilePreviewContainer: {
        transitionDuration: '300ms',
        overflowX: 'hidden',
        position: 'relative',
        overflowY: 'hidden'
    },
    hideScreenContainer: {
        width: '0 !important',
        opacity: 0
    }
});
