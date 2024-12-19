import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import AppScreenPackageDetails from '../../components/AppScreenPackageDetails';
import { Provider } from 'react-redux';
import store from 'store/store';

const history = createMemoryHistory();

vi.mock('./icons/PackageDetails', () => ({
    default: () => <div>PackageDetails Icon</div>
}));

describe('AppScreenPackageDetails', () => {
    const mockPackages = [
        { id: 1, title: 'Package 1', version: '1.0.0' },
        { id: 2, title: 'Package 2', version: '2.0.0' }
    ];

    it('renders the component and button correctly', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreenPackageDetails packages={mockPackages} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Packages Available')).toBeInTheDocument();
    });

    it('opens and closes the dialog', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreenPackageDetails packages={mockPackages} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText('Packages Available'));
        expect(screen.getByText('Packages Used')).toBeInTheDocument();

        fireEvent.click(screen.getByTitle('Close'));
        await waitFor(() => {
            expect(screen.queryByText('Packages Used')).not.toBeInTheDocument();
        });
    });

    it('filters packages based on search input', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreenPackageDetails packages={mockPackages} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText('Packages Available'));

        fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'Package 1' } });
        fireEvent.click(screen.getByRole('button', { name: /toggle search visibility/i }));

        await waitFor(() => {
            expect(screen.getByText('Package 1')).toBeInTheDocument();
            expect(screen.queryByText('Package 2')).not.toBeInTheDocument();
        });
    });

    it('renders package list correctly', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreenPackageDetails packages={mockPackages} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText('Packages Available'));

        expect(screen.getByText('Package 1')).toBeInTheDocument();
        expect(screen.getByText('1.0.0')).toBeInTheDocument();
        expect(screen.getByText('Package 2')).toBeInTheDocument();
        expect(screen.getByText('2.0.0')).toBeInTheDocument();
    });
});
