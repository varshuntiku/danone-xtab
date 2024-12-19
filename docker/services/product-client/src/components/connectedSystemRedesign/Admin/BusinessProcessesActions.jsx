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
import DecisionFlowEditor from 'components/connectedSystemRedesign/DecisionFlowEditor.jsx';
import { Close } from '@material-ui/icons';
import CustomSwitch from 'components/dynamic-form/inputFields/CustomSwitch';

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';

import {
    getDrivers,
    getBusinessProcessData,
    createBusinessProcess,
    updateBusinessProcess,
    getBusinessProcessTemplatesByDriver,
    getBusinessProcessTemplateData
} from 'services/connectedSystem_v2';

import * as _ from 'underscore';

class BusinessProcessesActions extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: false,
            isProcessPreview: false,
            snackbar: {
                open: false
            },
            drivers: [],
            details: {
                name: props.business_process?.name ? props.business_process.name : '',
                driver_id: props.business_process?.driver_id
                    ? props.business_process.driver_id
                    : '',
                is_active: props.business_process?.is_active
                    ? props.business_process.is_active
                    : false,
                order_by: props.business_process?.order_by
                    ? props.business_process.order_by
                    : false,
                process_config: null,
                intelligence_config: null,
                foundation_config: null
            },
            business_process_id: props.business_process?.id ? props.business_process.id : false,
            active_step: 0,
            loading: false,
            loading_templates: false,
            use_template: false,
            driver_templates: [],
            applying_template: false
        };
    }

    setUseTemplate = () => {
        this.setState({
            use_template: true,
            loading_templates: true
        });

        getBusinessProcessTemplatesByDriver({
            connSystemDriverId: this.state.details.driver_id,
            callback: this.onResponseBusinessProcessTemplates
        });
    };

    onResponseBusinessProcessTemplates = (response) => {
        this.setState({
            loading_templates: false,
            driver_templates: response
        });
    };

    setProcessPreview = (value) => {
        this.setState({
            isProcessPreview: value
        });
    };

    setBusinessProcessConfig = (processConfig) => {
        this.setState({
            details: {
                ...this.state.details,
                process_config: processConfig
            }
        });
    };

    setOpen = (value) => {
        const { connSystemDashboardId } = this.props;

        this.setState({
            open: value
        });

        if (value) {
            this.setState({
                loading: true
            });

            getDrivers({
                connSystemDashboardId: connSystemDashboardId,
                callback: this.onResponseDrivers
            });
        }
    };

    onResponseDrivers = (response) => {
        this.setState({
            drivers: response
        });

        if (this.state.business_process_id) {
            getBusinessProcessData({
                connSystemBusinessProcessId: this.state.business_process_id,
                callback: this.onResponseBusinessProcessData
            });
        } else {
            this.setState({
                loading: false
            });
        }
    };

    onResponseBusinessProcessData = (response) => {
        this.setState({
            details: response,
            loading: false
        });
    };

    onResponseBusinessProcessTemplateData = (response) => {
        this.setState({
            details: {
                ...this.state.details,
                process_config: response.process_config
            },
            applying_template: false
        });
    };

    submit = () => {
        try {
            if (this.props.createBusinessProcess) {
                createBusinessProcess({
                    connSystemDriverId: this.state.details.driver_id,
                    payload: this.state.details,
                    callback: this.onResponseCreateBusinessProcess
                });
            } else {
                updateBusinessProcess({
                    payload: this.state.details,
                    business_process_id: this.state.business_process_id,
                    callback: this.onResponseCreateBusinessProcess
                });
            }
        } catch (error) {
            this.handleUpdateResponse('Failed to complete action. Please try again.', 'error');
        }
    };

    onResponseCreateBusinessProcess = () => {
        const props = this.props;

        this.handleUpdateResponse(
            props.createBusinessProcess
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
        if (field_id === 'template_id') {
            this.setState({
                applying_template: true
            });

            getBusinessProcessTemplateData({
                connSystemBusinessProcessTemplateId: field_value,
                callback: this.onResponseBusinessProcessTemplateData
            });
        } else {
            var details = this.state.details;

            details[field_id] = field_value;

            this.setState({
                details: details
            });
        }
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
                {code_id === 'process_config' &&
                    (this.state.applying_template ? (
                        <CodxCircularLoader center size={60} />
                    ) : (
                        <>
                            <div className={classes.switchWrapper}>
                                <Typography className={classes.switchLabel}>
                                    Process View
                                </Typography>
                                <CustomSwitch
                                    onChange={this.setProcessPreview}
                                    params={{
                                        value: this.state.isProcessPreview,
                                        size: 'small',
                                        customSelector: classes.switchCustomSelector
                                    }}
                                />
                            </div>
                            {this.state.details.driver_id && (
                                <div className={classes.templateWrapper}>
                                    {!this.state.use_template && (
                                        <Button variant="outlined" onClick={this.setUseTemplate}>
                                            Use Template
                                        </Button>
                                    )}
                                    {this.state.loading_templates && (
                                        <Typography className={classes.switchLabel}>
                                            Loading templates...
                                        </Typography>
                                    )}
                                    {this.state.use_template && !this.state.loading_templates && (
                                        <CustomTextField
                                            parent_obj={this}
                                            field_info={{
                                                label: 'Template',
                                                id: 'template_id',
                                                is_select: true,
                                                fullWidth: true,
                                                options: this.state.driver_templates.map((el) => {
                                                    return {
                                                        label: el.name,
                                                        value: el.id
                                                    };
                                                })
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                            {this.state.isProcessPreview ? (
                                <DecisionFlowEditor
                                    processConfig={this.state.details[code_id]}
                                    setBusinessProcessConfig={this.setBusinessProcessConfig}
                                />
                            ) : (
                                <AppAdminCodeEditor
                                    code={
                                        this.state.details[code_id]
                                            ? JSON.stringify(
                                                  this.state.details[code_id],
                                                  null,
                                                  '\t'
                                              )
                                            : ''
                                    }
                                    language="json"
                                    onChangeCodeCallback={(code_string) =>
                                        this.onChangeCode(code_id, code_string)
                                    }
                                    extraClasses={{
                                        editorSection: classes.editorSectionShort,
                                        outputSection: classes.outputSection
                                    }}
                                />
                            )}
                        </>
                    ))}
            </div>
        );
    };

    render() {
        const { classes, createBusinessProcess } = this.props;

        return [
            !createBusinessProcess && (
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
            createBusinessProcess && (
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
                aria-labelledby="create-new-business-process"
                aria-describedby="business-process-content"
            >
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id="create-new-business-process"
                >
                    <Typography variant="h4" className={classes.heading}>
                        {this.state.business_process_id
                            ? 'Edit Business Process'
                            : 'Create New Business Process'}
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
                <DialogContent id="business-process-content">
                    {this.state.loading
                        ? ((
                              <Tabs
                                  value={this.state.active_step}
                                  onChange={(e, v) => this.handleStepClick(v)}
                                  aria-label="ant example"
                                  className={classes.subSectionsTabs}
                              >
                                  <Tab label="Overview" />
                                  <Tab label="Process" />
                                  <Tab label="Intelligence" />
                                  <Tab label="Foundation" />
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
                                  aria-label="Business Process Content"
                                  className={classes.subSectionsTabs}
                              >
                                  <Tab label="Overview" />
                                  <Tab label="Process" />
                                  <Tab label="Intelligence" />
                                  <Tab label="Foundation" />
                              </Tabs>,
                              this.state.active_step === 0 && (
                                  <div className={classes.subSectionTabBody}>
                                      <Grid container spacing={4}>
                                          <Grid item xs={6}>
                                              <CustomTextField
                                                  parent_obj={this}
                                                  field_info={{
                                                      label: 'Business Process Name',
                                                      id: 'name',
                                                      fullWidth: true,
                                                      value: this.state.details.name
                                                  }}
                                              />
                                              <CustomTextField
                                                  parent_obj={this}
                                                  field_info={{
                                                      label: 'Driver',
                                                      id: 'driver_id',
                                                      is_select: true,
                                                      fullWidth: true,
                                                      options: this.state.drivers.map((el) => {
                                                          return {
                                                              label: el.name,
                                                              value: el.id
                                                          };
                                                      }),
                                                      value: this.state.details.driver_id
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
                              this.state.active_step === 1 && this.getCodeEditor('process_config'),
                              this.state.active_step === 2 &&
                                  this.getCodeEditor('intelligence_config'),
                              this.state.active_step === 3 &&
                                  this.getCodeEditor('foundation_config')
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
    },
    switchWrapper: {
        position: 'absolute',
        top: '-' + theme.spacing(6.5),
        right: theme.spacing(5),
        width: theme.spacing(25),
        // background: theme.palette.background.tableSelcted,
        height: theme.layoutSpacing(56)
        // marginBottom: theme.layoutSpacing(20),
        // borderBottom: '1px solid rgba(0, 0, 0, 0.42)'
    },
    templateWrapper: {
        position: 'absolute',
        top: '-' + theme.spacing(6.8),
        right: theme.spacing(35),
        width: theme.spacing(30),
        // background: theme.palette.background.tableSelcted,
        height: theme.layoutSpacing(56)
        // marginBottom: theme.layoutSpacing(20),
        // borderBottom: '1px solid rgba(0, 0, 0, 0.42)'
    },
    switchCustomSelector: {
        position: 'absolute',
        top: '-' + theme.spacing(1),
        left: theme.spacing(15)
    },
    switchLabel: {
        color: theme.palette.text.revamp,
        fontSize: '1.44rem',
        fontFamily: theme.body.B1.fontFamily,
        letterSpacing: 0,
        lineHeight: 'normal',
        // marginLeft: '1.5rem',
        fontWeight: '500',
        position: 'absolute',
        top: theme.spacing(0.5),
        left: theme.spacing(0.5)
    }
});

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(BusinessProcessesActions);
