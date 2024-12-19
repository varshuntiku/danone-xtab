import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { expect } from 'vitest';
import { Provider } from 'react-redux';
import store from 'store/store';
import InsightStatus from '../../components/InsightStatus';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

describe('InsightStatus Component', () => {
    const theme = createTheme();
    const history = createMemoryHistory();

    const renderWithTheme = (ui) => {
        return render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ThemeProvider theme={theme}>
                        <Router history={history}>{ui}</Router>
                    </ThemeProvider>
                </CustomThemeContextProvider>
            </Provider>
        );
    };

    it('should render the component with default data', () => {
        renderWithTheme(<InsightStatus data={{}} />);

        expect(screen.getByText('Status:')).toBeInTheDocument();

        expect(screen.getByText('Updated On:')).toBeInTheDocument();

        expect(screen.getByText('Updated By:')).toBeInTheDocument();
    });

    it('should display approved status with correct styling', () => {
        renderWithTheme(
            <InsightStatus
                data={{ status: 'Approved', updated_on: '2023-08-12', updated_by: 'Admin' }}
            />
        );

        expect(screen.getByText('Status:')).toBeInTheDocument();

        expect(screen.getByText('Approved')).toBeInTheDocument();

        const statusElement = screen.getByText('Approved');
        expect(statusElement).toHaveClass(
            ' MuiTypography-root-43 makeStyles-approved-41 MuiTypography-h4-51'
        );

        expect(screen.getByText('2023-08-12')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('should display pending status with correct styling', () => {
        renderWithTheme(
            <InsightStatus
                data={{ status: 'Pending', updated_on: '2023-08-11', updated_by: 'Editor' }}
            />
        );

        expect(screen.getByText('Status:')).toBeInTheDocument();

        expect(screen.getByText('Pending')).toBeInTheDocument();

        const statusElement = screen.getByText('Pending');
        expect(statusElement).toHaveClass(
            'MuiTypography-root-79 makeStyles-pending-78 MuiTypography-h4-87'
        );

        expect(screen.getByText('2023-08-11')).toBeInTheDocument();
        expect(screen.getByText('Editor')).toBeInTheDocument();
    });

    it('should handle case-insensitive status', () => {
        renderWithTheme(
            <InsightStatus
                data={{ status: 'PuBlIsHeD', updated_on: '2023-08-10', updated_by: 'Reviewer' }}
            />
        );

        expect(screen.getByText('PuBlIsHeD')).toBeInTheDocument();

        const statusElement = screen.getByText('PuBlIsHeD');
        expect(statusElement).toHaveClass(
            ' MuiTypography-root-115 makeStyles-approved-113 MuiTypography-h4-123'
        );
    });
});
