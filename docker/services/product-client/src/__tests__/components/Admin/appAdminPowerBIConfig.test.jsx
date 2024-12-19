import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import AppAdminPowerBIConfig from '../../../components/Admin/AppAdminPowerBIConfig';
import { Provider } from 'react-redux';
import store from 'store/store';
import {
    getWorkspaces,
    getReports,
    getReportPages,
    getReportPageVisuals
} from '../../../services/powerbi_apis';

const history = createMemoryHistory();

vi.mock('../../../services/powerbi_apis.js', () => ({
    getWorkspaces: vi.fn(),
    getReports: vi.fn(),
    getReportPages: vi.fn(),
    getReportPageVisuals: vi.fn()
}));

describe('AppAdminPowerBIConfig', () => {
    const mockOnHandleFieldChange = vi.fn();
    const defaultProps = {
        widget_info: {
            config: {
                powerbi_config: {
                    workspaceId: '',
                    reportId: '',
                    pageName: '',
                    visualName: ''
                }
            }
        },
        onHandleFieldChange: mockOnHandleFieldChange,
        classes: {
            powerBIConfigBody: 'powerBIConfigBody',
            renderOverviewFormRoot: 'renderOverviewFormRoot',
            powerBIConfigFormWrapper: 'powerBIConfigFormWrapper',
            widgetConfigFormControl2: 'widgetConfigFormControl2',
            widgetConfigSelect: 'widgetConfigSelect',
            widgetConfigCheckboxLabel: 'widgetConfigCheckboxLabel',
            widgetConfigIcon: 'widgetConfigIcon',
            widgetConfigInput: 'widgetConfigInput',
            menu: 'menu',
            input: 'input',
            formControl: 'formControl',
            f1: 'f1',
            defaultColor: 'defaultColor'
        },
        editDisabled: false,
        editMode: true
    };

    it('renders without crashing', () => {
        const { container } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminPowerBIConfig {...defaultProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const heading = container.querySelector('h3');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent(
            'The below configuration options will be based on your access to PowerBI workspaces and reports.'
        );
    });

    it('calls getWorkspaces on mount', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminPowerBIConfig {...defaultProps} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(getWorkspaces).toHaveBeenCalled();
    });

    it('loads workspaces and displays them in the select dropdown', async () => {
        const mockWorkspaces = [{ id: '1', name: 'Workspace 1' }];
        getWorkspaces.mockImplementation(({ callback }) => callback(mockWorkspaces));

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminPowerBIConfig {...defaultProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByTestId('powerbi-workspace-select')).toBeInTheDocument;
    });

    it('loads reports when workspace is selected', async () => {
        const mockWorkspaces = [{ id: '1', name: 'Workspace 1' }];
        const mockReports = [{ id: '1', name: 'Report 1' }];
        getWorkspaces.mockImplementation(({ callback }) => callback(mockWorkspaces));
        getReports.mockImplementation(({ callback }) => callback(mockReports));

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminPowerBIConfig {...defaultProps} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByLabelText(/PowerBI Workspace/i)).toBeInTheDocument();
    });

    it('displays loader while data is loading', async () => {
        getWorkspaces.mockImplementation(({ callback }) => setTimeout(() => callback([]), 1000));

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminPowerBIConfig {...defaultProps} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    it('displays AppWidgetPowerBI when previewReport is true', async () => {
        const mockWorkspaces = [{ id: '1', name: 'Workspace 1' }];
        const mockReports = [{ id: '1', name: 'Report 1' }];
        const mockPages = [{ name: 'Page 1', displayName: 'Page 1' }];
        const mockVisuals = [{ name: 'Visual 1', title: 'Visual 1' }];

        getWorkspaces.mockImplementation(({ callback }) => callback(mockWorkspaces));
        getReports.mockImplementation(({ callback }) => callback(mockReports));
        getReportPages.mockImplementation(({ callback }) => callback(mockPages));
        getReportPageVisuals.mockImplementation(({ callback }) => callback(mockVisuals));

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminPowerBIConfig {...defaultProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByTestId('powerbi-workspace-select')).toBeInTheDocument();
        expect(screen.getByTestId('powerbi-report-select')).toBeInTheDocument();
        expect(screen.getByTestId('powerbi-report-page-select')).toBeInTheDocument();
        expect(screen.getByTestId('powerbi-report-visual-select')).toBeInTheDocument();
    });
    it('populates report options when reports are available', () => {
        const mockProps = {
            ...defaultProps,
            widget_info: {
                config: {
                    powerbi_config: {
                        workspaceId: 'workspace-id'
                    }
                }
            }
        };

        const { getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminPowerBIConfig {...mockProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const reports = [{ id: 'report-id', name: 'Report 1' }];
        mockProps.state = { reports };

        expect(getByTestId('powerbi-workspace-select')).toBeInTheDocument();
    });
    it('populates report page options when report pages are available', () => {
        const mockProps = {
            ...defaultProps,
            widget_info: {
                config: {
                    powerbi_config: {
                        workspaceId: 'workspace-id',
                        reportId: 'report-id'
                    }
                }
            }
        };

        const { getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminPowerBIConfig {...mockProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const reportPages = [{ name: 'page-id', displayName: 'Page 1' }];
        mockProps.state = { reportPages };

        expect(getByTestId('powerbi-report-select')).toBeInTheDocument;
    });
});
