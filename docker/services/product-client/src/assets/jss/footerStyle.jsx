import { alpha } from '@material-ui/core';

const footerStyle = (theme) => ({
    right: {
        float: 'right !important'
        // backgroundColor: theme.palette.primary.main
    },
    footer: {
        // right: theme.spacing(0),
        // bottom: '-' + theme.spacing(2),
        // position: 'fixed'
    },
    footerCopyText: {
        float: 'right',
        color: theme.palette.text.default,
        paddingRight: theme.spacing(2),
        position: 'relative'
    },
    footerVersionText: {
        fontSize: '12px',
        color: alpha(theme.palette.text.default, 0.5),
        paddingRight: theme.spacing(2)
    },
    footerCopyTextLogin: {
        float: 'right',
        color: '#ffffff',
        paddingRight: theme.spacing(2),
        position: 'relative'
    },
    containerFluid: {
        position: 'absolute',
        left: theme.layoutSpacing(16),
        bottom: theme.layoutSpacing(12),
        '@media (max-height: 600px)': {
            bottom: theme.layoutSpacing(6)
        }
    },
    containerFluidDark: {
        position: 'relative'
    },
    a: {
        // color: theme.palette.primary.main,
        textDecoration: 'none',
        backgroundColor: 'transparent',
        '& img': {
            height: theme.layoutSpacing(20),
            position: 'relative'
        },
        position: 'relative'
    },
    list: {
        marginBottom: '0',
        padding: '0',
        marginTop: '0'
    },
    inlineBlock: {
        display: 'inline-block',
        padding: '0',
        width: 'auto'
    },
    whiteColor: {
        '&,&:hover,&:focus': {
            color: '#ffffff'
        }
    },
    footer_first: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px'
    },
    footer_text: {
        color: theme.palette.text.revamp,
        fontFamily: theme.body.B3.fontFamily,
        fontSize: theme.layoutSpacing(20),
        fontWeight: '500',
        lineHeight: '2.1rem',
        letterSpacing: theme.body.B3.letterSpacing,
        marginRight: theme.layoutSpacing(78)
    },
    footer_version: {
        textTransform: 'uppercase',
        color: theme.palette.text.footerVersion,
        fontFamily: theme.body.B3.fontFamily,
        fontSize: theme.body.B3.fontSize,
        fontWeight: theme.layoutSpacing(20),
        lineHeight: '2.1rem',
        letterSpacing: theme.body.B3.letterSpacing,
        marginRight: '2rem'
    },
    footer_logo: {
        border: `1px solid ${theme.palette.text.default}`,
        borderRadius: '50%',
        width: '1.8rem',
        height: '1.6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    copyRight: {
        fontSize: '1.2rem',
        color: theme.palette.text.default
    },
    footerContainer: {
        position: 'absolute',
        padding: `${theme.layoutSpacing(10)} ${theme.layoutSpacing(0)}`,
        left: theme.layoutSpacing(40)
    },
    loginFootertext: {
        marginRight: theme.layoutSpacing(102)
    },
    newLogo: {
        '& svg': {
            '& path': {
                fill: `${theme.palette.text.revamp} !important`
            }
        }
    },
    projectsFooter: {
        bottom: 0
    }
});
export default footerStyle;
