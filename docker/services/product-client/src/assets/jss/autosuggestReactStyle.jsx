const autosuggestReactStyle = (theme) => ({
    container: {
        position: 'relative'
    },
    input: {
        width: '100%',
        height: theme.spacing(4),
        padding: theme.spacing(3, 5),
        fontSize: '1.75rem',
        border: '1px solid transparent',
        borderRadius: theme.spacing(0.5),
        backgroundColor: theme.palette.background.tableSelcted,
        color: theme.palette.text.default,
        borderBottom: `2px solid ${theme.palette.border.grey}`
    },
    inputFocused: {
        outline: 'none'
    },
    inputOpen: {
        borderBottomLeftRadius: '0',
        borderBottomRightRadius: '0'
    },
    suggestionsContainer: {
        display: 'none'
    },
    suggestionsContainerOpen: {
        display: 'block',
        position: 'absolute',
        top: theme.spacing(4),
        borderTop: '1px dashed ' + theme.palette.text.default,
        width: '100%',
        backgroundColor: theme.palette.primary.light,
        fontSize: '1.5rem',
        borderBottomLeftRadius: theme.spacing(0.5),
        borderBottomRightRadius: theme.spacing(0.5),
        zIndex: '2',
        overflow: 'auto',
        height: theme.spacing(50)
    },
    suggestionsList: {
        margin: '0',
        padding: '0',
        listStyleType: 'none'
    },
    suggestion: {
        cursor: 'pointer',
        padding: theme.spacing(1, 2),
        color: theme.palette.text.default
    },
    suggestionHighlighted: {
        opacity: '0.7'
    },
    sectionContainer: {
        borderTop: '1px dashed ' + theme.palette.text.default
    },
    sectionContainerFirst: {
        borderTop: '0'
    },
    sectionTitle: {
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        fontSize: '1.75rem',
        color: theme.palette.primary.contrastText
    }
});

export default autosuggestReactStyle;
