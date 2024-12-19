import React from 'react';
import {
    Button,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tabs,
    Tab,
    IconButton,
    Typography,
    FormControlLabel,
    Checkbox
} from '@material-ui/core';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import AppAdminCodeEditor from 'components/Admin/AppAdminCodeEditor.jsx';
import { Close } from '@material-ui/icons';

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';

import {
    getDashboardTabData,
    createDashboardTab,
    updateDashboardTab
} from 'services/connectedSystem_v2';

import * as _ from 'underscore';

class TabsActions extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: false,
            snackbar: {
                open: false
            },
            details: {
                name: props.dashboard_tab?.name ? props.dashboard_tab.name : '',
                tab_type: props.dashboard_tab?.tab_type ? props.dashboard_tab.tab_type : '',
                is_active: props.dashboard_tab?.is_active ? props.dashboard_tab.is_active : false,
                order_by: props.dashboard_tab?.order_by ? props.dashboard_tab.order_by : false,
                kpis: null,
                insights: null,
                tools: null
            },
            dashboard_tab_id: props.dashboard_tab?.id ? props.dashboard_tab.id : false,
            active_step: 0,
            loading: false
        };
    }

    setOpen = (value) => {
        this.setState({
            open: value
        });

        if (value && this.state.dashboard_tab_id) {
            this.setState({
                open: value,
                loading: true
            });

            getDashboardTabData({
                connSystemDashboardTabId: this.state.dashboard_tab_id,
                callback: this.onResponseTabData
            });
        }
    };

    onResponseTabData = (response) => {
        this.setState({
            details: response,
            loading: false
        });
    };

    submit = () => {
        const { connSystemDashboardId } = this.props;

        try {
            if (this.props.createDashboardTab) {
                createDashboardTab({
                    connSystemDashboardId: connSystemDashboardId,
                    payload: this.state.details,
                    callback: this.onResponseCreateDashboardTab
                });
            } else {
                updateDashboardTab({
                    payload: this.state.details,
                    dashboard_tab_id: this.state.dashboard_tab_id,
                    callback: this.onResponseCreateDashboardTab
                });
            }
        } catch (error) {
            this.handleUpdateResponse('Failed to complete action. Please try again.', 'error');
        }
    };

    onResponseCreateDashboardTab = () => {
        const props = this.props;

        this.handleUpdateResponse(
            props.createDashboardTab
                ? 'Dashboard tab added Successfully'
                : 'Dashboard tab updated Successfully'
        );
        this.setOpen(false);

        _.delay(
            () => {
                props.refreshData();
            },
            2000,
            ''
        );
    };

    handleUpdateResponse = (message, severity = 'success') => {
        this.setState((prevState) => ({
            snackbar: {
                ...prevState.snackbar,
                open: true,
                message: message,
                severity: severity
            }
        }));
    };

    onHandleFieldChange = (field_id, field_value) => {
        var details = this.state.details;

        details[field_id] = field_value;

        this.setState({
            details: details
        });
    };

    handleStepClick = (active_step) => {
        this.setState({
            active_step: active_step
        });
    };

    onChangeCode = (code_type, code_string) => {
        this.setState({
            details: {
                ...this.state.details,
                [code_type]: code_string.trim() === '' ? null : JSON.parse(code_string)
            }
        });
    };

    getCodeEditor = (code_id) => {
        const { classes } = this.props;

        return (
            <div className={classes.subSectionTabBody}>
                <AppAdminCodeEditor
                    code={
                        this.state.details[code_id]
                            ? JSON.stringify(this.state.details[code_id], null, '\t')
                            : ''
                    }
                    language="json"
                    onChangeCodeCallback={(code_string) => this.onChangeCode(code_id, code_string)}
                    extraClasses={{
                        editorSection: classes.editorSectionShort,
                        outputSection: classes.outputSection
                    }}
                />
            </div>
        );
    };

    render() {
        const { classes, createDashboardTab } = this.props;

        return [
            !createDashboardTab && (
                <IconButton
                    key={1}
                    title="Manage User Role"
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    aria-label="Manage"
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            ),
            createDashboardTab && (
                <Button
                    key={2}
                    variant="outlined"
                    className={classes.createNewButton}
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    aria-label="Create new"
                >
                    Create New
                </Button>
            ),
            <Dialog
                key={3}
                open={this.state.open}
                fullWidth
                maxWidth="sm"
                onClose={() => {
                    this.setOpen(false);
                }}
                aria-labelledby="create-new-dashboard-tab"
                aria-describedby="dashboard-tab-content"
            >
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id="create-new-dashboard-tab"
                >
                    <Typography variant="h4" className={classes.heading}>
                        {this.state.dashboard_tab_id
                            ? 'Edit Dashboard Tab'
                            : 'Create New Dashboard Tab'}
                    </Typography>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            this.setOpen(false);
                        }}
                        style={{ position: 'absolute', top: '4px', right: 0 }}
                        className={classes.actionIcon}
                        aria-label="Close"
                    >
                        <Close fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <DialogContent id="dashboard-tab-content">
                    {this.state.loading
                        ? ((
                              <Tabs
                                  value={this.state.active_step}
                                  onChange={(e, v) => this.handleStepClick(v)}
                                  aria-label="ant example"
                                  className={classes.subSectionsTabs}
                              >
                                  <Tab label="Overview" />
                                  <Tab label="KPIs" />
                                  <Tab label="Insights" />
                                  <Tab label="Tools" />
                              </Tabs>
                          ),
                          (
                              <div className={classes.subSectionTabBody}>
                                  <CodxCircularLoader center size={60} />
                              </div>
                          ))
                        : [
                              <Tabs
                                  key="tabs"
                                  value={this.state.active_step}
                                  onChange={(e, v) => this.handleStepClick(v)}
                                  aria-label="Dashboard Tab Content"
                                  className={classes.subSectionsTabs}
                              >
                                  <Tab label="Overview" />
                                  <Tab label="KPIs" />
                                  <Tab label="Insights" />
                                  <Tab label="Tools" />
                              </Tabs>,
                              this.state.active_step === 0 && (
                                  <div className={classes.subSectionTabBody}>
                                      <Grid container spacing={4}>
                                          <Grid item xs={6}>
                                              <CustomTextField
                                                  parent_obj={this}
                                                  field_info={{
                                                      label: 'Dashboard Tab Name',
                                                      id: 'name',
                                                      fullWidth: true,
                                                      value: this.state.details.name
                                                  }}
                                              />
                                              <CustomTextField
                                                  parent_obj={this}
                                                  field_info={{
                                                      label: 'Dashboard Tab Type',
                                                      id: 'tab_type',
                                                      fullWidth: true,
                                                      value: this.state.details.tab_type,
                                                      helper_text:
                                                          'Supported tab types are Strategy, Value, Intelligence & Foundation'
                                                  }}
                                              />
                                          </Grid>
                                          <Grid item xs={6}>
                                              <CustomTextField
                                                  parent_obj={this}
                                                  field_info={{
                                                      label: 'Order',
                                                      id: 'order_by',
                                                      fullWidth: true,
                                                      value: this.state.details.order_by
                                                          ? this.state.details.order_by
                                                          : 0,
                                                      helper_text:
                                                          'Enter any whole number greater than 0'
                                                  }}
                                              />
                                              <FormControlLabel
                                                  control={
                                                      <Checkbox
                                                          checked={this.state.details.is_active}
                                                          onChange={(e, v) =>
                                                              this.onHandleFieldChange(
                                                                  'is_active',
                                                                  v
                                                              )
                                                          }
                                                          name="is_active"
                                                          color="primary"
                                                      />
                                                  }
                                                  className={`${classes.inputCheckbox} ${classes.customInputCheckbox}`}
                                                  label="Is Active"
                                              />
                                          </Grid>
                                      </Grid>
                                  </div>
                              ),
                              this.state.active_step === 1 && this.getCodeEditor('kpis'),
                              this.state.active_step === 2 && this.getCodeEditor('insights'),
                              this.state.active_step === 3 && this.getCodeEditor('tools')
                          ]}
                </DialogContent>
                <DialogActions style={{ padding: '8px 24px 24px' }}>
                    <Button
                        className={classes.btn}
                        variant="outlined"
                        onClick={() => {
                            this.setOpen(false);
                        }}
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        className={classes.btn}
                        variant="contained"
                        onClick={this.submit}
                        aria-label="Save"
                    >
                        Save
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
        background: theme.palette.primary.main
    },
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    }
});

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(TabsActions);
