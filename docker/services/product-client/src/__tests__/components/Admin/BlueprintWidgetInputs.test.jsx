import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import store from 'store/store';
import BlueprintWidgetInputs from '../../../components/Admin/BlueprintWidgetInputs';
import {
    getBlueprintWidgetInputs,
    getBlueprintWidgetOutput
} from '../../../services/admin_execution.js';

vi.mock('../../../services/admin_execution.js', () => ({
    getBlueprintWidgetInputs: vi
        .fn()
        .mockImplementation(({ callback }) =>
            callback({ list: [{ widget_id: 1, output: 'output-path' }] })
        ),
    getBlueprintWidgetOutput: vi
        .fn()
        .mockImplementation(({ callback }) => callback({ output: { data: [], layout: {} } }))
}));
vi.mock('../../../components/AppWidgetTable.jsx', () => ({
    default: () => <div>Table</div>
}));

vi.mock('../../../components/AppWidgetPlot.jsx', () => ({
    default: () => <div>Plot</div>
}));

const mockProps = {
    classes: {
        paper: 'paper-class',
        title: 'title-class',
        heading: 'heading-class',
        actionIcon: 'actionIcon-class',
        widgetOutputBody: 'widgetOutputBody-class'
    },
    input_widgets: [{ id: 1, name: 'Test Widget' }],
    notebook_id: 1,
    iteration_id: 2,
    parent_obj: {
        closeInputs: vi.fn()
    }
};

describe('BlueprintWidgetInputs', () => {
    it('renders Dialog with correct properties', () => {
        render(<BlueprintWidgetInputs {...mockProps} />);
        expect(screen.getByRole('dialog')).toHaveAttribute(
            'aria-labelledby',
            'blueprint-widget-inputs-title'
        );
        expect(screen.getByRole('dialog')).toHaveAttribute(
            'aria-describedby',
            'blueprint-widget-inputs-content'
        );
        expect(screen.getByText('Widget Inputs')).toBeInTheDocument();
    });
    it('calls closeInputs function when close button is clicked', () => {
        render(<BlueprintWidgetInputs {...mockProps} />);
        fireEvent.click(screen.getByTitle('Close'));
        expect(mockProps.parent_obj.closeInputs).toHaveBeenCalled();
    });
    it('fetches inputs on mount', () => {
        render(<BlueprintWidgetInputs {...mockProps} />);
        expect(getBlueprintWidgetInputs).toHaveBeenCalled();
    });
    it('calls closeInputs method when close button is clicked', () => {
        render(<BlueprintWidgetInputs {...mockProps} />);

        fireEvent.click(screen.getByTitle('Close'));

        expect(mockProps.parent_obj.closeInputs).toHaveBeenCalled();
    });
    it('handles empty output_list', () => {
        render(<BlueprintWidgetInputs {...mockProps} />);
        const instance = screen.getByText('Widget Inputs').closest('div').instance;

        expect(screen.queryByText('Table')).toBeNull();
        expect(screen.queryByText('Plot')).toBeNull();
    });
    it('updates state with input data on receiving inputs', async () => {
        render(<BlueprintWidgetInputs {...mockProps} />);

        await waitFor(() => {
            expect(getBlueprintWidgetInputs).toHaveBeenCalled();
            expect(screen.getByText('Test Widget - path')).toBeInTheDocument();
        });
    });
});
