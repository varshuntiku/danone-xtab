import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DesignModules from '../../../components/DesignWidget/DesignModules.jsx';
import { getDesignModulesData } from '../../../services/admin';
import { vi } from 'vitest';

vi.mock('../../../services/admin', () => ({
    getDesignModulesData: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DesignModules Component', () => {
        getDesignModulesData.mockImplementation(({ callback }) =>
            callback({
                data: {
                    business_opportunity: 'test business_opportunity',
                    analytics_problem: 'test analytics_problem',
                    analytics_outcome: 'test analytics_outcome',
                    business_outcome: 'test business_outcome'
                }
            })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignModules {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('test business_opportunity')).toBeInTheDocument();
        fireEvent.click(screen.getByText('test business_opportunity'));
        fireEvent.click(screen.getByText('test analytics_problem'));
        fireEvent.click(screen.getByText('test analytics_outcome'));
        fireEvent.click(screen.getByText('test business_outcome'));
    });

    test('Should render layouts DesignModules Component 2', () => {
        const props = {
            ...Props,
            hasEditAccess: false
        };
        getDesignModulesData.mockImplementation(({ callback }) => callback({ data: {} }));
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignModules {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByText('Business Opportunity'));
    });
});

const Props = {
    classes: {},
    project_id: 1,
    hasEditAccess: true
};
