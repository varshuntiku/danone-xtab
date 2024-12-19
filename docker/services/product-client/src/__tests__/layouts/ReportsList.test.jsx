import React, { useContext, useState } from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ReportsList from '../../layouts/ReportsList';
import { Provider } from 'react-redux';
import store from 'store/store';
import { logMatomoEvent } from '../../services/matomo';
import Tab from '@material-ui/core/Tab';
import { Button } from '@material-ui/core';
import { vi } from 'vitest';

const history = createMemoryHistory();
global.open = vi.fn();

// history.push = vi.fn()
vi.mock('../../services/matomo', () => ({
    logMatomoEvent: vi.fn()
}));

vi.mock('services/reports.js', () => ({
    getStories: vi.fn(({ callback }) => {
        const stories = {
            my_stories: [
                {
                    apps: [
                        {
                            id: 26,
                            name: 'Integrated Demand Forecasting'
                        }
                    ],
                    story_id: 98,
                    id_token:
                        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMjgyMDc4MjcxLCJpYXQiOjE2NDIwNzgyNzEsInN1YiI6ImRhdGFfc3RvcnlfaWRfdG9rZW4iLCJzdG9yeV9pZCI6OTh9.NACcYdRqAruekoKQHGGxfr3ZraOJaONkivyrDVQDycs',
                    story_name: ' test story 26/10/2021',
                    story_desc: 'testing the stories',
                    story_content_count: 13,
                    story_schedule_status: 'Yes',
                    story_schedule_info:
                        '{"isScheduled": true, "noOfOccurances": "1", "frequency": "Once", "startDate": "2022-01-12T11:03:49.834Z", "endDate": "2022-01-13T11:03:00.000Z", "time": "2022-01-12T11:03:49.834Z", "days": ["T"], "occuringOn": "", "occuringAt": ""}',
                    story_access_users: [],
                    story_page_count: 3
                },
                {
                    apps: [
                        {
                            id: 26,
                            name: 'Integrated Demand Forecasting'
                        }
                    ],
                    story_id: 95,
                    id_token:
                        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMjgyMDc4MjcxLCJpYXQiOjE2NDIwNzgyNzEsInN1YiI6ImRhdGFfc3RvcnlfaWRfdG9rZW4iLCJzdG9yeV9pZCI6OTV9.ouR_BIdMwOsbidbhAfOpjRzaiF2Q-3jWTf2e2-W4KrI',
                    story_name: 'Forecasting - Demand Overview',
                    story_desc: 'Demand Overview',
                    story_content_count: 3,
                    story_schedule_status: 'Yes',
                    story_schedule_info:
                        '{"isScheduled": true, "noOfOccurances": "", "frequency": "Once", "startDate": "2021-10-28T12:52:29.069Z", "endDate": "2021-10-28T12:52:29.069Z", "time": "2021-10-28T13:00:29.069Z", "days": [], "occuringOn": "", "occuringAt": ""}',
                    story_access_users: [],
                    story_page_count: 1
                }
            ],
            accessed_stories: []
        };
        callback(stories);
    })
}));

vi.mock('components/storyDownloadStatusTable/StoryDownloadStatusTable', async () => {
    const functions = await vi.importActual(
        'components/storyDownloadStatusTable/StoryDownloadStatusTable'
    );
    return {
        ...functions,
        default: (props) => <></>
    };
});
vi.mock('components/CodxCircularLoader', () => ({
    default: (props) => {
        return (
            <>
                <p>Codx Circular Loader</p>
            </>
        );
    }
}));

vi.mock('components/custom/table.jsx', async () => {
    const functions = await vi.importActual('components/custom/table.jsx');
    return {
        ...functions,
        default: ({ navigate, previewStories, onResponseScheduleStory }) => {
            // const {onDeleteStoryDone} = useContext(DeleteStoryContext)
            return (
                <>
                    <button
                        onClick={() => {
                            navigate({ story_id: 1 });
                        }}
                    >
                        navigate-to
                    </button>
                    <button
                        onClick={() => {
                            previewStories({ id_token: 'idtoken' });
                        }}
                    >
                        #previewStories
                    </button>
                    <button onClick={onResponseScheduleStory}>#onResponseScheduleStory</button>
                    {/* <button onClick={onDeleteStoryDone}>#DeleteStoryContext</button> */}
                </>
            );
        }
    };
});

vi.mock('components/CreateReportsDialog.jsx', () => ({
    default: ({ onResponseAddORCreateStory, onClose }) => {
        return (
            <>
                <p>Create Reports Dialog</p>
                <button onClick={onResponseAddORCreateStory}>onResponseAddORCreateStory</button>
                <button onClick={onClose}>create-report-close</button>
            </>
        );
    }
}));

vi.mock('layouts/PreviewReports.jsx', () => ({
    default: ({ onClose }) => {
        return (
            <>
                <p>Preview Stories</p>
                <button onClick={onClose}>preview-report-close</button>
            </>
        );
    }
}));

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts Reports Component', async () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ReportsList
                            match={{ params: { story_id: 1 } }}
                            app_info={{ id: 1 }}
                            location={{ state: { appId: 1 } }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts Reports Component create new story', async () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ReportsList
                            match={{ params: { story_id: 1 } }}
                            location={{ state: { appId: 1 } }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const button = screen.getByText('Create new Story');
        fireEvent.click(button);
        expect(screen.getByText('Create Reports Dialog', { exact: false })).toBeVisible();
        fireEvent.click(screen.getByText('onResponseAddORCreateStory'));
        const closebtn = screen.getByText('create-report-close');
        fireEvent.click(closebtn);
        expect(
            screen.queryByDisplayValue('Create Reports Dialog', { exact: false })
        ).not.toBeInTheDocument();
    });

    test('Should render layouts Reports Component CustomizedTables', async () => {
        history.push = vi.fn();
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ReportsList
                            match={{ params: { story_id: 1 } }}
                            location={{ state: { appId: 1 } }}
                            history={history}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        let button = screen.getByText('navigate-to');
        fireEvent.click(button);
        expect(history.push).toHaveBeenCalled();
        button = screen.getByText('#previewStories');
        fireEvent.click(button);
        expect(global.open).toHaveBeenCalled();
        button = screen.getByText('#onResponseScheduleStory');
        fireEvent.click(button);
        expect(screen.queryByDisplayValue('Stories', { exact: false })).not.toBeInTheDocument();
    });

    test('Should render layouts Reports Component PreviewStories', async () => {
        history.push = vi.fn();
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ReportsList
                            match={{ params: { story_id: 1 } }}
                            location={{ state: { appId: 1 } }}
                            history={history}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        let button = screen.getByText('navigate-to');
        fireEvent.click(button);
        expect(history.push).toHaveBeenCalled();
        button = screen.getByText('#previewStories');
        fireEvent.click(button);
    });

    test('should render preview stories', () => {
        history.push = vi.fn();
        history.goBack = vi.fn();
        ReportsList.onTabsChange = vi.fn();
        const setStateSpy = vi.spyOn(ReportsList, 'onTabsChange');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ReportsList
                            match={{ params: { story_id: 1, previewStories: true } }}
                            location={{ state: { appId: 1 } }}
                            history={history}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const button = screen.getByTestId('navigateback');
        fireEvent.click(button);
        expect(history.goBack).toHaveBeenCalled();
    });
});
