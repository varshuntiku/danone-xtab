import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import { Grid, Button } from '@material-ui/core';

// import IconButton from "@material-ui/core/IconButton";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import SearchIcon from "@material-ui/icons/Search";
import { editAppdetails } from 'services/app.js';
import { getFunctionsList } from 'services/dashboard.js';
import { getIndustriesList } from 'services/dashboard.js';

import CustomSnackbar from 'components/CustomSnackbar.jsx';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import dashboardStyle from 'assets/jss/dashboardStyle.jsx';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import * as _ from 'underscore';

class AppDetails extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            loading: false,
            app_info: props.location.state.app_info,
            app_list: false,
            app_id: false,
            hideSearchContainer: true,
            selectedFunctions: props.location.state.app_info.function
                ? props.location.state.app_info.function.split(',')
                : [],
            snackbar: {
                open: false
            }
        };
    }

    componentDidMount() {
        Promise.allSettled([
            getFunctionsList({
                callback: this.onResponseGetFunctionsList
            }),
            getIndustriesList({
                callback: this.onResponseGetIndustriesList
            })
        ])
            .then(() => {})
            .catch(() => {
                this.handleUpdateResponse('Failed to load data. Please try again.', 'error');
            });
    }

    onResponseGetIndustriesList = (response_data) => {
        var industrylist = _.map(response_data, function (industry) {
            return {
                label: industry.industry_name.toLocaleLowerCase(),
                value: industry.industry_name
            };
        });

        this.setState({
            industries: industrylist
        });
    };

    onResponseGetFunctionsList = (response_data) => {
        this.setState({
            functions_list: response_data
        });
        this.prepareFunctionsList();
    };

    onHandleFieldChange = (field_id, field_value) => {
        var app_info = this.state.app_info;
        var search_value = this.state.search_value;

        if (field_id === 'search_value') {
            search_value = field_value;
        } else {
            app_info[field_id] = field_value;
        }
        this.setState({
            app_info: app_info,
            search_value: search_value
        });
        if (field_id === 'industry') {
            this.prepareFunctionsList();
        }
    };

    closeSearch = () => {
        this.setState({
            search_value: '',
            app_list: []
        });
    };

    prepareFunctionsList = () => {
        var functionsList = _.compact(
            _.map(this.state.functions_list, (item) => {
                if (item.industry_name === this.state.app_info.industry) {
                    return {
                        label: item.function_name.toLocaleLowerCase(),
                        value: item.function_name
                    };
                }
            })
        );

        this.setState({
            functions: functionsList
        });
    };

    saveChanges = () => {
        try {
            editAppdetails({
                app_id: this.state.app_info.id,
                payload: this.state.app_info,
                callback: this.onResponseEditAppDetails
            });
        } catch (error) {
            this.handleUpdateResponse('Failed to complete action. Please try again.', 'error');
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

    onResponseEditAppDetails = () => {
        this.handleUpdateResponse('Updated Successfully');
    };

    handleChange = (event) => {
        this.setState((prevState) => ({
            selectedFunctions: event.target.value,
            app_info: {
                ...prevState.app_info,
                function: event.target.value.toString()
            }
        }));
    };

    render() {
        const { classes } = this.props;

        return [
            <div key="mainDiv" className={classes.main}>
                {this.state.app_info &&
                    this.state.industries && [
                        <Grid key="form-body" container spacing={2}>
                            <Grid item xs>
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Application Name',
                                        id: 'name',
                                        fullWidth: true,
                                        value: this.state.app_info.name
                                    }}
                                />
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Industry',
                                        is_select: true,
                                        id: 'industry',
                                        fullWidth: true,
                                        value: this.state.app_info.industry,
                                        options: this.state.industries,
                                        inputProps: { 'data-testid': 'industry' }
                                    }}
                                />
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Notebook link',
                                        id: 'blueprint_link',
                                        fullWidth: true,
                                        value: this.state.app_info.blueprint_link
                                    }}
                                />
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Main logo url',
                                        id: 'logo_url',
                                        fullWidth: true,
                                        value: this.state.app_info.logo_url
                                    }}
                                />
                            </Grid>
                            <Grid item xs>
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Description',
                                        id: 'description',
                                        fullWidth: true,
                                        value: this.state.app_info.description
                                    }}
                                />
                                <div className={classes.multiSelect}>
                                    <InputLabel id="functions-list" className={classes.label}>
                                        Function
                                    </InputLabel>
                                    <Select
                                        labelId="functions-list"
                                        id="function"
                                        multiple
                                        fullWidth
                                        value={this.state.selectedFunctions}
                                        onChange={this.handleChange}
                                        input={<Input className={classes.input} />}
                                    >
                                        {this.state.functions &&
                                            this.state.functions.map((item) => (
                                                <MenuItem key={item.value} value={item.value}>
                                                    {item.value}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </div>
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Config link',
                                        id: 'config_link',
                                        fullWidth: true,
                                        value: this.state.app_info.config_link
                                    }}
                                />
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Small logo url',
                                        id: 'small_logo_url',
                                        fullWidth: true,
                                        value: this.state.app_info.small_logo_url
                                    }}
                                />
                            </Grid>
                        </Grid>,

                        <div key="form-toolbar" className={classes.actionToolbar}>
                            <Button
                                variant="contained"
                                className={classes.actionNextButton}
                                onClick={() => this.saveChanges()}
                                aria-label="Save changes"
                            >
                                Save changes
                            </Button>
                            <br />
                        </div>,

                        <CustomSnackbar
                            key={'customSnackBar2'}
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
                    ]}
            </div>
        ];
    }
}

AppDetails.propTypes = {
    classes: PropTypes.object.isRequired
};

const styles = (theme) => ({
    main: {
        width: '80%',
        margin: '10rem auto'
    },
    closeIcon: {
        cursor: 'pointer'
    },
    searchTextBox: {
        width: '35%'
    },
    searchResultsContainer: {
        position: 'relative !important',
        width: 'unset !important'
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
    }
});

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...dashboardStyle(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(AppDetails);
