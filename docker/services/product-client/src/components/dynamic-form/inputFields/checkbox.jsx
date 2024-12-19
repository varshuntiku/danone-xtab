import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
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
        fontSize: theme.layoutSpacing(14),
        letterSpacing: theme.layoutSpacing(0.35),
        fontWeight: '500',
        color: `${theme.palette.text.default} !important`
    },
    helperTextFont: {
        fontSize: '1.2rem'
    },
    font1: {
        fontSize: theme.layoutSpacing(14),
        letterSpacing: theme.layoutSpacing(0.35),
        fontWeight: '500',
        fontFamily: theme.title.h1.fontFamily
    },
    iconSize: {
        '& svg': {
            width: '2rem',
            height: '2rem'
        }
    }
}));

export default function CustomCheckbox({ onChange, params }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(params.value);

    const handleChange = (event) => {
        const newValue = event.target.checked;
        setValue(newValue);
        onChange(newValue);
    };

    return (
        <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormControlLabel
                    control={
                        <Checkbox
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
