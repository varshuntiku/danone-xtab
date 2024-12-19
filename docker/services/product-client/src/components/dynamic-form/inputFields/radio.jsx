import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    inline: {
        display: 'inline-flex'
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
    }
}));

export default function CustomRadio({ onChange, params }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(params.value);

    const handleChange = (event) => {
        const newValue = event.target.checked;
        setValue(newValue);
        onChange(newValue);
    };

    return (
        <div className={clsx(classes.root, { [classes.inline]: params?.inline })}>
            <FormControl component="fieldset">
                <FormControlLabel
                    control={
                        <Radio
                            checked={value}
                            onChange={handleChange}
                            name={params.name}
                            className={classes.iconSize}
                            disabled={params.disabled}
                        />
                    }
                    classes={{
                        label: clsx(classes.defaultColor, classes.font1)
                    }}
                    label={params?.label}
                />
                <FormHelperText className={clsx(classes.helperTextFont, classes.defaultColor)}>
                    {params?.helperText}
                </FormHelperText>
            </FormControl>
        </div>
    );
}
