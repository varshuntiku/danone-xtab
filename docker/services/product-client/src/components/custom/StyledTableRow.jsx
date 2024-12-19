import { withStyles } from '@material-ui/core/styles';

import TableRow from '@material-ui/core/TableRow';

export default withStyles((theme) => ({
    root: {
        color: theme.palette.text.default,
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(14),
        fontWeight: '500',
        padding: `${theme.layoutSpacing(12)} ${theme.layoutSpacing(16)}`
    }
}))(TableRow);
