import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Design from '../../../components/Admin/Design';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import {
    getAjaxProjects,
    getDesignData,
    getWidgetData,
    getArtifactsData,
    downloadBlueprintCode,
    createProject,
    saveProjectBlueprint,
    getDesignModulesData
} from '../../../services/admin';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../services/admin', () => ({
    getDesignData: vi.fn(),
    getWidgetData: vi.fn(),
    getAjaxProjects: vi.fn(),
    getArtifactsData: vi.fn(),
    downloadBlueprintCode: vi.fn(),
    createProject: vi.fn(),
    saveProjectBlueprint: vi.fn(),
    getDesignModulesData: vi.fn()
}));

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render AppAdmin Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Design {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render AppAdmin Component with app_info blueprint prop as /design/', () => {
        const props1 = {
            ...props,
            app_info: {
                ...props.app_info,
                blueprint_link: '/app/case-studies/design/case-studies/'
            },
            from_execution: false
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Design {...props1} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render AppAdmin Component with app_info blueprint prop as case-studies and design', () => {
        const props1 = {
            ...props,
            app_info: {
                ...props.app_info,
                blueprint_link: '/design/case-studies/'
            },
            from_execution: false
        };

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Design {...props1} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(
            screen.getByText('Please connect to a blueprint using the Platform Utils.')
        );
    });

    test('Should render AppAdmin Component with app_info blueprint prop as case-studies and design', () => {
        const props1 = {
            ...props,
            app_info: {
                ...props.app_info,
                blueprint_link: '/design/case-studies/design/test/test'
            },
            from_execution: false
        };

        getDesignData.mockImplementation(({ callback }) => callback({ status: 'error' }));
        getWidgetData.mockImplementation(({ callback }) => callback({ status: 'error' }));

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Design {...props1} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render AppAdmin Component with app_info blueprint prop as case-studies/design and response satisfying resp [data] [data]', () => {
        const props1 = {
            ...props,
            app_info: {
                ...props.app_info,
                blueprint_link: '/design/case-studies/design/test/test'
            },
            from_execution: false
        };

        getDesignData.mockImplementation(({ callback }) =>
            callback({ status: 'message', data: { data: [{ id: 1, cated_at: '10/20' }] } })
        );
        getWidgetData.mockImplementation(({ callback }) => callback({ status: 'error' }));

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Design {...props1} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render AppAdmin Component with app_info blueprint prop as case-studies/design and response not satisfying resp [data] [data]', () => {
        const props1 = {
            ...props,
            app_info: {
                ...props.app_info,
                blueprint_link: '/design/case-studies/design/test/test'
            },
            from_execution: false
        };

        getDesignData.mockImplementation(({ callback }) =>
            callback({ status: 'message', data: { test: [{ id: 1, cated_at: '10/20' }] } })
        );
        getWidgetData.mockImplementation(({ callback }) => callback({ status: 'error' }));
        getArtifactsData.mockImplementation(({ callback }) =>
            callback({ status: 'message', data: { test: 'testit' } })
        );

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Design {...props1} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByTitle('Toggle design information'));
        fireEvent.click(screen.getByTitle('Toggle design information'));
    });
    it('should render nothing when loading is true', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Design loading={true} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByRole('button')).toBeNull();
    });
});

const props = {
    app_info: {
        id: 26,
        name: 'Integrated Demand Forecasting',
        blueprint_link: '/projects/2/design'
    },
    from_execution: true
};
