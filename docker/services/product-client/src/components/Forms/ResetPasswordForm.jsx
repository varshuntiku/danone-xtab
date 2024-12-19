import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import updatePasswordFormStyle from '../../assets/jss/updatePasswordFormStyle';
import { resetPassword } from 'services/passwordManager';
import CustomSnackbar from '../CustomSnackbar';
import { withRouter } from 'react-router-dom';
import PasswordInput from '../dynamic-form/inputFields/PasswordInput';

const useStyles = makeStyles(updatePasswordFormStyle);

function ResetPasswordForm(props) {
    const classes = useStyles();

    const [values, setValues] = React.useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        showOldPassword: '',
        showNewPassword: false,
        showConfirmPassword: false,
        validationError: false,
        validateErrorFor: [],
        validationMessage: '',
        disableButton: true
    });

    const [snackbar, setSnackbarState] = React.useState({
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
            case 'oldPassword':
                if (!value) {
                    return [true, 'Current password cannot be empty', ['oldPassword']];
                } else if (
                    values.confirmPassword &&
                    values.newPassword &&
                    values.confirmPassword === values.newPassword
                ) {
                    return [false, '', []];
                } else if (
                    values.confirmPassword &&
                    values.newPassword &&
                    values.confirmPassword !== values.newPassword
                ) {
                    return [true, 'New and confirm password do not match', []];
                }
                return [true, '', []];
            case 'newPassword':
                if (values.confirmPassword === value && values.confirmPassword) {
                    if (!values.oldPassword) {
                        return [true, 'Current password cannot be empty', ['oldPassword']];
                    }
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
                    if (!values.oldPassword) {
                        return [true, 'Current password cannot be empty', ['oldPassword']];
                    }
                    return [false, '', []];
                }
                return [true, '', []];
            default:
                return [
                    true,
                    'Could not validate input.',
                    ['newPassword', 'confirmPassword', 'oldPassword']
                ];
        }
    }

    const onClickUpdate = async () => {
        if (
            values.oldPassword === '' ||
            values.newPassword === '' ||
            values.confirmPassword === ''
        ) {
            setValues({
                ...values,
                validationError: true,
                validationMessage: 'Password fields cannot be empty'
            });
        } else if (values.newPassword.length < 4 || values.confirmPassword.length < 4) {
            setValues({
                ...values,
                validationError: true,
                validationMessage: 'Password should have 4 or more characters'
            });
        } else if (values.newPassword === values.confirmPassword) {
            setValues({ ...values, disableButton: true });
            const { status, data } = await resetPassword({
                password: values.oldPassword,
                new_password: values.newPassword,
                confirm_password: values.confirmPassword
            });
            if (status) {
                setSnackbarState({
                    open: true,
                    message: data.message,
                    severity: 'success'
                });
                setTimeout(() => {
                    props.history.push('/logout');
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
                    Update Password
                </Typography>
                <div className={classes.formBody}>
                    <Typography className={classes.bodyTitle} variant="h4">
                        Change your Password
                    </Typography>
                    <PasswordInput
                        fieldInfo={{
                            variant: 'filled',
                            fullWidth: true,
                            name: 'oldPassword',
                            placeholder: 'Enter Current Password',
                            value: '',
                            error: values.validateErrorFor.includes('oldPassword'),
                            message:
                                values.validateErrorFor.includes('oldPassword') &&
                                values.validationMessage
                        }}
                        setValue={handleChange}
                    />
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
                        onClick={onClickUpdate}
                        aria-label="Change password"
                    >
                        <Typography variant="h4">Change Password</Typography>
                    </Button>
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

export default withRouter(ResetPasswordForm);
