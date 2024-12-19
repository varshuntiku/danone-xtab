import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import loginFormStyle from 'assets/jss/loginFormStyle.jsx';
import { AuthContext } from '../../auth/AuthContext';

class LoginFormSSO extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);

        this.props = props;
    }

    onLoginSSO = () => {
        this.context.login();
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.container}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                        localStorage.setItem('industry', this.props.selected_industry);
                        this.onLoginSSO();
                    }}
                    classes={{
                        root: classes.loginButtonSSO
                    }}
                    aria-label="Login with Microsoft"
                >
                    Login with Microsoft
                </Button>
            </div>
        );
    }
}

LoginFormSSO.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...loginFormStyle(theme)
    }),
    { withTheme: true }
)(LoginFormSSO);
