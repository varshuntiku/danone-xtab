import { create_slug } from 'services/app.js';

export const getUpdatedRoutes = (
    routes,
    screenId,
    screenRenameValue = null,
    type = 'rename',
    appScreens,
    app_id
) => {
    let redirectUrl = null;
    let choosenScreenIndexOne;
    let routeLevelFlagOne = false;
    const updatedRoutes = routes.map((route, index) => {
        if (route.screen_item.id === screenId) {
            if (type === 'rename') {
                let updatedHref = route.original_href.split('/');
                updatedHref.pop();
                const updatedSlug = create_slug(screenRenameValue);
                updatedHref.push(updatedSlug);
                updatedHref = updatedHref.join('/');
                let updatedNestedHref = updatedHref;
                if (route.href !== route.original_href) {
                    const currentScreenNameSlug = create_slug(route.screen_item.screen_name);
                    updatedNestedHref = route.href.replace(currentScreenNameSlug, updatedSlug);
                }
                if (window.location.pathname === route.href) {
                    window.history.replaceState({}, screenRenameValue, updatedNestedHref);
                }
                route.original_href = updatedHref;
                route.href = updatedNestedHref;
                route.screen_item = { ...route.screen_item };
                route.screen_item.screen_name = screenRenameValue;
                return route;
            }
            if (type === 'delete') {
                choosenScreenIndexOne = route.screen_index;
                if (window.location.pathname === route.href) {
                    const prevRoute = routes[index - 1];
                    if (prevRoute) {
                        prevRoute.selected = true;
                        redirectUrl = prevRoute.href;
                    } else {
                        redirectUrl = `/app/${app_id}`;
                    }
                }
                return null;
            }
        }
        if (route.screen_item.screen_index > choosenScreenIndexOne && type === 'delete') {
            if (route.screen_item.level && !routeLevelFlagOne) {
                return null;
            } else {
                routeLevelFlagOne = true;
            }
        }
        return route;
    });
    let choosenScreenIndexTwo;
    let routeLevelFlagTwo = false;
    const updatedAppScreens = appScreens.map((route) => {
        if (route.screen_index > choosenScreenIndexTwo && type === 'delete') {
            if (route.level && !routeLevelFlagTwo) {
                return null;
            } else {
                routeLevelFlagTwo = true;
            }
        }
        if (route.id === screenId) {
            if (type === 'delete') {
                choosenScreenIndexTwo = route.screen_index;
                return null;
            }
            if (type === 'rename') {
                const routeCopy = { ...route };
                routeCopy.screen_name = screenRenameValue;
                return routeCopy;
            }
        }
        return route;
    });
    return [updatedRoutes, updatedAppScreens, redirectUrl];
};
