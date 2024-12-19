import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    Divider,
    FormControlLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    alpha,
    makeStyles,
    useTheme,
    withStyles
} from '@material-ui/core';
import clsx from 'clsx';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

import Typography from 'components/elements/typography/typography';
import UploadBox from '../UploadBox';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveFinetunedModel } from 'store/slices/llmWorkbenchSlice';
import { getAllDatasets, uploadFinetuneDataset } from 'services/llmWorkbench/llm-workbench';
import { createFineTuneStyle } from 'assets/jss/llmWorkbench/createFineTuneStyle';
import CodxCircularLoader from 'components/CodxCircularLoader';
import problemTypeAndFormat from 'constants/problem-types-and-formats.js';

const formatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
});

const useStyles = makeStyles(createFineTuneStyle);

const StyledTableCell = withStyles((theme) => ({
    root: {
        textAlign: 'justify',
        color: theme.palette.primary.contrastText,
        fontSize: theme.spacing(2),
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        wordBreak: 'break-word',
        width: '50%'
    },
    head: {
        background: theme.palette.background.default,
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        lineHeight: theme.spacing(3),
        borderBottom: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4),
        '& span:hover': {
            color: theme.palette.primary.contrastText
        },
        minWidth: theme.spacing(50)
    }
}))(TableCell);

const ViewDataDialog = ({ open, setOpen }) => {
    const theme = useTheme();
    const classes = useStyles();
    return (
        <Dialog fullWidth classes={{ paper: classes.paper }} open={open}>
            <Box
                padding={theme.spacing(8)}
                display="flex"
                flexDirection="column"
                gridGap={theme.spacing(4)}
            >
                <Box>
                    <Typography className={clsx(classes.text, classes.title)} variant="h2">
                        Dataset Preview
                    </Typography>
                </Box>
                <Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Instructions</StyledTableCell>
                                <StyledTableCell>Input</StyledTableCell>
                                <StyledTableCell>Output</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <StyledTableCell>
                                    Question: This question refers to the following information.
                                </StyledTableCell>
                                <StyledTableCell>
                                    In the context of web development, consider the following
                                    technologies. Which one is primarily used for defining the
                                    structure and layout of web pages, rather than being a
                                    programming language? a) Python b) JavaScript c) HTML d) SQL
                                </StyledTableCell>
                                <StyledTableCell>A</StyledTableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell>
                                    Question: This question refers to the following information.
                                </StyledTableCell>
                                <StyledTableCell>
                                    In the context of web development, consider the following
                                    technologies. Which one is primarily used for defining the
                                    structure and layout of web pages, rather than being a
                                    programming language? a) Python b) JavaScript c) HTML d) SQL
                                </StyledTableCell>
                                <StyledTableCell>A</StyledTableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell>
                                    Question: This question refers to the following information.
                                </StyledTableCell>
                                <StyledTableCell>
                                    In the context of web development, consider the following
                                    technologies. Which one is primarily used for defining the
                                    structure and layout of web pages, rather than being a
                                    programming language? a) Python b) JavaScript c) HTML d) SQL
                                </StyledTableCell>
                                <StyledTableCell>A</StyledTableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
                <Box
                    display="flex"
                    marginTop={theme.spacing(10)}
                    gridGap={theme.spacing(2)}
                    justifyContent="end"
                >
                    <Button variant="outlined" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

const getDataFormat = (activeModel, classes) => {
    const dataList = problemTypeAndFormat[activeModel?.problem_type];
    let formatedData = [];
    dataList?.map((data, index) => {
        formatedData.push(<p style={{ paddingLeft: '1rem' }}>{'{'}</p>);
        for (const key in data) {
            const formatedText = data[key]
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .split('\n')
                .join('<br />');
            let tags = (
                <p className={classes.indent}>
                    <b>&quot;{key}&quot; :</b>{' '}
                    <i dangerouslySetInnerHTML={{ __html: formatedText }}></i>
                    {key !== Object.keys(data)[Object.keys(data).length - 1] && ','}
                </p>
            );
            formatedData.push(tags);
        }
        if (index === dataList?.length - 1)
            formatedData.push(<p style={{ paddingLeft: '1rem' }}>{'}'}</p>);
        else formatedData.push(<p style={{ paddingLeft: '1rem' }}>{'},'}</p>);
    });
    return formatedData?.map((tag) => tag);
};

const UploadData = ({ action }) => {
    const dispatch = useDispatch();
    const {
        fineTunedModel: { activeModel }
    } = useSelector((state) => state.llmWorkbench);
    const [type, setType] = useState('existing');
    const [open, setOpen] = useState(false);
    const [activeDatasetId, setActiveDatasetId] = useState(null);
    const [existingDataset, setExistingDataset] = useState([]);
    const [trainingFiles, setTrainingFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const classes = useStyles();
    const theme = useTheme();
    useEffect(() => {
        if (type === 'existing') {
            setLoading(true);
            getAllDatasets()
                .then(({ data }) => {
                    setExistingDataset(data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [type]);
    useEffect(() => {
        setActiveDatasetId(activeModel?.dataset_id || null);
    }, [activeModel?.dataset_id]);
    useEffect(() => {
        setError('');
    }, [activeDatasetId]);
    const onTrainingDatasetFileChange = async (e) => {
        // console.log({ e });
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
        const file = newFiles[0];
        const extension = file.name.split('.').pop().toLowerCase();

        if (extension !== 'json') {
            return;
        }
        setTrainingFiles(() => [
            {
                loaded: true,
                uploaded: false,
                uploading: false,
                status: 0,
                file
            }
        ]);
    };

    const onTrainingDatasetUpload = async (index) => {
        setLoading(true);
        const file = trainingFiles[index].file;
        try {
            setTrainingFiles((trainingFiles) => {
                trainingFiles[index].uploading = true;
                return trainingFiles;
            });
            const formData = new FormData();
            formData.append('file', file);

            const { data } = await uploadFinetuneDataset(formData);

            setActiveDatasetId(data.id);
            setType('existing');
            setTrainingFiles([]);
        } catch (error) {
            // console.error(error);
            if (error?.response?.data) {
                setError(error.response.data?.split(' : ')?.[1]);
            } else {
                setError('Something went wrong!');
            }
            setTrainingFiles((trainingFiles) => {
                trainingFiles[index].uploading = false;
                return trainingFiles;
            });
        }
        setLoading(false);
    };

    const onTrainingDatasetDelete = () => {
        setTrainingFiles(() => []);
    };

    const selector = useMemo(() => {
        if (loading) {
            return <CodxCircularLoader size={40} />;
        }
        switch (type) {
            case 'existing':
                return [
                    <TextField
                        key="existing"
                        placeholder="Select your file"
                        variant="outlined"
                        size="small"
                        select
                        className={classes.textField}
                        InputProps={{
                            classes: {
                                input: classes.input
                            }
                        }}
                        error={error}
                        value={activeDatasetId}
                        onChange={(e) => setActiveDatasetId(e.target.value)}
                    >
                        {existingDataset.map((dataset) => (
                            <MenuItem
                                key={dataset.id}
                                className={classes.menuItem}
                                value={dataset.id}
                            >
                                <span className="file">{dataset.file_name}</span>
                                <span className="time">
                                    {formatter.format(new Date(dataset.created_at))}
                                </span>
                            </MenuItem>
                        ))}
                    </TextField>
                ];
            case 'upload':
                return [
                    <React.Fragment key="upload">
                        <UploadBox
                            uploadAgain={trainingFiles.length}
                            onChange={onTrainingDatasetFileChange}
                            onUpload={onTrainingDatasetUpload}
                            onDrop={onTrainingDatasetFileDrop}
                            onDelete={onTrainingDatasetDelete}
                            files={trainingFiles}
                            accept="application/json"
                        />
                        <Typography variant="h7" className={classes.text}>
                            Allowed file format - json
                        </Typography>
                    </React.Fragment>
                ];
            default:
                return [];
        }
    }, [type, existingDataset, activeDatasetId, trainingFiles, loading, error]);
    const datasetText = useMemo(() => {
        switch (type) {
            case 'existing':
                return 'Select Data File';
            case 'upload':
                return 'Upload Data';
            default:
                return '';
        }
    }, [type]);

    const next = useCallback(() => {
        if (!activeDatasetId) {
            setError('Please select a dataset');
            return;
        }
        dispatch(setActiveFinetunedModel({ ...activeModel, dataset_id: activeDatasetId }));
        action.next();
    }, [activeModel, activeDatasetId]);

    return (
        <Box
            maxHeight={'100%'}
            width={'100%'}
            paddingX={theme.spacing(6)}
            paddingBottom={theme.spacing(20)}
            display="flex"
            flexDirection="column"
            gridGap={theme.spacing(2)}
            position="relative"
        >
            <ViewDataDialog open={open} setOpen={setOpen} />
            <Typography className={clsx(classes.text, classes.stpperTitle)}>
                Select Data Source
            </Typography>
            <Divider />
            <Grid container spacing={4}>
                <Grid item xs={2} container direction="column" spacing={1}>
                    <Grid item>
                        <Typography className={clsx(classes.text, classes.secTitle)}>
                            Data Configurations
                        </Typography>
                    </Grid>
                    <Grid item container>
                        <Grid xs={11}>
                            <Typography className={clsx(classes.text, classes.secInfo)}>
                                Choose dataset from the existing files or upload new (as per the
                                required data format).
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={10} container justifyContent="space-between">
                    <Grid item xs={6}>
                        <Grid item xs={12}>
                            <RadioGroup
                                className={classes.radioGroup}
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <FormControlLabel
                                    control={<Radio />}
                                    value="upload"
                                    label={<Typography variant="k10">Upload Data</Typography>}
                                />
                                <FormControlLabel
                                    control={<Radio disabled style={{ opacity: 0.4 }} />}
                                    value="blob"
                                    label={<Typography variant="k10">Blob Storge</Typography>}
                                    disabled
                                />
                                <FormControlLabel
                                    control={<Radio />}
                                    value="existing"
                                    label={<Typography variant="k10">Existing Data</Typography>}
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={12} container direction="column">
                            <Box
                                key="selector"
                                display="flex"
                                flexDirection="column"
                                marginTop={theme.spacing(2)}
                                gridGap={theme.spacing(1)}
                            >
                                <Box display="flex" gridGap={theme.spacing(2)} alignItems="center">
                                    <Typography className={classes.text}>
                                        <span>
                                            {datasetText}
                                            <b className={classes.required}>*</b>
                                        </span>
                                    </Typography>
                                    <Typography className={clsx(classes.text, classes.error)}>
                                        {error}
                                    </Typography>
                                </Box>
                                {selector}
                            </Box>
                            <Box
                                display="flex"
                                marginTop={theme.spacing(2)}
                                gridGap={theme.spacing(1)}
                            >
                                {/* <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setOpen(true)}
                                    //disabling as the feature is not developed yet
                                    disabled={true}
                                >
                                    Preview
                                </Button> */}
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item xs={5} container direction="column" spacing={2}>
                        <Grid item>
                            <Typography className={classes.text}>Required Data Format</Typography>
                        </Grid>
                        <Grid item container direction="column">
                            <Box className={classes.code}>
                                <p>{'['}</p>
                                {getDataFormat(activeModel, classes)}
                                <p>{']'}</p>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {/* <Divider /> */}
            {/* <Grid container spacing={4}>
                <Grid item xs={2} container direction="column" spacing={1}>
                    <Grid item>
                        <Typography variant="h4" className={classes.text}>
                            Configure Dataset
                        </Typography>
                    </Grid>
                    <Grid item container>
                        <Grid xs={11}>
                            <Typography variant="h7" className={clsx(classes.text, classes.info)}>
                                Specify appropriate columns for finetuning.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={10} container justifyContent="space-between">
                    <Grid item xs={6} container style={{ rowGap: theme.spacing(2) }}>
                        <Grid item xs={12} container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="h4" className={classes.text}>
                                    Prompt Column
                                </Typography>
                            </Grid>
                            <Grid item xs={12} container direction="column">
                                <TextField
                                    placeholder="Select prompt column"
                                    variant="outlined"
                                    size="small"
                                    select
                                    className={classes.textField}
                                    InputProps={{
                                        classes: {
                                            input: classes.input
                                        }
                                    }}
                                >
                                    <MenuItem value="Indexer">Indexer</MenuItem>
                                    <MenuItem value="Separator">Separator</MenuItem>
                                    <MenuItem value="UUID">UUID</MenuItem>
                                    <MenuItem value="Metadata">Metadata</MenuItem>
                                    <MenuItem value="title">title</MenuItem>
                                    <MenuItem value="description">description</MenuItem>
                                    <MenuItem value="data">data</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="h4" className={classes.text}>
                                    Response Column
                                </Typography>
                            </Grid>
                            <Grid item xs={12} container direction="column">
                                <TextField
                                    placeholder="Select response column"
                                    variant="outlined"
                                    size="small"
                                    select
                                    className={classes.textField}
                                    InputProps={{
                                        classes: {
                                            input: classes.input
                                        }
                                    }}
                                >
                                    <MenuItem value="Indexer">Indexer</MenuItem>
                                    <MenuItem value="Separator">Separator</MenuItem>
                                    <MenuItem value="UUID">UUID</MenuItem>
                                    <MenuItem value="Metadata">Metadata</MenuItem>
                                    <MenuItem value="title">title</MenuItem>
                                    <MenuItem value="description">description</MenuItem>
                                    <MenuItem value="data">data</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid> */}
            <Box flex={1}></Box>
            <Box
                display="flex"
                justifyContent="space-between"
                position="fixed"
                bottom={0}
                padding={theme.spacing(3)}
                backgroundColor={theme.palette.background.paper}
                width={`calc(82.5% - ${theme.spacing(8)})`}
            >
                <Button
                    variant="outlined"
                    size="small"
                    style={{ paddingLeft: theme.spacing(2) }}
                    startIcon={<KeyboardArrowLeftIcon fontSize="large" />}
                    onClick={action.previous}
                >
                    Back
                </Button>
                <Box display="flex" gridGap={theme.spacing(2)}>
                    <Button variant="outlined" size="small" onClick={action.cancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" size="small" onClick={next}>
                        Save & Next
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default UploadData;
