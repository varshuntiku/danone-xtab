import React, { useContext } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExecutionEnvironmentContext from '../../context/ExecutionEnvironmentContext';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';

function SelectType(props) {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const { updateContext } = execEnvContext;
    const { createNewEnv } = execEnvContext.data;
    const { select_types } = createNewEnv.envTypes.dedicated_env;
    const { classes } = props;

    const handleRadioChange = (e, selectedItem) => {
        select_types.map((item) => {
            if (item.title === selectedItem.title) {
                item.defaultSelect = e.target.value;
            }
            return item;
        });
        updateContext({
            createNewEnv: {
                ...createNewEnv
            }
        });
    };

    return (
        <React.Fragment>
            {select_types.map((item, index) => (
                <React.Fragment key={index}>
                    <div className={classes.selectTypeContainer}>
                        <Typography variant="h4">{item.title}</Typography>
                        <RadioGroup
                            row
                            name={'envGroups'}
                            value={item.defaultSelect}
                            onChange={(e) => handleRadioChange(e, item)}
                        >
                            {item.radioOptions.map((radioItem) => (
                                <FormControlLabel
                                    value={radioItem.value}
                                    key={radioItem.value}
                                    control={<Radio className={classes.radio} />}
                                    classes={{
                                        label: clsx(
                                            classes.radioText,
                                            radioItem.disabled ? classes.disabledRadioText : ''
                                        )
                                    }}
                                    label={radioItem.label}
                                    disabled={radioItem.disabled}
                                />
                            ))}
                        </RadioGroup>
                    </div>
                </React.Fragment>
            ))}
        </React.Fragment>
    );
}

export default SelectType;
