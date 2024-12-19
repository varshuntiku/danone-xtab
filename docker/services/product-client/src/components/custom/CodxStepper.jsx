import React, { Fragment } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Tooltip from '@material-ui/core/Tooltip';
// import { Grid } from "@material-ui/core";
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    mobileStepRoot: {
        border: '1px solid ' + theme.palette.border.color
    },
    stepIcon: {
        color: 'transparent !important',
        width: '8.3%',
        height: 'auto'
    },
    stepIconActive: {
        backgroundColor: theme.palette.primary.contrastText + ' !important',
        '& .MuiStepIcon-text': {
            fill: theme.palette.text.breadcrumbText
        }
    },
    stepper: {
        paddingRight: '0.5%',
        paddingTop: '0.5%',
        paddingLeft: '0',
        paddingBottom: '0',
        '& .MuiStepConnector-root': {
            display: 'none'
        }
    },
    step: {
        border: '1px solid #315881',
        width: '3.8rem',
        backgroundColor: '#315881',
        marginBottom: '0.2rem',
        paddingTop: '1rem',
        '&:last-child': {
            marginBottom: '0'
        }
    },
    stepText: {
        fill: theme.palette.text.titleText,
        fontSize: '1.5rem'
    },
    mobileStepper: {
        backgroundColor: 'rgba(9, 31, 58, 0.6)',
        justifyContent: 'center',
        fontSize: '1.5rem',
        color: 'transparent',
        border: '1px solid #38628D'
    },
    mobileStepperContentGrid: {
        border: '1px solid #38628D',
        backgroundColor: '#315881',
        display: 'flex',
        flexDirection: 'row'
    },
    mobileStepperContent: {
        padding: '10% 5% 10% 5%',
        color: theme.palette.text.titleText
    },
    mobileStepperButton: {
        minWidth: 'auto',
        border: '1px solid ' + theme.palette.primary.main,
        padding: '0.5rem',
        color: theme.palette.primary.main,
        '& .MuiSvgIcon-root': {
            color: '#6DF0C2'
        },
        backgroundColor: 'rgba(109, 240, 194, 0.05)'
    },
    lastStep: {
        marginRight: '15%',
        fontSize: '1.5rem',
        fontWeight: 700,
        textTransform: 'uppercase'
    },
    arrow: {
        color: theme.palette.primary.dark,
        marginLeft: '-1.4rem !important'
    },
    tooltip: {
        border: '1px solid',
        borderColor: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.dark,
        marginLeft: '0.2rem !important',
        fontSize: '1.5rem',
        color: theme.palette.text.titleText,
        width: '25rem',
        padding: '1.5rem'
    },
    hiddenTooltip: {
        display: 'none'
    }
}));

function CodxVerticalStepper(props) {
    const {
        steps,
        activeStep,
        classes,
        stepContent: children,
        showStepContent,
        orientation,
        stepTooltipContent
    } = props;
    return (
        <Stepper
            nonLinear
            activeStep={activeStep}
            orientation={orientation}
            className={classes.stepper}
        >
            {steps.map((step, index) => (
                <Tooltip
                    title={stepTooltipContent[index]}
                    arrow
                    placement="right-start"
                    key={index}
                    classes={{
                        arrow: step - 1 !== activeStep ? classes.arrow : classes.hiddenTooltip,
                        tooltip: step - 1 !== activeStep ? classes.tooltip : classes.hiddenTooltip
                    }}
                >
                    <Step
                        key={index}
                        className={clsx(
                            classes.step,
                            step - 1 === activeStep && classes.stepIconActive
                        )}
                    >
                        <StepLabel
                            StepIconProps={{
                                classes: {
                                    root: classes.stepIcon,
                                    text: classes.stepText
                                }
                            }}
                        >
                            {showStepContent && children[activeStep].label}
                        </StepLabel>
                        <StepContent>{showStepContent && children[activeStep]}</StepContent>
                    </Step>
                </Tooltip>
            ))}
        </Stepper>
    );
}

function CodxMobileStepper(props) {
    const {
        classes,
        maxSteps,
        activeStep,
        handleNext,
        handleBack,
        /*theme, stepContent: children, */ position,
        variant,
        header,
        content,
        isDisabled
    } = props;
    return (
        <Fragment>
            <MobileStepper
                steps={maxSteps}
                position={position}
                variant={variant}
                activeStep={activeStep}
                nextButton={
                    <Button
                        aria-label="next-stepper"
                        size="large"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1 || isDisabled}
                        className={classes.mobileStepperButton}
                        style={{ marginLeft: '4%' }}
                    >
                        <KeyboardArrowRight />
                    </Button>
                }
                backButton={
                    <Fragment>
                        {activeStep + 1 === maxSteps && header && (
                            <Typography className={classes.lastStep}>{header}</Typography>
                        )}
                        <Button
                            aria-label="prev-stepper"
                            size="large"
                            onClick={handleBack}
                            disabled={activeStep === 0}
                            className={classes.mobileStepperButton}
                            style={{ marginRight: '4%' }}
                        >
                            <KeyboardArrowLeft />
                        </Button>
                    </Fragment>
                }
                className={classes.mobileStepper}
            />
            {content}
        </Fragment>
    );
}

function CodxHybridStepper(props) {
    const {
        classes,
        maxSteps,
        activeStep,
        handleNext,
        handleBack,
        theme,
        stepContent: children,
        position,
        variant,
        header,
        verticalStepper,
        isDisabled
    } = props;
    const content = (
        <div className={classes.mobileStepperContentGrid}>
            <div style={{ width: '5.5rem' }}>
                <CodxVerticalStepper
                    steps={verticalStepper.steps}
                    activeStep={verticalStepper.activeStep}
                    stepContent={verticalStepper.stepContent}
                    stepTooltipContent={verticalStepper.stepTooltipContent}
                    classes={verticalStepper.classes}
                    showStepContent={verticalStepper.showStepContent}
                    orientation={verticalStepper.orientation}
                />
            </div>
            <div style={{ width: 'auto' }}>
                <Typography className={classes.mobileStepperContent}>{children}</Typography>
            </div>
        </div>
    );

    return (
        <Fragment>
            <CodxMobileStepper
                maxSteps={maxSteps}
                activeStep={activeStep}
                classes={classes}
                theme={theme}
                handleNext={handleNext}
                handleBack={handleBack}
                stepContent={children}
                position={position}
                variant={variant}
                header={header}
                isDisabled={isDisabled}
                content={content}
            />
        </Fragment>
    );
}

export default function CodxStepper(props) {
    const classes = useStyles();
    const {
        steps,
        activeStep,
        maxSteps,
        handleNext,
        handleBack,
        stepContent,
        stepTooltipContent,
        showStepContent,
        position,
        variant,
        header,
        isDisabled
    } = props;
    const theme = useTheme();
    return (
        <Fragment>
            {props.category === 'vertical' && (
                <CodxVerticalStepper
                    steps={steps}
                    activeStep={activeStep}
                    stepContent={stepContent}
                    stepTooltipContent={stepTooltipContent}
                    classes={classes}
                    showStepContent={showStepContent}
                    orientation={props.category}
                />
            )}
            {props.category === 'mobile' && (
                <CodxMobileStepper
                    maxSteps={maxSteps}
                    activeStep={activeStep}
                    classes={classes}
                    theme={theme}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    stepContent={stepContent}
                    position={position}
                    variant={variant}
                    header={header}
                />
            )}
            {props.category === 'hybrid' && (
                <CodxHybridStepper
                    maxSteps={maxSteps}
                    activeStep={activeStep}
                    classes={classes}
                    theme={theme}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    stepContent={stepContent}
                    position={position}
                    variant={variant}
                    header={header}
                    isDisabled={isDisabled}
                    verticalStepper={{
                        steps: steps,
                        activeStep: activeStep,
                        stepContent: stepContent,
                        stepTooltipContent: stepTooltipContent,
                        classes: classes,
                        showStepContent: showStepContent,
                        orientation: 'vertical'
                    }}
                />
            )}
        </Fragment>
    );
}

export function ContentText(props) {
    const classes = contentStyles();
    return <Typography className={classes.contentText}>{props.content}</Typography>;
}

export function ContentHeading(props) {
    const classes = contentStyles();
    return (
        <Typography className={props.className ? props.className : classes.heading}>
            {props.heading}
        </Typography>
    );
}

const contentStyles = makeStyles((theme) => ({
    root: {
        marginTop: '5%'
    },
    heading: {
        color: '#EF8911',
        fontSize: '1.5rem'
    },
    subHeading: {
        fontSize: '1.5rem'
    },
    contentText: {
        color: theme.palette.text.titleText,
        fontSize: '1.5rem'
    },
    hrStyle: {
        border: 'none',
        borderTop: '1px dashed #FFFFFF !important',
        opacity: '0.3'
    },
    btn: {
        margin: '5% 0% 5% 0%',
        borderRadius: '10rem'
    }
}));
