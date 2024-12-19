import React from 'react';
import PropTypes from 'prop-types';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import expandableTableStyle from '../../assets/jss/expandableTableStyle';
import { makeStyles } from '@material-ui/core/styles';

const EnhancedTableHead = (props) => {
    const { order, orderBy, onRequestSort, columns } = props;
    const classes = makeStyles(expandableTableStyle)();
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {columns.map((headCell, index) => (
                    <TableCell
                        sortDirection={orderBy === headCell.id ? order : false}
                        width={!index ? 30 : null}
                        className={clsx(
                            classes.tableCell,
                            classes.tableHeadCell,
                            classes.tableHeadFontSize
                        )}
                        key={headCell.label + index + 0}
                    >
                        {headCell.label ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                            </TableSortLabel>
                        ) : (
                            ''
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired
};

export default EnhancedTableHead;
