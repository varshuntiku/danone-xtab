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
    FormLabel
} from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import { createFunction, updateFunction } from 'services/dashboard.js';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import textFieldStyle from 'assets/jss/textFieldStyle';
import sanitizeHtml from 'sanitize-html-react';
import functionSpecs from 'assets/data/functionSpecs.jsx';
import { decodeHtmlEntities } from '../../util/decodeHtmlEntities';
import { getFunctions } from 'store/index';
import { connect } from 'react-redux';
import CloseIcon from '../../assets/Icons/CloseBtn';

import * as _ from 'underscore';

class ManageFunctions extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            open: false,
            snackbar: {},
            details: {
                industry_id: props.function?.industry_id ? props.function.industry_id : '',
                function_id: props.function?.function_id ? props.function.function_id : '',
                function_name: props.function?.function_name ? props.function.function_name : '',
                parent_function_id: props.function?.parent_function_id
                    ? props.function.parent_function_id
                    : '',
                description: props.function?.description
                    ? decodeHtmlEntities(sanitizeHtml(props.function.description))
                    : '',
                logo_name: props.function?.logo_name ? props.function.logo_name : '',
                order: props.function?.order ? props.function.order : 0,
                level: props.function?.level ? props.function.level : null,
                color: props.function?.color ? props.function.color : null
            },
            functions: [],
            errors: {
                industry_id: false,
                function_name: false,
                logo_name: false,
                order: false
            },
            notificationOpen: false
        };
        this.functionSpecs = functionSpecs;
    }

    validateFunction(name, industry_id) {
        const functionsData = this.props.functionsData;
        const found = functionsData.filter(
            (element) =>
                element.industry_id === industry_id &&
                element.function_name.toLowerCase() === name.toLowerCase()
        );
        if (this.props.createNewFunction) {
            return found.length === 0;
        } else {
            if (found.length === 0) {
                return true;
            } else if (
                found.length === 1 &&
                found[0].function_id === this.state.details.function_id
            ) {
                return true;
            } else {
                return false;
            }
        }
    }

    componentDidMount() {
        var functionLogoList = _.map(Object.keys(this.functionSpecs), function (functionItem) {
            return { label: functionItem, value: functionItem };
        });
        this.setState({
            functionLogoList: functionLogoList
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.function !== this.props.function) {
            this.setState({
                details: {
                    industry_id: this.props.function?.industry_id
                        ? this.props.function.industry_id
                        : '',
                    function_id: this.props.function?.function_id
                        ? this.props.function.function_id
                        : '',
                    function_name: this.props.function?.function_name
                        ? this.props.function.function_name
                        : '',
                    parent_function_id: this.props.function?.parent_function_id
                        ? this.props.function.parent_function_id
                        : '',
                    description: this.props.function?.description
                        ? decodeHtmlEntities(sanitizeHtml(this.props.function.description))
                        : '',
                    logo_name: this.props.function?.logo_name ? this.props.function.logo_name : '',
                    order: this.props.function?.order ? this.props.function.order : 0,
                    level: this.props.function?.level ? this.props.function.level : null,
                    color: this.props.function?.color ? this.props.function.color : null
                }
            });
        }
    }

    onResponseGetIndustriesList = (response_data) => {
        var parentIndustryIds = [];
        var allData = {};
        for (let industry of response_data) {
            allData[industry.id] = industry.industry_name;
            if (
                industry?.parent_industry_id &&
                !parentIndustryIds.includes(industry.parent_industry_id)
            ) {
                parentIndustryIds.push(industry?.parent_industry_id);
            }
        }
        var childIndustries = _.filter(response_data, function (industry) {
            if (industry.parent_industry_id !== null) {
                return true;
            }
        });
        var childIndustryIds = [];
        for (let industry of childIndustries) {
            childIndustryIds.push(industry.id);
        }
        // var industrylist = _.filter(response_data, function (industry) {
        //     if(childIndustryIds.includes(industry.id) && !parentIndustryIds.includes(industry.id)){
        //         return true
        //     }
        //     // return { label: industry.industry_name + ' - ' + industry.id, value: industry.id }
        // });
        var finalIndustryList = _.map(response_data, function (industry) {
            return { label: `${industry.industry_name} - ${industry.id}`, value: industry.id };
        });
        if (!this.props.createNewFunction) {
            const industryId = this.state.details.industry_id;
            const isPresent = finalIndustryList.find((elem) => {
                if (elem.value === industryId) {
                    return true;
                }
                return false;
            });
            if (!isPresent) {
                finalIndustryList.push({
                    label: `${allData[industryId]} - ${industryId}`,
                    value: industryId
                });
            }
        }
        this.setState({
            industries: finalIndustryList
        });
    };

    setOpen = (value) => {
        this.onResponseGetIndustriesList(this.props.industriesData);
        var functionsList = _.map(this.props.functionsData, function (item) {
            return {
                label: `${item.function_name} - ${item.function_id}`,
                value: item.function_id
            };
        });
        this.setState({
            open: value,
            functions: functionsList
        });
    };

    submit = async () => {
        if (this.validateInputFeilds()) {
            let payload = {
                ...this.state.details,
                description: this.state.details.description
                    ? sanitizeHtml(this.state.details?.description)
                    : ''
            };
            try {
                if (this.props.createNewFunction) {
                    await createFunction({
                        payload: payload,
                        callback: this.onResponseCreateFunction
                    });
                } else {
                    await updateFunction({
                        payload: payload,
                        callback: this.onResponseCreateFunction
                    });
                }
                this.props.getFunctions({});
            } catch (error) {
                this.handleUpdateResponse(error, 'error');
            }
        }
    };
    validateInputFeilds = () => {
        const { order, industry_id, function_name, logo_name } = this.state.details;
        let error = {};
        if (!industry_id) error.industry_id = true;
        if (!function_name || !this.validateFunction(function_name, industry_id))
            error.function_name = true;
        if (!logo_name) error.logo_name = true;
        if (!order || isNaN(order)) error.order = true;
        if (Object.keys(error).length > 0) {
            this.setState({ errors: error });
            return false;
        }
        return true;
    };
    cancel = () => {
        this.setOpen(false);
        this.handleUpdateResponse('Cancelled Successfully', 'warning');
    };

    onResponseCreateFunction = () => {
        if (this.props.createNewFunction) {
            this.handleUpdateResponse('Created Successfully');
            this.setOpen(false);
        } else {
            this.handleUpdateResponse('Updated Successfully');
            this.setOpen(false);
        }
    };

    handleUpdateResponse = (message, severity = 'success') => {
        if (severity === 'error') {
            this.setState((prevState) => ({
                notificationOpen: true,
                snackbar: {
                    ...prevState.snackbar,
                    message: message,
                    severity: severity
                }
            }));
        } else {
            if (this.props.createNewFunction) {
                this.setState((prevState) => ({
                    notificationOpen: true,
                    snackbar: {
                        ...prevState.snackbar,
                        message: message,
                        severity: severity
                    },
                    details: {
                        ...prevState.details,
                        industry_id: '',
                        function_name: '',
                        parent_function_id: '',
                        description: '',
                        logo_name: '',
                        order: 0,
                        level: null,
                        color: null
                    }
                }));
            } else {
                this.setState((prevState) => ({
                    notificationOpen: true,
                    snackbar: {
                        ...prevState.snackbar,
                        message: message,
                        severity: severity
                    },
                    details: {
                        ...prevState.details,
                        industry_id: this.props.function.industry_id,
                        function_id: this.props.function.function_id,
                        function_name: this.props.function.function_name,
                        parent_function_id: this.props.function.parent_function_id,
                        description: this.props.function.description
                            ? sanitizeHtml(this.props.function.description)
                            : '',
                        logo_name: this.props.function.logo_name,
                        order: this.props.function.order,
                        level: this.props.function.level,
                        color: this.props.function.color
                    }
                }));
            }
        }
    };
    onHandleFocusChange = (field_id, field_value) => {
        this.handleErrors(field_id, field_value);
    };

    handleErrors = (field_id, field_value) => {
        let mandatoryFeilds = ['function_name', 'industry_id', 'logo_name', 'order'];
        const { errors } = this.state;
        let updatedErrors = { ...errors };
        if (mandatoryFeilds.includes(field_id) && !field_value) {
            updatedErrors[field_id] = true;
        } else {
            updatedErrors[field_id] = false;
        }
        this.setState({ errors: updatedErrors });
    };

    onHandleFieldChange = (field_id, field_value) => {
        // var suggestedOrderValue = (this.props.orderValue ? this.props.orderValue : 0) + 1;
        var details = this.state.details;
        this.handleErrors(field_id, field_value);
        if (field_id === 'order') {
            if (field_value === '') {
                field_value = 0;
            } else {
                field_value = parseInt(field_value);
            }
        }
        details[field_id] = field_value;
        // TODO: Fix state update when values are same as suggested value
        this.setState({
            details: details
        });
    };

    render() {
        const { classes, orderValue } = this.props;
        const suggestedOrderValue = (orderValue ? orderValue : 0) + 1;
        const {
            industry_id: error_in_industry,
            logo_name: error_in_logo,
            function_name: error_in_name,
            order: error_in_order
        } = this.state.errors;
        return [
            !this.props.createNewFunction && (
                <IconButton
                    key={1}
                    title="Manage Function"
                    onClick={() => {
                        this.setOpen(true);
                    }}
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            ),
            this.props.createNewFunction && (
                <Button
                    key={2}
                    variant="contained"
                    className={classes.createNewButton}
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    aria-label="Create New"
                >
                    Create New
                </Button>
            ),
            <Dialog
                key={3}
                open={this.state.open}
                fullWidth
                maxWidth="md"
                aria-labelledby={
                    this.props.createNewFunction ? 'create-new-function' : 'update-function'
                }
                aria-describedby="function-form"
                classes={{ paper: classes.paper }}
            >
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id={this.props.createNewFunction ? 'create-new-function' : 'update-function'}
                >
                    {this.props.createNewFunction ? (
                        <Typography variant="h4" className={classes.heading}>
                            Create New Function
                        </Typography>
                    ) : (
                        <Typography variant="h4" className={classes.heading}>
                            Update Function
                        </Typography>
                    )}
                    <IconButton
                        title="Close"
                        onClick={() => {
                            this.setOpen(false);
                        }}
                        className={classes.closeIcon}
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorLine} />
                <DialogContent
                    className={`${classes.layoutSpacing} ${classes.functionsColumnWrapper}`}
                    id="function-form"
                >
                    <Grid key="form-body" container spacing={9}>
                        <Grid item xs className={classes.spacing}>
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Industry Name',
                                    id: 'industry_id',
                                    is_select: true,
                                    fullWidth: true,
                                    required: true,
                                    error: error_in_industry,
                                    helper_text: error_in_industry ? 'Industry is Mandatory' : '',
                                    options: this.state.industries ? this.state.industries : [],
                                    value: this.state.details.industry_id
                                }}
                            />
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Logo Name',
                                    is_select: true,
                                    id: 'logo_name',
                                    fullWidth: true,
                                    required: true,
                                    error: error_in_logo,
                                    helper_text: error_in_logo ? 'Logo is Mandatory' : '',
                                    options: this.state.functionLogoList,
                                    page: 'functions',
                                    value:
                                        this.state.details && this.state.details['logo_name']
                                            ? this.state.details['logo_name']
                                            : ''
                                }}
                            />

                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Order',
                                    id: 'order',
                                    fullWidth: true,
                                    required: true,
                                    error: error_in_order,
                                    helper_text:
                                        error_in_order || isNaN(this.state.details['order'])
                                            ? 'Order is required and should be Numerical'
                                            : '',
                                    value:
                                        this.state.details && this.state.details['order']
                                            ? this.state.details['order']
                                            : 0,
                                    placeholder: `Suggested Order Value ${suggestedOrderValue}`
                                }}
                            />
                            <div
                                style={{ display: 'flex', marginTop: '2rem', marginLeft: '0.5rem' }}
                            >
                                <FormLabel
                                    className={`${classes.label} ${classes.customLeftLabel}`}
                                >
                                    Color Picker
                                </FormLabel>
                                <input
                                    onChange={(e) =>
                                        this.setState({
                                            ...this.state,
                                            details: {
                                                ...this.state.details,
                                                color: e.target.value
                                            }
                                        })
                                    }
                                    value={this.state.details.color}
                                    type="color"
                                />
                                {/* <TextField id="standard-basic" label="Standard" type='color'/> */}
                            </div>
                        </Grid>
                        <Grid item xs className={classes.spacing}>
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Function Name',
                                    id: 'function_name',
                                    fullWidth: true,
                                    required: true,
                                    error: error_in_name,
                                    helper_text: error_in_name
                                        ? 'Function Name is Mandatory'
                                        : this.validateFunction(
                                              this.state.details['function_name'],
                                              this.state.details['industry_id']
                                          )
                                        ? ''
                                        : 'Function Name Already Exists',
                                    value:
                                        this.state.details && this.state.details['function_name']
                                            ? this.state.details['function_name']
                                            : ''
                                }}
                            />

                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Parent Function Name',
                                    id: 'parent_function_id',
                                    is_select: true,
                                    fullWidth: true,
                                    options: this.state.functions,
                                    value: this.state.details.parent_function_id
                                }}
                            />

                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Level',
                                    id: 'level',
                                    fullWidth: true,
                                    value:
                                        this.state.details && this.state.details['level']
                                            ? this.state.details['level']
                                            : '',
                                    placeholder: 'Specify level for multi-level hierarcy'
                                }}
                            />
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Description',
                                    id: 'description',
                                    fullWidth: true,
                                    multiline: true,
                                    rows: 4,
                                    value:
                                        this.state.details && this.state.details['description']
                                            ? this.state.details['description']
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
                        onClick={this.submit}
                        disabled={
                            error_in_industry || error_in_logo || error_in_name || error_in_order
                        }
                        aria-label="Save"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>,
            <CustomSnackbar
                key={4}
                open={this.state.notificationOpen && this.state.snackbar.message}
                message={this.state.snackbar.message}
                autoHideDuration={2000}
                onClose={() => {
                    this.setState({
                        notificationOpen: false
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
    createNewButton: {
        float: 'right',
        margin: theme.spacing(2, 2)
    },
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    spacing: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4.5rem'
    },
    layoutSpacing: {
        paddingLeft: theme.layoutSpacing(44),
        paddingRight: theme.layoutSpacing(44),
        paddingTop: theme.layoutSpacing(40),
        overflow: 'hidden'
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
    }
});

const mapStateToProps = (state) => {
    return {
        industryData: state.industryData.list,
        functionData: state.functionData.list
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getFunctions: (payload) => dispatch(getFunctions(payload))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    withStyles(
        (theme) => ({
            ...customFormStyle(theme),
            ...styles(theme),
            ...textFieldStyle(theme)
        }),
        { withTheme: true }
    )(ManageFunctions)
);
