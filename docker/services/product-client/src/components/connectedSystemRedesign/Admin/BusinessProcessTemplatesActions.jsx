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
    getBusinessProcessTemplateData,
    createBusinessProcessTemplate,
    updateBusinessProcessTemplate
} from 'services/connectedSystem_v2';

import * as _ from 'underscore';

class BusinessProcessTemplatesActions extends React.Component {
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
                name: props.business_process_template?.name
                    ? props.business_process_template.name
                    : '',
                driver_id: props.business_process_template?.driver_id
                    ? props.business_process_template.driver_id
                    : '',
                is_active: props.business_process_template?.is_active
                    ? props.business_process_template.is_active
                    : false,
                order_by: props.business_process_template?.order_by
                    ? props.business_process_template.order_by
                    : false,
                process_config: null,
                intelligence_config: null,
                foundation_config: null
            },
            business_process_template_id: props.business_process_template?.id
                ? props.business_process_template.id
                : false,
            active_step: 0,
            loading: false,
            subformOpen: false
        };
    }

    setProcessPreview = (value) => {
        this.setState({
            isProcessPreview: value
        });
    };

    setBusinessProcessTemplateConfig = (processConfig) => {
        this.setState({
            details: {
                ...this.state.details,
                process_config: processConfig
            }
        });
    };

    setSubformOpen = (value) => {
        this.setState({
            subformOpen: value
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

        if (this.state.business_process_template_id) {
            getBusinessProcessTemplateData({
                connSystemBusinessProcessTemplateId: this.state.business_process_template_id,
                callback: this.onResponseBusinessProcessTemplateData
            });
        } else {
            this.setState({
                loading: false,
                details: {
                    ...this.state.details,
                    process_config: {
                        legends: [
                            {
                                id: 1,
                                color: '#DCF1EA',
                                name: 'Completed'
                            },
                            {
                                id: 2,
                                color: '#478BDB',
                                name: 'In Process'
                            },
                            {
                                id: 3,
                                color: 'transparent',
                                name: 'Next Step'
                            }
                        ],
                        nodes: [],
                        edges: []
                    }
                }
            });
        }
    };

    onResponseBusinessProcessTemplateData = (response) => {
        if (response.process_config) {
            response.process_config = {
                legends: [
                    {
                        id: 1,
                        color: '#DCF1EA',
                        name: 'Completed'
                    },
                    {
                        id: 2,
                        color: '#478BDB',
                        name: 'In Process'
                    },
                    {
                        id: 3,
                        color: 'transparent',
                        name: 'Next Step'
                    }
                ],
                nodes: [],
                edges: [],
                ...response.process_config
            };
        } else {
            response.process_config = {
                legends: [
                    {
                        id: 1,
                        color: '#DCF1EA',
                        name: 'Completed'
                    },
                    {
                        id: 2,
                        color: '#478BDB',
                        name: 'In Process'
                    },
                    {
                        id: 3,
                        color: 'transparent',
                        name: 'Next Step'
                    }
                ],
                nodes: [],
                edges: []
            };
        }

        this.setState({
            details: response,
            loading: false
        });
    };

    submit = () => {
        try {
            if (this.props.createBusinessProcessTemplate) {
                createBusinessProcessTemplate({
                    connSystemDriverId: this.state.details.driver_id,
                    payload: this.state.details,
                    callback: this.onResponseCreateBusinessProcessTemplate
                });
            } else {
                updateBusinessProcessTemplate({
                    payload: this.state.details,
                    business_process_template_id: this.state.business_process_template_id,
                    callback: this.onResponseCreateBusinessProcessTemplate
                });
            }
        } catch (error) {
            this.handleUpdateResponse('Failed to complete action. Please try again.', 'error');
        }
    };

    onResponseCreateBusinessProcessTemplate = () => {
        const props = this.props;

        this.handleUpdateResponse(
            props.createBusinessProcessTemplate
                ? 'Process template added Successfully'
                : 'Process template updated Successfully'
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
                {code_id === 'process_config' && !this.state.subformOpen && (
                    <div className={classes.switchWrapper}>
                        <Typography className={classes.switchLabel}>Process View</Typography>
                        <CustomSwitch
                            onChange={this.setProcessPreview}
                            params={{
                                value: this.state.isProcessPreview,
                                size: 'small'
                            }}
                        />
                    </div>
                )}
                {code_id === 'process_config' && this.state.isProcessPreview ? (
                    <DecisionFlowEditor
                        processConfig={this.state.details[code_id]}
                        setBusinessProcessConfig={this.setBusinessProcessTemplateConfig}
                        setSubformOpen={this.setSubformOpen}
                    />
                ) : (
                    <AppAdminCodeEditor
                        code={
                            this.state.details[code_id]
                                ? JSON.stringify(this.state.details[code_id], null, '\t')
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
            </div>
        );
    };

    render() {
        const { classes, createBusinessProcessTemplate } = this.props;

        return [
            !createBusinessProcessTemplate && (
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
            createBusinessProcessTemplate && (
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
                    {this.state.subformOpen ? (
                        <Typography variant="h4" className={classes.subformHeading}>
                            Please save your changes or close the sub-form to get back to the
                            Process Template screen.
                        </Typography>
                    ) : (
                        <Typography variant="h4" className={classes.heading}>
                            {this.state.business_process_template_id
                                ? 'Edit Process Template'
                                : 'Create Process Template'}
                        </Typography>
                    )}
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
                              </Tabs>
                          ),
                          (
                              <div className={classes.subSectionTabBody}>
                                  <CodxCircularLoader center size={60} />
                              </div>
                          ))
                        : [
                              !this.state.subformOpen && (
                                  <Tabs
                                      value={this.state.active_step}
                                      onChange={(e, v) => this.handleStepClick(v)}
                                      aria-label="Business Process Content"
                                      className={classes.subSectionsTabs}
                                  >
                                      <Tab label="Overview" />
                                      <Tab label="Process" />
                                  </Tabs>
                              ),
                              this.state.active_step === 0 && (
                                  <div className={classes.subSectionTabBody}>
                                      <Grid container spacing={4}>
                                          <Grid item xs={6}>
                                              <CustomTextField
                                                  parent_obj={this}
                                                  field_info={{
                                                      label: 'Process Template Name',
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
                              this.state.active_step === 1 && this.getCodeEditor('process_config')
                          ]}
                </DialogContent>
                {this.state.subformOpen ? (
                    ''
                ) : (
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
                )}
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
    subformHeading: {
        color: theme.palette.text.titleText,
        fontSize: '1.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    switchWrapper: {
        position: 'absolute',
        top: '-' + theme.spacing(6),
        right: theme.spacing(5),
        width: 'full',
        // background: theme.palette.background.tableSelcted,
        height: theme.layoutSpacing(56)
        // marginBottom: theme.layoutSpacing(20),
        // borderBottom: '1px solid rgba(0, 0, 0, 0.42)'
    },
    switchCustomSelector: {
        marginLeft: '2rem'
    },
    switchLabel: {
        color: theme.palette.text.revamp,
        fontSize: '1.44rem',
        fontFamily: theme.body.B1.fontFamily,
        letterSpacing: 0,
        lineHeight: 'normal',
        // marginLeft: '1.5rem',
        fontWeight: '500'
    }
});

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(BusinessProcessTemplatesActions);
