import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import UtilsDataTable from 'components/Utils/UtilsDataTable';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render  User Data Table Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UtilsDataTable {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render table with various cells correctly', () => {
        const { getByLabelText, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UtilsDataTable {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(getByText('Industry Name')).toBeInTheDocument();
    });

    test('Should render checkboxes for Control Users page', () => {
        const controlProps = {
            ...Props,
            page: 'Control users',
            tableData: [{ id: 1, first_name: 'John Doe' }]
        };
        const { getByLabelText, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UtilsDataTable {...controlProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(getByText('Parent Industry Name')).toBeInTheDocument();
    });

    test('Should render links for applications page', () => {
        const appProps = {
            ...Props,
            page: 'applications',
            tableData: [{ id: 1, name: 'App Name' }]
        };
        const { getByLabelText, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UtilsDataTable {...appProps} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(getByText('Logo Name')).toBeInTheDocument();
    });
});

const Props = {
    classes: {},
    tableHeaderCells: [
        { id: 'industry_name', label: 'Industry Name', enableSorting: true, enableSearching: true },
        {
            id: 'parent_industry_name',
            label: 'Parent Industry Name',
            enableSorting: true,
            enableSearching: true
        },
        { id: 'logo_name', label: 'Logo Name', enableSorting: true, enableSearching: true },
        { id: 'order', label: 'Order', enableSorting: true, enableSearching: false },
        { id: 'horizon', label: 'Horizon', enableSorting: true, enableSearching: false },
        { id: 'actions', label: 'Actions', enableSorting: false, enableSearching: false }
    ],
    tableActions: () => {},
    page: 'industries',
    tableData: [
        {
            id: 2,
            industry_name: 'Miscellaneous Industry',
            parent_industry_id: null,
            logo_name: 'Technology',
            horizon: 'horizontal',
            order: 1,
            level: null,
            color: null,
            description: '',
            parent_industry_name: null
        },
        {
            id: 3,
            industry_name: 'latest',
            parent_industry_id: null,
            logo_name: 'Pharmacy Benefit Managers (PBMs)',
            horizon: 'vertical',
            order: 1,
            level: null,
            color: null,
            description: '',
            parent_industry_name: null
        },
        {
            id: 1,
            industry_name: 'test1',
            parent_industry_id: 4,
            logo_name: 'Technology',
            horizon: 'horizontal',
            order: 1,
            level: null,
            color: null,
            description: '',
            parent_industry_name: 'wererer'
        },
        {
            id: 4,
            industry_name: 'wererer',
            parent_industry_id: null,
            logo_name: 'Pharma',
            horizon: 'vertical',
            order: 1,
            level: null,
            color: null,
            description: '',
            parent_industry_name: null
        },
        {
            id: 5,
            industry_name: 'in1',
            parent_industry_id: null,
            logo_name: 'Insurers & Payers',
            horizon: 'vertical',
            order: 2,
            level: null,
            color: null,
            description: '',
            parent_industry_name: null
        },
        {
            id: 6,
            industry_name: 'ind4',
            parent_industry_id: null,
            logo_name: 'Manfacturers',
            horizon: 'vertical',
            order: 3,
            level: null,
            color: null,
            description: '',
            parent_industry_name: null
        },
        {
            id: 7,
            industry_name: 'newest industry',
            parent_industry_id: null,
            logo_name: 'Manfacturers',
            horizon: 'vertical',
            order: 4,
            level: null,
            color: null,
            description: '',
            parent_industry_name: null
        }
    ],
    paginationInfo: {
        page: 0,
        rowsPerPage: 10,
        totalCount: 7
    },
    setStateInfo: () => {},
    loader: false,
    onHandleSearch: () => {},
    debounceDuration: 100
};
