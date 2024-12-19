import React, { useCallback, useEffect, useState } from 'react';
import { Box, Breadcrumbs, Container, Link, makeStyles } from '@material-ui/core';
import Typography from 'components/elements/typography/typography';
import ModelStepper from 'components/llmWorkbench/ModelStepper';
import { resetActiveFinetunedModel } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import CodxCircularLoader from 'components/CodxCircularLoader';
import { createFineTunedModel } from 'services/llmWorkbench/llm-workbench';
import ModelConfig from 'components/llmWorkbench/finetune/ModelConfig';
import UploadData from 'components/llmWorkbench/finetune/UploadData';
import InfraConfig from 'components/llmWorkbench/finetune/InfraConfig';
import Review from 'components/llmWorkbench/finetune/Review';

const STEPS = ['Model Config', 'Upload Data', 'Infra Config', 'Finish & Review'];

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
        maxHeight: '100vh',
        flex: 1
    },
    breadcrumb: {
        color: theme.palette.text.titleText,
        fontSize: '1.4rem'
    },
    breadcrumbActive: {
        fontWeight: 'bold !important',
        color: theme.palette.text.contrastText,
        fontSize: '1.4rem'
    },
    wrapper: {
        maxHeight: `calc(100% - ${theme.spacing(30)})`,
        overflowY: 'scroll',
        [theme.breakpoints.down(theme.breakpoints.values.desktop_sm)]: {
            maxHeight: `calc(100% - ${theme.spacing(38)})`
        }
    }
}));

const CreateFineTune = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {
        fineTunedModel: { activeModel }
    } = useSelector((state) => state.llmWorkbench);
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    let action;

    useEffect(() => {
        setStep(0);
        return () => {
            dispatch(resetActiveFinetunedModel());
        };
    }, []);

    const submit = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await createFineTunedModel(activeModel);
            props.history.push(`/llmworkbench/finetunedmodels/${data.id}/status`, { model: data });
        } catch (error) {
            //
        } finally {
            setLoading(false);
        }
    }, [activeModel, loading]);

    const reconfigure = () => {
        setStep(0);
    };

    if (step === 3) {
        action = { reconfigure };
    } else {
        action = {};
    }

    return (
        <Container maxWidth="100%" className={classes.container}>
            <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumb}>
                <Link className={classes.breadcrumb} href="/llmworkbench">
                    LLM Workbench
                </Link>
                <Link className={classes.breadcrumb} href="/llmworkbench/finetunedmodels">
                    Finetune for usecase
                </Link>
                <Typography className={classes.breadcrumbActive}>Create</Typography>
            </Breadcrumbs>
            <ModelStepper steps={STEPS} setStep={setStep} activeStep={step} />
            <Box display="flex" flex={1} className={classes.wrapper}>
                <Step
                    step={step}
                    setStep={setStep}
                    action={action}
                    submit={submit}
                    loading={loading}
                    {...props}
                />
            </Box>
        </Container>
    );
};

const Step = ({ step, setStep, submit, loading, ...props }) => {
    switch (step) {
        case 0: {
            return (
                <ModelConfig
                    action={{
                        next: () => setStep((step) => step + 1),
                        previous: () => {
                            props.history.push('/llmworkbench/finetunedmodels');
                        }
                    }}
                />
            );
        }
        case 1: {
            return (
                <UploadData
                    action={{
                        next: () => setStep((step) => step + 1),
                        previous: () => setStep((step) => step - 1),
                        cancel: () => {
                            props.history.push('/llmworkbench/finetunedmodels');
                        }
                    }}
                />
            );
        }
        case 2: {
            return (
                <InfraConfig
                    loading={loading}
                    action={{
                        next: () => setStep((step) => step + 1),
                        previous: () => setStep((step) => step - 1),
                        cancel: () => {
                            props.history.push('/llmworkbench/finetunedmodels');
                        }
                    }}
                />
            );
        }
        case 3: {
            return (
                <Review
                    loading={loading}
                    action={{
                        next: submit,
                        previous: () => setStep((step) => step - 1),
                        reconfigure: props.action.reconfigure,
                        cancel: () => {
                            props.history.push('/llmworkbench/finetunedmodels');
                        }
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

export default CreateFineTune;
