import React, { useState, Fragment } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    makeStyles
} from '@material-ui/core';
import CollapsibleTable from './CollapsibleTable';
import ActionButtons from '../dynamic-form/inputFields/ActionButtons';
import TextInput from '../dynamic-form/inputFields/textInput';
// import KpiCard from '../KpiCard';

const useStyles = makeStyles(() => ({
    collapsibleTable: {
        marginBottom: '2rem'
    }
}));

export default function AlternateSimulatorTypeF({ params, onAction, onTriggerNotification }) {
    const classes = useStyles();
    const [state, setState] = useState(JSON.parse(JSON.stringify(params)));
    const [collapsibleTable, setCollapsibleTable] = useState(state.collapsibleTable);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [defaultScenarioName, setDefaultScenarioName] = useState(
        params.actions.find((el) => el.customAction === 'saveScenarioName').scenarioName
    );

    const handleAction = async (e) => {
        if (e.customAction === 'saveScenarioName') {
            setOpenConfirmation(true);
            setDefaultScenarioName(e.scenarioName);
        } else {
            if (e.customAction === 'reset') {
                onTriggerNotification({
                    notification: {
                        message: 'Data Reset To Default',
                        severity: 'info'
                    }
                });
            } else {
                onTriggerNotification({
                    notification: {
                        message: 'Applying the Data',
                        severity: 'info'
                    }
                });
            }
            try {
                const resp = await onAction({
                    actionType: e.name,
                    data: {
                        collapsibleTable: { ...collapsibleTable }
                    }
                });
                if (resp?.message) {
                    onTriggerNotification({
                        notification: {
                            message: resp.message,
                            severity: resp?.error ? 'error' : 'success'
                        }
                    });
                }
                setState((s) => ({ ...s, ...resp }));
            } catch (err) {
                console.error(err);
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
                actionType: state.actions.find((el) => el.customAction === 'saveScenarioName').name,
                data: {
                    collapsibleTable: { ...collapsibleTable },
                    ...e
                }
            });
            if (resp?.message) {
                onTriggerNotification({
                    notification: {
                        message: resp.message,
                        severity: resp?.error ? 'error' : 'success'
                    }
                });
            }
            setState((s) => ({ ...s, ...resp }));
            return resp;
        } catch (err) {
            console.error(err);
        }
    };

    const onRowDataChange = (e) => {
        setCollapsibleTable((s) => ({
            ...s,
            rows: {
                ...s.rows,
                ...e
            }
        }));
    };

    const handleCollapsibleTableToggleButtonClick = async (params) => {
        let toggleButtonPayload = { ...params, data: { ...params.data } };
        try {
            await onAction(toggleButtonPayload);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <Fragment>
            {/* {state?.kpi_metrics_data ? <KpiCard params={state.kpi_metrics_data} /> : null} */}
            <CollapsibleTable
                params={collapsibleTable}
                onRowDataChange={onRowDataChange}
                onToggleButtonClick={handleCollapsibleTableToggleButtonClick}
            />
            <div style={{ paddingTop: '1rem' }}>
                <ActionButtons params={state?.actions} onClick={handleAction} />
            </div>
            <SaveScenarioConfirmation
                open={openConfirmation}
                classes={classes}
                onClose={() => setOpenConfirmation(false)}
                onAction={handleConfirmation}
                defaultScenarioName={defaultScenarioName}
            />
        </Fragment>
    );
}

function SaveScenarioConfirmation({ open, classes, onClose, onAction, defaultScenarioName }) {
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
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const onChangeScenarioName = (v) => {
        setError('');
        setScenarioName(v);
        setDefaultName(v);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>
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
