import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import SimpleSelect from '../../../../components/dynamic-form/inputFields/select.jsx';
import { describe, it, expect, afterEach, vi } from 'vitest';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(() => {
        cleanup();
    });

    it('Should render layouts SimpleSelect Component', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <SimpleSelect fieldInfo={{ options: ['option1'] }} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    it('Should render helper text when provided', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <SimpleSelect
                        fieldInfo={{
                            options: ['option1', 'option2'],
                            helperText: 'This is a helper text'
                        }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('This is a helper text')).toBeInTheDocument();
    });

    test('Should render SearchWrapper when search is enabled', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <SimpleSelect fieldInfo={{ options: ['option1'], search: 'true' }} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should not render SearchWrapper when search is disabled', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <SimpleSelect
                        fieldInfo={{
                            options: [{ value: '1', label: 'option1' }],
                            search: false
                        }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.queryByPlaceholderText('Search...')).toBeNull();
    });
    test('Should render multiple options in SimpleSelect Component', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <SimpleSelect fieldInfo={{ options: ['option1'] }} />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.mouseDown(screen.getByRole('button'));

        expect(screen.getByText('option1')).toBeInTheDocument();
    });
});
