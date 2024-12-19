import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { cloneApplication } from 'services/app.js';
import { Button, IconButton, makeStyles, useTheme } from '@material-ui/core';
import { ReactComponent as CloneIcon } from '../../assets/img/CloneIcon.svg';
import DynamicFormModal from '../dynamic-form/inputFields/DynamicFormModal';
import CustomSnackbar from '../CustomSnackbar';
import { connect } from 'react-redux';
import { getFunctions } from 'store/index';
import { UserInfoContext } from 'context/userInfoContent';

const useStyles = makeStyles((theme) => ({
    icon: {
        fill: theme.palette.primary.dark,
        stroke:
            theme.props.mode === 'dark'
                ? theme.palette.text.secondaryText
                : theme.palette.primary.contrastText,
        height: '2rem',
        width: '2rem'
    },
    iconOnly: {
        fill: theme.palette.primary.dark,
        stroke: theme.palette.primary.contrastText,
        height: '2rem',
        width: '2rem'
    },
    cloneAppButton: {
        textTransform: 'capitalize',
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        letterSpacing: theme.layoutSpacing(0.5)
    }
}));

const CloneApplication = ({ appId, iconOnly, ...props }) => {
    const classes = useStyles();
    const [industries] = useState(props.match.params.industry ? props.match.params.industry : []);
    const [functions] = useState(props.match.params.function ? props.match.params.function : []);
    const allFunctions = useSelector((st) => st.functionData.list);
    const industryData = useSelector((st) => st.industryData.list);
    const emailId = sessionStorage.getItem('user_email');
    const [snackbar, setSnackbar] = React.useState({ open: false });
    const theme = useTheme();
    const dispatch = useDispatch();
    const [functionLoadError, setFunctionLoadError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const user_id = useContext(UserInfoContext).user_id;

    useEffect(() => {
        try {
            if (allFunctions.length === 0) {
                dispatch(getFunctions({}));
            }
        } catch (err) {
            setFunctionLoadError(true);
        }
    }, []);
    useEffect(() => {
        if (functionLoadError && dialogOpen) {
            setSnackbar({
                open: true,
                severity: 'error',
                message: 'Failed to load functions List, Please Try again!'
            });
        }
    }, [dialogOpen]);

    const ingestCustomEventTelemetry = async (resp) => {
        if (
            import.meta.env['REACT_APP_ENV'] !== 'development' &&
            import.meta.env['REACT_APP_ENV'] !== 'test' &&
            import.meta.env['REACT_APP_ENABLE_APP_INSIGHTS'] === 'true'
        ) {
            const { appInsights } = await import('util/appInsightsLogger');
            appInsights.trackEvent({ name: 'App Cloned', properties: resp });
        }
    };

    const [popup_form_params, setPopupForm] = useState({
        dialog: {
            title: 'Clone Application'
        },
        dialog_actions: [
            {
                name: 'cancel',
                text: 'Cancel',
                variant: 'outlined',
                is_cancel: true,
                style: {
                    marginRight: '2.2rem'
                }
            },
            {
                name: 'clone',
                text: 'Save & Edit Application',
                variant: 'contained'
            }
        ],
        notifications: {
            time: 30000
        },
        form_config: {
            fields: [
                {
                    id: 'app_name',
                    name: 'app_label',
                    type: 'label',
                    value: 'Application name',
                    asterisk: true,
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    grid: 3,
                    style: {
                        padding: '0.8rem'
                    }
                },
                {
                    id: 'app_name',
                    name: 'app_name',
                    type: 'text',
                    grid: 9,
                    fullWidth: true,
                    variant: 'outlined',
                    required: true,
                    value: '',
                    placeholder: 'Enter Application Name',
                    validator: 'application_change'
                },
                {
                    id: 'nac_collaboration',
                    name: 'nac_collaboration_label',
                    type: 'label',
                    value: 'Collaboration on App Configurator',
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    grid: 3,
                    style: {
                        padding: '0.8rem'
                    }
                },
                {
                    id: 'nac_collaboration',
                    name: 'nac_collaboration',
                    type: 'switch',
                    value: false,
                    size: 'small',
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    required: true,
                    grid: 9,
                    noGutterBottom: true
                },
                {
                    id: 'nav_placement',
                    name: 'nav_placement_label',
                    type: 'label',
                    value: 'Choose Navigation Placement',
                    infoPopover: {
                        title: 'Recommendation',
                        info: 'As per design best practices, use top navigation when there are not more than 6 menu items. This enhances user experience and minimizes screen clutter.',
                        icon: 'true'
                    },
                    asterisk: true,
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    grid: 3,
                    style: {
                        padding: '0.8rem',
                        alignSelf: 'start'
                    }
                },
                {
                    id: 'nav_placement',
                    name: 'nav_placement',
                    type: 'nav_types',
                    value: null,
                    grid: 9,
                    validator: 'nav_placement_change'
                },

                {
                    id: 'Note',
                    name: 'note_label',
                    type: 'label',
                    grid: 3,
                    fullWidth: true,
                    variant: 'outlined',
                    required: true,
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    value: 'Note',
                    style: {
                        padding: '0.8rem'
                    }
                },
                {
                    id: 'Note',
                    name: 'note_text',
                    type: 'label',
                    grid: 9,
                    fullWidth: true,
                    variant: 'outlined',
                    required: true,
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    style: {
                        padding: '0.8rem 0.8rem 0.8rem 0rem'
                    },
                    value: 'This will create an application in preview mode, which can be modified to be published and produced.'
                },
                {
                    id: '',
                    name: '',
                    type: 'blank',
                    grid: 3,
                    noGutterTop: true
                },
                {
                    id: 'Note',
                    name: 'note_text',
                    type: 'label',
                    grid: 9,
                    fullWidth: true,
                    variant: 'outlined',
                    noGutterBottom: true,
                    required: true,
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    style: {
                        padding: '0.8rem 0.8rem 0.8rem 0rem',
                        marginTop: '-3rem'
                    },
                    value: 'The overview details, module settings and linked blueprint will not be carried forward to the cloned application.'
                }
            ]
        }
    });
    useEffect(() => {
        setPopupForm((s) => {
            s.form_config.fields.push(
                {
                    id: '',
                    name: '',
                    type: 'blank',
                    grid: 3,
                    noGutterTop: true
                },
                {
                    id: 'app_functions',
                    name: 'app_functions',
                    type: 'checkbox',
                    value: false,
                    label: 'Copy App Functions',
                    grid: 4
                },
                {
                    id: 'app_variables',
                    name: 'app_variables',
                    type: 'checkbox',
                    value: false,
                    label: 'Copy App Variables',
                    grid: 4
                }
            );

            return { ...s };
        });
    }, []);
    useEffect(() => {
        setPopupForm((s) => {
            s.form_config.fields.forEach((el) => {
                if (el.name === 'industry') {
                    el.options = industries;
                }
                if (el.name === 'function') {
                    el.options = functions;
                }
            });
            return { ...s };
        });
    }, [industries, functions]);

    function ValidateEmail(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }

    const handleValueChange = async (action, data) => {
        data.contact_email = emailId;
        let valid = true;
        if (action === 'clone') {
            if (!(data.app_name.trim() && ValidateEmail(data.contact_email))) {
                return;
            }
            try {
                const response = {};
                popup_form_params.form_config.fields.map((item) => {
                    if (item['type'] && item['type'] !== 'label') {
                        if (data[item.name]) {
                            response[item.name] = data[item.name];
                        }
                        if (item.name == 'nav_placement') {
                            if (data[item.name] === undefined) {
                                valid = false;
                            }
                            response['top_navbar'] = data[item.name];
                        }
                    }
                });
                if (!valid) return;
                response['source_app_id'] = appId;
                response['contact_email'] = emailId;
                //setting to miscellaneous by default according the the requirements - NCX-1501
                let industry = industryData?.filter((item) =>
                    item['industry_name']?.trim().startsWith('Miscellaneous')
                );
                let funct = allFunctions?.filter(
                    (item) =>
                        item['industry_id'] == industry?.[0]['id'] &&
                        item['function_name']?.trim().startsWith('Miscellaneous')
                );
                if (data.app_functions) {
                    response['app_functions'] = true;
                }
                if (data.app_variables) {
                    response['app_variables'] = true;
                }
                if (industry?.[0] && funct?.[0]) {
                    industry = industry?.[0];
                    funct = funct?.[0];
                    response['industry'] = industry['industry_name'];
                    response['industry_id'] = industry['id'];
                    response['function'] = funct['function_name'];
                    response['function_id'] = funct['function_id'];

                    if (
                        !response['industry'] ||
                        !response['industry_id'] ||
                        !response['function'] ||
                        !response['function_id'] ||
                        !emailId
                    )
                        throw new Error("couldn't load industry and function data");
                } else {
                    throw new Error("couldn't load industry and function data");
                }
                const resp = await cloneApplication({
                    payload: {
                        data: response,
                        user_id: user_id
                    }
                });
                popup_form_params.error = false;
                setTimeout(() => {
                    props.history.push(resp?.link);
                }, 2000);
                setSnackbar({ open: true, severity: 'success', message: resp.message });
                await ingestCustomEventTelemetry(resp);
                return popup_form_params;
            } catch (error) {
                setSnackbar({ open: true, severity: 'error', message: error.message });
            }
        }
    };
    return (
        <React.Fragment>
            <CustomSnackbar
                message={snackbar.message}
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={setSnackbar.bind(null, { ...snackbar, open: false })}
                severity={snackbar.severity}
            />
            <DynamicFormModal
                key={'clone_application_form'}
                params={popup_form_params}
                onAction={async (action, data) => await handleValueChange(action, data)}
                triggerButton={
                    iconOnly
                        ? (handleClickOpen) => (
                              <IconButton
                                  data-testid="clone-app-icon-button"
                                  size="large"
                                  title="clone application"
                                  onClick={handleClickOpen}
                              >
                                  <CloneIcon key={theme.props.mode} className={classes.iconOnly} />{' '}
                              </IconButton>
                          )
                        : (handleClickOpen) => (
                              <Button
                                  data-testid="clone-app-button"
                                  variant="outlined"
                                  size="small"
                                  startIcon={<CloneIcon className={classes.icon} />}
                                  key={theme.props.mode}
                                  title="clone application"
                                  onClick={handleClickOpen}
                                  aria-label="Clone Application"
                                  className={classes.cloneAppButton}
                              >
                                  Clone Application
                              </Button>
                          )
                }
                setDialogOpen={setDialogOpen}
            />
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        industryData: state.industryData.list
    };
};

export default connect(mapStateToProps)(withRouter(CloneApplication));
