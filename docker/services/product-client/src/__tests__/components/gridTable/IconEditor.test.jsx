import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import IconEditor from '../../../components/gridTable/IconEditor';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
import GridTable from '../../../components/gridTable/GridTable';
const history = createMemoryHistory();
vi.mock('../dynamic-form/inputFields/textInput', () => ({
    __esModule: true,
    default: vi.fn(({ onChange, onBlur, fieldInfo }) => (
        <input
            type="text"
            value={fieldInfo.value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => onBlur()}
        />
    ))
}));

describe('IconEditor Component', () => {
    it('should render without crashing', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconEditor
                        params={{ value: { text: 'Sample Text', url: 'sample-url.png' } }}
                        handleValueChange={vi.fn()}
                        handleActiveEdit={vi.fn()}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render image when url is provided in params', () => {
        render(
            <IconEditor
                params={{ value: { url: 'sample-url.png' } }}
                handleValueChange={vi.fn()}
                handleActiveEdit={vi.fn()}
            />
        );

        expect(screen.getByRole('img')).toHaveAttribute('src', 'sample-url.png');
    });

    it('should not render image when url is not provided in params', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconEditor
                        params={{ value: {} }}
                        handleValueChange={vi.fn()}
                        handleActiveEdit={vi.fn()}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should render TextInput component when text is provided in params', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconEditor
                        params={{ value: { text: 'Sample Text' } }}
                        handleValueChange={vi.fn()}
                        handleActiveEdit={vi.fn()}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByRole('textbox')).toHaveValue('Sample Text');
    });

    it('should call handleValueChange with updated text when TextInput value changes', () => {
        const handleValueChange = vi.fn();
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconEditor
                        params={{ value: { text: 'Sample Text' } }}
                        handleValueChange={handleValueChange}
                        handleActiveEdit={vi.fn()}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated Text' } });
        expect(handleValueChange).toHaveBeenCalledWith({ text: 'Updated Text' });
    });

    it('should use iconWidth from params for image styles if provided', () => {
        render(
            <IconEditor
                params={{ value: { url: 'sample-url.png' }, iconWidth: '50px' }}
                handleValueChange={vi.fn()}
                handleActiveEdit={vi.fn()}
            />
        );

        const imgElement = screen.getByRole('img');
        expect(imgElement).toHaveStyle('width: 50px');
        expect(imgElement).toHaveStyle('height: 50px');
    });
});
