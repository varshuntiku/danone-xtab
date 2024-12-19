import { alpha } from '@material-ui/core';
const reportsListStyle = (theme) => ({
    navbar: {
        height: theme.spacing(6.875),
        position: 'relative',
        padding: theme.spacing(1, 2),
        display: 'flex',
        gap: '2rem'
    },
    mainpage: {
        background: theme.palette.primary.dark
    },
    subpageTitle: {
        color: theme.palette.text.titleText,
        margin: '2% 0%',
        fontFamily: theme.title.h1.fontFamily
    },
    root: {
        backgroundColor: theme.palette.background.selected
    },
    main: {
        padding: '0rem 1.5rem 20rem 1.5rem',
        '& .MuiTab-root': {
            color: theme.palette.text.contrastText,
            textTransform: 'none',
            fontWeight: '500',
            fontSize: theme.layoutSpacing(18),
            fontFamily: theme.title.h1.fontFamily,
            minHeight: '2px',
            borderRadius: '0px',
            marginBottom: theme.layoutSpacing(12),
            borderBottom: `1px solid ${theme.palette.separator.grey}`
        },
        '& .MuiTabs-flexContainer': {
            width: '486px',
            padding: '3px'
        },
        '& .Mui-selected': {
            minheight: theme.layoutSpacing(2),
            borderRadius: 0,
            borderBottom: `2px solid ${theme.palette.text.default}`
        },
        '& .MuiTabs-indicator': {
            display: 'none'
        },
        '& .MuiTab-wrapper': {
            color: theme.palette.primary.contrastText
        }
    },
    alignLeft: {
        position: 'absolute',
        left: theme.spacing(3)
    },
    alignRight: {
        position: 'absolute',
        right: theme.spacing(3)
    },
    createStoryBtn: {
        borderRadius: theme.spacing(1.875),
        fontSize: theme.spacing(1.75),
        lineHeight: theme.spacing(2),
        textTransform: 'none',
        fontWeight: '500'
    },
    backIcon: {
        color: theme.palette.text.green,
        fontSize: theme.spacing(3)
    },
    pageTitle: {
        fontWeight: '200',
        fontSize: theme.spacing(3.5),
        lineHeight: theme.spacing(3.5),
        color: theme.palette.text.titleText
    },
    pageText: {
        margin: 'auto',
        textAlign: 'center',
        fontWeight: '300',
        fontSize: theme.spacing(2.5),
        lineHeight: theme.spacing(3.5),
        color: theme.palette.text.titleText
    }
});

export default reportsListStyle;
