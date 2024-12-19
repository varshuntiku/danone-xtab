import React from 'react';
import {
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,

    Modal,

    Input,
    Divider,
    Button,
    IconButton,

} from '@material-ui/core';
import CloseIcon from '../../assets/Icons/CloseBtn';
import CodxCircularLoader from '../CodxCircularLoader';
import { getWorkbooks, tableauSignIn, getViews } from 'services/tableau_apis';
import clsx from 'clsx';
import withStyles from '@material-ui/core/styles/withStyles';

import CustomSnackbar from 'components/CustomSnackbar.jsx';
const styles = (theme) => ({

    textthemes:{
    color:theme.palette.text.labeltext
    },

});

class AppAdminTableauConfig extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            loadingWorkbooks: false,
            loadingViews: false,
            workbooks: [],
            views: [],
            siteId: null,
            userId: null,
            contentURL:null,
            authToken: null,
            pat_token_name: '',
            pat_token_secret: '',
            content_url: '',
            isLoginPopoverOpen: false,
            anchorEl: null,
            isLoggedIn: false,
            loadingReportVisuals: false,
           notificationOpen:false,
           notification:{},
        };
    }

    componentDidMount() {

        const storedAuthToken = sessionStorage.getItem('authToken');
        const storedSiteId = sessionStorage.getItem('siteId');
        const storedUserId = sessionStorage.getItem('userId');
const storedcontentURL=sessionStorage.getItem('contentURL')

        if (storedAuthToken) {
            this.setState(
                { authToken: storedAuthToken, siteId: storedSiteId, userId: storedUserId, contentURL: storedcontentURL,isLoggedIn: true },
                this.getWorkbooksData
            );
        } else {
            this.setState({ isLoginPopoverOpen: true });
        }
    }

    handleLoginSubmit = () => {
        this.setState({ isLoginPopoverOpen: false }, this.signInToTableau);
    };

    signInToTableau = async () => {
        const { pat_token_name, pat_token_secret, content_url } = this.state;
        const signInData = { pat_token_name, pat_token_secret, content_url };

        try {
            const { siteId, userId, authToken, contentURL } = await tableauSignIn(signInData);

            // Save authToken, siteId, and userId in sessionStorage
            sessionStorage.setItem('authToken', authToken);
            sessionStorage.setItem('siteId', siteId);
            sessionStorage.setItem('userId', userId);
            sessionStorage.setItem('contentURL', contentURL);


            this.setState(
                { siteId, userId, authToken, contentURL, isLoggedIn: true },
                () => {

                    this.setState({
                        notificationOpen: true,
                        notification: {
                            message: `Successfully logged into your tableau site!`,
                            severity: 'success',
                            autoHideDuration: 3000
                        }
                    });

                    this.getWorkbooksData();
                }
            );
        } catch (error) {
            console.error('Error during Tableau sign-in:', error);

            // Optionally, display a snackbar for login failure
            this.setState({
                notificationOpen: true,
                notification: {
                    message: 'Login failed. Please check your credentials.',
                    severity: 'error',
                    autoHideDuration: 3000
                }
            });
        }
    };


    getWorkbooksData = async () => {
        const { siteId, userId, authToken } = this.state;
        this.setState({ loadingWorkbooks: true });

        try {

            const response = await getWorkbooks(siteId, userId, authToken);
            this.setState({ workbooks: response.workbook || [] });



            this.getReportPageVisualsData();
        } catch (error) {
            console.error('Error fetching workbooks:', error);
            this.setState({ workbooks: [] });
        } finally {
            this.setState({ loadingWorkbooks: false });
        }

    };
    getReportPageVisualsData = () => {
        if (
            this.props.widget_info.config?.tableau_config?.workbookName &&
            this.props.widget_info.config?.tableau_config?.viewName &&
            this.props.widget_info.config?.tableau_config?.sheetName
        ) {
            this.setState({
                loadingReportVisuals: true,
                previewReport: true,
                previewParams: this.props.widget_info.config?.tableau_config
            });
        }
    };

    handleLogout = () => {

        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('siteId');
        sessionStorage.removeItem('userId');


        this.setState({ authToken: null, siteId: null, userId: null, content_url: '', isLoggedIn: false });
    };


    handleLoginOpen = (event) => {
        this.setState({ isLoginPopoverOpen: true, anchorEl: event.currentTarget });
    };

    handleLoginClose = () => {
        this.setState({ isLoginPopoverOpen: false, anchorEl: null });
    };




    getViewsData = async (workbookId) => {
        const { siteId, authToken } = this.state;
        this.setState({ loadingViews: true });

        try {
            const response = await getViews(siteId, workbookId, authToken);
             this.setState({views:response.view|| []});

        } catch (error) {
            console.error('Error fetching views:', error);
            this.setState({ views: [] });
        } finally {
            this.setState({ loadingViews: false });
        }
    };

    onChangeTableauConfig = (field_id, field_value, field_params) => {
        const { onHandleFieldChange } = this.props;

        if (field_params['field_id'] === 'workbookName') {
            const selectedWorkbook = this.state.workbooks.find(
                (workbook) => workbook.name === field_value
            );

            if (selectedWorkbook) {
                this.getViewsData(selectedWorkbook.id);
            }
        }

        if (field_params['field_id'] === 'viewName') {
            const selectedView = this.state.views.find(
                (view) => view.name === field_value
            );

            if (selectedView) {
                console.log('Selected View Name:', selectedView.name);
            }
        }

        onHandleFieldChange(field_id, field_value, field_params);
    };


    renderLoginPopover = () => {
        const { isLoginPopoverOpen, pat_token_name, pat_token_secret } = this.state;
const saml_docs='https://willbedeletedsoon.blob.core.windows.net/nuclios-docs/Tableau%20Personal%20Access%20Token%20Creation%20Guide%201.pdf'

        return (
            <Modal
                open={isLoginPopoverOpen}
                onClose={this.handleLoginClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div
                    style={{
                        padding: '16px',
                        width: '500px',
                        height: '500px',
                        border: '1px solid grey',
                        backgroundColor: '#fff',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        margin: '20px',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                            id="modal-title"
                            variant="h2"
                            style={{
                                color: '#220047',
                                marginTop: '5px',
                            }}
                        >
                            Tableau Authentication
                        </Typography>
                        <IconButton onClick={this.handleLoginClose} style={{ color: '#220047' }}>
                            <CloseIcon />
                        </IconButton>
                    </div>


                    <Divider style={{ backgroundColor: '#CFB3CD' }} />

                    <Typography
                        id="modal-description"

                        style={{ marginTop: '10px', textAlign: 'justify', fontSize:'13px', color: '#220047' }}
                    >
                        To obtain a <b>Personal Access Token (PAT)</b> for use with Tableau:
                        <ul style={{ marginTop: '10px', textAlign: 'justify', lineHeight: '1.6' }}>
                            <li>Log in to your Tableau Server or Tableau Online account with permissions to create tokens.</li>
                            <li>Navigate to your Account Settings, typically found in your profile menu.</li>
                            <li>Locate the <i>Personal Access Tokens</i> section and select the option to create a new token.</li>
                            <li>
                                Name the token descriptively, create it, and securely save the token name and secret (visible only
                                once).
                            </li>
                        </ul>
                        <Typography
                        id="modal-description"

                        style={{ marginTop: '10px', textAlign: 'justify', fontSize:'13px', color: '#220047' }}
                    >For Detailed Information  <a

                    target="_blank"
                    rel="noopener noreferrer"
                    href={saml_docs}
                >
                    View Docs
                </a></Typography>
                    </Typography>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '100px auto',
                            gap: '15px',
                            marginTop: '30px',
                            alignItems: 'center',
                        }}
                    >
                        <Typography style={{ color: '#220047', fontSize: '12px' }}>PAT Token Name:</Typography>
                        <Input
                            id="pat-token-name"
                            value={pat_token_name}
                            onChange={(e) => this.setState({ pat_token_name: e.target.value })}
                            placeholder="Enter PAT Token Name"
                             autoComplete="off"
                             disableUnderline
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '12px',

                            }}

                        />

                        <Typography style={{ color: '#220047', fontSize: '12px' }}>PAT Token Secret:</Typography>
                        <Input
                            id="pat-token-secret"
                            type="password"
                            value={pat_token_secret}
                            onChange={(e) => this.setState({ pat_token_secret: e.target.value })}
                            placeholder="Enter PAT Token Secret"
                            disableUnderline
                            autoComplete='off'
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '12px',

                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: '16px',
                            gap: '10px',
                        }}
                    >
                        <Button onClick={this.handleLoginClose} variant="outlined" style={{top:'30px'}}>
                            Cancel
                        </Button>
                        <Button
                            onClick={this.handleLoginSubmit}
                            variant="contained"
                            style={{ backgroundColor: '#220047', color: '#FFA497', top:'30px'}}
                        >
                            Authenticate
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    };








    render() {
        const { classes, editDisabled, editMode } = this.props;
        const { loadingWorkbooks, loadingViews, workbooks, views, isLoggedIn } = this.state;

        return (
            <div className={classes.tableauConfigBody}>

                {isLoggedIn &&
                (
                    <div>
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
                                severity={this.state.notification?.severity || 'success'}
                                message={this.state.notification?.message}
                            />
                        </div>
                )}
                {!isLoggedIn &&
                (
                    <div>
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
                        </div>
                )}
                {this.renderLoginPopover()}
                <Typography variant="h3" className={classes.textthemes}>
                    The below configuration options will be based on your access to <b>Tableau</b> workbooks and its views.
                </Typography>
                {loadingWorkbooks ? (
                    <CodxCircularLoader size={30} center data-testid="codx-circular-loader" />
                ) : (
                    <div className={classes.renderOverviewFormRoot}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} className={classes.tableauFormWrapper}>
                                <Typography variant="h4"className={classes.textthemes}>
                                    Please select a <b>Tableau workbook</b> to embed.
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
                                        id="tableau-workbook"
                                        className={classes.widgetConfigCheckboxLabel}
                                    >
                                        Tableau Workbook
                                    </InputLabel>
                                    <Select
                                        classes={{
                                            icon: classes.widgetConfigIcon,
                                            select: classes.widgetConfigInput
                                        }}
                                        labelId="tableau-workbook"
                                        id="tableau-workbook"
                                        value={this.props.widget_info.config?.tableau_config?.workbookName}
                                        onChange={(event) =>
                                            this.onChangeTableauConfig(null, event.target.value, {
                                                field_id: 'workbookName'
                                            })
                                        }
                                        variant="filled"
                                        MenuProps={{ className: classes.menu }}
                                    >
                                        {workbooks && Array.isArray(workbooks) && workbooks.length > 0 ? (
                                            workbooks.map(workbook => (
                                                <MenuItem key={workbook.id} value={workbook.name}>
                                                    <Typography className={clsx(classes.f1, classes.defaultColor)} variant="h5">
                                                        {workbook.name}
                                                    </Typography>
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No workbooks available</MenuItem>
                                        )}



                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </div>
                )}
                {views && loadingViews && <CodxCircularLoader size={30} center data-testid="codx-circular-loader" />}

                    <div className={classes.renderOverviewFormRoot}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} className={classes.tableauFormWrapper}>
                                <Typography variant="h4" className={classes.textthemes}>
                                    Please select a <b>Tableau view</b> to embed.
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
                                        id="tableau-view"
                                        className={classes.widgetConfigCheckboxLabel}
                                    >
                                        Tableau View
                                    </InputLabel>
                                    <Select
                                        classes={{
                                            icon: classes.widgetConfigIcon,
                                            select: classes.widgetConfigInput
                                        }}
                                        labelId="tableau-view"
                                        id="tableau-view"
                                        value={this.props.widget_info.config?.tableau_config?.viewName}
                                        onChange={(event) =>
                                            this.onChangeTableauConfig(null, event.target.value, {
                                                field_id: 'viewName'
                                            })
                                        }
                                        variant="filled"
                                        MenuProps={{ className: classes.menu }}
                                    >
                                        {views.map(view => (
                                            <MenuItem key={view.id} value={view.name}>
                                                <Typography className={clsx(classes.f1, classes.defaultColor)} variant="h5">
                                                    {view.name}
                                                </Typography>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </div>

                    <div className={classes.saveBtnContainer}>
        {!isLoggedIn && (
            <Button onClick={this.handleLoginOpen} variant="contained"
            style={{ backgroundColor: '#220047', color: '#FFA497' }}>
                Login to Tableau
            </Button>
        )}
        {isLoggedIn && (
            <Button onClick={this.handleLogout} variant="outlined" style={{lineHeight: '1.43'}}>
                Logout
            </Button>
        )}
    </div>
    {this.state.previewReport && (
                            <AppAdminTableauConfig
                                params={this.state.previewParams}
                                previewCallback={this.previewCallback}
                                data-testid="app-widget-tableau"
                            />
                        )}
            </div>
        );
    }
}

export default withStyles(styles, { useTheme: true })(AppAdminTableauConfig);
