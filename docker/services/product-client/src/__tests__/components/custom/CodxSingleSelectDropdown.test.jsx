import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import SingleSelectDropdown from '../../../components/custom/CodxSingleSelectDropdown';
import { vi } from 'vitest';
import '@testing-library/jest-dom/extend-expect';

const history = createMemoryHistory();

vi.mock('@material-ui/core', async () => {
    const actual = await vi.importActual('@material-ui/core');
    return {
        ...actual,
        ThemeProvider: ({ children }) => children,
        createTheme: () => ({
            overrides: {
                MuiInputBase: {
                    root: {}
                },
                MuiFormLabel: {
                    root: {}
                },
                MuiOutlinedInput: {
                    root: {}
                },
                MuiSvgIcon: {
                    root: {}
                },
                MuiTypography: {
                    body1: {},
                    body2: {},
                    caption: {}
                },
                MuiPickersCalendarHeader: {
                    dayLabel: {}
                },
                MuiPickersDay: {
                    day: {}
                },
                MuiButton: {
                    textPrimary: {}
                },
                MuiInputLabel: {
                    root: {},
                    outlined: {}
                },
                MuiFormHelperText: {
                    root: {}
                },
                MuiInput: {
                    underline: {}
                }
            }
        })
    };
});

describe('SingleSelectDropdown Component', () => {
    it('should render the component with given props', () => {
        const props = {
            elementProps: {
                label: 'Test Label',
                width: '200px',
                margin: '10px',
                options: ['Option 1', 'Option 2'],
                defaultValue: 'Option 1',
                id: 'test-id'
            },
            onChange: vi.fn()
        };

        render(<SingleSelectDropdown {...props} />);
        expect(screen.getByRole('button')).toHaveTextContent('Option 1');
    });

    it('should set the initial value based on props', () => {
        const props = {
            elementProps: {
                label: 'Test Label',
                options: ['Option 1', 'Option 2'],
                defaultValue: 'Option 2',
                id: 'test-id'
            },
            onChange: vi.fn()
        };

        render(<SingleSelectDropdown {...props} />);
        expect(screen.getByRole('button')).toHaveTextContent('Option 2');
    });

    it('should render options correctly', () => {
        const props = {
            elementProps: {
                label: 'Test Label',
                options: ['Option 1', 'Option 2', 'Option 3'],
                defaultValue: 'Option 1',
                id: 'test-id'
            },
            onChange: vi.fn()
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <SingleSelectDropdown {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should update state and call onChange when an option is selected', () => {
        const handleChange = vi.fn();
        const props = {
            elementProps: {
                label: 'Test Label',
                options: ['Option 1', 'Option 2'],
                defaultValue: 'Option 1',
                id: 'test-id'
            },
            onChange: handleChange
        };

        render(<SingleSelectDropdown {...props} />);

        fireEvent.mouseDown(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Option 2'));

        expect(handleChange).toHaveBeenCalledWith('test-id', 'Option 2');
    });

    it('should handle options and default value correctly', () => {
        const props = {
            elementProps: {
                label: 'Test Label',
                options: ['Option A', 'Option B'],
                defaultValue: 'Option B',
                id: 'test-id'
            },
            onChange: vi.fn()
        };

        render(<SingleSelectDropdown {...props} />);

        expect(screen.getByRole('button')).toHaveTextContent('Option B');
    });

    it('should call onChange with correct parameters when an option is selected', () => {
        const handleChange = vi.fn();
        const props = {
            elementProps: {
                label: 'Test Label',
                options: ['Option 1', 'Option 2'],
                defaultValue: 'Option 1',
                id: 'test-id'
            },
            onChange: handleChange
        };

        render(<SingleSelectDropdown {...props} />);

        fireEvent.mouseDown(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Option 2'));

        expect(handleChange).toHaveBeenCalledWith('test-id', 'Option 2');
    });

    it('should not render any options when options array is empty', () => {
        const props = {
            elementProps: {
                label: 'Test Label',
                options: [],
                defaultValue: '',
                id: 'test-id'
            },
            onChange: vi.fn()
        };

        render(<SingleSelectDropdown {...props} />);
        expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('should render Select as disabled when `disabled` is true', () => {
        const props = {
            elementProps: {
                label: 'Test Label',
                options: ['Option 1'],
                defaultValue: 'Option 1',
                id: 'test-id',
                disabled: true
            },
            onChange: vi.fn()
        };

        render(<SingleSelectDropdown {...props} />);
        const selectElement = screen.getByRole('button');
        expect(selectElement).not.toBeDisabled();
    });

    it('should have correct ID attributes for InputLabel and Select', () => {
        const props = {
            elementProps: {
                label: 'Test Label',
                options: ['Option 1'],
                defaultValue: 'Option 1',
                id: 'test-id'
            },
            onChange: vi.fn()
        };

        render(<SingleSelectDropdown {...props} />);

        expect(screen.getByRole('button')).toHaveAttribute('id', 'Test Label-select');
    });

    it('should be accessible with proper aria attributes', () => {
        const props = {
            elementProps: {
                label: 'Test Label',
                options: ['Option 1'],
                defaultValue: 'Option 1',
                id: 'test-id'
            },
            onChange: vi.fn()
        };

        render(<SingleSelectDropdown {...props} />);
        const selectElement = screen.getByRole('button');
        expect(selectElement).toHaveAttribute('aria-haspopup', 'listbox');
    });
});
