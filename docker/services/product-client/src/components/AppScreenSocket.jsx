import { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    setAppScreens,
    setInProgressScreenId,
    setProgressBarDetails,
    setActiveScreenWidgetsDetails,
    setUpdatedWidgetsIds,
    setFiltersUpdateStatus
} from 'store/index';
import { fetch_socket_connection } from 'util/initiate_socket.js';
import { UserInfoContext } from 'context/userInfoContent';
import { create_slug } from 'services/app.js';

const AppScreenSocket = ({ app_id, activeScreenWidgets, history }) => {
    const [socket, setSockets] = useState(null);
    const { progressBarDetails, activeScreenId } = useSelector((state) => state.appScreen);
    const userContext = useContext(UserInfoContext);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) {
            setSockets(fetch_socket_connection);
        } else {
            socket['socket_product']?.emit('init_app_screens_update_component', {
                app_id: app_id,
                user_id: userContext.user_id
            });
            socket['socket_product']?.on(
                'app_screens_update_' + app_id + '#' + userContext.user_id,
                (data) => {
                    dispatch(setAppScreens(data.screens));
                    dispatch(setInProgressScreenId(data.screen_id));
                    dispatch(
                        setProgressBarDetails({ ...progressBarDetails, [data.screen_id]: data })
                    );
                }
            );
            socket['socket_product']?.emit('init_stepper_progress_loader_component', {
                app_id: app_id,
                screen_id: activeScreenId,
                user_id: userContext.user_id
            });
            socket['socket_product']?.on(
                `progress_loader_${app_id}#${activeScreenId}#${userContext.user_id}`,
                (data) => {
                    dispatch(
                        setProgressBarDetails({
                            ...progressBarDetails,
                            [activeScreenId]: { ...data, loading: !!data?.loading }
                        })
                    );
                    dispatch(setAppScreens(data?.screens[0]));
                    if (data?.completed) {
                        const url = `/app/${app_id}/${create_slug(data.screen_name)}`;
                        if (window.location.pathname === url) {
                            const widgetIds = activeScreenWidgets
                                ? activeScreenWidgets.map((widget) => widget.id)
                                : [];
                            widgetIds.forEach((id) => {
                                dispatch(
                                    setActiveScreenWidgetsDetails({ widget_id: id, data: null })
                                );
                            });
                        }
                        history.push(url);
                    }
                }
            );

            socket['socket_product']?.emit('init_widgets_update_component', {
                app_id: app_id,
                screen_id: activeScreenId,
                user_id: userContext.user_id
            });
            socket['socket_product']?.on(
                `widgets_update_${app_id}#${activeScreenId}#${userContext.user_id}`,
                (data) => {
                    dispatch(setFiltersUpdateStatus(data?.is_filters_updated));
                    dispatch(setUpdatedWidgetsIds(data?.updated_widgets_ids));
                }
            );
        }

        return () => {
            if (
                socket &&
                socket['socket_product']?.hasListeners(
                    `app_screens_update_${app_id}#${userContext.user_id}`
                )
            ) {
                socket['socket_product']?.removeListener(
                    `app_screens_update_${app_id}#${userContext.user_id}`
                );
            }
            if (
                socket &&
                socket['socket_product']?.hasListeners(
                    `progress_loader_${app_id}#${activeScreenId}#${userContext.user_id}`
                )
            ) {
                socket['socket_product']?.removeListener(
                    `progress_loader_${app_id}#${activeScreenId}#${userContext.user_id}`
                );
            }

            if (
                socket &&
                socket['socket_product']?.hasListeners(
                    `widgets_update_${app_id}#${activeScreenId}#${userContext.user_id}`
                )
            ) {
                socket['socket_product']?.removeListener(
                    `widgets_update_${app_id}#${activeScreenId}#${userContext.user_id}`
                );
            }
        };
    }, [socket, app_id, activeScreenId, userContext.user_id, activeScreenWidgets]);

    return <></>;
};

export default withRouter(AppScreenSocket);
