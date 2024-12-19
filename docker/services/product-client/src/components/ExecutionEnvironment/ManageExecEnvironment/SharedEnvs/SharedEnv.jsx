import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import ExecEnvFormConfiguration from '../ExecEnvFormConfiuration';
import ExecutionEnvironmentContext from '../../context/ExecutionEnvironmentContext';

function SharedEnv(props) {
    const { classes, createEnvironment } = props;
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const { createNewEnv } = execEnvContext.data;
    const { envTypes } = createNewEnv;

    return (
        <React.Fragment>
            <ExecEnvFormConfiguration classes={classes} props={props} />
            <Button
                className={[classes.btn, classes.fullWidthBtn, classes.createEnvbtn]}
                variant="contained"
                aria-label="add_update_Environment"
                disabled={envTypes[envTypes.currentEnv].disableCreateEnvBtn}
                onClick={createEnvironment}
            >
                {'Create Environment'}
            </Button>
        </React.Fragment>
    );
}

export default SharedEnv;
