import { alpha } from '@material-ui/core';

const modelsStyle = (theme) => ({
    container: {
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2)
        // minHeight:'100vh'
    },
    top: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        flex: 1.5,
        color: theme.palette.text.default,
        fontFamily: 'Graphik Compact',
        fontWeight: 400,
        fontSize: theme.spacing(2.4),
        letterSpacing: '1px',
        lineHeight: 'normal'
    },
    searchIcon: {
        fontSize: theme.spacing(4),
        color: theme.palette.primary.contrastText
    },
    inputText: {
        fontSize: theme.spacing(2),
        color: theme.palette.text.default
    },
    textLight: {
        color: alpha(theme.palette.text.default, 0.4)
    },
    input: {
        width: '60%',
        height: '100%',
        '& .MuiOutlinedInput-input': {
            padding: theme.spacing(2.5, 1.3)
        },
        '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            border: '1px solid ' + theme.palette.primary.contrastText
        }
    },
    searchSortContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing(3)
    },
    sort: {
        border: '1px solid ' + theme.palette.primary.contrastText,
        borderRadius: '4px',
        textTransform: 'None',
        width: '40%',
        flexShrink: 0,
        '& .MuiButton-startIcon': {
            paddingRight: 0
        }
    },
    padding: {
        paddingTop: theme.spacing(2)
    },
    popper: {
        width: '11%',
        zIndex: 1
    },
    menuItem: {
        color: theme.palette.primary.contrastText,
        fontSize: theme.spacing(2)
    },
    paginate: {
        marginTop: theme.spacing(4),
        alignSelf: 'center',
        '& .MuiPaginationItem-page': {
            color: theme.palette.text.default,
            fontSize: theme.spacing(2)
        },
        '& .Mui-selected': {
            border: '1px solid ' + theme.palette.primary.contrastText,
            fontWeight: 500
        },
        '& .MuiPaginationItem-icon': {
            fontSize: theme.spacing(2.5),
            border: 'None'
        },
        '& .MuiPaginationItem-ellipsis': {
            color: theme.palette.text.default
        },
        '& .MuiPaginationItem-previous, & .MuiPaginationItem-next': {
            color: theme.palette.primary.contrastText
        },
        '& .MuiSvgIcon-root': {
            color: theme.palette.primary.contrastText
        }
    },
    sortIcon: {
        '& .MuiButton-startIcon': {
            paddingRight: 0
        }
    }
});

export default modelsStyle;
