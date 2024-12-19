import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AppAdminIterations from '../../../components/Admin/Iterations';
import { getIterations, getIterationTags, getIterationResults } from '../../../services/admin';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../services/admin', () => ({
    getIterations: vi.fn(),
    getIterationTags: vi.fn(),
    getIterationResults: vi.fn()
}));

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DownloadWorkBook with case-studies URI Component and getIterations and status error response', async () => {
        getIterationTags.mockImplementation(({ callback }) => callback({ data: 'message' }));
        getIterations.mockImplementation(({ callback }) => callback({ status: 'error' }));

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminIterations
                        screen_id={1}
                        app_id={1}
                        params={{}}
                        app_info={{ config_link: 'test/case-studies/test2/testing/3/testing/2' }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts DownloadWorkBook Component without data as key in response from getIterationsResults', async () => {
        getIterationTags.mockImplementation(({ callback }) => callback({ data: ['test1, test2'] }));
        getIterations.mockImplementation(({ callback }) =>
            callback({ status: 'message', data: { data: [{ id: 1, cated_at: '10/20' }] } })
        );
        getIterationResults.mockImplementation(({ callback }) =>
            callback({ data1: ['test1, test2'] })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminIterations
                        screen_id={1}
                        app_id={1}
                        params={{}}
                        app_info={{ config_link: 'test/test1/test2/testing/testing/testing/3/5' }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        // expect(screen.getByTitle('Results')).toBeInTheDocument()
        fireEvent.click(screen.getByTitle('Results'));
    });

    test('Should render layouts DownloadWorkBook Component with data as key in getIterationsResults and visualresults with data and layout key name', async () => {
        getIterationTags.mockImplementation(({ callback }) => callback({ data: ['test1, test2'] }));
        getIterations.mockImplementation(({ callback }) =>
            callback({ status: 'message', data: { data: [{ id: 1, cated_at: '10/20' }] } })
        );
        getIterationResults.mockImplementation(({ callback }) =>
            callback({ data: [{ visual_results: { data: 'test', layout: 'filtered' } }] })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminIterations
                        screen_id={1}
                        app_id={1}
                        params={{}}
                        app_info={{ config_link: 'test/test1/test2/testing/testing/testing/3/5' }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        // expect(screen.getByTitle('Results')).toBeInTheDocument()
        fireEvent.click(screen.getByTitle('Results'));
    });

    test('Should render layouts DownloadWorkBook Component with data as key in getIterationsResults with visual result as Object', async () => {
        getIterationTags.mockImplementation(({ callback }) => callback({ data: ['test1, test2'] }));
        getIterations.mockImplementation(({ callback }) =>
            callback({ status: 'message', data: { data: [{ id: 1, cated_at: '10/20' }] } })
        );
        getIterationResults.mockImplementation(({ callback }) =>
            callback({ data: [{ visual_results: { layout: 'filtered' } }] })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminIterations
                        screen_id={1}
                        app_id={1}
                        params={{}}
                        app_info={{ config_link: 'test/test1/test2/testing/testing/testing/3/5' }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        // expect(screen.getByTitle('Results')).toBeInTheDocument()
        fireEvent.click(screen.getByTitle('Results'));
    });

    test('Should render layouts DownloadWorkBook Component with data as key in getIterationsResult without visualeffect key in response', async () => {
        getIterationTags.mockImplementation(({ callback }) => callback({ data: ['test1, test2'] }));
        getIterations.mockImplementation(({ callback }) =>
            callback({ status: 'message', data: { data: [{ id: 1, cated_at: '10/20' }] } })
        );
        getIterationResults.mockImplementation(({ callback }) =>
            callback({ data: [{ visual_results: ['test'] }] })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminIterations
                        screen_id={1}
                        app_id={1}
                        params={{}}
                        app_info={{ config_link: 'test/test1/test2/testing/testing/testing/3/5' }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        // expect(screen.getByTitle('Results')).toBeInTheDocument()
        fireEvent.click(screen.getByTitle('Results'));
    });

    // test('Should render layouts DownloadWorkBook with case-studies URI Component and getIterations and status error response',async () => {

    //     getIterationTags.mockImplementation(({callback })  => callback({ data: "message" }));
    //     getIterations.mockImplementation(({ callback }) => callback({status: "message", data: {data:[{id: 1, created_at: "10/20", }]} }));

    //     const { getByText, debug } = render(
    //         <CustomThemeContextProvider>
    //             <Router history={history}>
    //                 <AppAdminIterations screen_id={1} app_id={1} params={{}} app_info={{ config_link: "test/case-studies/test2/testing/3/testing/2" }} />
    //             </Router>
    //         </CustomThemeContextProvider>
    //     )

    // });
});
