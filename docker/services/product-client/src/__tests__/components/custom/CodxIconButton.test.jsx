import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import IconButton from '../../../components/custom/CodxIconButton';

import { vi } from 'vitest';
const history = createMemoryHistory();
describe('IconButton Component', () => {
    const mockOnChange = vi.fn();
    const elementProps = {
        id: 'test-id',
        labelLeft: 'Edit',
        labelRight: 'Save',
        onClickLabelLeft: 'Editing',
        onClickLabelRight: 'Saving',
        iconName: 'edit',
        iconOnClick: 'edit',
        margin: '10px'
    };
    const classes = {
        button: 'test-button-class',
        toolBarIcon: 'test-icon-class',
        toolBarText: 'test-text-class'
    };

    it('renders the button with the correct initial labels and icon', () => {
        const { getByText, container } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconButton
                        elementProps={elementProps}
                        classes={classes}
                        onChange={mockOnChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(getByText('Edit')).toBeInTheDocument();
        expect(getByText('Save')).toBeInTheDocument();
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('applies the correct margin to the Box', () => {
        const { container } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconButton
                        elementProps={elementProps}
                        classes={classes}
                        onChange={mockOnChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const boxElement = container.firstChild;

        expect(boxElement).toHaveStyle('margin: 10px');
    });

    it('applies the correct class to the button and text', () => {
        const { getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconButton
                        elementProps={elementProps}
                        classes={classes}
                        onChange={mockOnChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const buttonElement = getByText('Edit').parentElement;
        const textElement = getByText('Edit');

        expect(buttonElement).toHaveClass('test-button-class');
        expect(textElement).toHaveClass('test-text-class');
    });

    it('toggles state and updates labels and icon on button click', () => {
        const { getByText, queryByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconButton
                        elementProps={elementProps}
                        classes={classes}
                        onChange={mockOnChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const buttonElement = getByText('Edit').parentElement;

        expect(getByText('Edit')).toBeInTheDocument();
        expect(getByText('Save')).toBeInTheDocument();

        fireEvent.click(buttonElement);

        expect(mockOnChange).toHaveBeenCalledWith('test-id', true);
        expect(queryByText('Edit')).not.toBeInTheDocument();
        expect(queryByText('Save')).not.toBeInTheDocument();
        expect(getByText('Editing')).toBeInTheDocument();
        expect(getByText('Saving')).toBeInTheDocument();
    });

    it('renders the correct icon based on the state', () => {
        const { container, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconButton
                        elementProps={elementProps}
                        classes={classes}
                        onChange={mockOnChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const buttonElement = getByText('Edit').parentElement;

        expect(container.querySelector('svg')).toBeInTheDocument();
        fireEvent.click(buttonElement);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });
});
