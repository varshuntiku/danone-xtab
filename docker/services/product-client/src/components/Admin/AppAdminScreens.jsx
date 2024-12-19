import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import appAdminStyle from 'assets/jss/appAdminStyle.jsx';
import { Typography, Button, Grid, IconButton, FormControlLabel, Switch } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import CustomSnackbar from 'components/CustomSnackbar.jsx';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import AppScreenAdmin from 'components/AppScreenAdmin.jsx';

import { getScreenConfig, saveScreenConfig } from 'services/app_admin.js';
import ScreensListView from './ScreensListView';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import PostAddIcon from '@material-ui/icons/PostAdd';
import clsx from 'clsx';
import { Prompt } from 'react-router-dom';
import CodxCollabWork from '../CodxCollabWork';
import { emit_change_codx_collab } from '../../util/collab_work';
import ConfirmPopup from '../confirmPopup/ConfirmPopup';
import { UserInfoContext } from 'context/userInfoContent';
import CustomLayout from 'components/CustomLayout/CustomLayout.jsx';

class AppAdminScreens extends React.Component {
    static contextType = UserInfoContext;
    constructor(props) {
        super(props);

        this.props = props;

        var screen_id =
            props.match && props.match.params.screen_id ? props.match.params.screen_id : false;

        this.state = {
            loading: false,
            details: {},
            new_screens: [],
            collapse_screens: false,
            selected_screen_id: Number(screen_id) || 0,
            screensValueChanged: false,
            unsavedValues: {},
            screenHierarchySaveInProgress: false,
            editMode: !this.props.app_info.modules?.nac_collaboration,
            customLayout: true
        };
    }

    componentDidMount() {
        this.refreshScreenConfig();
    }

    componentDidUpdate(prevProps) {
        const prev_screen_id = prevProps.match?.params?.screen_id;
        const current_screen_id = this.props.match?.params?.screen_id;
        if (prev_screen_id !== current_screen_id) {
            this.setState({
                selected_screen_id: Number(current_screen_id) || 0,
                unsavedValues: {}
            });
        }
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = () => {
            return;
        };
    }

    refreshScreenConfig = async () => {
        const { app_info } = this.props;

        this.setState({
            loading: true
        });
        try {
            await getScreenConfig({
                app_id: app_info.id,
                callback: this.onResponseGetScreenConfig
            });
            this.scrollScreenIntoView(this.state.selected_screen_id);
        } catch (err) {
            // console.error(err);
            this.setState({
                loading: false
            });
        }
    };

    onResponseGetScreenConfig = (response_data) => {
        if (response_data.status === 'error') {
            this.setState({
                notificationOpen: true,
                notification: {
                    message: 'Failed to fetch screen config.Please try again!',
                    severity: 'error'
                },
                screenHierarchySaveInProgress: false
            });
            return;
        }
        const newScreens = response_data['data'];
        const foundScreen = newScreens.find((el) => el.id == this.state.selected_screen_id);
        const screenId = foundScreen?.id || response_data.data[0]?.id || 0;
        this.setState({
            loading: false,
            new_screens: newScreens
        });
        if (this.props.isDsWorkbench) {
            this.props.history.push(
                `/ds-workbench/project/${this.props.parent_obj.state.project_id}/deploy/applications/app/${this.props.parent_obj.state.app_id}/admin/screens/${screenId}`
            );
        } else {
            this.props.history.push(
                '/app/' + this.props.app_info.id + '/admin/screens/' + screenId
            );
        }
    };

    onAddScreenConfig = () => {
        const screens = JSON.parse(JSON.stringify(this.state.new_screens));
        const untitledScreenCount = screens.filter((screen) =>
            screen.name.includes('Untitled Screen')
        ).length;
        let id = Date.now();
        screens.push({
            name:
                untitledScreenCount == 0
                    ? 'Untitled Screen'
                    : `Untitled Screen${untitledScreenCount}`,
            screen_index: screens.length,
            level: 0,
            _id: id
        });

        this.setState({
            new_screens: screens,
            screensValueChanged: true
        });
        this.scrollScreenIntoView(id, true, true);
    };

    scrollScreenIntoView = (screenId, flash, focusInput) => {
        setTimeout(() => {
            const newScreenItem = document.getElementById('screen-list-item' + screenId);
            if (newScreenItem) {
                window.innerHeight < 610
                    ? newScreenItem.scrollIntoView({ behavior: 'smooth', block: 'end' })
                    : newScreenItem.scrollIntoView({ behavior: 'smooth' });
                if (flash) {
                    newScreenItem.classList.add(this.props.classes.flash);
                }
                const input = newScreenItem.querySelector('input');
                if (focusInput && input) {
                    input.focus();
                }
            }
        }, 300);
    };

    onIndentScreen = (screen_index, level) => {
        const screens = JSON.parse(JSON.stringify(this.state.new_screens));
        screen_index = parseInt(screen_index);
        screens[screen_index]['level'] = level;
        this.setState({
            new_screens: screens,
            screensValueChanged: true
        });
    };

    onReorderScreen = (dragIndex, dropIndex) => {
        let screens = JSON.parse(JSON.stringify(this.state.new_screens));
        const pickedScreen = screens.splice(dragIndex, 1);
        screens = [...screens.slice(0, dropIndex), ...pickedScreen, ...screens.slice(dropIndex)];
        this.setState({
            new_screens: [...screens],
            screensValueChanged: true
        });
    };

    onDeleteScreen = (screen_index) => {
        screen_index = parseInt(screen_index);
        const screens = JSON.parse(JSON.stringify(this.state.new_screens));
        const screen_id = screens[screen_index].id;

        if (screen_id == this.state.selected_screen_id) {
            this.setState({
                selected_screen_id: null
            });
        }
        screens.splice(screen_index, 1);

        this.setState({
            new_screens: screens,
            screensValueChanged: true
        });
    };

    debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    onHandleFieldChange = this.debounce((screen_title_id, screen_name, params) => {
        const screen_index = params['screen_index'];
        const screens = JSON.parse(JSON.stringify(this.state.new_screens));
        const isMatch = screens.some(
            (item) => item.name === screen_name && screen_index !== item.screen_index
        );
        if (isMatch) {
            this.setState({
                notificationOpen: true,
                notification: {
                    message: 'Duplicate screen names !',
                    severity: 'error'
                },
                screensValueChanged: false
            });
        } else {
            screens[screen_index]['name'] = screen_name;
            this.setState({
                new_screens: screens,
                screensValueChanged: true
            });
        }
    }, 300);

    onHideScreen = (index, hidden) => {
        const screens = JSON.parse(JSON.stringify(this.state.new_screens));

        screens[index]['hidden'] = hidden;

        this.setState({
            new_screens: screens,
            screensValueChanged: true
        });
    };

    onClickScreenSave = async () => {
        try {
            const { app_info } = this.props;
            this.setState({
                screenHierarchySaveInProgress: true
            });
            const resp = await saveScreenConfig({
                app_id: app_info.id,
                payload: {
                    screens: this.state.new_screens
                }
            });
            this.onResponseScreenSave(resp);
            emit_change_codx_collab(`${this.props.app_info.id}#nac_nitification`, {
                screenHierarchyUpdated: true
            });
        } catch (err) {
            let message = 'Failed to save screen!';
            if (err.response?.data?.error) {
                message = err.response.data.error;
            }
            this.setState({
                notificationOpen: true,
                notification: {
                    message: message,
                    severity: 'error'
                },
                screenHierarchySaveInProgress: false
            });
        }
    };

    onResponseScreenSave = async () => {
        this.setState({
            notificationOpen: true,
            notification: {
                message: 'Screens saved successfully !'
            },
            screensValueChanged: false
        });

        try {
            const [, { value: screensResponse }] = await Promise.allSettled([
                this.props.parent_obj.refreshAppSilent(),
                getScreenConfig({ app_id: this.props.app_info.id })
            ]);
            this.onResponseGetScreenConfig(screensResponse);
        } catch (err) {
            // console.error(err);
        } finally {
            this.setState({
                screenHierarchySaveInProgress: false
            });
        }
    };

    onExpand = (screen_index) => {
        const { app_info } = this.props;
        if (this.props.isDsWorkbench) {
            this.props.history.push(
                `/ds-workbench/project/${this.props.parent_obj.state.project_id}/deploy/applications/app/${app_info.id}/admin/screens/${this.state.new_screens[screen_index]['id']}`
            );
        } else {
            this.props.history.push(
                '/app/' +
                    app_info.id +
                    '/admin/screens/' +
                    this.state.new_screens[screen_index]['id']
            );
        }
    };

    onClickCollapseScreens = (is_collapse) => {
        this.setState({
            collapse_screens: is_collapse
        });
    };

    setUnsavedValue = (key, value) => {
        let newVal = value;
        if (value instanceof Object) {
            newVal = {
                ...this.state.unsavedValues[key],
                ...value
            };
            if (!Object.values(newVal).some(Boolean)) {
                newVal = null;
            }
        }
        this.setState((prevState) => {
            const currentUnsaved = prevState.unsavedValues[key];
            if (JSON.stringify(currentUnsaved) !== JSON.stringify(newVal)) {
                return {
                    unsavedValues: {
                        ...prevState.unsavedValues,
                        [key]: newVal
                    }
                };
            }

            return null;
        });
    };

    setCompleteUnsavedState = (unsavedValues) => {
        this.setState({
            unsavedValues
        });
    };

    handleNotification = (data) => {
        if (data) {
            if (
                data.screenHierarchyUpdated ||
                data.screenOverviewUpdated ||
                data.screenLayoutUpdated ||
                data.screenFilterUpdated ||
                data.screenActionsUpdated
            ) {
                this.props.parent_obj.refreshAppSilent();
            }
        }
    };

    handleEditModeChange = () => {
        if (!this.state.editMode) {
            this.props.parent_obj.refreshAppSilent();
        }
        this.setState({
            editMode: !this.state.editMode
        });
    };

    handleNewScreensUpdates = (state) => {
        this.setState(state);
        if (this.state.selected_screen_id) {
            const found_screen = state.new_screens.find(
                (el) => el.id == this.state.selected_screen_id
            );
            if (!found_screen) {
                this.setState({
                    notificationOpen: true,
                    notification: {
                        message:
                            'Current screen has been removed. Please save your screen level changes.',
                        severity: 'warning',
                        autoHideDuration: null
                    }
                });
            }
        }
    };

    render() {
        const { classes, app_info, user_permissions } = this.props;
        const { nac_collaboration } = app_info.modules || {};
        const unsavedChangesPresent = Object.values(this.state.unsavedValues).some(Boolean);
        let edit_production_app = this.context.nac_roles[0]?.permissions.find(
            (permission) => permission.name === 'EDIT_PRODUCTION_APP'
        );
        let edit_preview_app = this.context.nac_roles[0]?.permissions.find(
            (permission) => permission.name === 'CREATE_PREVIEW_APP'
        );
        const editDisabled =
            app_info?.environment === 'prod' ? !edit_production_app : !edit_preview_app;

        return this.state.loading ? (
            <CodxCircularLoader size={60} center id="loading-spinner" />
        ) : (
            <>
                <Grid container spacing={0} className={classes.screensGridContainer}>
                    <Grid
                        item
                        xs="auto"
                        className={clsx(
                            classes.screensContainer,
                            this.state.collapse_screens && classes.hideScreenContainer
                        )}
                    >
                        <div
                            style={{
                                display: 'flex',
                                gap: '1.6rem',
                                alignItems: 'center',
                                paddingBottom: '1.6rem',
                                justifyContent: 'space-between'
                            }}
                            id="screen-config-header"
                        >
                            <Typography
                                key="screens-alert-text"
                                className={classes.customFormSectionHeaderLeft}
                                variant="h4"
                            >
                                Configure screens
                            </Typography>
                            {editDisabled || !nac_collaboration ? null : (
                                <ConfirmPopup
                                    onConfirm={this.handleEditModeChange}
                                    disabled={!this.state.editMode && !unsavedChangesPresent}
                                    confirmText="Turn off editing"
                                    cancelText="Cancel"
                                    title="TURN OFF EDITING"
                                    subTitle={
                                        <>
                                            <span>
                                                You have unsaved changes. Please save the changes
                                                before truning off editing mode.
                                            </span>
                                            <br />
                                            <span>Do you wish to continue?</span>
                                        </>
                                    }
                                >
                                    {(triggerConfirm) => (
                                        <FormControlLabel
                                            className={classes.editToogleButton}
                                            control={
                                                <Switch
                                                    size="small"
                                                    checked={this.state.editMode}
                                                    onChange={
                                                        this.state.editMode && unsavedChangesPresent
                                                            ? triggerConfirm
                                                            : this.handleEditModeChange
                                                    }
                                                    name="edit_switch"
                                                />
                                            }
                                            label={
                                                this.state.editMode ? 'Editing on' : 'Editing off'
                                            }
                                        />
                                    )}
                                </ConfirmPopup>
                            )}
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingLeft: '0.5rem'
                            }}
                            id="screen-toolbar"
                        >
                            <Button
                                key="screens-toolbar"
                                size="small"
                                variant="outlined"
                                onClick={() => this.onAddScreenConfig()}
                                disabled={editDisabled || !this.state.editMode}
                                aria-label="Add screen"
                            >
                                <AddIcon className={classes.icons} />
                                <span style={{ paddingLeft: '2px' }}>Add Screen</span>
                            </Button>
                            <div style={{ position: 'absolute', right: '0.5rem' }}>
                                <CodxCollabWork
                                    room={`${this.props.app_info.id}#nac_screen_hierarchy`}
                                    state={{
                                        new_screens: this.state.new_screens,
                                        screensValueChanged: this.state.screensValueChanged
                                    }}
                                    onStateChange={(state) => this.handleNewScreensUpdates(state)}
                                    currentUserAvatarProps={{
                                        max: 1,
                                        enableTeamsCollaboration: true,
                                        teamsTopicName: `NAC: ${this.props.app_info.name} | Configure Screens`,
                                        teamsMessage: 'Hi!'
                                    }}
                                    disabled={!this.state.editMode || !nac_collaboration}
                                />
                            </div>
                            <CodxCollabWork
                                room={`${this.props.app_info.id}#nac_nitification`}
                                onStateChange={(state) => this.handleNotification(state)}
                                hideCurrentUsersAvatars
                                disabled={!this.state.editMode || !nac_collaboration}
                            />
                        </div>
                        <div style={{ paddingTop: '1.6rem' }}>
                            <ScreensListView
                                valueChanged={this.state.screensValueChanged}
                                screens={this.state.new_screens}
                                onClickScreenSave={this.onClickScreenSave}
                                onHideScreen={this.onHideScreen}
                                selectedScreenId={this.state.selected_screen_id}
                                onHandleFieldChange={this.onHandleFieldChange}
                                onExpand={this.onExpand}
                                onReorderScreen={this.onReorderScreen}
                                onIndentScreen={this.onIndentScreen}
                                onDeleteScreen={this.onDeleteScreen}
                                app_info={app_info}
                                user_permissions={user_permissions}
                                unsavedValues={this.state.unsavedValues}
                                screenHierarchySaveInProgress={
                                    this.state.screenHierarchySaveInProgress
                                }
                                editMode={this.state.editMode}
                                unsavedChangesPresent={unsavedChangesPresent}
                                editDisabled={editDisabled}
                            />
                        </div>
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
                    </Grid>
                    <Grid
                        item
                        xs
                        className={
                            this.props.isDsWorkbench
                                ? classes.dswAppScreensContentContainer
                                : classes.screensContentContainer
                        }
                    >
                        <IconButton
                            onClick={() =>
                                this.onClickCollapseScreens(!this.state.collapse_screens)
                            }
                            size="small"
                            title={this.state.collapse_screens ? 'expand' : 'collapse'}
                            className={classes.drawerHandle}
                            aria-label="Collapse screen"
                        >
                            {this.state.collapse_screens ? (
                                <ChevronRightRoundedIcon fontSize="large" />
                            ) : (
                                <ChevronLeftRoundedIcon fontSize="large" />
                            )}
                        </IconButton>
                        {this.state.selected_screen_id !== 0 && (
                            <AppScreenAdmin
                                key={this.state.selected_screen_id}
                                unsavedValues={this.state.unsavedValues}
                                setUnsavedValue={(k, v) => this.setUnsavedValue(k, v)}
                                app_info={app_info}
                                screen_id={this.state.selected_screen_id}
                                logged_in_user_info={this.props.logged_in_user_info}
                                parent_obj={this.props.parent_obj}
                                nac_collaboration={nac_collaboration}
                                unsavedChangesPresent={unsavedChangesPresent}
                                user_permissions={user_permissions}
                                setCompleteUnsavedState={this.setCompleteUnsavedState}
                                screens={this.state.new_screens}
                                editMode={this.state.editMode}
                                editDisabled={editDisabled}
                                setGPTinfo={this.props.setGPTinfo && this.props.setGPTinfo}
                            />
                        )}
                        {!app_info.screens?.length ? (
                            <div className={classes.emptyStateContainer}>
                                <PostAddIcon className={classes.emptyStateIcon} />
                                <Typography variant="h5" className={classes.emptyStateH1}>
                                    No screen is added
                                </Typography>
                                <Typography variant="h6" className={classes.emptyStateH2}>
                                    {
                                        'Create your first screen by clicking on the "Add Screen" button'
                                    }
                                </Typography>
                            </div>
                        ) : null}
                    </Grid>
                    {!this.state.customLayout ? <CustomLayout /> : null}
                </Grid>
                <Prompt
                    when={unsavedChangesPresent || this.state.screensValueChanged}
                    message={(location) => {
                        return location.pathname.startsWith(
                            '/app/' + app_info.id + '/admin/screens/'
                        )
                            ? true
                            : 'You have unsaved changes. If you exit page, the changes will be lost.';
                    }}
                />
            </>
        );
    }
}

AppAdminScreens.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...customFormStyle(theme),
        ...appAdminStyle(theme)
    }),
    { withTheme: true }
)(AppAdminScreens);
