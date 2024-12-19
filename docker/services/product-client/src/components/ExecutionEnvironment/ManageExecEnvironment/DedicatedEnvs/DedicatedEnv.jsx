import React from 'react';
import ExecEnvFormConfiguration from '../ExecEnvFormConfiuration';
import { DedicatedEnvActions, DedicatedEnvContents } from './DedicatedEnvConfiguration';

function DedicatedEnv(props) {
    const { classes, createEnvironment } = props;
    return (
        <React.Fragment>
            <ExecEnvFormConfiguration classes={classes} props={props} />
            <DedicatedEnvContents classes={classes} />
            <DedicatedEnvActions classes={classes} createEnvironment={createEnvironment} />
        </React.Fragment>
    );
}

export default DedicatedEnv;
