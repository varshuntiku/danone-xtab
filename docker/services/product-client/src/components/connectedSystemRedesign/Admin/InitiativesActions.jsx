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
    getGoals,
    getInitiativeData,
    createInitiative,
    updateInitiative
} from 'services/connectedSystem_v2';

import * as _ from 'underscore';

class InitiativesActions extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: false,
            snackbar: {
                open: false
            },
            goals: [],
            details: {
                name: props.initiative?.name ? props.initiative.name : '',
                goal_id: props.initiative?.goal_id ? props.initiative.goal_id : false,
                is_active: props.initiative?.is_active ? props.initiative.is_active : false,
                order_by: props.initiative?.order_by ? props.initiative.order_by : false,
                objectives: null
            },
            initiative_id: props.initiative?.id ? props.initiative.id : false,
            active_step: 0,
            loading: true
        };
    }

    setOpen = (value) => {
        const { connSystemDashboardId } = this.props;

        this.setState({
            open: value
        });

        if (value) {
            this.setState({
                loading: true
            });

            getGoals({
                connSystemDashboardId: connSystemDashboardId,
                callback: this.onResponseGoals
            });
        }
    };

    onResponseGoals = (response) => {
        this.setState({
            goals: response
        });

        if (this.state.initiative_id) {
            getInitiativeData({
                connSystemInitiativeId: this.state.initiative_id,
                callback: this.onResponseInitiativeData
            });
        } else {
            this.setState({
                loading: false
            });
        }
    };

    onResponseInitiativeData = (response) => {
        this.setState({
            details: response,
            loading: false
        });
    };

    submit = () => {
        try {
            if (this.props.createInitiative) {
                createInitiative({
                    connSystemGoalId: this.state.details.goal_id,
                    payload: this.state.details,
                    callback: this.onResponseCreateInitiative
                });
            } else {
                updateInitiative({
                    payload: this.state.details,
                    initiative_id: this.state.initiative_id,
                    callback: this.onResponseCreateInitiative
                });
            }
        } catch (error) {
            this.handleUpdateResponse('Failed to complete action. Please try again.', 'error');
        }
    };

    onResponseCreateInitiative = () => {
        const props = this.props;

        this.handleUpdateResponse(
            props.createInitiative
                ? 'Initiative added Successfully'
                : 'Initiative updated Successfully'
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
        const { classes, createInitiative } = this.props;

        return [
            !createInitiative && (
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
            createInitiative && (
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
                aria-labelledby="create-new-initiative"
                aria-describedby="initiative-content"
            >
                <DialogTitle className={classes.title} disableTypography id="create-new-initiative">
                    <Typography variant="h4" className={classes.heading}>
                        {this.state.initiative_id ? 'Edit Initiative' : 'Create New Initiative'}
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
                <DialogContent id="initiative-content">
                    {this.state.loading
                        ? ((
                              <Tabs
                                  value={this.state.active_step}
                                  onChange={(e, v) => this.handleStepClick(v)}
                                  aria-label="ant example"
                                  className={classes.subSectionsTabs}
                              >
                                  <Tab label="Overview" />
                                  <Tab label="Objectives" />
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
                                  aria-label="Initiative Content"
                                  className={classes.subSectionsTabs}
                              >
                                  <Tab label="Overview" />
                                  <Tab label="Objectives" />
                              </Tabs>,
                              this.state.active_step === 0 && (
                                  <div className={classes.subSectionTabBody}>
                                      <Grid container spacing={4}>
                                          <Grid item xs={6}>
                                              <CustomTextField
                                                  parent_obj={this}
                                                  field_info={{
                                                      label: 'Initiative Name',
                                                      id: 'name',
                                                      fullWidth: true,
                                                      value: this.state.details.name
                                                  }}
                                              />
                                              <CustomTextField
                                                  parent_obj={this}
                                                  field_info={{
                                                      label: 'Goal',
                                                      id: 'goal_id',
                                                      is_select: true,
                                                      fullWidth: true,
                                                      options: this.state.goals.map((el) => {
                                                          return {
                                                              label: el.name,
                                                              value: el.id
                                                          };
                                                      }),
                                                      value: this.state.details.goal_id
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
                              this.state.active_step === 1 && this.getCodeEditor('objectives')
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
)(InitiativesActions);
