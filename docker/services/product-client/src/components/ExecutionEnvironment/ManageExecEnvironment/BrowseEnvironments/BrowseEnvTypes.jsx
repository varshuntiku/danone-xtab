import React, { useContext } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExecutionEnvironmentContext from '../../context/ExecutionEnvironmentContext';

function BrowseEnvTypes(props) {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const { browseEnv } = execEnvContext.data;
    const { envTypes } = browseEnv;
    const { shared_env, dedicated_env, all_env } = envTypes;
    const { classes } = props;

    const handleRadioChange = (event) => {
        execEnvContext.updateContext({
            browseEnv: {
                ...browseEnv,
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
                control={<Radio className={classes.browseEnvRadio} />}
                classes={{ label: classes.browseEnvRadioText }}
                label={`${shared_env.label}`}
            />
            <FormControlLabel
                value={dedicated_env.value}
                key={dedicated_env.value}
                control={<Radio className={classes.browseEnvRadio} />}
                classes={{ label: classes.browseEnvRadioText }}
                label={`${dedicated_env.label}`}
            />

            <FormControlLabel
                value={all_env.value}
                key={all_env.value}
                control={<Radio className={classes.browseEnvRadio} />}
                classes={{ label: classes.browseEnvRadioText }}
                label={all_env.label}
            />
        </RadioGroup>
    );
}

export default BrowseEnvTypes;
