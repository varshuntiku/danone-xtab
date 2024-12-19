import React from 'react';
import { StyledTableCell, StyledTableRow } from '../Styles/ExecutionEnvStyles';
import { packageErrors } from 'constants/execution-workbench';
import CompatibleVersionsList from './CompatibleVersionsList';

function ErrorPackages({ row, classes }) {
    return (
        <React.Fragment>
            <StyledTableRow key={row.name} className={classes.errorRow}>
                <StyledTableCell className={classes.errorCell}>
                    Error : {packageErrors[row.error + 'Text']}
                    <p className={classes.compatibleVersionsList_p_tag}>Message : {row.message}</p>
                    {row.error.toLowerCase() === 'not_compatible' && (
                        <CompatibleVersionsList
                            classes={classes}
                            summary={'Compatible Versions'}
                            list={row[packageErrors[row.error]]}
                        />
                    )}
                </StyledTableCell>
            </StyledTableRow>
        </React.Fragment>
    );
}

export default ErrorPackages;
