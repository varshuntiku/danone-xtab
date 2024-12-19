import React from 'react';
import ResetPasswordForm from 'components/Forms/ResetPasswordForm';
import { makeStyles } from '@material-ui/styles';
import NavBar from './NavBar';
import Button from '@material-ui/core/Button';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        height: '100%',
        background: theme.palette.primary.main,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    formWrapper: {
        display: 'flex',
        flexDirection: 'column',
        width: theme.spacing(60),
        gap: theme.spacing(2)
    },
    formContainer: {
        width: '100%',
        border: '1px solid ' + theme.palette.primary.contrastText,
        borderRadius: theme.spacing(0.5),
        overflow: 'hidden',
        background: theme.palette.primary.dark
    },
    navbar: {
        position: 'fixed',
        top: 0,
        width: '100%'
    },
    buttonContainer: {
        width: '100%'
    },
    button: {
        textTransform: 'capitalize',
        color: theme.palette.primary.contrastText,

        '& .MuiSvgIcon-root': {
            color: 'inherit'
        },
        padding: '6px 0px'
    }
}));

const ResetPassword = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.navbar}>
                <NavBar hideProfile is_restricted_user={props.is_restricted_user} />
            </div>
            <div className={classes.formWrapper}>
                <div className={classes.buttonContainer}>
                    <Button
                        className={classes.button}
                        startIcon={<ArrowBackIosRoundedIcon />}
                        onClick={props.history.goBack}
                        aria-label="Back"
                    >
                        <Typography variant="h4">Back</Typography>
                    </Button>
                </div>
                <div className={classes.formContainer}>
                    <ResetPasswordForm />
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
