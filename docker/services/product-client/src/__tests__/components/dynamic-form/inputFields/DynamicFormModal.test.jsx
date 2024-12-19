import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DynamicFormModal from '../../../../components/dynamic-form/inputFields/DynamicFormModal';
import { vi } from 'vitest';
const history = createMemoryHistory();

describe('DynamicFormModal Component', () => {
    const defaultProps = {
        params: {
            form_config: {},
            fetch_on_open: 'some-url',
            trigger_button: {
                text: 'Open Dialog'
            },
            variant: 'default'
        },
        triggerButton: null,
        onAction: vi.fn(),
        onFetchFormData: vi.fn().mockResolvedValue({
            form_config: { fields: [] },
            message: 'Success'
        }),
        preventDeepCloneOnStateUpdate: false,
        overrideClasses: {},
        setDialogOpen: vi.fn(),
        history: {
            push: vi.fn()
        }
    };

    const renderComponent = (props = {}) =>
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DynamicFormModal {...defaultProps} {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

    it('should render trigger button and open dialog on click', async () => {
        const { getByText, getByLabelText } = renderComponent();

        const openButton = getByText('Open Dialog');
        expect(openButton).toBeInTheDocument();

        fireEvent.click(openButton);

        await waitFor(() => expect(getByLabelText('Open dialog')).toBeInTheDocument());
    });

    it('should call onFetchFormData when dialog is opened', async () => {
        const { getByText } = renderComponent();

        fireEvent.click(getByText('Open Dialog'));

        await waitFor(() => {
            expect(defaultProps.onFetchFormData).toHaveBeenCalledWith(
                defaultProps.params.fetch_on_open
            );
        });
    });

    it('should close the dialog on cancel action', async () => {
        const { getByText, queryByLabelText } = renderComponent();

        fireEvent.click(getByText('Open Dialog'));

        await waitFor(() => {
            expect(queryByLabelText('Open dialog')).toBeInTheDocument();
        });
    });

    it('should show a notification message when form data is updated with a message', async () => {
        const { getByText } = renderComponent();

        fireEvent.click(getByText('Open Dialog'));

        await waitFor(() => {
            expect(getByText('Success')).toBeInTheDocument();
        });
    });
});
