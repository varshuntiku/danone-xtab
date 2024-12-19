import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import PlatformDashboard from '../../components/PlatformDashboard';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';

const history = createMemoryHistory();

const store = configureStore({
    reducer: createSlice({
        name: 'industry',
        initialState: {
            industryData: {
                list: [
                    {
                        id: 1,
                        industry_name: 'Test1',
                        parent_industry_id: null,
                        logo_name: 'Retail',
                        horizon: 'vertical',
                        order: 1,
                        level: null,
                        color: null,
                        description: null,
                        parent_industry_name: null
                    }
                ]
            }
        }
    }).reducer
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render PlatformDashboard Component', () => {
        const props = {
            classes: {},
            history: history,
            location: {
                hash: '',
                key: 'h9jxzb',
                pathname: '/dashboard',
                search: ''
            },
            isExact: true,
            params: {},
            path: '/dashboard',
            url: '/dashboard'
        };

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PlatformDashboard {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Test1')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Test1'));
    });
});
