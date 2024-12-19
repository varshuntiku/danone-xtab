import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import Reports from '../../layouts/Reports';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';

vi.mock('../../components/ActionBar', () => {
    return { default: (props) => <div>Mock ActionBar Component</div> };
});

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts Reports Component', () => {
        const props = {
            match: {
                params: {
                    story_id: 1
                }
            },
            location: {
                state: {
                    appId: 1
                }
            },
            getStories: () => {},
            stories: {}
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Reports {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts Reports Component', () => {
        const props = {
            match: {
                params: {
                    story_id: 1
                }
            },
            location: {
                state: {
                    appId: 1
                }
            },
            getStories: () => {},
            stories: {}
        };
        history.push('/stories');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Reports {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts Reports Component', () => {
        const props = {
            match: {
                params: {
                    story_id: 1
                }
            },
            location: {
                state: {
                    appId: 1
                }
            },
            getStories: () => {},
            stories: {}
        };
        history.push('/stories/1/details');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Reports {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts Reports Component', () => {
        const props = {
            match: {
                params: {
                    story_id: 1
                }
            },
            location: {
                state: {
                    appId: 1
                }
            },
            getStories: () => {},
            stories: {}
        };
        history.push('/stories/1/published-preview');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Reports {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts Reports Component', () => {
        const props = {
            match: {
                params: {
                    story_id: 1
                }
            },
            location: {
                state: {
                    appId: 1
                }
            },
            getStories: () => {},
            stories: {}
        };
        history.push('/stories/1/edit');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Reports {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts Reports Component', () => {
        const props = {
            match: {
                params: {
                    story_id: 1
                }
            },
            location: {
                state: {
                    appId: 1
                }
            },
            getStories: () => {},
            stories: {}
        };
        history.push('/stories/list');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Reports {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});
