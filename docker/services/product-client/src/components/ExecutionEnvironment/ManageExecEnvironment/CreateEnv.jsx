import React, { useContext, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import { styles } from '../Styles/ExecutionEnvStyles';
import {
    createExecEnv,
    getExecPackages,
    getSkuDropdownList
} from '../../../services/execution_environments_utils';
import * as _ from 'underscore';
import { packageListPayload } from 'constants/execution-workbench';
import ExecutionEnvironmentContext from '../context/ExecutionEnvironmentContext';
import { Typography, Link } from '@material-ui/core';

import ExecEnvTypes from './ExecEnvTypes';
import SharedEnv from './SharedEnvs/SharedEnv';
import DedicatedEnv from './DedicatedEnvs/DedicatedEnv';
import CustomLoadMask from 'components/CustomLoadMask';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import BulkUpdate from '../BulkPackageEditor/BulkUpdate';
import BrowseEnvironments from './BrowseEnvironments/BrowseEnvironments';
import CustomSnackbar from '../../CustomSnackbar';

function CreateEnv(props) {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const { updateContext } = execEnvContext;
    const execEnvContextData = execEnvContext.data;
    const { createNewEnv, browseEnv } = execEnvContextData;
    const browseEnvTypes = browseEnv.envTypes;
    const { envTypes } = createNewEnv;
    const { currentEnv } = envTypes;
    const { classes } = props;
    const [state, setState] = useState({
        open: execEnvContextData.showCreateNewEnv,
        details: {
            name: ''
        }
    });
    useEffect(() => {
        updateContext({
            envWinTitle: 'Create Environment',
            loadMaskMsg: 'Fetching package List'
        });
        getExePackagesList();
    }, []);

    const getExePackagesList = () => {
        getExecPackages({
            callback: onResponseGetExecPackagesList,
            env_category: execEnvContextData.currentEnvScreen
        });
    };

    const getSkuOptions = () => {
        getSkuDropdownList({
            callback: onResponseGetSkuDropdownList
        });
    };

    const onResponseGetExecPackagesList = (response_data, status = 'success') => {
        getSkuOptions();
        if (status === 'error') {
            setSnackbarStatus('Failed to fetch packagelist', 'error');
        } else {
            updateContext({
                packageLists: response_data.packages,
                createNewEnv: {
                    ...createNewEnv,
                    envTypes: {
                        ...envTypes,
                        [envTypes.currentEnv]: {
                            ...envTypes[envTypes.currentEnv],
                            packageLists: response_data.packages
                        }
                    }
                }
            });
        }
    };

    const onResponseGetSkuDropdownList = (response_data, status = 'success') => {
        updateContext({
            createEnvIsLoading: false,
            isListLoading: false
        });
        if (status === 'error') {
            setSnackbarStatus('Failed to fetch Sku List', 'error');
        } else {
            let defaultValue = '';
            let compute_id;
            const list = response_data.map((item, index) => {
                if (index === 0) {
                    defaultValue = item.name;
                    compute_id = item.id;
                }
                item.value = item.name;
                item.label = item.name;
                item.compute_id = item.id;
                return item;
            });
            updateContext({
                createNewEnv: {
                    ...createNewEnv,
                    envTypes: {
                        ...envTypes,
                        dedicated_env: {
                            ...envTypes.dedicated_env,
                            sku: {
                                defaultValue,
                                list,
                                compute_id
                            }
                        }
                    }
                }
            });
        }
    };

    const setSnackbarStatus = (message, severity = 'success') => {
        setState((prevState) => ({
            ...prevState,
            snackbar: {
                ...prevState.snackbar,
                open: true,
                message: message,
                severity: severity
            }
        }));
        updateContext({
            createEnvIsLoading: false
        });
    };

    const setOpen = () => {
        cancel();
    };

    const cancel = () => {
        updateContext({
            showCreateNewEnv: false,
            error_in_name: false
        });
    };

    const close = () => {
        cancel();
    };

    const createEnvironment = () => {
        execEnvContext.updateContext({
            createEnvIsLoading: true,
            disableCreateExecEnvBtn: true,
            execEnvName: '',
            isListLoading: true,
            loadMaskMsg: 'Creating new Environment...'
        });
        execEnvContextData.packageLists = execEnvContextData.packageLists.map((item) => {
            return {
                id: item.id,
                name: item.name,
                version: item.version
            };
        });
        let pkgLists = browseEnvTypes[currentEnv].packageLists || execEnvContextData.packageLists;

        let payload = {
            ...packageListPayload,
            name: envTypes[envTypes.currentEnv].envName,
            packages: pkgLists,
            env_category: execEnvContextData.allowEnvCreationFromDS
                ? 'ds_workbench'
                : 'uiac_executor',
            compute_type:
                execEnvContextData.createNewEnv.envTypes.currentEnv === 'shared_env'
                    ? 'shared'
                    : 'dedicated',
            index_url: envTypes[envTypes.currentEnv].indexUrl
        };
        if (execEnvContextData.createNewEnv.envTypes.currentEnv !== 'shared_env') {
            payload['compute_id'] =
                execEnvContextData.createNewEnv.envTypes.dedicated_env.sku.compute_id;
        }
        if (execEnvContextData.ds_project_id) {
            payload['project_id'] = execEnvContextData.ds_project_id;
        }
        createExecEnv({
            payload,
            callback: onResponseCreateExecEnvs
        });
    };

    const onResponseCreateExecEnvs = (response_data, status = 'success') => {
        const envType = {
            ...envTypes,
            [currentEnv]: {
                ...envTypes[currentEnv],
                execEnvWinMessage: ''
            }
        };
        updateContext({
            createEnvIsLoading: false,
            execEnvWinMessage: '',
            createNewEnv: {
                ...createNewEnv,
                envTypes: {
                    ...envType
                }
            }
        });
        if (status === 'error') {
            let isBuildError = false;
            let execEnvWinMessage = 'Failed to create new Environment...!';
            if (response_data.response.data.detail) {
                updateContext({
                    showCreateNewEnv: false,
                    isListLoading: false
                });
            } else if (response_data.response.data.exception_type === 'AlreadyExistException') {
                execEnvWinMessage =
                    response_data.response.data.error ||
                    'The Execution Environment with name already exist';
            } else {
                if (response_data.response.data.errors) {
                    isBuildError = true;
                }
                execEnvContext.buildErrorMessage(response_data, execEnvContextData.packageLists);
            }
            updateContext({
                createEnvIsLoading: false,
                disableCreateExecEnvBtn: false,
                execEnvWinMessage: execEnvWinMessage,
                isListLoading: false,
                showBulkEditCmp: isBuildError,
                packageError: isBuildError,
                createNewEnv: {
                    ...createNewEnv,
                    envTypes: {
                        ...envTypes,
                        [currentEnv]: {
                            ...envTypes[currentEnv],
                            execEnvWinMessage: execEnvWinMessage
                        }
                    }
                },
                snackbar: {
                    open: true,
                    message: 'New Environment Creation Failed...!',
                    severity: 'error'
                }
            });
        } else {
            setState((prevState) => ({
                ...prevState,
                open: false
            }));
            updateContext({
                showCreateNewEnv: false,
                createEnvIsLoading: true,
                loadMaskMsg: 'Fetching Environments...',
                mainExecEnvLoading: true,
                error_in_name: false,
                mainExecEnvLoadMask: 'Fetching Environments',
                snackbar: {
                    open: true,
                    message: 'New Environment Created..!',
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
    const cancelShowBulkUpdate = () => {
        execEnvContext.updateContext({
            showBulkEditCmp: false
        });
    };

    const showBrowseEnv = () => {
        updateContext({
            showBrowseEnv: true
        });
    };

    const addOrCreateEnv = createEnvironment;

    const config = {
        state,
        setState,
        setOpen,
        cancel,
        close,
        addOrCreateEnv,
        isListLoading: execEnvContextData.createEnvIsLoading,
        loadMaskMsg: execEnvContextData.loadMaskMsg,
        cancelShowBulkUpdate
    };

    return (
        <React.Fragment>
            <div className={classes.createEnvTopbar}>
                <div>
                    <ArrowBackIosRoundedIcon
                        fontSize="large"
                        className={classes.backIcon}
                        onClick={close}
                        titleAccess="Back to Environment List"
                    />
                    <Typography variant="h3" className={classes.createEnvHeader}>
                        {'Environment Creation'}
                    </Typography>
                </div>
                {execEnvContextData.currentEnvScreen !== 'ds_workbench' && (
                    <Link onClick={showBrowseEnv} className={classes.link}>
                        Browse Environments
                    </Link>
                )}
            </div>
            <hr className={classes.sepratorline} />

            {execEnvContextData.isListLoading ? (
                <CustomLoadMask loadMaskMsg={execEnvContext.data.loadMaskMsg} />
            ) : (
                <div className={classes.createEnvFormContainer}>
                    {' '}
                    {/* {!execEnvContextData.allowEnvCreationFromDS && ( */}
                    <ExecEnvTypes props={props} classes={classes} labelEnd={'Environment'} />
                    {/* )} */}
                    {browseEnvTypes[envTypes.currentEnv].cloneConfig && (
                        <Typography variant="h4">
                            Clone From : <b>{browseEnvTypes[envTypes.currentEnv].name}</b>
                        </Typography>
                    )}
                    <Typography className={classes.errorMsg} variant="h4">
                        {envTypes[currentEnv].execEnvWinMessage}
                    </Typography>
                    <div className={classes.formWrapper}>
                        {currentEnv === 'shared_env' && (
                            <SharedEnv
                                classes={classes}
                                props={props}
                                createEnvironment={createEnvironment}
                            />
                        )}
                        {currentEnv === 'dedicated_env' && (
                            <DedicatedEnv
                                classes={classes}
                                props={props}
                                createEnvironment={createEnvironment}
                            />
                        )}{' '}
                    </div>
                </div>
            )}
            <BulkUpdate props={config} classes={classes} />
            <BrowseEnvironments props={props} classes={classes} />
            <CustomSnackbar
                open={execEnvContext.data.snackbar.open}
                message={execEnvContext.data.snackbar.message}
                autoHideDuration={5000}
                onClose={() => {
                    execEnvContext.updateContext({
                        snackbar: {
                            open: false
                        }
                    });
                }}
                severity={execEnvContext.data.snackbar.severity}
            />
        </React.Fragment>
    );
}

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(CreateEnv);
