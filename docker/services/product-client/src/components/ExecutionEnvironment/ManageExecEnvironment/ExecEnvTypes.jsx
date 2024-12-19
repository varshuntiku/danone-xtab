import React, { useContext } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExecutionEnvironmentContext from '../context/ExecutionEnvironmentContext';

function ExecEnvTypes(props) {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const { createNewEnv } = execEnvContext.data;
    const { envTypes } = createNewEnv;
    const { shared_env, dedicated_env } = envTypes;
    const { classes } = props;
    const { labelEnd } = props;

    const handleRadioChange = (event) => {
        execEnvContext.updateContext({
            createNewEnv: {
                ...createNewEnv,
                envTypes: {
                    ...envTypes,
                    currentEnv: event.target.value
                }
            }
        });
    };

    return (
        <RadioGroup row name={'envGroups'} value={envTypes.currentEnv} onChange={handleRadioChange}>
            <FormControlLabel
                value={shared_env.value}
                key={shared_env.value}
                control={<Radio className={classes.radio} />}
                classes={{ label: classes.radioText }}
                label={`${shared_env.label} ${labelEnd}`}
            />
            <FormControlLabel
                value={dedicated_env.value}
                key={dedicated_env.value}
                control={<Radio className={classes.radio} />}
                classes={{ label: classes.radioText }}
                label={`${dedicated_env.label} ${labelEnd}`}
                disabled={execEnvContext.data.currentEnvScreen === 'uiac_executor'}
            />
        </RadioGroup>
    );
}

export default ExecEnvTypes;
