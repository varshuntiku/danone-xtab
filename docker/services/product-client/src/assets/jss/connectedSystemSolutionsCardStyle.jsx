import { alpha } from '@material-ui/core/styles';

const connectedSystemSolutionsCardStyle = (theme, props) => ({
    cardContainer: {
        border: (props) =>
            props?.border || `1.5px solid ${alpha(theme.ConnectedSystemDashboard.border, 0.4)}`,
        background: theme.palette.background.linearBackground,
        padding: theme.spacing(1),
        borderRadius: '5px',
        display: 'flex',
        gap: theme.spacing(1),
        position: 'relative',
        height: '13rem',
        maxHeight: '250px'
    },
    visibleCardContainerGap: {
        marginRight: theme.spacing(1)
    },
    hiddenCardContainerGap: {
        marginRight: '0px'
    },
    cardContainerHighlighted: {
        border: `3px solid ` + alpha(theme.palette.primary.contrastText, 0.5)
    },
    cardContainerHidden: {
        opacity: 0,
        transform: 'translateY(120px)',
        transition: 'transform 1.5s ease 0s, opacity 1.25s ease 0s'
    },

    cardContainerRemove: {
        display: 'none'
    },
    cardContainerPowerBI: {
        border: '1.5px solid ' + alpha('#E1AD01', 0.4)
    },
    contentLeft: {
        width: '25px'
    },
    contentCenter: {
        width: '150px',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1)
    },
    contentRight: {
        width: '15px',
        position: 'absolute',
        top: 5,
        right: 5
    },
    cardIcon: {
        width: '100%',
        aspectRatio: 1
    },
    cardHeading: {
        fontSize: theme.spacing(2),
        color: theme.palette.text.default,
        width: '100%',
        fontWeight: '500',
        paddingRight: '1.5rem'
    },
    solutionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(0.5),
        color: theme.palette.text.default,
        fontSize: theme.spacing(1.75),
        justifyContent: 'center'
    },
    solutionItem: {
        display: 'flex',
        gap: theme.spacing(1),
        alignItems: 'center',
        '& svg': {
            color: theme.palette.text.default,
            fontSize: theme.spacing(1)
        }
    },
    expandButton: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1,
        rotate: '45deg',
        transition: '0.5s',
        cursor: 'pointer',
        '& svg': {
            fontSize: theme.spacing(2.5),
            color: theme.palette.text.default
        },
        '&:hover': {
            opacity: 0.5
        }
    },
    expandButtonDisabled: {
        pointerEvents: 'none'
    },
    insightContent: {
        color: theme.palette.text.default,
        fontSize: theme.spacing(1.75)
    },
    insightPoint: {
        display: 'flex',
        gap: '0.2rem',
        marginTop: '3rem',
        marginLeft: '1.5rem'
    },
    pointer: {
        fontSize: '0.8rem',
        color: `${theme.palette.text.titleText}`,
        marginTop: '0.3rem'
    },
    selectedSolution: {
        border: `${theme.spacing(0.5)} solid rgba(2, 224, 254, 0.8)`,
        background: 'rgba(6, 184, 212, 0.16)'
    },
    insightContainer: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '33rem',
        minHeight: '10rem',
        maxHeight: '12rem',
        minWidth: '27rem'
    },
    solutionCardStyle: {
        maxWidth: (props) => (props?.solutioncardstyle ? props.solutioncardstyle.maxWidth : null),
        minHeight: (props) => (props?.solutioncardstyle ? props.solutioncardstyle.minHeight : null),
        maxHeight: (props) => (props?.solutioncardstyle ? props.solutioncardstyle.maxHeight : null),
        minWidth: (props) => (props?.solutioncardstyle ? props.solutioncardstyle.minWidth : null)
    }
});

export default connectedSystemSolutionsCardStyle;
