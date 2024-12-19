import React from 'react';
import {
    ButtonBase,
    Grid,
    Step,
    StepIcon,
    StepLabel,
    Stepper,
    alpha,
    makeStyles
} from '@material-ui/core';
import clsx from 'clsx';

import Typography from 'components/elements/typography/typography';

const useStyles = makeStyles((theme) => ({
    stepper: {
        borderRadius: theme.spacing(0.625),
        background: theme.palette.primary.altDark,
        padding: theme.spacing(2)
    },
    colorContrast: {
        color: theme.palette.primary.contrastText
    },
    colorDefault: {
        color: alpha(theme.palette.primary.contrastText, 0.4)
    },
    letterSpacing1: {
        letterSpacing: '0.02em'
    },
    fontSize1: {
        fontSize: '1.6rem'
    },
    fontSize2: {
        fontSize: '1.4rem'
    },
    fontSize3: {
        fontSize: '1.2rem'
    },
    pale: {
        fontWeight: 100
    },
    iconContainer: {
        '& svg': {
            fontSize: '3rem',
            color: alpha(theme.palette.primary.contrastText, 0.3)
        },
        '& .MuiStepIcon-text': {
            fontSize: '10px',
            fill: theme.palette.primary.dark
        },
        '& .MuiStepIcon-active': {
            color: theme.palette.primary.contrastText,
            '& .MuiStepIcon-text': {
                fill: theme.palette.primary.dark
            },

            '&:host': {
                position: 'absolute',
                content: '""',
                top: 0,
                left: 0,
                transform: 'scale(1.01)',
                background: 'red'
            }
        },
        '& .MuiStepIcon-completed': {
            color: theme.palette.primary.contrastText
        }
    },
    clickable: {
        cursor: 'pointer'
    },
    darkStroke: {
        stroke: theme.palette.primary.dark
    },
    tick: {
        color: theme.palette.primary.dark
    }
}));

const ModelStepper = ({ steps = [], activeStep }) => {
    const classes = useStyles();
    return (
        <Grid container justifyContent="center">
            <Grid item xs={7}>
                <Stepper className={classes.stepper} alternativeLabel activeStep={activeStep}>
                    {steps.map((step, index) => (
                        <Step key={`${step}_${index}`}>
                            <StepLabel
                                classes={{
                                    iconContainer: clsx(classes.iconContainer, classes.clickable)
                                }}
                                StepIconComponent={(p) => (
                                    <ButtonBase focusRipple data-testid={step} aria-label="Stepper">
                                        <StepIconComponent {...p} classes={classes} />
                                    </ButtonBase>
                                )}
                            >
                                <Typography
                                    variant="k10"
                                    className={clsx(
                                        index > activeStep && classes.colorDefault,
                                        classes.fontSize2,
                                        classes.letterSpacing1,
                                        index <= activeStep && classes.colorContrast
                                    )}
                                >
                                    {step}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Grid>
        </Grid>
    );
};

function StepIconComponent({ classes, ...props }) {
    const { active, icon, completed } = props;
    if (!completed) {
        return (
            <svg
                className={clsx(
                    'MuiSvgIcon-root MuiStepIcon-root',
                    active ? ' MuiStepIcon-active' : ''
                )}
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ transform: 'scale(1.2)' }}
            >
                <circle cx="12" cy="12" r="12"></circle>
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="1"
                    className={classes.darkStroke}
                ></circle>
                {completed ? (
                    <path
                        className={classes.tick}
                        d="M 12 0 z m -2 17 l -5 -5 l 1.4 -1.4 l 3.6 3.6 l 7.6 -7.6 L 19 8 l -9 9 z"
                    ></path>
                ) : (
                    <text className="MuiStepIcon-text" x="12" y="16" textAnchor="middle">
                        {icon}
                    </text>
                )}
            </svg>
        );
    }
    return <StepIcon {...props} />;
}

export default ModelStepper;
