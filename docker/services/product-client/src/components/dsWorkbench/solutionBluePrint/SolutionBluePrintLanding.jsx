import React from 'react';
import { Typography } from '@material-ui/core';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

function SolutionBluePrintLanding({ classes }) {
    return (
        <div className={`${classes.landingContainer} ${classes.gridBg}`}>
            <div className={'addFolderContainer'}>
                <div className="treeIconContainer">
                    <AccountTreeIcon fontSize="large" className={'treeIcon'} />
                </div>
                <Typography variant="h3">
                    {'Click on "Add Folder" to create your first blueprint node.'}
                </Typography>
            </div>
        </div>
    );
}

export default SolutionBluePrintLanding;
