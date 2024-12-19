import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { grey } from '@material-ui/core/colors';
import { Switch } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    editToogleButton: {
        '& .Mui-checked .MuiSwitch-thumb': {
            color: theme.palette.primary.contrastText
        },
        '& .MuiSwitch-thumb': {
            color: grey[500]
        },
        '& .MuiTypography-root': {
            fontSize: '1.5rem',
            marginLeft: '1rem'
        }
    }
}));

export default function CustomSwitch({ onChange, params }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(!!params.value);

    const handleChange = (event, v) => {
        const newValue = v;
        setValue(newValue);
        onChange(newValue);
    };

    const val = !!params?.value;
    useEffect(() => {
        setValue(val);
    }, [val]);

    return (
        <div className={`${classes.root} ${params.customSelector}`}>
            <FormControlLabel
                className={classes.editToogleButton}
                control={
                    <Switch
                        size={params.size}
                        checked={value}
                        onChange={handleChange}
                        name={params.name}
                    />
                }
                label={params.label}
            />
        </div>
    );
}
