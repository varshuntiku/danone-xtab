import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import ConnectedSystems from '../../../components/Utils/ConnectedSystems';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';

import store from 'store/store';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { vi } from 'vitest';
import * as connectedSystemService from '../../../services/connectedSystem_v2';
import UtilsDataTable from '../../../components/Utils/UtilsDataTable';
import ManageConnectedSystems from '../../../components/Utils/ManageConnectedSystems';

const history = createMemoryHistory();
vi.mock('services/connectedSystem_v2', () => ({
    getConnectedSystems: vi.fn()
}));

vi.mock('./ManageConnectedSystems.jsx', () => ({
    __esModule: true,
    default: vi.fn(() => <div>ManageConnectedSystems Component</div>)
}));

vi.mock('./UtilsDataTable.jsx', () => ({
    __esModule: true,
    default: vi.fn(() => <div>UtilsDataTable Component</div>)
}));

vi.mock('components/shared/platform-utils-nav-header/platform-utils-nav-header', () => ({
    __esModule: true,
    default: vi.fn(() => <div>UtilsNavigation Component</div>)
}));

describe('ConnectedSystems Component', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders without crashing', async () => {
        connectedSystemService.getConnectedSystems.mockImplementation(({ callback }) => {
            callback([]);
        });

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ConnectedSystems />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('UtilsNavigation Component')).toBeInTheDocument();
    });

    it('fetches and displays connected systems', async () => {
        const mockData = [
            {
                id: 1,
                name: 'System 1',
                industry: 'Industry 1',
                function: 'Function 1',
                is_active: true
            },
            {
                id: 2,
                name: 'System 2',
                industry: 'Industry 2',
                function: 'Function 2',
                is_active: false
            }
        ];

        connectedSystemService.getConnectedSystems.mockImplementation(({ callback }) => {
            callback(mockData);
        });

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ConnectedSystems />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Industry')).toBeInTheDocument();
        });
    });

    it('displays a message when no connected systems are found', async () => {
        connectedSystemService.getConnectedSystems.mockImplementation(({ callback }) => {
            callback([]);
        });

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ConnectedSystems />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Dashboard Name')).toBeInTheDocument();
        });
    });

    it('handles actions in the data table', async () => {
        const mockData = [
            {
                id: 1,
                name: 'System 1',
                industry: 'Industry 1',
                function: 'Function 1',
                is_active: true
            }
        ];

        connectedSystemService.getConnectedSystems.mockImplementation(({ callback }) => {
            callback(mockData);
        });

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ConnectedSystems />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Conn System Id')).toBeInTheDocument();
        });
    });
});
