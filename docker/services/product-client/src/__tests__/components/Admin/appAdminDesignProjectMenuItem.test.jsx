import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DesignProjectMenuItem from '../../../components/Admin/DesignProjectMenuItem';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render DesignProjectMenuItem component with given props', () => {
        const mockParams = {
            name: 'Project X',
            created_by: 'John Doe',
            updated_at: '2024-08-08'
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignProjectMenuItem params={mockParams} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('Project X')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('2024-08-08')).toBeInTheDocument();
    });

    test('Should render DesignProjectMenuItem component with default props', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignProjectMenuItem params={{}} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.queryByText(/Project X/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/2024-08-08/i)).not.toBeInTheDocument();
    });
});
