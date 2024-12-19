import React, { useContext } from 'react';
import {
    IconButton,
    Typography,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import { StyledTableCell, StyledTableRow } from '../Styles/ExecutionEnvStyles';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import ExecutionEnvironmentContext from '../context/ExecutionEnvironmentContext';

function PackageErrors(props) {
    const { classes } = props;
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const { updateContext } = execEnvContext;
    const execEnvContextData = execEnvContext.data;
    const { errorPackages, packageLists } = execEnvContextData;

    const onErrorFieldChange = (value, pkgName) => {
        const updateErrorPackages = errorPackages.map((item) => {
            if (item.name === pkgName) {
                item.versionValue = value;
            }
            return item;
        });
        updateContext({
            errorPackages: [...updateErrorPackages]
        });
    };

    const onDeleteErrorPackage = (deletedItem) => {
        const updateErrorPackages = errorPackages.filter((item) => {
            return item.name !== deletedItem.name;
        });
        packageLists.map((item) => {
            if (item.name === deletedItem.name) {
                item['isRemoved'] = true;
            }
            return item;
        });

        updateContext({
            errorPackages: [...updateErrorPackages]
        });
    };

    return (
        <React.Fragment>
            <Typography variant="h4">Error In Packages</Typography>
            <Typography variant="h5">Change the error as found to add packages</Typography>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table stickyHeader aria-label="caption table" id="packageTable">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell className={classes.halfWidth}>
                                Package Name
                            </StyledTableCell>
                            <StyledTableCell>Version</StyledTableCell>
                            <StyledTableCell>Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {errorPackages.map((item, index) => {
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>
                                        <Typography variant="h5">
                                            {item.name}
                                            <br />
                                            <span style={{ color: 'red' }}>
                                                Error : {item.message}
                                            </span>
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {item.versionValue && (
                                            <CustomTextField
                                                parent_obj={props}
                                                field_info={{
                                                    id: 'packageErrorDropdown',
                                                    is_select: true,
                                                    fullWidth: true,
                                                    required: true,
                                                    error: false,
                                                    options: item.compatibleVersion,
                                                    value: item.versionValue,
                                                    onChange: (value) => {
                                                        onErrorFieldChange(value, item.name);
                                                    }
                                                }}
                                            />
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <IconButton
                                            key={2}
                                            title="Delete Package"
                                            onClick={() => {
                                                onDeleteErrorPackage(item);
                                            }}
                                        >
                                            <DeleteOutline
                                                fontSize="large"
                                                style={{ color: 'red' }}
                                            />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}

export default PackageErrors;
