import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ToggleButtonSwitch from '../../../components/custom/CodxToggleButtonSwitch';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('@material-ui/core', async () => {
    const actual = await vi.importActual('@material-ui/core');
    return {
        ...actual,
        makeStyles: () => () => ({
            toolBarText: {},
            toggleButton: {}
        }),
        alpha: (color, opacity) => color
    };
});

describe('ToggleButtonSwitch Component', () => {
    it('should render the component with given props', () => {
        const props = {
            elementProps: {
                label: 'Test Label',
                options: [
                    { value: '1', label: 'Option 1' },
                    { value: '2', label: 'Option 2' }
                ],
                defaultValue: '1',
                id: 'test-id',
                buttonPadding: '8px',
                buttonLabelFontSize: '1rem',
                margin: '10px',
                labelFontSize: '1.2rem'
            },
            onChange: vi.fn()
        };

        render(<ToggleButtonSwitch {...props} />);

        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Option 1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Option 2' })).toBeInTheDocument();
    });

    it('should set the initial value based on props', () => {
        const props = {
            elementProps: {
                options: [
                    { value: '1', label: 'Option 1' },
                    { value: '2', label: 'Option 2' }
                ],
                defaultValue: '2',
                id: 'test-id'
            },
            onChange: vi.fn()
        };

        render(<ToggleButtonSwitch {...props} />);
        expect(screen.getByRole('button', { name: 'Option 2' })).toHaveClass('Mui-selected');
    });

    it('should call onChange with correct parameters when an option is selected', () => {
        const handleChange = vi.fn();
        const props = {
            elementProps: {
                options: [
                    { value: '1', label: 'Option 1' },
                    { value: '2', label: 'Option 2' }
                ],
                defaultValue: '1',
                id: 'test-id'
            },
            onChange: handleChange
        };

        render(<ToggleButtonSwitch {...props} />);

        fireEvent.click(screen.getByRole('button', { name: 'Option 2' }));

        expect(handleChange).toHaveBeenCalledWith('test-id', '2');
    });

    it('should not render label if not provided in props', () => {
        const props = {
            elementProps: {
                options: [{ value: '1', label: 'Option 1' }],
                defaultValue: '1',
                id: 'test-id'
            },
            onChange: vi.fn()
        };

        render(<ToggleButtonSwitch {...props} />);
        expect(screen.queryByText('Test Label')).toBeNull();
    });

    it('should apply correct styles based on elementProps', () => {
        const props = {
            elementProps: {
                label: 'Test Label',
                options: [{ value: '1', label: 'Option 1' }],
                defaultValue: '1',
                id: 'test-id',
                buttonPadding: '8px',
                buttonLabelFontSize: '1rem',
                margin: '10px',
                labelFontSize: '1.2rem'
            },
            onChange: vi.fn()
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ToggleButtonSwitch {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const label = screen.getByText('Test Label');
        expect(label).toHaveStyle('fontSize: 1.2rem');

        const button = screen.getByRole('button', { name: 'Option 1' });
        expect(button).toHaveStyle('padding: 8px');
        expect(button).toHaveStyle('fontSize: 1rem');
    });

    it('should handle no options gracefully', () => {
        const props = {
            elementProps: {
                label: 'Test Label',
                options: [],
                defaultValue: '',
                id: 'test-id'
            },
            onChange: vi.fn()
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ToggleButtonSwitch {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('should handle state changes correctly', () => {
        const props = {
            elementProps: {
                label: 'Test Label',
                options: [
                    { value: '1', label: 'Option 1' },
                    { value: '2', label: 'Option 2' }
                ],
                defaultValue: '1',
                id: 'test-id'
            },
            onChange: vi.fn()
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ToggleButtonSwitch {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Option 2' }));
        expect(screen.getByRole('button', { name: 'Option 2' })).toHaveClass('Mui-selected');
        expect(screen.getByRole('button', { name: 'Option 1' })).not.toHaveClass('Mui-selected');
    });

    it('should handle invalid defaultValue gracefully', () => {
        const props = {
            elementProps: {
                label: 'Test Label',
                options: [{ value: '1', label: 'Option 1' }],
                defaultValue: 'invalid-value',
                id: 'test-id'
            },
            onChange: vi.fn()
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ToggleButtonSwitch {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByRole('button', { name: 'Option 1' })).not.toHaveClass('Mui-selected');
    });
});
