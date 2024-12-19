import React from 'react';
import { withStyles, TextField, InputAdornment, Tooltip } from '@material-ui/core';
import emailStyles from './styles';
import ErrorIcon from '../ErrorIcon';

const EmailInput = ({
    id,
    value,
    onChange,
    onFocus,
    inputProps,
    classes,
    touched,
    onBlur,
    inputErrors = {}
}) => {
    const { email } = inputErrors;
    const emailVal = inputProps.ref?.current?.value;
    return (
        <>
            {touched?.email || emailVal?.length ? (
                <label className={classes.label}>Email ID</label>
            ) : null}
            <TextField
                className={classes.emailField}
                InputProps={{
                    classes: {
                        underline: !email ? classes.underline : classes.errorUnderline,
                        input: classes.input
                    },
                    endAdornment: email ? (
                        <Tooltip
                            title={email}
                            placement="top-end"
                            arrow
                            classes={{ tooltip: classes.toolTipStyle, arrow: classes.arrowStyle }}
                        >
                            <InputAdornment position="end">
                                <div className={classes.icon}>
                                    <ErrorIcon />
                                </div>
                            </InputAdornment>
                        </Tooltip>
                    ) : null
                }}
                inputProps={inputProps}
                id={id}
                placeholder={touched?.email ? '' : 'Email Id'}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                type="email"
                fullWidth
            />
        </>
    );
};

export default withStyles(emailStyles, { withTheme: true })(EmailInput);
