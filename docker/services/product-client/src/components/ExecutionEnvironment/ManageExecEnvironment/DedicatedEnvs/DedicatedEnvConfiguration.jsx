import React, { useCallback, useContext } from 'react';
import { Button, Stepper, StepLabel, ButtonBase, Step, Typography } from '@material-ui/core';
import StepIcon from '@material-ui/core/StepIcon';
import clsx from 'clsx';
import ExecutionEnvironmentContext from '../../context/ExecutionEnvironmentContext';
import SelectType from './SelectType';
import ComputeService from './ComputeService';
import Sku from './Sku';

export const DedicatedEnvContents = (props) => {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const createNewEnv = execEnvContext.data.createNewEnv;
    const { activeStep } = createNewEnv;
    const { dedicatedEnvSteps, select_types } = createNewEnv.envTypes.dedicated_env;
    const { classes } = props;
    const { updateContext } = execEnvContext;

    const handleStepClick = useCallback((index) => {
        dedicatedEnvSteps.map((item) => {
            if (item.activeStep === 1 && index === 1) {
                item.title = 'Compute Service';
            } else if (index !== 1 && item.activeStep === 1) {
                item.title = 'Select Service';
            }
            return item;
        });
        updateContext({
            createNewEnv: {
                ...createNewEnv,
                activeStep: index
            }
        });
    }, []);
    const onComputeServiceChange = (fieldInfoId, value) => {
        select_types.map((item) => {
            if (item.id === fieldInfoId) item.defaultSelect = value;
            return item;
        });
        updateContext({
            createNewEnv: {
                ...createNewEnv,
                select_types: [...select_types]
            }
        });
    };

    return (
        <React.Fragment>
            <Stepper alternativeLabel activeStep={activeStep} className={classes.stepper}>
                {dedicatedEnvSteps.map((subSection, index) => {
                    return (
                        <Step key={subSection.title + index} completed={subSection.stepStatus}>
                            <StepLabel
                                classes={{
                                    iconContainer: clsx(classes.iconContainer, classes.clickable)
                                }}
                                StepIconComponent={(p) => (
                                    <ButtonBase
                                        data-testid={subSection.name}
                                        onClick={() => handleStepClick(index)}
                                        aria-label="Stepper"
                                    >
                                        <StepIconComponent {...p} classes={classes} />
                                    </ButtonBase>
                                )}
                            >
                                <Typography
                                    className={clsx(
                                        index === activeStep
                                            ? classes.colorContrast
                                            : classes.colorDefault,
                                        classes.fontSize2,
                                        classes.letterSpacing1
                                    )}
                                >
                                    {subSection.title}
                                </Typography>
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === 0 && <SelectType classes={classes} props={props} />}
            {activeStep === 1 && (
                <ComputeService
                    classes={classes}
                    props={props}
                    onHandleFieldChange={onComputeServiceChange}
                />
            )}
            {activeStep === 2 && (
                <Sku classes={classes} props={props} onHandleFieldChange={onComputeServiceChange} />
            )}
        </React.Fragment>
    );
};

export const DedicatedEnvActions = (props) => {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const { updateContext } = execEnvContext;
    const { createNewEnv } = execEnvContext.data;
    const { activeStep, envTypes } = createNewEnv;
    const { dedicatedEnvSteps } = createNewEnv.envTypes.dedicated_env;
    const { classes, createEnvironment } = props;
    const handleBtnCick = (e) => {
        if (
            e.target.value === 'create environment' ||
            e.target.parentElement?.value === 'create environment'
        ) {
            createEnvironment();
            return false;
        }
        const currentStep = +e.target.getAttribute('activeStep');
        const btnTextvalue = e.target.value;
        let newActiveStep = currentStep;
        if (btnTextvalue === 'next') {
            newActiveStep++;
        } else if (btnTextvalue === 'back') {
            newActiveStep--;
        }

        dedicatedEnvSteps.map((item) => {
            if (item.activeStep === 1 && newActiveStep === 1) {
                item.title = 'Compute Service';
            } else if (newActiveStep !== 1 && item.activeStep === 1) {
                item.title = 'Select Service';
            }
            return item;
        });
        updateContext({
            createNewEnv: {
                ...createNewEnv,
                activeStep: newActiveStep
            }
        });
    };

    return (
        <React.Fragment>
            <div className={classes.createNewEnvBtnContainer}>
                {activeStep !== 0 && (
                    <Button
                        className={[classes.btn, classes.fullWidthBtn]}
                        variant="outlined"
                        aria-label="backBtn"
                        activeStep={activeStep}
                        value={'back'}
                        onClick={(e) => handleBtnCick(e)}
                    >
                        {'Back'}
                    </Button>
                )}
                <Button
                    className={[classes.btn, classes.fullWidthBtn]}
                    variant={activeStep === 2 ? 'contained' : 'outlined'}
                    aria-label="create_nextBtn"
                    activeStep={activeStep}
                    disabled={activeStep === 2 && envTypes[envTypes.currentEnv].disableCreateEnvBtn}
                    value={activeStep === 2 ? 'create environment' : 'next'}
                    onClick={(e) => handleBtnCick(e)}
                >
                    {activeStep === 2 ? 'Create Environment' : 'Next'}
                </Button>
            </div>
        </React.Fragment>
    );
};

function StepIconComponent({ classes, ...props }) {
    const { active, icon, completed } = props; // active, completed, error, icon
    if (active) {
        return (
            <svg
                className={clsx(
                    'MuiSvgIcon-root MuiStepIcon-root MuiStepIcon-active',
                    completed ? ' MuiStepIcon-completed' : ''
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
