import React from 'react';
import {
    Button,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    FormControlLabel,
    Checkbox
} from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import ImageUpload from 'components/dynamic-form/inputFields/imageUpload.jsx';
import {
    getConnectedSystem,
    createConnectedSystem,
    updateConnectedSystem,
    deleteConnectedSystem
} from 'services/connectedSystem_v2.js';
import CloseIcon from '../../assets/Icons/CloseBtn';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
// import { IndustrySpecs } from '../../assets/data/indusrySpecs';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import * as _ from 'underscore';

class ManageConnectedSystems extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            open: false,
            loading: true,
            snackbar: {
                open: false
            },
            logo_files_to_delete: [],
            details: {
                id: props.connectedSystem?.id ? props.connectedSystem.id : null,
                name: props.connectedSystem?.name ? props.connectedSystem.name : '',
                industry: props.connectedSystem?.industry ? props.connectedSystem.industry : '',
                function: props.connectedSystem?.function ? props.connectedSystem.function : '',
                description: props.connectedSystem?.description
                    ? props.connectedSystem.description
                    : '',
                is_active: props.connectedSystem?.is_active
                    ? props.connectedSystem.is_active
                    : false,
                small_logo_blob_name: props.connectedSystem?.small_logo_blob_name
                    ? props.connectedSystem.small_logo_blob_name
                    : ''
            },
            isChangeActive: {
                name: false
            },
            small_logo_file_details: props.connectedSystem?.small_logo_blob_name
                ? [
                      {
                          filename: props.connectedSystem.small_logo_blob_name,
                          path: props.connectedSystem.small_logo_url
                      }
                  ]
                : false
        };
    }

    onResponseDashboardData = (response_data) => {
        this.setState({
            loading: false,
            details: {
                id: this.props.connectedSystem?.id ? this.props.connectedSystem.id : null,
                name: response_data?.name ? response_data.name : '',
                industry: response_data?.industry ? response_data.industry : '',
                function: response_data?.function ? response_data.function : '',
                is_active: response_data?.is_active ? response_data.is_active : false,
                small_logo_blob_name: response_data?.small_logo_blob_name
                    ? response_data.small_logo_blob_name
                    : '',
                description: response_data?.description
                    ? response_data.description //decodeHtmlEntities(sanitizeHtml(response_data.description))
                    : ''
            },
            small_logo_file_details: response_data?.small_logo_blob_name
                ? [
                      {
                          filename: response_data.small_logo_blob_name,
                          path: response_data.small_logo_url
                      }
                  ]
                : false
        });
    };

    setOpen = (value) => {
        this.setState({
            open: value
        });

        if (value && this.state.details.id) {
            getConnectedSystem({
                connSystemDashboardId: this.state.details.id,
                callback: this.onResponseDashboardData
            });
        }
    };

    cancel = () => {
        this.setOpen(false);
        this.handleUpdateResponse('Cancelled Successfully', 'warning');
        this.setState({
            isChangeActive: {
                name: false,
                icon: false,
                template: false
            }
        });
    };

    submit = () => {
        if (this.state.details['name'] === '' && !this.props?.delete) {
            this.setState({
                isChangeActive: {
                    ...this.state.isChangeActive,
                    name: true
                }
            });
            return;
        }
        try {
            if (this.props.createNewConnectedSystems) {
                createConnectedSystem({
                    payload: this.state.details,
                    callback: this.onResponseCreateConnectedSystem
                });
            } else if (this.props?.delete) {
                deleteConnectedSystem({
                    connSystemDashboardId: this.state.details.id,
                    callback: this.onResponseCreateConnectedSystem
                });
            } else {
                updateConnectedSystem({
                    connSystemDashboardId: this.state.details.id,
                    payload: this.state.details,
                    callback: this.onResponseCreateConnectedSystem
                });
            }
            this.setState({
                isChangeActive: {
                    ...this.state.isChangeActive,
                    name: false,
                    icon: false,
                    template: false
                }
            });
        } catch (error) {
            this.handleUpdateResponse(error, 'error');
        }
    };

    onResponseCreateConnectedSystem = (response_data) => {
        if (response_data.status && response_data.status === 'error') {
            this.setOpen(false);
            this.handleUpdateResponse(response_data.message, 'error');
        } else {
            this.props.createNewConnectedSystems
                ? this.handleUpdateResponse('Created Successfully')
                : this.props?.delete
                ? this.handleUpdateResponse('Deleted Successfully')
                : this.handleUpdateResponse('Updated Successfully');
            this.setOpen(false);
            _.delay(
                () => {
                    this.props.refreshConnectedSystemList();
                },
                2000,
                ''
            );
        }
    };

    handleUpdateResponse = (message, severity = 'success') => {
        if (severity === 'error') {
            this.setState((prevState) => ({
                snackbar: {
                    ...prevState.snackbar,
                    open: true,
                    message: message,
                    severity: severity
                }
            }));
        } else {
            if (this.props.createNewConnectedSystems) {
                this.setState((prevState) => ({
                    snackbar: {
                        ...prevState.snackbar,
                        open: true,
                        message: message,
                        severity: severity
                    },
                    details: {
                        ...prevState.details,
                        name: '',
                        industry: '',
                        function: '',
                        description: '',
                        is_active: false
                    }
                }));
            } else {
                this.setState((prevState) => ({
                    snackbar: {
                        ...prevState.snackbar,
                        open: true,
                        message: message,
                        severity: severity
                    },
                    details: {
                        ...prevState.details,
                        id: this.props.connectedSystem.id,
                        name: this.props.connectedSystem.name,
                        industry: this.props.connectedSystem.industry,
                        function: this.props.connectedSystem.function,
                        description: this.props.connectedSystem.description,
                        is_active: this.props.connectedSystem.is_active
                    }
                }));
            }
        }
    };

    onHandleFieldChange = (field_id, field_value) => {
        var details = this.state.details;

        details[field_id] = field_value;
        this.setState({
            details: details,
            isChangeActive: {
                ...this.state.isChangeActive,
                [field_id]: true
            }
        });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.connectedSystem?.id != this.props.connectedSystem?.id) {
            let newDetails = {
                id: this.props.connectedSystem?.id ? this.props.connectedSystem.id : null,
                name: this.props.connectedSystem?.name ? this.props.connectedSystem.name : '',
                industry: this.props.connectedSystem?.industry
                    ? this.props.connectedSystem.industry
                    : '',
                function: this.props.connectedSystem?.function
                    ? this.props.connectedSystem.function
                    : '',
                description: this.props.connectedSystem?.description
                    ? this.props.connectedSystem.description
                    : '',
                is_active: this.props.connectedSystem?.is_active
                    ? this.props.connectedSystem.is_active
                    : false
            };
            this.setState({
                details: newDetails
            });
        }
    }

    addFilesToRemove = (file, file_value, logo_type) => {
        if (logo_type === 'small_logo_blobname') {
            this.setState({
                ...this.state,
                logo_files_to_delete: [...this.state.logo_files_to_delete, file],
                small_logo_file_details: file_value
            });
        }
    };

    // removeFilesOnSave = async () => {
    //     for (let i = 0; i < this.state.logo_files_to_delete.length; i++) {
    //         const body = { file: this.state.logo_files_to_delete[i] };
    //         await axiosClient
    //             .post('/file/delete', body)
    //             .then(() => {
    //                 //TODO
    //             })
    //             .catch(() => {});
    //     }
    // };

    onChangeSmallFileUpload = (file_value) => {
        let details = this.state.details;

        details['small_logo_blob_name'] = file_value.length ? file_value[0].filename : '';
        this.setState({
            small_logo_file_details: file_value,
            details: details
        });
    };

    render() {
        const { classes } = this.props;
        let errors = {
            error_in_name: this.state.isChangeActive.name && this.state.details['name'] === ''
        };
        const { error_in_name } = errors;

        return [
            !this.props.createNewConnectedSystems && (
                <IconButton
                    key={1}
                    title="Manage Connected Systems"
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    aria-label="Manage Connected Systems"
                >
                    {this.props?.delete ? (
                        <DeleteOutline fontSize="large" className={classes.deleteIcon} />
                    ) : (
                        <EditOutlinedIcon fontSize="large" />
                    )}
                </IconButton>
            ),
            this.props.createNewConnectedSystems && (
                <Button
                    key={2}
                    variant="contained"
                    className={classes.createNewButton}
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    aria-label="Create new connected system"
                >
                    Create New
                </Button>
            ),
            <Dialog
                key={3}
                open={this.state.open}
                fullWidth
                classes={{ paper: classes.paper }}
                maxWidth={this.props?.delete ? 'sm' : 'md'}
                aria-labelledby="manage-connected-system"
                aria-describedby="connected-system-content"
            >
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id="manage-connected-system"
                >
                    <Typography variant="h4" className={classes.heading}>
                        {this.props.createNewConnectedSystems
                            ? 'Create New Connected System'
                            : this.props?.delete
                            ? 'Delete Connected System'
                            : 'Update ConnectedSystem'}
                    </Typography>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            this.setOpen(false);
                        }}
                        className={classes.closeIcon}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorLine} />
                <DialogContent id="connected-system-content" className={classes.layoutSpacing}>
                    {this.props?.delete ? (
                        <Typography variant="h3" className={classes.heading}>
                            You are going to delete connected system {this.state.details['name']}
                        </Typography>
                    ) : (
                        <Grid key="form-body" container spacing={2}>
                            <Grid item xs style={{ padding: '2.5rem' }}>
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Name',
                                        id: 'name',
                                        fullWidth: true,
                                        required: true,
                                        error: error_in_name,
                                        helper_text: error_in_name ? 'Name is Mandatory' : '',
                                        value:
                                            this.state.details && this.state.details['name']
                                                ? this.state.details['name']
                                                : ''
                                    }}
                                />
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Industry',
                                        id: 'industry',
                                        fullWidth: true,
                                        value:
                                            this.state.details && this.state.details['industry']
                                                ? this.state.details['industry']
                                                : 0
                                    }}
                                />
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Function',
                                        id: 'function',
                                        fullWidth: true,
                                        value:
                                            this.state.details && this.state.details['function']
                                                ? this.state.details['function']
                                                : ''
                                    }}
                                />
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Description',
                                        id: 'description',
                                        fullWidth: true,
                                        value:
                                            this.state.details && this.state.details['description']
                                                ? this.state.details['description']
                                                : ''
                                    }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.details.is_active}
                                            onChange={(e, v) =>
                                                this.onHandleFieldChange('is_active', v)
                                            }
                                            name="is_active"
                                            color="primary"
                                        />
                                    }
                                    className={`${classes.inputCheckbox} ${classes.customInputCheckbox}`}
                                    label="Is Active"
                                />
                            </Grid>
                            <Grid item xs style={{ padding: '2.5rem' }}>
                                <Typography
                                    key="form-overview-text"
                                    className={`${classes.customFormSectionHeader} ${classes.uploadHeaderStyle}`}
                                    variant="h4"
                                >
                                    Upload Brand Logo
                                </Typography>
                                <ImageUpload
                                    fieldInfo={{
                                        id: 'small_logo_blobname',
                                        name: 'Small Logo',
                                        type: 'upload',
                                        value: this.state.small_logo_file_details
                                            ? this.state.small_logo_file_details
                                            : '',
                                        variant: 'outlined',
                                        margin: 'none',
                                        inputprops: {
                                            type: 'file',
                                            error: 'false',
                                            multiple: false,
                                            accept: '.png, .jpg, .jpeg'
                                        },
                                        InputLabelProps: {
                                            disableAnimation: true,
                                            shrink: true
                                        },
                                        placeholder: 'Upload logo image',
                                        grid: 12,
                                        textTransform: 'none',
                                        admin: true
                                    }}
                                    // addFilesToRemove={this.addFilesToRemove}
                                    onChange={this.onChangeSmallFileUpload}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions className={classes.dialogAction}>
                    <Button
                        className={classes.btn}
                        variant="outlined"
                        onClick={this.cancel}
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        className={classes.btn}
                        variant="contained"
                        onClick={this.submit}
                        disabled={error_in_name}
                        aria-label="Save"
                    >
                        {this.props?.delete ? 'Delete' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>,
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
    createNewButton: {},
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '1.8rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    actionButtonGrp: {
        padding: '1.4rem 1.8rem'
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
    layoutSpacing: {
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
    sepratorLine: {
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
    },
    deleteIcon: {
        fill: theme.palette.text.filtersError
    }
});

export default withStyles(
    (theme) => ({
        ...customFormStyle(theme),
        ...styles(theme)
    }),
    { withTheme: true }
)(ManageConnectedSystems);
