import React, { useEffect, useState } from 'react';
import {
    Button,
    Grid,
    IconButton,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Snackbar,
    Box
} from '@material-ui/core';
import SimpleSelect from '../../../dynamic-form/inputFields/select';
import { alpha, lighten, withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import clsx from 'clsx';
import defaultMinervaConsumerData from './minervaConsumerDefault.json';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import TextInput from '../../../dynamic-form/inputFields/textInput';
import { FileCopyOutlined } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: lighten(theme.palette.primary.main, 0.05),
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        fontWeight: 'bold',
        borderBottom: 0,
        '&:not(:last-child)': {
            borderRight: '1px solid ' + alpha(theme.palette.text.default, 0.4)
        },
        boxShadow: '0px 2px 2px -1px rgba(0,0,0,0.4)'
    },
    body: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        padding: '2rem 1.6rem',
        opacity: 1,
        borderBottom: '1px solid ' + alpha(theme.palette.text.default, 0.4),
        backgroundColor: theme.palette.primary.light,
        '&:not(:last-child)': {
            borderRight: '1px solid ' + alpha(theme.palette.text.default, 0.4)
        }
    }
}))(TableCell);

function MinervaConsumerConfig({
    accessKey,
    consumerData,
    copilotAppOptions,
    updateConsumerConfig,
    // allowedOriginError,
    ...props
}) {
    const { classes } = props;
    const [consumerConfigObj, setConsumerConfigObj] = useState({
        ...consumerData
    });
    const [agentCounter, setAgentCounter] = useState(1);
    const [snackbar, setSnackbar] = useState({
        open: false
    });
    const [rootPropsList, setRootPropsList] = useState([]);

    useEffect(() => {
        setConsumerConfigObj(consumerData);
        if (consumerData['auth_agents'].length) {
            setAgentCounter(consumerData['auth_agents'].length);
        }
        const rootProps = consumerData.features?.rootProps || {};
        if (!rootPropsList.length) {
            setRootPropsList(
                Object.keys(rootProps).map((key, i) => ({
                    key: key,
                    value: rootProps[key],
                    id: key + i
                }))
            );
        }
    }, [consumerData]);

    const onHandleFieldChange = (field, value) => {
        let temp = { ...consumerConfigObj };
        temp[field] = value;
        handleConsumerFormUpdate(temp);
    };

    const onHandleAuthAgentChange = (field, agentType, id) => {
        const temp = { ...consumerConfigObj };
        let agents = [...temp['auth_agents']];
        agents[id] = {
            ...agents[id],
            type: agentType,
            config: defaultMinervaConsumerData['authAgentConfiguration'][agentType]
        };
        temp['auth_agents'] = agents;
        handleConsumerFormUpdate(temp);
    };

    const onHandleAgentConfigChange = (field, agentId, agentConfig) => {
        let temp = { ...consumerConfigObj };

        let config = temp.auth_agents[agentId]['config'];
        if (field === 'azure_tenant_id') {
            config = {
                ...config,
                tenant_id: agentConfig
            };
        } else if (field === 'azure_audience' || field === 'cognito_audience') {
            config = {
                ...config,
                audience: agentConfig
            };
        } else if (field === 'cognito_region') {
            config = {
                ...config,
                region: agentConfig
            };
        } else if (field === 'cognito_user_pool_id') {
            config = {
                ...config,
                user_pool_id: agentConfig
            };
        } else if (field === 'jwt_public_key') {
            config = {
                ...config,
                public_key: agentConfig
            };
        } else if (field === 'jwt_algorithm') {
            config = {
                ...config,
                jwt_algorithm: agentConfig
            };
        } else if (field === 'email_property_key') {
            config = {
                ...config,
                email_property_key: agentConfig
            };
        }
        temp['auth_agents'][agentId]['config'] = config;

        handleConsumerFormUpdate(temp);
    };

    const handleRemoveAuthAgent = (id) => {
        const temp = { ...consumerConfigObj };
        let agents = temp['auth_agents'];

        if (agents.length > id) {
            const deletedAgent = agents[id];
            const updatedAgents = agents.filter(
                (item, index) => item.type !== deletedAgent.type || index !== id
            );
            temp['auth_agents'] = updatedAgents;
            handleConsumerFormUpdate(temp);
        }
        setAgentCounter(agentCounter - 1);
    };

    const handleConsumerFormUpdate = (formData) => {
        setConsumerConfigObj(formData);
        updateConsumerConfig(formData);
    };

    const handleRootPorpsUpdate = (ns) => {
        setRootPropsList(ns);
        const obj = ns.reduce((acc, b) => {
            if (b.key) {
                acc[b.key] = b.value;
            }
            return acc;
        }, {});
        const temp = { ...consumerConfigObj, features: consumerConfigObj?.features || {} };
        temp.features = {
            ...temp.features,
            rootProps: obj
        };
        handleConsumerFormUpdate(temp);
    };

    const handleRootPropsChange = (index, key, value) => {
        const ns = [...rootPropsList];
        ns[index][key] = value;
        handleRootPorpsUpdate(ns);
    };

    const removeRootProps = (index) => {
        const ns = [...rootPropsList];
        ns.splice(index, 1);
        handleRootPorpsUpdate(ns);
    };

    const handleAddRootProps = () => {
        const ns = [
            ...rootPropsList,
            { key: '', value: '', id: Date.now() + '_' + rootPropsList.length }
        ];
        handleRootPorpsUpdate(ns);
    };

    const requiredField = <sup>*</sup>;
    return (
        <Grid container spacing={2}>
            {accessKey && (
                <Grid item xs={12}>
                    <Paper
                        component={Box}
                        display="flex"
                        gridGap="1rem"
                        alignItems="center"
                        padding="0.4rem 1.6rem"
                        variant="outlined"
                    >
                        <Typography
                            variant="h6"
                            className={clsx(
                                classes.colorDefault,
                                classes.fontSize1,
                                classes.letterSpacing1
                            )}
                        >
                            Access Key :
                        </Typography>
                        <Typography
                            variant="h6"
                            className={clsx(
                                classes.colorContrast,
                                classes.fontSize1,
                                classes.letterSpacing1
                            )}
                        >
                            {accessKey}
                        </Typography>
                        <IconButton
                            title="Copy the access key"
                            className={classes.copyBtn}
                            onClick={() => {
                                navigator.clipboard.writeText(accessKey);
                                if (navigator.clipboard) {
                                    setSnackbar({
                                        open: true,
                                        message: 'Copied to clipboard !',
                                        severity: 'success'
                                    });
                                }
                            }}
                        >
                            <FileCopyOutlined fontSize="large" />
                        </IconButton>
                    </Paper>
                </Grid>
            )}
            <Grid item xs={6}>
                <Typography
                    variant="h6"
                    className={clsx(
                        classes.colorDefault,
                        classes.fontSize1,
                        classes.letterSpacing1
                    )}
                >
                    Consumer Name {requiredField}
                </Typography>
                <TextInput
                    fieldInfo={{
                        variant: 'outlined',
                        key: 'consumer_name',
                        value: consumerConfigObj.name ? consumerConfigObj.name : '',
                        fullWidth: true,
                        required: true,
                        // classes:{{ root: classes.inputRoot }},
                        InputLabelProps: { classes: { root: classes.inputLabel } },
                        InputProps: { classes: { input: classes.input } },
                        id: 'consumer-name'
                    }}
                    onChange={(val) => {
                        onHandleFieldChange('name', val);
                    }}
                />
            </Grid>
            <Grid item xs={6}>
                <Typography
                    variant="h6"
                    className={clsx(
                        classes.colorDefault,
                        classes.fontSize1,
                        classes.letterSpacing1
                    )}
                >
                    Consumer Description
                </Typography>
                <TextInput
                    fieldInfo={{
                        variant: 'outlined',
                        key: 'consumer_desc',
                        value: consumerConfigObj.desc ? consumerConfigObj.desc : '',
                        fullWidth: true,
                        required: true,
                        // classes:{{ root: classes.inputRoot }},
                        InputLabelProps: { classes: { root: classes.inputLabel } },
                        InputProps: { classes: { input: classes.input } },
                        id: 'consumer-desc'
                    }}
                    onChange={(val) => {
                        onHandleFieldChange('desc', val);
                    }}
                />
            </Grid>
            <Grid item xs={6}>
                <Typography
                    variant="h6"
                    className={clsx(
                        classes.colorDefault,
                        classes.fontSize1,
                        classes.letterSpacing1
                    )}
                >
                    Allowed Origins (Provide origins in comma separated format) {requiredField}
                </Typography>
                <TextInput
                    fieldInfo={{
                        variant: 'outlined',
                        key: 'consumer_allowed_origins',
                        value: consumerConfigObj.allowed_origins
                            ? consumerConfigObj.allowed_origins
                            : '',
                        fullWidth: true,
                        required: true,
                        // classes:{{ root: classes.inputRoot }},
                        InputLabelProps: { classes: { root: classes.inputLabel } },
                        InputProps: { classes: { input: classes.input } },
                        id: 'consumer-origins'
                        // error: allowedOriginError,
                        // helperText: allowedOriginError ? 'Provide origins in comma separated format' : '',
                    }}
                    onChange={(val) => {
                        onHandleFieldChange('allowed_origins', val);
                    }}
                />
            </Grid>
            <Grid item xs={6} className={classes.applicationSelect}>
                <Typography
                    variant="h6"
                    className={clsx(
                        classes.colorDefault,
                        classes.fontSize1,
                        classes.letterSpacing1
                    )}
                >
                    Ask NucliOS Applications {requiredField}
                </Typography>
                <SimpleSelect
                    onChange={(v) => {
                        onHandleFieldChange('copilot_apps', v);
                    }}
                    fieldInfo={{
                        options: copilotAppOptions,
                        optionValueKey: 'id',
                        optionLabelKey: 'name',
                        variant: 'outlined',
                        fullWidth: true,
                        // multiple: true,
                        value: consumerConfigObj.copilot_apps,
                        search: true
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper} style={{ maxHeight: '25rem' }}>
                    <Table stickyHeader className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Auth Agents</StyledTableCell>
                                <StyledTableCell>Configurations</StyledTableCell>
                                <StyledTableCell align="center">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from(Array(agentCounter)).map((item, index) => (
                                <TableRow key={'agent_' + index}>
                                    <StyledTableCell>
                                        <SimpleSelect
                                            onChange={(v) => {
                                                onHandleAuthAgentChange('agent_type', v, index);
                                            }}
                                            fieldInfo={{
                                                options:
                                                    defaultMinervaConsumerData.authAgentOptions,
                                                optionValueKey: 'id',
                                                optionLabelKey: 'name',
                                                variant: 'outlined',
                                                fullWidth: true,
                                                name: 'consumer agent',
                                                value: [
                                                    consumerConfigObj?.auth_agents[index]?.type
                                                ],
                                                id: consumerConfigObj?.auth_agents[index]?.type
                                            }}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Grid container spacing={1}>
                                            {consumerConfigObj['auth_agents'][index]?.type ===
                                                'azure_ad' && (
                                                <React.Fragment>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        className={classes.configFields}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            className={clsx(
                                                                classes.colorDefault,
                                                                classes.fontSize1,
                                                                classes.letterSpacing1,
                                                                classes.inputTitle
                                                            )}
                                                        >
                                                            Tenant Id {requiredField}
                                                        </Typography>
                                                        <TextInput
                                                            fieldInfo={{
                                                                variant: 'outlined',
                                                                key: 'azure_tenant_id_' + index,
                                                                value: consumerConfigObj
                                                                    ?.auth_agents[index]?.config
                                                                    ?.tenant_id
                                                                    ? consumerConfigObj.auth_agents[
                                                                          index
                                                                      ].config.tenant_id
                                                                    : '',
                                                                fullWidth: true,
                                                                required: true,
                                                                // classes:{{ root: classes.inputRoot }},
                                                                InputLabelProps: {
                                                                    classes: {
                                                                        root: classes.inputLabel
                                                                    }
                                                                },
                                                                InputProps: {
                                                                    classes: {
                                                                        input: classes.input
                                                                    }
                                                                },
                                                                id: 'azure-tenant-id',
                                                                disabled:
                                                                    !consumerConfigObj?.auth_agents[
                                                                        index
                                                                    ]?.type
                                                            }}
                                                            onChange={(val) => {
                                                                onHandleAgentConfigChange(
                                                                    'azure_tenant_id',
                                                                    index,
                                                                    val
                                                                );
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        className={classes.configFields}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            className={clsx(
                                                                classes.colorDefault,
                                                                classes.fontSize1,
                                                                classes.letterSpacing1,
                                                                classes.inputTitle
                                                            )}
                                                        >
                                                            Audience {requiredField}
                                                        </Typography>
                                                        <TextInput
                                                            fieldInfo={{
                                                                variant: 'outlined',
                                                                key: 'azure_audience_' + index,
                                                                value:
                                                                    consumerConfigObj?.auth_agents[
                                                                        index
                                                                    ]?.config?.audience || '',
                                                                fullWidth: true,
                                                                required: true,
                                                                // classes:{{ root: classes.inputRoot }},
                                                                InputLabelProps: {
                                                                    classes: {
                                                                        root: classes.inputLabel
                                                                    }
                                                                },
                                                                InputProps: {
                                                                    classes: {
                                                                        input: classes.input
                                                                    }
                                                                },
                                                                id: 'azure-client-id',
                                                                disabled:
                                                                    !consumerConfigObj?.auth_agents[
                                                                        index
                                                                    ]?.type
                                                            }}
                                                            onChange={(val) => {
                                                                onHandleAgentConfigChange(
                                                                    'azure_audience',
                                                                    index,
                                                                    val
                                                                );
                                                            }}
                                                        />
                                                    </Grid>
                                                </React.Fragment>
                                            )}
                                            {consumerConfigObj['auth_agents'][index]?.type ===
                                                'cognito' && (
                                                <React.Fragment>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        className={classes.configFields}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            className={clsx(
                                                                classes.colorDefault,
                                                                classes.fontSize1,
                                                                classes.letterSpacing1,
                                                                classes.inputTitle
                                                            )}
                                                        >
                                                            Region {requiredField}
                                                        </Typography>
                                                        <TextInput
                                                            fieldInfo={{
                                                                variant: 'outlined',
                                                                key: 'cognito_region_' + index,
                                                                value: consumerConfigObj
                                                                    ?.auth_agents[index]?.config
                                                                    ?.region
                                                                    ? consumerConfigObj.auth_agents[
                                                                          index
                                                                      ].config.region
                                                                    : '',
                                                                fullWidth: true,
                                                                required: true,
                                                                // classes:{{ root: classes.inputRoot }},
                                                                InputLabelProps: {
                                                                    classes: {
                                                                        root: classes.inputLabel
                                                                    }
                                                                },
                                                                InputProps: {
                                                                    classes: {
                                                                        input: classes.input
                                                                    }
                                                                },
                                                                id: 'cognito-region',
                                                                disabled:
                                                                    !consumerConfigObj?.auth_agents[
                                                                        index
                                                                    ]?.type
                                                            }}
                                                            onChange={(val) => {
                                                                onHandleAgentConfigChange(
                                                                    'cognito_region',
                                                                    index,
                                                                    val
                                                                );
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        className={classes.configFields}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            className={clsx(
                                                                classes.colorDefault,
                                                                classes.fontSize1,
                                                                classes.letterSpacing1,
                                                                classes.inputTitle
                                                            )}
                                                        >
                                                            User pool id {requiredField}
                                                        </Typography>
                                                        <TextInput
                                                            fieldInfo={{
                                                                variant: 'outlined',
                                                                key: 'user_pool_id_' + index,
                                                                value: consumerConfigObj
                                                                    ?.auth_agents[index]?.config
                                                                    ?.user_pool_id
                                                                    ? consumerConfigObj.auth_agents[
                                                                          index
                                                                      ].config.user_pool_id
                                                                    : '',
                                                                fullWidth: true,
                                                                required: true,
                                                                // classes:{{ root: classes.inputRoot }},
                                                                InputLabelProps: {
                                                                    classes: {
                                                                        root: classes.inputLabel
                                                                    }
                                                                },
                                                                InputProps: {
                                                                    classes: {
                                                                        input: classes.input
                                                                    }
                                                                },
                                                                id: 'cognito-userpool-id',
                                                                disabled:
                                                                    !consumerConfigObj?.auth_agents[
                                                                        index
                                                                    ]?.type
                                                            }}
                                                            onChange={(val) => {
                                                                onHandleAgentConfigChange(
                                                                    'cognito_user_pool_id',
                                                                    index,
                                                                    val
                                                                );
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        className={classes.configFields}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            className={clsx(
                                                                classes.colorDefault,
                                                                classes.fontSize1,
                                                                classes.letterSpacing1,
                                                                classes.inputTitle
                                                            )}
                                                        >
                                                            Audience {requiredField}
                                                        </Typography>
                                                        <TextInput
                                                            fieldInfo={{
                                                                variant: 'outlined',
                                                                key: 'cognito_audience_' + index,
                                                                value:
                                                                    consumerConfigObj?.auth_agents[
                                                                        index
                                                                    ]?.config?.audience || '',
                                                                fullWidth: true,
                                                                required: true,
                                                                // classes:{{ root: classes.inputRoot }},
                                                                InputLabelProps: {
                                                                    classes: {
                                                                        root: classes.inputLabel
                                                                    }
                                                                },
                                                                InputProps: {
                                                                    classes: {
                                                                        input: classes.input
                                                                    }
                                                                },
                                                                id: 'cognito-userpool-id',
                                                                disabled:
                                                                    !consumerConfigObj?.auth_agents[
                                                                        index
                                                                    ]?.type
                                                            }}
                                                            onChange={(val) => {
                                                                onHandleAgentConfigChange(
                                                                    'cognito_audience',
                                                                    index,
                                                                    val
                                                                );
                                                            }}
                                                        />
                                                    </Grid>
                                                </React.Fragment>
                                            )}
                                            {consumerConfigObj['auth_agents'][index]?.type ===
                                                'jwt' && (
                                                <React.Fragment>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        className={classes.configFields}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            className={clsx(
                                                                classes.colorDefault,
                                                                classes.fontSize1,
                                                                classes.letterSpacing1,
                                                                classes.inputTitle
                                                            )}
                                                        >
                                                            Public Key
                                                        </Typography>
                                                        <TextInput
                                                            fieldInfo={{
                                                                variant: 'outlined',
                                                                key: 'jwt_public_key_' + index,
                                                                value: consumerConfigObj
                                                                    ?.auth_agents[index]?.config
                                                                    ?.public_key
                                                                    ? consumerConfigObj.auth_agents[
                                                                          index
                                                                      ].config.public_key
                                                                    : '',
                                                                fullWidth: true,
                                                                required: true,
                                                                // classes:{{ root: classes.inputRoot }},
                                                                InputLabelProps: {
                                                                    classes: {
                                                                        root: classes.inputLabel
                                                                    }
                                                                },
                                                                InputProps: {
                                                                    classes: {
                                                                        input: classes.input
                                                                    }
                                                                },
                                                                id: 'jwt-public-key',
                                                                disabled:
                                                                    !consumerConfigObj?.auth_agents[
                                                                        index
                                                                    ]?.type,
                                                                multiline: true,
                                                                maxRows: 2
                                                            }}
                                                            onChange={(val) => {
                                                                onHandleAgentConfigChange(
                                                                    'jwt_public_key',
                                                                    index,
                                                                    val
                                                                );
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        className={classes.configFields}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            className={clsx(
                                                                classes.colorDefault,
                                                                classes.fontSize1,
                                                                classes.letterSpacing1,
                                                                classes.inputTitle
                                                            )}
                                                        >
                                                            Algorithm
                                                        </Typography>
                                                        <TextInput
                                                            fieldInfo={{
                                                                variant: 'outlined',
                                                                key: 'jwt_algorithm_' + index,
                                                                value: consumerConfigObj
                                                                    ?.auth_agents[index]?.config
                                                                    ?.jwt_algorithm
                                                                    ? consumerConfigObj.auth_agents[
                                                                          index
                                                                      ].config.jwt_algorithm
                                                                    : '',
                                                                fullWidth: true,
                                                                InputLabelProps: {
                                                                    classes: {
                                                                        root: classes.inputLabel
                                                                    }
                                                                },
                                                                InputProps: {
                                                                    classes: {
                                                                        input: classes.input
                                                                    }
                                                                },
                                                                id: 'jwt-algorithm',
                                                                disabled:
                                                                    !consumerConfigObj?.auth_agents[
                                                                        index
                                                                    ]?.type
                                                            }}
                                                            onChange={(val) => {
                                                                onHandleAgentConfigChange(
                                                                    'jwt_algorithm',
                                                                    index,
                                                                    val
                                                                );
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        className={classes.configFields}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            className={clsx(
                                                                classes.colorDefault,
                                                                classes.fontSize1,
                                                                classes.letterSpacing1,
                                                                classes.inputTitle
                                                            )}
                                                        >
                                                            Email id key {requiredField}
                                                        </Typography>
                                                        <TextInput
                                                            fieldInfo={{
                                                                variant: 'outlined',
                                                                key: 'email_property_key_' + index,
                                                                value: consumerConfigObj
                                                                    ?.auth_agents[index]?.config
                                                                    ?.email_property_key
                                                                    ? consumerConfigObj.auth_agents[
                                                                          index
                                                                      ].config.email_property_key
                                                                    : '',
                                                                required: true,
                                                                fullWidth: true,
                                                                InputLabelProps: {
                                                                    classes: {
                                                                        root: classes.inputLabel
                                                                    }
                                                                },
                                                                InputProps: {
                                                                    classes: {
                                                                        input: classes.input
                                                                    }
                                                                },
                                                                id: 'email-property-key',
                                                                disabled:
                                                                    !consumerConfigObj?.auth_agents[
                                                                        index
                                                                    ]?.type
                                                            }}
                                                            onChange={(val) => {
                                                                onHandleAgentConfigChange(
                                                                    'email_property_key',
                                                                    index,
                                                                    val
                                                                );
                                                            }}
                                                        />
                                                    </Grid>
                                                </React.Fragment>
                                            )}
                                        </Grid>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton
                                            disabled={agentCounter === 1}
                                            onClick={() => handleRemoveAuthAgent(index)}
                                            className={classes.deleteBtn}
                                        >
                                            <DeleteOutlinedIcon fontSize="large" />
                                        </IconButton>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    style={{ float: 'right' }}
                    onClick={() => {
                        setAgentCounter(agentCounter + 1);
                    }}
                    startIcon={<AddIcon />}
                >
                    Add Auth Agents
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper} style={{ maxHeight: '25rem' }}>
                    <Table stickyHeader className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Web Component Root Props</StyledTableCell>
                                <StyledTableCell>Value</StyledTableCell>
                                <StyledTableCell align="center">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rootPropsList.map((el, index) => (
                                <TableRow key={el.id}>
                                    <StyledTableCell>
                                        <TextInput
                                            fieldInfo={{
                                                variant: 'outlined',
                                                value: el.key,
                                                fullWidth: true,
                                                placeholder: 'Prop Name',
                                                InputLabelProps: {
                                                    classes: {
                                                        root: classes.inputLabel
                                                    }
                                                },
                                                InputProps: {
                                                    classes: {
                                                        input: classes.input
                                                    }
                                                }
                                            }}
                                            onChange={(val) => {
                                                handleRootPropsChange(index, 'key', val);
                                            }}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <TextInput
                                            fieldInfo={{
                                                variant: 'outlined',
                                                value: el.value,
                                                fullWidth: true,
                                                placeholder: 'Prop Value',
                                                InputLabelProps: {
                                                    classes: {
                                                        root: classes.inputLabel
                                                    }
                                                },
                                                InputProps: {
                                                    classes: {
                                                        input: classes.input
                                                    }
                                                }
                                            }}
                                            onChange={(val) => {
                                                handleRootPropsChange(index, 'value', val);
                                            }}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton
                                            onClick={() => {
                                                removeRootProps(index);
                                            }}
                                            className={classes.deleteBtn}
                                        >
                                            <DeleteOutlinedIcon fontSize="large" />
                                        </IconButton>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    style={{ float: 'right' }}
                    onClick={handleAddRootProps}
                    startIcon={<AddIcon />}
                >
                    Add Root Prop
                </Button>
            </Grid>
            <Snackbar
                key="snackbar"
                open={snackbar.open}
                message={snackbar.message}
                autoHideDuration={1500}
                onClose={() => {
                    setSnackbar({
                        open: false
                    });
                }}
                severity={snackbar.severity}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                className={classes.snackbar}
            />
        </Grid>
    );
}

const styles = (theme) => ({
    paper: {
        background: theme.palette.primary.main
    },
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    inputLabel: {
        color: theme.palette.text.default,
        padding: theme.spacing(1),
        fontSize: '1.5rem'
    },
    inputRoot: {
        '& label.Mui-focused': {
            color: theme.palette.text.default
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.text.default
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: `${alpha(theme.palette.text.default, 0.7)} !important`
        },
        '& .MuiInput:after': {
            borderBottomColor: 'transparent'
        },
        '& svg': {
            color: theme.palette.text.default
        },
        padding: theme.spacing(1),
        backgroundColor: theme.palette.primary.dark,
        borderRadius: theme.spacing(0.5),
        color: theme.palette.text.default,
        marginBottom: theme.spacing(2),
        '& .MuiFormHelperText-root': {
            color: theme.palette.error.dark,
            fontSize: '1.25rem',
            fontStyle: 'italic'
        }
    },
    input: {
        color: theme.palette.text.contrastText,
        fontSize: '1.5rem'
        // padding: '1.5rem'
    },
    colorDefault: {
        color: theme.palette.text.default
    },
    colorContrast: {
        color: theme.palette.text.contrastText
    },
    letterSpacing1: {
        letterSpacing: '0.02em'
    },
    fontSize1: {
        fontSize: '1.6rem'
    },
    button: {
        margin: '0em 2em',
        width: '11em'
    },
    separator: {
        borderBottom: '1px solid',
        opacity: 0.2,
        borderColor: theme.palette.text.titleText,
        margin: '1.5rem 0rem'
    },
    deleteBtn: {
        marginRight: 0,
        '& .MuiIconButton-label svg': {
            color: theme.palette.text.default
        },
        '&.Mui-disabled': {
            '& .MuiIconButton-label svg': {
                opacity: '0.5'
            }
        }
    },
    snackbar: {
        '& .MuiSnackbarContent-root': {
            backgroundColor: theme.palette.primary.contrastText,
            '& .MuiSnackbarContent-message': {
                fontSize: '1.75rem',
                color: theme.palette.text.breadcrumbText
            }
        }
    },
    copyBtn: {
        backgroundColor: 'transparent !important'
    },
    configFields: {
        display: 'flex',
        gap: '1rem'
    },
    inputTitle: {
        flexBasis: '13rem',
        alignSelf: 'center'
    }
});

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(MinervaConsumerConfig);
