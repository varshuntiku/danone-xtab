import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, InputAdornment } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import CustomSnackbar from '../../CustomSnackbar';

const useStyles = makeStyles((theme) => ({
    container: {
        background: theme.palette.background.input && theme.palette.background.input
    },
    hideIcon: {
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    inputControl: {
        '& .MuiFormHelperText-root': {
            fontSize: theme.typography.h5.fontSize,
            color: '#f44336'
        }
    },
    input: {
        color: theme.palette.textColor,
        padding: theme.spacing(2),
        fontSize: theme.typography.h5.fontSize,
        borderRadius: '4px 4px 0px 0px'
    },
    underline: {
        '&:before': {
            borderBottom: `1px solid ${theme.palette.textColor}`
        },
        '&:after': {
            borderBottom: `2px solid ${theme.palette.textColor}`
        }
    }
}));

export default function PasswordInput(props) {
    const { setValue, fieldInfo } = props;
    const classes = useStyles();
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(fieldInfo.value);
    const [snackbar, setSnackbarState] = React.useState({
        open: false
    });

    const handleChange = (event) => {
        setInputValue(event.target.value);
        setValue(fieldInfo.name, event.target.value);
    };

    return (
        <>
            <CustomSnackbar
                message={snackbar.message}
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => {
                    setSnackbarState({
                        open: false
                    });
                }}
                severity="error"
            />
            <TextField
                variant={fieldInfo.variant}
                fullWidth={fieldInfo.fullWidth}
                id={fieldInfo.name}
                placeholder={fieldInfo.placeholder}
                defaultValue={inputValue}
                className={classes.inputControl}
                onChange={handleChange}
                onPaste={(e) => {
                    e.preventDefault();
                    setSnackbarState({
                        open: true,
                        message: 'Paste not allowed'
                    });
                    return false;
                }}
                onCopy={(e) => {
                    e.preventDefault();
                    setSnackbarState({
                        open: true,
                        message: 'Copy not allowed'
                    });
                    return false;
                }}
                type={showPassword ? 'text' : 'password'}
                error={fieldInfo.error}
                helperText={fieldInfo.message}
                InputProps={{
                    classes: {
                        adornedEnd: classes.container,
                        input: classes.input,
                        underline: classes.underline
                    },
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={fieldInfo.name}
                                className={classes.hideIcon}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
        </>
    );
}
