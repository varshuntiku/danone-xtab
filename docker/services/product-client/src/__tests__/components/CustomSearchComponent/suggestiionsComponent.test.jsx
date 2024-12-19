import React from 'react';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import SuggestionBox from '../../../components/CustomSearchComponent/suggestionsComponent';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

const history = createMemoryHistory();

const theme = createTheme();

const renderComponent = (props) => {
    return render(
        <Provider store={store}>
            <CustomThemeContextProvider>
                <ThemeProvider theme={theme}>
                    <Router history={history}>
                        <SuggestionBox {...props} />
                    </Router>
                </ThemeProvider>
            </CustomThemeContextProvider>
        </Provider>
    );
};

describe('SuggestionBox', () => {
    const mockSetValue = vi.fn();

    it('renders with initial props', () => {
        renderComponent({
            searchValue: 'test',
            value: 'suggestion',
            key: '1',
            setValue: mockSetValue,
            suggestionParams: {
                borderType: 'dotted',
                borderColor: 'red',
                opacity: 0.8,
                shape: 'oval',
                fontSize: '1.5rem',
                color: 'blue',
                backgroundColor: 'yellow',
                fontStyle: 'italic',
                activeBorderType: 'solid',
                activeBorderColor: 'green',
                activeOpacity: 1,
                activeFontSize: '1.5rem',
                activeColor: 'purple',
                activeBackgroundColor: 'orange'
            }
        });

        const button = screen.getByRole('button', { name: 'suggestion' });
        expect(button).toBeInTheDocument();
        expect(button).toHaveStyle('border: 1px dotted red');
        expect(button).toHaveStyle('opacity: 0.8');
        expect(button).toHaveStyle('border-radius: 2.75rem');
        expect(button).toHaveStyle('font-size: 1.5rem');
        expect(button).toHaveStyle('color: rgb(0, 0, 255)');
        expect(button).toHaveStyle('background-color:  rgb(255, 255, 0)');
        expect(button).toHaveStyle('font-style: italic');
    });

    it('updates value on click and toggles active state', () => {
        renderComponent({
            searchValue: 'test',
            value: 'suggestion',
            key: '1',
            setValue: mockSetValue
        });

        const button = screen.getByRole('button', { name: 'suggestion' });

        fireEvent.click(button);
        expect(mockSetValue).toHaveBeenCalledWith('test suggestion');
        expect(button).toHaveClass('activeBox');

        fireEvent.click(button);
        expect(mockSetValue).toHaveBeenCalledWith('test');
        expect(button).not.toHaveClass('activeBox');
    });

    it('applies active styles when active state is true', () => {
        renderComponent({
            searchValue: 'test',
            value: 'suggestion',
            key: '1',
            setValue: mockSetValue
        });

        const button = screen.getByRole('button', { name: 'suggestion' });

        fireEvent.click(button);
        expect(button).toHaveStyle('border: 2px outset buttonface');
        expect(button).toHaveStyle('opacity: 1');
        expect(button).toHaveStyle('font-size: 2rem');
        expect(button).toHaveStyle('color: ButtonText');
        expect(button).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
    });
});
