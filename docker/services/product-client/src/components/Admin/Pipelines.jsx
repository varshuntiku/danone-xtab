import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton
} from '@material-ui/core';
import { ImportExport, Schedule, FlashOn, CheckCircle } from '@material-ui/icons';

import tableStyle from 'assets/jss/tableStyle.jsx';

class AppAdminPipelines extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            details: {}
        };
    }

    render() {
        const { classes } = this.props;

        return (
            <TableContainer>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableCell}>Name</TableCell>
                            <TableCell className={classes.tableCell}># of Steps</TableCell>
                            <TableCell className={classes.tableCell}>Status</TableCell>
                            <TableCell className={classes.tableCell}>Updated On</TableCell>
                            <TableCell className={classes.tableCell}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow className={classes.tableDataRow}>
                            <TableCell className={classes.tableCell}>Reporting</TableCell>
                            <TableCell className={classes.tableCell}>8</TableCell>
                            <TableCell className={classes.tableCell}>
                                <CheckCircle
                                    className={classes.tableSuccessColor}
                                    fontSize="large"
                                />
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                                5th March 2021, 1:15AM
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                                <IconButton title="Manage API(s)">
                                    <ImportExport fontSize="large" />
                                </IconButton>
                                <IconButton title="Schedule">
                                    <Schedule fontSize="large" />
                                </IconButton>
                                <IconButton title="Trigger">
                                    <FlashOn fontSize="large" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                        <TableRow className={classes.tableDataRow}>
                            <TableCell className={classes.tableCell}>Model Build</TableCell>
                            <TableCell className={classes.tableCell}>1</TableCell>
                            <TableCell className={classes.tableCell}>
                                <CheckCircle
                                    className={classes.tableSuccessColor}
                                    fontSize="large"
                                />
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                                5th March 2021, 2:30AM
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                                <IconButton title="Manage API(s)">
                                    <ImportExport fontSize="large" />
                                </IconButton>
                                <IconButton title="Schedule">
                                    <Schedule fontSize="large" />
                                </IconButton>
                                <IconButton title="Trigger">
                                    <FlashOn fontSize="large" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

AppAdminPipelines.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

export default withStyles((theme) => tableStyle(theme), { withTheme: true })(AppAdminPipelines);
