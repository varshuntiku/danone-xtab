import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'components/llmWorkbench/DataTable';
import {
    IconButton,
    makeStyles,
    Box,
    Button,
    Breadcrumbs,
    Link,
    Dialog,
    useTheme,
    Divider,
    SvgIcon
} from '@material-ui/core';
import finetunedModelsStyle from 'assets/jss/llmWorkbench/finetunedModelsStyle';
import { getCustomTableHeader } from 'services/llmWorkbench/llm-workbench';
import CustomSnackbar from 'components/CustomSnackbar';
import { setCustomizedModelsTableHeader } from 'store';
import t from '../../config/textContent/llmWorkbench.json';
import Typography from 'components/elements/typography/typography';
import { getAllExperiments } from 'store';
import { Close, VisibilityOutlined } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import GridTable from 'components/gridTable/GridTable';
// import { updateExperimentsDataWithNewStatus } from 'store/slices/llmWorkbenchSlice';
import { ReactComponent as DeployIcon } from 'assets/img/llm-deployment.svg';

const useStyles = makeStyles(finetunedModelsStyle);

function LLMExperiments(props) {
    const [open, setOpen] = useState(false);
    const [configData, setConfigData] = useState();
    const dispatch = useDispatch();
    const {
        loading,
        experiments: { data, total, headers }
    } = useSelector((state) => state.llmWorkbench);
    const [searchInfo, setSearchInfo] = useState({ searchId: '', searchValue: null });
    const [notification, setNotification] = useState();
    const [notificationOpen, setNotificationOpen] = useState();
    const [paginationInfo, setPaginationInfo] = useState({
        page: 0,
        rowsPerPage: 10
    });

    const fetchAndSetFinetunedModels = useCallback(async () => {
        try {
            if (!headers) {
                const _headers = getCustomTableHeader();
                dispatch(setCustomizedModelsTableHeader(_headers));
            }
            dispatch(
                getAllExperiments({
                    size: paginationInfo?.rowsPerPage,
                    page: paginationInfo?.page,
                    search: searchInfo?.searchValue
                })
            );
        } catch (error) {
            setNotificationOpen(true);
            setNotification(() => ({
                message: error?.message || 'Failed to load Experiments! Please try again',
                severity: 'error'
            }));
        }
    }, [paginationInfo, searchInfo?.searchValue]);

    useEffect(() => {
        fetchAndSetFinetunedModels();
    }, [paginationInfo.rowsPerPage, paginationInfo.page, searchInfo?.searchValue]);

    const latestDataRef = useRef(data);
    useEffect(() => {
        latestDataRef.current = data;
    }, [data]);

    const classes = useStyles();
    const theme = useTheme();
    const viewResult = (model) => {
        props.history.push(`/llmworkbench/finetunedmodels/${model.id}/status`, { model });
    };

    const onClickconfigDetails = (data) => {
        setOpen(true);
        const _configDetails = {
            epochs: data['epochs'],
            test_size: data['test_size'],
            batch_size: data['batch_size'],
            max_tokens: data['max_tokens'],
            learning_rate: data['learning_rate'],
            error_metric: data['error_metric_type'].replaceAll('_', ' '),
            infra: data['compute']['name'] || '-',
            source_type: data['dataset']['source_type'] || '-',
            file_name: data['dataset']['file_name'] || '-',
            file_type: data['dataset']['file_type'] || '-',
            peft_method: data['settings']['peft_method'],
            quantization: data['settings']['quantization'],
            gradient_acc_steps: data['settings']['gradient_acc_steps'],
            logging_steps: data['settings']['logging_steps'],
            checkpoint_frequency: data['settings']['save_steps'],
            lr_scheduler_type: data['settings']['lr_scheduler_type'],
            lora_alpha: data['settings']['lora_alpha'],
            lora_rank: data['settings']['lora_rank']
        };
        const _configData = [];
        for (const key in _configDetails) {
            _configData.push({
                parameter: key?.replaceAll('_', ' '),
                value: String(_configDetails[key])
            });
        }
        setConfigData(_configData);
    };

    const configDetailsDialogue = () => {
        const theme = useTheme();
        const tableProps = {
            groupHeaders: [],
            coldef: [
                {
                    headerName: 'Parameter',
                    field: 'parameter'
                },
                {
                    headerName: 'Value',
                    field: 'value'
                }
            ],
            gridOptions: {
                tableSize: 'medium',
                tableMaxHeight: '80vh'
            }
        };
        return (
            <Dialog
                fullWidth
                style={{
                    maxWidth: theme.spacing(150),
                    margin: 'auto'
                }}
                classes={{ paper: classes.paper }}
                open={open}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Typography className={classes.configDialogueHeader}>
                            Config Details
                        </Typography>
                        <IconButton
                            title="Close"
                            onClick={() => {
                                setOpen(false);
                            }}
                            aria-label="Close"
                        >
                            <Close fontSize="large" />
                        </IconButton>
                    </Box>
                    <Divider style={{ backgroundColor: theme.palette.separator.grey }} />
                    <Box style={{ margin: '1rem' }}>
                        <GridTable
                            params={{
                                rowData: configData,
                                coldef: undefined,
                                ...tableProps
                            }}
                        />
                    </Box>
                </Box>
            </Dialog>
        );
    };
    const handleDeploy = async ({ id, base_model_id }) => {
        props.history.push(`/llmworkbench/models/${base_model_id}/experiments/${id}/deploy`);
    };

    const tableActions = (model) => (
        <Box className={classes.tableActionsContainer}>
            <Box display="flex">
                <IconButton
                    aria-label="View Results"
                    title="View Results"
                    onClick={() => viewResult(model)}
                >
                    <VisibilityOutlined fontSize="large" />
                </IconButton>
                <IconButton
                    aria-label="Deploy model"
                    title="Deploy model"
                    disabled={model.status !== 'Completed'}
                    onClick={() => handleDeploy(model)}
                >
                    <SvgIcon fontSize="large">
                        <DeployIcon />
                    </SvgIcon>
                </IconButton>
            </Box>
        </Box>
    );
    const onHandleSearch = (searchId, searchValue) => {
        setSearchInfo((prevState) => ({
            ...prevState,
            searchId,
            searchValue
        }));
    };
    return (
        <>
            <Box
                display={'flex'}
                flexDirection={'column'}
                className={classes.topContainer}
                gridGap={7}
            >
                <Breadcrumbs
                    aria-label="breadcrumb"
                    style={{
                        color: theme.palette.text.titleText,
                        paddingBottom: '1rem',
                        fontSize: '1.4rem'
                    }}
                >
                    <Link color="inherit" href="/llmworkbench">
                        LLM Workbench
                    </Link>
                    <Typography
                        color="textPrimary"
                        style={{
                            fontWeight: 'bold',
                            color: theme.palette.text.contrastText,
                            fontSize: '1.4rem'
                        }}
                    >
                        Finetune for usecase
                    </Typography>
                </Breadcrumbs>
                <Typography className={classes.heading}>Finetuning</Typography>
                <Typography
                    variant="k8"
                    style={{
                        textTransform: 'none',
                        // fontFamily: 'Graphik Compact',
                        color: theme.palette.text.titleText
                    }}
                >
                    {t.llm_experiments.tables.information}
                </Typography>
            </Box>
            <Button
                onClick={() => props.history.push('/llmworkbench/finetunedmodels/create')}
                startIcon={<AddIcon />}
                variant="outlined"
                className={classes.finetuneNewBtn}
            >
                {t.llm_experiments.button.create}
            </Button>
            <DataTable
                tableHeaderCells={headers}
                tableData={data}
                tableActions={tableActions}
                searchId={searchInfo.searchId}
                searchValue={searchInfo.searchValue}
                setStateInfo={setPaginationInfo}
                onHandleSearch={onHandleSearch}
                page="llmworkbench"
                paginationInfo={{
                    page: paginationInfo.page,
                    rowsPerPage: paginationInfo.rowsPerPage,
                    totalCount: total
                }}
                loader={loading}
                type="experiments"
                onClickconfigDetails={onClickconfigDetails}
            />
            {configDetailsDialogue()}

            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={3000}
                onClose={setNotificationOpen.bind(null, false)}
                severity={notification?.severity || 'success'}
                message={notification?.message}
            />
        </>
    );
}

export default LLMExperiments;
