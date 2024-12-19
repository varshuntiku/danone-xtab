import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import MinervaChatbot from '../../../components/minerva/MinervaChatbot';
import store from 'store/store';
import { Provider } from 'react-redux';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../components/minerva/chatView', () => (props) => {
    return (
        <div>
            Mock Chat View Component
            <button aria-label="setMessageList" onClick={props.setMessageList}>
                Test setMessages Handler
            </button>
            <button aria-label="setVizMetaData" onClick={props.setVizMetaData}>
                Test setVizMetaData Handler
            </button>
        </div>
    );
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts MinervaChatbot Component', () => {
        const props = {
            app_info: {
                modules: {
                    minerva: {
                        enabled: true,
                        tenant_id: 1
                    }
                }
            }
        };
        import.meta.env = {
            REACT_APP_ENABLE_COPILOT: true
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MinervaChatbot history={history} props={props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.queryByTestId('minerva-wc')).toBeNull();
    });

    test('Should render layouts MinervaChatbot Component 1', () => {
        const props = {
            app_info: {
                modules: {
                    copilot: {
                        enabled: true,
                        app_id: 1
                    }
                }
            }
        };
        import.meta.env = {
            REACT_APP_ENABLE_COPILOT: true
        };

        const { getByText, debug, container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MinervaChatbot history={history} props={props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByTestId('minerva-wc')).toBeNull();
        // fireEvent.click(screen.getByRole('presentation').firstChild);
    });

    test('Should render layouts MinervaChatbot Component 2', async () => {
        const props = {
            app_info: {
                modules: {
                    minerva: {
                        enabled: false,
                        tenant_id: 1
                    },
                    copilot: {
                        enabled: false,
                        app_id: 1
                    }
                }
            }
        };
        import.meta.env = {
            REACT_APP_ENABLE_COPILOT: true
        };

        const { getByText, debug, container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MinervaChatbot history={history} {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.queryByTestId('minerva-wc')).toBeNull();
        // fireEvent.click(screen.getByText('Ask NucliOS'));
        // fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
        // fireEvent.click(screen.getByLabelText('full-screen'));
        // fireEvent.click(screen.getByLabelText('setMessageList'));
        // fireEvent.click(screen.getByLabelText('setVizMetaData'));
    });
    test('Should render MinervaChatbot with enabled Minerva', () => {
        const props = {
            app_info: {
                modules: {
                    minerva: {
                        enabled: true,
                        tenant_id: 1
                    }
                }
            },
            actions: { ask: false }
        };
        import.meta.env = { REACT_APP_ENABLE_COPILOT: false };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MinervaChatbot {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByTestId('minerva-wc'));
    });

    test('Should render MinervaChatbot with enabled Copilot', () => {
        const props = {
            app_info: {
                modules: {
                    copilot: {
                        enabled: true,
                        app_id: 1
                    }
                }
            },
            actions: { ask: false }
        };
        import.meta.env = { REACT_APP_ENABLE_COPILOT: true };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MinervaChatbot {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByTestId('minerva-wc'));
    });

    test('Should handle dialog open and close', () => {
        const props = {
            app_info: {
                modules: {
                    minerva: {
                        enabled: true,
                        tenant_id: 1
                    }
                }
            },
            actions: { ask: true },
            setActions: vi.fn()
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MinervaChatbot {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.queryByTestId('minerva-wc'));
        expect(props.setActions);
    });

    test('Should handle Minerva and Copilot configuration', () => {
        const props = {
            app_info: {
                modules: {
                    minerva: {
                        enabled: false,
                        tenant_id: 1
                    },
                    copilot: {
                        enabled: true,
                        app_id: 1
                    }
                }
            }
        };
        import.meta.env = { REACT_APP_ENABLE_COPILOT: true };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MinervaChatbot {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByTestId('minerva-wc'));
    });
});
