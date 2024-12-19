import { alpha } from '@material-ui/core';

const ReportDetailsStyle = (theme) => ({
    navbar: {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        height: theme.spacing(6.875),
        textAlign: 'center',
        borderBottom: ' 1px solid ' + alpha(theme.palette.border.dashboard, 0.4),
        padding: theme.spacing(1.25, 3.75)
    },
    navIcons: {
        marginLeft: theme.spacing(5)
    },
    navButtons: {
        fontWeight: '500',
        fontSize: theme.spacing(1.5),
        textAlign: 'center',
        color: theme.palette.primary.contrastText,
        textTransform: 'none'
    },
    icons: {
        padding: theme.spacing(1.25)
    },
    alignLeft: {
        left: theme.spacing(3),
        position: 'absolute'
    },
    alignRight: {
        top: '50%',
        transform: 'translateY(-50%)',
        position: 'absolute',
        right: theme.spacing(3),
        display: 'flex'
    },
    pageTitle: {
        margin: 'auto',
        fontWeight: '300',
        fontSize: theme.spacing(3),
        lineHeight: theme.spacing(3.5),
        color: theme.palette.text.titleText
    },
    main: {
        padding: theme.spacing(3),
        position: 'relative',
        height: 'calc(100% - ' + theme.spacing(8) + ')',
        overflow: 'auto'
    },
    slideContent: {
        height: '100%'
    },
    deleteIcon: {
        visibility: 'hidden',
        '& svg path': {
            fill: theme.palette.icons.color + ' !important'
        }
    },
    thumbnail: {
        position: 'relative',
        maxHeight: 'calc(100vh - ' + theme.spacing(27) + ')',
        overflow: 'auto',
        '& .MuiGridList-root': {
            margin: theme.spacing(0, 1.25) + ' !important',
            '& :hover': {
                '& $deleteIcon': {
                    visibility: 'visible'
                }
            }
        },
        '& .MuiGridListTile-root': {
            padding: 'unset',
            marginBottom: theme.spacing(1.25)
        },
        '& .MuiGridListTileBar-root': {
            position: 'unset',
            height: 'unset',
            backgroundColor: theme.palette.background.paper,
            paddingTop: theme.spacing(0.625)
        },
        '& .MuiGridListTileBar-title': {
            fontSize: theme.spacing(1.5),
            color: theme.palette.text.titleText
        },
        '& .MuiIconButton-root': {
            padding: 'unset',
            marginRight: theme.spacing(1.5)
        }
    },
    thumbnailPlot: {
        width: '100%',
        height: theme.spacing(12.5),
        position: 'relative'
    },
    graphPlotContent: {
        width: '100%',
        height: 'calc(100% - ' + theme.spacing(2) + ')',
        position: 'relative'
    },
    reportDescription: {
        '& .MuiTextField-root': {
            marginTop: theme.spacing(1.875),
            background: theme.palette.background.paper
        }
    },
    active: {
        border: '0.5px solid' + theme.palette.primary.contrastText
    },

    headingtext: {
        fontWeight: 'bold',
        fontSize: theme.spacing(3),
        color: theme.palette.text.titleText,
        paddingTop: theme.spacing(0.5),
        paddingRight: theme.spacing(1)
    },
    cardheadingtext: {
        color: theme.palette.text.titleText,
        paddingRight: theme.spacing(1),
        '& .MuiCardHeader-title': {
            paddingTop: theme.spacing(0.5),
            fontWeight: 'bold',
            fontSize: theme.spacing(3)
        }
    },
    cardMetaData: {
        color: theme.palette.text.titleText,
        display: 'flex',
        padding: theme.spacing(3),
        alignItems: 'center',
        fontSize: theme.spacing(2)
    },
    filterOptionContainer: {
        marginRight: theme.spacing(3)
    },
    filterOptionValue: {
        fontWeight: 'bold'
    }
});

export default ReportDetailsStyle;
