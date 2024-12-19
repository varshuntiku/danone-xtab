import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Divider,
    Grid,
    MenuItem,
    TextField,
    Tooltip,
    makeStyles,
    useTheme
} from '@material-ui/core';
import clsx from 'clsx';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import Typography from 'components/elements/typography/typography';
import GridTable from 'components/gridTable/GridTable';
import CodxCircularLoader from 'components/CodxCircularLoader';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveFinetunedModel } from 'store/slices/llmWorkbenchSlice';
import { createFineTuneStyle } from 'assets/jss/llmWorkbench/createFineTuneStyle';
import { getAllInfraConfigs } from 'services/llmWorkbench/llm-workbench';

const specifications = [
    {
        id: 1,
        label: 'Name',
        key: 'name',
        format: (data) => `${data}`
    },
    {
        id: 2,
        label: 'vCPU',
        key: 'vcpu',
        format: (data) => `${data}`
    },
    {
        id: 3,
        label: 'Memory',
        key: 'ram',
        format: (data) => `${data}GiB`
    },
    {
        id: 4,
        label: 'GPU',
        value: '1'
    },
    {
        id: 5,
        label: 'Storage Size',
        key: 'storage_size',
        format: (data) => `${data}GiB`
    },
    {
        id: 6,
        label: 'Max uncached disk throughput (MBps)',
        key: 'iops',
        format: (data) => `${data}`
    },
    {
        id: 7,
        label: 'Data disks',
        key: 'data_disks',
        format: (data) => `${data}`
    },
    {
        id: 8,
        label: 'Estimated Cost',
        key: 'estimated_cost',
        format: (data) => `$${data}/hr`
    }
];

const useStyles = makeStyles(createFineTuneStyle);

const tableProps = {
    groupHeaders: [],
    coldef: [
        {
            headerName: 'Specification',
            field: 'label'
        },
        {
            headerName: 'Details',
            field: 'value'
        }
    ],
    gridOptions: {
        tableSize: 'small',
        tableMaxHeight: '80vh'
    }
};

const InfraConfig = ({ action }) => {
    const dispatch = useDispatch();
    const {
        fineTunedModel: { activeModel }
    } = useSelector((state) => state.llmWorkbench);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [infras, setInfras] = useState([]);
    const [activeInfra, setActiveInfra] = useState(null);
    const [activeInfraDetails, setActiveInfraDetails] = useState(null);
    const classes = useStyles();
    const theme = useTheme();
    const next = useCallback(() => {
        if (!activeInfra) {
            setError('Please select a GPU.');
            return;
        }
        const payload = {
            ...activeModel,
            compute_id: activeInfra
        };
        dispatch(setActiveFinetunedModel(payload));
        action.next();
    }, [activeModel, action, activeInfra]);
    useEffect(() => {
        setLoading(true);
        getAllInfraConfigs()
            .then(({ data }) => {
                setInfras(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);
    useEffect(() => {
        if (activeModel?.compute_id) {
            setActiveInfra(activeModel?.compute_id);
        }
    }, [activeModel]);
    useEffect(() => {
        setError('');
        if (activeInfra && infras?.length) {
            const infra = infras.find((infra) => infra.id === activeInfra);
            if (infra) {
                const details = [];
                specifications.forEach((specification) => {
                    if (specification?.value) {
                        details.push(specification);
                    } else {
                        const value = specification.format(infra[specification.key]);
                        details.push({
                            id: specification.id,
                            label: specification.label,
                            value
                        });
                    }
                });
                setActiveInfraDetails(details);
            }
        }
    }, [activeInfra, infras]);

    return (
        <Box
            height={'100%'}
            width={'100%'}
            paddingX={theme.spacing(6)}
            paddingBottom={theme.spacing(6)}
            display="flex"
            flexDirection="column"
            gridGap={theme.spacing(2)}
            flex={1}
            position="relative"
        >
            <Typography className={clsx(classes.text, classes.stpperTitle)}>
                Infra Config
            </Typography>
            <Divider />
            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                gridGap={theme.spacing(6)}
                marginTop={theme.spacing(2)}
            >
                <Grid container spacing={4}>
                    <Grid item xs={2} container direction="column" spacing={1}>
                        <Grid item>
                            <Typography className={clsx(classes.text, classes.secTitle)}>
                                Experiment Details
                            </Typography>
                        </Grid>
                        <Grid item container>
                            <Grid xs={11}>
                                <Typography className={clsx(classes.text, classes.secInfo)}>
                                    Select GPU as per you preference
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={7} container spacing={1}>
                        <Grid item xs={12}>
                            <Box display={'flex'} gridGap={theme.spacing(2)}>
                                <Typography className={`${classes.text}`}>
                                    <span>Select GPU</span>
                                    <Tooltip
                                        placement="FollowCursor"
                                        title={
                                            <Typography variant="h4" className={classes.tooltip}>
                                                GPU A100 is optimized for performance efficiency.
                                                <br></br>GPU 4090 is optimized for memory, cost
                                                efficiency.
                                            </Typography>
                                        }
                                    >
                                        <InfoIcon />
                                    </Tooltip>
                                </Typography>
                                <Typography className={clsx(classes.text, classes.error)}>
                                    {error}
                                </Typography>
                            </Box>
                        </Grid>
                        {loading ? (
                            <Grid item xs={12} container direction="column">
                                <CodxCircularLoader size={40} />
                            </Grid>
                        ) : (
                            <Grid item xs={12} container direction="column">
                                <TextField
                                    className={classes.textField}
                                    InputProps={{
                                        classes: {
                                            input: classes.input
                                        }
                                    }}
                                    variant="outlined"
                                    size="small"
                                    select
                                    value={activeInfra}
                                    onChange={(e) => setActiveInfra(e.target.value)}
                                >
                                    {infras.map((infra) => (
                                        <MenuItem
                                            key={infra.id}
                                            className={classes.menuItem}
                                            value={infra.id}
                                        >
                                            {infra.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                {!loading && activeInfraDetails && (
                    <Grid container spacing={4}>
                        <Grid item xs={2} container direction="column" spacing={1}></Grid>
                        <Grid item xs={7} container spacing={1}>
                            <Grid item xs={12} className={classes.container}>
                                <GridTable
                                    params={{
                                        rowData: activeInfraDetails,
                                        coldef: undefined,
                                        ...tableProps
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Box>
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

export default InfraConfig;
