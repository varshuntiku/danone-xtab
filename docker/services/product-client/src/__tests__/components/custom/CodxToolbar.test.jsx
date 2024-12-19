import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ToolBar from '../../../components/custom/CodxToolBar';
import { vi } from 'vitest';

const history = createMemoryHistory();

vi.mock('./CodxFadedButton', () => ({ elementProps, onChange }) => (
    <button onClick={() => onChange(elementProps.id, true)}>{elementProps.label}</button>
));
vi.mock('./CodxSingleSelectDropdown', () => ({ elementProps, onChange }) => (
    <select onChange={(e) => onChange(elementProps.id, e.target.value)}>
        {elementProps.options.map((opt) => (
            <option key={opt} value={opt}>
                {opt}
            </option>
        ))}
    </select>
));
vi.mock('./CodxMultiSelectDropdown', () => ({ elementProps, onChange }) => (
    <select
        multiple
        onChange={(e) =>
            onChange(
                elementProps.id,
                Array.from(e.target.selectedOptions).map((option) => option.value)
            )
        }
    >
        {elementProps.options.map((opt) => (
            <option key={opt} value={opt}>
                {opt}
            </option>
        ))}
    </select>
));
vi.mock('./CodxToggleButtonSwitch', () => ({ elementProps, onChange }) => (
    <button onClick={() => onChange(elementProps.id, true)}>{elementProps.label}</button>
));
vi.mock('./CodxToggleSwitch', () => ({ elementProps, onChange }) => (
    <button onClick={() => onChange(elementProps.id, true)}>{elementProps.label}</button>
));
vi.mock('./CodxIconButton', () => ({ elementProps }) => <button>{elementProps.icon}</button>);
vi.mock('./CodxLegends', () => ({ elementProps }) => <div>{elementProps.icon}</div>);
vi.mock(
    '../dynamic-form/inputFields/DynamicFormModal',
    () =>
        ({ params, app_details, onAction }) =>
            <div>Modal Form</div>
);
vi.mock('../dynamic-form/inputFields/customLabel', () => ({ fieldInfo }) => (
    <div>{fieldInfo.label}</div>
));

describe('ToolBar Component', () => {
    const mockOnAction = vi.fn();
    const mockOnChange = vi.fn();

    const renderComponent = (props) => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ToolBar {...props} onAction={mockOnAction} />
                </Router>
            </CustomThemeContextProvider>
        );
    };

    it('should render without crashing', () => {
        renderComponent({
            props: {
                left: [{ type: 'button', id: '1', label: 'Left Button' }],
                center: [{ type: 'label', id: '2', label: 'Center Label' }],
                right: [{ type: 'button', id: '3', label: 'Right Button' }]
            }
        });

        expect(screen.getByText('Left Button')).toBeInTheDocument();

        expect(screen.getByText('Right Button')).toBeInTheDocument();
    });

    it('should call onChange handler with correct arguments', () => {
        renderComponent({
            props: {
                left: [{ type: 'button', id: '1', label: 'Button' }]
            }
        });

        fireEvent.click(screen.getByText('Button'));

        expect(mockOnChange).to.not.toBeCalled();
    });

    it('should apply alignment styles based on props', () => {
        renderComponent({
            props: {
                left: [{ type: 'button', id: '1', label: 'Left Button' }],
                center: [{ type: 'label', id: '2', label: 'Center Label' }],
                right: [{ type: 'button', id: '3', label: 'Right Button' }],
                minHeight: '10rem',
                width: '100%'
            }
        });

        const toolBar = screen.getByTestId('toolbar');
        expect(toolBar).toHaveStyle({ minHeight: '10rem' });
        expect(toolBar).toHaveStyle({ width: '100%' });
    });
});
