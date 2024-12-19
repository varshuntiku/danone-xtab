import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CustomizedTables from '../../../components/custom/table.jsx';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';

vi.mock('../../../components/ScheduleStoriesDialog', () => {
    return {
        default: (props) => (
            <>
                <button aria-label="schedule" onClick={props.onResponseScheduleStory}>
                    schedule story
                </button>
                <button aria-label="close" onClick={props.onClose}>
                    close popup
                </button>
            </>
        )
    };
});

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts CustomizedTables  Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomizedTables
                            classes={{}}
                            tableData={[{ apps: [], story_access_users: [] }]}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render layouts CustomizedTables1  Component', () => {
        const props = {
            previewStories: () => {},
            navigate: () => {},
            onResponseScheduleStory: () => {},
            tableData: [
                {
                    apps: [
                        {
                            id: 26,
                            name: 'Integrated Demand Forecasting'
                        }
                    ],
                    id_token:
                        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMjgxOTg1NDEzLCJpYXQiOjE2NDE5ODU0MTMsInN1YiI6ImRhdGFfc3RvcnlfaWRfdG9rZW4iLCJzdG9yeV9pZCI6OTh9.BYt7HvND-4fSGqKmMjCCCokWXLOoTgQIGK3gSM9ZbcU',
                    story_access_users: [],
                    story_content_count: 13,
                    story_desc: 'testing the stories',
                    story_id: 98,
                    story_name: ' test story 26/10/2021',
                    story_page_count: 3,
                    story_schedule_info: null,
                    story_schedule_status: 'No'
                }
            ],
            insideApp: true
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomizedTables {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('testing the stories', { exact: false })).toBeVisible();
    });
    test('Should render layouts CustomizedTables2  Component', () => {
        const props = {
            previewStories: () => {},
            navigate: () => {},
            onResponseScheduleStory: () => {},
            tableData: [
                {
                    apps: [
                        {
                            id: 26,
                            name: 'Integrated Demand Forecasting'
                        }
                    ],
                    id_token:
                        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMjgxOTg1NDEzLCJpYXQiOjE2NDE5ODU0MTMsInN1YiI6ImRhdGFfc3RvcnlfaWRfdG9rZW4iLCJzdG9yeV9pZCI6OTh9.BYt7HvND-4fSGqKmMjCCCokWXLOoTgQIGK3gSM9ZbcU',
                    story_access_users: ['user1', 'user2'],
                    story_content_count: 13,
                    story_desc: 'testing the stories',
                    story_id: 98,
                    story_name: ' test story 26/10/2021',
                    story_page_count: 3,
                    story_schedule_info: null,
                    story_schedule_status: 'No'
                }
            ],
            insideApp: false
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomizedTables {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('testing the stories', { exact: false })).toBeVisible();
    });
    test('Should render layouts CustomizedTables3  Component', async () => {
        const props = {
            previewStories: () => {},
            navigate: () => {},
            onResponseScheduleStory: () => {},
            tableData: [
                {
                    apps: [
                        {
                            id: 26,
                            name: 'Integrated Demand Forecasting'
                        }
                    ],
                    id_token:
                        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMjgxOTg1NDEzLCJpYXQiOjE2NDE5ODU0MTMsInN1YiI6ImRhdGFfc3RvcnlfaWRfdG9rZW4iLCJzdG9yeV9pZCI6OTh9.BYt7HvND-4fSGqKmMjCCCokWXLOoTgQIGK3gSM9ZbcU',
                    story_access_users: ['user1', 'user2'],
                    story_content_count: 13,
                    story_desc: 'testing the stories',
                    story_id: 98,
                    story_name: ' test story 26/10/2021',
                    story_page_count: 3,
                    story_schedule_info: null,
                    story_schedule_status: 'No'
                }
            ],
            insideApp: false
        };

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomizedTables {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        act(() => {
            const editBtn = screen.getByLabelText('edit');
            fireEvent.click(editBtn);
            // fireEvent.click(screen.getByTitle("Schedule story"))
            fireEvent.click(screen.getByTitle('Click to preview published story'));
        });
        // expect(screen.getByLabelText('close')).toBeInTheDocument()
        // fireEvent.click(screen.getByLabelText('close'))
        //expect(screen.getByText('Layout Details', { exact: false })).toBeInTheDocument()
    });

    test('Should render layouts CustomizedTables4  Component', async () => {
        const props = {
            previewStories: () => {},
            navigate: () => {},
            onResponseScheduleStory: () => {},
            tableData: [
                {
                    apps: [
                        {
                            id: 26,
                            name: 'Integrated Demand Forecasting'
                        }
                    ],
                    id_token:
                        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMjgxOTg1NDEzLCJpYXQiOjE2NDE5ODU0MTMsInN1YiI6ImRhdGFfc3RvcnlfaWRfdG9rZW4iLCJzdG9yeV9pZCI6OTh9.BYt7HvND-4fSGqKmMjCCCokWXLOoTgQIGK3gSM9ZbcU',
                    story_access_users: ['user1', 'user2'],
                    story_content_count: 13,
                    story_desc: 'testing the stories',
                    story_id: 98,
                    story_name: ' test story 26/10/2021',
                    story_page_count: 3,
                    story_schedule_info: null,
                    story_schedule_status: 'No'
                }
            ],
            insideApp: false
        };

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomizedTables {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        act(() => {
            const editBtn = screen.getByLabelText('edit');
            fireEvent.click(editBtn);
            // fireEvent.click(screen.getByTitle("Schedule story"))
        });
        // expect(screen.getByLabelText('schedule')).toBeInTheDocument()
        // fireEvent.click(screen.getByLabelText('schedule'))
    });
});
