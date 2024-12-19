import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CodxLegendsIcons from '../../../components/custom/CodxLegends';
import { vi } from 'vitest';
const history = createMemoryHistory();

describe('CodxLegendsIcons Component', () => {
    const elementProps = {
        options: [
            { value: '#FF0000', label: 'Red', themeColor: { light: '#FFCDD2', dark: '#B71C1C' } },
            { value: '#00FF00', label: 'Green', themeColor: { light: '#C8E6C9', dark: '#1B5E20' } },
            { value: '#0000FF', label: 'Blue', themeColor: { light: '#BBDEFB', dark: '#0D47A1' } }
        ],
        width: '20px',
        height: '20px',
        theme: 'light',
        margin: '10px'
    };
    const mockProps = { theme: { palette: { text: { default: '#000' } } } };

    it('renders correctly with the given options', () => {
        const { getByText } = render(
            <CodxLegendsIcons elementProps={elementProps} {...mockProps} />
        );

        elementProps.options.forEach((option) => {
            expect(getByText(option.label)).toBeInTheDocument();
        });
    });

    it('applies the correct margin to the outer Box', () => {
        const { container } = render(
            <CodxLegendsIcons elementProps={elementProps} {...mockProps} />
        );
        const outerBoxElement = container.firstChild;

        expect(outerBoxElement).toHaveStyle('margin: 10px');
    });

    it('applies the correct styles to each inner Box and Typography', () => {
        const { container, getByText } = render(
            <CodxLegendsIcons elementProps={elementProps} {...mockProps} />
        );

        elementProps.options.forEach((option) => {
            const labelElement = getByText(option.label);
            const colorBox = labelElement.previousSibling;

            expect(colorBox).toHaveStyle(`width: ${elementProps.width}`);
            expect(colorBox).toHaveStyle(`height: ${elementProps.height}`);
            expect(colorBox).toHaveStyle(
                `background-color: ${option.themeColor[elementProps.theme]}`
            );
            expect(labelElement).toHaveClass(
                'MuiTypography-root makeStyles-toolBarText-11 MuiTypography-body1'
            );
        });
    });

    it('handles missing theme and themeColor gracefully', () => {
        const elementPropsWithoutTheme = {
            ...elementProps,
            theme: undefined
        };
        const { container, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxLegendsIcons elementProps={elementPropsWithoutTheme} {...mockProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        elementProps.options.forEach((option) => {
            const labelElement = getByText(option.label);
            const colorBox = labelElement.previousSibling;

            expect(colorBox).toHaveStyle(`background-color: ${option.value}`);
        });
    });
});
