import React from 'react';
import { StyledTableCell, StyledTableRow } from '../Styles/ExecutionEnvStyles';
import { IconButton } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { DeleteOutline } from '@material-ui/icons';

function PackageList({ row, error_in_name, props, classes }) {
    return (
        <React.Fragment>
            <StyledTableRow key={row.name}>
                <StyledTableCell>{row.name}</StyledTableCell>
                <StyledTableCell>{row.version}</StyledTableCell>
                <StyledTableCell>
                    <IconButton
                        key={1}
                        title="Edit Package"
                        disabled={error_in_name}
                        onClick={() => {
                            props.onEditPackage(row);
                        }}
                    >
                        <EditOutlinedIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                        key={2}
                        title="Delete Package"
                        onClick={() => {
                            props.onDeletePackage(row);
                        }}
                        disabled={error_in_name}
                        className={classes.iconBtn}
                    >
                        <DeleteOutline fontSize="large" style={{ color: 'red' }} />
                    </IconButton>
                </StyledTableCell>
            </StyledTableRow>
        </React.Fragment>
    );
}

export default PackageList;
