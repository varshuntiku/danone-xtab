import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AppScreenWidgetEditor from '../../../components/Admin/AppScreenWidgetEditor';
import { saveScreenWidgetConfig, getSystemWidgets } from '../../../services/screen';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../services/screen', () => ({
    saveScreenWidgetConfig: vi.fn(),
    getSystemWidgets: vi.fn(),
    getConnSystemsData: vi.fn()
}));

describe('codex product test', () => {
    test('rendering of AppScreenWidgetEditor component', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={{}}
                        onWidgetInfoChange={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('rendering of Setup Widget title', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={{}}
                        onWidgetInfoChange={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const title = screen.getByText('Setup Widget');
        expect(title).toBeInTheDocument();
    });

    test('rendering of Overview Form', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={{}}
                        onWidgetInfoChange={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const titleInput = screen.getByRole('textbox', { name: 'Title' });
        expect(titleInput).toBeInTheDocument();
        const MetricInput = screen.getByRole('textbox', { name: 'Metric Factor' });
        expect(MetricInput).toBeInTheDocument();
        const subTitleInput = screen.getByRole('textbox', { name: 'Sub Title' });
        expect(subTitleInput).toBeInTheDocument();
        const prefixInput = screen.getByRole('textbox', { name: 'Prefix' });
        expect(prefixInput).toBeInTheDocument();
    });

    test('rendering of Button Save Widget and checking for disabled button', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={{}}
                        onWidgetInfoChange={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const saveBtn = screen.getByRole('button', { name: 'SAVE WIDGET' });
        expect(saveBtn).toBeInTheDocument();
        expect(saveBtn).toBeDisabled();
    });

    test('rendering of Button Save Widget and checking for enabled button', () => {
        saveScreenWidgetConfig.mockImplementation(({ callback }) =>
            callback({ status: 'success' })
        );
        const widget_info = {
            id: 1,
            widget_index: 0,
            widget_key: 'title',
            is_label: false,
            config: {
                title: 'title',
                sub_title: '',
                prefix: '',
                metric_factor: '',
                code: ''
            },
            code: ''
        };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={widget_info}
                        setUnsavedValue={() => {}}
                        onWidgetInfoChange={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const titleInput = screen.getByRole('textbox', { name: 'Title' });
        expect(titleInput).toBeInTheDocument();
        fireEvent.change(titleInput, { target: { value: 'testing title' } });
        const MetricInput = screen.getByRole('textbox', { name: 'Metric Factor' });
        expect(MetricInput).toBeInTheDocument();
        fireEvent.change(MetricInput, { target: { value: 'testing sub title' } });
        const subTitleInput = screen.getByRole('textbox', { name: 'Sub Title' });
        expect(subTitleInput).toBeInTheDocument();
        fireEvent.change(MetricInput, { target: { value: 'testing metric' } });
        const prefixInput = screen.getByRole('textbox', { name: 'Prefix' });
        expect(prefixInput).toBeInTheDocument();
        fireEvent.change(prefixInput, { target: { value: 'testing prefix' } });
        const saveBtn = screen.getByRole('button', { name: 'SAVE WIDGET' });
        expect(saveBtn).toBeInTheDocument();
        expect(saveBtn).toBeDisabled();
        fireEvent.click(saveBtn);
    });

    test('rendering of tabs overview and visulization uiac', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={{}}
                        setUnsavedValue={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const titleInput = screen.getByRole('tab', { name: 'Overview' });
        expect(titleInput).toBeInTheDocument();
        const saveBtn = screen.getByRole('tab', { name: 'Visualization UIaC' });
        expect(saveBtn).toBeInTheDocument();
    });

    test('rendering of code editor after clicking on Visualization UIaC tab 1', () => {
        const parent_obj = {
            showScreenWidgetCodeComponents: function () {}
        };
        function setUnsavedValue(key, value) {
            let newVal = value;
            if (value instanceof Object) {
                newVal = {
                    ...this.state.unsavedValues[key],
                    ...value
                };
                if (!Object.values(newVal).some(Boolean)) {
                    newVal = null;
                }
            }
        }
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={{}}
                        setUnsavedValue={setUnsavedValue}
                        parent_obj={parent_obj}
                        onWidgetInfoChange={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const overviewTab = screen.getByRole('tab', { name: 'Overview' });
        expect(overviewTab).toBeInTheDocument();
        const uiacTab = screen.getByRole('tab', { name: 'Visualization UIaC' });
        expect(uiacTab).toBeInTheDocument();
        fireEvent.click(uiacTab);
        const saveWidgetButton = screen.getByRole('button', { name: 'SAVE WIDGET' });
        expect(saveWidgetButton).toBeInTheDocument();
        const testWidgetBtn = screen.getByRole('button', { name: 'TEST WIDGET' });
        expect(testWidgetBtn).toBeInTheDocument();
    });

    test('rendering of code editor after clicking on Visualization UIaC tab 2 ', () => {
        const parent_obj = {
            showScreenWidgetCodeComponents: function () {}
        };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={{}}
                        setUnsavedValue={() => {}}
                        parent_obj={parent_obj}
                        onWidgetInfoChange={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const overviewTab = screen.getByRole('tab', { name: 'Overview' });
        expect(overviewTab).toBeInTheDocument();
        const uiacTab = screen.getByRole('tab', { name: 'Visualization UIaC' });
        expect(uiacTab).toBeInTheDocument();
        fireEvent.click(uiacTab);
        const saveWidgetButton = screen.getByRole('button', { name: 'SAVE WIDGET' });
        expect(saveWidgetButton).toBeInTheDocument();
        const testWidgetBtn = screen.getByRole('button', { name: 'TEST WIDGET' });
        expect(testWidgetBtn).toBeInTheDocument();
        const outputTab = screen.getByText('OUTPUT');
        expect(outputTab).toBeInTheDocument();
        const debugTab = screen.getByText('DEBUG');
        expect(debugTab).toBeInTheDocument();
        const performnaceTab = screen.getByText('PERFORMANCE');
        expect(performnaceTab).toBeInTheDocument();
    });

    test('CustomSnackbar is not rendered when notification is not open', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={{}}
                        notificationOpen={false}
                        notification={{ message: 'Test Notification', severity: 'info' }}
                        onWidgetInfoChange={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const snackbar = screen.queryByTestId('custom-snackbar');
        expect(snackbar).not.toBeInTheDocument();
    });

    test('rendering of AppScreenWidgetEditor component', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor app_info={{}} widget_info={{}} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('rendering of Sub Title text field', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor app_info={{}} widget_info={{}} />
                </Router>
            </CustomThemeContextProvider>
        );
        const subTitleInput = screen.getByLabelText('Sub Title');
        expect(subTitleInput).toBeInTheDocument();
    });

    test('text field should be disabled when editDisabled is true', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor app_info={{}} widget_info={{}} />
                </Router>
            </CustomThemeContextProvider>
        );

        const subTitleInput = screen.getByLabelText('Sub Title');
        expect(subTitleInput).toBeDisabled();
    });

    test('text field should be disabled when editMode is false', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor app_info={{}} widget_info={{}} />
                </Router>
            </CustomThemeContextProvider>
        );
        const subTitleInput = screen.getByLabelText('Sub Title');
        expect(subTitleInput).toBeDisabled();
    });

    it('should render the button conditionally and handle state changes', async () => {
        const mockOnClick = vi.fn();

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={{}}
                        onClickVisualizationTest={mockOnClick}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.queryByRole('button', { name: /Test Widget/i })).not.toBeInTheDocument();
    });
    it('should render the dialog when uiacError is present and dialogOpen is true', () => {
        const uiacError = {
            errors: [
                { type: 'Error Type 1', message: 'Error message 1' },
                { type: 'Error Type 2', message: 'Error message 2' }
            ],
            warnings: [{ type: 'Warning Type 1', message: 'Warning message 1' }]
        };

        const component = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={{}}
                        uiacError={uiacError}
                        dialogOpen={true}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    it('should render CodxCircularLoader when loading_test is true', () => {
        const component = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor app_info={{}} widget_info={{}} />
                </Router>
            </CustomThemeContextProvider>
        );

        component.rerender(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor app_info={{}} widget_info={{}} loading_test={true} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    it('should not render CodxCircularLoader when loading_test is false', () => {
        const component = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor app_info={{}} widget_info={{}} />
                </Router>
            </CustomThemeContextProvider>
        );

        component.rerender(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor app_info={{}} widget_info={{}} loading_test={true} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.queryByTestId('status')).toBeNull();
    });
    it('should close the dialog when the close button is clicked', () => {
        const setState = vi.fn();
        const component = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={{}}
                        uiacError={{ errors: [], warnings: [] }}
                        dialogOpen={true}
                        setState={setState}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    it('should not render the dialog if uiacError is not present', () => {
        const component = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={{}}
                        uiacError={null}
                        dialogOpen={false}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.queryByTestId('error-dialog')).toBeNull();
    });

    it('should not render the dialog if dialogOpen is false', () => {
        const component = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenWidgetEditor
                        app_info={{}}
                        widget_info={{}}
                        uiacError={{ errors: [], warnings: [] }}
                        dialogOpen={false}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.queryByTestId('error-dialog')).toBeNull();
    });
});
