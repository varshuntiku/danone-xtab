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
import AppAdminCodeEditor from 'components/Admin/AppAdminCodeEditor.jsx';
import {
    getAppFunction,
    updateAppFunction,
    createAppFunction,
    testAppFunction
} from '../../services/app_functions.js';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CodxCircularLoader from '../CodxCircularLoader';
import { decodeHtmlEntities } from '../../util/decodeHtmlEntities';
import CloseIcon from '../../assets/Icons/CloseBtn.jsx';
import * as _ from 'underscore';

class AppFunctionsPopup extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: false,
            snackbar: {
                open: false
            },
            details: {
                key: this.props.funcKey ? this.props.funcKey : '',
                value: this.props.funcValue ? this.props.funcValue : '',
                desc: this.props.funcDesc ? decodeHtmlEntities(this.props.funcDesc) : '',
                test: this.props.funcTest ? this.props.funcTest : ''
            },
            isLoading: true,
            editMode: true,
            output: false,
            output_logs: false,
            output_timetaken: false,
            output_size: false,
            testInProgress: false,
            pristine: true
        };
    }

    componentDidMount() {}

    onResponseGetAppFunction = (response_data, status = 'success') => {
        if (status === 'error') {
            this.setSnackbarStatus('Failed to load Application Functions', 'error');
            this.setState({
                isLoading: false
            });
        } else {
            response_data = { ...response_data, desc: decodeHtmlEntities(response_data.desc) };
            this.setState({
                details: response_data,
                isLoading: false
            });
        }
    };

    onChangeCode = (code_text) => {
        var details = this.state.details;
        if (details.value !== code_text) {
            details.value = code_text;

            this.setState({
                details: details
            });
        }
    };

    onChangeTestCode = (code_text) => {
        var details = this.state.details;
        if (details.test !== code_text) {
            details.test = code_text;

            this.setState({
                details: details
            });
        }
    };

    setOpen = (value) => {
        this.setState({
            open: value,
            pristine: true
        });
        if (value === true && this.props.createAppFunctionFlag === false) {
            this.setState({
                isLoading: true
            });
            getAppFunction({
                appId: this.props.appId,
                key: this.props.funcKey,
                callback: this.onResponseGetAppFunction
            });
        } else {
            this.setState({
                details: { key: '', value: this.props.funcValue, test: this.props.funcTest },
                isLoading: false
            });
        }
    };

    submit = () => {
        try {
            let tempDetails = { ...this.state.details };
            if (this.props.createAppFunctionFlag) {
                createAppFunction({
                    payload: {
                        value: tempDetails.value,
                        test: tempDetails.test,
                        desc: tempDetails.desc
                    },
                    appId: this.props.appId,
                    key: tempDetails.key,
                    callback: this.onResponseCreateAppFunction
                });
            } else {
                updateAppFunction({
                    payload: {
                        value: tempDetails.value,
                        test: tempDetails.test,
                        desc: tempDetails.desc
                    },
                    appId: this.props.appId,
                    key: tempDetails.key,
                    callback: this.onResponseCreateAppFunction
                });
            }
        } catch (error) {
            this.handleUpdateResponse(error, 'error');
        }
    };

    testCode = () => {
        try {
            let tempDetails = { ...this.state.details };
            this.setState({ testInProgress: true });
            testAppFunction({
                appId: this.props.appId,
                key: tempDetails.key,
                payload: {
                    value: tempDetails.value,
                    test: tempDetails.test
                },
                callback: this.onResponseTestAppFunction
            });
        } catch (error) {
            this.setState({ testInProgress: false });
            this.handleUpdateResponse(error, 'error');
        }
    };

    cancel = () => {
        this.setOpen(false);
    };

    onResponseTestAppFunction = (response_data) => {
        // this.handleUpdateResponse(
        //     'Tested Successfully'
        // );
        this.setState({
            output: response_data['output'],
            output_logs: response_data['logs'],
            output_timetaken: response_data['timetaken'],
            output_size: response_data['size'],
            testInProgress: false
        });
    };

    onResponseCreateAppFunction = (status = 'success') => {
        if (status === 'error') {
            this.handleUpdateResponse('Error creating/updating Application Function', 'error');
        } else {
            this.handleUpdateResponse(
                this.props.createAppFunctionFlag ? 'Created Successfully' : 'Updated Successfully'
            );

            // refresh app function list
            _.delay(
                () => {
                    this.setState({
                        open: false,
                        details: { key: '', value: '' },
                        output: '',
                        output_logs: '',
                        output_timetaken: '',
                        output_size: ''
                    });
                    this.props.getAppFunctionList();
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
            details: details,
            pristine: false
        });
    };

    render() {
        const { classes } = this.props;
        let errors = {
            error_in_key:
                this.props.createAppFunctionFlag === true &&
                !this.state.pristine &&
                (this.state.details['key'] === '' ||
                    this.props.keys.includes(this.state.details['key'])),
            error_in_value: this.state.details['value'] === '',
            error_in_test: this.state.details['test'] === ''
        };
        const { error_in_key, error_in_value, error_in_test } = errors;
        return [
            !this.props.createAppFunctionFlag && (
                <IconButton
                    key={1}
                    title="Manage Application Function"
                    disabled={this.props.editDisabled}
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    aria-label="Edit"
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            ),
            this.props.createAppFunctionFlag && (
                <Button
                    key={2}
                    variant="outlined"
                    className={classes.createNewBtn}
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    disabled={this.props.editDisabled}
                    aria-label="Add application function"
                >
                    Add Application Function
                </Button>
            ),
            <Dialog
                key={3}
                open={this.state.open}
                fullWidth
                maxWidth="xl"
                classes={{ paper: classes.overflowXHidden }}
                aria-labelledby={
                    this.props.createAppFunctionFlag
                        ? 'create-new-app-function'
                        : 'update-app-function'
                }
                aria-describedby="app-function-dialog-content"
            >
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
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id={
                        this.props.createAppFunctionFlag
                            ? 'create-new-app-function'
                            : 'update-app-function'
                    }
                >
                    {this.props.createAppFunctionFlag ? (
                        <Typography variant="h4" className={classes.heading}>
                            Create New App Function
                        </Typography>
                    ) : (
                        <Typography variant="h4" className={classes.heading}>
                            Update App Function
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
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorline} />
                <DialogContent
                    id="app-function-dialog-content"
                    className={classes.functionDialogStyle}
                >
                    {this.state.isLoading ? (
                        <CodxCircularLoader size={60} center />
                    ) : (
                        <Grid key="form-body" container spacing={2} style={{ padding: '2rem 0' }}>
                            <Grid item xs={12}>
                                <CustomTextField
                                    key="key"
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Function Name',
                                        id: 'key',
                                        fullWidth: true,
                                        required: true,
                                        error: error_in_key,
                                        helper_text: error_in_key
                                            ? this.state.details.key === ''
                                                ? 'Name is Mandatory'
                                                : 'App function already exists'
                                            : '',
                                        value: this.state.details.key,
                                        disabled: this.props.createAppFunctionFlag ? false : true,
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
                                    key="key"
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Description',
                                        id: 'desc',
                                        fullWidth: true,
                                        value: this.state.details.desc,
                                        classes: {
                                            fieldInput: {
                                                backgroundColor: 'transparent !important'
                                            }
                                        }
                                        // inputProps: { 'data-testid': 'varKey' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h5"
                                    className={classes.defaultColor}
                                    gutterBottom
                                >
                                    {"Application Function's Code:"}
                                </Typography>
                                <AppAdminCodeEditor
                                    code={this.state.details.value ? this.state.details.value : ''}
                                    test={this.state.details.test ? this.state.details.test : ''}
                                    onChangeCodeCallback={this.onChangeCode}
                                    onChangeTestCodeCallback={this.onChangeTestCode}
                                    readOnly={!this.state.editMode}
                                    extraClasses={{
                                        editorSection: classes.editorSectionSmall,
                                        outputSection: classes.outputSection
                                    }}
                                    showTest={true}
                                    testLabel="SAMPLE CODE"
                                    output={decodeHtmlEntities(this.state.output)}
                                    logs={this.state.output_logs}
                                    timetaken={this.state.output_timetaken}
                                    size={this.state.output_size}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions className={classes.dialogActionContainer}>
                    <Button
                        className={classes.btn}
                        variant="outlined"
                        onClick={this.cancel}
                        aria-aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        className={classes.btn}
                        variant="contained"
                        onClick={this.testCode}
                        disabled={
                            error_in_key ||
                            error_in_value ||
                            error_in_test ||
                            this.state.testInProgress
                        }
                        startIcon={
                            this.state.testInProgress ? (
                                <div style={{ position: 'relative', width: '2rem' }}>
                                    <CodxCircularLoader size={30} center />
                                </div>
                            ) : null
                        }
                        aria-label="Test Sample code"
                    >
                        Test Sample Code
                    </Button>
                    <Button
                        className={classes.btn}
                        variant="contained"
                        onClick={this.submit}
                        disabled={error_in_key || error_in_value}
                        aria-label="Save"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
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
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    title: {
        background: theme.palette.background.pureWhite
    },
    closeIcon: {
        position: 'absolute',
        top: theme.layoutSpacing(12),
        right: 0,
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        }
    },
    sepratorline: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 32px)'
    },
    dialogActionContainer: {
        padding: `{${theme.layoutSpacing(0)}${theme.layoutSpacing(44)}}`,
        paddingBottom: theme.layoutSpacing(28)
    }
});

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(AppFunctionsPopup);
