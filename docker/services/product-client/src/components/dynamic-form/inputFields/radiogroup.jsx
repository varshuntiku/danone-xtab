import React , { useEffect } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core';
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
        fontSize: '2rem'
    },
    iconSize: {
        '& svg': {
            width: '2rem',
            height: '2rem'
        }
    },
    radioGroupRoot: {
        paddingLeft: '1.5rem'
    }
}));

export default function RadioButtonsGroup({ onChange, params, ...props }) {
    const [value, setValue] = React.useState(params.value, '');
    const classes = useStyles();

    const handleChange = (event) => {
        setValue(event.target.value);
        onChange(event.target.value);
    };
    useEffect(() => {
        setValue(params?.value);
    }, [params?.value]);
    return (
        <FormControl component="fieldset">
            <FormLabel
                component="legend"
                className={clsx(classes.defaultColor, classes.label, props.className)}
            >
                {params?.label}
            </FormLabel>
            <RadioGroup
                name={params.name}
                value={value}
                onChange={handleChange}
                className={classes.radioGroupRoot}
                row={props?.row}
            >
                {params?.options?.map((el, index) => (
                    <FormControlLabel
                        key={el.name}
                        value={el.name || el.value}
                        control={<Radio id={`radio-${index}`} />}
                        label={el.label}
                        className={classes.iconSize}
                        classes={{
                            label: clsx(classes.defaultColor, classes.font1)
                        }}
                        aria-checked={(el.name || el.value) === value ? 'true' : 'false'}
                        aria-label={el.label}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}
