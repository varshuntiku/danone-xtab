import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import { styles } from '../Styles/ExecutionEnvStyles';
import { updateExecEnv } from '../../../services/execution_environments_utils';
import { packageListPayload } from 'constants/execution-workbench';
import * as _ from 'underscore';
import ExecutionEnvironmentConfigurator from './ExecutionEnvironmentConfigurator';
import ExecutionEnvironmentContext from '../context/ExecutionEnvironmentContext';

function UpdateEnv(props) {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const { classes } = props;
    const execEnvContextData = execEnvContext.data;
    const [state, setState] = useState({
        open: execEnvContext.data.showEditWin
    });

    const setOpen = (value) => {
        setState((prevState) => ({
            ...prevState,
            open: value
        }));
        execEnvContext.updateContext({
            showEditWin: value,
            disableCreateExecEnvBtn: false,
            isListLoading: false,
            envWinTitle: 'Update Environment',
            error_in_name: false,
            packageLists: props.dynamicExecEnv?.packages || [],
            details: {
                id: props.dynamicExecEnv?.id || '',
                name: props.dynamicExecEnv?.name || '',
                py_version: props.dynamicExecEnv?.py_version || '',
                run_time_version: props.dynamicExecEnv?.run_time_version || null,
                packages: props.dynamicExecEnv?.packages || []
            }
        });
    };

    const cancel = () => {
        setOpen(false);
    };

    const close = () => {
        setOpen(false);
    };

    const updateEnvironment = () => {
        execEnvContext.updateContext({
            isListLoading: true,
            disableCreateExecEnvBtn: true,
            execEnvWinMessage: 'Updating Environment...'
        });

        let payload = {
            ...packageListPayload,
            name: execEnvContextData.details.name,
            packages: execEnvContextData.packageLists
        };
        updateExecEnv({
            payload,
            callback: onResponseUpdateExecEnvs,
            execEnvUpdateId: execEnvContextData.details.id
        });
    };

    const onResponseUpdateExecEnvs = (response_data, status = 'success') => {
        execEnvContext.updateContext({
            isListLoading: false,
            disableCreateExecEnvBtn: false,
            execEnvWinMessage: ''
        });
        if (status === 'error') {
            execEnvContext.updateContext({
                execEnvWinMessage: 'Failed to update Environment...!',
                details: {
                    ...execEnvContextData.details
                }
            });
            execEnvContext.buildErrorMessage(response_data, execEnvContextData.packageLists);
        } else {
            setOpen(false);
            execEnvContext.updateContext({
                isListLoading: true,
                loadMaskMsg: 'Fetching Environments...',
                mainExecEnvLoading: true,
                snackbar: {
                    open: true,
                    message: 'Environment updated..!',
                    severity: 'success'
                }
            });
            _.delay(
                () => {
                    refreshData();
                },
                500,
                ''
            );
        }
    };

    const refreshData = () => {
        props.fetchDynamicExecEnvList();
    };
    const addOrCreateEnv = updateEnvironment;
    const config = {
        state,
        setState,
        setOpen,
        cancel,
        close,
        addOrCreateEnv,
        isListLoading: execEnvContext.data.isListLoading,
        loadMaskMsg: state.loadMaskMsg,
        execEnvWinMessage: state.execEnvWinMessage
    };

    return (
        <ExecutionEnvironmentConfigurator
            classes={classes}
            componentConfig={config}
            createNewDynamicExecEnv={false}
            refreshExecEnvList={props.refreshExecEnvList}
            parentCmp={props.parentCmp}
            fetchDynamicExecEnvList={props.fetchDynamicExecEnvList}
            disabled={props.disabled}
        />
    );
}

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(UpdateEnv);
