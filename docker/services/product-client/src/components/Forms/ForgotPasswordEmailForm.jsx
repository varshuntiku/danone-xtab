import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import forgotPasswordFormStyle from 'assets/jss/forgotPasswordFormStyle';
import { createVerificationCode } from '../../services/passwordManager';
import TextInput from '../dynamic-form/inputFields/textInput';

const useStyles = makeStyles(forgotPasswordFormStyle);

const isEmail = (email) => email && email.match(/^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/g);

const ForgotPasswordEmailForm = ({ gotoNextScreen }) => {
    const classes = useStyles();
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const sendVerificationCode = useCallback(
        async (e) => {
            e.preventDefault();
            let userId;
            setError(() => null);
            if (!isEmail(email)) {
                setError({ message: 'Please provide a valid email!' });
                return;
            }
            setLoading(() => true);
            try {
                const response = await createVerificationCode({ email });
                userId = response.headers.userid;
            } catch (error) {
                const message =
                    error?.response?.data?.message ||
                    'Cannot send verification code. Try again later.';
                setError({ message });
                if (!error?.response?.data?.attempt) setLoading(() => false);
                return;
            }
            setLoading(() => false);
            gotoNextScreen({ userId, email });
        },
        [email]
    );

    const fieldInfo = {
        autoFocus: true,
        value: email,
        InputProps: {
            classes: {
                underline: classes.underline,
                input: classes.input
            }
        },
        inputProps: {
            'aria-label': 'email'
        },
        placeholder: 'example@domain.com',
        fullWidth: true,
        margin: 'normal',
        variant: 'filled',
        disabled: loading
    };

    return (
        <form onSubmit={sendVerificationCode} className={classes.container}>
            <div className={classes.formHeader}>
                <Typography variant="h4">Forgot Password</Typography>
            </div>
            <div className={classes.formBody}>
                <Typography variant="h5" className={classes.message}>
                    Please enter your email address. We will send you an email to reset your
                    password.
                </Typography>
                <Typography variant="h5" className={classes.message}>
                    <i>
                        <b>Note:</b> You can have maximum of 5 attempts to generate verification
                        code in a day.
                    </i>
                </Typography>
                <Typography variant="h5">Enter email address</Typography>
                <TextInput fieldInfo={fieldInfo} onChange={setEmail} />
                {!!(error && error.message) && (
                    <Typography variant="h6" className={classes.errorText}>
                        {error.message}
                    </Typography>
                )}
                <Button
                    disabled={!isEmail(email) || loading}
                    variant="contained"
                    type="submit"
                    className={classes.actionButton}
                    onClick={sendVerificationCode}
                    fullWidth
                    aria-label="Send verification code"
                >
                    Send verification code
                </Button>
            </div>
        </form>
    );
};

export default ForgotPasswordEmailForm;
