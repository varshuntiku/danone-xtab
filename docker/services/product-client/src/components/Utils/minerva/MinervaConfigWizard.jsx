import React, { useCallback, useState } from 'react';
import { ButtonBase, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import MinervaStepperAppOverview from './MinervaStepperAppOverview';
import MinervaStepperAppDataConfig from './MinervaStepperAppDataConfig';
import minervaWizardStyle from './minervaWizardStyle';
import StepIcon from '@material-ui/core/StepIcon';
import CodxCircularLoader from '../../CodxCircularLoader.jsx';
import clsx from 'clsx';

export default function MinervaConfigWizard({
    loader,
    sections,
    appData,
    formOptions,
    createNewAppFlag,
    onFinish,
    appActions
}) {
    const classes = minervaWizardStyle();
    const [activeStep, setActiveState] = useState(0);

    const handleNext = useCallback(() => {
        setActiveState((s) => {
            if (s === sections.length - 1) {
                onFinish();
                return s;
            } else {
                return s + 1;
            }
        });
    }, [sections]);

    const handlePrevious = useCallback(() => {
        setActiveState((s) => {
            if (s === 0) {
                return s;
            } else {
                return s - 1;
            }
        });
    }, [sections]);

    const handleStepClick = useCallback((index) => {
        setActiveState(index);
    }, []);

    return (
        <div
            aria-label="panel container"
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <div aria-label="sub section header container" style={{}}>
                <Stepper alternativeLabel activeStep={activeStep} style={{ paddingBottom: 0 }}>
                    {sections.map((subSection, index) => {
                        return (
                            <Step key={subSection.title + index} completed={subSection.completed}>
                                <StepLabel
                                    classes={{
                                        iconContainer: clsx(
                                            classes.iconContainer,
                                            classes.clickable
                                        )
                                    }}
                                    StepIconComponent={(p) => (
                                        <ButtonBase
                                            focusRipple
                                            onClick={() => handleStepClick(index)}
                                        >
                                            <StepIconComponent {...p} classes={classes} />
                                        </ButtonBase>
                                    )}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        className={clsx(
                                            index === activeStep || subSection.completed
                                                ? classes.colorContrast
                                                : classes.colorDefault,
                                            classes.fontSize2,
                                            classes.letterSpacing1
                                        )}
                                    >
                                        {subSection.title}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        className={clsx(
                                            classes.colorDefault,
                                            classes.letterSpacing1,
                                            classes.fontSize2,
                                            classes.pale
                                        )}
                                    >
                                        {index === activeStep ? subSection.desc : ''}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </div>
            <hr style={{ opacity: 0.2, width: '100%' }} />
            <div
                aria-label="sub section"
                style={{ flex: 1, overflowY: 'clip', display: 'flex', flexDirection: 'column' }}
            >
                {loader === true ? (
                    <CodxCircularLoader center size="90" />
                ) : (
                    sections.map((subSection, index) => {
                        if (index === activeStep) {
                            return (
                                <React.Fragment key={index}>
                                    {subSection.name === 'overview' && (
                                        <MinervaStepperAppOverview
                                            appData={appData}
                                            appActions={appActions}
                                            formOptions={formOptions}
                                            handleNext={handleNext}
                                            handlePrevious={handlePrevious}
                                            createNewAppFlag={createNewAppFlag}
                                        />
                                    )}
                                    {subSection.name === 'dataSource' && (
                                        <MinervaStepperAppDataConfig
                                            appData={appData}
                                            appActions={appActions}
                                            formOptions={formOptions}
                                            handleNext={handleNext}
                                            handlePrevious={handlePrevious}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        } else {
                            return null;
                        }
                    })
                )}
            </div>
        </div>
    );
}

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
