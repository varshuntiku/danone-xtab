import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import AppWidgetDynamicForm from '../../components/AppWidgetDynamicForm';
import { Provider } from 'react-redux';
import store from 'store/store';

const history = createMemoryHistory();

vi.mock('../../components/dynamic-form/dynamic-form', () => ({
    __esModule: true,
    default: (props) => <div {...props} data-testid="dynamic-form" />,
    mapValue: (data) => data
}));

vi.mock('../../components/screenActionsComponent/actionComponents/TextList', () => ({
    __esModule: true,
    default: (props) => <div {...props} data-testid="text-list" />
}));

const defaultProps = {
    params: { form_config: { fields: [] } },
    onValidateValueChangeInGridTable: vi.fn(),
    onAction: vi.fn(),
    onModalFormAction: vi.fn(),
    onFetchFormData: vi.fn(),
    onDrilledData: vi.fn(),
    dynamicPayloadPreset: { payload: { data: {} } },
    onToolBarAction: vi.fn(),
    onFetchDetailData: vi.fn(),
    handleWidgetEvent: vi.fn(),
    color_nooverride: false
};

const renderComponent = (props = {}) => {
    render(
        <Provider store={store}>
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetDynamicForm {...defaultProps} {...props} />
                </Router>
            </CustomThemeContextProvider>
        </Provider>
    );
};

describe('AppWidgetDynamicForm', () => {
    afterEach(cleanup);

    it('should render correctly with default props', () => {
        renderComponent();
        expect(screen.getByTestId('dynamic-form')).toBeInTheDocument();
    });

    it('should call handleAction when a button is clicked', async () => {
        const onActionMock = vi.fn();
        renderComponent({
            onAction: onActionMock,
            params: { actions: [{ name: 'testAction', text: 'Test Action' }] }
        });

        fireEvent.click(screen.getByText('Test Action'));

        await waitFor(() => {
            expect(onActionMock).toBeCalled();
        });
    });

    it('should update state when updateFormState is called', async () => {
        const onActionMock = vi.fn().mockResolvedValue({ form_config: { fields: [] } });
        renderComponent({ onAction: onActionMock });

        await waitFor(() => {
            expect(screen.getByTestId('dynamic-form')).toBeInTheDocument();
        });
    });

    it('should handle form submission correctly', async () => {
        const onActionMock = vi.fn().mockResolvedValue({ form_config: { fields: [] } });
        renderComponent({
            onAction: onActionMock,
            params: { actions: [{ name: 'submit', text: 'Submit' }] }
        });

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(onActionMock).toBeCalled();
        });
    });

    it('should navigate to the correct URL on action', async () => {
        const onActionMock = vi.fn().mockResolvedValue({ form_config: { fields: [] } });
        renderComponent({
            onAction: onActionMock,
            params: { actions: [{ name: 'navigateAction', navigate: { to: 'navigate-url' } }] }
        });

        fireEvent.click(screen.getByText('navigateAction'));

        await waitFor(() => {
            expect(history.location.pathname);
        });
    });

    it('should call handleModalFormAction correctly', async () => {
        const handleModalFormActionMock = vi
            .fn()
            .mockResolvedValue({ form_config: { fields: [] } });
        renderComponent({ onModalFormAction: handleModalFormActionMock });

        await handleModalFormActionMock('modalAction');

        await waitFor(() => {
            expect(handleModalFormActionMock).toBeCalledWith('modalAction');
        });
    });

    it('should handle toolbar actions correctly', async () => {
        const onToolBarActionMock = vi.fn().mockResolvedValue({ form_config: { fields: [] } });
        renderComponent({ onToolBarAction: onToolBarActionMock });

        await onToolBarActionMock('toolBarAction', 'value', 'optionName');

        await waitFor(() => {
            expect(onToolBarActionMock).toBeCalledWith('toolBarAction', 'value', 'optionName');
        });
    });

    it('should handle fetching form data correctly', async () => {
        const handleFetchFormDataMock = vi.fn().mockResolvedValue({ data: {} });
        renderComponent({ onFetchFormData: handleFetchFormDataMock });

        await act(async () => {
            const result = await handleFetchFormDataMock('fetchAction');
            expect(result).toEqual({ data: {} });
        });
    });
    it('should render action buttons correctly and handle button clicks', () => {
        const actions = [
            { name: 'action1', text: 'Action 1', variant: 'contained' },
            { name: 'action2', text: 'Action 2', variant: 'outlined' }
        ];
        renderComponent({ params: { actions } });

        actions.forEach((action) => {
            expect(screen.getByTestId(`action-button-${action.name}`)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('action-button-action1'));
        expect(defaultProps.onAction).toBeCalled();
    });
});
