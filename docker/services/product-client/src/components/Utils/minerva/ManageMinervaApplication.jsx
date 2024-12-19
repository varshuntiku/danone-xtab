import React from 'react';
import {
    // Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from '@material-ui/core';
import CustomSnackbar from '../../CustomSnackbar';
import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import {
    updateApplicationConfig,
    getApplicationConfig,
    createApplication,
    listTables
} from 'services/minerva_utils.js';
import CloseIcon from '../../../assets/Icons/CloseBtn';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
// import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import defaultMinervaAppData from './minervaDefault.json';
import MinervaConfigWizard from './MinervaConfigWizard';
// import { fetch_socket_connection } from 'util/initiate_socket';

class ManageMinervaApps extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: false,
            loader: false,
            snackbar: {
                open: false
            },
            appData: defaultMinervaAppData.appData,
            stepperData: defaultMinervaAppData.stepperData,
            formOptions: defaultMinervaAppData.formOptions
        };
    }

    componentDidMount() {
        // this.socket = fetch_socket_connection();
    }

    setOpen = (value) => {
        this.setState({
            open: value
        });
        // check if pop is open, load default values if not loaded already
        if (value === true && this.props.createNewApp === false) {
            this.fetchAppData();
        } else if (value === false) {
            this.setState({
                appData: {}
            });
        }
    };

    fetchAppData = () => {
        getApplicationConfig({
            appId: this.props.appId,
            callback: this.onResponseGetApplicationConfig.bind(this)
        });
        this.setState({
            loader: true
        });
    };

    onResponseGetApplicationConfig = (response_data, status = 'success') => {
        if (status === 'error') {
            this.setState((prevState) => ({
                snackbar: {
                    ...prevState.snackbar,
                    open: true,
                    message: 'Failed to load Ask NucliOS Application config',
                    severity: 'error'
                }
            }));
        } else {
            this.setState({
                appData: response_data,
                loader: false
            });
        }
    };

    updateApp = (updatedAppData, documents, closeOnResponse = false) => {
        let appId = updatedAppData.id;
        delete updatedAppData['id'];
        updateApplicationConfig({
            appData: updatedAppData,
            documents: documents,
            appId: appId,
            callback: this.onResponseUpdateApplicationConfig.bind(this),
            closeOnResponse: closeOnResponse
        });
        this.setState({
            loader: true
        });
    };

    onResponseUpdateApplicationConfig = (
        response_data,
        closeOnResponse = false,
        responseStatus = 'success'
    ) => {
        if (responseStatus === 'error') {
            this.setState((prevState) => ({
                snackbar: {
                    ...prevState.snackbar,
                    open: true,
                    message: response_data || 'Failed to update Ask NucliOS Application config',
                    severity: 'error'
                }
            }));
        } else {
            this.setState((prevState) => ({
                appData: response_data,
                loader: false,
                snackbar: {
                    ...prevState.snackbar,
                    open: true,
                    message: 'Ask NucliOS application data updated successfully!',
                    severity: 'success'
                }
            }));
            if (
                response_data.source_type === 'document_query' &&
                response_data.status === 'Triggered'
            ) {
                // this.socket['minerva_socket']?.emit('init::minerva_app_status', {
                //     room_id: 'minerva_job_app_' + response_data.id
                // });
            }
            this.props.updateAppData(response_data);
        }
        if (closeOnResponse === true) {
            this.onFinish();
        }
    };

    createApp = (updatedAppData) => {
        createApplication({
            appData: updatedAppData,
            callback: this.onResponseCreateApplicationConfig.bind(this)
        });
        this.setState({
            loader: true
        });
    };

    onResponseCreateApplicationConfig = (response_data, status = 'success') => {
        if (
            status === 'error' ||
            (response_data.status_code && response_data.status_code === 500)
        ) {
            this.setState((prevState) => ({
                loader: false,
                snackbar: {
                    ...prevState.snackbar,
                    open: true,
                    message: 'Failed to update Ask NucliOS Application config',
                    severity: 'error'
                }
            }));
        } else {
            this.props.getMinervaApplications(); // update app list on admin screen
            this.setState((prevState) => ({
                appData: response_data,
                loader: false,
                snackbar: {
                    ...prevState.snackbar,
                    open: true,
                    message: 'Ask NucliOS application created successfully!',
                    severity: 'success'
                }
            }));
        }
    };

    listTables = (connection_string, schema) => {
        listTables({
            connectionString: connection_string,
            schema: schema,
            callback: this.onResponseListTables.bind(this)
        });
    };

    onResponseListTables = (response_data, status = 'success') => {
        if (
            status === 'error' ||
            (response_data.status_code && response_data.status_code === 500)
        ) {
            this.setState((prevState) => ({
                snackbar: {
                    ...prevState.snackbar,
                    open: true,
                    message: 'Failed to Fetch Tables for specified data source',
                    severity: 'error'
                }
            }));
        } else {
            let temp = { ...this.state.appData };
            if (temp.app_config[0].config?.context) {
                temp.app_config[0].config.context.table_config = response_data['table_config'];
            } else {
                temp.app_config[0].config.context = { table_config: response_data['table_config'] };
            }
            this.setState({
                appData: temp
            });
        }
    };

    onFinish = () => {
        this.setOpen(false);
    };

    cancel = () => {
        this.setOpen(false);
    };

    render() {
        const { classes } = this.props;
        return [
            !this.props.createNewApp && (
                <IconButton
                    key={1}
                    title="Manage Ask NucliOS Application"
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    aria-label="manage minerva application"
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            ),
            this.state.open && (
                <Dialog
                    key={3}
                    open={this.state.open}
                    fullWidth
                    classes={{ paper: classes.paper }}
                    maxWidth="lg"
                    aria-labelledby="manage-minerva-application"
                    aria-describedby="minerva-application-description"
                >
                    <DialogTitle
                        className={classes.title}
                        disableTypography
                        id="manage-minerva-application"
                    >
                        {this.props.createNewApp ? (
                            <Typography variant="h4" className={classes.heading}>
                                Create New Ask NucliOS Application
                            </Typography>
                        ) : (
                            <Typography variant="h4" className={classes.heading}>
                                Update Ask NucliOS Application
                            </Typography>
                        )}
                        <IconButton
                            title="Close"
                            onClick={() => {
                                this.setOpen(false);
                            }}
                            className={classes.closeIcon}
                            aria-label="Close"
                        >
                            <CloseIcon fontSize="large" />
                        </IconButton>
                    </DialogTitle>
                    <hr className={classes.sepratorline} />
                    <DialogContent
                        style={{ height: '70vh' }}
                        id="minerva-application-description"
                        className={classes.dialogContent}
                    >
                        <MinervaConfigWizard
                            loader={this.state.loader}
                            sections={this.state.stepperData}
                            appData={this.state.appData}
                            formOptions={this.state.formOptions}
                            createNewAppFlag={this.props.createNewApp}
                            onFinish={this.onFinish}
                            appActions={{
                                fetchAppData: this.fetchAppData,
                                updateApp: this.updateApp,
                                createApp: this.createApp,
                                listTables: this.listTables
                            }}
                        ></MinervaConfigWizard>
                    </DialogContent>
                </Dialog>
            ),
            <CustomSnackbar
                key={4}
                open={this.state.snackbar.open}
                message={this.state.snackbar.message}
                autoHideDuration={2000}
                onClose={() => {
                    this.setState({
                        snackbar: {
                            open: false
                        }
                    });
                }}
                severity={this.state.snackbar.severity}
            />
        ];
    }
}

const styles = (theme) => ({
    paper: {
        background: theme.palette.background.modelBackground,
        backdropFilter: 'blur(2rem)',
        borderRadius: 0,
        border: 'none'
    },

    createNewBtn: {
        height: 'max-content',
        padding: '1rem 2rem',
        width: 'fit-content'
    },
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
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
)(ManageMinervaApps);
