import React, { useEffect, useState } from 'react';
import { makeStyles, Tooltip, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    colorContrast: {
        color: theme.palette.primary.contrastText
    },
    colorDefault: {
        color: theme.palette.text.default
    },
    letterSpacing1: {
        letterSpacing: '0.02em'
    },
    fontSize2: {
        fontSize: '1.4rem'
    },
    pale: {
        fontWeight: 100
    },
    iconContainer: {
        borderRadius: '50%',
        border: 'rgba(255, 255, 255, 0.4) solid 1px',
        '& svg': {
            fontSize: '3rem',
            color: theme.palette.primary.main
        },
        '& .MuiStepIcon-text': {
            fontSize: '10px',
            fill: theme.palette.text.default
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
    darkStroke: {
        stroke: theme.palette.primary.dark
    },
    tick: {
        color: theme.palette.primary.dark
    },
    stepperWrapper: {
        padding: '2.8rem'
    },
    container: {
        width: '100%',
        height: theme.layoutSpacing(90),
        display: 'grid',
        paddingTop: theme.layoutSpacing(15),
        gridTemplateColumns: 'repeat(var(--cols),1fr) 30px',
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(16)}`
    },
    stepContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    progressIndicator: {
        display: 'flex',
        alignItems: 'center'
    },
    bottomStepContainer: {
        display: 'flex',
        flexDirection: 'column-reverse',
        position: 'relative',
        paddingTop: theme.layoutSpacing(0),
        '&::before': {
            content: '""',
            position: 'absolute',
            left: '-8%',
            top: '-4px',
            height: '1px',
            width: '114.8%',
            backgroundColor: theme.palette.separator.grey,
            '@media (max-width: 1400px)': {
                width: '116.5%'
            }
        }
    },
    stepPointer: {
        width: theme.layoutSpacing(32),
        height: theme.layoutSpacing(30.5),
        border: '1px solid' + theme.palette.background.nonActiveProgressLine,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    stepNumber: {
        fontSize: theme.layoutSpacing(18),
        fontWeight: 'bold',
        color: theme.palette.background.nonActiveProgressLine
    },
    stepLine: {
        width: '100%',
        height: '4px',
        backgroundColor: theme.palette.background.nonActiveProgressLine,
        margin: '0 5px'
    },
    activeStep: {
        backgroundColor: theme.palette.text.default,
        cursor: 'pointer',
        border: 'none !important'
    },
    validatedStep: {
        cursor: 'pointer'
    },
    currentActiveStep: {
        border: '2px solid' + theme.palette.text.default + '!important',
        color: theme.palette.text.default
    },
    currentActiveStepLine: {
        backgroundColor: theme.palette.background.activeProgressLine
    },
    activeStepNumber: {
        color: theme.palette.background.pureWhite,
        marginTop: theme.layoutSpacing(1.2)
    },
    currentActiveStepNumber: {
        color: theme.palette.text.default
    },
    screenName: {
        fontSize: theme.layoutSpacing(16),
        fontWeight: '400',
        color: theme.palette.background.progressNonActive,
        fontFamily: theme.body.B5.fontFamily,
        marginTop: theme.layoutSpacing(10),
        maxWidth: theme.layoutSpacing(200),
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    activeScreenName: {
        fontSize: theme.layoutSpacing(16),
        fontWeight: '500',
        color: theme.palette.text.default,
        fontFamily: theme.body.B5.fontFamily
    },
    screenDesc: {
        fontSize: theme.layoutSpacing(16),
        fontWeight: '300',
        color: theme.palette.background.progressNonActive,
        fontFamily: theme.body.B5.fontFamily,
        maxWidth: theme.layoutSpacing(200),
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    ativescreenDesc: {
        fontSize: theme.layoutSpacing(16),
        fontWeight: '300',
        color: theme.palette.text.default,
        fontFamily: theme.body.B5.fontFamily,
        maxWidth: theme.layoutSpacing(200),
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    bottomProgress_screenName: {
        display: 'flex',
        gap: theme.layoutSpacing(8),
        alignItems: 'center'
    },
    bottomProgress_stepPointer: {
        width: theme.layoutSpacing(16),
        height: theme.layoutSpacing(16),
        border: '2px solid' + theme.palette.background.progressNonActive,
        borderRadius: '50%'
    },
    bottomProgress_activeStepNumber: {
        color: theme.palette.text.default
    },
    progressContent: {
        paddingBottom: theme.layoutSpacing(5)
    },
    toolTipStyle: {
        padding: '1rem',
        backgroundColor: theme.palette.background.pureWhite,
        position: 'relative',
        ZIndex: 10,
        height: 'fit-content',
        textAlign: 'start',
        fontSize: theme.layoutSpacing(14),
        borderRadius: '0.5rem',
        color: theme.palette.text.default,
        fontWeight: '500',
        letterSpacing: '0.35%',
        lineHeight: '15.23px',
        maxWidth: theme.layoutSpacing(450),
        fontFamily: theme.body.B5.fontFamily,
        boxShadow: '4px 4px 5px 0px rgba(0,0,0,0.1)',
        left: `-${theme.layoutSpacing(0)}`,
        top: `${theme.layoutSpacing(16)}`
    },
    lastStepContent: {
        position: 'absolute',
        right: 0,
        top: theme.layoutSpacing(45),
        width: theme.layoutSpacing(190),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'end',
        paddingRight: theme.layoutSpacing(10)
    },
    lastStepExtraVariantCont: {
        top: theme.layoutSpacing(28)
    },
    lastBottomStepContent: {
        top: '0rem'
    }
}));

function getStepperPointerClass(
    activeStep,
    index,
    design_variant,
    classes,
    ValidateDirectStepperClick
) {
    const isActive = activeStep === index;
    const isCompleted = activeStep > index;

    return `${classes.stepPointer}
                      ${isCompleted ? classes.activeStep : ''}
                      ${design_variant ? classes.bottomProgress_stepPointer : ''}
                      ${isActive ? classes.currentActiveStep : ''}
                      ${ValidateDirectStepperClick(index) ? classes.validatedStep : ''}`;
}

function getStepperNumberClass(activeStep, index, design_variant, classes) {
    const isActive = activeStep === index;
    const isCompleted = activeStep > index;

    return `${classes.stepNumber}
                      ${isCompleted ? classes.activeStepNumber : ''}
                      ${design_variant ? classes.bottomProgress_stepPointer : ''}
                      ${isActive ? classes.currentActiveStepNumber : ''}`;
}

function getScreenNameClasses(activeStep, index, design_variant, classes) {
    const isActiveOrCompleted = activeStep >= index;

    return `${classes.screenName}
            ${isActiveOrCompleted ? classes.activeScreenName : ''}
            ${design_variant ? classes.bottomProgress_screenName : ''}`;
}

export default function ScreenStepper(props) {
    const { steps, activeStep = 0, progress_bar_config, ValidateDirectStepperClick } = props;
    const classes = useStyles();
    const design_variant = progress_bar_config?.variant === 2;
    const bottom = progress_bar_config?.position === 'bottom';
    const [loading, setLoading] = useState(true);

    const handleStepClick = (step, currScreen, NextScreen) => {
        props.handleDirectStepperClick(step, currScreen, NextScreen, step - 1 < activeStep);
    };

    useEffect(() => {
        let timeout = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => {
            clearInterval(timeout);
        };
    }, []);
    return !loading ? (
        <div className={classes.container} style={{ '--cols': steps?.length - 1 }}>
            {steps.map((step, index) => (
                <div
                    key={step.id}
                    className={`${classes.stepContainer} ${
                        bottom ? classes.bottomStepContainer : ''
                    }`}
                >
                    <div className={classes.progressIndicator}>
                        <div
                            className={getStepperPointerClass(
                                activeStep,
                                index,
                                design_variant,
                                classes,
                                ValidateDirectStepperClick
                            )}
                            onClick={() =>
                                handleStepClick(
                                    index,
                                    steps[activeStep]['screen_name'],
                                    steps[index]['screen_name']
                                )
                            }
                        >
                            {!design_variant ? (
                                <span
                                    className={getStepperNumberClass(
                                        activeStep,
                                        index,
                                        design_variant,
                                        classes
                                    )}
                                >
                                    {index + 1}
                                </span>
                            ) : null}
                        </div>
                        {steps.length - 1 !== index ? (
                            <div
                                className={`
                        ${classes.stepLine}
                        ${activeStep > index ? classes.activeStep : ''}
                        ${activeStep === index ? classes.currentActiveStepLine : ''}`}
                            ></div>
                        ) : null}
                    </div>

                    <ProgressContent
                        steps={steps}
                        activeStep={activeStep}
                        index={index}
                        classes={classes}
                        step={step}
                        design_variant={design_variant}
                        bottom={bottom}
                    />
                </div>
            ))}
        </div>
    ) : null;
}

function ProgressContent({ step, index, classes, activeStep, steps, design_variant, bottom }) {
    return (
        <div
            className={`${classes.progressContent}
                 ${steps.length - 1 === index ? classes.lastStepContent : ''}
                 ${design_variant ? classes.lastStepExtraVariantCont : ''}
                 ${bottom ? classes.lastBottomStepContent : ''}
            `}
        >
            <Tooltip
                title={step['screen_name']}
                placement="right-end"
                classes={{ tooltip: classes.toolTipStyle }}
            >
                <Typography
                    className={getScreenNameClasses(activeStep, index, design_variant, classes)}
                >
                    {design_variant ? <span>{index + 1}</span> : null}
                    {step['screen_name']}
                </Typography>
            </Tooltip>

            <Tooltip
                title={step['screen_description']}
                placement="right-end"
                classes={{ tooltip: classes.toolTipStyle }}
            >
                <Typography
                    className={`${
                        activeStep >= index ? classes.ativescreenDesc : classes.screenDesc
                    }`}
                >
                    {step['screen_description']}
                </Typography>
            </Tooltip>
        </div>
    );
}

ScreenStepper.propTypes = {
    steps: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            screen_name: PropTypes.string
        })
    ),
    activeStep: PropTypes.number.isRequired
};
