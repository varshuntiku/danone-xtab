import React from 'react';
import { IconButton } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

function ManageDsApplications(props) {
    const { dsAppConfig, row } = props;
    const { setProjectDetailsState } = dsAppConfig;
    return (
        <IconButton
            key={1}
            title="Manage Application"
            onClick={() => {
                setProjectDetailsState((prevState) => ({
                    ...prevState,
                    showAppAdmin: true,
                    selectedRow: row
                }));
            }}
            aria-label="Edit"
        >
            <EditOutlinedIcon fontSize="large" />
        </IconButton>
    );
}

export default ManageDsApplications;
