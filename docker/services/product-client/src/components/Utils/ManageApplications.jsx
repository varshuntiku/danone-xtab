import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
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
    Switch
} from '@material-ui/core';
import { editAppdetails } from 'services/app.js';

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import dashboardStyle from 'assets/jss/dashboardStyle.jsx';
import { grey } from '@material-ui/core/colors';
import sanitizeHtml from 'sanitize-html-react';
import { decodeHtmlEntities } from '../../util/decodeHtmlEntities';
import CloseIcon from '../../assets/Icons/CloseBtn';
// import TextInput from "../dynamic-form/inputFields/textInput";

import * as _ from 'underscore';

class ManageApplications extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            open: false,
            application: {
                ...props.application,
                description: this.props.application.description
                    ? decodeHtmlEntities(sanitizeHtml(this.props.application.description))
                    : ''
            },
            snackbar: {
                open: false
            },
            errorInBlueprintLink: false,
            errors: {
                name: false,
                industry: false,
                function: false
            }
        };
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.application) !== JSON.stringify(this.props.application)) {
            this.setState((prevstate) => ({
                ...prevstate,
                application: this.props.application
            }));
        }
    }

    clearFunctions = () => {
        this.setState((prevState) => ({
            application: {
                ...prevState.application,
                function: ''
            }
        }));
    };

    onResponseGetIndustriesList = (response_data) => {
        let parentIndustries = new Set();
        let allIndustries = new Set();
        const allLabelMap = {};
        // get parent industries, all industries and mapping of industry name with id
        _.map(response_data, function (industry) {
            if (industry.parent_industry_id) {
                parentIndustries.add(industry.parent_industry_id);
            }
            if (!industry.parent_industry_id) {
                parentIndustries.add(industry.id);
            }
            allIndustries.add(industry.id);
            allLabelMap[industry.id] = industry.industry_name;
        });

        // get child industries by filtering all industries which aren't present in parent industries
        const childIndustries = new Set([...allIndustries]); //.filter((el)=>!parentIndustries.has(el)))

        let finalList = _.map([...childIndustries], function (industryId) {
            return {
                label: `${allLabelMap[industryId]} - ${industryId}`,
                value: `${allLabelMap[industryId]}-${industryId}`
            };
        });

        // add industry which isn't child anymore but was mapped previously if we are changing application data
        if (this.props.changeApplicationData) {
            const [missingId] = Object.keys(allLabelMap).filter(
                (indx) => allLabelMap[indx] === this.state.application.industry
            );
            if (missingId && !childIndustries.has(Number(missingId))) {
                finalList.push({
                    label: `${allLabelMap[missingId]} - ${missingId}`,
                    value: `${allLabelMap[missingId]}-${missingId}`
                });
            }
        }
        this.setState({
            industries: finalList
        });
    };

    // onResponseGetFunctionsList = (response_data) => {

    //     this.setState({
    //         functions_list: response_data,
    //     });
    //     this.prepareFunctionsList()
    // }

    isValidIDFromLink = (link, matchString) => {
        // const validLinkRegex = new RegExp(/^(\/?[a-zA-Z0-9_-]+)+\/?$/);
        // // check if the link is valid first
        // if (!validLinkRegex.test(link)) {
        //     return false;
        // }
        const extractID = link.match(new RegExp(`${matchString}\/([^\/]+)`));
        if (extractID && extractID[1]) {
            // Check if ID number or not
            return !isNaN(extractID[1]) && !isNaN(parseFloat(extractID[1]));
        }
        return null;
    };

    handleErrors = (field_id, field_value) => {
        let mandatoryFeilds = ['name', 'function', 'industry'];
        const { errors } = this.state;
        let updatedErrors = { ...errors };
        if (mandatoryFeilds.includes(field_id) && !field_value) updatedErrors[field_id] = true;
        else updatedErrors[field_id] = false;
        this.setState({ errors: updatedErrors });
    };

    validateInputFeilds = () => {
        const { industry, name, function: function_name } = this.state.application;
        let error = {};
        if (!industry) error.industry = true;
        if (!name) error.name = true;
        if (!function_name) error.function = true;
        if (Object.keys(error).length > 0) {
            this.setState({ errors: error });
            return false;
        }
        return true;
    };

    onHandleFieldChange = (field_id, field_value) => {
        var application = { ...this.state.application };
        field_value = field_value.toString();
        this.handleErrors(field_id, field_value);
        let [value, uniqId] = field_value.split(/-(\d+)/gm);
        if (field_id === 'function') {
            this.setState((prevState) => ({
                application: {
                    ...prevState.application,
                    function: value
                }
            }));
        }
        if (field_id === 'blueprint_link') {
            if (field_value.length > 0 && field_value !== '') {
                let errorState = false;
                if (
                    (field_value.includes('projects') || field_value.includes('case-studies')) &&
                    field_value.endsWith('/design')
                ) {
                    const isValidProjectId = this.isValidIDFromLink(field_value, 'projects');
                    if (isValidProjectId) {
                        // Case-studies must also have valid projects/:id in url
                        if (field_value.includes('case-studies')) {
                            errorState = this.isValidIDFromLink(field_value, 'case-studies')
                                ? false
                                : true;
                        } else {
                            errorState = false;
                        }
                    } else {
                        errorState = true;
                    }
                } else {
                    errorState = true;
                }
                this.setState({
                    errorInBlueprintLink: errorState
                });
            } else {
                this.setState({
                    errorInBlueprintLink: false
                });
            }
        }

        application[field_id] = value;
        if (uniqId) {
            application[`${field_id}_id`] = Number(uniqId);
        }

        if (field_id === 'industry') {
            if (value !== this.state.application.industry) {
                application['function'] = '';
                this.handleErrors('function', '');
            }
            this.prepareFunctionsList(this.props.functionsData, application);
        }
        this.setState({
            application: application
        });
    };

    setOpen = (value) => {
        this.onResponseGetIndustriesList(this.props.industriesData);
        this.prepareFunctionsList(this.props.functionsData);
        this.setState({
            open: value
        });
    };

    cancel = () => {
        this.setOpen(false);
        this.handleUpdateResponse('Cancelled Successfully', 'warning');
        this.setState({
            errorInBlueprintLink: false
        });
        _.delay(
            () => {
                this.props.refreshApplicationsList();
            },
            2000,
            ''
        );
    };

    prepareFunctionsList = (functionsData, application = this.state.application) => {
        // get parentFunctions and all functions
        const parentFunctions = new Set();
        const allFunctions = new Set();
        const allFunctionsIds = new Set();
        const LabelMap = {};
        _.map(functionsData, (row) => {
            if (row.parent_function_name) {
                parentFunctions.add(row.parent_function_name);
            }
            if (row.industry_name === application?.industry) {
                allFunctions.add(row.function_name);
                allFunctionsIds.add(row.function_id);
                LabelMap[row.function_id] = row.function_name;
            }
        });
        const childfunctionslist = new Set([...allFunctionsIds]);
        let finalfunctionlist = _.map([...childfunctionslist], function (function_id) {
            return {
                label: `${LabelMap[function_id]} - ${function_id}`,
                value: `${LabelMap[function_id]}-${function_id}`
            };
        });
        this.setState({
            functions: finalfunctionlist
        });
    };

    saveChanges = async () => {
        if (this.validateInputFeilds()) {
            const applicationData = {
                ...this.state.application,
                description: this.state.application.description
                    ? sanitizeHtml(this.state.application?.description)
                    : ''
            };
            // check an format blueprint link
            if (applicationData && applicationData['blueprint_link']) {
                let blueprintLink = applicationData['blueprint_link'];
                blueprintLink[0] !== '/' ? (blueprintLink = `/${blueprintLink}`) : '';
                applicationData['blueprint_link'] = blueprintLink;
            }
            try {
                await editAppdetails({
                    app_id: this.state.application.id,
                    payload: applicationData,
                    callback: this.onResponseEditAppDetails
                });
            } catch (error) {
                this.handleUpdateResponse(error.message, 'error');
            }
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
        } else if (severity === 'warning') {
            this.setState((prevState) => ({
                snackbar: {
                    ...prevState.snackbar,
                    open: true,
                    message: message,
                    severity: severity
                },
                application: {
                    ...prevState.application,
                    name: this.props.application.name,
                    industry: this.props.application?.industry
                        ? this.props.application.industry
                        : '',
                    logo_url: this.props.application.logo_url,
                    blueprint_link: this.props.application.blueprint_link,
                    description: this.props.application.description,
                    config_link: this.props.application.config_link,
                    orderby: this.props.application.orderby,
                    small_logo_url: this.props.application.small_logo_url
                }
            }));
        } else {
            this.setState((prevState) => ({
                snackbar: {
                    ...prevState.snackbar,
                    open: true,
                    message: message,
                    severity: severity
                }
            }));
        }
    };

    onResponseEditAppDetails = () => {
        this.handleUpdateResponse('Updated Successfully');
        this.setOpen(false);
        _.delay(
            () => {
                this.props.refreshApplicationsList();
            },
            1000,
            ''
        );
    };

    render() {
        const { classes } = this.props;
        const {
            name: error_in_name,
            industry: error_in_industry,
            function: error_in_function
        } = this.state.errors;
        let industry_value =
            this.state.application?.industry && this.state.application?.industry_id
                ? `${this.state.application.industry}-${this.state.application.industry_id}`
                : '';
        let function_value =
            this.state.application?.function && this.state.application?.function_id
                ? `${this.state.application.function}-${this.state.application.function_id}`
                : '';
        return [
            this.props.changeApplicationData && (
                <IconButton
                    key={1}
                    title="Manage Application"
                    disabled={this.props.editDisabled}
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    aria-label="Edit"
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            ),
            <Dialog
                key={2}
                open={this.state.open}
                fullWidth
                maxWidth="md"
                aria-labelledby="edit-application"
                aria-describedby="application-form-content"
                classes={{ paper: classes.paper }}
            >
                <DialogTitle className={classes.title} disableTypography id="edit-application">
                    <Typography variant="h4" className={classes.heading}>
                        Edit Application
                    </Typography>
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
                <DialogContent className={classes.layoutSpacing} id="application-form-content">
                    <Grid key="form-body" container spacing={9}>
                        <Grid item xs className={classes.spacing}>
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Application Name',
                                    id: 'name',
                                    required: true,
                                    error: error_in_name,
                                    helper_text: error_in_name
                                        ? 'Application Name is Mandatory'
                                        : '',
                                    fullWidth: true,
                                    value: this.state.application?.name
                                        ? this.state.application.name
                                        : ''
                                }}
                            />
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Assigned Order',
                                    id: 'orderby',
                                    fullWidth: true,
                                    value: this.state.application?.orderby
                                        ? this.state.application.orderby
                                        : this.state.application.orderby === 0
                                        ? '0'
                                        : 0
                                }}
                            />
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Blueprint Link',
                                    id: 'blueprint_link',
                                    fullWidth: true,
                                    value: this.state.application?.blueprint_link
                                        ? this.state.application.blueprint_link
                                        : '',
                                    error: this.state?.errorInBlueprintLink,
                                    helper_text: this.state?.errorInBlueprintLink
                                        ? 'Notebook Link added is incorrect. Please check the format.'
                                        : ''
                                }}
                            />
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Main Logo Url',
                                    id: 'logo_url',
                                    fullWidth: true,
                                    value: this.state.application?.logo_url
                                        ? this.state.application.logo_url
                                        : ''
                                }}
                            />
                            <div>
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Small Logo Url',
                                        id: 'small_logo_url',
                                        fullWidth: true,
                                        value: this.state.application?.small_logo_url
                                            ? this.state.application.small_logo_url
                                            : ''
                                    }}
                                />
                                <FormControlLabel
                                    className={classes.editToogleButton}
                                    style={{ marginLeft: '-5px' }}
                                    control={
                                        <Switch
                                            size="small"
                                            checked={this.state.application?.nac_collaboration}
                                            onChange={(e, v) => {
                                                this.setState({
                                                    application: {
                                                        ...this.state.application,
                                                        nac_collaboration: v
                                                    }
                                                });
                                            }}
                                            name="nac_collaboration"
                                        />
                                    }
                                    label="Enable collaboration on App Configurator"
                                />
                                <FormControlLabel
                                    className={classes.editToogleButton}
                                    style={{ marginLeft: '-5px' }}
                                    control={
                                        <Switch
                                            size="small"
                                            checked={
                                                this.state.application?.is_connected_systems_app
                                            }
                                            onChange={(e, v) => {
                                                this.setState({
                                                    application: {
                                                        ...this.state.application,
                                                        is_connected_systems_app: v
                                                    }
                                                });
                                            }}
                                            name="is_connected_systems_app"
                                        />
                                    }
                                    label="Connected Systems App"
                                />
                            </div>
                        </Grid>
                        <Grid item xs className={classes.spacing}>
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Industry Selected',
                                    is_select: true,
                                    id: 'industry',
                                    fullWidth: true,
                                    required: true,
                                    error: error_in_industry,
                                    helper_text: error_in_industry ? 'Industry is Mandatory' : '',
                                    selectProps: {
                                        value: industry_value
                                    },
                                    options:
                                        this.state.application && this.state.industries
                                            ? this.state.industries
                                            : [],
                                    inputProps: { 'data-testid': 'industry' }
                                }}
                            />

                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Function',
                                    id: 'function',
                                    fullWidth: true,
                                    is_select: true,
                                    required: true,
                                    error: error_in_function,
                                    helper_text:
                                        this.state?.functions?.length === 0
                                            ? 'No functions tagged'
                                            : error_in_function
                                            ? 'Function is Mandatory'
                                            : '',
                                    options:
                                        this.state.application && this.state.functions
                                            ? this.state.functions
                                            : [],
                                    selectProps: {
                                        value: function_value
                                    }
                                }}
                            />
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Config Link',
                                    id: 'config_link',
                                    fullWidth: true,
                                    value: this.state.application?.config_link
                                        ? this.state.application.config_link
                                        : ''
                                }}
                            />
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Add Description',
                                    id: 'description',
                                    fullWidth: true,
                                    multiline: true,
                                    rows: 4,
                                    value: this.state.application?.description
                                        ? this.state.application.description
                                        : ''
                                }}
                            />
                        </Grid>
                    </Grid>
                    ,
                </DialogContent>
                <DialogActions style={{ padding: '8px 24px 24px' }}>
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
                        disabled={
                            this.state?.errorInBlueprintLink ||
                            error_in_function ||
                            error_in_name ||
                            error_in_industry
                        }
                        onClick={this.saveChanges}
                        aria-label="Save"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>,
            <CustomSnackbar
                key={3}
                message={this.state.snackbar.message}
                open={this.state.snackbar.open}
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

ManageApplications.propTypes = {
    classes: PropTypes.object.isRequired
};

const styles = (theme) => ({
    paper: {
        background: theme.palette.background.modelBackground,
        backdropFilter: 'blur(2rem)',
        borderRadius: 0,
        border: 'none'
    },
    main: {
        width: '80%',
        margin: '10rem auto'
    },
    searchTextBox: {
        width: '35%'
    },
    searchResultsContainer: {
        position: 'relative !important',
        width: 'unset !important'
    },
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    multiSelect: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.primary.dark,
        borderRadius: theme.spacing(0.5),
        color: theme.palette.text.default,
        marginBottom: theme.spacing(2)
    },
    label: {
        color: theme.palette.text.default,
        padding: theme.spacing(1, 0),
        fontSize: '1rem'
    },
    input: {
        color: theme.palette.text.default + ' !important',
        fontSize: '1.5rem'
    },
    editToogleButton: {
        marginTop: '2rem',
        '& .Mui-checked .MuiSwitch-thumb': {
            color: theme.palette.primary.contrastText
        },
        '& .MuiSwitch-thumb': {
            color: grey[500]
        },
        '& .MuiTypography-root': {
            fontSize: '1.5rem',
            marginLeft: '1rem'
        }
    },
    spacing: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem'
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
    sepratorline: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 32px)'
    },
    closeIcon: {
        position: 'absolute',
        cursor: 'pointer',
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
        ...dashboardStyle(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(ManageApplications);
