const appAdminCodeEditorStyle = (theme) => ({
    codeEditorBody: {
        width: '100%',
        position: 'relative',
        height: theme.spacing(50)
    },
    codeEditorDisabled: {
        filter: 'greyscale(1.2)'
    },
    codeSmallEditorBody: {
        width: '100%',
        position: 'relative',
        height: theme.spacing(20),
        marginBottom: theme.spacing(1)
    },
    codeTinyEditorBody: {
        width: '100%',
        position: 'relative',
        height: theme.spacing(15),
        marginBottom: theme.spacing(1)
    },
    codeEditorDarkStyle: {
        '& div.monaco-editor .margin, .monaco-editor, .monaco-editor-background, .monaco-editor .inputarea.ime-input':
            {
                backgroundColor: theme.palette.primary.dark
            },
        '& .decorationsOverviewRuler': {
            backgroundColor: theme.palette.background.pureWhite
        }
    },
    codeEditorLightStyle: {
        '& div.monaco-editor .margin, .monaco-editor, .monaco-editor-background, .monaco-editor .inputarea.ime-input':
            {
                backgroundColor: theme.palette.primary.light
            },
        '& .decorationsOverviewRuler': {
            backgroundColor: theme.palette.text.default
        }
    },
    codeLogsBody: {
        width: '100%',
        position: 'relative',
        height: theme.spacing(20),
        overflow: 'auto',
        marginBottom: theme.spacing(1)
    },
    codeAccordionContainer: {
        width: '100%'
    },
    codeContainerHeader: {
        color: theme.palette.text.default,
        padding: theme.spacing(2, 0)
    },
    codeSectionsToolbar: {
        height: theme.spacing(4.7),
        paddingLeft: '3rem'
    },
    codeSectionsDarkBorder: {
        borderLeft: theme.spacing(1.5) + ' solid ' + theme.palette.primary.dark,
        borderRight: theme.spacing(1.5) + ' solid ' + theme.palette.primary.dark,
        backgroundColor: theme.palette.primary.main
    },
    codeSectionsLightBorder: {
        borderLeft: theme.spacing(1.5) + ' solid ' + theme.palette.primary.light,
        borderRight: theme.spacing(1.5) + ' solid ' + theme.palette.primary.light,
        backgroundColor: theme.palette.primary.dark
    },
    codeSectionsHeader: {
        float: 'left',
        cursor: 'pointer',
        color: theme.palette.text.default,
        opacity: '0.5',
        padding: theme.spacing(1, 2),
        '&:hover': {
            opacity: '0.75'
        }
    },
    codeSectionsHeaderSelected: {
        float: 'left',
        color: theme.palette.text.default,
        padding: theme.spacing(1, 2)
    },
    codeResponseMetric: {
        color: theme.palette.text.default,
        padding: theme.spacing(1, 4),
        fontStyle: 'italic',
        fontSize: '1.5rem'
    }
});

export default appAdminCodeEditorStyle;
