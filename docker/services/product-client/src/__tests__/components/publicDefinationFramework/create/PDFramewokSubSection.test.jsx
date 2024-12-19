import React from 'react';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import store from 'store/store';
import PDFramewokSubSection from '../../../../components/porblemDefinitionFramework/create/PDFramewokSubSection';
import { vi } from 'vitest';
const history = createMemoryHistory();

describe('Codex Product test for Section Component design', () => {
    afterEach(cleanup);

    test('Should render Sub Section Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFramewokSubSection
                            onNext={onNext}
                            onChange={onChange}
                            onFinish={onFinish}
                            {...props}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render Sub Section Input Field', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFramewokSubSection
                            onNext={onNext}
                            onChange={onChange}
                            onFinish={onFinish}
                            {...props}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const inputElement = screen.getByLabelText('Problem Area');
        fireEvent.change(inputElement, { target: { value: 'test' } });
        expect(inputElement.value).toBe('test');
    });
});

const onNext = vi.fn();
const onChange = vi.fn();
const onFinish = vi.fn();

const props = {
    saveProcessing: false,

    completionMap: {
        projectDetails: false,
        stateProblem: false,
        understandStatusQuo: false,
        understandConstraints: false,
        defineObjectiveSuccessCriteria: false
    },

    project: {
        id: 0,
        name: '',
        industry: '',
        project_status: 1,
        assignees: null,
        reviewer: null,
        account: '',
        problem_area: '',
        content: {},
        origin: 'PDF'
    },

    subSection: {
        name: 'projectDetails',
        title: 'Project Details',
        desc: 'Fill in the basic details of the project',
        header: 'Project Details',
        contentType: 'project-details-form',
        content: {
            title: '',
            fields: [
                {
                    id: 1,
                    name: 'account',
                    label: 'Account name',
                    type: 'text',
                    variant: 'outlined',
                    margin: 'none',
                    fullWidth: true,
                    grid: 4
                },
                {
                    id: 2,
                    name: 'name',
                    label: 'Project Name *',
                    type: 'text',
                    variant: 'outlined',
                    margin: 'none',
                    fullWidth: true,
                    grid: 4
                },
                {
                    id: 3,
                    name: 'industry',
                    label: 'Domain *',
                    type: 'select',
                    options: [
                        'Airlines',
                        'Automotive',
                        'Banking',
                        'CPG',
                        'Entertainment',
                        'E Commerce',
                        'Insurance',
                        'Pharmaceuticals',
                        'Retail',
                        'Technology',
                        'Telecom'
                    ],
                    variant: 'outlined',
                    margin: 'none',
                    fullWidth: true,
                    grid: 4
                },
                {
                    id: 5,
                    name: 'problem_area',
                    label: 'Problem Area',
                    type: 'text',
                    variant: 'outlined',
                    margin: 'none',
                    fullWidth: true,
                    grid: 4
                },
                {
                    id: 6,
                    name: 'assignees',
                    label: 'Assign to',
                    type: 'select',
                    variant: 'outlined',
                    search: true,
                    options: [
                        {
                            id: 2,
                            name: 'Ashwjit Mahadik',
                            email: 'ashwjit.mahadik@themathcompany.com'
                        },
                        {
                            id: 1,
                            name: 'Shridhar Guntury',
                            email: 'shridhar@themathcompany.com'
                        }
                    ],
                    optionValueKey: 'id',
                    optionLabelKey: 'name',
                    margin: 'none',
                    multiple: true,
                    fullWidth: true,
                    grid: 4
                },
                {
                    id: 7,
                    name: 'reviewer',
                    label: 'Reviewer',
                    type: 'select',
                    variant: 'outlined',
                    search: true,
                    options: [
                        {
                            id: 2,
                            name: 'Ashwjit Mahadik',
                            email: 'ashwjit.mahadik@themathcompany.com'
                        },
                        {
                            id: 1,
                            name: 'Shridhar Guntury',
                            email: 'shridhar@themathcompany.com'
                        }
                    ],
                    optionValueKey: 'id',
                    optionLabelKey: 'name',
                    margin: 'none',
                    multiple: false,
                    fullWidth: true,
                    grid: 4
                }
            ]
        },
        data: {}
    },
    lastSection: false,
    last: false
};
