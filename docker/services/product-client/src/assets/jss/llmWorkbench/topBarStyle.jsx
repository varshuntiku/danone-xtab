import { alpha } from '@material-ui/core';

const topBarStyle = (theme) => ({
    topBar: {
        position: 'relative',
        minHeight: '6.4rem',
        boxShadow: 'none',
        padding: '0 2.4rem',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        '&:after': {
            content: '" "',
            position: 'absolute',
            height: 0,
            width: 'calc(100% - 0.5rem)',
            right: 0,
            bottom: 0,
            borderBottom: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4)
        },
        '& h4': {
            fontWeight: 200
        }
    }
});

export default topBarStyle;
