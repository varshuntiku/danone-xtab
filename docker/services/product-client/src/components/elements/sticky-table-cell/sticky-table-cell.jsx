import { withStyles, TableCell } from '@material-ui/core';
import stickyTableCellStyles from './styles';

const StickyTableCell = withStyles(stickyTableCellStyles)(TableCell);

export default StickyTableCell;
