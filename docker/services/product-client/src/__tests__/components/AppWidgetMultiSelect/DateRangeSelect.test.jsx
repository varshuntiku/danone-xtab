import React from 'react';
import { render, screen, cleanup, fireEvent, act, within } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DateRangeSelect from '../../../components/AppWidgetMultiSelect/DateRangeSelect';
import { vi } from 'vitest';

vi.mock('../../../components/dynamic-form/inputFields/datepicker', () => {
    return {
        default: (props) => {
            const mock_date = props?.fieldInfo?.label?.startsWith('start_date_')
                ? '01/19/2022'
                : '19/01/2022';
            const mock_onChange_Param = props?.fieldInfo?.label?.startsWith('start_date_')
                ? 'start_date'
                : 'end_date';
            return (
                <>
                    Mock Datepicker component
                    <button
                        onClick={() => props.onChange(mock_date, mock_onChange_Param)}
                        aria-label={props?.fieldInfo?.label}
                    >
                        Test Button
                    </button>
                    {/* <button onClick={() => props.onChange( '19/01/2022', 'end_date')} aria-label={"end-date"}>Test Button 2</button> */}
                </>
            );
        }
    };
});

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DateRangeSelect Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DateRangeSelect
                        {...Props}
                        params={{
                            start_date: { label: 'start_date_1' },
                            end_date: { label: 'end_date_1' }
                        }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByLabelText('start_date_1')).toBeInTheDocument();
        const firstStartDateBtn = screen.getByLabelText('start_date_1');
        fireEvent.click(firstStartDateBtn);
    });
    test('Should render layouts DateRangeSelect Component 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DateRangeSelect
                        {...Props}
                        params={{
                            start_date: { label: 'start_date_2' },
                            end_date: { label: 'end_date_2' }
                        }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByLabelText('end_date_2')).toBeInTheDocument();
        const firstEndDateBtn = screen.getByLabelText('end_date_2');
        fireEvent.click(firstEndDateBtn);
    });
    test('Should allow end date to be optional', () => {
        const props1 = {
            ...Props,
            params: {
                endDateOptional: true,
                start_date: { label: 'start_date_3' },
                end_date: { label: 'end_date_3' }
                // endDateArrivalLabel: true
            },
            value: { start_date: '', end_date: '' }
        };
        const { debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DateRangeSelect {...props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByLabelText('start_date_3')).toBeInTheDocument();
        const firstStartDateBtn = screen.getByLabelText('start_date_3');
        fireEvent.click(firstStartDateBtn);
        expect(screen.getByRole('heading')).toBeEmptyDOMElement();
    });

    test('Should validate date range and show error for invalid range', () => {
        const onError = vi.fn();
        const props = {
            ...Props,
            value: { start_date: '10/08/2022', end_date: '01/01/2022' },
            onChangeFilter: vi.fn(),
            onError
        };

        const { getAllByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DateRangeSelect {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByLabelText('Start Date'));
        const testButtons = getAllByText('Test Button');
        fireEvent.click(testButtons[0]);

        fireEvent.click(screen.getByLabelText('End Date'));

        const testButton = getAllByText('Test Button');
        fireEvent.click(testButton[1]);

        expect(screen.getByText('Invalid selection')).toBeInTheDocument();
        expect(onError).toHaveBeenCalledWith({ message: 'Invalid range selection' });
    });
    test('Should display error message for invalid date range', () => {
        const onChangeFilter = vi.fn();
        const onError = vi.fn();
        const props = {
            value: { start_date: '2024-01-10', end_date: '2024-01-01' },
            onChangeFilter,
            onError,
            params: {
                endDateOptional: false
            }
        };

        const { getAllByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DateRangeSelect {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByLabelText('Start Date'));
        const testButtons = getAllByText('Test Button');
        fireEvent.click(testButtons[0]);

        expect(screen.getByText(/Invalid selection/)).toBeInTheDocument();
        expect(onError).toHaveBeenCalledWith({ message: 'Invalid range selection' });
    });
    test('Should render date labels correctly', () => {
        const props = {
            value: { start_date: '2024-01-01', end_date: '2024-01-10' },
            params: {
                startDateArrivalLabel: true,
                endDateArrivalLabel: true,
                durationLabel: true
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DateRangeSelect {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText(/Started/)).toBeInTheDocument();
        expect(screen.getByText(/Ended/)).toBeInTheDocument();
        expect(screen.getByText(/Duration/)).toBeInTheDocument();
    });
});

const Props = {
    classes: {},
    item: 'filter',
    value: { start_date: '01/01/2022', end_date: '10/08/2022' },
    onChangeFilter: () => {}
    // selectedValue: {
    //     filter: [1,2,3]
    // },
    // data: {
    //     widget_filter_hierarchy_key: 'filter',
    //     widget_filter_multiselect:  true,
    //     widget_tag_value: [1,2,3,4,5]
    // }
};
