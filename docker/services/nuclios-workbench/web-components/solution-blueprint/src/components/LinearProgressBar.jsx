import { withStyles } from '@material-ui/core/styles';

import LinearProgress from '@material-ui/core/LinearProgress';
import linearProgressStyle from 'src/assets/jss/linearProgressStyle.jsx';

export default withStyles(
    (theme) => ({
        ...linearProgressStyle(theme)
    }),
    { withTheme: true }
)(LinearProgress);
