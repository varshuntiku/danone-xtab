import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import LoadScenario from '../../../components/AppScenarioComponent/loadScenario';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { deleteScenarios } from '../../../services/scenario';
import { vi } from 'vitest';

vi.mock('../../../services/scenario', () => ({
    deleteScenarios: vi.fn()
}));

const history = createMemoryHistory();

describe('LoadScenario component tests', () => {
    afterEach(cleanup);

    test('Should Render LoadScenario Component', () => {
        const props = {};
        const { getByText, debug, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <LoadScenario {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should open loadscenario dialog ', () => {
        const props = {
            loadScenario: () => {},
            savedScenarios: [
                {
                    id: 1,
                    name: 'test name',
                    comment: 'test comment',
                    createdAt: '01/27/2022',
                    app_id: 1
                }
            ],
            getScenarios: () => {}
        };
        const { getByText, debug, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <LoadScenario {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByRole('button', { name: 'Load Scenario' })).toBeInTheDocument();
        const btn = screen.getByRole('button', { name: 'Load Scenario' });
        fireEvent.click(btn);
        expect(screen.getByLabelText('scenario')).toBeInTheDocument();
        const scenario = screen.getByLabelText('scenario');
        fireEvent.click(scenario);
        const loadBtn = screen.getByTitle('Load');
        fireEvent.click(loadBtn);
    });

    test('Should close loadscenario dialog', () => {
        const props = {
            loadScenario: () => {},
            savedScenarios: [
                {
                    id: 1,
                    name: 'test name',
                    comment: 'test comment',
                    createdAt: '01/27/2022',
                    app_id: 1
                }
            ],
            getScenarios: () => {}
        };
        const { getByText, debug, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <LoadScenario {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByRole('button', { name: 'Load Scenario' })).toBeInTheDocument();
        const btn = screen.getByRole('button', { name: 'Load Scenario' });
        fireEvent.click(btn);
        expect(screen.getByLabelText('close')).toBeInTheDocument();
        const close = screen.getByLabelText('close');
        fireEvent.click(close);
    });

    test('Should delete scenario successfully', async () => {
        const props = {
            loadScenario: () => {},
            savedScenarios: [
                {
                    id: 1,
                    name: 'test name',
                    comment: 'test comment',
                    createdAt: '01/27/2022',
                    app_id: 1
                }
            ],
            getScenarios: () => {}
        };
        vi.spyOn(global.window, 'confirm').mockImplementation(() => {
            return true;
        });
        deleteScenarios.mockImplementation(() =>
            Promise.resolve({ data: { message: 'Successfully Deleted' } })
        );
        const { getByText, debug, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <LoadScenario {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByRole('button', { name: 'Load Scenario' })).toBeInTheDocument();
        const btn = screen.getByRole('button', { name: 'Load Scenario' });
        fireEvent.click(btn);
        expect(screen.getByLabelText('Delete')).toBeInTheDocument();
        const deleteBtn = screen.getByLabelText('Delete');
        fireEvent.click(deleteBtn);
    });

    test('Should not delete scenario', async () => {
        const props = {
            loadScenario: () => {},
            savedScenarios: [
                {
                    id: 1,
                    name: 'test name',
                    comment: 'test comment',
                    createdAt: '01/27/2022',
                    app_id: 1
                }
            ],
            getScenarios: () => {}
        };
        vi.spyOn(global.window, 'confirm').mockImplementation(() => {
            return true;
        });
        deleteScenarios.mockImplementation(() => Promise.reject({ message: 'failed' }));
        const { getByText, debug, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <LoadScenario {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByRole('button', { name: 'Load Scenario' })).toBeInTheDocument();
        const btn = screen.getByRole('button', { name: 'Load Scenario' });
        fireEvent.click(btn);
        expect(screen.getByLabelText('Delete')).toBeInTheDocument();
        const deleteBtn = screen.getByLabelText('Delete');
        fireEvent.click(deleteBtn);
    });
});
