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
import {
    getAppVariable,
    updateAppVariable,
    createAppVariable
} from '../../services/app_variables.js';
import { decodeHtmlEntities } from '../../util/decodeHtmlEntities';
import CloseIcon from '../../assets/Icons/CloseBtn';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CodxCircularLoader from '../CodxCircularLoader';
import { UserInfoContext } from '../../context/userInfoContent';

import * as _ from 'underscore';

class AppVariablesPopup extends React.Component {
    static contextType = UserInfoContext;
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: false,
            snackbar: {
                open: false
            },
            details: {
                key: this.props.varKey ? decodeHtmlEntities(this.props.varKey) : '',
                value: this.props.varValue ? decodeHtmlEntities(this.props.varValue) : ''
            },
            errors: {
                error_in_key: false,
                error_in_value: false
            },
            isLoading: true
        };
    }

    componentDidMount() {}

    onResponseGetAppVariable = (response_data, status = 'success') => {
        if (status === 'error') {
            this.setSnackbarStatus('Failed to load Application Variables', 'error');
            this.setState({
                isLoading: false
            });
        } else {
            this.setState({
                details: {
                    key: decodeHtmlEntities(response_data.key),
                    value: decodeHtmlEntities(response_data.value)
                },
                isLoading: false
            });
        }
    };

    setOpen = (value) => {
        this.setState({
            open: value
        });
        if (value === true && this.props.createAppVariableFlag === false) {
            this.setState({
                isLoading: true
            });
            getAppVariable({
                appId: this.props.appId,
                key: this.props.varKey,
                callback: this.onResponseGetAppVariable
            });
        } else {
            this.setState({
                details: { key: '', value: '' },
                isLoading: false,
                errors: {
                    error_in_key: false,
                    error_in_value: false
                }
            });
        }
    };

    submit = () => {
        try {
            if (this.validateInputFields(null, true)) {
                let tempDetails = { ...this.state.details };
                if (this.props.createAppVariableFlag) {
                    createAppVariable({
                        payload: { value: tempDetails.value },
                        appId: this.props.appId,
                        key: tempDetails.key,
                        callback: this.onResponseCreateAppVariable
                    });
                } else {
                    updateAppVariable({
                        payload: { value: tempDetails.value },
                        appId: this.props.appId,
                        key: tempDetails.key,
                        callback: this.onResponseCreateAppVariable
                    });
                }
            }
        } catch (error) {
            this.handleUpdateResponse(error, 'error');
        }
    };

    cancel = () => {
        this.setOpen(false);
    };

    onResponseCreateAppVariable = (status = 'success') => {
        if (status === 'error') {
            this.handleUpdateResponse('Error creating/updating Application Variable', 'error');
        } else {
            this.handleUpdateResponse(
                this.props.createAppVariableFlag ? 'Created Successfully' : 'Updated Successfully'
            );
            this.setState({
                open: false,
                details: { key: '', value: '' }
            });
            // refresh app variable list
            _.delay(
                () => {
                    this.props.getAppVariableList();
                },
                2000,
                ''
            );
        }
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
        this.validateInputFields(field_id);
    };

    validateInputFields = (field_id, on_submit) => {
        let valid = true;
        let errors;

        if (field_id == 'key') {
            errors = {
                error_in_key:
                    this.state.details['key'] === '' ||
                    this.props.keys.includes(this.state.details['key'])
            };
        } else {
            errors = {
                error_in_value: this.state.details['value'] === ''
            };
        }

        if (on_submit) {
            if (this.props.createAppVariableFlag) {
                if (
                    this.state.details['key'] === '' ||
                    this.props.keys.includes(this.state.details['key']) ||
                    this.state.details['value'] === ''
                ) {
                    errors = {
                        error_in_key:
                            this.state.details['key'] === '' ||
                            this.props.keys.includes(this.state.details['key']),
                        error_in_value: this.state.details['value'] === ''
                    };
                    valid = false;
                }
            } else {
                if (this.state.details['key'] === '' || this.state.details['value'] === '') {
                    errors = {
                        error_in_key: this.state.details['key'] === '',
                        error_in_value: this.state.details['value'] === ''
                    };
                    valid = false;
                }
            }
        }

        this.setState((prevState) => ({
            errors: {
                ...prevState.errors,
                ...errors
            }
        }));

        return valid;
    };

    getSubmitButtonState = () => {
        if (this.props.createAppVariableFlag) {
            return (
                this.state.details['key'] === '' ||
                this.props.keys.includes(this.state.details['key']) ||
                this.state.details['value'] === ''
            );
        } else {
            return this.state.details['key'] === '' || this.state.details['value'] === '';
        }
    };

    render() {
        const { classes } = this.props;
        const { error_in_key, error_in_value } = this.state.errors;
        return [
            !this.props.createAppVariableFlag && (
                <IconButton
                    key={1}
                    disabled={this.props.editDisabled}
                    title="Manage Application Variable"
                    onClick={() => {
                        this.setOpen(true);
                    }}
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            ),
            this.props.createAppVariableFlag && (
                <Button
                    key={2}
                    variant="outlined"
                    className={classes.createNewBtn}
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    disabled={this.props.editDisabled}
                    aria-label="Add application variable"
                >
                    Add Application Variable
                </Button>
            ),
            <Dialog
                key={3}
                open={this.state.open}
                fullWidth
                maxWidth="md"
                aria-labelledby={
                    this.props.createAppVariableFlag
                        ? 'create-new-app-variable'
                        : 'updtae-app-variable'
                }
                aria-describedby="app-variables-content"
                className={classes.dialogBody}
                classes={{ container: classes.drawerContainer }}
            >
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id={
                        this.props.createAppVariableFlag
                            ? 'create-new-app-variable'
                            : 'updtae-app-variable'
                    }
                >
                    {this.props.createAppVariableFlag ? (
                        <Typography variant="h4" className={classes.heading}>
                            Create New App Variable
                        </Typography>
                    ) : (
                        <Typography variant="h4" className={classes.heading}>
                            Update App Variable
                        </Typography>
                    )}
                    <IconButton
                        title="Close"
                        onClick={() => {
                            this.setOpen(false);
                        }}
                        className={classes.closeIcon}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorline} />
                <DialogContent id="app-variables-content" className={classes.dialogContent}>
                    {this.state.isLoading ? (
                        <CodxCircularLoader size={60} center />
                    ) : (
                        <Grid key="form-body" container spacing={2}>
                            <Grid item xs={12}>
                                <CustomTextField
                                    key="key"
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Variable Name',
                                        id: 'key',
                                        fullWidth: true,
                                        required: true,
                                        error: error_in_key,
                                        helper_text: error_in_key
                                            ? this.state.details.key === ''
                                                ? 'Name is Mandatory'
                                                : 'App variable already exists'
                                            : '',
                                        value: this.state.details.key,
                                        disabled: this.props.createAppVariableFlag ? false : true,
                                        classes: {
                                            fieldInput: {
                                                backgroundColor: 'transparent !important'
                                            }
                                        },
                                        inputProps: { 'data-testid': 'varKey' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextField
                                    key="value"
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Variable Value',
                                        id: 'value',
                                        fullWidth: true,
                                        required: true,
                                        error: error_in_value,
                                        helper_text: error_in_value
                                            ? 'Value is Mandatory, provide any String value'
                                            : '',
                                        value: this.state.details.value,
                                        multiline: true,
                                        inputProps: {
                                            style: {
                                                font: 'caption'
                                            }
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
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
                        disabled={this.getSubmitButtonState()}
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
    createNewBtn: {
        margin: theme.spacing(2, 2),
        '& svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        },
        color: theme.palette.primary.contrastText
    },
    title: {
        background: theme.palette.background.pureWhite,
        padding: theme.layoutSpacing(20)
    },
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8,
        fontFamily: theme.title.h1.fontFamily
    },
    dialogBody: {
        '& .MuiDialog-paperFullWidth': {
            background: theme.palette.background.paper,
            width: theme.layoutSpacing(854)
        },
        fontFamily: theme.body.B5.fontFamily
    },
    dialogContent: {
        paddingLeft: theme.layoutSpacing(44),
        paddingRight: theme.layoutSpacing(44),
        overflowY: 'visible',
        display: 'flex',
        alignItems: 'center'
    },
    dialogActions: {
        padding: theme.layoutSpacing(24),
        paddingRight: theme.layoutSpacing(44),
        paddingBottom: theme.layoutSpacing(28)
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
)(AppVariablesPopup);
