import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    formControl: {
        // margin: theme.spacing(3),
    },
    defaultColor: {
        color: theme.palette.text.default
    },
    label: {
        fontSize: '1.6rem',
        color: `${theme.palette.text.default} !important`
    },
    helperTextFont: {
        fontSize: '1.2rem'
    },
    font1: {
        fontSize: '1.6rem'
    },
    iconSize: {
        '& svg': {
            width: '2rem',
            height: '2rem'
        }
    },
    formGroupRoot: {
        paddingLeft: '1.5rem'
    }
}));

export default function CheckboxesGroup({ onChange, params }) {
    const classes = useStyles();
    const [state, setState] = React.useState(params.value || {});

    const handleChange = (event) => {
        let newState = {};
        if (params.multiple) {
            newState = { ...state, [event.target.name]: event.target.checked };
        } else {
            newState = { [event.target.name]: event.target.checked };
        }
        setState(newState);
        onChange(newState);
    };

    return (
        <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend" className={clsx(classes.defaultColor, classes.label)}>
                    {params?.label}
                </FormLabel>
                <FormGroup className={classes.formGroupRoot}>
                    {params?.options?.map((el) => (
                        <FormControlLabel
                            key={el.name + state[el.name]}
                            control={
                                <Checkbox
                                    checked={state[el.name]}
                                    onChange={handleChange}
                                    name={el.name}
                                    className={classes.iconSize}
                                />
                            }
                            classes={{
                                label: clsx(classes.defaultColor, classes.font1)
                            }}
                            label={el.label}
                        />
                    ))}
                </FormGroup>
                <FormHelperText className={clsx(classes.helperTextFont, classes.defaultColor)}>
                    {params?.helperText}
                </FormHelperText>
            </FormControl>
        </div>
    );
}
