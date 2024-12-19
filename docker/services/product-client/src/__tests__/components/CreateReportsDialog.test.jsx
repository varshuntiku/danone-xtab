import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CreateReportsDialog from '../../components/CreateReportsDialog';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { getStories, updateStory, createStory } from '../../services/reports';
import { getApps } from '../../services/dashboard';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../services/reports', () => ({
    getStories: vi.fn(),
    updateStory: vi.fn(),
    createStory: vi.fn()
}));
vi.mock('../../services/dashboard', () => ({
    getApps: vi.fn()
}));

const mockLocalStorage = (function () {
    let store = {
        'create-stories-payload': [
            [
                26,
                [
                    {
                        name: 'VOLUME OPPORTUNITY 2020',
                        description: '',
                        app_id: '26',
                        app_screen_id: 103,
                        app_screen_widget_id: 486,
                        graph_data: '',
                        filter_data: ''
                    }
                ]
            ]
        ]
    };

    return {
        getItem: function (key) {
            return JSON.stringify(store[key]) || null;
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

describe('CreateReportsDialog', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage
        });
    });
    afterEach(cleanup);
    test('Should render CreateReportsDialog Component', () => {
        const props = {
            classes: {},
            stories_list_page: false,
            onClose: () => {},
            app_info: {
                id: 26,
                story_count: 0
            },
            onResponseAddORCreateStory: () => {}
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CreateReportsDialog {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByPlaceholderText('Story Name')).toBeInTheDocument();
        const inputStoryName = screen.getByPlaceholderText('Story Name');
        fireEvent.change(inputStoryName, { target: { value: '' } });

        expect(screen.getByPlaceholderText('Add story description')).toBeInTheDocument();
        const inputStoryDescription = screen.getByPlaceholderText('Add story description');
        fireEvent.change(inputStoryDescription, { target: { value: 'Test story 1 description' } });
    });

    test('Should render CreateReportsDialog Component 1', () => {
        const props = {
            classes: {},
            stories_list_page: false,
            onClose: () => {},
            app_info: {
                id: 26,
                story_count: 0
            },
            onResponseAddORCreateStory: () => {}
        };
        getStories.mockImplementation(({ callback }) =>
            callback({
                my_stories: [
                    {
                        story_id: 1,
                        story_name: 'test story 1'
                    },
                    {
                        story_id: 2,
                        story_name: 'test story 2'
                    }
                ]
            })
        );
        getApps.mockImplementation(({ callback }) => callback([]));
        createStory.mockImplementation(({ callback }) => callback({}));
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CreateReportsDialog {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByPlaceholderText('Story Name')).toBeInTheDocument();
        const inputStoryName = screen.getByPlaceholderText('Story Name');
        fireEvent.change(inputStoryName, { target: { value: 'Test story 1' } });

        expect(screen.getByPlaceholderText('Add story description')).toBeInTheDocument();
        const inputStoryDescription = screen.getByPlaceholderText('Add story description');
        fireEvent.change(inputStoryDescription, { target: { value: 'Test story 1 description' } });

        expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    });

    test('Should render CreateReportsDialog Component 2', () => {
        const props = {
            classes: {},
            stories_list_page: true,
            onClose: () => {},
            app_info: {
                id: 26,
                story_count: 1
            },
            onResponseAddORCreateStory: () => {}
        };

        getStories.mockImplementation(({ callback }) => callback({}));
        getApps.mockImplementation(({ callback }) =>
            callback([
                { data_story_enabled: true, id: 1, name: 'test app 1' },
                { data_story_enabled: true, id: 2, name: 'test app 2' },
                { data_story_enabled: false, id: 3, name: 'test app 3' }
            ])
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CreateReportsDialog {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const checkbox = screen.getAllByRole('checkbox')[0];
        act(() => {
            checkbox.click();
            fireEvent.change(checkbox, { target: { checked: true } });
        });

        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelBtn);
    });

    test('Should render CreateReportsDialog Component 3', () => {
        const props = {
            classes: {},
            stories_list_page: false,
            onClose: () => {},
            app_info: {
                id: 26,
                story_count: 1
            },
            onResponseAddORCreateStory: () => {}
        };

        getStories.mockImplementation(({ callback }) =>
            callback({
                my_stories: [
                    {
                        story_id: 1,
                        story_name: 'test story 1'
                    },
                    {
                        story_id: 2,
                        story_name: 'test story 2'
                    }
                ]
            })
        );
        getApps.mockImplementation(({ callback }) => callback([]));
        updateStory.mockImplementation(() => {
            throw Error;
        });
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CreateReportsDialog {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getAllByRole('checkbox')).not.toBeNull();
        const checkbox = screen.getAllByRole('checkbox')[0];
        act(() => {
            checkbox.click();
            fireEvent.change(checkbox, { target: { checked: true } });
        });

        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));

        expect(screen.getByRole('button', { name: 'Create new story' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Create new story' }));

        expect(screen.getByLabelText('ArrowBack')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('ArrowBack'));
    });
});
