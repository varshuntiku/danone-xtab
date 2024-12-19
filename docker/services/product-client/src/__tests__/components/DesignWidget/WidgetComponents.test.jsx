import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import WidgetComponents from '../../../components/DesignWidget/WidgetComponents';
import { getWidgetComponents } from '../../../services/admin';
import { vi } from 'vitest';

vi.mock('../../../services/admin', () => ({
    getWidgetComponents: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts WidgetComponents  Component', () => {
        getWidgetComponents.mockImplementation(({ callback }) =>
            callback({
                metadata: [
                    { name: 'model', return_type: 'MODEL' },
                    { name: 'visuals', return_type: 'VISUALS' },
                    { name: 'prediction', return_type: 'PREDICTIONS' },
                    { name: 'metadata', return_type: 'METADATA' },
                    { name: 'data', return_type: 'DATA' },
                    { name: 'function', return_type: 'FUNCTION' }
                ],
                code_demo: {},
                code_details: {
                    repo: {},
                    path: 'test/codex_widget_factory/test.py'
                }
            })
        );
        const { getByText, debug, rerender } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <WidgetComponents {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Demo')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Demo'));

        rerender(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <WidgetComponents {...Props} widget_id={2} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});

const Props = {
    classes: {},
    widget_id: 1
};
