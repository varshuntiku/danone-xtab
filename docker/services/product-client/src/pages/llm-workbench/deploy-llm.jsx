import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Container, makeStyles } from '@material-ui/core';
import { getDeployedLLMById, resetActiveDeployedModel } from 'store';
import ConfigreModel from 'components/llmWorkbench/ConfigureLLMModel';
import ModelStepper from 'components/llmWorkbench/ModelStepper';
import DeployLLM from 'components/llmWorkbench/DeployLLM';
import CodxCircularLoader from 'components/CodxCircularLoader';
import { useDebouncedEffect } from 'hooks/useDebounceEffect';

const steps = ['Configuration', 'Deployment'];

const useStyles = makeStyles((theme) => ({
    bottom: {
        background: theme.palette.background.modelLight,
        height: '100vh'
    }
}));

const CreateLLMWorkBench = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState();

    useEffect(() => {
        if (!props.isDeployed) {
            setActiveStep(0);
        }
        return () => {
            dispatch(resetActiveDeployedModel());
        };
    }, []);

    useDebouncedEffect(
        () => {
            if (props.isDeployed) {
                const { deployment_id } = props.match.params;
                dispatch(getDeployedLLMById(deployment_id));
                setActiveStep(1);
            }
        },
        [],
        1000
    );

    let section = [];

    switch (activeStep) {
        case 0: {
            section = [
                <ConfigreModel
                    key="config-model"
                    {...props}
                    action={{
                        next: () => {
                            setActiveStep((state) => state + 1);
                        },
                        previous: () => {
                            props.history.push('/llmworkbench/models');
                        }
                    }}
                />
            ];
            break;
        }
        case 1: {
            section = [
                <Container
                    key="deploy-llm"
                    maxWidth="100%"
                    style={{ height: '100%', paddingTop: '1.2rem' }}
                >
                    <DeployLLM
                        action={{
                            next: () => {
                                props.history.push('/llmworkbench/deployments');
                            },
                            previous: () => {
                                setActiveStep((state) => state - 1);
                            }
                        }}
                        {...props}
                    />
                </Container>
            ];
            break;
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

    return (
        <>
            <Container maxWidth="100%" style={{ paddingTop: '1.2rem' }}>
                <ModelStepper steps={steps} activeStep={activeStep} />
            </Container>
            <Container className={classes.bottom}>{section}</Container>
        </>
    );
};

export default CreateLLMWorkBench;
