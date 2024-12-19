import React from 'react';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from 'themes/customThemeContext';
import { getJwtToken } from 'services/alerts';
import PATdialog from '../../components/Utils/PATdialog';
import { vi } from 'vitest';

const history = createMemoryHistory();
vi.mock('services/alerts', () => ({
    getJwtToken: vi.fn()
}));

describe('PATdialog component renders', () => {
    afterEach(cleanup);
    test('Should render PAT component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PATdialog />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should call api call in  PAT component', () => {
        afterEach(cleanup);
        getJwtToken.mockResolvedValue({ success: true, message: 'Token created successfully' });
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PATdialog />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should handle dialog close', () => {
        const setTokendialog = vi.fn();

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PATdialog
                        showDialog={true}
                        setTokendialog={setTokendialog}
                        reloadData={vi.fn()}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: /close/i }));
        expect(setTokendialog).toHaveBeenCalledWith(false);
    });
    test('Should handle token generation loader display', async () => {
        getJwtToken.mockResolvedValueOnce({ token: '', message: 'Token created successfully' });

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PATdialog showDialog={true} setTokendialog={vi.fn()} reloadData={vi.fn()} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByText('Generate'));
        expect(screen.getByRole('dialog', { name: 'Generate Token' })).toBeInTheDocument();
    });
});
