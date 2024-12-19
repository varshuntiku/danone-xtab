import React, { useContext, useRef, useState } from 'react';
import { Link, Typography, withStyles, Checkbox, FormControlLabel } from '@material-ui/core';
import GlowingButton from 'components/elements/glowing-button/glowing-button';
import EmailInput from 'components/elements/input/email/email-input';
import PasswordInput from 'components/elements/input/password/password-input';
import loginStyle from './styles-redesign';
import LoginContext from 'context/login-context';

import { login } from 'services/auth.js';

const EmailLoginForm = ({ classes, setError, error }) => {
    const loginContext = useContext(LoginContext);
    const [visibility, setVisibility] = useState(false);
    const [loginButtonDisabled, setLoginButtonDisabled] = useState(true);
    const [touched, setTouched] = useState({ email: false, password: false });
    const [inputErrors, setInputErrors] = useState({ email: '', passwordError: '' });
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const isEmail = (email) => email && email.match(/^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/g);

    const errorMessages = {
        required: 'This field is required.',
        invalidEmail: 'Please enter a valid email.',
        passwordRequired: 'Password is required.'
    };

    const onFieldChange = () => {
        setError(null);
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        if (email && password) {
            setLoginButtonDisabled(false);
        } else {
            setLoginButtonDisabled(true);
        }
    };

    const onClickLogin = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        if (email && password) {
            if (isEmail(email)) {
                setLoginButtonDisabled(false);
                setError(null);
                setInputErrors({ email: '', password: '' });
                login({
                    username: emailRef.current.value,
                    password: passwordRef.current.value,
                    callback: onResponseLogin
                });
            } else {
                setError('Please enter a valid Email');
                setInputErrors({ ...inputErrors, email: errorMessages.invalidEmail });
                setLoginButtonDisabled(true);
            }
        } else {
            if (!isEmail(email) && touched.email) {
                if (!email) {
                    setError('Email is required');
                    setInputErrors({ ...inputErrors, email: errorMessages.required });
                } else {
                    setError('Please enter a valid Email');
                }
            } else if (!password && touched.password) {
                setError('Password is required');
                setInputErrors({ ...inputErrors, passwordError: errorMessages.passwordRequired });
            }
            setLoginButtonDisabled(true);
        }
    };

    const onResponseLogin = (response_data) => {
        if (response_data.status && response_data.status === 'error') {
            setError(response_data.message);
        } else {
            localStorage.setItem('local.access.token.key', response_data.access_token);
            localStorage.setItem('local.refresh.token.key', response_data.refresh_token);
            localStorage.setItem('local.access.token.exp', response_data.exp);
            loginContext.onLogin(response_data.is_restricted_user);
            sessionStorage.setItem('last_app_id', '');
        }
    };

    return (
        <div className={classes.container}>
            <div style={{ width: '100%' }}>
                <EmailInput
                    id="username"
                    inputProps={{
                        ref: emailRef
                    }}
                    error={error}
                    onChange={onFieldChange}
                    touched={touched}
                    onFocus={() => setTouched((state) => ({ ...state, email: true }))}
                    onBlur={() => setTouched((state) => ({ ...state, email: false }))}
                    inputErrors={inputErrors}
                />
            </div>
            <div style={{ width: '100%' }}>
                <PasswordInput
                    id="password"
                    visibility={visibility}
                    handleVisibility={setVisibility}
                    inputProps={{
                        ref: passwordRef
                    }}
                    error={error}
                    onChange={onFieldChange}
                    onFocus={() => setTouched((state) => ({ ...state, password: true }))}
                    onBlur={() => setTouched((state) => ({ ...state, password: false }))}
                    touched={touched}
                    inputErrors={inputErrors}
                />
            </div>
            <div className={classes.linkContainer}>
                <Typography className={classes.rememberTextContainer} variant="h1">
                    <FormControlLabel
                        control={<Checkbox color="black" className={classes.checkboxIcon} />}
                        label="Remember me"
                        className={`${classes.rememberLabel}`}
                    />
                </Typography>
                <Link href="/forgotpassword" className={classes.forgotText} variant="h5">
                    Forgot Password?
                </Link>
            </div>
            <GlowingButton
                color="default"
                text={'Log In'}
                loginButtonDisabled={loginButtonDisabled}
                onClick={onClickLogin}
            />
        </div>
    );
};

export default withStyles(loginStyle, { withTheme: true })(EmailLoginForm);
