import React from 'react';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import SearchBar from '../../../components/CustomSearchComponent/SearchComponent';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

const history = createMemoryHistory();

vi.mock('../../../components/CustomSearchComponent/suggestionsComponent', () => ({
    __esModule: true,
    default: ({ value, setValue }) => <div onClick={() => setValue(value)}>{value}</div>
}));

const mockTheme = createTheme({
    palette: {
        text: {
            default: '#000000',
            revamp: '#000000'
        },
        border: {
            grey: '#d0d0d0',
            inputFocus: '#0000ff'
        }
    },
    spacing: (factor) => `${factor * 8}px`,
    layoutSpacing: (factor) => `${factor * 8}px`
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts SearchBar  Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <SearchBar {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    it('Should render SearchBar with provided props', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <SearchBar
                    value="test"
                    onChange={() => {}}
                    onChangeWithDebounce={() => {}}
                    debounceDuration={500}
                    placeholder="Search here"
                    name="test-name"
                    variant="outlined"
                    suggestions={['Suggestion 1', 'Suggestion 2']}
                />
            </ThemeProvider>
        );

        expect(screen.getByPlaceholderText('Search here')).toBeInTheDocument();
        expect(screen.getByText('Suggestion 1')).toBeInTheDocument();
        expect(screen.getByText('Suggestion 2')).toBeInTheDocument();
    });

    it('Should render suggestions when provided', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <SearchBar
                    value="search term"
                    onChange={() => {}}
                    onChangeWithDebounce={() => {}}
                    debounceDuration={500}
                    suggestions={['Suggestion A', 'Suggestion B']}
                />
            </ThemeProvider>
        );

        expect(screen.getByText('Suggestion A')).toBeInTheDocument();
        expect(screen.getByText('Suggestion B')).toBeInTheDocument();
    });
    it('Should clear search input when clear icon is clicked', () => {
        const mockOnChange = vi.fn();
        render(
            <ThemeProvider theme={mockTheme}>
                <SearchBar
                    value="search term"
                    onChange={mockOnChange}
                    onChangeWithDebounce={() => {}}
                    debounceDuration={500}
                    placeholder="Search here"
                    name="test-name"
                    variant="outlined"
                    suggestions={['Suggestion A', 'Suggestion B']}
                />
            </ThemeProvider>
        );

        const clearIcon = screen.getByTestId('Clear-button');
        act(() => {
            fireEvent.click(clearIcon);
        });

        expect(mockOnChange).toHaveBeenCalledWith('', 'test-name');
    });

    it('Should call onChangeWithDebounce after debounce duration', async () => {
        vi.useFakeTimers();
        const mockOnChangeWithDebounce = vi.fn();

        render(
            <ThemeProvider theme={mockTheme}>
                <SearchBar
                    value="initial"
                    onChange={() => {}}
                    onChangeWithDebounce={mockOnChangeWithDebounce}
                    debounceDuration={500}
                    placeholder="Search here"
                    name="test-name"
                    variant="outlined"
                />
            </ThemeProvider>
        );
        const input = screen.getByPlaceholderText('Search here');
        act(() => {
            fireEvent.change(input, { target: { value: 'new value' } });
        });

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(mockOnChangeWithDebounce).toHaveBeenCalledWith('new value', 'test-name');
        vi.useRealTimers();
    });
});

const Props = {
    classes: {}
};
