import React, { useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Collapse,
    IconButton
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import codxTableStyle from './codxTableStyle';
import clsx from 'clsx';

const RenderTable = ({
    tableHeaders,
    tableData,
    parentHeadersLength,
    classes = {},
    borderLeft = false,
    type,
    collapse = false,
    search
}) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const isExpandable = type === 'expandable';
    const handleClick = (row) => {
        setOpen(!open);
        setSelected((prev) => (prev !== row ? row : null));
    };
    const hightLightText = (value) => {
        return String(value).toLowerCase().includes(search.toLowerCase()) && search.length;
    };
    function filterData(value) {
        if (
            value?.rowData?.some((el) =>
                String(el.value).toLowerCase().includes(search.toLowerCase())
            )
        ) {
            return true;
        } else {
            if (value?.collapsableTableData) {
                for (var i = 0; i < value?.collapsableTableData?.tableData?.length; i++) {
                    if (filterData(value.collapsableTableData.tableData[i])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    return (
        <Table
            aria-label="Codx Table"
            className={clsx(borderLeft ? classes.tableLeftBorder : 'none')}
        >
            <TableHead>
                <TableRow className={`${classes.headRow} ${collapse && classes.nestedHeadRow}`}>
                    {isExpandable ? (
                        <TableCell className={clsx(classes.iconCell, classes.headerIconcell)} />
                    ) : null}
                    {tableHeaders.map((header, i) => (
                        <TableCell
                            key={`${header.value}${i}`}
                            className={`${classes.headCell} ${collapse && classes.nestedHeadCell}`}
                            align={header.type === 'number' ? 'right' : 'left'}
                        >
                            {header.value}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>

            <TableBody>
                {tableData.map((row, i) => (
                    <>
                        {filterData(row) ? (
                            <TableRow
                                key={`${row?.rowData.length}${i}`}
                                className={`${classes.contentRow} ${
                                    collapse && classes.nestedContentRow
                                }`}
                            >
                                {isExpandable ? (
                                    row?.rowOptions?.collapse ? (
                                        <TableCell
                                            className={clsx(
                                                classes.iconCell,
                                                selected === row
                                                    ? classes.cellWithNoBorder
                                                    : 'none',
                                                selected === row && !borderLeft
                                                    ? classes.selectedParentRow
                                                    : 'none'
                                            )}
                                        >
                                            <IconButton
                                                aria-label="expand row"
                                                size="small"
                                                onClick={() => handleClick(row)}
                                            >
                                                {selected === row ? (
                                                    <KeyboardArrowDownIcon
                                                        className={classes.arrowDownIcon}
                                                    />
                                                ) : (
                                                    <ChevronRightIcon
                                                        className={classes.rightIcon}
                                                    />
                                                )}
                                            </IconButton>
                                        </TableCell>
                                    ) : (
                                        <TableCell
                                            className={clsx(
                                                classes.iconCell,
                                                selected === row
                                                    ? classes.cellWithNoBorder
                                                    : 'none',
                                                selected === row && !borderLeft
                                                    ? classes.selectedParentRow
                                                    : 'none'
                                            )}
                                        >
                                            <IconButton
                                                aria-label="expand row"
                                                size="small"
                                                className={classes.cellWithOutIcon}
                                            >
                                                <ChevronRightIcon className={classes.rightIcon} />
                                            </IconButton>
                                        </TableCell>
                                    )
                                ) : null}
                                {row?.rowData.map((data, index) => (
                                    <TableCell
                                        key={`${data.value}${index}`}
                                        className={clsx(
                                            classes.contentCell,
                                            selected === row
                                                ? `${classes.cellWithNoBorder} ${classes.headCellBold}`
                                                : 'none',
                                            selected === row && !borderLeft
                                                ? classes.selectedParentRow
                                                : 'none',
                                            collapse && classes.nestedContentCell
                                        )}
                                        align={typeof data.value === 'number' ? 'right' : 'left'}
                                    >
                                        <span
                                            className={
                                                hightLightText(data.value)
                                                    ? classes.hightlightText
                                                    : ''
                                            }
                                        >
                                            {data.value}
                                        </span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ) : null}
                        {row?.rowOptions?.collapse ? (
                            <TableRow>
                                <TableCell
                                    colSpan={tableHeaders.length + 1}
                                    className={clsx(
                                        classes.childCell,
                                        selected === row && !borderLeft
                                            ? classes.initialChild
                                            : 'none',
                                        selected === row && tableData.length - 1 == i && borderLeft
                                            ? classes.lastChild
                                            : 'none'
                                    )}
                                >
                                    <Collapse
                                        in={selected === row || (filterData(row) && search.length)}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <RenderTable
                                            tableHeaders={row?.collapsableTableData?.tableHeaders}
                                            classes={classes}
                                            parentHeadersLength={parentHeadersLength}
                                            tableData={row?.collapsableTableData?.tableData}
                                            type={type}
                                            borderLeft={true}
                                            collapse={true}
                                            search={search}
                                        />
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        ) : null}
                    </>
                ))}
            </TableBody>
        </Table>
    );
};

const CodxTable = ({ params, classes, search }) => {
    const parentHeadersLength = params.tableHeaders.length;
    return (
        <TableContainer>
            <RenderTable
                tableHeaders={params.tableHeaders}
                classes={classes}
                parentHeadersLength={parentHeadersLength}
                tableData={params.tableData}
                type={params.type}
                search={search}
            />
        </TableContainer>
    );
};

export default withStyles(codxTableStyle)(CodxTable);
