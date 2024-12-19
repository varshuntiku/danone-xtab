const finetunedModelsStyle = (theme) => ({
    tableActionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '2px',
        '& .Mui-disabled': {
            opacity: '0.32',
            cursor: 'not-allowed',
            pointerEvents: 'auto',
            '& svg': {
                cursor: 'not-allowed',
                pointerEvents: 'auto'
            }
        }
    },
    tableActions: {
        color: theme.palette.primary.contrastText,
        fontSize: theme.spacing(2),
        '& svg': {
            color: theme.palette.text.contrastText,
            fontSize: theme.spacing(3),
            marginBottom: theme.spacing(-0.8)
        }
    },
    progressContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    topContainer: {
        paddingLeft: '1.4rem',
        // paddingTop: '2.4rem',
        paddingBottom: '1.4rem',
        borderBottom: '1px solid ' + theme.palette.separator.grey,
        margin: '1rem',
        marginTop: '0.5rem'
    },
    heading: {
        fontWeight: 500,
        color: theme.palette.text.contrastText,
        fontSize: '2.2rem',
        letterSpacing: theme.title.h1.letterSpacing,
        lineHeight: theme.spacing(4),
        fontFamily: 'Graphik'
    },
    finetuneNewBtn: {
        marginRight: '2.4rem',
        width: 'fit-content',
        marginTop: '1rem',
        textTransform: 'none',
        letterSpacing: '0.5px',
        alignSelf: 'flex-end'
    },
    path: {
        fontSize: theme.spacing(2),
        fontFamily: 'Graphik Compact',
        paddingBottom: '1rem'
    },
    currentPath: {
        fontWeight: '500',
        textTransform: 'none'
    },
    paper: {
        // background: theme.palette.background.default
        backgroundColor: 'white'
    },
    textField: {
        border: `1px solid ${theme.palette.text.default}`,
        '& fieldset': {
            display: 'none'
        },
        '& .MuiSelect-icon': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(3),
            top: 'auto'
        }
    },
    configDialogueHeader: {
        color: theme.palette.text.titleText,
        padding: '1rem',
        fontSize: '2.2rem',
        fontWeight: 500,
        fontFamily: 'Graphik Compact'
    },
    breadCrumbs: {
        color: theme.palette.text.titleText,
        paddingBottom: '1rem',
        '& path:not(.noStroke), circle:not(.noStroke)': {
            stroke: theme.palette.text.revamp
        },
        '& path:not(.noFill), circle:not(.noFill)': {
            fill: theme.palette.text.revamp
        }
    },
    deployIcon: {
        '& path': {
            fill: theme.palette.primary.contrastText
        }
    },
    progressBar: {
        backgroundColor: theme.palette.primary.main,
        width: '6rem',
        borderRadius: '10px',
        height: '1rem',
        border: '1px solid ' + theme.palette.text.default,
        marginTop: theme.spacing(2.2),
        '& .MuiLinearProgress-barColorPrimary': {
            backgroundColor: 'rgba(252, 178, 35, 1)'
        }
    },
    progressBarStatus: {
        fontSize: theme.spacing(1.7),
        marginTop: theme.spacing(0.8)
    },
    EtcTime: {
        fontSize: theme.spacing(1.6),
        color: 'rgba(84, 201, 251, 1)',
        letterSpacing: '0.3px'
    }
});

export default finetunedModelsStyle;
