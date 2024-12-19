import React from 'react';
import { withStyles, TextField, InputAdornment, IconButton, Tooltip } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import passwordStyles from './styles';
import ErrorIcon from '../ErrorIcon';

const PasswordInput = ({
    value,
    visibility,
    onChange,
    onFocus,
    handleVisibility,
    classes,
    inputProps,
    onBlur,
    touched,
    inputErrors = {}
}) => {
    const setVisibility = () => {
        handleVisibility(!visibility);
    };
    const passwordVal = inputProps.ref?.current?.value;
    const { password } = inputErrors;
    return (
        <>
            {touched?.password || passwordVal?.length ? (
                <label className={classes.label}>Password</label>
            ) : null}
            <TextField
                id="password"
                placeholder={touched?.password ? '' : 'Password'}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                type={visibility ? 'text' : 'password'}
                inputProps={inputProps}
                InputProps={{
                    classes: {
                        underline: !password ? classes.underline : classes.errorUnderline,
                        input: classes.input
                    },
                    endAdornment: !password ? (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="password"
                                className={classes.icon}
                                onClick={setVisibility}
                            >
                                {visibility ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ) : (
                        <Tooltip
                            title={password}
                            placement="top-end"
                            arrow
                            classes={{ tooltip: classes.toolTipStyle, arrow: classes.arrowStyle }}
                        >
                            <InputAdornment position="end">
                                <IconButton className={classes.icon}>
                                    <ErrorIcon />
                                </IconButton>
                            </InputAdornment>
                        </Tooltip>
                    )
                }}
                fullWidth
            />
        </>
    );
};

export default withStyles(passwordStyles, { withTheme: true })(PasswordInput);
