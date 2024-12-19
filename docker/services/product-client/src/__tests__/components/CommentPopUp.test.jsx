import React from 'react';
import { render, screen, cleanup, fireEvent, getByTestId } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CommentPopUp from '../../components/CommentPopUp';
import { triggerWidgetActionHandler } from '../../services/widget';
import { vi } from 'vitest';

vi.mock('../../services/widget', () => ({
    triggerWidgetActionHandler: vi.fn()
}));

const history = createMemoryHistory();
const mockSessionStorage = (function () {
    let store = {
        user_name: 'sumit',
        user_email: 'sumit@gmail.com'
    };
    return {
        getItem: function (key) {
            return JSON.stringify(store[key] || null);
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        removeItem: function (key) {
            delete store[key];
        },
        clear: function () {
            store = {};
        }
    };
})();

describe('Codex Product test', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'sessionStorage', {
            value: mockSessionStorage
        });
    });
    afterEach(cleanup);
    test('Should render layouts Functions Component', () => {
        triggerWidgetActionHandler.mockImplementation(({ callback }) =>
            callback([
                {
                    description: 'test Merchandising & Store Ops'
                }
            ])
        );
        const props = {
            onChange: () => {},
            content: {
                actionParams: {
                    name: 'sdsnk'
                }
            },
            enableRestriction: null
        };
        const dynamicPayload = {
            payload: {
                action_type: 'hello'
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CommentPopUp dynamicPayload={dynamicPayload} {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const notesButton = screen.getByRole('button', { name: 'Notes' });
        expect(notesButton.toBeInTheDocument);
        fireEvent.click(notesButton);
        const field = screen.getByTestId('outlined-basic').querySelector('input');
        fireEvent.change(field, { target: { value: 'some text' } });
        expect(field.value).toBe('some text');
        const field1 = screen.getByRole('button', { name: 'sendbutton' });
        fireEvent.click(field1);
        const editbtn = screen.getByRole('button', { name: 'edit' });
        fireEvent.click(editbtn);
        const txtbox1 = screen.getAllByRole('textbox');
        fireEvent.change(txtbox1[1], { target: { value: 'some text' } });
        expect(txtbox1[1].value).toBe('some text');
        const savebtn = screen.getAllByRole('button', { name: 'sendbutton' });
        fireEvent.click(savebtn[0]);
        const delbtn = screen.getByRole('button', { name: 'delete' });
        fireEvent.click(delbtn);
    });
});
const Props = {
    classes: {}
};
