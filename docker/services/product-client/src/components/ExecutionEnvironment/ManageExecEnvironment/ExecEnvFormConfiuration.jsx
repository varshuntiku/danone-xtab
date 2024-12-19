import React, { useContext } from 'react';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import { Link, Typography } from '@material-ui/core';
import ExecutionEnvironmentContext from '../context/ExecutionEnvironmentContext';

function ExecEnvFormConfiuration(props) {
    const { classes } = props;
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const { updateContext } = execEnvContext;
    const { createNewEnv, browseEnv } = execEnvContext.data;
    const { envTypes } = createNewEnv;
    const { currentEnv } = envTypes;
    const browseEnvTypes = browseEnv.envTypes;
    const envType = envTypes[envTypes.currentEnv];

    const { envName, replicas, runTime, runTimeVersion, indexUrl } = envTypes[envTypes.currentEnv];

    const setBtnStatus = () => {
        const { envName, replicas, runTime, runTimeVersion } = envTypes[envTypes.currentEnv];
        let isDisable = true;
        const envType = envTypes[envTypes.currentEnv];
        if (envName && replicas && runTime && runTimeVersion) {
            isDisable = false;
        }
        updateContext({
            createNewEnv: {
                ...createNewEnv,
                envTypes: {
                    ...envTypes,
                    [envType.value]: {
                        ...envType,
                        disableCreateEnvBtn: isDisable
                    }
                }
            }
        });
    };

    const onFieldChange = (params) => {
        const { value, fieldId } = params;
        envType[fieldId] = '';
        if (value.trim() !== '') {
            envType[fieldId] = value.trim();
        }
        updateContext({
            createNewEnv: {
                ...createNewEnv,
                envTypes: {
                    ...envTypes,
                    [envType.value]: {
                        ...envType
                    }
                }
            }
        });
        setBtnStatus();
    };

    const formatPackage = (pkg) => {
        if (pkg.version === 'custom_package_url') {
            return pkg.name;
        }
        return `${pkg.name} == ${pkg.version}`;
    };

    const managePakages = () => {
        let pkgLists = browseEnvTypes[currentEnv].packageLists || execEnvContext.data.packageLists;
        const formattedPackageList = pkgLists.map((pkg) => formatPackage(pkg)).join('\n');
        updateContext({
            packageListForEditor: formattedPackageList,
            showBulkEditCmp: true
        });
    };

    const onChangeName = (value) => {
        const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])$/;
        let execEnvWinMessage = '';
        if (!regex.test(value) || value.length > 14) {
            execEnvWinMessage =
                "Environment names must consist only of lowercase alphanumeric characters or '-', start and end with an alphanumeric character, and be less than 15 characters in length";
        }

        envType['envName'] = '';
        if (value.trim() !== '') {
            envType['envName'] = value.trim();
        }
        updateContext({
            createNewEnv: {
                ...createNewEnv,
                envTypes: {
                    ...envTypes,
                    [envType.value]: {
                        ...envType,
                        execEnvFieldMsg: execEnvWinMessage,
                        disableCreateEnvBtn: execEnvWinMessage
                    }
                }
            }
        });
    };

    return (
        <React.Fragment>
            <CustomTextField
                key="name"
                parent_obj={props}
                field_info={{
                    label: 'Environment Name',
                    id: 'envName',
                    fullWidth: true,
                    required: true,
                    value: envName,
                    onChange: (value) => {
                        onChangeName(value);
                    }
                }}
            />
            <Typography variant="h4" style={{ color: 'red', alignSelf: 'flex-start' }}>
                {envTypes[envTypes.currentEnv].execEnvFieldMsg}
            </Typography>

            <CustomTextField
                key="replicas"
                parent_obj={props}
                field_info={{
                    label: 'Replicas',
                    id: 'replicas',
                    fullWidth: true,
                    required: true,
                    value: replicas,
                    disabled: true,
                    onChange: (value) => {
                        onFieldChange({
                            value,
                            fieldId: 'replicas'
                        });
                    }
                }}
            />
            <div className={classes.customTextFieldsContainer}>
                <CustomTextField
                    key="runtime"
                    parent_obj={props}
                    field_info={{
                        label: 'Run Time',
                        id: 'runTime',
                        fullWidth: true,
                        required: true,
                        value: runTime,
                        disabled: true,
                        onChange: (value) => {
                            onFieldChange({
                                value,
                                fieldId: 'runTime'
                            });
                        }
                    }}
                />
                <CustomTextField
                    key="runtimeversion"
                    parent_obj={props}
                    field_info={{
                        label: 'Run Time Version',
                        id: 'runTimeVersion',
                        fullWidth: true,
                        required: true,
                        disabled: true,
                        value: runTimeVersion,
                        onChange: (value) => {
                            onFieldChange({
                                value,
                                fieldId: 'runTimeVersion'
                            });
                        }
                    }}
                />
            </div>
            <div title="Index URL Field is Optional">
                <CustomTextField
                    parent_obj={props}
                    field_info={{
                        label: 'Index URL',
                        id: 'indexUrl',
                        fullWidth: true,
                        required: false,
                        value: indexUrl,
                        onChange: (value) => {
                            onFieldChange({
                                value,
                                fieldId: 'indexUrl'
                            });
                        }
                    }}
                />
            </div>
            <div className={classes.packageContainer}>
                <Typography className={classes.pkgTxt} variant="h4">
                    Package
                </Typography>
                <Link onClick={managePakages} className={classes.link}>
                    Manage Package
                </Link>
                <hr className={classes.borderLine} />
                <Typography
                    className={classes.pkgPlaceHolder}
                    variant="h4"
                >{`Click on "Manage Package" to add/delete/edit/view packages`}</Typography>
            </div>
        </React.Fragment>
    );
}

export default ExecEnvFormConfiuration;
