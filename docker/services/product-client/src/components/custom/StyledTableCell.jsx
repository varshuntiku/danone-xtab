import { withStyles } from '@material-ui/core/styles';

import TableCell from '@material-ui/core/TableCell';

export default withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.background.tableHeader,
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: '500',
        height: theme.spacing(7.5),
        border: 'none',
        padding: theme.spacing(0.5, 2)
    },
    body: {
        border: 'none',
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.body.B5.fontFamily,
        padding: theme.spacing(0.5, 2)
    }
}))(TableCell);
