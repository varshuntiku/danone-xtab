import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { ToasterNotification } from '../../../../components/screenActionsComponent/actionComponents/ToasterNotification.jsx';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('services/screen.js', () => {
    return {
        triggerActionHandler: ({ callback }) => {
            callback({ error: true, message: 'some message' });
        }
    };
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts ToasterNotification Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ToasterNotification
                        screen_id={1}
                        app_id={1}
                        params={{ fetch_on_load: true }}
                        action_type="action_Type"
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
