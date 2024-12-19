import React, { useCallback, useState } from 'react';
import {
    alpha,
    ButtonBase,
    makeStyles,
    Step,
    StepLabel,
    Stepper,
    Typography
} from '@material-ui/core';
import StepIcon from '@material-ui/core/StepIcon';
import clsx from 'clsx';
import PDFrameworkSubSection from './PDFramewokSubSection';

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
    clickable: {
        cursor: 'pointer'
    },
    darkStroke: {
        stroke: theme.palette.primary.dark
    },
    tick: {
        color: theme.palette.primary.dark
    },
    subSectionHeader: {
        borderBottom: `1px solid ${alpha(theme.palette.text.revamp, 0.15)}`
    },
    stepper: {
        background: 'transparent'
    }
}));

export default function PDFrameworkSection({
    last,
    section,
    completionMap,
    saveProcessing,
    project,
    onSubSectionNext = () => {},
    onNext = () => {},
    onChange = () => {},
    onFinish = () => {}
}) {
    const classes = useStyles();
    const [activeStep, setActiveState] = useState(0);

    const handleNext = () => {
        setActiveState((s) => {
            if (s === section.subSections.length - 1) {
                onNext();
                return s;
            } else {
                onSubSectionNext();
                return s + 1;
            }
        });
    };

    const handleStepClick = useCallback((index) => {
        setActiveState(index);
    }, []);

    return (
        <div
            aria-label="panel container"
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <div aria-label="sub section header container" className={classes.subSectionHeader}>
                <Stepper alternativeLabel activeStep={activeStep} className={classes.stepper}>
                    {section.subSections.map((subSection, index) => {
                        return (
                            <Step
                                key={subSection.title + index}
                                completed={completionMap[subSection.name]}
                            >
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
                                            data-testid={subSection.title}
                                            onClick={() => handleStepClick(index)}
                                            aria-label="Stepper"
                                        >
                                            <StepIconComponent {...p} classes={classes} />
                                        </ButtonBase>
                                    )}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        className={clsx(
                                            index === activeStep || completionMap[subSection.name]
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
            {/* <hr style={{ opacity: 0.2, width: '100%' }} /> */}
            <div aria-label="sub section" style={{ flex: 1 }}>
                {section.subSections.map((subSection, index) => {
                    if (index === activeStep) {
                        return (
                            <PDFrameworkSubSection
                                key={subSection.title}
                                project={project}
                                subSection={subSection}
                                saveProcessing={saveProcessing}
                                onNext={handleNext}
                                onFinish={onFinish}
                                onChange={(e) => {
                                    section.subSections[index] = e;
                                    onChange(section);
                                }}
                                lastSection={last}
                                last={index === section.subSections.length - 1}
                            />
                        );
                    } else {
                        return null;
                    }
                })}
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
