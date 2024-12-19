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
    FormControlLabel,
    RadioGroup,
    Radio,
    FormLabel,
    Box
} from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import { createIndustry, updateIndustry } from 'services/dashboard.js';
import textFieldStyle from 'assets/jss/textFieldStyle';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { IndustrySpecs } from '../../assets/data/indusrySpecs';
import sanitizeHtml from 'sanitize-html-react';
import { decodeHtmlEntities } from 'util/decodeHtmlEntities';
import CloseIcon from '../../assets/Icons/CloseBtn';
import * as _ from 'underscore';

class ManageIndustry extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            open: false,
            snackbar: {},
            notificationOpen: false,
            industryLogoList: [],
            details: {
                id: props.industry?.id ? props.industry.id : '',
                industry_name: props.industry?.industry_name ? props.industry.industry_name : '',
                parent_industry_id: props.industry?.parent_industry_id
                    ? props.industry.parent_industry_id
                    : '',
                logo_name: props.industry?.logo_name ? props.industry.logo_name : '',
                description: props.industry?.description
                    ? decodeHtmlEntities(sanitizeHtml(props.industry.description))
                    : '',
                order: props.industry?.order ? props.industry.order : 0,
                //making horizontal default
                horizon: props.industry?.horizon ? props.industry.horizon : 'horizontal',
                level: props.industry?.level ? props.industry.level : null,
                color: props.industry?.color ? props.industry.color : null
            },
            errors: {
                industry_name: false,
                logo_name: false,
                order: false
            },
            industries: []
        };
        this.industry_specs = IndustrySpecs;
    }

    validateIndustry(name) {
        const industries = this.props.industriesData;
        const found = industries.filter(
            (element) => element.industry_name.toLowerCase() === name.toLowerCase()
        );
        if (this.props.createNewIndustry) {
            return found.length === 0;
        } else {
            if (found.length === 0) {
                return true;
            } else if (found.length === 1 && found[0].id === this.state.details.id) {
                return true;
            } else {
                return false;
            }
        }
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
    };

    submit = () => {
        if (this.validateInputFeilds()) {
            let payload = {
                ...this.state.details,
                description: this.state.details.description
                    ? sanitizeHtml(this.state.details?.description)
                    : ''
            };
            try {
                if (this.props.createNewIndustry) {
                    createIndustry({
                        payload: payload,
                        callback: this.onResponseCreateIndustry
                    });
                } else {
                    updateIndustry({
                        payload: payload,
                        callback: this.onResponseCreateIndustry
                    });
                }
            } catch (error) {
                this.handleUpdateResponse(error, 'error');
            }
        }
    };
    validateInputFeilds = () => {
        const { industry_name, logo_name, order } = this.state.details;
        let error = {};
        if (!industry_name || !this.validateIndustry(industry_name)) error.industry_name = true;
        if (!logo_name) error.logo_name = true;
        if (!order || isNaN(order)) error.order = true;
        if (Object.keys(error).length > 0) {
            this.setState({ errors: error });
            return false;
        }
        return true;
    };

    onResponseCreateIndustry = () => {
        if (this.props.createNewIndustry) {
            this.handleUpdateResponse('Created Successfully');
            this.setOpen(false);
            _.delay(
                () => {
                    this.props.refreshIndustryList();
                },
                500,
                ''
            );
            // this.props.refreshIndustryList();
        } else {
            this.handleUpdateResponse('Updated Successfully');
            this.setOpen(false);
            _.delay(
                () => {
                    this.props.refreshIndustryList();
                },
                500,
                ''
            );
            // this.props.refreshIndustryList();
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
            if (this.props.createNewIndustry) {
                this.setState((prevState) => ({
                    notificationOpen: true,
                    snackbar: {
                        ...prevState.snackbar,
                        message: message,
                        severity: severity
                    },
                    details: {
                        ...prevState.details,
                        industry_name: '',
                        logo_name: '',
                        order: 0,
                        horizon: '',
                        parent_industry_id: '',
                        description: '',
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
                        id: this.props.industry.id,
                        industry_name: this.props.industry.industry_name,
                        parent_industry_id: this.props.industry.parent_industry_id,
                        logo_name: this.props.industry.logo_name,
                        order: this.props.industry.order,
                        horizon: this.props.industry.horizon,
                        description: this.props.industry.description
                            ? sanitizeHtml(this.props.industry.description)
                            : '',
                        level: this.props.industry.level,
                        color: this.props.industry.color
                    }
                }));
            }
        }
    };
    onHandleFocusChange = (field_id, field_value) => {
        this.handleErrors(field_id, field_value);
    };

    handleErrors = (field_id, field_value) => {
        let mandatoryFeilds = ['industry_name', 'logo_name', 'order'];
        const { errors } = this.state;
        let updatedErrors = { ...errors };
        if (mandatoryFeilds.includes(field_id) && !field_value) updatedErrors[field_id] = true;
        else updatedErrors[field_id] = false;
        this.setState({ errors: updatedErrors });
    };

    onHandleFieldChange = (field_id, field_value) => {
        var details = this.state.details;
        this.handleErrors(field_id, field_value);
        if (field_id === 'order') {
            if (field_value === '') {
                field_value = '';
            } else {
                field_value = parseInt(field_value);
            }
        }
        details[field_id] = field_value;
        this.setState({
            details: details
        });
    };

    render() {
        const { classes, orderValue } = this.props;
        const suggestedOrderValue = (orderValue ? orderValue : 0) + 1;

        const {
            industry_name: error_in_name,
            logo_name: error_in_logo,
            order: error_in_order
        } = this.state.errors;
        return [
            !this.props.createNewIndustry && (
                <IconButton
                    key={1}
                    title="Manage Industry"
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    aria-label="Edit"
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            ),
            this.props.createNewIndustry && (
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
                aria-labelledby="industry-dialog-title"
                aria-describedby="industry-dialog-description"
                classes={{ paper: classes.paper }}
            >
                <DialogTitle className={classes.title} disableTypography id="industry-dialog-title">
                    {this.props.createNewIndustry ? (
                        <Typography variant="h4" className={classes.heading}>
                            Create New Industry
                        </Typography>
                    ) : (
                        <Typography variant="h4" className={classes.heading}>
                            Update Industry
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
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorLine} />
                <DialogContent className={classes.layoutSpacing} id="industry-dialog-description">
                    <Grid key="form-body" container spacing={9}>
                        <Grid item xs className={classes.spacing}>
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Industry Name',
                                    id: 'industry_name',
                                    fullWidth: true,
                                    required: true,
                                    error: error_in_name,
                                    helper_text: error_in_name
                                        ? 'Industry Name is Mandatory'
                                        : this.validateIndustry(this.state.details['industry_name'])
                                        ? ''
                                        : 'Industry Name Already Exists',
                                    value:
                                        this.state.details && this.state.details['industry_name']
                                            ? this.state.details['industry_name']
                                            : ''
                                }}
                            />
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Assigned Order',
                                    id: 'order',
                                    fullWidth: true,
                                    required: true,
                                    error: error_in_order,
                                    helper_text:
                                        error_in_order || isNaN(this.state.details['order'])
                                            ? 'Order is Mandatory and should be Numerical'
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
                                    label: 'Logo Name',
                                    is_select: true,
                                    id: 'logo_name',
                                    fullWidth: true,
                                    required: true,
                                    error: error_in_logo,
                                    helper_text: error_in_logo ? 'Logo is Mandatory' : '',
                                    options: this.state.industryLogoList,
                                    page: 'industries',
                                    value:
                                        this.state.details && this.state.details['logo_name']
                                            ? this.state.details['logo_name']
                                            : ''
                                }}
                            />

                            <Box>
                                <FormLabel className={classes.label}>
                                    Select NucliOS Horizon
                                </FormLabel>

                                <RadioGroup
                                    row
                                    defaultValue={this.state.details.horizon}
                                    onChange={(e) => {
                                        this.setState({
                                            details: {
                                                ...this.state.details,
                                                horizon: e.target.value
                                            }
                                        });
                                    }}
                                >
                                    <FormControlLabel
                                        name="horizon"
                                        value="horizontal"
                                        control={<Radio />}
                                        label={
                                            <Typography style={{ fontSize: '1.5rem' }}>
                                                Horizontal
                                            </Typography>
                                        }
                                        className={classes.label}
                                    />
                                    <FormControlLabel
                                        name="horizon"
                                        value="vertical"
                                        control={<Radio />}
                                        label={
                                            <Typography style={{ fontSize: '1.5rem' }}>
                                                Vertical
                                            </Typography>
                                        }
                                        className={classes.label}
                                    />
                                </RadioGroup>
                            </Box>
                            <div
                                style={{
                                    display: 'flex'
                                }}
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
                                    label: 'Parent Industry Name',
                                    is_select: true,
                                    id: 'parent_industry_id',
                                    fullWidth: true,
                                    options: this.state.industries,
                                    value: this.state.details.parent_industry_id
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
                                            : null,
                                    placeholder: 'Specify level for multi-level hierarcy'
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
                            error_in_name ||
                            error_in_logo ||
                            error_in_order ||
                            !this.validateIndustry(this.state.details['industry_name'])
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
                autoHideDuration={3000}
                onClose={() => {
                    this.setState({
                        notificationOpen: false
                    });
                }}
                severity={this.state.snackbar.severity || 'success'}
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

export default withStyles(
    (theme) => ({
        ...customFormStyle(theme),
        ...styles(theme),
        ...textFieldStyle(theme)
    }),
    { withTheme: true }
)(ManageIndustry);
