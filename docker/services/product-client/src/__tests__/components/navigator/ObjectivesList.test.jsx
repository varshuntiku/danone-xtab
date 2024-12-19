import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ObjectivesList from '../../../components/navigator/ObjectivesList';
import { Provider } from 'react-redux';
import { getObjectives } from 'store/index';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('store/index', () => ({
    getObjectives: vi.fn()
}));

vi.mock('store/store', () => ({
    store: vi.fn()
}));

const store = configureStore({
    reducer: createSlice({
        name: 'navigator',
        initialState: {
            navigator: {
                objectives: [
                    {
                        group_name: 'testGroup',
                        description: 'test description',
                        objectives_list: [{ objective_name: 'testObjName', objective_id: 1 }]
                    }
                ]
            },
            matomo: {
                pv_id: 1
            }
        },
        reducers: {
            getObjectives: (state, action) => {
                state.objectives = action.payload.data;
            }
        }
    }).reducer
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts ObjectivesDashboard Component', async () => {
        getObjectives.mockImplementation(() => {
            return {
                type: 'getObjectives',
                payload: {
                    data: [
                        {
                            group_name: 'testGroup',
                            description: 'test description',
                            objectives_list: [{ objective_name: 'testObjName', objective_id: 1 }]
                        }
                    ]
                }
            };
        });

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ObjectivesList screen_id={1} app_id={1} params={{}} app_info={{ id: 1 }} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Back to Application Details'));
    });

    test('Should render layouts ObjectivesDashboard Component with Conditions', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ObjectivesList {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText('testObjName'));
        fireEvent.click(screen.getByText('Exit'));
    });

    test('Should render layouts ObjectivesDashboard Component with Conditions', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ObjectivesList {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText('testObjName'));
        fireEvent.click(screen.getByText('More Info'));
    });

    const props = {
        screen_id: 1,
        app_id: 6,
        params: {},
        app_info: { id: 1 },
        history: history
        // objectives: [{ group_name: "testGroup", description: "test description", objectives_list: [{ objective_name: "testObjName" ,objective_id: 1}] }],
    };
});
