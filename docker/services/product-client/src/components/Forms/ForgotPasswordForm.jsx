import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import updatePasswordFormStyle from '../../assets/jss/updatePasswordFormStyle';
import { updatePassword } from '../../services/passwordManager';
import { CustomDialog } from '../custom/CustomDialog';
import CustomSnackbar from '../CustomSnackbar';
import PasswordInput from '../dynamic-form/inputFields/PasswordInput';
import Timer from '../misc/Timer';

const useStyles = makeStyles(updatePasswordFormStyle);

function ForgotPasswordForm(props) {
    const classes = useStyles();

    const [values, setValues] = useState({
        newPassword: '',
        confirmPassword: '',
        showNewPassword: false,
        showConfirmPassword: false,
        validationError: false,
        validateErrorFor: [],
        validationMessage: '',
        status: false,
        error_message: false,
        disableButton: true
    });

    const [timeOver, setTimeOver] = useState(false);

    const [snackbar, setSnackbarState] = useState({
        open: false
    });

    function handleChange(name, value) {
        const [disableButton, errorMessage, errorMessageFor] = validateFields(name, value);
        const [lengthvValidationResult, errorFor] = validatePasswordLength(name, value);
        if (lengthvValidationResult)
            setValues({
                ...values,
                [name]: value,
                validationError: disableButton,
                validateErrorFor: errorMessageFor,
                validationMessage: errorMessage,
                disableButton: disableButton
            });
        else
            setValues({
                ...values,
                [name]: value,
                validationError: true,
                validateErrorFor: [errorFor],
                validationMessage: 'Password should have 4 or more characters',
                disableButton: !lengthvValidationResult
            });
    }

    function validatePasswordLength(name, value) {
        if (name === 'newPassword') {
            if (value.length < 4) {
                return [false, 'newPassword'];
            } else {
                return [true, ''];
            }
        }
        return [true, ''];
    }

    function validateFields(name, value) {
        switch (name) {
            case 'newPassword':
                if (values.confirmPassword === value && values.confirmPassword) {
                    return [false, '', []];
                } else if (values.confirmPassword !== value && values.confirmPassword) {
                    return [
                        true,
                        'New and confirm password do not match',
                        ['newPassword', 'confirmPassword']
                    ];
                }
                return [true, '', []];
            case 'confirmPassword':
                if (values.newPassword !== value && values.newPassword) {
                    return [
                        true,
                        'New and confirm password do not match',
                        ['newPassword', 'confirmPassword']
                    ];
                } else if (values.newPassword.length < 4) {
                    return [true, 'Password should have 4 or more characters', ['newPassword']];
                } else if (values.newPassword === value && values.newPassword) {
                    return [false, '', []];
                }
                return [true, '', []];
            default:
                return [true, 'Could not validate input.', ['newPassword', 'confirmPassword']];
        }
    }

    const timerOver = () => {
        setTimeOver(true);
    };

    const onClickUpdate = async () => {
        if (values.newPassword === '' || values.confirmPassword === '') {
            setValues({
                ...values,
                validationError: true,
                validationMessage: 'Password field cannot be empty'
            });
        } else if (values.newPassword.length < 4 || values.confirmPassword.length < 4) {
            setValues({
                ...values,
                validationError: true,
                validationMessage: 'Password should have 4 or more characters'
            });
        } else if (values.newPassword === values.confirmPassword) {
            setValues({ ...values, disableButton: true });
            const { status, data } = await updatePassword({
                email: props.email,
                password: values.newPassword,
                confirm_password: values.confirmPassword
            });
            if (status) {
                setSnackbarState({
                    open: true,
                    message: data.message,
                    severity: 'success'
                });
                localStorage.removeItem('forgotPasswordToken');
                setTimeout(() => {
                    props.history.push('/');
                }, 3000);
            } else {
                setSnackbarState({
                    open: true,
                    message: data.message ? data.message : data.error,
                    severity: 'error'
                });
                setValues({ ...values, disableButton: false });
            }
        } else {
            setValues({
                ...values,
                validationError: true,
                validationMessage: 'Passwords do not match'
            });
        }
    };

    return (
        <>
            <div className={classes.formContainer}>
                <Typography className={classes.formTitle} variant="h3">
                    Reset Password
                </Typography>
                <div className={classes.formBody}>
                    <Typography className={classes.message} variant="h5">
                        Set new password for <b>{props.email}</b>
                    </Typography>
                    <Typography variant="h5" className={classes.message}>
                        This page will timeout after:{' '}
                        <Timer minutes={5} seconds={0} onFinish={timerOver} /> minutes
                    </Typography>
                    <PasswordInput
                        fieldInfo={{
                            variant: 'filled',
                            fullWidth: true,
                            name: 'newPassword',
                            placeholder: 'Enter New Password',
                            value: '',
                            error: values.validateErrorFor.includes('newPassword'),
                            message:
                                values.validateErrorFor.includes('newPassword') &&
                                !values.validateErrorFor.includes('confirmPassword') &&
                                values.validationMessage
                        }}
                        setValue={handleChange}
                    />
                    <PasswordInput
                        fieldInfo={{
                            variant: 'filled',
                            fullWidth: true,
                            name: 'confirmPassword',
                            placeholder: 'Confirm New Password',
                            value: '',
                            error: values.validateErrorFor.includes('confirmPassword'),
                            message:
                                values.validateErrorFor.includes('confirmPassword') &&
                                values.validationMessage
                        }}
                        setValue={handleChange}
                    />
                    <Button
                        disabled={values.disableButton}
                        variant="contained"
                        fullWidth
                        className={classes.actionButton}
                        onClick={onClickUpdate}
                        aria-label="Reset Password"
                    >
                        Reset Password
                    </Button>
                    <CustomDialog
                        title="Session timed out"
                        subtitle="Looks like you were away for 5 mins. Clicking on OK will redirect you to the Login screen."
                        isOpen={timeOver}
                        handleClose={() => {
                            props.history.push('/');
                        }}
                    />
                </div>
            </div>
            <CustomSnackbar
                message={snackbar.message}
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => {
                    setSnackbarState({
                        open: false
                    });
                }}
                severity={snackbar.severity}
            />
        </>
    );
}

export default withRouter(ForgotPasswordForm);
