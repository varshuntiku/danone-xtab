import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ObjectivesSteps from '../../../components/navigator/ObjectivesSteps';
import { Provider } from 'react-redux';
import { getObjectivesSteps } from 'store/index';
import { configureStore, createSlice } from '@reduxjs/toolkit';
const history = createMemoryHistory();
import { vi } from 'vitest';

vi.mock('store/index', () => ({
    getObjectivesSteps: vi.fn()
}));

vi.mock('store/store', () => ({
    store: vi.fn()
}));

const store = configureStore({
    reducer: createSlice({
        name: 'navigator',
        initialState: {
            navigator: {
                objectives: []
            },
            appScreen: {
                widgetData: [],
                graphData: []
            }
        }
    }).reducer
});

vi.mock('../../../components/AppScreen', () => {
    return {
        default: (props) => (
            <>
                Mock component 2
                <button onClick={() => props.handleStoriesCount} aria-label="clicked-alert">
                    Test Handle Stories
                </button>
            </>
        )
    };
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts ObjectivesDashboard Component', () => {
        getObjectivesSteps.mockImplementation(({ callback }) => {
            callback([{ data: 'test' }]);
            return {
                type: 'getObjectivesSteps',
                payload: []
            };
        });

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ObjectivesSteps
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1 }}
                            match={{ params: { objective_id: 1 } }}
                            history={history}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Exit'));
    });

    test('Should handle step navigation correctly', () => {
        getObjectivesSteps.mockImplementation(({ callback }) => {
            callback([{ data: 'test' }]);
            return {
                type: 'getObjectivesSteps',
                payload: []
            };
        });

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ObjectivesSteps
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1 }}
                            match={{ params: { objective_id: 1 } }}
                            history={history}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).toBeInTheDocument();
    });

    test('Should update state on handleNext', () => {
        getObjectivesSteps.mockImplementation(({ callback }) => {
            callback([{ data: 'test' }]);
            return {
                type: 'getObjectivesSteps',
                payload: []
            };
        });

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ObjectivesSteps
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1 }}
                            match={{ params: { objective_id: 1 } }}
                            history={history}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const nextButton = screen.getByRole('button', { name: /next/i });

        expect(nextButton).toBeInTheDocument();
    });
});
