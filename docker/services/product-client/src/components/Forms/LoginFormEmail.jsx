import React from 'react';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, Link, Typography } from '@material-ui/core';
// import Link from '@material-ui/core/Link';
import loginFormStyle from 'assets/jss/loginFormStyle.jsx';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { login } from 'services/auth.js';

const useStyles = makeStyles(loginFormStyle);

const theme = createTheme({
    overrides: {
        MuiFormLabel: {
            root: {
                // color: '#FFFFFF',

                '&$focused': {
                    // color: "#FFFFFF",
                    fontWeight: 'bold'
                },
                fontSize: '1.5rem',
                fontWeight: 700
            }
        },
        MuiInputBase: {
            root: {
                color: '#707372'
            }
        }
    }
});

export default function LoginFormEmail(props) {
    const classes = useStyles();
    // const preventDefault = (event) => event.preventDefault();
    const [values, setValues] = React.useState({
        username: '',
        password: '',
        showPassword: false,
        status: false,
        error_message: false
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const onClickLogin = () => {
        login({
            username: values.username,
            password: values.password,
            callback: onResponseLogin
        });
    };

    const onResponseLogin = (response_data) => {
        const { parent_obj } = props;

        if (response_data.status && response_data.status === 'error') {
            setValues({
                ...values,
                status: 'error',
                error_message: response_data.message,
                password: ''
            });
        } else {
            localStorage.setItem('local.access.token.key', response_data.access_token);
            localStorage.setItem('local.refresh.token.key', response_data.refresh_token);
            localStorage.setItem('local.access.token.exp', response_data.exp);
            parent_obj.onLogin(response_data.is_restricted_user);
        }
    };

    // var post_login_link = '';
    // if (props.selected_industry) {
    //   post_login_link = "/dashboard/" + props.selected_industry;
    // } else if (props.selected_app_id) {
    //   post_login_link = "/app/" + props.selected_app_id;
    // }

    // const handleMouseDownPassword = (event) => {
    //   event.preventDefault();
    // };
    return (
        <div className={classes.container}>
            <ThemeProvider theme={theme}>
                {values.status && values.status === 'error' ? (
                    <Typography className={classes.errortext} variant="h5">
                        {values.error_message}
                    </Typography>
                ) : (
                    ''
                )}
                <Typography className={classes.mailtext} variant="h5">
                    Enter your email address
                </Typography>
                <TextField
                    className={(classes.margin, classes.textField)}
                    InputProps={{
                        classes: {
                            underline: classes.underline,
                            input: classes.input
                        }
                    }}
                    id="username"
                    placeholder="email.name@domain.com"
                    value={values.username}
                    onChange={handleChange('username')}
                    fullWidth
                />

                <Typography className={classes.mailtext} variant="h5">
                    Password
                </Typography>
                <TextField
                    id="password"
                    placeholder="*********"
                    value={values.password}
                    onChange={handleChange('password')}
                    type={values.showPassword ? 'text' : 'password'}
                    InputProps={{
                        classes: {
                            underline: classes.underline,
                            input: classes.input
                        },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="password"
                                    className={classes.contrast}
                                    onClick={handleClickShowPassword}
                                >
                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    fullWidth
                />
            </ThemeProvider>

            <Link href="/forgotpassword" className={classes.forgotText} variant="h5">
                Forgot Password?
            </Link>

            <Button
                variant="contained"
                id="login"
                fullWidth
                onClick={() => {
                    onClickLogin();
                    // localStorage.setItem("industry", props.selected_industry);
                    // props.history.push(post_login_link);
                }}
                classes={{
                    root: classes.loginButtonEmail
                }}
                aria-label="Login"
            >
                Login
            </Button>
        </div>
    );
}
