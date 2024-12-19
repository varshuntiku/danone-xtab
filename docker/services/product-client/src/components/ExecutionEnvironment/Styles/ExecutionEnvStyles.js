import { withStyles, makeStyles } from '@material-ui/core/styles';
import { TableRow, TableCell, alpha } from '@material-ui/core';

export const StyledTableRow = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.dark
    }
}))(TableRow);
export const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.background.tableHeader,
        color: theme.palette.text.titleText,
        fontSize: theme.layoutSpacing(16),
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        fontFamily: theme.title.h1.fontFamily,
        height: theme.spacing(7.5),
        border: 'none',
        padding: theme.spacing(0.5, 2)
    },
    body: {
        fontSize: theme.layoutSpacing(14),
        border: 'none',
        color: theme.palette.text.titleText,
        fontFamily: theme.body.B5.fontFamily,
        padding: theme.spacing(2, 2)
    }
}))(TableCell);

export const dialogStyle = makeStyles((theme) => ({
    dialogRoot: {
        margin: 0,
        padding: '1rem 1rem 1rem 3.1rem',
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        },
        background: theme.palette.background.dialogTitle,
        display: 'flex',
        justifyContent: 'space-between'
    },
    dialogTitle: {
        fontSize: '2.2rem',
        letterSpacing: '0.2rem',
        color: theme.palette.text.titleText,
        opacity: '0.8',
        alignSelf: 'center'
    }
}));

export const styles = (theme) => ({
    paper: {
        background: theme.palette.background.modelBackground,
        backdropFilter: 'blur(2rem)',
        borderRadius: 0,
        border: 'none',
        minWidth: '30vw'
        // height: '80vh'
    },
    sharedEnvPaper: {
        height: '60vh'
    },
    dedicatedEnvPaper: {
        height: '90vh'
    },
    browseEnvPaper: {
        height: '85vh',
        width: '60vw'
    },
    createNewButton: {
        float: 'right',
        margin: theme.spacing(2, 2),
        '& svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    createEnvTopbar: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 3rem',
        height: '5rem',
        alignItems: 'center',
        '& div': {
            display: 'flex'
        },
        '& a': {
            fontWeight: '500',
            fontSize: '2rem'
        }
    },
    createEnvHeader: {
        color: theme.palette.text.titleText,
        fontSize: '2.2rem',
        letterSpacing: '0.1em',
        // marginLeft : '6rem',
        // marginBottom : '2rem',
        // marginTop : '1rem',
        fontWeight: '500'
    },
    backIcon: {
        marginRight: '1rem',
        fill: theme.palette.text.revamp,
        // position: "relative",
        // top: "3.5rem",
        // left: "2.5rem",
        cursor: 'pointer'
    },
    tableContainer: {
        marginTop: theme.spacing(3),
        borderRadius: '5px',
        maxHeight: `calc(100vh - ${theme.layoutSpacing(470)})`,
        position: 'relative',
        border: `0.5px solid ${theme.palette.separator.tableContent}`
    },
    title: {
        margin: 0,
        background: theme.palette.background.modelBackground,
        padding: theme.layoutSpacing(20),
        '& .MuiTypography-h4': {
            color: theme.palette.text.titleText,
            fontSize: '2.5rem',
            letterSpacing: '0.1em',
            opacity: 0.8,
            fontFamily: theme.title.h1.fontFamily
        },
        display: 'flex',
        justifyContent: 'space-between'
    },
    topBtnsContainer: {
        '& button': {
            marginLeft: theme.spacing(1.5)
        }
    },
    subTitle: {
        '& .MuiTypography-h4': {
            color: theme.palette.text.titleText,
            fontSize: '2.0rem',
            letterSpacing: '0.1em',
            opacity: 0.8,
            fontFamily: theme.title.h3.fontFamily
        },
        display: 'flex',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(5),
        alignItems: 'center'
    },
    dialogSubTitle: {
        '& .MuiTypography-h4': {
            color: theme.palette.text.titleText,
            fontSize: '2.0rem',
            letterSpacing: '0.1em',
            opacity: 0.8,
            fontFamily: theme.title.h3.fontFamily
        },
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        gap: theme.spacing(1)
        // alignItems: 'center'
    },
    dialogSubTitleHeader: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    dialogContent: {
        paddingLeft: theme.layoutSpacing(44),
        paddingRight: theme.layoutSpacing(44),
        paddingTop: '0.5rem !important',
        // paddingTop: theme.layoutSpacing(5),
        overflowX: 'hidden',
        overflowY: 'auto',
        '& .MuiTextField-root': {
            marginBottom: '0.5rem'
        }
    },
    browseEnvDialog: {
        display: 'flex',
        paddingLeft: theme.layoutSpacing(20)
    },
    dialogAction: {
        paddingBottom: theme.layoutSpacing(28),
        paddingTop: theme.layoutSpacing(28),
        paddingRight: theme.layoutSpacing(44),
        background: 'red'
    },
    browseEnvSideBarContainer: {
        width: '17vw',
        color: theme.palette.text.titleText,
        '& .MuiFormGroup-root': {
            marginLeft: '1rem'
        },
        '& .MuiTypography-h4': {
            fontWeight: '500',
            margin: '0.5rem 0'
        }
        // '& test' : {
        //     marginRight: "0.1rem",
        //     padding: "0.5rem"
        // }
    },
    list: {
        flex: 1,
        height: '53vh',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16),
        listStyleType: 'none',
        // margin: 0,
        padding: theme.layoutSpacing(1, 4),
        margin: theme.layoutSpacing(0, -2),
        position: 'relative'
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
    browseEnvDetailsContainer: {
        width: '60vw',
        padding: theme.layoutSpacing(10),
        color: theme.palette.text.titleText,
        '& hr': {
            marginBottom: '0 !important'
        },
        '& .MuiTypography-h3': {
            fontWeight: '500'
        }
    },
    browseEnvDetailsSubContainer: {
        padding: theme.layoutSpacing(20),
        paddingTop: '0rem !important',
        '& .MuiTypography-h4': {
            margin: theme.layoutSpacing(15, 0)
        },
        '& .MuiTableContainer-root': {
            maxHeight: 'calc(100vh - 65.5rem)'
        },
        '& .MuiTableCell-head': {
            height: '4.5rem'
        }
    },
    sepratorline: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 32px)'
    },
    borderLine: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: '100%',
        margin: '1.5rem 0'
    },
    pkgTxt: {
        fontSize: '1.5rem !important',
        marginBottom: '1.4rem',
        marginLeft: '1rem',
        marginTop: '2rem'
    },
    pkgPlaceHolder: {
        fontSize: '1.7rem !important',
        color: 'gray',
        opacity: '0.75'
    },
    closeIcon: {
        position: 'absolute',
        top: theme.layoutSpacing(12),
        right: 0,
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        }
    },
    halfWidthDialog: {
        width: '40vw',
        height: '90vh',
        '& h4': {
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(17),
            margin: theme.layoutSpacing(10, 0),
            fontWeight: '500'
        },
        '& h5': {
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(14),
            margin: theme.layoutSpacing(10, 0),
            fontWeight: '500'
        }
    },
    createNewEnvBtnContainer: {
        display: 'flex',
        marginTop: '2rem',
        gap: '2rem'
    },
    // customDialogAction: {
    //     display: 'flex',
    //     paddingTop: theme.spacing(2),
    //     paddingBottom: theme.spacing(2),
    //     '& button': {
    //         marginLeft: theme.spacing(2)
    //     }
    // },
    customDialogAction: {
        // display: 'flex',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        '& button': {
            marginLeft: theme.spacing(2)
        }
    },
    fullWidthBtn: {
        width: '100%'
    },
    customTextFieldsContainer: {
        display: 'flex',
        gap: '2rem',
        width: '100%'
    },
    radioText: {
        fontSize: '1.8rem'
    },
    radio: {
        '& svg': {
            fontSize: '1.8rem'
        }
    },
    browseEnvRadioText: {
        fontSize: '1.5rem !important'
    },
    disabledRadioText: {
        // color : 'red !important'
        // color : theme.palette.action.disabled
        color: 'gray !important',
        opacity: '0.75 !important'
    },
    browseEnvRadio: {
        padding: '0.5rem',
        marginRight: '0.1rem',
        '& svg': {
            fontSize: '1.8rem'
            // marginRight: "0.1rem",
            // padding: "0.5rem"
        }
    },
    envSelectionContainer: {
        overflowY: 'unset',
        display: 'flex',
        justifyContent: 'center'
    },
    link: {
        color: theme.palette.background.infoBgDark,
        fontSize: theme.layoutSpacing(14),
        cursor: 'pointer',
        marginLeft: '1rem'
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
    searchField: {
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
            // gap: theme.layoutSpacing(16)
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
    clickable: {
        cursor: 'pointer'
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
    fontSize2: {
        fontSize: '1.6rem'
    },
    darkStroke: {
        stroke: theme.palette.primary.dark
    },
    tick: {
        color: theme.palette.primary.dark
    },
    packageContainer: {},
    selectTypeContainer: {
        marginBottom: '2rem'
    },
    bulkUpdatezDialogAction: {
        paddingTop: `${theme.layoutSpacing(15)} !important`,
        paddingBottom: `${theme.layoutSpacing(15)} !important`,
        paddingRight: `${theme.layoutSpacing(15)} !important`
    },
    createEnvFormContainer: {
        // width : '28vw',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    formWrapper: {
        border: '1px solid #2B70C2',
        padding: '0 3rem 3rem 3rem',
        width: '28vw',
        borderRadius: '5px',
        '& .MuiTextField-root': {
            margin: '1rem 0'
        },
        '& .MuiStepper-root': {
            padding: '2rem'
        },
        '& input.Mui-disabled': {
            backgroundColor: theme.palette.background.field_disabled_bg,
            color: theme.palette.text.disabledLabel
        }
        // "& input.Mui-disabled::before": {
        //     borderBottom: '3px solid red !important'
        // }
        // "& input.Mui-disabled::before": {
        //     borderBottom : '1px solid red !important'
        // },
        // "& input.Mui-disabled::before": {
        //     borderBottom: '1px solid red !important'
        // }
    },
    verifyingPackagesLoadMask: {
        height: '100%'
    },
    halfWidth: {
        width: '50%'
    },
    createEnvbtn: {
        marginTop: '3rem'
    },
    errorRow: {},
    errorCell: {
        color: 'red',
        paddingTop: '0rem',
        paddingLeft: '5rem',
        paddingBottom: '4rem',
        fontWeight: '500'
    },
    ul: {
        paddingLeft: '3.5rem',
        marginTop: '0.3rem'
    },
    compatibleVersionsList_p_tag: {
        marginBottom: '.2rem',
        marginTop: '.2rem'
    },
    disabledIcon: {
        opacity: '0.32'
    },
    errorMsg: {
        color: 'red',
        marginBottom: '1rem'
    }
});
