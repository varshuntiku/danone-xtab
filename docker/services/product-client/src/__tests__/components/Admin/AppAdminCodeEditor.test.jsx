import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppAdminCodeEditor from '../../../components/Admin/AppAdminCodeEditor';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { vi } from 'vitest';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);
    test('rendering AppAdminCodeEditor', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminCodeEditor
                        classes={{}}
                        extraClasses={{}}
                        code={''}
                        onChangeCodeCallback={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('testing the titles', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminCodeEditor
                        classes={{}}
                        extraClasses={{}}
                        code={''}
                        onChangeCodeCallback={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const outputElement = screen.getByText('OUTPUT');
        expect(outputElement).toBeInTheDocument();
        const debugElement = screen.getByText('DEBUG');
        expect(debugElement).toBeInTheDocument();
        const PerformanceElement = screen.getByText('PERFORMANCE');
        expect(PerformanceElement).toBeInTheDocument();
    });
    test('testing section selection', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminCodeEditor
                        classes={{}}
                        extraClasses={{}}
                        code={''}
                        onChangeCodeCallback={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByText('OUTPUT'));
        expect(screen.getByText('OUTPUT'));

        fireEvent.click(screen.getByText('DEBUG'));
        expect(screen.getByText('DEBUG'));

        fireEvent.click(screen.getByText('PERFORMANCE'));
        expect(screen.getByText('PERFORMANCE'));
    });
    test('renders different themes', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminCodeEditor
                        classes={{}}
                        extraClasses={{}}
                        code={''}
                        onChangeCodeCallback={() => {}}
                        is_light={true}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(document.querySelector('.codeEditorLightStyle'));

        cleanup();

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminCodeEditor
                        classes={{}}
                        extraClasses={{}}
                        code={''}
                        onChangeCodeCallback={() => {}}
                        is_light={false}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(document.querySelector('.codeEditorDarkStyle'));
    });
    test('component updates state based on new props', () => {
        const { rerender } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminCodeEditor
                        classes={{}}
                        extraClasses={{}}
                        code={''}
                        onChangeCodeCallback={() => {}}
                        is_light={false}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        rerender(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminCodeEditor
                        classes={{}}
                        extraClasses={{}}
                        code="updated code"
                        onChangeCodeCallback={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('PERFORMANCE')).toBeInTheDocument();
    });
    test('component updates state based on new props', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminCodeEditor
                        classes={{}}
                        extraClasses={{}}
                        code={''}
                        showTest={true}
                        onChangeCodeCallback={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('TEST'));
    });
});
