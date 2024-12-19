import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Link, Typography } from '@material-ui/core';
import forgotPasswordFormStyle from 'assets/jss/forgotPasswordFormStyle';
import OtpInput from '../dynamic-form/inputFields/OtpInput';
import { createVerificationCode, validateOtp } from '../../services/passwordManager';
import Timer from '../misc/Timer';
import { withRouter } from 'react-router-dom';
import CustomSnackbar from '../CustomSnackbar';

const useStyles = makeStyles(forgotPasswordFormStyle);
const OTP_LENGTH = 6;

const VerifyCodeForm = ({ gotoNextScreen, userId, email }) => {
    const classes = useStyles();
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timeOver, setTimeOver] = useState(false);
    const [resetTimer, setResetTimer] = useState(false);
    const [attempts, setAttempts] = useState(5);
    const [snackbar, setSnackbarState] = useState({
        open: false
    });

    const isEmail = (email) => email && email.match(/^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/g);

    const sendVerificationCode = useCallback(
        async (e) => {
            e.preventDefault();
            setError(() => null);
            if (code.length !== OTP_LENGTH) {
                setError({ message: 'Please provide the verification code!' });
                return;
            }
            setLoading(() => true);
            try {
                const response = await validateOtp({ code, userId });
                const passwordToken = response.headers.password_token;
                localStorage.setItem('forgotPasswordToken', passwordToken);
            } catch (error) {
                let message =
                    error?.response?.data?.message || 'Cannot verify the code. Try again later.';
                if (error?.response?.status === 429) {
                    message = 'Too many requests. Please wait a few minutes before trying again.';
                }
                setError({ message });
                // setLoading(()=> false)
                if (error?.response?.data?.attemptsLeft) {
                    setAttempts(error?.response?.data?.attemptsLeft);
                }
                if (!error?.response?.data?.attempt) {
                    setLoading(() => false);
                } else {
                    setAttempts(0);
                }
                return;
            }
            setLoading(() => false);
            gotoNextScreen({ email });
        },
        [code]
    );

    const timerOver = () => {
        setTimeOver(true);
    };

    const reSendVerificationCode = async () => {
        if (timeOver) {
            setError(() => null);
            if (!isEmail(email)) {
                setError({ message: 'Please provide a valid email!' });
                return;
            }
            setLoading(() => true);
            try {
                const response = await createVerificationCode({ email });
                setSnackbarState({
                    open: true,
                    message: response.data.message,
                    severity: 'success'
                });
                setAttempts(5);
                setResetTimer(true);
                const timeout = setTimeout(() => {
                    setTimeOver(false);
                    setResetTimer(false);
                    clearTimeout(timeout);
                }, 1000);
            } catch (error) {
                const message =
                    error?.response?.data?.message ||
                    'Cannot send verification code. Try again later.';
                if (error?.response?.data?.attempt) {
                    setTimeOver(false);
                }
                setError({ message });
                setLoading(() => false);
                return;
            }
            setLoading(() => false);
        }
    };

    return (
        <div>
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
            <div className={classes.container}>
                <div className={classes.formHeader}>
                    <Typography variant="h4">Verify your code</Typography>
                </div>
                <form onSubmit={sendVerificationCode} className={classes.formBody}>
                    <Typography variant="h5" className={classes.message}>
                        A verification code has been shared to your email. Please provide it to
                        proceed further.
                    </Typography>
                    <Typography variant="h5" className={classes.message}>
                        Verification code sent to <b>{email}</b>
                    </Typography>
                    <Typography variant="h5" className={classes.message}>
                        This page will timeout after:{' '}
                        <Timer minutes={5} resetTimer={resetTimer} onFinish={timerOver} /> minutes
                    </Typography>
                    <Box className={classes.attemptContainer}>
                        <Typography variant="h5">Enter verification code</Typography>
                        <Typography variant="h5">{attempts + ' attempt(s) remaining'}</Typography>
                    </Box>
                    <Box className={classes.otpContainer} aria-label="otp_container" mt={1}>
                        <OtpInput
                            variant="filled"
                            className={classes.inputBox}
                            InputProps={{
                                classes: {
                                    underline: classes.underline,
                                    input: classes.input
                                }
                            }}
                            onChange={(_code) => setCode(() => _code)}
                            length={OTP_LENGTH}
                            disabled={loading}
                        />
                    </Box>
                    {!!(error && error.message) && (
                        <Typography variant="h6" className={classes.errorText}>
                            {error.message}
                        </Typography>
                    )}
                    <Button
                        disabled={code.length !== OTP_LENGTH || loading || timeOver}
                        variant="contained"
                        type="submit"
                        onClick={sendVerificationCode}
                        className={classes.actionButton}
                        fullWidth
                        aria-label="Verify Code"
                    >
                        Verify Code
                    </Button>
                    <Box mt={1}>
                        <Typography variant="h6" align="center">
                            Did not recieve code{' '}
                            <Link
                                component={'button'}
                                className={`${classes.link} ${!timeOver && classes.disabledLink}`}
                                onClick={reSendVerificationCode}
                            >
                                Resend Code?
                            </Link>
                        </Typography>
                    </Box>
                </form>
            </div>
        </div>
    );
};

export default withRouter(VerifyCodeForm);
