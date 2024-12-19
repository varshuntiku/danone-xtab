import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Link, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import Typography from 'components/elements/typography/typography';
import UploadBox from 'components/llmWorkbench/UploadBox';
import QualityReportDrawer from 'components/llmWorkbench/QualityReportDrawer';
import { uploadDataset } from 'services/llmWorkbench/llm-workbench';
import { setActiveFinetunedModel } from 'store';

const STEPS = {
    TRAINING: 'TRAINING',
    VALIDATION: 'VALIDATION',
    REPORT: 'REPORT'
};

const useStyles = makeStyles((theme) => ({
    wrapper: {
        background: theme.palette.primary.altDark
    },
    boxWrapper: {
        background: theme.palette.background.tab,
        borderRadius: theme.spacing(0.625)
    },
    disabled: {
        opacity: '0.5'
    },
    downloadBox: {
        padding: theme.spacing(2),
        borderRadius: theme.spacing(0.5),
        border: `${theme.spacing(0.1)} solid ${theme.palette.primary.contrastText}`
    },
    link: {
        color: theme.palette.text.default,
        textDecoration: 'underline'
    }
}));

const UploadDataset = ({ action: { next } }) => {
    const dispatch = useDispatch();
    const {
        fineTunedModel: { activeModel }
    } = useSelector((state) => state.llmWorkbench);
    const classes = useStyles();
    const [step, setStep] = useState(STEPS.TRAINING);
    const [loading, setLoading] = useState(false);
    const [trainingFiles, setTrainingFiles] = useState([]);
    const [validationFiles, setValidationFiles] = useState([]);

    useEffect(() => {
        if (activeModel?.trainingFiles) {
            setTrainingFiles(activeModel.trainingFiles);
        }
        if (activeModel?.validationFiles) {
            setValidationFiles(activeModel.validationFiles);
        }
    }, [activeModel]);

    const loadValidationStep = () => {
        setStep(STEPS.VALIDATION);
    };

    const loadTrainingStep = () => {
        setStep(STEPS.TRAINING);
    };

    const onTrainingDatasetFileChange = async (e) => {
        if (!e.target.files.length) return;
        setTrainingFiles(() => [
            {
                loaded: true,
                uploaded: false,
                uploading: false,
                status: 0,
                file: e.target.files[0]
            }
        ]);
    };

    const onTrainingDatasetFileDrop = (e) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        if (!droppedFiles.length) return;
        const newFiles = Array.from(droppedFiles);
        setTrainingFiles(() => [
            {
                loaded: true,
                uploaded: false,
                uploading: false,
                status: 0,
                file: newFiles[0]
            }
        ]);
    };

    const onTrainingDatasetUpload = async (index) => {
        const file = trainingFiles[index].file;
        setLoading(true);
        try {
            setTrainingFiles((trainingFiles) => {
                trainingFiles[index].uploading = true;
                return trainingFiles;
            });
            const formData = new FormData();
            formData.append('finetuned_model_id', activeModel.id);
            formData.append('is_validation_data', false);
            formData.append('file', file);

            await uploadDataset(formData);

            setTrainingFiles((trainingFiles) => {
                trainingFiles[index].uploading = false;
                trainingFiles[index].uploaded = true;
                trainingFiles[index].status = 100;
                return trainingFiles;
            });
        } catch (error) {
            //
        }
        setLoading(false);
    };

    const onTrainingDatasetDelete = () => {
        setTrainingFiles(() => []);
    };

    const onValidationDatasetFileChange = async (e) => {
        if (!e.target.files.length) return;
        setValidationFiles(() => [
            {
                loaded: true,
                uploaded: false,
                uploading: false,
                status: 0,
                file: e.target.files[0]
            }
        ]);
    };

    const onValidationDatasetFileDrop = (e) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        if (!droppedFiles.length) return;
        const newFiles = Array.from(droppedFiles);
        setValidationFiles(() => [
            {
                loaded: true,
                uploaded: false,
                uploading: false,
                status: 0,
                file: newFiles[0]
            }
        ]);
    };

    const onValidationDatasetUpload = async (index) => {
        setLoading(true);
        const file = validationFiles[index].file;
        try {
            setValidationFiles((validationFiles) => {
                validationFiles[index].uploading = true;
                return validationFiles;
            });
            const formData = new FormData();
            formData.append('file', file);
            formData.append('finetuned_model_id', activeModel.id);
            formData.append('is_validation_data', true);

            await uploadDataset(formData);

            setValidationFiles((validationFiles) => {
                validationFiles[index].uploading = false;
                validationFiles[index].uploaded = true;
                validationFiles[index].status = 100;
                return validationFiles;
            });
        } catch (error) {
            //
        }
        setLoading(false);
    };

    const onValidationDatasetDelete = () => {
        setValidationFiles(() => []);
    };

    const finishUpload = () => {
        // Temporarly removed. TODO: Add quality report page
        // setStep(STEPS.REPORT);
        dispatch(
            setActiveFinetunedModel({
                ...activeModel,
                trainingFiles,
                validationFiles
            })
        );
        next();
    };

    const reupload = () => {
        setStep(STEPS.TRAINING);
    };

    return (
        <Box
            display="flex"
            height="100%"
            alignItems="center"
            justifyContent="center"
            position="relative"
            className={classes.wrapper}
        >
            <Box display="flex" gridGap="2rem">
                <Box
                    display="flex"
                    flexDirection="column"
                    gridGap="2rem"
                    className={clsx({
                        [classes.disabled]: step !== STEPS.TRAINING
                    })}
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        gridGap="2rem"
                        padding="2rem"
                        width="36rem"
                        className={classes.boxWrapper}
                    >
                        <Typography variant="h4">Training Data Set</Typography>
                        <UploadBox
                            disabled={step !== STEPS.TRAINING}
                            uploadAgain={trainingFiles.length}
                            onChange={onTrainingDatasetFileChange}
                            onUpload={onTrainingDatasetUpload}
                            onDelete={onTrainingDatasetDelete}
                            onDrop={onTrainingDatasetFileDrop}
                            files={trainingFiles}
                        />
                    </Box>
                    <Box
                        display={step === STEPS.TRAINING ? 'flex' : 'none'}
                        justifyContent="center"
                        gridGap="2rem"
                    >
                        <Button
                            variant="contained"
                            size="small"
                            onClick={loadValidationStep}
                            disabled={
                                loading ||
                                !trainingFiles.length ||
                                !trainingFiles?.[0]?.uploaded ||
                                trainingFiles?.[0]?.uploading
                            }
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    gridGap="2rem"
                    className={clsx({
                        [classes.disabled]: step !== STEPS.VALIDATION
                    })}
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        gridGap="2rem"
                        padding="2rem"
                        width="36rem"
                        className={classes.boxWrapper}
                    >
                        <Typography variant="h4">Validation Data Set</Typography>
                        <UploadBox
                            disabled={step !== STEPS.VALIDATION}
                            uploadAgain={validationFiles.length}
                            onChange={onValidationDatasetFileChange}
                            onUpload={onValidationDatasetUpload}
                            onDelete={onValidationDatasetDelete}
                            onDrop={onValidationDatasetFileDrop}
                            files={validationFiles}
                        />
                    </Box>
                    <Box
                        display={step === STEPS.VALIDATION ? 'flex' : 'none'}
                        justifyContent="center"
                        gridGap="2rem"
                    >
                        <Button
                            variant="outlined"
                            size="small"
                            disabled={loading}
                            onClick={loadTrainingStep}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            disabled={
                                loading ||
                                !validationFiles.length ||
                                validationFiles?.[0]?.uploading
                            }
                            onClick={finishUpload}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box position="absolute" right="4rem" top="4rem" className={classes.downloadBox}>
                <Typography variant="k10" style={{ textTransform: 'none' }}>
                    Download dataset template from{' '}
                    <Link href={'#'} className={classes.link}>
                        here
                    </Link>
                </Typography>
            </Box>
            <QualityReportDrawer
                visibility={step === STEPS.REPORT ? 'visible' : 'hidden'}
                expanded={step === STEPS.REPORT}
                actions={{
                    next,
                    previous: reupload
                }}
            />
        </Box>
    );
};

export default UploadDataset;
