import React, { useEffect, useState } from 'react';
import { Box, Container } from '@material-ui/core';
import ConfigureModel from 'components/llmWorkbench/ConfigureModel';
import AdvanceConfigureModel from 'components/llmWorkbench/AdvanceConfigureModel';
import ModelStepper from 'components/llmWorkbench/ModelStepper';
import UploadDataset from 'components/llmWorkbench/UploadDataset';
import FineTuneScreen from '../../components/llmWorkbench/FineTuneScreen';
import { getFinetunedModelById, resetActiveFinetunedModel } from 'store';
import { useDispatch } from 'react-redux';
import CodxCircularLoader from 'components/CodxCircularLoader';
import PageNotFound from 'components/PageNotFound';
import { debouncedGetBaseModelById } from 'services/llmWorkbench/llm-workbench';

const STEPS = ['Configure Model', 'Upload Data Set', 'Advanced Configuration', 'Fine Tune/ Report'];

const FineTuneModel = (props) => {
    const dispatch = useDispatch();
    const [step, setStep] = useState();
    const [loading, setLoading] = useState(true);
    const [notAllowed, setNotAllowed] = useState(false);
    let action;

    useEffect(() => {
        const loadData = async () => {
            setLoading(() => true);
            const { id } = props.match.params;
            if (!props.isDeployed) {
                const { data } = await debouncedGetBaseModelById(id);
                if (!data?.is_finetunable) {
                    setNotAllowed(true);
                }
                setStep(0);
            } else {
                dispatch(getFinetunedModelById(id));
                setStep(3);
            }
            setLoading(() => false);
        };
        loadData();
        return () => {
            dispatch(resetActiveFinetunedModel());
        };
    }, []);

    if (loading) return null;

    if (notAllowed) return <PageNotFound message="Finetuning is not allowed for this model" />;

    const reconfigure = () => {
        setStep(0);
    };

    if (step === 3) {
        action = { reconfigure };
    } else {
        action = {};
    }

    return (
        <Container
            maxWidth="100%"
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                paddingTop: '2.4rem',
                paddingBottom: '2.4rem',
                height: '100%'
            }}
        >
            <ModelStepper steps={STEPS} activeStep={step} />
            <Box flex={1}>
                <Step step={step} setStep={setStep} action={action} {...props} />
            </Box>
        </Container>
    );
};

const Step = ({ step, setStep, ...props }) => {
    switch (step) {
        case 0: {
            return (
                <ConfigureModel
                    {...props}
                    action={{
                        next: () => setStep((step) => step + 1),
                        previous: () => {
                            props.history.push('/llmworkbench/models');
                        }
                    }}
                />
            );
        }
        case 1: {
            return (
                <UploadDataset
                    {...props}
                    action={{
                        next: () => setStep((step) => step + 1),
                        previous: () => setStep((step) => step - 1)
                    }}
                />
            );
        }
        case 2: {
            return (
                <AdvanceConfigureModel
                    {...props}
                    action={{
                        next: () => setStep((step) => step + 1),
                        previous: () => setStep((step) => step - 1)
                    }}
                />
            );
        }
        case 3: {
            return (
                <FineTuneScreen
                    {...props}
                    action={{
                        next: () => {
                            props.history.push('/llmworkbench/models');
                        },
                        previous: () => setStep((step) => step - 1),
                        reconfigure: props.action.reconfigure
                    }}
                />
            );
        }
        default: {
            return (
                <Container
                    maxWidth="100%"
                    style={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <CodxCircularLoader size={60} />
                </Container>
            );
        }
    }
};

export default FineTuneModel;
