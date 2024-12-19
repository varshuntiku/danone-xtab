const deployLLMStyle = (theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: theme.palette.primary.altDark,
        height: '100%',
        overflow: 'hidden'
    },
    innerBox: {
        marginTop: theme.spacing(20),
        width: '55rem',
        height: 'fit-content',
        maxHeight: '600px',
        border: `1px solid ${theme.palette.separator.grey}`,
        backgroundColor: theme.palette.background.tab,
        display: 'flex',
        flexDirection: 'column'
    },
    deployHeading: {
        fontWeight: '500'
    },
    heading: {
        margin: theme.spacing(4, 6, 0, 3),
        lineHeight: theme.spacing(2.3),
        letterSpacing: theme.spacing(0.1),
        color: theme.palette.text.default,
        fontFamily: 'Graphik Compact'
    },
    buttonContainer: {
        margin: theme.spacing(7, 6, 2, 3),
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing(2)
    },
    inProgresscontainer: {
        width: '100rem',
        height: '15rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressBar: {
        backgroundColor: theme.palette.primary.light,
        '& .MuiLinearProgress-barColorPrimary': {
            backgroundColor: theme.palette.primary.contrastText
        },
        '& .MuiLinearProgress-colorPrimary': {
            backgroundColor: 'red'
        }
    },
    loadingText: {
        color: theme.palette.text.light,
        letterSpacing: '0.3px'
    },
    progressBarContainer: {
        width: '100rem',
        marginTop: theme.spacing(3)
    },
    text: {
        color: theme.palette.text.default
    },
    accessContainer: {
        display: 'none',
        border: '1px solid ' + theme.palette.primary.contrastText,
        borderRadius: '5px',
        marginTop: '1rem',
        width: '100rem',
        backgroundColor: theme.palette.background.tab
    },
    accessText: {
        padding: '1.5rem 1.5rem 0 1rem'
    }
});

export default deployLLMStyle;
