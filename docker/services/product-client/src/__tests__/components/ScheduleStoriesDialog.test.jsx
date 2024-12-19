import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ScheduleStoriesDialog from '../../components/ScheduleStoriesDialog';
import { Provider } from 'react-redux';
import store from 'store/store';
import { act } from 'react-dom/test-utils';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render ScheduleStoriesDialog Component', () => {
        const match = {
            params: {
                industry: 'Codx Revenue Management',
                app_id: 26,
                logout: false
            }
        };
        const storyData = {
            apps: [
                {
                    id: 26,
                    name: 'Integrated Demand Forecasting'
                }
            ],
            story_id: 97,
            id_token:
                'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMjc1ODU0MTMzLCJpYXQiOjE2MzU4NTQxMzMsInN1YiI6ImRhdGFfc3RvcnlfaWRfdG9rZW4iLCJzdG9yeV9pZCI6OTd9.uv454wEsXblHjPNri1c_myo6_wnIiP28PiAa5w_ZmUY',
            story_name: 'test for demo 25/10/2021',
            story_desc: '',
            story_content_count: 4,
            story_schedule_status: 'No',
            story_schedule_info: null,
            story_access_users: [],
            story_page_count: 3
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScheduleStoriesDialog match={match} storyData={storyData} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render ScheduleStoriesDialog1 Component', () => {
        const match = {
            params: {
                industry: 'Codx Revenue Management',
                app_id: 26,
                logout: false
            }
        };
        const storyData = {
            apps: [
                {
                    id: 26,
                    name: 'Integrated Demand Forecasting'
                }
            ],
            story_id: 97,
            id_token:
                'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMjc1ODU0MTMzLCJpYXQiOjE2MzU4NTQxMzMsInN1YiI6ImRhdGFfc3RvcnlfaWRfdG9rZW4iLCJzdG9yeV9pZCI6OTd9.uv454wEsXblHjPNri1c_myo6_wnIiP28PiAa5w_ZmUY',
            story_name: 'test for demo 25/10/2021',
            story_desc: 'testing the stories',
            story_content_count: 4,
            story_schedule_status: 'Yes',
            story_schedule_info:
                '{"isScheduled": true, "frequency": "Once", "startDate": "2022-01-12T11:03:49.834Z", "endDate": "2022-01-13T11:03:00.000Z", "time": "2022-01-12T11:03:49.834Z", "days": ["T"], "occuringOn": "", "occuringAt": ""}',
            story_access_users: [],
            story_page_count: 3
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ScheduleStoriesDialog match={match} storyData={storyData} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        const scheduleStory = screen.getByRole('checkbox');
        act(() => {
            scheduleStory.click();
            fireEvent.change(scheduleStory, { target: { checked: true } });
        });

        expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
        // fireEvent.click(screen.getByRole('button',{ name: 'submit'}))
    });
    test('Should render ScheduleStoriesDialog2 Component', () => {
        const match = {
            params: {
                industry: 'Codx Revenue Management',
                app_id: 26,
                logout: false
            }
        };
        const storyData = {
            apps: [
                {
                    id: 26,
                    name: 'Integrated Demand Forecasting'
                }
            ],
            story_id: 97,
            id_token:
                'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMjc1ODU0MTMzLCJpYXQiOjE2MzU4NTQxMzMsInN1YiI6ImRhdGFfc3RvcnlfaWRfdG9rZW4iLCJzdG9yeV9pZCI6OTd9.uv454wEsXblHjPNri1c_myo6_wnIiP28PiAa5w_ZmUY',
            story_name: 'test for demo 25/10/2021',
            story_desc: 'testing the stories',
            story_content_count: 4,
            story_schedule_status: 'Yes',
            story_schedule_info:
                '{"isScheduled": true, "frequency": "Once", "startDate": "2022-01-12T11:03:49.834Z", "endDate": "2022-01-13T11:03:00.000Z", "time": "2022-01-12T11:03:49.834Z", "days": ["T"], "occuringOn": "", "occuringAt": ""}',
            story_access_users: [],
            story_page_count: 3
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScheduleStoriesDialog match={match} storyData={storyData} onClose={() => {}} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByLabelText('close')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('close'));
    });

    test('Should render ScheduleStoriesDialog2 Component', () => {
        const match = {
            params: {
                industry: 'Codx Revenue Management',
                app_id: 26,
                logout: false
            }
        };
        const storyData = {
            apps: [
                {
                    id: 26,
                    name: 'Integrated Demand Forecasting'
                }
            ],
            story_id: 97,
            id_token:
                'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMjc1ODU0MTMzLCJpYXQiOjE2MzU4NTQxMzMsInN1YiI6ImRhdGFfc3RvcnlfaWRfdG9rZW4iLCJzdG9yeV9pZCI6OTd9.uv454wEsXblHjPNri1c_myo6_wnIiP28PiAa5w_ZmUY',
            story_name: 'test for demo 25/10/2021',
            story_desc: 'testing the stories',
            story_content_count: 4,
            story_schedule_status: 'Yes',
            story_schedule_info:
                '{"isScheduled": true, "frequency": "Once", "startDate": "2022-01-12T11:03:49.834Z", "endDate": "2022-01-13T11:03:00.000Z", "time": "2022-01-12T11:03:49.834Z", "days": ["T"], "occuringOn": "", "occuringAt": ""}',
            story_access_users: [],
            story_page_count: 3
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ScheduleStoriesDialog
                            match={match}
                            storyData={storyData}
                            onClose={() => {}}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        //fireEvent.click(screen.getByLabelText('submit'))
    });
});

const Props = {
    onClose: () => {},
    onResponseScheduleStories: () => {},
    match: {
        params: {
            industry: 'Codx Revenue Management',
            app_id: 26,
            logout: false
        }
    },
    storyData: {
        apps: [
            {
                id: 26,
                name: 'Integrated Demand Forecasting'
            }
        ],
        story_id: 97,
        id_token:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMjc1ODU0MTMzLCJpYXQiOjE2MzU4NTQxMzMsInN1YiI6ImRhdGFfc3RvcnlfaWRfdG9rZW4iLCJzdG9yeV9pZCI6OTd9.uv454wEsXblHjPNri1c_myo6_wnIiP28PiAa5w_ZmUY',
        story_name: 'test for demo 25/10/2021',
        story_desc: '',
        story_content_count: 4,
        story_schedule_status: 'No',
        story_schedule_info: null,
        story_access_users: [],
        story_page_count: 3
    }
};
