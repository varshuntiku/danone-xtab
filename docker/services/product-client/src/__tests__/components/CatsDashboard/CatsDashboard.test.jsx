import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CatsDashboard from '../../../components/CatsDashboard/CatsDashboard';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from 'store/store';
import { getHierarchy, getApplicationScreens } from '../../../services/dashboard';
import { vi } from 'vitest';
const history = createMemoryHistory();

global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

vi.mock('../../../services/dashboard', () => ({
    getHierarchy: vi.fn(),
    getApplicationScreens: vi.fn()
}));

vi.mock('../../services/dashboard', () => ({
    getHierarchy: vi.fn(),
    getApplicationScreens: vi.fn()
}));

vi.mock('../../../components/CodxCircularLoader', () => ({
    default: () => <div>Loader</div>
}));

vi.mock('../../../components/NavBar', () => ({
    default: () => <div>Navbar</div>
}));

describe('CatsDashboard', () => {
    const mockDashboardId = '123';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render and display the loader initially', () => {
        getHierarchy.mockResolvedValueOnce({ result: [] });

        render(<CatsDashboard dashboardId={mockDashboardId} />);

        expect(screen.getByText('Loader')).toBeInTheDocument();
        expect(screen.getByText('Navbar')).toBeInTheDocument();
    });

    it('should call getData on mount and display ReactFlow once data is loaded', async () => {
        const mockHierarchyResponse = {
            result: [{ type: 'function', id: '1', label: 'Function1' }]
        };
        getHierarchy.mockResolvedValueOnce(mockHierarchyResponse);

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CatsDashboard dashboardId={mockDashboardId} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => expect(getHierarchy).toHaveBeenCalled());
        expect(screen.queryByText('Loader')).not.toBeInTheDocument();
    });

    it('should handle node click and call getBranches', async () => {
        const mockHierarchyResponse = {
            result: [{ type: 'function', id: '1', label: 'Function1' }]
        };
        const mockScreensResponse = {
            applications: [{ id: 'app1', label: 'App1', type: 'application' }],
            screens: [{ id: 'screen1', label: 'Screen1', type: 'screen', app_id: 'app1' }]
        };

        getHierarchy.mockResolvedValueOnce(mockHierarchyResponse);
        getApplicationScreens.mockResolvedValueOnce(mockScreensResponse);

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CatsDashboard dashboardId={mockDashboardId} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        await waitFor(() => expect(getHierarchy).toHaveBeenCalled());
    });
});
