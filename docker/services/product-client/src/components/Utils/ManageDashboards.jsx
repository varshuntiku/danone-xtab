import React from 'react';
import {
    Button,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import { createDashboard, updateDashboard, deleteDashboard } from 'services/dashboard.js';
import CloseIcon from '../../assets/Icons/CloseBtn';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { IndustrySpecs } from '../../assets/data/indusrySpecs';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import * as _ from 'underscore';

class ManageDashboards extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            open: false,
            snackbar: {
                open: false
            },
            industryLogoList: [],
            details: {
                id: props.dashboard?.id ? props.dashboard.id : null,
                name: props.dashboard?.name ? props.dashboard.name : '',
                root: props.dashboard?.root ? props.dashboard.root : null,
                icon: props.dashboard?.icon ? props.dashboard.icon : '',
                order: props.dashboard?.order ? props.dashboard.order : 0,
                url: props.dashboard?.url || '',
                template: props.dashboard?.template || null
            },
            industries: [],
            isChangeActive: {
                name: false,
                icon: false,
                template: false
            },
            templates: props.templatesData.map(({ id, name }) => ({ label: name, value: id }))
        };
        this.industry_specs = IndustrySpecs;
    }

    setOpen = (value) => {
        var industrylist = _.map(this.props.industriesData, function (industry) {
            return { label: industry.industry_name + ' - ' + industry.id, value: industry.id };
        });
        this.setState({
            open: value,
            industries: industrylist
        });
    };

    componentDidMount() {
        var keys = [];
        for (var k in this.industry_specs) keys.push(k);

        var industryLogoList = _.map(keys, function (industry) {
            return { label: industry, value: industry };
        });
        this.setState({
            industryLogoList: industryLogoList
        });
    }

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
        if (
            (this.state.details['name'] === '' ||
                this.state.details['icon'] === '' ||
                this.state.details['template'] === null) &&
            !this.props?.delete
        ) {
            this.setState({
                isChangeActive: {
                    ...this.state.isChangeActive,
                    name: true,
                    icon: true,
                    template: true
                }
            });
            return;
        }
        try {
            if (this.props.createNewDashboards) {
                createDashboard({
                    payload: this.state.details,
                    callback: this.onResponseCreateDashboard
                });
            } else if (this.props?.delete) {
                deleteDashboard({
                    payload: this.state.details,
                    callback: this.onResponseCreateDashboard
                });
            } else {
                updateDashboard({
                    payload: this.state.details,
                    callback: this.onResponseCreateDashboard
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

    onResponseCreateDashboard = (response_data) => {
        if (response_data.status && response_data.status === 'error') {
            this.setOpen(false);
            this.handleUpdateResponse(response_data.message, 'error');
        } else {
            this.props.createNewDashboards
                ? this.handleUpdateResponse('Created Successfully')
                : this.props?.delete
                ? this.handleUpdateResponse('Deleted Successfully')
                : this.handleUpdateResponse('Updated Successfully');
            this.setOpen(false);
            _.delay(
                () => {
                    this.props.refreshDashboardList();
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
            if (this.props.createNewDashboards) {
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
                        icon: '',
                        order: 0,
                        root: null,
                        url: '',
                        template: null
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
                        id: this.props.dashboard.id,
                        name: this.props.dashboard.name,
                        root: this.props.dashboard.root,
                        icon: this.props.dashboard.icon,
                        order: this.props.dashboard.order,
                        url: this.props.dashboard.url,
                        template: this.props.dashboard.template
                    }
                }));
            }
        }
    };

    onHandleFieldChange = (field_id, field_value) => {
        var details = this.state.details;
        var suggestedOrderValue = (this.props.orderValue ? this.props.orderValue : 0) + 1;
        if (field_id === 'order') {
            if (field_value === '') {
                field_value = parseInt(suggestedOrderValue);
            } else {
                field_value = parseInt(field_value);
            }
        }
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
        if (prevProps.dashboard?.id != this.props.dashboard?.id) {
            let newDetails = {
                id: this.props.dashboard?.id ? this.props.dashboard.id : null,
                name: this.props.dashboard?.name ? this.props.dashboard.name : '',
                root: this.props.dashboard?.root ? this.props.dashboard.root : null,
                icon: this.props.dashboard?.icon ? this.props.dashboard.icon : '',
                order: this.props.dashboard?.order ? this.props.dashboard.order : 0,
                url: this.props.dashboard?.url || '',
                template: this.props.dashboard?.template || null
            };
            this.setState({
                details: newDetails
            });
        }
    }

    render() {
        const { classes, orderValue } = this.props;
        const suggestedOrderValue = (orderValue ? orderValue : 0) + 1;
        let errors = {
            error_in_name: this.state.isChangeActive.name && this.state.details['name'] === '',
            error_in_logo: this.state.isChangeActive.icon && this.state.details['icon'] === '',
            error_in_order: Number.isNaN(Number(this.state.details['order'])),
            error_in_template:
                this.state.isChangeActive.template && this.state.details['template'] === null
        };
        const { error_in_name, error_in_logo, error_in_order, error_in_template } = errors;

        return [
            !this.props.createNewDashboards && (
                <IconButton
                    key={1}
                    title="Manage Dashboards"
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    aria-label="Manage Dashboards"
                >
                    {this.props?.delete ? (
                        <DeleteOutline fontSize="large" className={classes.deleteIcon} />
                    ) : (
                        <EditOutlinedIcon fontSize="large" />
                    )}
                </IconButton>
            ),
            this.props.createNewDashboards && (
                <Button
                    key={2}
                    variant="contained"
                    className={classes.createNewButton}
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    aria-label="Create new dashboard"
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
                aria-labelledby="manage-dashboard"
                aria-describedby="dashboard-content"
            >
                <DialogTitle className={classes.title} disableTypography id="manage-dashboard">
                    <Typography variant="h4" className={classes.heading}>
                        {this.props.createNewDashboards
                            ? 'Create New Dashboard'
                            : this.props?.delete
                            ? 'Delete Dashboard'
                            : 'Update Dashboard'}
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
                <DialogContent id="dashboard-content" className={classes.layoutSpacing}>
                    {this.props?.delete ? (
                        <Typography variant="h3" className={classes.heading}>
                            You are going to delete dashboard {this.state.details['name']}
                        </Typography>
                    ) : (
                        <Grid key="form-body" container spacing={2}>
                            <Grid item xs style={{ padding: '2.5rem' }}>
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Dashboard Name',
                                        id: 'name',
                                        fullWidth: true,
                                        required: true,
                                        error: error_in_name,
                                        helper_text: error_in_name
                                            ? 'Dashboard Name is Mandatory'
                                            : '',
                                        value:
                                            this.state.details && this.state.details['name']
                                                ? this.state.details['name']
                                                : ''
                                    }}
                                />
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Order',
                                        id: 'order',
                                        fullWidth: true,
                                        error: error_in_order,
                                        helper_text: error_in_order
                                            ? 'Order Should be Numerical'
                                            : '',
                                        value:
                                            this.state.details && this.state.details['order']
                                                ? this.state.details['order']
                                                : 0,
                                        placeholder: `Suggested Order Value ${suggestedOrderValue}`
                                    }}
                                />
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Dashboard Url',
                                        id: 'url',
                                        fullWidth: true,
                                        value:
                                            this.state.details && this.state.details['url']
                                                ? this.state.details['url']
                                                : ''
                                    }}
                                />
                            </Grid>
                            <Grid item xs style={{ padding: '2.5rem' }}>
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Icon',
                                        is_select: true,
                                        id: 'icon',
                                        fullWidth: true,
                                        required: true,
                                        error: error_in_logo,
                                        helper_text: error_in_logo ? 'Logo is Mandatory' : '',
                                        options: this.state.industryLogoList,
                                        value:
                                            this.state.details && this.state.details['icon']
                                                ? this.state.details['icon']
                                                : ''
                                    }}
                                />
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Root Industry',
                                        is_select: true,
                                        id: 'root',
                                        fullWidth: true,
                                        options: this.state.industries,
                                        value: this.state.details.root
                                    }}
                                />
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Template',
                                        is_select: true,
                                        id: 'template',
                                        fullWidth: true,
                                        required: true,
                                        error: error_in_template,
                                        helper_text: error_in_template
                                            ? 'Template is Mandatory'
                                            : '',
                                        options: this.props.templatesData.map(({ id, name }) => ({
                                            label: name,
                                            value: id
                                        })),
                                        value:
                                            this.state.details && this.state.details['template']
                                                ? this.state.details['template']
                                                : ''
                                    }}
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
                        disabled={
                            error_in_name || error_in_logo || error_in_order || error_in_template
                        }
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
)(ManageDashboards);
