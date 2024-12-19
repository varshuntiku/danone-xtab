import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox
} from '@material-ui/core';
import Inderminate from '@material-ui/icons/IndeterminateCheckBoxOutlined';

const SavedScenarioAppWidgetTable = ({
    classes,
    params,
    setSelectedScenarios,
    selectedScenariostable,
    setselectedScenariostable,
    ...props
}) => {
    const { table_headers, table_data } = params;

    useEffect(() => {
        props.checkBoxChange(selectedScenariostable);
    }, [selectedScenariostable]);

    const handleCheckboxChange = (rowIndex) => {
        const scenarioName = table_data[rowIndex][0];
        const scenarioVersion = table_data[rowIndex][2];
        const scenarioKey = { scenarioName, scenarioVersion };

        setselectedScenariostable((prevSelected) => {
            const existingIndex = prevSelected.findIndex(
                (item) =>
                    item.scenarioName === scenarioKey.scenarioName &&
                    item.scenarioVersion === scenarioKey.scenarioVersion
            );
            if (existingIndex !== -1) {
                return prevSelected.filter(
                    (item) =>
                        item.scenarioName !== scenarioKey.scenarioName ||
                        item.scenarioVersion !== scenarioKey.scenarioVersion
                );
            } else {
                return [...prevSelected, scenarioKey];
            }
        });
        const selectedScenarioName = table_data[rowIndex][0];
        setSelectedScenarios((prevSelected) => {
            if (prevSelected.includes(selectedScenarioName)) {
                return prevSelected.filter((name) => name !== selectedScenarioName);
            } else {
                return [...prevSelected, selectedScenarioName];
            }
        });
    };

    return (
        <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeaderCellIcon}>
                            {' '}
                            <Inderminate className={classes.inderminateIcon} />
                        </TableCell>
                        {table_headers.map((header, headerIndex) => (
                            <TableCell key={headerIndex} className={classes.tableHeaderCell}>
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {table_data.map((row, rowIndex) => {
                        const scenarioKey = {
                            scenarioName: row[0],
                            scenarioVersion: row[2]
                        };
                        return (
                            <TableRow key={rowIndex} className={classes.tableRow}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedScenariostable.some(
                                            (item) =>
                                                item.scenarioName === scenarioKey.scenarioName &&
                                                item.scenarioVersion === scenarioKey.scenarioVersion
                                        )}
                                        onChange={() => handleCheckboxChange(rowIndex)}
                                        color="primary"
                                    />
                                </TableCell>
                                {row.map((cell, cellIndex) => (
                                    <TableCell
                                        key={cellIndex}
                                        className={
                                            table_headers[cellIndex] === 'Actions'
                                                ? classes.actiontableCell
                                                : classes.tableCell
                                        }
                                        onClick={
                                            table_headers[cellIndex] === 'Actions'
                                                ? () => props.handleClick(rowIndex)
                                                : null
                                        }
                                    >
                                        {cell}
                                    </TableCell>
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

SavedScenarioAppWidgetTable.propTypes = {
    classes: PropTypes.object.isRequired,
    params: PropTypes.shape({
        table_headers: PropTypes.arrayOf(PropTypes.string).isRequired,
        table_data: PropTypes.arrayOf(PropTypes.array).isRequired
    }).isRequired
};

export default withStyles(
    (theme) => ({
        tableContainer: {
            maxHeight: 'calc(100% - ' + theme.spacing(2) + ')',
            position: 'relative',
            borderColor: theme.palette.separator.tableContent,
            boxShadow: 'none',
            lineHeight: theme.layoutSpacing(21),
            letterSpacing: theme.layoutSpacing(0.5)
        },

        table: {
            height: '200px',
            color: theme.palette.text.default,
            textAlign: 'left',
            fontSize: theme.layoutSpacing(14),
            lineHeight: theme.layoutSpacing(21),
            letterSpacing: theme.layoutSpacing(0.5),
            padding: theme.layoutSpacing(16),
            '&:hover': {
                backgroundColor: theme.palette.background.tableHover
            }
        },
        tableHeaderCell: {
            backgroundColor: theme.palette.background.tableHeader,
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(16),
            fontFamily: theme.typography.fonts.secondaryFont,
            cursor: 'pointer',
            textAlign: 'left',
            padding: theme.spacing(1),
            lineHeight: theme.layoutSpacing(21),
            letterSpacing: theme.layoutSpacing(0.5)
        },
        tableCell: {
            padding: theme.spacing(1),
            textAlign: 'left',
            borderBottom: '1px solid #EDEBF0',
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(12)
        },
        actiontableCell: {
            padding: theme.spacing(1),
            textAlign: 'left',
            borderBottom: '1px solid #EDEBF0',
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(12),
            cursor: 'pointer'
        },
        inderminateIcon: {
            color: theme.palette.text.default
        },
        tableHeaderCellIcon: {
            backgroundColor: theme.palette.background.tableHeader,
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(16),
            fontFamily: theme.typography.fonts.secondaryFont,
            cursor: 'pointer',
            textAlign: 'left',
            padding: theme.spacing(1),
            lineHeight: theme.layoutSpacing(21),
            letterSpacing: theme.layoutSpacing(0.5),
            paddingLeft: '2.5rem'
        }
    }),
    { useTheme: true }
)(SavedScenarioAppWidgetTable);
