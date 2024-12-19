import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import WidgetCode from '../../../components/DesignWidget/WidgetCode';
import { getWidgetCode } from '../../../services/admin';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../services/admin', () => ({
    getWidgetCode: vi.fn()
}));
vi.mock('@monaco-editor/react', async () => {
    const functions = await vi.importActual('@monaco-editor/react');
    return {
        ...functions,
        default: (props) => (
            <>
                <div
                    key={props.key}
                    width={props.width}
                    height={props.height}
                    language={props.language}
                    theme={props.theme}
                    options={props.options}
                >
                    {props.value}
                </div>
                <button onClick={() => props.onChange('changed code')} aria-label="change-code">
                    Test change
                </button>
            </>
        )
    };
});
describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts WidgetCode  Component', () => {
        getWidgetCode.mockImplementation(({ callback }) =>
            callback({ data: { data: 'test data code', base_data: ' test base code' } })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <WidgetCode {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByRole('button', { name: 'Back to Design' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Back to Design' }));
    });
    test('Should render layouts WidgetCode  Component 1', async () => {
        getWidgetCode.mockImplementation(({ callback }) =>
            callback({ data: { data: 'test data code', base_data: 'test base code' } })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <WidgetCode {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Blueprint Code')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Widget Factory Code'));
        // expect(screen.getByText('test data code',{exact: false})).toBeInTheDocument()
        expect(screen.getByLabelText('change-code')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('change-code'));
        expect(screen.getByText('Blueprint Code')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Blueprint Code'));
        expect(screen.getByText('changed code', { exact: false })).toBeInTheDocument();
    });
});

const Props = {
    classes: {},
    project_id: 1,
    widget_id: 2,
    base_widget_id: 3,
    parent_obj: { closeCodeDialog: () => {} }
};
