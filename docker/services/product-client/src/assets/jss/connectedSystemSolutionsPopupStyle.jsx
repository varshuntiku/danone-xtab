import { alpha } from '@material-ui/core';

const connectedSystemSolutionsPopupStyle = (theme) => ({
    popUp: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
        width: theme.spacing(75),
        maxWidth: '500px',
        minHeight: theme.spacing(37.5),
        position: 'fixed',
        padding: theme.spacing(2.5),
        background: 'transparent',
        backdropFilter: `blur(10rem)`,
        backgroundBlendMode: 'overlay',
        boxShadow: `0px 2px 5px ${alpha(theme.ConnectedSystemDashboard.shadow, 0.5)}`,
        border: `1px solid ${
            localStorage.getItem('codx-products-theme') == 'dark' ? '#02E0FE4D' : '#4560D7CC'
        }`,
        borderRadius: '5px',
        color: theme.palette.text.default,
        transition: 'scale 0.5s',
        zIndex: '100000'
    },
    popUpClose: {
        scale: 0
    },
    popUpOpen: {
        scale: 1
    },
    top: {
        display: 'flex',
        flex: 1,
        gap: theme.spacing(1)
    },
    bottom: {
        display: 'flex',
        flex: 1,
        gap: theme.spacing(2)
    },
    logo: {
        width: '10%',
        '& img': {
            width: '75%'
        }
    },
    header: {
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1)
    },
    heading: {
        fontSize: theme.spacing(3),
        fontWeight: 400
    },
    mainHeading: {
        fontSize: theme.spacing(3.5),
        fontWeight: 400,
        cursor: 'pointer'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(0.5),
        color: theme.palette.text.default,
        fontSize: theme.spacing(2.25),
        justifyContent: 'center'
    },
    item: {
        display: 'flex',
        gap: theme.spacing(1),
        alignItems: 'center',
        '& svg': {
            color: theme.palette.text.default,
            fontSize: theme.spacing(1)
        }
    },
    insight: {
        width: '200px',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1)
    },
    value: {
        background: alpha('#76C284', 0.25),
        color: '#76C284',
        padding: theme.spacing(0.5, 1),
        borderRadius: '5px',
        width: 'max-content',
        fontSize: theme.spacing(1.5),
        marginTop: 'auto'
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '25px',
        aspectRatio: 1,
        padding: '5px',
        margin: '5px',
        '& svg': {
            width: '100%',
            color: theme.palette.text.default,
            cursor: 'pointer'
        }
    }
});

export default connectedSystemSolutionsPopupStyle;
