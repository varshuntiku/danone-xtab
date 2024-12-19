import React from 'react';
import { render, screen, cleanup, fireEvent, shallow, getByRole } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import PopupForm from '../../../../components/screenActionsComponent/actionComponents/PopupForm.jsx';
import { triggerActionHandler } from '../../../../services/screen';
const history = createMemoryHistory();
import { vi } from 'vitest';

vi.mock('../../../../services/screen', () => ({
    triggerActionHandler: vi.fn()
}));

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts PopupForm Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PopupForm screen_id={1} app_id={1} params={{}} action_type="action_Type" />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render and Button click PopupForm Component with is cancel false', async () => {
        triggerActionHandler.mockImplementation(({ callback }) =>
            callback({ error: true, message: 'some message' })
        );

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PopupForm
                        screen_id={1}
                        app_id={1}
                        params={{
                            trigger_button: { text: 'test' },
                            dialog_actions: [{ text: 'action-btn', is_cancel: false }],
                            form_config: { fields: [{ name: 'test' }] }
                        }}
                        action_type="action_Type"
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByText('test'));
        fireEvent.click(screen.getByText('test'));
        fireEvent.click(screen.getByText('action-btn'));
    });

    test('Should render and Button click PopupForm Component with is cancel false', async () => {
        triggerActionHandler.mockImplementation(({ callback }) =>
            callback({ error: 'true', message: 1 })
        );

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PopupForm
                        screen_id={1}
                        app_id={1}
                        params={{
                            trigger_button: { text: 'test' },
                            dialog_actions: [{ text: 'action-btn', is_cancel: false }],
                            form_config: { fields: [{ name: 'test' }] }
                        }}
                        action_type="action_Type"
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByText('test'));
        fireEvent.click(screen.getByText('test'));
        fireEvent.click(screen.getByText('action-btn'));
    });

    test('Should render and Button click PopupForm Component with error as false response', async () => {
        triggerActionHandler.mockImplementation(({ callback }) =>
            callback({ error: false, message: 'some message' })
        );

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PopupForm
                        screen_id={1}
                        app_id={1}
                        params={{
                            trigger_button: { text: 'test' },
                            dialog_actions: [{ text: 'action-btn', is_cancel: false }],
                            form_config: { fields: [{ name: 'test' }] }
                        }}
                        action_type="action_Type"
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByText('test'));
        fireEvent.click(screen.getByText('test'));
        fireEvent.click(screen.getByText('action-btn'));
    });

    test('Should render and Button click PopupForm Component with is cancel false', async () => {
        triggerActionHandler.mockImplementation(({ callback }) => {
            throw 'error';
        });

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PopupForm
                        screen_id={1}
                        app_id={1}
                        params={{
                            trigger_button: { text: 'test' },
                            dialog_actions: [{ text: 'action-btn', is_cancel: false }],
                            form_config: { fields: [{ name: 'test' }] }
                        }}
                        action_type="action_Type"
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByText('test'));
        fireEvent.click(screen.getByText('test'));
        fireEvent.click(screen.getByText('action-btn'));
    });

    test('Should render and Button click PopupForm Component with is cancel true', async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PopupForm
                        screen_id={1}
                        app_id={1}
                        params={{
                            trigger_button: { text: 'test' },
                            dialog_actions: [{ text: 'action-btn', is_cancel: true }],
                            form_config: { fields: [{ name: 'test' }] }
                        }}
                        action_type="action_Type"
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByText('test'));
        fireEvent.click(screen.getByText('test'));
        fireEvent.click(screen.getByText('action-btn'));
    });

    test('Should render and Button click PopupForm Component and handleClose Function', async () => {
        const handleClose = vi.fn();
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PopupForm
                        screen_id={1}
                        app_id={1}
                        params={{
                            dialog: { title: 'test-title' },
                            trigger_button: { text: 'test' },
                            dialog_actions: [{ text: 'action-btn', is_cancel: true }],
                            form_config: { fields: [{ name: 'test' }] }
                        }}
                        action_type="action_Type"
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        await fireEvent.click(screen.getByText('test'));
        await fireEvent.click(screen.getByText('test'));
        await fireEvent.keyDown(getByText('test-title'), {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            charCode: 27
        });
    });
});

// vi.mock('services/screen.js', () => {
//   return {
//     triggerActionHandler: ({callback}) => {
//       callback({error: true, message: "some message"})
//     }
//   }
// })

// vi.mock('services/screen.js', () => {
//   return {
//     triggerActionHandler: ({callback}) => {
//       throw "gavsash";
//     }
//   }
// })

// vi.mock('axios', () => {
//   return {
//     create: () => {
//       return {
//         ...axios.create({}),
//         post: (url) => {
//           if (url.includes('/screen_action_handler')) {
//             return {
//               data: {
//                  error:  true,
//                  message: "Some error"
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// })
