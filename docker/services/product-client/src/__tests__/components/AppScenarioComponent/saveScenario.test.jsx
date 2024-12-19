import React from 'react';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import SaveScenario from '../../../components/AppScenarioComponent/saveScenario';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { saveScrenario, validScenarioName } from '../../../services/scenario';
import { vi } from 'vitest';

vi.mock('../../../services/scenario', () => ({
    saveScrenario: vi.fn(),
    validScenarioName: vi.fn()
}));

const history = createMemoryHistory();

describe('SaveScenario component tests', () => {
    afterEach(cleanup);

    test('Should render SaveScenario Component', () => {
        const props = {};
        const { getByText, debug, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <SaveScenario {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should open SaveScenario dialog', async () => {
        vi.useFakeTimers();
        const props = {
            filters_json: [],
            app_id: 1,
            screen_id: 2,
            widget_id: 3,
            scenarios_json: {},
            getScenarios: () => {}
        };
        const { getByText, debug, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <SaveScenario {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        validScenarioName.mockImplementation(() =>
            Promise.resolve({ data: { isexists: 'false' } })
        );
        expect(screen.getByRole('button', { name: 'Save Scenario' })).toBeInTheDocument();
        const saveBtn = screen.getByRole('button', { name: 'Save Scenario' });
        fireEvent.click(saveBtn);
        expect(screen.getByPlaceholderText('Enter the scenario name')).toBeInTheDocument();
        const scenarioName = screen.getByPlaceholderText('Enter the scenario name');
        fireEvent.change(scenarioName, {
            target: { name: 'scenarioname', value: 'test scenario 1' }
        });
        act(() => {
            vi.advanceTimersByTime(2000);
        });
        //expect(screen.getByTitle('Save')).toBeInTheDocument()
    });

    test('Should close savescenario dialog', async () => {
        vi.useFakeTimers();
        const props = {
            filters_json: [],
            app_id: 1,
            screen_id: 2,
            widget_id: 3,
            scenarios_json: {},
            getScenarios: () => {}
        };
        const { getByText, debug, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <SaveScenario {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        validScenarioName.mockImplementation(() => Promise.reject());
        expect(screen.getByRole('button', { name: 'Save Scenario' })).toBeInTheDocument();
        const saveBtn = screen.getByRole('button', { name: 'Save Scenario' });
        fireEvent.click(saveBtn);
        expect(screen.getByPlaceholderText('Enter the scenario name')).toBeInTheDocument();
        const scenarioName = screen.getByPlaceholderText('Enter the scenario name');
        fireEvent.change(scenarioName, {
            target: { name: 'scenarioname', value: 'test scenario 1' }
        });
        act(() => {
            vi.advanceTimersByTime(2000);
        });
        expect(screen.getByTitle('Cancel')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('Cancel'));
    });
    test('Should SaveScenario Component', async () => {
        vi.useFakeTimers();
        const props = {
            filters_json: [],
            app_id: 1,
            screen_id: 2,
            widget_id: 3,
            scenarios_json: {},
            getScenarios: () => {}
        };
        const { getByText, debug, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <SaveScenario {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        validScenarioName.mockImplementation(() =>
            Promise.resolve({ data: { isexists: false, responseKey: true } })
        );
        expect(screen.getByRole('button', { name: 'Save Scenario' })).toBeInTheDocument();
        const saveBtn = screen.getByRole('button', { name: 'Save Scenario' });
        fireEvent.click(saveBtn);
        expect(screen.getByPlaceholderText('Enter the scenario name')).toBeInTheDocument();
        const scenarioName = screen.getByPlaceholderText('Enter the scenario name');
        fireEvent.change(scenarioName, {
            target: { name: 'scenarioname', value: 'test scenario 1' }
        });
        act(() => {
            vi.advanceTimersByTime(2000);
        });
        SaveScenario.responseKey = true;
        SaveScenario.isexists = false;
        SaveScenario.scenarioName = 'test';
    });
});
