import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AppMultipleSelect from '../../../components/AppWidgetMultiSelect/AppMultipleSelect.jsx';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../components/CustomSearchComponent/SearchComponent', () => {
    return {
        default: (props) => {
            let updatedValue = props.value;
            return (
                <>
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={(e) => {
                            updatedValue = e.target.value;
                        }}
                    ></input>
                    <button
                        onClick={() => {
                            props.onChangeWithDebounce(updatedValue);
                        }}
                        aria-label="search-filter"
                    >
                        Search
                    </button>
                </>
            );
        }
    };
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts AppMultipleSelect Component 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppMultipleSelect {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts AppMultipleSelect Component 2', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppMultipleSelect {...Props2} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts AppMultipleSelect Component 3', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppMultipleSelect {...Props3} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts AppMultipleSelect Component 4', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppMultipleSelect {...Props4} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render layouts AppMultipleSelect Component 5', () => {
        const props = {
            classes: {},
            item: 'filter',
            selectedValue: {
                filter: [1, 2, 3]
            },
            data: {
                widget_filter_hierarchy_key: 'filter',
                widget_filter_multiselect: true,
                widget_tag_value: [1, 2, 3, 4, 5]
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppMultipleSelect {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render layouts AppMultipleSelect Component 6', () => {
        const props = {
            classes: {},
            item: 'filter',
            selectedValue: {
                filter: [1, 2, 3]
            },
            data: {
                widget_filter_hierarchy_key: 'filter',
                widget_filter_multiselect: true,
                widget_tag_value: [1, 2, 3, 4, 5]
            },
            onChangeFilter: () => {}
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppMultipleSelect {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.queryAllByRole('checkbox')).not.toBeNull();
        const checkboxEl = screen.getAllByRole('checkbox')[0];
        checkboxEl.click();
        fireEvent.change(checkboxEl, { target: { value: true } });
    });

    test('Should render layouts AppMultipleSelect Component 7', () => {
        const props = {
            classes: {},
            item: 'filter',
            selectedValue: {
                filter: ['1', '2', '3']
            },
            data: {
                // widget_filter_hierarchy_key: 'filter',
                widget_filter_multiselect: true,
                widget_tag_value: ['1', '2', '3', '4', '5'],
                widget_filter_search: true
            },
            onChangeFilter: () => {}
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppMultipleSelect {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
        const searchBar = screen.getByPlaceholderText('Search');
        fireEvent.change(searchBar, { target: { value: '1' } });
        expect(screen.queryAllByRole('checkbox')).not.toBeNull();
        const checkboxEl = screen.getAllByRole('checkbox')[0];
        checkboxEl.click();
        fireEvent.change(checkboxEl, { target: { value: true } });
    });

    test('Should render layouts AppMultipleSelect Component 8', () => {
        const props = {
            classes: {},
            item: 'filter',
            selectedValue: {
                filter: ['1', '2', '3']
            },
            data: {
                // widget_filter_hierarchy_key: 'filter',
                widget_filter_multiselect: true,
                widget_tag_value: [
                    { value: '1', label: '1', color: '#FFFFFF', disabled: false },
                    { value: '2', label: '2', color: '#FFFFFF', disabled: false },
                    { value: '3', label: '3', color: '#FFFFFF', disabled: false },
                    { value: '4', label: '4', color: '#FFFFFF', disabled: true },
                    { value: '5', label: '5', color: '', disabled: true }
                ],
                widget_filter_search: true
            },
            onChangeFilter: () => {}
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppMultipleSelect {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
        const searchBar = screen.getByPlaceholderText('Search');
        fireEvent.change(searchBar, { target: { value: '1' } });
        expect(screen.queryAllByRole('checkbox')).not.toBeNull();
        const checkboxEl = screen.getAllByRole('checkbox')[0];
        checkboxEl.click();
        fireEvent.change(checkboxEl, { target: { value: true } });
    });

    test('Should render layouts AppMultipleSelect Component 9', () => {
        const props = {
            classes: {},
            item: 'filter',
            selectedValue: {
                filter: ['1', '2', '3']
            },
            data: {
                // widget_filter_hierarchy_key: 'filter',
                widget_filter_multiselect: false,
                widget_tag_value: ['1', '2', '3', '4', '5'],
                widget_filter_search: true
            },
            onChangeFilter: () => {}
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppMultipleSelect {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
        const searchBar = screen.getByPlaceholderText('Search');
        fireEvent.change(searchBar, { target: { value: '1' } });
        expect(screen.queryAllByRole('radio')).not.toBeNull();
        const checkboxEl = screen.getAllByRole('radio')[0];
        checkboxEl.click();
        fireEvent.change(checkboxEl, { target: { value: true } });
    });

    test('Should render layouts AppMultipleSelect Component 10', () => {
        const props = {
            classes: {},
            item: 'filter',
            selectedValue: {
                filter: ['1', '2', '3']
            },
            data: {
                // widget_filter_hierarchy_key: 'filter',
                widget_filter_multiselect: false,
                widget_tag_value: [
                    { value: '1', label: '1', color: '#FFFFFF', disabled: false },
                    { value: '2', label: '2', color: '#FFFFFF', disabled: false },
                    { value: '3', label: '3', color: '#FFFFFF', disabled: false },
                    { value: '4', label: '4', color: '#FFFFFF', disabled: true },
                    { value: '5', label: '5', color: '', disabled: true }
                ],
                widget_filter_search: true
            },
            onChangeFilter: () => {}
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppMultipleSelect {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
        const searchBar = screen.getByPlaceholderText('Search');
        fireEvent.change(searchBar, { target: { value: '1' } });
        expect(screen.queryAllByRole('radio')).not.toBeNull();
        const radioEl = screen.getAllByRole('radio')[0];
        radioEl.click();
        fireEvent.change(radioEl, { target: { value: true } });
        // expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
        // fireEvent.change(searchBar, { target: { value: '6' } })
        // expect(screen.getByText('No result found', { exact: false })).toBeInTheDocument()
    });

    test('Should render layouts AppMultipleSelect Component 11', () => {
        const props = {
            classes: {},
            item: 'filter',
            selectedValue: {
                filter: ['1', '2', '3']
            },
            data: {
                // widget_filter_hierarchy_key: 'filter',
                widget_filter_multiselect: true,
                widget_tag_value: ['1', '2', '3', '4', '5'],
                widget_filter_search: true
            },
            onChangeFilter: () => {}
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppMultipleSelect {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
        const searchBar = screen.getByPlaceholderText('Search');
        fireEvent.change(searchBar, { target: { value: '6' } });
        const searchBtn = screen.getByLabelText('search-filter');
        fireEvent.click(searchBtn);
        expect(screen.getByText('No result found', { exact: false })).toBeInTheDocument();
    });

    test('Should render layouts AppMultipleSelect Component 12', () => {
        const props = {
            classes: {},
            item: 'filter',
            selectedValue: {
                filter: ['1', '2', '3']
            },
            data: {
                // widget_filter_hierarchy_key: 'filter',
                widget_filter_multiselect: false,
                widget_tag_value: ['1', '2', '3', '4', '5'],
                widget_filter_search: true
            },
            onChangeFilter: () => {}
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppMultipleSelect {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
        const searchBar = screen.getByPlaceholderText('Search');
        fireEvent.change(searchBar, { target: { value: '6' } });
        const searchBtn = screen.getByLabelText('search-filter');
        fireEvent.click(searchBtn);
        expect(screen.getByText('No result found', { exact: false })).toBeInTheDocument();
    });

    // test('Should render layouts AppMultipleSelect Component 6', () => {
    //     const props = {
    //         classes: {},
    //         item: "filter",
    //         selectedValue: {
    //             filter: "key",
    //             params: 1
    //         },
    //         data: {
    //             widget_filter_hierarchy_key: "filter",
    //             widget_filter_multiselect: true,
    //             widget_filter_function: "fn",
    //             //widget_filter_function_parameter: "params",
    //             widget_tag_value: { "key": "random" }
    //         }
    //     }
    //     const { getByText, debug } = render(
    //         <CustomThemeContextProvider>
    //             <Router history={history}>
    //                 <AppMultipleSelect  {...props} />
    //             </Router>
    //         </CustomThemeContextProvider>
    //     )
    // });
    // test('Should render layouts AppMultipleSelect Component 7', () => {
    //     const props = {
    //         classes: {},
    //         item: "filter",
    //         selectedValue: {
    //             filter: "key",
    //             params: 1
    //         },
    //         data: {
    //             widget_filter_hierarchy_key: "filter",
    //             widget_filter_multiselect: true,
    //             //widget_filter_function: "fn",
    //             //widget_filter_function_parameter: "params",
    //             widget_tag_value: { "key": "yearly" }
    //         }
    //     }
    //     const { getByText, debug } = render(
    //         <CustomThemeContextProvider>
    //             <Router history={history}>
    //                 <AppMultipleSelect  {...props} />
    //             </Router>
    //         </CustomThemeContextProvider>
    //     )
    // });
});

test('Should render layouts AppMultipleSelect element range selector component', () => {
    const { getByText, debug } = render(
        <CustomThemeContextProvider>
            <Router history={history}>
                <AppMultipleSelect {...Props5} />
            </Router>
        </CustomThemeContextProvider>
    );
    expect(screen.getByText('To :')).toBeInTheDocument();
    expect(screen.getByText('From :')).toBeInTheDocument();
    expect(screen.queryAllByRole('label')).not.toBeNull();
    expect(screen.getAllByText('FW5-23')[0]).toBeInTheDocument();
});

const Props1 = {
    classes: {},
    item: 'filter',
    selectedValue: {
        filter: [1, 2, 3]
    },
    data: {
        widget_filter_hierarchy_key: 'filter',
        widget_filter_multiselect: true,
        widget_tag_value: [1, 2, 3, 4, 5]
    }
};

const Props2 = {
    classes: {},
    item: 'filter',
    selectedValue: {
        filter: [1]
    },
    data: {
        widget_filter_hierarchy_key: 'filter',
        widget_filter_multiselect: false,
        widget_tag_value: [1, 2, 3, 4, 5]
    }
};

const Props3 = {
    classes: {},
    item: 'filter',
    selectedValue: {
        filter: 'key',
        params: 1
    },
    data: {
        widget_filter_hierarchy_key: 'filter',
        widget_filter_multiselect: false,
        widget_filter_function: 'fn',
        widget_filter_function_parameter: 'params',
        widget_tag_value: { key: 'yearly' }
    }
};

const Props4 = {
    classes: {},
    item: 'filter',
    selectedValue: {
        filter: 'key',
        params: 1
    },
    data: {
        widget_filter_hierarchy_key: 'filter',
        widget_filter_multiselect: false,
        widget_filter_function: 'fn',
        widget_filter_function_parameter: 'params',
        widget_tag_value: { key: 'quaterly' }
    },
    searchText: '',
    onSearch: () => {}
};

const Props5 = {
    classes: {},
    item: 'Fiscal Week',
    selectedValue: {
        'Fiscal Week': ['FW4-23', 'FW5-23']
    },
    data: {
        widget_filter_index: 1,
        widget_filter_function: false,
        widget_filter_function_parameter: false,
        widget_filter_hierarchy_key: false,
        widget_filter_isall: false,
        widget_filter_multiselect: true,
        widget_tag_key: 'Fiscal Week',
        widget_tag_label: 'Fiscal Week',
        widget_tag_input_type: 'Element Range Selector',
        widget_filter_dynamic: false,
        widget_tag_value: [
            {
                value: 'FW4-23',
                label: 'FW4-23',
                color: '#FF7D33',
                disabled: true
            },
            {
                value: 'FW5-23',
                label: 'FW5-23',
                color: '#BDBDBC',
                disabled: true
            },
            {
                value: 'FW6-23',
                label: 'FW6-23',
                color: '#BDBDBC',
                disabled: true
            }
        ],
        widget_filter_search: true,
        widget_filter_params: {
            selected_element_color: '#FF7D33',
            legends: [
                {
                    label: ' 100% Available',
                    color: '#228B22'
                },
                {
                    label: '1%-99% Available',
                    color: '#FF7D33'
                },
                {
                    label: 'Sold Out',
                    color: '#BDBDBC'
                }
            ]
        }
    }
};
