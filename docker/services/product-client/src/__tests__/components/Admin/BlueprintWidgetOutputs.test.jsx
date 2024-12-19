import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { expect, vi } from 'vitest';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import store from 'store/store';
import BlueprintWidgetOutputs from '../../../components/Admin/BlueprintWidgetOutputs';
import {
    getBlueprintWidgetOutputs,
    getBlueprintWidgetOutput
} from '../../../services/admin_execution.js';

const history = createMemoryHistory();
vi.mock('../../../services/admin_execution.js', () => ({
    getBlueprintWidgetOutputs: vi.fn(),
    getBlueprintWidgetOutput: vi.fn()
}));

const mockCloseOutputs = vi.fn();

const defaultProps = {
    classes: {},
    notebook_id: '1',
    iteration_id: '1',
    widget_id: '1',
    parent_obj: {
        closeOutputs: mockCloseOutputs
    }
};

describe('BlueprintWidgetOutputs', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly and displays the dialog', () => {
        render(
            <Provider store={store}>
                <BlueprintWidgetOutputs {...defaultProps} />
            </Provider>
        );
        expect(screen.getByText('Widget Outputs')).toBeInTheDocument();
        expect(screen.getByTitle('Close')).toBeInTheDocument();
    });

    it('calls getBlueprintWidgetOutputs on mount', async () => {
        const mockResponse = { list: ['output/1.csv', 'output/2.json'] };
        getBlueprintWidgetOutputs.mockImplementation(({ callback }) => callback(mockResponse));

        render(
            <Provider store={store}>
                <BlueprintWidgetOutputs {...defaultProps} />
            </Provider>
        );

        await waitFor(() => {
            expect(getBlueprintWidgetOutputs).toHaveBeenCalledWith({
                notebook_id: '1',
                iteration_id: '1',
                widget_id: '1',
                callback: expect.any(Function)
            });
        });
    });

    it('handles tab changes and updates output', async () => {
        const mockOutputResponse = { output: { data: [], layout: {} } };
        getBlueprintWidgetOutput.mockImplementation(({ callback }) => callback(mockOutputResponse));

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BlueprintWidgetOutputs {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText('1'));

        await waitFor(() => {
            expect(getBlueprintWidgetOutput).toHaveBeenCalledWith({
                notebook_id: '1',
                iteration_id: '1',
                widget_id: '1',
                payload: {
                    output_blobpath: 'output/1.csv'
                },
                callback: expect.any(Function)
            });
        });
    });

    it('calls closeOutputs when the close button is clicked', () => {
        render(
            <Provider store={store}>
                <BlueprintWidgetOutputs {...defaultProps} />
            </Provider>
        );
        fireEvent.click(screen.getByTitle('Close'));
        expect(mockCloseOutputs).toHaveBeenCalled();
    });

    it('displays loading indicator when data is loading', async () => {
        getBlueprintWidgetOutputs.mockImplementation(({ callback }) =>
            callback({ list: ['output/1.csv'] })
        );
        getBlueprintWidgetOutput.mockImplementation(({ callback }) =>
            setTimeout(() => callback({ output: {} }), 1000)
        );

        render(
            <Provider store={store}>
                <BlueprintWidgetOutputs {...defaultProps} />
            </Provider>
        );

        fireEvent.click(screen.getByText('1'));

        await waitFor(() => {
            expect(screen.getByRole('progressbar')).toBeInTheDocument();
        });
    });

    it('renders output correctly based on file type', async () => {
        const mockResponse = {
            list: ['output/1.csv']
        };
        getBlueprintWidgetOutputs.mockImplementation(({ callback }) => callback(mockResponse));

        const mockOutputResponse = {
            output: {
                data: [{ key: 'value' }],
                layout: {}
            }
        };
        getBlueprintWidgetOutput.mockImplementation(({ callback }) => callback(mockOutputResponse));

        render(
            <Provider store={store}>
                <BlueprintWidgetOutputs {...defaultProps} />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument();
        });
    });
});
