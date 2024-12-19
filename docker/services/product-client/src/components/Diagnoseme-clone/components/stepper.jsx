import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Diagnosis from '../pages/diagnosis';
import Symptoms from '../pages/symptoms/Symptoms';
import MedicalHistory from '../pages/medicalHistory';
import Reports from '../pages/reports';
import { useDispatch, useSelector } from 'react-redux';
import { updateDiagnosisFormData } from '../store/slices/diagnosisFormDataSlice';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(() => ({
    stepIcon: {
        width: '40px',
        height: '40px',
        top: '89px',
        left: '430px',
        border: 'solid 1px',
        borderColor: '#89898b',
        borderRadius: '50%',
        color: 'transparent !important'
    },
    stepIconCompleted: {
        color: ' #e5e5e5 !important'
    },
    stepLabelCompleted: {
        color: '#0000008a !important'
    },
    stepIconActive: {
        backgroundColor: 'rgb(218,235,255) !important'
    },
    stepperLayout: {
        width: '199px',
        height: '84px',
        top: '89px',
        left: '357px'
    },
    stepperHeading: {
        fontSize: '15px',
        fontWeight: '500',
        lineHeight: '18px',
        letterSpacing: '1px'
    },
    stepper: {
        '& .MuiStepConnector-alternativeLabel': {
            top: '20px'
        }
    },
    stepperLabel: {
        '& .MuiStepLabel-completed': {
            color: '#0000008a'
        }
    }
}));

const steps = [
    'Personal Information',
    'Symptoms / Associated Symptoms',
    'Lifestyle / Medical History'
];

export default function StepperForm() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const formData = useSelector((state) => state.formData);
    const [activeStep, setActiveStep] = useState(0);
    const [data, setData] = useState({});

    const handleChange = (step, fieldName, value) => {
        dispatch(updateDiagnosisFormData({ step, fieldName, value }));
    };

    // const handleChange = (step, fieldName, value) => {
    //     setFormData((prevFormData) => ({
    //         ...prevFormData,
    //         [step]: { ...prevFormData[step], [fieldName]: value }
    //     }));
    // };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (activeStep == 2) {
            return;
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const reportData = (reportDataValues) => {
        setData(reportDataValues);
    };

    const getStepComponent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Diagnosis
                        handleNextStep={handleNext}
                        getData={setData}
                        // dataValues={formData?.step1}
                        handleChange={handleChange}
                        activeStep={step}
                        steps={steps}
                    />
                );
            case 1:
                return (
                    <Symptoms
                        handleNextStep={handleNext}
                        handleBackStep={handleBack}
                        getData={setData}
                        // dataValues={formData?.step2}
                        // gender={formData?.step1.gender ? formData?.step1.gender : 'male'}
                        handleChange={handleChange}
                    />
                );
            case 2:
                return (
                    <MedicalHistory
                        handleNextStep={handleNext}
                        handleBackStep={handleBack}
                        getData={reportData}
                        // dataValues={formData}
                        handleChange={handleChange}
                    />
                );
            case 3:
                return <Reports dataValues={data} tempData={formData} />;
            default:
                return 'Unknown step';
        }
    };

    return (
        <React.Fragment data-testid="stepper-form">
            {activeStep < 3 && (
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => {
                        const stepProps = {};
                        const labelProps = {};
                        // const completed = activeStep > index;
                        return (
                            <Step key={label} {...stepProps} className={classes.stepper}>
                                <StepLabel
                                    className={classes.stepperLabel}
                                    StepIconProps={{
                                        classes: {
                                            root: classes.stepIcon,
                                            completed: classes.stepIconCompleted,
                                            active: classes.stepIconActive
                                            // text: classes.stepText
                                        }
                                    }}
                                    {...labelProps}
                                >
                                    <Typography className={classes.stepperHeading} variant="h5">
                                        {label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        );
                    })}
                    <Divider className="siderbar-divider" />
                </Stepper>
            )}
            <div>{getStepComponent(activeStep)}</div>
        </React.Fragment>
    );
}
