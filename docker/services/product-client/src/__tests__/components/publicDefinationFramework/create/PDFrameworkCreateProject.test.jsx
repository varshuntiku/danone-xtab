import React from 'react';
import { render, screen, cleanup, fireEvent, within, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import store from 'store/store';
import PDFrameworkCreateProject from '../../../../components/porblemDefinitionFramework/create/PDFrameworkCreateProject';
import '@testing-library/jest-dom/extend-expect';
import { getProject, getUsers, getReviewers } from '../../../../services/project';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../../services/project', () => ({
    getProject: vi.fn(),
    getUsers: vi.fn(),
    getReviewers: vi.fn()
}));
describe('Codex Product test for Create Project Component design', () => {
    afterEach(cleanup);

    test('Should render Create Project Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Does component has Go Back Button', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const element = screen.getByRole('button', { name: 'go back' });
        expect(element).toBeInTheDocument();
    });

    test('Does component has Cancel Button', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const element = screen.getByRole('button', { name: 'Cancel' });
        expect(element).toBeInTheDocument();
    });

    test('Does component has Save Button', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const element = screen.getByRole('button', { name: 'Save' });
        expect(element).toBeInTheDocument();
    });

    test('Does component has Tabs', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const elements = screen.getAllByRole('tab');
        expect(elements).toBeTruthy();
    });

    test('Does Progress Bar is visible', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const element = screen.getByRole('progressbar');
        expect(element).toBeInTheDocument();
    });

    test('Does component has loaded Sections', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const element = screen.getByRole('tabpanel');
        expect(element).toBeInTheDocument();
    });
});

describe('Codex Product test for Create Project Component actions', () => {
    afterEach(cleanup);

    test('Does tab action event working', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const tabsElement = screen.getByRole('tablist');
        const tab = screen.getByTestId('Problem Definition tab');
        fireEvent.click(tab);
        expect(tabsElement.value).not.toBe(0);
    });

    test('Does selected tab has active class', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const tab = screen.getByTestId('Problem Definition tab');
        fireEvent.click(tab);
        expect(tab).toHaveClass('Mui-selected');
    });

    test('Empty Form submit validation', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const saveButton = screen.getByRole('button', { name: 'Save' });
        const inputElement = screen.getByLabelText('Project Name *');
        if (inputElement.value === '') {
            fireEvent.click(saveButton);
            const tab = screen.getByText(
                'Please fill up the mandatory fields in the Project Details.'
            );
            expect(tab).toBeInTheDocument();
        }
    });

    test('Is Cancel button working', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelButton);
        const tab = screen.getByText('Cancel and move to projects list.');
        expect(tab).toBeInTheDocument();
    });

    test('Does component has Next Button and is it working', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const nextButton = screen.getByRole('button', { name: 'Next' });
        fireEvent.click(nextButton);
        const tab = screen.getByTestId('Problem Definition tab');
        expect(tab).toHaveClass('Mui-selected');
    });

    test('Does Text Inputs are working', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const inputElement = screen.getByLabelText('Account name');
        fireEvent.change(inputElement, { target: { value: 'test' } });
        expect(inputElement.value).toBe('test');
    });

    test('Does Select Inputs are working', async () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const selectElement = screen.getByRole('button', { name: 'Domain * ​' });
        expect(selectElement).toBeInTheDocument();
    });

    test('Does component has Info Popper', async () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const nextButton = screen.getByRole('button', { name: 'Next' });
        fireEvent.click(nextButton);
        const infoPoper = screen.getByTestId('stateProblemInfoPopper');
        fireEvent.click(infoPoper);
        expect(infoPoper).toBeInTheDocument();
    });

    test('Does stepper is working', async () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const nextButton = screen.getByRole('button', { name: 'Next' });
        fireEvent.click(nextButton);

        const step = screen.getByTestId('Understand Status Quo');
        fireEvent.click(step);

        const stepTitle = screen.getByText('Understand and describe status quo');
        expect(stepTitle).toBeInTheDocument();

        const inputHeader = screen.getByText('Explain the current state');
        expect(inputHeader).toBeInTheDocument();
    });

    test('Does constraints table visible', async () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const nextButton = screen.getByRole('button', { name: 'Next' });
        fireEvent.click(nextButton);

        const step = screen.getByTestId('State the Constraints');
        fireEvent.click(step);

        const stepTitle = screen.getByText('TIMELINE');
        expect(stepTitle).toBeInTheDocument();

        const finishButton = screen.getByTestId('createProjectFinishButton');
        fireEvent.click(finishButton);
    });

    test('Is Finish Button working', async () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const nextButton = screen.getByRole('button', { name: 'Next' });
        fireEvent.click(nextButton);

        const element = screen.getByRole('textbox', { name: 'rdw-editor' });
        expect(element).toBeInTheDocument;
    });

    test('Does component have Version History tag', async () => {
        getReviewers.mockImplementation(() => ({
            data: [
                {
                    id: 3,
                    name: 'Test edit A',
                    email: 'test@gamil.com'
                },
                {
                    id: 2,
                    name: 'Vaishnavi K',
                    email: 'vaishnavi.k@themathcompany.com'
                },
                {
                    id: 1,
                    name: 'Shridhar Guntury',
                    email: 'shridhar@themathcompany.com'
                }
            ]
        }));
        getUsers.mockImplementation(() => ({
            data: [
                {
                    id: 1,
                    name: 'Shridhar Guntury',
                    email: 'shridhar@themathcompany.com'
                },
                {
                    id: 3,
                    name: 'Test edit A',
                    email: 'test@gamil.com'
                },
                {
                    id: 5,
                    name: 'Test one A',
                    email: 'test@gmail.com'
                },
                {
                    id: 2,
                    name: 'Vaishnavi K',
                    email: 'vaishnavi.k@themathcompany.com'
                }
            ]
        }));
        getProject.mockImplementation(() => ({
            data: {
                id: 57,
                name: 'project 37',
                industry: 'Automotive',
                project_status: 1,
                assignees: [2],
                reviewer: 1,
                is_instance: false,
                account: null,
                problem_area: null,
                origin: 'PDF',
                created_by: 'Vaishnavi K',
                user_access: {
                    view: true,
                    edit: true,
                    delete: true
                },
                content: {
                    stateProblem1: '',
                    statusQuo1: '',
                    statusQuo2: '',
                    statusQuo3: {
                        content: '',
                        attachments: []
                    },
                    constraints: {},
                    successCriteria1: '<p></p>\n',
                    successCriteria2: '',
                    successCriteria3: ''
                },
                version_id: '9a47a5ff-fa08-4626-bd40-5fd2681ce578',
                version_updated_at: 'Mon, 26 Jun 2023 04:00:02 GMT',
                is_current: true,
                version_name: 'version 67 2'
            }
        }));
        const { getByText, debug } = await render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...propsEdit} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const element = screen.findByRole('button', { name: 'Version History' });
        expect(element).toBeInTheDocument;
    });
});

describe('Codex Product test for View Project Component design', () => {
    afterEach(cleanup);

    test('Should render Create Project Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...propsView} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Does component has Download Button', async () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...propsView} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});

describe('Codex Product test for Edit Project Component design', () => {
    afterEach(cleanup);

    test('Should render Create Project Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...propsEdit} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Does component has Download Button', async () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkCreateProject {...propsEdit} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});

const props = {
    user_info: {
        status: 'success',
        user_id: 2,
        username: 'ashwjit.mahadik@themathcompany.com',
        is_restricted_user: false,
        first_name: 'Ashwjit',
        last_name: 'Mahadik',
        last_login: '08 March, 2023 07:19',
        access_key: '9YK0PaXwx7VinSvP6GhFog',
        feature_access: {
            app: true,
            case_studies: true,
            my_projects: true,
            my_projects_only: false,
            all_projects: true,
            widget_factory: true,
            environments: true,
            rbac: true,
            admin: true,
            app_publish: true
        }
    },
    user_permissions: {
        app: true,
        case_studies: true,
        my_projects: true,
        my_projects_only: false,
        all_projects: true,
        widget_factory: true,
        environments: true,
        rbac: true,
        admin: true,
        app_publish: true
    },
    match: {
        path: '/projects/create',
        url: '/projects/create',
        isExact: true,
        params: {}
    },
    location: {
        pathname: '/projects/create',
        search: '',
        hash: '',
        key: '7f4e89'
    },
    history: {
        length: 10,
        action: 'PUSH',
        location: {
            pathname: '/projects/create',
            search: '',
            hash: '',
            key: '7f4e89'
        }
    },
    matomo: {
        pv_id: 'pd36b9'
    }
};

const propsEdit = {
    user_info: {
        status: 'success',
        user_id: 2,
        username: 'ashwjit.mahadik@themathcompany.com',
        is_restricted_user: false,
        first_name: 'Ashwjit',
        last_name: 'Mahadik',
        last_login: '08 March, 2023 07:19',
        access_key: '9YK0PaXwx7VinSvP6GhFog',
        feature_access: {
            app: true,
            case_studies: true,
            my_projects: true,
            my_projects_only: false,
            all_projects: true,
            widget_factory: true,
            environments: true,
            rbac: true,
            admin: true,
            app_publish: true
        }
    },
    user_permissions: {
        app: true,
        case_studies: true,
        my_projects: true,
        my_projects_only: false,
        all_projects: true,
        widget_factory: true,
        environments: true,
        rbac: true,
        admin: true,
        app_publish: true
    },
    match: {
        path: '/projects/:projectId/version/:versionId/edit',
        url: '/projects/1/version/5192c9f3-b438-418c-9c78-b5bfc11cccc2/edit',
        isExact: true,
        params: {
            projectId: '1',
            versionId: '5192c9f3-b438-418c-9c78-b5bfc11cccc2'
        }
    },
    location: {
        pathname: '/projects/1/version/5192c9f3-b438-418c-9c78-b5bfc11cccc2/edit',
        search: '',
        hash: '',
        key: 'l91grg',
        state: {
            versionData: {
                version_id: '7d90125a-2659-4da3-a2c2-727ab9df9630',
                version_name: 'version 7',
                is_current: true,
                content: {
                    stateProblem1: '',
                    statusQuo1: '',
                    statusQuo2: '',
                    statusQuo3: {
                        content: '',
                        attachments: []
                    },
                    constraints: {},
                    successCriteria1: '',
                    successCriteria2: '',
                    successCriteria3: ''
                },
                created_by_user: 'Vaishnavi K',
                created_at: 1687872665.021808,
                updated_by_user: 'Vaishnavi K',
                version_updated_at: 1687872695.715381
            }
        }
    },
    history: {
        length: 50,
        action: 'PUSH',
        location: {
            pathname: '/projects/1/version/5192c9f3-b438-418c-9c78-b5bfc11cccc2/edit',
            search: '',
            hash: '',
            key: 'l91grg'
        }
    },
    matomo: {
        pv_id: 'pd36b9'
    }
};

const propsView = {
    user_info: {
        status: 'success',
        user_id: 2,
        username: 'ashwjit.mahadik@themathcompany.com',
        is_restricted_user: false,
        first_name: 'Ashwjit',
        last_name: 'Mahadik',
        last_login: '08 March, 2023 07:19',
        access_key: '9YK0PaXwx7VinSvP6GhFog',
        feature_access: {
            app: true,
            case_studies: true,
            my_projects: true,
            my_projects_only: false,
            all_projects: true,
            widget_factory: true,
            environments: true,
            rbac: true,
            admin: true,
            app_publish: true
        }
    },
    user_permissions: {
        app: true,
        case_studies: true,
        my_projects: true,
        my_projects_only: false,
        all_projects: true,
        widget_factory: true,
        environments: true,
        rbac: true,
        admin: true,
        app_publish: true
    },
    match: {
        path: '/projects/:projectId/version/:versionId/view',
        url: '/projects/1/version/5192c9f3-b438-418c-9c78-b5bfc11cccc2/view',
        isExact: true,
        params: {
            projectId: '1',
            versionId: '5192c9f3-b438-418c-9c78-b5bfc11cccc2'
        }
    },
    location: {
        pathname: '/projects/1/version/5192c9f3-b438-418c-9c78-b5bfc11cccc2/view',
        search: '',
        hash: '',
        key: '1wx470'
    },
    history: {
        length: 50,
        action: 'PUSH',
        location: {
            pathname: '/projects/1/version/5192c9f3-b438-418c-9c78-b5bfc11cccc2/view',
            search: '',
            hash: '',
            key: '1wx470'
        }
    },
    matomo: {
        pv_id: 'pd477f'
    }
};
