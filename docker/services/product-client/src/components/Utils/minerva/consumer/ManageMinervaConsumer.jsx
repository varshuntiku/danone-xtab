import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    DialogActions
} from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import CloseIcon from '../../../../assets/Icons/CloseBtn';
import {
    createMinervaConsumer,
    getConsumerById,
    updateMinervaConsumer
} from '../../../../services/minerva_utils';
import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import defaultMinervaConsumerData from './minervaConsumerDefault.json';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import MinervaConsumerConfig from './MinervaConsumerConfig';
import CustomSnackbar from '../../../CustomSnackbar';
import CodxCircularLoader from '../../../CodxCircularLoader';

function ManageMinervaConsumer(props) {
    const { classes } = props;
    const [consumerConfig, setConsumerConfig] = useState({
        ...defaultMinervaConsumerData.consumerData
    });
    const [copilotAppOptions, setCopilotAppOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false
    });
    const [isDisabled, setIsDisabled] = useState(true);
    // const [originError, setOriginError] = useState(false);
    const [counter, setCounter] = useState(1);
    const [createConsumer, setCreateConsumer] = useState(props.createNewConsumer);
    const [loading, setLoading] = useState(false);
    const [activeConsumer, setActiveConsumer] = useState({
        accessKey: props.access_key || '',
        id: props.consumerId
    });

    useEffect(() => {
        let configAppsOptions = props?.copilotApps?.map((item) => {
            return { name: item.name, id: item.id };
        });
        setCopilotAppOptions(configAppsOptions);
    }, [props.copilotApps]);

    const getConsumerData = () => {
        setLoading(true);
        getConsumerById({
            consumerId: activeConsumer.id,
            callback: onResponseGetConsumerById
        });
    };

    const onResponseGetConsumerById = (response_data, status = 'success') => {
        setLoading(false);
        if (status === 'error') {
            setSnackbar({
                ...snackbar,
                open: true,
                message: 'Failed to fetch consumer data',
                severity: 'error'
            });
        } else {
            const consumerData = {
                ...response_data,
                allowed_origins: response_data['allowed_origins'].join(','),
                copilot_apps: response_data['copilot_apps']?.[0]
            };
            setConsumerConfig(consumerData);
        }
    };

    const formatData = () => {
        let configData = { ...consumerConfig };

        // const isOriginValidInput = configData['allowed_origins'].replace(/\s+/g, '').includes(',');

        // if (isOriginValidInput) {
        //     configData['allowed_origins'] = configData['allowed_origins']
        //         .replace(/\s+/g, '')
        //         .split(',')
        //         .filter((element) => element);
        //     configData['minerva_apps'] = [configData['minerva_apps']];
        //     return configData;
        // } else {
        //     setOriginError(true);
        //     return null;
        // }
        configData['allowed_origins'] = configData['allowed_origins']
            .replace(/\s+/g, '')
            .split(',')
            .filter((element) => element);
        configData['copilot_apps'] = [configData['copilot_apps']];
        return configData;
    };

    const handleSaveConsumerConfig = () => {
        const consumerData = formatData();

        if (consumerData) {
            saveMinervaConsumer(consumerData);
        }
    };

    const saveMinervaConsumer = (config) => {
        setLoading(true);
        createMinervaConsumer({
            consumerData: config,
            callback: onResponseCreateMinervaConsumer
        });
    };

    const onResponseCreateMinervaConsumer = (response_data, status = 'success') => {
        // handleDialogClose();
        setLoading(false);
        if (
            status === 'error' ||
            (response_data.status_code && response_data.status_code === 500)
        ) {
            setSnackbar({
                open: true,
                message: 'Failed to create Ask NucliOS Consumer',
                severity: 'error'
            });
        } else {
            props.fetchMinervaConsumers();
            setSnackbar({
                open: true,
                message: 'Ask NucliOS Consumer created Successfully',
                severity: 'success'
            });
            preparePopupData(response_data);
        }
    };

    const handleUpdateConsumer = () => {
        const consumerData = formatData();

        if (consumerData) {
            updateConsumer(consumerData);
        }
    };

    const updateConsumer = (config) => {
        setLoading(true);
        updateMinervaConsumer({
            consumerId: activeConsumer.id,
            consumerData: config,
            callback: onResponseUpdateMinervaConsumer
        });
    };

    const onResponseUpdateMinervaConsumer = (response_data, status = 'success') => {
        // handleDialogClose();
        setLoading(false);
        if (
            status === 'error' ||
            (response_data.status_code && response_data.status_code === 500)
        ) {
            setSnackbar({
                open: true,
                message: 'Failed to update Ask NucliOS Consumer',
                severity: 'error'
            });
        } else {
            props.fetchMinervaConsumers();
            setSnackbar({
                open: true,
                message: 'Ask NucliOS Consumer updated Successfully',
                severity: 'success'
            });
            preparePopupData(response_data);
        }
    };

    const handleEditConsumer = () => {
        setOpen(true);
        getConsumerData();
    };

    const handleDialogClose = () => {
        setCounter(counter + 1);
        setOpen(false);
        setConsumerConfig({
            ...defaultMinervaConsumerData.consumerData
        });
        setIsDisabled(true);
        setActiveConsumer({
            accessKey: props.access_key || '',
            id: props.consumerId
        });
        setCreateConsumer(props.createNewConsumer);
    };

    const buttonDisableCheck = (consumerObj) => {
        const hasAgentConfigured = consumerObj.auth_agents.every((item) => {
            let isConfigured = false;
            if (item.type) {
                switch (item.type) {
                    case 'azure_ad':
                        isConfigured = Boolean(item.config['tenant_id'] && item.config['audience']);

                        break;
                    case 'cognito':
                        isConfigured = Boolean(
                            item.config['region'] &&
                                item.config['user_pool_id'] &&
                                item.config['audience']
                        );
                        break;
                    case 'jwt':
                        isConfigured = Boolean(item.config['email_property_key']);
                        break;
                    default:
                        //do nothing
                        break;
                }
                return isConfigured;
            }
        });
        const disable =
            !consumerObj.name ||
            !consumerObj.allowed_origins ||
            !consumerObj.copilot_apps ||
            consumerObj.auth_agents.length === 0 ||
            !hasAgentConfigured;

        setIsDisabled(disable);
    };

    const handleConsumerFormUpdate = (form_obj) => {
        buttonDisableCheck(form_obj);
        setConsumerConfig(form_obj);
    };

    const preparePopupData = (data) => {
        setConsumerConfig({
            name: data.name,
            desc: data.desc,
            allowed_origins: data['allowed_origins'].join(','),
            features: data.features,
            auth_agents: data['auth_agents'],
            copilot_apps: data['copilot_apps'][0]
        });
        setActiveConsumer({
            accessKey: data.access_key,
            id: data.id
        });
        setCounter(counter + 1);
        setCreateConsumer(false);
        setIsDisabled(true);
    };

    return (
        <React.Fragment>
            {props.createNewConsumer ? (
                <Button
                    className={classes.createNewBtn}
                    variant="contained"
                    onClick={() => {
                        setOpen(true);
                    }}
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    size="medium"
                >
                    Create Ask NucliOS Consumer
                </Button>
            ) : (
                <IconButton
                    key={1}
                    title="Manage Ask NucliOS Consumer"
                    onClick={handleEditConsumer}
                    aria-label="manage Ask NucliOS consumer"
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            )}
            {open && (
                <Dialog
                    key={3}
                    open={open}
                    fullWidth
                    classes={{ paper: classes.paper }}
                    maxWidth="lg"
                    aria-labelledby="manage-minerva-consumer"
                    aria-describedby="minerva-consumer-description"
                    PaperProps={{
                        style: { height: '100%' }
                    }}
                >
                    {loading ? <CodxCircularLoader center /> : null}
                    <DialogTitle className={classes.title} disableTypography id="manage-consumer">
                        <Typography variant="h4" className={classes.heading}>
                            {createConsumer
                                ? 'Create Ask NucliOS Consumer'
                                : 'Update Ask NucliOS Consumer'}
                        </Typography>
                        <IconButton
                            title="Close"
                            onClick={handleDialogClose}
                            className={classes.closeIcon}
                            aria-label="Close"
                        >
                            <CloseIcon fontSize="large" />
                        </IconButton>
                    </DialogTitle>
                    <hr className={classes.sepratorline} />
                    <DialogContent
                        style={{ height: '50vh', padding: '2rem 3.5rem' }}
                        id="consumer-description"
                        key={counter}
                        className={classes.dialogContent}
                    >
                        {loading ? (
                            <CodxCircularLoader size={60} center />
                        ) : (
                            <MinervaConsumerConfig
                                accessKey={activeConsumer.accessKey}
                                consumerData={consumerConfig}
                                copilotAppOptions={copilotAppOptions}
                                updateConsumerConfig={handleConsumerFormUpdate}
                                // allowedOriginError={originError}
                            />
                        )}
                    </DialogContent>
                    <DialogActions className={classes.dialogAction}>
                        {createConsumer ? (
                            <Button
                                onClick={handleSaveConsumerConfig}
                                variant="contained"
                                className={classes.button}
                                disabled={isDisabled}
                            >
                                Save
                            </Button>
                        ) : (
                            <Button
                                onClick={handleUpdateConsumer}
                                variant="contained"
                                className={classes.button}
                                disabled={isDisabled}
                            >
                                Update
                            </Button>
                        )}
                        <Button
                            variant="text"
                            onClick={handleDialogClose}
                            className={classes.button}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <CustomSnackbar
                key="snackbar"
                open={snackbar.open}
                message={snackbar.message}
                autoHideDuration={2000}
                onClose={() => {
                    setSnackbar({
                        open: false
                    });
                }}
                severity={snackbar.severity}
            />
        </React.Fragment>
    );
}

const styles = (theme) => ({
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    button: {
        margin: '0em 2em',
        width: '11em'
    },
    createNewBtn: {
        height: 'max-content',
        padding: '1rem 2rem',
        width: 'fit-content'
    },
    paper: {
        background: theme.palette.background.modelBackground,
        backdropFilter: 'blur(2rem)',
        borderRadius: 0,
        border: 'none'
    },
    title: {
        margin: 0,
        background: theme.palette.background.modelBackground,
        padding: theme.layoutSpacing(20),
        '& .MuiTypography-h4': {
            color: theme.palette.text.titleText,
            fontSize: '2.5rem',
            letterSpacing: '0.1em',
            opacity: 0.8,
            fontFamily: theme.title.h1.fontFamily
        },
        display: 'flex',
        justifyContent: 'space-between'
    },
    dialogContent: {
        paddingLeft: theme.layoutSpacing(44),
        paddingRight: theme.layoutSpacing(44),
        paddingTop: theme.layoutSpacing(40),
        overflow: 'hidden'
    },
    dialogAction: {
        paddingBottom: theme.layoutSpacing(28),
        paddingTop: theme.layoutSpacing(48),
        paddingRight: theme.layoutSpacing(44)
    },
    sepratorline: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 32px)'
    },
    closeIcon: {
        position: 'absolute',
        top: theme.layoutSpacing(12),
        right: 0,
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        }
    }
});

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(ManageMinervaConsumer);
