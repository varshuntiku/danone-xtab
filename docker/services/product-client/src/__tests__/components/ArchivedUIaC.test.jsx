import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ArchivedUIaC from '../../components/ArchivedUIaC';
import httpClient from '../../services/httpClient';
import { vi } from 'vitest';

vi.mock('axios', () => {
    const axiosInstance = {
        create: vi.fn(() => ({
            get: vi.fn(),
            interceptors: {
                request: { use: vi.fn(), eject: vi.fn() },
                response: { use: vi.fn(), eject: vi.fn() }
            }
        }))
    };
    return {
        default: axiosInstance
    };
});

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render UiacArchive Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ArchivedUIaC {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const button = screen.getByText('Archived UIaC Logs');
        expect(button).toBeInTheDocument();
    });

    test('Should render UiacArchive Component with the archives', async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ArchivedUIaC {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        httpClient.get = vi.fn().mockResolvedValue({
            data: [
                {
                    id: 1,
                    widget_value: {
                        is_dynamic: true,
                        code: 'a = 5'
                    },
                    widget_id: 1,
                    widget_title: 'Widget 1',
                    screen_id: 1,
                    screen_title: 'Screen 1',
                    is_deleted_screen: false,
                    type: 'widget'
                }
            ]
        });

        const button = screen.getByText('Archived UIaC Logs');
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        await new Promise((r) => setTimeout(r, 1000));
        expect(screen.getByRole('heading', { name: 'Archived UIaC Logs' })).toBeInTheDocument();
        // expect(screen.getByRole('heading', { name: 'Widget 1' })).toBeInTheDocument();
        // expect(screen.getByText('a =')).toBeInTheDocument();
    });

    test('Should render UiacArchive Component with no archives', async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ArchivedUIaC {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        httpClient.get = vi.fn().mockResolvedValue({
            data: []
        });

        const button = screen.getByText('Archived UIaC Logs');
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        await new Promise((r) => setTimeout(r, 1000));
        expect(screen.getByRole('heading', { name: 'Archived UIaC Logs' })).toBeInTheDocument();
        expect(
            screen.getByRole('heading', {
                name: 'No archives for the current screen'
            })
        ).toBeInTheDocument();
    });
    test('Should handle different archive types correctly', async () => {
        httpClient.get = vi.fn().mockResolvedValue({
            data: [
                {
                    id: 1,
                    filter_value: {
                        code: 'filter_code = true'
                    },
                    widget_id: 1,
                    widget_title: 'Filter 1',
                    screen_id: 1,
                    screen_title: 'Screen 1',
                    is_deleted_screen: false,
                    type: 'filter'
                }
            ]
        });

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ArchivedUIaC {...{ ...Props, archiveType: 'filter' }} />
                </Router>
            </CustomThemeContextProvider>
        );

        const button = screen.getByText('Archived Filter UIaC Logs');
        fireEvent.click(button);

        await waitFor(() => {
            expect(
                screen.getByRole('heading', { name: 'Shows archived Filter UIaC for last 60 days' })
            ).toBeInTheDocument();
        });
    });

    test('Should close the dialog when clicking close button', async () => {
        httpClient.get = vi.fn().mockResolvedValue({ data: [] });

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ArchivedUIaC {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const button = screen.getByText('Archived UIaC Logs');
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Archived UIaC Logs' })).toBeInTheDocument();
        });

        const closeButton = screen.getByTitle('Close');
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: 'Archived UIaC Logs' })).toBeNull();
        });
    });

    test('Should render No archives for the current screen', async () => {
        httpClient.get = vi.fn().mockResolvedValue({
            data: [
                {
                    id: 1,
                    widget_value: {
                        is_dynamic: true,
                        code: 'a = 5'
                    },
                    widget_id: 1,
                    widget_title: 'Widget 1',
                    screen_id: 1,
                    screen_title: 'Screen 1',
                    is_deleted_screen: false,
                    type: 'widget'
                }
            ]
        });

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ArchivedUIaC {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const button = screen.getByText('Archived UIaC Logs');
        fireEvent.click(button);

        await waitFor(() => {
            expect(
                screen.getByRole('heading', { name: 'No archives for the current screen' })
            ).toBeInTheDocument();
        });
    });
});

const Props = {
    app_id: 1,
    screen_id: 1,
    screen_name: 'Screen 1',
    archiveType: 'visual'
};
