import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import { expect, vi } from 'vitest';
import LayoutView from '../../../components/CustomLayout/LayoutView';
import { LayoutContext } from '../../../../src/context/LayoutContext';
const history = createMemoryHistory();

describe('LayoutView Component', () => {
    it('renders LayoutView with default props', () => {
        const widthPattern = [];
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <LayoutContext.Provider value={{ widthPattern }}>
                        <Router history={history}>
                            <LayoutView
                                kpiCount={3}
                                rows={2}
                                orientation="Horizontal"
                                addWidget={[]}
                                setAddWidget={() => {}}
                            />
                        </Router>
                    </LayoutContext.Provider>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Layout View')).toBeInTheDocument();
    });
});
