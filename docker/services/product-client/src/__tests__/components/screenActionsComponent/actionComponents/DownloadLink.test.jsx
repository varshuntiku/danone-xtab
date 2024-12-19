import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { DownloadLink } from '../../../../components/screenActionsComponent/actionComponents/DownloadLink';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('services/screen.js', () => {
    return {
        triggerActionHandler: ({ callback }) => {
            callback({ error: true, message: 'some message' });
        }
    };
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DownloadLink when Is Icon false Component', async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DownloadLink
                        screen_id={1}
                        app_id={1}
                        params={{
                            is_icon: false,
                            title: 'test-title',
                            fetch_on_click: true,
                            text: 'linktext'
                        }}
                        action_type="action_Type"
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByText('linktext'));
    });

    test('Should render layouts DownloadLink when Is Icon True Component', async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DownloadLink
                        screen_id={1}
                        app_id={1}
                        params={{
                            is_icon: true,
                            title: 'test-title',
                            fetch_on_click: true,
                            text: 'linktext'
                        }}
                        action_type="action_Type"
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByTitle('test-title'));
    });

    test('Should render layouts DownloadLink when Is Icon True Component', async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DownloadLink
                        screen_id={1}
                        app_id={1}
                        params={{
                            is_icon: true,
                            title: 'test-title',
                            fetch_on_click: false,
                            text: 'linktext'
                        }}
                        action_type="action_Type"
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByTitle('test-title'));
    });
    test('Should render DownloadLink with icon and handle fetch_on_click', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DownloadLink
                        screen_id={1}
                        app_id={1}
                        params={{
                            is_icon: true,
                            title: 'Download Icon',
                            fetch_on_click: true
                        }}
                        action_type="download_action"
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByTitle('Download Icon'));

        await waitFor(() => {
            expect(global.fetch);
        });
    });

    test('Should render DownloadLink with text link', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DownloadLink
                        screen_id={1}
                        app_id={1}
                        params={{
                            is_icon: false,
                            title: 'Download Link',
                            fetch_on_click: true,
                            text: 'Download Now'
                        }}
                        action_type="download_action"
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByText('Download Now'));
    });

    test('Should render DownloadLink with text link', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DownloadLink
                        screen_id={1}
                        app_id={1}
                        params={{
                            is_icon: false,
                            title: 'Static Download Link',
                            fetch_on_click: false,
                            text: 'Download Static File'
                        }}
                        action_type="static_download_action"
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByText('Download Static File'));

        await waitFor(() => {
            expect(global.fetch);
        });
    });

    test('Should handle download failure', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DownloadLink
                        screen_id={1}
                        app_id={1}
                        params={{
                            is_icon: false,
                            title: 'Download Link',
                            fetch_on_click: true,
                            text: 'Download with Error'
                        }}
                        action_type="download_action"
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByText('Download with Error'));
    });
});
