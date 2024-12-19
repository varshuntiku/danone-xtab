import React, { useContext, useRef, useState } from 'react';
import { Link, Typography, withStyles } from '@material-ui/core';
import GlowingButton from 'components/elements/glowing-button/glowing-button';
import EmailInput from 'components/elements/input/email/email-input';
import PasswordInput from 'components/elements/input/password/password-input';
import loginStyle from './styles';
import LoginContext from 'context/login-context';

import { login } from 'services/auth.js';

const EmailLoginForm = ({ classes }) => {
    const loginContext = useContext(LoginContext);
    const [visibility, setVisibility] = useState(false);
    const [loginButtonDisabled, setLoginButtonDisabled] = useState(true);
    const [error, setError] = useState(null);
    const [touched, setTouched] = useState({ email: false, password: false });
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const isEmail = (email) => email && email.match(/^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/g);

    const validateFields = () => {
        setError(null);
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        if (email && password) {
            if (isEmail(email)) {
                setLoginButtonDisabled(false);
            } else {
                setError('Please enter a valid Email');
                setLoginButtonDisabled(true);
            }
        } else {
            if (!isEmail(email) && touched.email) {
                if (!email) {
                    setError('Email is required');
                } else {
                    setError('Please enter a valid Email');
                }
            } else if (!password && touched.password) {
                setError('Password is required');
            }
            setLoginButtonDisabled(true);
        }
    };

    const onClickLogin = () => {
        setError(null);
        login({
            username: emailRef.current.value,
            password: passwordRef.current.value,
            callback: onResponseLogin
        });
    };

    const onResponseLogin = (response_data) => {
        if (response_data.status && response_data.status === 'error') {
            setError(response_data.message);
        } else {
            localStorage.setItem('local.access.token.key', response_data.access_token);
            localStorage.setItem('local.refresh.token.key', response_data.refresh_token);
            loginContext.onLogin(response_data.is_restricted_user);
            sessionStorage.setItem('last_app_id', '');
        }
    };

    return (
        <div className={classes.container}>
            <div style={{ width: '100%' }}>
                {error ? (
                    <Typography className={classes.errortext} variant="h5">
                        {error}
                    </Typography>
                ) : null}
                <EmailInput
                    id="username"
                    inputProps={{
                        ref: emailRef
                    }}
                    onChange={validateFields}
                    onFocus={() => setTouched((state) => ({ ...state, email: true }))}
                />
            </div>
            <PasswordInput
                id="password"
                visibility={visibility}
                handleVisibility={setVisibility}
                inputProps={{
                    ref: passwordRef
                }}
                onChange={validateFields}
                onFocus={() => setTouched((state) => ({ ...state, password: true }))}
            />
            <div className={classes.linkContainer}>
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
