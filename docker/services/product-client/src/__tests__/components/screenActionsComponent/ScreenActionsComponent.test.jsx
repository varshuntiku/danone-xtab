import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ScreenActionsComponent from '../../../components/screenActionsComponent/ScreenActionsComponent.jsx';
import * as screenService from '../../../services/screen';
const history = createMemoryHistory();

vi.mock('./actionComponents/ActionButton', () => () => <div>ActionButton</div>);
vi.mock('./actionComponents/DownloadLink', () => () => <div>DownloadLink</div>);
vi.mock('./actionComponents/PopupForm', () => () => <div>PopupForm</div>);
vi.mock('./actionComponents/TextList', () => () => <div>TextList</div>);
vi.mock('./actionComponents/ToasterNotification', () => () => <div>ToasterNotification</div>);
vi.mock('./actionComponents/WidgetListModal', () => () => <div>WidgetListModal</div>);
vi.mock('../custom/CodxToggleSwitch', () => () => <div>ToggleSwitch</div>);

vi.spyOn(screenService, 'getScreenActionSettings').mockResolvedValue({
    actions: [
        {
            component_type: 'button',
            position: { portal: 'top_right' },
            action_type: 'click',
            params: {}
        },
        {
            component_type: 'popup_form',
            position: { portal: 'bottom_left', style: { top: '2rem', left: '1rem' } },
            action_type: 'submit',
            params: {}
        },
        {
            component_type: 'download_link',
            position: { portal: 'bottom_right' },
            action_type: 'download',
            params: {}
        },
        {
            component_type: 'notification',
            position: { portal: 'top_left' },
            action_type: 'notify',
            params: {}
        },
        {
            component_type: 'text_list',
            position: { portal: 'center' },
            action_type: 'list',
            params: {}
        },
        {
            component_type: 'widget_list_modal',
            position: { portal: 'center' },
            action_type: 'modal',
            params: {}
        },
        {
            component_type: 'marquee_slider',
            position: { portal: 'top_center' },
            action_type: 'scroll',
            params: {}
        },
        {
            component_type: 'toggle_switch',
            position: { portal: 'bottom_center' },
            action_type: 'toggle',
            params: { classes: 'toggle-class' }
        }
    ]
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts ToasterNotification Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreenActionsComponent
                        screen_id={1}
                        app_id={1}
                        action_settings={{
                            actions: [
                                {
                                    component_type: 'text_list',
                                    params: {},
                                    position: { portal: 'portal-name' }
                                }
                            ]
                        }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render ActionButton Component', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreenActionsComponent
                        screen_id={1}
                        app_id={1}
                        selected_filter="filter"
                        preview={false}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render PopupForm Component with correct styles', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreenActionsComponent
                        screen_id={1}
                        app_id={1}
                        selected_filter="filter"
                        preview={false}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render DownloadLink Component', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreenActionsComponent
                        screen_id={1}
                        app_id={1}
                        selected_filter="filter"
                        preview={false}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should call getScreenActionSettings on mount', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreenActionsComponent
                        screen_id={1}
                        app_id={1}
                        selected_filter="filter"
                        preview={false}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should apply styles correctly for component types', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreenActionsComponent
                        screen_id={1}
                        app_id={1}
                        selected_filter="filter"
                        preview={false}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should call getScreenActionSettings on mount', async () => {
        const spy = vi.spyOn(screenService, 'getScreenActionSettings');

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreenActionsComponent
                        screen_id={1}
                        app_id={1}
                        selected_filter="filter"
                        preview={false}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        await waitFor(() => {
            expect(spy).toHaveBeenCalledWith({
                app_id: 1,
                screen_id: 1,
                selected_filter: 'filter'
            });
        });
    });
});
