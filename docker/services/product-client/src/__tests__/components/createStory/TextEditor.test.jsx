import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import TextEditor from '../../../components/createStory/textEditor.jsx';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts TextEditor Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <TextEditor content={{ html: '' }} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render layouts TextEditor Component 1', () => {
        vi.useFakeTimers();
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <TextEditor content={{ html: '<p>Test</p>' }} />
                </Router>
            </CustomThemeContextProvider>
        );
        act(() => {
            vi.advanceTimersByTime(100);
        });
    });

    test('Should render layouts TextEditor Component 2', () => {
        vi.useFakeTimers();
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <TextEditor content={{ html: '<p>Test</p>' }} viewMode />
                </Router>
            </CustomThemeContextProvider>
        );
        act(() => {
            vi.advanceTimersByTime(100);
        });
    });
});
