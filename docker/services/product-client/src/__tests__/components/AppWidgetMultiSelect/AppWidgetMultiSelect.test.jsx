import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AppWidgetMultiSelect from '../../../components/AppWidgetMultiSelect/AppWidgetMultiSelect';
import { getDynamicfilters } from 'services/filters';
import { vi } from 'vitest';

vi.mock('../../../services/filters', () => ({
    getDynamicfilters: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts AppWidgetMultiSelect Component', () => {
        const { getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetMultiSelect {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(getByRole('button', { name: 'Reset' })).toBeInTheDocument();
        const resetBtn = getByRole('button', { name: 'Reset' });
        fireEvent.click(resetBtn);
    });

    test('Should render layouts AppWidgetMultiSelect Component', () => {
        const { getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetMultiSelect {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(getByRole('button', { name: 'Reset' })).toBeInTheDocument();
        const resetBtn = getByRole('button', { name: 'Reset' });
        fireEvent.click(resetBtn);
    });

    test('Should render the menu dropdown on filter shortcut label click', () => {
        const { getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetMultiSelect {...Props2} />
                </Router>
            </CustomThemeContextProvider>
        );
        const filterShortcut = getByLabelText('Region');
        fireEvent.click(filterShortcut);
        expect(getByLabelText('filter_menu').className).toMatch(/^((?!makeStyles-hide).)*$/i);
    });

    test('Should render the slices options on filter shortcut label click', () => {
        getDynamicfilters.mockImplementation(
            ({
                callback,
                response_data = {
                    data: {
                        dataValues: [
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Country',
                                widget_tag_label: 'Country',
                                widget_tag_input_type: 'select',
                                widget_filter_dynamic: true,
                                widget_filter_type: '',
                                widget_tag_value: ['USA', 'Canada']
                            }
                        ],
                        defaultValues: {
                            Country: 'USA'
                        },
                        filterSlice: {
                            load_slice: true,
                            save_slice: true,
                            existingSlices: [
                                { name: 'test1', id: 1 },
                                { name: 'test2', id: 2 }
                            ]
                        }
                    }
                }
            }) => callback(response_data)
        );
        const { getByLabelText, getByTestId, getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetMultiSelect {...Props2} app_info={{ modules: { slice: true } }} />
                </Router>
            </CustomThemeContextProvider>
        );
        const filterShortcut = getByLabelText('Region');
        fireEvent.click(filterShortcut);

        const saveSlice = getByTestId('save slice');
        fireEvent.click(saveSlice);

        const saveSliceButton = getByLabelText('save slice');
        fireEvent.click(saveSliceButton);

        const sliceTextBox = getByRole('textbox');
        fireEvent.change(sliceTextBox, { target: { value: 'New Slice' } });
        expect(sliceTextBox.value).toBe('New Slice');
        fireEvent.click(saveSliceButton);

        const applyFilters = getByRole('button', {
            name: 'apply filter'
        });
        fireEvent.click(applyFilters);
    });

    test('Save Slices Scenario', () => {
        getDynamicfilters.mockImplementation(
            ({
                callback,
                response_data = {
                    data: {
                        dataValues: [
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Country',
                                widget_tag_label: 'Country',
                                widget_tag_input_type: 'select',
                                widget_filter_dynamic: true,
                                widget_filter_type: '',
                                widget_tag_value: ['USA', 'Canada']
                            }
                        ],
                        defaultValues: {
                            Country: 'USA'
                        },
                        filterSlice: {
                            load_slice: true,
                            save_slice: true,
                            existingSlices: [
                                { name: 'test1', id: 1 },
                                { name: 'New Slice', id: 2 }
                            ]
                        }
                    },
                    statusMessage: 'success'
                }
            }) => callback(response_data)
        );
        const { getByLabelText, getByTestId, getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetMultiSelect {...Props2} app_info={{ modules: { slice: true } }} />
                </Router>
            </CustomThemeContextProvider>
        );
        const filterShortcut = getByLabelText('Region');
        fireEvent.click(filterShortcut);

        const saveSlice = getByTestId('save slice');
        fireEvent.click(saveSlice);

        const saveSliceButton = getByLabelText('save slice');
        fireEvent.click(saveSliceButton);

        const sliceTextBox = getByRole('textbox');
        fireEvent.change(sliceTextBox, { target: { value: 'Slice1' } });
        fireEvent.click(saveSliceButton);

        const dialog = getByRole('dialog');
        expect(dialog).toBeInTheDocument();

        const cancel = getByRole('button', {
            name: 'Cancel Apply Filter'
        });
        fireEvent.click(cancel);

        const confirm = getByRole('button', {
            name: 'Confirm Apply Filter'
        });
        fireEvent.click(confirm);
    });

    test('Load Slices Scenario', () => {
        getDynamicfilters.mockImplementation(
            ({
                callback,
                response_data = {
                    data: {
                        dataValues: [
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Country',
                                widget_tag_label: 'Country',
                                widget_tag_input_type: 'select',
                                widget_filter_dynamic: true,
                                widget_filter_type: '',
                                widget_tag_value: ['USA', 'Canada']
                            }
                        ],
                        defaultValues: {
                            Country: 'USA'
                        },
                        filterSlice: {
                            load_slice: true,
                            save_slice: true,
                            existingSlices: [
                                { name: 'test1', id: 1 },
                                { name: 'New Slice', id: 2 }
                            ]
                        }
                    }
                }
            }) => callback(response_data['data'])
        );
        const { getByLabelText, getByTestId, getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetMultiSelect {...Props2} app_info={{ modules: { slice: true } }} />
                </Router>
            </CustomThemeContextProvider>
        );
        const filterShortcut = getByLabelText('Country');
        fireEvent.click(filterShortcut);

        const saveSlice = getByTestId('save slice');
        fireEvent.click(saveSlice);

        const saveSliceButton = getByLabelText('save slice');
        const sliceTextBox = getByRole('textbox');
        fireEvent.change(sliceTextBox, { target: { value: 'Slice1' } });
        fireEvent.click(saveSliceButton);
        const filtersButton = getByRole('button', {
            name: 'Filters'
        });
        fireEvent.click(filtersButton);
        fireEvent.click(filterShortcut);
        const radioChange = getByLabelText('Canada');
        fireEvent.click(radioChange);
        expect(radioChange.checked).toBe(true);
        const loadSlice = getByTestId('load slice');
        fireEvent.click(loadSlice);
        const loadSliceName = getByRole('radio', {
            name: 'New Slice'
        });
        fireEvent.click(loadSliceName);

        const loadSliceButton = getByRole('button', {
            name: 'load slice'
        });
        expect(loadSliceButton).toBeInTheDocument();
        fireEvent.click(loadSliceButton);

        const closeButton = getByRole('button', {
            name: 'close filter'
        });
        fireEvent.click(closeButton);
    });

    test('Scenario for filter slices error testing', () => {
        getDynamicfilters.mockImplementation(
            ({
                callback,
                response_data = {
                    data: {
                        dataValues: [
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Country',
                                widget_tag_label: 'Country',
                                widget_tag_input_type: 'select',
                                widget_filter_dynamic: true,
                                widget_filter_type: '',
                                widget_tag_value: ['USA', 'Canada']
                            }
                        ],
                        filterSlice: {
                            load_slice: true,
                            save_slice: true,
                            existingSlices: [
                                { name: 'test1', id: 1 },
                                { name: 'New Slice', id: 2 }
                            ]
                        },
                        statusMessage: 'error'
                    }
                }
            }) => callback(response_data['data'])
        );

        const { getByRole, getByTestId, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetMultiSelect {...Props2} app_info={{ modules: { slice: true } }} />
                </Router>
            </CustomThemeContextProvider>
        );

        const filterShortcut = getByLabelText('Country');
        fireEvent.click(filterShortcut);

        const saveSlice = getByTestId('save slice');
        fireEvent.click(saveSlice);

        const saveSliceButton = getByLabelText('save slice');
        const sliceTextBox = getByRole('textbox');
        fireEvent.change(sliceTextBox, { target: { value: 'Slice1' } });
        fireEvent.click(saveSliceButton);
        const errorHeading = getByRole('heading', {
            name: 'Slice could not be saved!'
        });
        expect(errorHeading).toBeInTheDocument();
        const loadSlice = getByTestId('load slice');
        fireEvent.click(loadSlice);
        const loadSliceName = getByRole('radio', {
            name: 'New Slice'
        });
        fireEvent.click(loadSliceName);

        const loadSliceButton = getByRole('button', {
            name: 'load slice'
        });
        fireEvent.click(loadSliceButton);
        const loadNotification = getByRole('heading', { name: 'Slice could not be Loaded!' });
        expect(loadNotification).toBeInTheDocument();
        const closeNotificationButton = getByRole('button', { name: '' });
        fireEvent.click(closeNotificationButton);
    });
});

const Props = {
    classes: {},
    item: 'filter',
    parent_obj: {
        state: {
            screen_filters_values: {
                defaultValues: [1, 2],
                dataValues: [1, 2, 3]
            }
        },
        getWidgetData: () => {}
    },
    app_info: {}
};
const Props1 = {
    classes: {},
    item: 'filter',
    parent_obj: {
        state: {
            screen_filters_values: {
                defaultValues: {},
                dataValues: [],
                has_pivot: true,
                pivot_info: [
                    [
                        {
                            index: 0,
                            key: 'business',
                            label: 'BUSINESS',
                            type: false
                        },
                        {
                            index: 1,
                            key: 'country',
                            label: 'COUNTRY',
                            type: false
                        },
                        {
                            index: 2,
                            key: 'per',
                            label: 'TIME',
                            type: false
                        },
                        {
                            index: 3,
                            key: 'channel_1_attr',
                            label: 'MACRO CHANNEL',
                            type: false
                        },
                        {
                            index: 4,
                            key: 'channel_2_attr',
                            label: 'MICRO CHANNEL',
                            type: false
                        },
                        {
                            index: 5,
                            key: 'measures',
                            label: 'MEASURES',
                            type: false
                        },
                        {
                            index: 6,
                            key: 'category_mdm',
                            label: 'CATEGORY',
                            type: false
                        },
                        {
                            index: 7,
                            key: 'sub_category_mdm',
                            label: 'SUB CATEGORY',
                            type: false
                        },
                        {
                            index: 8,
                            key: 'segment_mdm',
                            label: 'SEGMENT',
                            type: false
                        },
                        {
                            index: 9,
                            key: 'sub_segment_mdm',
                            label: 'SUB SEGMENT',
                            type: false
                        },
                        {
                            index: 10,
                            key: 'manufacturer_mdm',
                            label: 'MANUFACTURER',
                            type: false
                        },
                        {
                            index: 11,
                            key: 'platform_brand_mdm',
                            label: 'PLATFORM BRAND',
                            type: false
                        },
                        {
                            index: 12,
                            key: 'brand_mdm',
                            label: 'BRAND',
                            type: false
                        },
                        {
                            index: 13,
                            key: 'sub_brand_mdm',
                            label: 'SUB BRAND',
                            type: false
                        },
                        {
                            index: 14,
                            key: 'organic_mdm',
                            label: 'ORGANIC',
                            type: false
                        },
                        {
                            index: 15,
                            key: 'protein_mdm',
                            label: 'PROTEIN',
                            type: false
                        },
                        {
                            index: 16,
                            key: 'packsize_mdm',
                            label: 'PACKSIZE',
                            type: false
                        },
                        {
                            index: 17,
                            key: 'packtype_mdm',
                            label: 'PACKTYPE',
                            type: false
                        },
                        {
                            index: 18,
                            key: 'multipack_mdm',
                            label: 'MULTIPACK',
                            type: false
                        },
                        {
                            index: 19,
                            key: 'plantbased_yes_no_mdm',
                            label: 'PLANTBASED YES/NO',
                            type: false
                        },
                        {
                            index: 20,
                            key: 'flavour_mdm',
                            label: 'FLAVOUR',
                            type: false
                        }
                    ]
                ]
            }
        },
        getWidgetData: () => {}
    },
    app_info: {}
};

const Props2 = {
    classes: {},
    item: 'filter',
    parent_obj: {
        state: {
            screen_filters_values: {
                dataValues: [
                    {
                        widget_filter_index: 0,
                        widget_filter_function: false,
                        widget_filter_function_parameter: false,
                        widget_filter_hierarchy_key: false,
                        widget_filter_isall: false,
                        widget_filter_multiselect: true,
                        widget_tag_key: 'Region',
                        widget_tag_label: 'Region',
                        widget_tag_input_type: 'select',
                        widget_filter_dynamic: true,
                        widget_filter_type: '',
                        widget_tag_value: ['North America', 'Europe']
                    },
                    {
                        widget_filter_index: 1,
                        widget_filter_function: false,
                        widget_filter_function_parameter: false,
                        widget_filter_hierarchy_key: false,
                        widget_filter_isall: false,
                        widget_filter_multiselect: false,
                        widget_tag_key: 'Country',
                        widget_tag_label: 'Country',
                        widget_tag_input_type: 'select',
                        widget_filter_dynamic: true,
                        widget_filter_type: '',
                        widget_tag_value: ['USA', 'Canada']
                    },
                    {
                        widget_filter_index: 2,
                        widget_filter_function: false,
                        widget_filter_function_parameter: false,
                        widget_filter_hierarchy_key: false,
                        widget_filter_isall: true,
                        widget_filter_multiselect: true,
                        widget_tag_key: 'Category',
                        widget_tag_label: 'Category',
                        widget_tag_input_type: 'select',
                        widget_filter_dynamic: true,
                        widget_filter_type: '',
                        widget_tag_value: ['All', 'Category 1', 'Category 2']
                    }
                ],
                defaultValues: {
                    Region: ['North America'],
                    Country: 'USA',
                    Category: ['All', 'Category 1', 'Category 2']
                },
                filterSlice: { load_slice: true, save_slice: true }
            }
        },
        getWidgetData: () => {}
    },
    app_info: {}
};
