import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, makeStyles, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import Typography from 'components/elements/typography/typography';
import CodxCircularLoader from 'components/CodxCircularLoader';
import GridTable from 'components/gridTable/GridTable';
import { advancedConfigConstants, baseConfigConstants, fieldNames } from 'constants/llm-wrokbench';
import {
    getProblemType,
    getErrorMetrics,
    getPeftMethod,
    getLrSchedulerType,
    getQuantization,
    getBaseModels,
    getAllInfraConfigs
} from 'services/llmWorkbench/llm-workbench';
import { createFineTuneStyle } from 'assets/jss/llmWorkbench/createFineTuneStyle';

const fieldActions = {
    getProblemType,
    getBaseModels,
    getErrorMetrics,
    getPeftMethod,
    getLrSchedulerType,
    getQuantization
};

const useStyles = makeStyles(createFineTuneStyle);

const ReviewScreen = ({ action, loading }) => {
    const {
        fineTunedModel: { activeModel }
    } = useSelector((state) => state.llmWorkbench);
    const [data, setData] = useState([]);

    const classes = useStyles();
    const theme = useTheme();
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const getInfraValue = async (compute_id) => {
            const infraData = await getAllInfraConfigs();
            const value = infraData?.data?.filter((item) => item.id === compute_id);
            return value?.[0]?.name;
        };
        const loadData = async () => {
            setLoader(true);
            const data = [];
            for (const config of baseConfigConstants) {
                for (const field of config.fields) {
                    if (field.id === 'base_model_id') {
                        let label = 'Base Model';
                        let value = activeModel[field.id];
                        if (value === 'custom') {
                            label = 'Model Path';
                            value = activeModel['model_path'];
                        } else {
                            const fetchAction = fieldActions[field.fetchAction];
                            const values = await fetchAction();
                            const option = values.find(
                                (value) => value.id === activeModel[field.id]
                            );
                            value = option.name;
                        }
                        data.push({ label, value: `${value}` });
                    } else if (field.id !== 'model_path') {
                        const label = fieldNames[field.id];
                        let value = activeModel[field.id];
                        let values = [];
                        if (field.type === 'select') {
                            const fetchAction = fieldActions[field.fetchAction];
                            values = await fetchAction();
                            const option = values.find(
                                (value) => value.id === activeModel[field.id]
                            );
                            value = option.name;
                        }
                        if (value) data.push({ label, value: `${value}` });
                    }
                }
            }
            for (const field of advancedConfigConstants) {
                let label = fieldNames[field.id];
                if (field.id === 'save_steps') label = field.label;
                let value = activeModel.settings[field.id];
                if (field.type === 'select') {
                    const fetchAction = fieldActions[field.fetchAction];
                    const values = await fetchAction();
                    const option = values.find(
                        (value) => value.id === activeModel.settings[field.id]
                    );
                    if (option) value = option.name;
                }
                if (value) data.push({ label, value: `${value}` });
            }
            const infraValue = await getInfraValue(activeModel['compute_id']);
            data.push({ label: 'Infra', value: `${infraValue}` });
            setData(data);
            setLoader(false);
        };
        loadData();
    }, [activeModel]);

    const saveData = () => {
        action.next();
    };

    const tableProps = {
        groupHeaders: [],
        coldef: [
            {
                headerName: 'Config',
                field: 'label'
            },
            {
                headerName: 'Value',
                field: 'value'
            }
        ],
        gridOptions: {
            tableSize: 'small',
            tableMaxHeight: '50vh'
        }
    };

    return (
        <Box
            flex={1}
            maxHeight={'100%'}
            width={'100%'}
            paddingX={theme.spacing(6)}
            display="flex"
            flexDirection="column"
            gridGap={theme.spacing(2)}
            position="relative"
        >
            <Typography className={clsx(classes.text, classes.stpperTitle)}>
                Finish Review
            </Typography>
            <Divider />
            <Typography className={classes.secInfo}>
                Preview your selections and initiate Finetuning
            </Typography>
            <Box height={theme.spacing(1)}></Box>
            <Box flex={1} overflow={'hidden'} className={classes.container}>
                <Box style={{ overflowY: 'auto' }}>
                    {!loader ? (
                        <GridTable
                            params={{
                                rowData: data,
                                coldef: undefined,
                                ...tableProps
                            }}
                        />
                    ) : (
                        <Box
                            display="flex"
                            alignItems={'center'}
                            justifyContent={'center'}
                            height={'50vh'}
                        >
                            <CodxCircularLoader size={60} />
                        </Box>
                    )}
                </Box>
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
                    onClick={action.previous}
                    startIcon={<KeyboardArrowLeftIcon fontSize="large" />}
                    style={{ paddingLeft: theme.spacing(2) }}
                >
                    Back
                </Button>
                <Box display="flex" gridGap={theme.spacing(2)}>
                    <Button variant="outlined" size="small" onClick={action.cancel}>
                        Cancel
                    </Button>

                    <ConfirmPopup
                        onConfirm={saveData}
                        subTitle="Are you sure to create this experiment?"
                        title="Create Experiment"
                        cancelText={'Cancel'}
                        confirmText={'Proceed'}
                        enableCloseButton
                    >
                        {(triggerConfirm) => (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={triggerConfirm}
                                disabled={loading}
                            >
                                Submit
                            </Button>
                        )}
                    </ConfirmPopup>
                </Box>
            </Box>
        </Box>
    );
};

export default ReviewScreen;
