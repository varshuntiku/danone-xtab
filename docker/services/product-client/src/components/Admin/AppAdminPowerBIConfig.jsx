import React from 'react';

import {
    Typography,
    Grid,
    FormControl,
    // TextField,
    // Button,
    // Tabs,
    // Tab,
    // FormControlLabel,
    // Checkbox,
    // Dialog,
    // DialogActions,
    // DialogContent,
    // DialogContentText,
    // DialogTitle,
    InputLabel,
    Select,
    MenuItem
} from '@material-ui/core';
import CodxCircularLoader from '../CodxCircularLoader';
import AppWidgetPowerBI from 'components/AppWidgetPowerBI.jsx';
import clsx from 'clsx';
import * as _ from 'underscore';
import withStyles from '@material-ui/core/styles/withStyles';
import { getWorkspaces, getReports, getReportPages } from 'services/powerbi_apis.js';
import CustomSnackbar from 'components/CustomSnackbar.jsx';

const styles = (theme) => ({

    textthemes:{
    color:theme.palette.text.labeltext
    },

});
class AppAdminPowerBIConfig extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            loading: true,
            loadingReports: false,
            loadingReportPages: false,
            loadingReportVisuals: false,
            workspaces: false,
            reports: false,
            notificationOpen:false,
            notification:{},
            iserror:false,
        };
    }

    componentDidMount() {
        getWorkspaces({
            callback: this.onResponseGetWorkspaces
        });
    }

    onChangePowerBIConfig = (field_id, field_value, field_params) => {
        const { onHandleFieldChange } = this.props;

        onHandleFieldChange(field_id, field_value, field_params);

        if (field_params['field_id'] === 'workspaceId') {
            this.getReportsData();
        } else if (field_params['field_id'] === 'reportId') {
            this.getReportPagesData();
        } else if (field_params['field_id'] === 'pageName') {
            this.getReportPageVisualsData();
        }
    };

    onResponseGetWorkspaces = (response_data) => {
        this.setState({
            workspaces: response_data,
            loading: false
        });

        this.getReportsData();
    };

    getReportsData = () => {
        if (this.props.widget_info.config?.powerbi_config?.workspaceId) {
            this.setState({
                loadingReports: true
            });

            getReports({
                workspaceId: this.props.widget_info.config?.powerbi_config?.workspaceId,
                callback: this.onResponseGetReports
            });
        }
    };

    onResponseGetReports = (response_data) => {
        // Check if the response contains a status field
        if (response_data.status === 'error') {

           this.setState({iserror:true,
            notificationOpen: true,
            notification: {
                message: `Login failed. Please check your credentials`,
                severity: 'error',
                autoHideDuration: 3000
            }
           })

        } else {
            // Handle successful data fetch
            this.setState({
                loadingReports: false,
                reports: response_data
            });

            this.getReportPagesData();
        }
    };


    getReportPagesData = () => {
        if (
            this.props.widget_info.config?.powerbi_config?.workspaceId &&
            this.props.widget_info.config?.powerbi_config?.reportId
        ) {
            this.setState({
                loadingReportPages: true
            });

            getReportPages({
                reportId: this.props.widget_info.config?.powerbi_config?.reportId,
                callback: this.onResponseGetReportPages
            });
        }
    };

    onResponseGetReportPages = (response_data) => {
        this.setState({
            loadingReportPages: false,
            reportPages: response_data
        });

        this.getReportPageVisualsData();
    };

    getReportPageVisualsData = () => {
        if (
            this.props.widget_info.config?.powerbi_config?.workspaceId &&
            this.props.widget_info.config?.powerbi_config?.reportId &&
            this.props.widget_info.config?.powerbi_config?.pageName
        ) {
            this.setState({
                loadingReportVisuals: true,
                previewReport: true,
                previewParams: this.props.widget_info.config?.powerbi_config
            });
        }
    };

    previewCallback = (response_visuals) => {
        this.setState({
            loadingReportVisuals: false,
            reportPageVisuals: response_visuals
        });
    };

    render() {
        const { classes, editDisabled, editMode } = this.props;
const{iserror}=this.state
        var report_options = [];
        if (this.state.reports) {
            report_options = _.map(this.state.reports, function (report_item) {
                return (
                    <MenuItem key={report_item.name} value={report_item.id}>
                        <Typography className={clsx(classes.f1, classes.defaultColor)} variant="h5">
                            {report_item.name}
                        </Typography>
                    </MenuItem>
                );
            });
        }

        var report_page_options = [];
        if (this.state.reportPages) {
            report_page_options = _.map(this.state.reportPages, function (report_item) {
                return (
                    <MenuItem key={report_item.displayName} value={report_item.name}>
                        <Typography className={clsx(classes.f1, classes.defaultColor)} variant="h5">
                            {report_item.displayName}
                        </Typography>
                    </MenuItem>
                );
            });
        }

        var report_page_visual_options = [];
        if (this.state.reportPageVisuals) {
            report_page_visual_options = _.map(
                this.state.reportPageVisuals,
                function (report_item) {
                    return (
                        <MenuItem key={report_item.title} value={report_item.name}>
                            <Typography
                                className={clsx(classes.f1, classes.defaultColor)}
                                variant="h5"
                            >
                                {report_item.title}
                            </Typography>
                        </MenuItem>
                    );
                }
            );
        }

        return (

            <div className={classes.powerBIConfigBody}>
              {iserror &&
                        (

                                <CustomSnackbar
                                        open={
                                            this.state.notificationOpen && this.state.notification?.message
                                                ? true
                                                : false
                                        }
                                        autoHideDuration={
                                            this.state.notification?.autoHideDuration === undefined
                                                ? 3000
                                                : this.state.notification?.autoHideDuration
                                        }
                                        onClose={() => this.setState({ notificationOpen: false })}
                                        severity={this.state.notification?.severity || 'error'}
                                        message={this.state.notification?.message}
                                    />

                        )}
                <Typography variant="h3" className={classes.textthemes}>
                    The below configuration options will be based on your access to <b>PowerBI</b>{' '}
                    workspaces and reports.
                </Typography>
                {this.state.loading ? (
                    <CodxCircularLoader size={30} center data-testid="codx-circular-loader" />
                ) : (
                    <div className={classes.renderOverviewFormRoot}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} className={classes.powerBIConfigFormWrapper}>
                                <Typography variant="h4" className={classes.textthemes}>
                                    Please select a <b>PowerBI workspace</b> to view reports to
                                    embed.
                                </Typography>
                                <FormControl
                                    fullWidth
                                    className={clsx(
                                        classes.widgetConfigFormControl2,
                                        classes.widgetConfigSelect
                                    )}
                                    disabled={editDisabled || !editMode}
                                >
                                    <InputLabel
                                        id="powerbi-workspace"
                                        className={classes.widgetConfigCheckboxLabel}
                                    >
                                        PowerBI Workspace
                                    </InputLabel>
                                    <Select
                                        classes={{
                                            icon: classes.widgetConfigIcon,
                                            select: classes.widgetConfigInput
                                        }}
                                        labelId="powerbi-workspace"
                                        id="powerbi-workspace"
                                        data-testid="powerbi-workspace-select"
                                        value={
                                            this.props.widget_info.config?.powerbi_config
                                                ?.workspaceId
                                        }
                                        label="PowerBI Workspace"
                                        onChange={(event) =>
                                            this.onChangePowerBIConfig(null, event.target.value, {
                                                field_id: 'workspaceId'
                                            })
                                        }
                                        variant="filled"
                                        MenuProps={{ className: classes.menu }}
                                        inputProps={{
                                            classes: {
                                                input: classes.input,
                                                formControl: classes.formControl
                                            }
                                        }}
                                    >
                                        {_.map(this.state.workspaces, function (workspace_item) {
                                            return (
                                                <MenuItem
                                                    key={workspace_item.name}
                                                    value={workspace_item.id}
                                                >
                                                    <Typography
                                                        className={clsx(
                                                            classes.f1,
                                                            classes.defaultColor,
                                                            classes.textthemes
                                                        )}
                                                        variant="h5"
                                                    >
                                                        {workspace_item.name}
                                                    </Typography>
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {this.state.loadingReports ? (
                                <CodxCircularLoader
                                    size={30}
                                    center
                                    data-testid="codx-circular-loader"
                                />
                            ) : (
                                <Grid item xs={12} className={classes.powerBIConfigFormWrapper}>
                                    <Typography variant="h4"className={classes.textthemes}>
                                        Please select a <b>PowerBI report</b> to embed.
                                    </Typography>
                                    <FormControl
                                        fullWidth
                                        className={clsx(
                                            classes.widgetConfigFormControl2,
                                            classes.widgetConfigSelect
                                        )}
                                        disabled={editDisabled || !editMode}
                                    >
                                        <InputLabel
                                            id="powerbi-report"
                                            className={classes.widgetConfigCheckboxLabel}
                                        >
                                            PowerBI Report
                                        </InputLabel>
                                        <Select
                                            classes={{
                                                icon: classes.widgetConfigIcon,
                                                select: classes.widgetConfigInput
                                            }}
                                            labelId="powerbi-report"
                                            id="powerbi-report"
                                            value={
                                                this.props.widget_info.config?.powerbi_config
                                                    ?.reportId
                                            }
                                            data-testid="powerbi-report-select"
                                            label="PowerBI Report"
                                            onChange={(event) =>
                                                this.onChangePowerBIConfig(
                                                    null,
                                                    event.target.value,
                                                    {
                                                        field_id: 'reportId'
                                                    }
                                                )
                                            }
                                            variant="filled"
                                            MenuProps={{ className: classes.menu }}
                                            inputProps={{
                                                classes: {
                                                    input: classes.input,
                                                    formControl: classes.formControl
                                                }
                                            }}
                                        >
                                            {report_options}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
                            {this.state.loadingReportPages ? (
                                <CodxCircularLoader
                                    size={30}
                                    center
                                    data-testid="codx-circular-loader"
                                />
                            ) : (
                                <Grid item xs={12} className={classes.powerBIConfigFormWrapper}>
                                    <Typography variant="h4"  className={classes.textthemes}>
                                        Please select a <b>PowerBI report page</b> to embed.
                                        <br />
                                        <i>
                                            optional: if not provided the whole report will be
                                            embedded
                                        </i>
                                    </Typography>
                                    <FormControl
                                        fullWidth
                                        className={clsx(
                                            classes.widgetConfigFormControl2,
                                            classes.widgetConfigSelect
                                        )}
                                        disabled={editDisabled || !editMode}
                                    >
                                        <InputLabel
                                            id="powerbi-report-page"
                                            className={classes.widgetConfigCheckboxLabel}
                                        >
                                            PowerBI Report Page
                                        </InputLabel>
                                        <Select
                                            classes={{
                                                icon: classes.widgetConfigIcon,
                                                select: classes.widgetConfigInput
                                            }}
                                            labelId="powerbi-report-page"
                                            id="powerbi-report-page"
                                            value={
                                                this.props.widget_info.config?.powerbi_config
                                                    ?.pageName
                                            }
                                            label="PowerBI Report Page"
                                            onChange={(event) =>
                                                this.onChangePowerBIConfig(
                                                    null,
                                                    event.target.value,
                                                    {
                                                        field_id: 'pageName'
                                                    }
                                                )
                                            }
                                            data-testid="powerbi-report-page-select"
                                            variant="filled"
                                            MenuProps={{ className: classes.menu }}
                                            inputProps={{
                                                classes: {
                                                    input: classes.input,
                                                    formControl: classes.formControl
                                                }
                                            }}
                                        >
                                            {report_page_options}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
                            {this.state.loadingReportVisuals ? (
                                <CodxCircularLoader
                                    size={30}
                                    center
                                    data-testid="codx-circular-loader"
                                />
                            ) : (
                                <Grid item xs={12} className={classes.powerBIConfigFormWrapper}>
                                    <Typography variant="h4"  className={classes.textthemes}>
                                        Please select a <b>PowerBI report visual</b> to embed.
                                        <br />
                                        <i>
                                            optional: if not provided the whole report page will be
                                            embedded
                                        </i>
                                    </Typography>
                                    <FormControl
                                        fullWidth
                                        className={clsx(
                                            classes.widgetConfigFormControl2,
                                            classes.widgetConfigSelect
                                        )}
                                        disabled={editDisabled || !editMode}
                                    >
                                        <InputLabel
                                            id="powerbi-report-visual"
                                            className={classes.widgetConfigCheckboxLabel}
                                        >
                                            PowerBI Report Visual
                                        </InputLabel>
                                        <Select
                                            classes={{
                                                icon: classes.widgetConfigIcon,
                                                select: classes.widgetConfigInput
                                            }}
                                            labelId="powerbi-report-visual"
                                            id="powerbi-report-visual"
                                            value={
                                                this.props.widget_info.config?.powerbi_config
                                                    ?.visualName
                                            }
                                            data-testid="powerbi-report-visual-select"
                                            label="PowerBI Report Visual"
                                            onChange={(event) =>
                                                this.onChangePowerBIConfig(
                                                    null,
                                                    event.target.value,
                                                    {
                                                        field_id: 'visualName'
                                                    }
                                                )
                                            }
                                            variant="filled"
                                            MenuProps={{ className: classes.menu }}
                                            inputProps={{
                                                classes: {
                                                    input: classes.input,
                                                    formControl: classes.formControl
                                                }
                                            }}
                                        >
                                            {report_page_visual_options}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>
                        {this.state.previewReport && (
                            <AppWidgetPowerBI
                                params={this.state.previewParams}
                                previewCallback={this.previewCallback}
                                data-testid="app-widget-powerbi"
                            />
                        )}
                    </div>
                )}
            </div>
        );
    }
}
export default withStyles(styles, { useTheme: true })(AppAdminPowerBIConfig);
