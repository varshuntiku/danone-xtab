import React from 'react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import ActionBar from '../../components/ActionBar';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);
    test('Should render Action Bar Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ActionBar />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render Action Bar1 Component', () => {
        const props = {
            reports: {
                my_stories: [{ story_name: 'Story 1' }, { story_name: 'Story 2' }],
                accessed_stories: [{ story_name: 'Story 3' }, { story_name: 'Story 4' }]
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ActionBar {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByLabelText('search')).toBeInTheDocument();
        const searchStory = screen.getByLabelText('search');
        fireEvent.change(searchStory, { target: { value: 'Story 1' } });
    });
    test('Should render Action Bar2 Component', () => {
        const props = {
            reports: {
                my_stories: [{ story_name: 'Story 1' }, { story_name: 'Story 2' }],
                accessed_stories: [{ story_name: 'Story 3' }, { story_name: 'Story 4' }]
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ActionBar {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByLabelText('search')).toBeInTheDocument();
        const searchStory = screen.getByLabelText('search');
        fireEvent.change(searchStory, { target: { value: ' ' } });
    });
    test('Should render Action Bar3 Component', () => {
        const props = {
            reports: {
                my_stories: [{ story_name: '' }, { story_name: '' }],
                accessed_stories: [{ story_name: '' }, { story_name: '' }]
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ActionBar {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByLabelText('search')).toBeInTheDocument();
        const searchStory = screen.getByLabelText('search');
        fireEvent.change(searchStory, { target: { value: 'Story 1' } });
    });
    test('Should render Action Bar4 Component', () => {
        const props = {
            reports: {
                my_stories: [{ story_name: 'Story 1' }, { story_name: 'Story 2' }],
                accessed_stories: [{ story_name: 'Story 3' }, { story_name: 'Story 4' }]
            },
            history: history
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ActionBar {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByLabelText('search')).toBeInTheDocument();
        const searchStory = screen.getByLabelText('search');
        fireEvent.change(searchStory, { target: { value: 'Story 1' } });
        expect(screen.getByLabelText('search-option')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('search-option'));
    });
    test('Should render Action Bar5 Component', () => {
        const props = {
            reports: {
                my_stories: [{ story_name: 'Story 1' }, { story_name: 'Story 2' }],
                accessed_stories: [{ story_name: 'Story 3' }, { story_name: 'Story 4' }]
            },
            history: history
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ActionBar {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByLabelText('search')).toBeInTheDocument();
        const searchStory = screen.getByLabelText('search');
        fireEvent.change(searchStory, { target: { value: 'Story 1' } });
        fireEvent.mouseDown(document);
    });
    test('Should render Action Bar6 Component', () => {
        const props = {
            reports: {
                my_stories: [{ story_name: 'Story 1' }, { story_name: 'Story 2' }],
                accessed_stories: [{ story_name: 'Story 3' }, { story_name: 'Story 4' }]
            },
            history: history
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ActionBar {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByLabelText('search')).toBeInTheDocument();
        const searchStory = screen.getByLabelText('search');
        fireEvent.change(searchStory, { target: { value: 'Story 5' } });
        fireEvent.mouseDown(document);
    });
    test('Should clear search input when close icon is clicked', () => {
        const props = {
            reports: {
                my_stories: [{ story_name: 'Story 1' }, { story_name: 'Story 2' }],
                accessed_stories: [{ story_name: 'Story 3' }, { story_name: 'Story 4' }]
            },
            history: history
        };
        const { getByLabelText, queryByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ActionBar {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByLabelText('search')).toBeInTheDocument();
        const searchStory = screen.getByLabelText('search');
        fireEvent.change(searchStory, { target: { value: 'Story 1' } });

        const closeIcon = screen.getByLabelText('close-search');
        fireEvent.click(closeIcon);

        expect(searchStory.value).toBe('');
        expect(queryByLabelText('search-option')).toBeNull();
    });

    test('Should display "NO RECORDS FOUND" when no matching stories are found', () => {
        const props = {
            reports: {
                my_stories: [{ story_name: 'Story 1' }, { story_name: 'Story 2' }],
                accessed_stories: [{ story_name: 'Story 3' }, { story_name: 'Story 4' }]
            },
            history: history
        };
        const { getByLabelText, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ActionBar {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByLabelText('search')).toBeInTheDocument();
        const searchStory = screen.getByLabelText('search');
        fireEvent.change(searchStory, { target: { value: 'Nonexistent Story' } });

        expect(getByText('NO RECORDS FOUND')).toBeInTheDocument();
    });

    test('Should handle empty input gracefully', () => {
        const props = {
            reports: {
                my_stories: [{ story_name: 'Story 1' }, { story_name: 'Story 2' }],
                accessed_stories: [{ story_name: 'Story 3' }, { story_name: 'Story 4' }]
            },
            history: history
        };
        const { getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ActionBar {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByLabelText('search')).toBeInTheDocument();
        const searchStory = screen.getByLabelText('search');
        fireEvent.change(searchStory, { target: { value: '' } });

        expect(searchStory.value).toBe('');
    });

    test('Should navigate to story details when a search option is clicked', () => {
        const props = {
            reports: {
                my_stories: [
                    { story_name: 'Story 1', story_id: '1' },
                    { story_name: 'Story 2', story_id: '2' }
                ],
                accessed_stories: [
                    { story_name: 'Story 3', story_id: '3' },
                    { story_name: 'Story 4', story_id: '4' }
                ]
            },
            history: history
        };
        const { getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ActionBar {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const searchStory = screen.getByLabelText('search');
        fireEvent.change(searchStory, { target: { value: 'Story 1' } });

        const searchOption = screen.getByLabelText('search-option');
        fireEvent.click(searchOption);

        expect(history.location.pathname).toBe('/stories/1/details');
    });

    test('Should hide search options when clicking outside the search container', () => {
        const props = {
            reports: {
                my_stories: [{ story_name: 'Story 1' }, { story_name: 'Story 2' }],
                accessed_stories: [{ story_name: 'Story 3' }, { story_name: 'Story 4' }]
            },
            history: history
        };
        const { getByLabelText, queryByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ActionBar {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const searchStory = screen.getByLabelText('search');
        fireEvent.change(searchStory, { target: { value: 'Story 1' } });

        expect(screen.getByLabelText('search-option')).toBeInTheDocument();

        fireEvent.mouseDown(document);

        expect(queryByLabelText('search-option')).toBeNull();
    });
});
