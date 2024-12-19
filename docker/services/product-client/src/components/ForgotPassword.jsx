import React, { useState } from 'react';
import ForgotPasswordEmailForm from 'components/Forms/ForgotPasswordEmailForm';
import ForgotPasswordForm from 'components/Forms/ForgotPasswordForm';
import VerifyCodeForm from 'components/Forms/VerifyCodeForm';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';

const useStyles = makeStyles((theme) => ({
    container: {
        height: '100%',
        background: theme.palette.primary.main,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(2)
    },
    formContainer: {
        width: theme.spacing(60),
        border: '1px solid ' + theme.palette.primary.contrastText,
        borderRadius: theme.spacing(0.5),
        overflow: 'hidden'
    },
    buttonContainer: {
        width: theme.spacing(50)
    },
    button: {
        textTransform: 'capitalize',
        color: theme.palette.primary.contrastText,
        border: 'none',
        background: 'transparent',
        padding: '6px 0px',
        marginLeft: '-35px',
        '& .MuiSvgIcon-root': {
            color: 'inherit'
        },
        '&:hover': {
            border: 'none',
            background: 'transparent'
        }
    },
    label: {
        fontSize: theme.spacing(2.5)
    }
}));

const screens = {
    FORGOT_PASSWORD: ForgotPasswordEmailForm,
    VERIFY_CODE: VerifyCodeForm,
    RESET_PASSWORD: ForgotPasswordForm
};

const stages = Object.keys(screens);

const ForgotPassword = (props) => {
    const classes = useStyles();
    const [stage, setStage] = useState(0);
    const [screenProps, setScreenProps] = useState({});

    const gotoNextScreen = (props = {}) => {
        setScreenProps(props);
        setStage((stage) => stage + 1);
    };

    const Screen = screens[stages[stage]] || null;

    return (
        <div className={classes.container}>
            <div className={classes.buttonContainer}>
                <Button
                    className={classes.button}
                    startIcon={<ArrowBackIosRoundedIcon />}
                    onClick={props.history.goBack}
                    itemProp={{
                        classes: {
                            label: {}
                        }
                    }}
                    aria-label="Back"
                >
                    <span className={classes.label}>Back</span>
                </Button>
            </div>
            <div className={classes.formContainer}>
                <Screen gotoNextScreen={gotoNextScreen} {...screenProps} />
            </div>
        </div>
    );
};

export default ForgotPassword;
