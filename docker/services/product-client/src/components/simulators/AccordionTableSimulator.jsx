import React from 'react';
import { useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    alpha,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    Typography
} from '@material-ui/core';
import GridTable from '../gridTable/GridTable';
import { useEffect } from 'react';
import CodxCircularLoader from '../CodxCircularLoader';
import NumberInput from '../dynamic-form/inputFields/numberInput';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ActionButtons from '../dynamic-form/inputFields/ActionButtons';
// import DynamicForm from '../dynamic-form/dynamic-form';
import { red } from '@material-ui/core/colors';
import TextInput from '../dynamic-form/inputFields/textInput';
import DynamicForm from '../dynamic-form/dynamic-form';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiAccordion-root': {
            '&:hover': {
                opacity: 1,
                backgroundColor: 'none'
            }
        }
    },
    rootSection: {
        marginBottom: '2rem',
        '&:before': {
            height: 0
        }
    },
    rootSectionSummary: {
        background: theme.palette.primary.light,
        border: `1px solid ${alpha(theme.palette.text.default, 0.4)}`,
        color: theme.palette.text.default,
        position: 'sticky',
        top: 0,
        zIndex: 3
    },
    rootSectionDetails: {
        paddingTop: '1rem',
        paddingBottom: '1rem',
        paddingRight: '1rem',
        marginBottom: '2rem',
        border: `1px solid ${alpha(theme.palette.text.default, 0.2)}`,
        borderTop: 0,
        flexDirection: 'column'
    },
    accordionHeaderName: {
        color: theme.palette.text.default,
        fontWeight: 500
    },
    accordionRoot: {
        '&:before': {
            height: 0
        }
    },
    accordionSummary: {
        borderTop: `1px solid ${alpha(theme.palette.text.default, 0.4)}`,
        background: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.background.hover
        }
    },
    accordionDetails: {
        paddingTop: '1rem',
        paddingBottom: '1rem'
    },
    confirmationError: {
        top: '-12px',
        position: 'relative',
        width: '100%',
        fontSize: '1.4rem',
        color: red[500]
    },
    defaultColor: {
        color: theme.palette.text.default
    },
    actionsStyle: {
        postion: 'relative',
        overflow: 'hidden',
        paddingLeft: '24px !important',
        paddingRight: '24px !important'
    }
}));

export default function AccordianTableSimultor({
    params,
    appId,
    screenId,
    onFetchTableData,
    onAction,
    onTriggerNotification,
    onValidateValueChangeInGridTable
}) {
    const classes = useStyles();
    const [data, setData] = useState(params);
    const [expanded, setExpanded] = React.useState(params.expanded);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [defaultScenarioName, setDefaultScenarioName] = useState(
        params.actions.find((el) => el.customAction === 'saveScenarioName')?.scenarioName
    );

    const handleAction = async (e) => {
        if (e.customAction === 'saveScenarioName') {
            setOpenConfirmation(true);
            setDefaultScenarioName(e.scenarioName);
        } else {
            try {
                const resp = await onAction({ actionType: e.name, data });
                if (resp.message) {
                    onTriggerNotification({
                        notification: {
                            message: resp.message,
                            severity: resp?.error ? 'error' : 'success'
                        }
                    });
                }
                setData((s) => ({ ...s, ...resp }));
                setExpanded(false);
            } catch (err) {
                /* empty */
            }
        }
    };

    const handleConfirmation = async (e) => {
        try {
            onTriggerNotification({
                notification: {
                    message: 'Request Is Being Processed',
                    severity: 'info'
                }
            });
            const resp = await onAction({
                actionType: data.actions.find((el) => el.customAction === 'saveScenarioName').name,
                data: { ...data, ...e }
            });
            if (resp.message) {
                onTriggerNotification({
                    notification: {
                        message: resp.message,
                        severity: resp?.error ? 'error' : 'success'
                    }
                });
            }
            setExpanded(false);
            setData((s) => ({ ...s, ...resp }));
            return resp;
        } catch (err) {
            /* empty */
        }
    };

    return (
        <div className={classes.root}>
            <div style={{ maxHeight: data.extraParams?.maxHeight, overflow: 'auto' }}>
                {data?.sections?.map((el) => (
                    <Section
                        key={el.name}
                        data={el}
                        tableConfig={el.tableConfig}
                        expanded={el.name === expanded}
                        classes={classes}
                        onTriggerNotification={onTriggerNotification}
                        onFetchTableData={onFetchTableData}
                        onDataChange={(e) => {
                            Object.assign(el, e);
                            setData({ ...data });
                        }}
                        onOpenChange={() => setExpanded((e) => (e !== el.name ? el.name : false))}
                    />
                ))}
            </div>
            <div style={{ padding: '1rem' }}>
                <ActionButtons params={data?.actions} onClick={handleAction} />
            </div>
            {data?.simulationResult ? (
                <DynamicForm
                    params={data.simulationResult}
                    screen_id={screenId}
                    app_id={appId}
                    extraParamsMapping={data.simulationResultExtraParamsMapping}
                    onChange={(d) => {
                        data.simulationResult = d;
                        setData({ ...data });
                    }}
                    onValidateValueChangeInGridTable={onValidateValueChangeInGridTable}
                    onClickActionButton={(el) => handleAction(el)}
                    onValidation={(actionName) => handleAction({ name: actionName }, true)}
                />
            ) : null}
            <SaveScenarioConfirmation
                open={openConfirmation}
                classes={classes}
                onClose={() => setOpenConfirmation(false)}
                onAction={handleConfirmation}
                defaultScenarioName={defaultScenarioName}
            />
        </div>
    );
}

function Section({
    data,
    tableConfig,
    expanded,
    classes,
    onDataChange,
    onOpenChange,
    onFetchTableData,
    onTriggerNotification
}) {
    const [childExpanded, setChildExpanded] = useState(false);
    useEffect(() => {
        setChildExpanded(false);
    }, [expanded]);
    return (
        <Accordion className={classes.rootSection} expanded={expanded} onChange={onOpenChange}>
            <AccordionSummary
                className={classes.rootSectionSummary}
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography variant="h4">{data?.name}</Typography>
            </AccordionSummary>

            {expanded ? (
                <AccordionDetails className={classes.rootSectionDetails}>
                    <Typography
                        variant="h5"
                        style={{ width: '100%' }}
                        className={classes.accordionHeaderName}
                        gutterBottom
                    >
                        {data?.accordionHeaderName}
                    </Typography>
                    <div style={{ width: '100%' }}>
                        {data?.accordions?.map((el) => (
                            <NestedAccordian
                                key={el.name + expanded}
                                data={el}
                                tableConfig={tableConfig}
                                expanded={childExpanded === el.name}
                                classes={classes}
                                onDataChange={(e) => {
                                    Object.assign(el, e);
                                    onDataChange(data);
                                }}
                                onOpenChange={() =>
                                    setChildExpanded((e) => (e !== el.name ? el.name : false))
                                }
                                onFetchTableData={onFetchTableData}
                                onTriggerNotification={onTriggerNotification}
                            />
                        ))}
                    </div>
                </AccordionDetails>
            ) : null}
        </Accordion>
    );
}

function NestedAccordian({
    data,
    tableConfig,
    expanded,
    classes,
    onDataChange,
    onOpenChange,
    onFetchTableData,
    onTriggerNotification
}) {
    const [childExpanded, setChildExpanded] = useState();
    return (
        <Accordion className={classes.accordionRoot} expanded={expanded} onChange={onOpenChange}>
            <AccordionSummary className={classes.accordionSummary} expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">{data.name}</Typography>

                <div style={{ flex: 1 }}></div>
            </AccordionSummary>

            {expanded ? (
                <AccordionDetails className={classes.accordionDetails}>
                    <div style={{ width: '100%' }}>
                        {'tdp' in data ? (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    paddingBottom: '1rem'
                                }}
                            >
                                <NumberInput
                                    fieldInfo={{
                                        variant: 'outlined',
                                        label: 'TDP',
                                        value: data.tdp,
                                        size: 'small'
                                    }}
                                    onChange={(e) => {
                                        data.tdp = e.target.value;
                                        onDataChange(data);
                                    }}
                                />
                            </div>
                        ) : null}

                        {data?.tableData || data?.lazyLoadTableData ? (
                            <Table
                                data={data}
                                tableData={data.tableData}
                                tableConfig={tableConfig}
                                lazyLoadTableData={data.lazyLoadTableData}
                                onFetchTableData={onFetchTableData}
                                onChange={(e) => {
                                    data.tableData.rowData = e;
                                    onDataChange(data);
                                }}
                                onDataLoad={(e) => {
                                    data.tableData = e;
                                    onDataChange(data);
                                }}
                                validations={data?.validations}
                                onTriggerNotification={onTriggerNotification}
                            />
                        ) : null}
                        {data?.accordions?.map((el, i) => (
                            <NestedAccordian
                                key={el.name + i}
                                data={el}
                                tableConfig={tableConfig}
                                expanded={childExpanded === el.name}
                                classes={classes}
                                onFetchTableData={onFetchTableData}
                                onDataChange={(e) => {
                                    Object.assign(el, e);
                                    onDataChange(data);
                                }}
                                onOpenChange={() =>
                                    setChildExpanded((e) => (e !== el.name ? el.name : false))
                                }
                                onTriggerNotification={onTriggerNotification}
                            />
                        ))}
                    </div>
                </AccordionDetails>
            ) : null}
        </Accordion>
    );
}

function Table({
    data,
    tableData,
    tableConfig,
    lazyLoadTableData,
    onChange,
    onDataLoad,
    onFetchTableData,
    validations,
    onTriggerNotification
}) {
    const [tableParams, setTableParams] = useState({ ...tableConfig, ...tableData });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async function () {
            if (lazyLoadTableData && !tableData) {
                try {
                    const resp = await onFetchTableData({ actionType: lazyLoadTableData, data });
                    setTableParams((s) => ({ ...s, ...resp }));
                    onDataLoad(resp);
                } catch (err) {
                    /* empty */
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadData();
    }, [lazyLoadTableData, tableData, onFetchTableData, data, onDataLoad]);

    return (
        <div>
            {loading ? (
                <CodxCircularLoader center size={90} />
            ) : (
                <GridTable
                    params={tableParams}
                    onRowDataChange={onChange}
                    onAction={() => {}}
                    validations={validations}
                    onTriggerNotification={onTriggerNotification}
                />
            )}
        </div>
    );
}

function SaveScenarioConfirmation({ open, classes, onClose, onAction, defaultScenarioName }) {
    // const [params, setParams] = useState({
    //     title: "",
    //     fields: [
    //         {
    //             id: 1,
    //             name: "scenarioName",
    //             type: "text",
    //             label: "Scenario name *",
    //             grid: "10",
    //             variant: "outlined",
    //             fullWidth: true,
    //             value: ""
    //         }
    //     ]
    // });
    const [scenarioName, setScenarioName] = useState();
    const [error, setError] = useState('');
    const [defaultName, setDefaultName] = useState(defaultScenarioName);
    const handleAction = async (e) => {
        if (e.name === 'Cancel') {
            onClose();
            setScenarioName();
            setError('');
            setDefaultName(defaultScenarioName);
        } else {
            try {
                if (!(scenarioName || defaultName)) {
                    setError('Please Enter Scenario Name');
                } else {
                    onClose();
                    setScenarioName();
                    setError('');
                    await onAction({ scenarioName: scenarioName || defaultName });
                    setDefaultName(defaultScenarioName);
                    // if (resp?.nameConflict) {
                    //     setError("Name already exists.")
                    // } else {
                    //     onClose();
                    //     setScenarioName()
                    //     setError("")
                    //     setDefaultName(defaultScenarioName)
                    // }
                }
            } catch (err) {
                /* empty */
            }
        }
    };

    const onChangeScenarioName = (v) => {
        setError('');
        setScenarioName(v);
        setDefaultName(v);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth aria-labelledby="save-scenario">
            <DialogTitle id="save-scenario">
                <Typography variant="h4" className={classes.defaultColor}>
                    Save Scenario
                </Typography>
            </DialogTitle>
            <DialogContent>
                <TextInput
                    fieldInfo={{
                        name: 'scenarioName',
                        label: 'Scenario name',
                        required: true,
                        variant: 'outlined',
                        fullWidth: true,
                        value: defaultScenarioName
                    }}
                    onChange={onChangeScenarioName}
                />
                {/* <DynamicForm params={params} onChange={setData} /> */}
            </DialogContent>
            <DialogActions className={classes.actionsStyle} disableSpacing={true}>
                <Typography className={classes.confirmationError}>{error}</Typography>
                <ActionButtons
                    params={[{ name: 'Cancel' }, { name: 'Save', variant: 'contained' }]}
                    onClick={handleAction}
                />
            </DialogActions>
        </Dialog>
    );
}
