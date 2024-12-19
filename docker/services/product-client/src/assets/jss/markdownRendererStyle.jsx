const markdownRendererStyle = (theme) => ({
    markdownHeader: {
        color: theme.palette.text.headingText,
        marginTop: '1em'
    },
    markdownBody: {
        color: theme.palette.textColor,
        fontSize: 'inherit'
    },
    markdownList: {
        color: theme.palette.textColor,
        fontSize: 'inherit'
    },
    codePre: {
        position: 'relative',
        padding: '0px 5px',
        backgroundColor: theme.palette.background.contrastText,
        fontSize: 'inherit'
    },
    copyButton: {
        color: theme.palette.text.contrastText,
        position: 'absolute',
        right: '0px',
        top: '-2px',
        fontSize: '1.5em',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out'
    },
    markdownComponent: {
        color: theme.palette.textColor,
        fontSize: '1.7em',
        width: 'inherit',
        '& span > code, p > code': {
            color: theme.palette.text.inlineCode //inline code
        },
        '& img': {
            maxWidth: '100%'
        },
        // "& span.MuiTypography-body1 span.MuiTypography-body1, span.MuiTypography-body1 p.MuiTypography-body1, div[class^='MarkdownRenderer-codePre']": {
        //   fontSize: '1em'
        // },
        '& > [data-custom-type="whats-new"]': {
            backgroundColor: theme.palette.background.markdownHighlight,
            border: `${theme.layoutSpacing(1)} solid ${theme.palette.border.markdownHighlight}`,
            padding: theme.layoutSpacing(20),
            borderRadius: theme.layoutSpacing(4),
            color: theme.palette.text.purpleText,
            '& $markdownHeader': {
                marginTop: 0
            },
            '& *': {
                color: theme.palette.text.purpleText
            }
        }
    }
});

export default markdownRendererStyle;
