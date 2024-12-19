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

import { getDriverData, createDriver, updateDriver } from 'services/connectedSystem_v2';

import * as _ from 'underscore';

class DriversActions extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: false,
            snackbar: {
                open: false
            },
            details: {
                name: props.driver?.name ? props.driver.name : '',
                is_active: props.driver?.is_active ? props.driver.is_active : false,
                order_by: props.driver?.order_by ? props.driver.order_by : false,
                end_user_add: props.driver?.end_user_add ? props.driver.end_user_add : false
            },
            driver_id: props.driver?.id ? props.driver.id : false,
            active_step: 0,
            loading: false
        };
    }

    setOpen = (value) => {
        this.setState({
            open: value
        });

        if (value && this.state.driver_id) {
            this.setState({
                open: value,
                loading: true
            });

            getDriverData({
                connSystemDriverId: this.state.driver_id,
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
            if (this.props.createDriver) {
                createDriver({
                    connSystemDashboardId: connSystemDashboardId,
                    payload: this.state.details,
                    callback: this.onResponseCreateDriver
                });
            } else {
                updateDriver({
                    payload: this.state.details,
                    driver_id: this.state.driver_id,
                    callback: this.onResponseCreateDriver
                });
            }
        } catch (error) {
            this.handleUpdateResponse('Failed to complete action. Please try again.', 'error');
        }
    };

    onResponseCreateDriver = () => {
        const props = this.props;

        this.handleUpdateResponse(
            props.createDriver
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
        const { classes, createDriver } = this.props;

        return [
            !createDriver && (
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
            createDriver && (
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
                aria-labelledby="create-new-driver"
                aria-describedby="driver-content"
            >
                <DialogTitle className={classes.title} disableTypography id="create-new-driver">
                    <Typography variant="h4" className={classes.heading}>
                        {this.state.driver_id ? 'Edit Driver' : 'Create New Driver'}
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
                <DialogContent id="driver-content">
                    {this.state.loading
                        ? ((
                              <Tabs
                                  value={this.state.active_step}
                                  onChange={(e, v) => this.handleStepClick(v)}
                                  aria-label="ant example"
                                  className={classes.subSectionsTabs}
                              >
                                  <Tab label="Overview" />
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
                                  aria-label="Driver Content"
                                  className={classes.subSectionsTabs}
                              >
                                  <Tab label="Overview" />
                              </Tabs>,
                              this.state.active_step === 0 && (
                                  <div className={classes.subSectionTabBody}>
                                      <Grid container spacing={4}>
                                          <Grid item xs={6}>
                                              <CustomTextField
                                                  parent_obj={this}
                                                  field_info={{
                                                      label: 'Driver Name',
                                                      id: 'name',
                                                      fullWidth: true,
                                                      value: this.state.details.name
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
                                              <FormControlLabel
                                                  control={
                                                      <Checkbox
                                                          checked={this.state.details.end_user_add}
                                                          onChange={(e, v) =>
                                                              this.onHandleFieldChange(
                                                                  'end_user_add',
                                                                  v
                                                              )
                                                          }
                                                          name="end_user_add"
                                                          color="primary"
                                                      />
                                                  }
                                                  className={`${classes.inputCheckbox} ${classes.customInputCheckbox}`}
                                                  label="Enable process creation from templates"
                                              />
                                          </Grid>
                                      </Grid>
                                  </div>
                              )
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
)(DriversActions);
