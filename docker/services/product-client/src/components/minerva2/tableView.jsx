import React from 'react';
import { withStyles, makeStyles, alpha } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import TableSortLabel from '@material-ui/core/TableSortLabel';
// import { Scrollbars } from 'react-custom-scrollbars';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    table: {
        Width: '100%'
    },
    container: {
        maxHeight: '100%'
    },
    activeTableCell: {
        color: `${alpha(theme.palette.primary.dark, 0.7)} !important`
    },
    hover: {
        '&:hover': {
            color: alpha(theme.palette.primary.dark, 0.4) + '!important'
        }
    }
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        color: theme.palette.primary.dark,
        fontSize: '1.6rem',
        backgroundColor: theme.palette.primary.contrastText
    },
    body: {
        fontSize: '1.3rem',
        color: theme.palette.text.default
    }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main
    }
}))(TableRow);

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export default function DataTable(props) {
    var newArray = props.tableData[0].map((e, i) => {
        let temp = [];
        props.tableData.forEach((o) => temp.push(o[i]));
        return temp;
    });

    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(props.tableHead.length + 1);

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <Paper style={{ width: '70%' }}>
            <TableContainer className={classes.container}>
                <Table className={classes.table} size="small" stickyHeader>
                    <TableHead>
                        <TableRow className={classes.tableRow}>
                            {props.tableHead.map((item, index) => (
                                <StyledTableCell
                                    align={index === 0 ? 'left' : 'right'}
                                    key={'head' + index}
                                    sortDirection={orderBy === index ? order : false}
                                >
                                    <TableSortLabel
                                        className={classes.hover}
                                        classes={{ active: classes.activeTableCell }}
                                        active={orderBy === index}
                                        direction={orderBy === index ? order : 'asc'}
                                        onClick={createSortHandler(index)}
                                    >
                                        {item.replace('_', ' ').toUpperCase()}

                                        {orderBy === index ? (
                                            <span className={classes.visuallyHidden}></span>
                                        ) : null}
                                    </TableSortLabel>
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            // props.tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item,index) =>(
                            stableSort(newArray, getComparator(order, orderBy)).map(
                                (item, index) => (
                                    <StyledTableRow key={'row' + index}>
                                        {item.map((it, i) => (
                                            <StyledTableCell
                                                className={classes.cell}
                                                key={item + i}
                                                align={i === 0 ? 'left' : 'right'}
                                            >
                                                {it == null ? it : it.toLocaleString()}
                                            </StyledTableCell>
                                        ))}
                                    </StyledTableRow>
                                )
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
