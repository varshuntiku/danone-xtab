import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppWidgetGanttTable from '../../components/AppWidgetGanttTable';
import CustomThemeContextProvider from '../../themes/customThemeContext';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render AppScreen Component', async () => {
        const props = {
            params: {
                assignments: [
                    {
                        resource: 'Alan Ashworth',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM'],
                        wave: 'Wave 1'
                    },
                    {
                        resource: 'Alan Ashworth',
                        task: 'Picking',
                        ticks: ['10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 2'
                    },
                    {
                        resource: 'Alan Ashworth',
                        task: 'Picking',
                        ticks: ['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
                        wave: 'Wave 3'
                    },
                    {
                        resource: 'Arthur Hopper',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 1'
                    },
                    {
                        resource: 'Arthur Hopper',
                        task: 'Scanning',
                        ticks: ['1:00 PM', '2:00 PM', '3:00 PM'],
                        wave: 'Wave 2'
                    },
                    {
                        resource: 'Daniel Novak',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 1'
                    },
                    {
                        resource: 'Daniel Novak',
                        task: 'Picking',
                        ticks: ['1:00 PM', '2:00 PM', '3:00 PM'],
                        wave: 'Wave 2'
                    },
                    {
                        resource: 'Daniel Novak',
                        task: 'Picking',
                        ticks: ['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
                        wave: 'Wave 3'
                    },
                    {
                        resource: 'Jacob Lewis',
                        task: false,
                        ticks: [
                            '8:00 AM',
                            '9:00 AM',
                            '10:00 AM',
                            '11:00 AM',
                            '12:00 PM',
                            '1:00 PM',
                            '2:00 PM',
                            '3:00 PM',
                            '4:00 PM',
                            '5:00 PM',
                            '6:00 PM'
                        ],
                        wave: 'On Leave'
                    },
                    {
                        resource: 'Kevin Ramsay',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 3'
                    },
                    {
                        resource: 'Kevin Ramsay',
                        task: 'Shipping',
                        ticks: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
                        wave: 'Wave 4'
                    },
                    {
                        resource: 'Linda Parker',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 3'
                    },
                    {
                        resource: 'Linda Parker',
                        task: 'Shipping',
                        ticks: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
                        wave: 'Wave 4'
                    },
                    {
                        resource: 'Lisa Parta',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 2'
                    },
                    {
                        resource: 'Lisa Parta',
                        task: 'Shipping',
                        ticks: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
                        wave: 'Wave 4'
                    },
                    {
                        resource: 'Raj Rangan',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 2'
                    },
                    {
                        resource: 'Raj Rangan',
                        task: 'Shipping',
                        ticks: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
                        wave: 'Wave 4'
                    }
                ],
                assumptions: false,
                extra_assignment_options: ['On Leave', 'Cross Training'],
                is_gantt_table: true,
                layout: {
                    updatemenus: [
                        {
                            active: 0,
                            buttons: [
                                { label: 'Mon' },
                                { label: 'Tue' },
                                { label: 'Wed' },
                                { label: 'Thu' },
                                { label: 'Fri' }
                            ],
                            name: 'Day',
                            type: 'buttons'
                        }
                    ]
                },
                range: {
                    break: ['12:00 PM', '1:00 PM'],
                    ticks: [
                        '8:00 AM',
                        '9:00 AM',
                        '10:00 AM',
                        '11:00 AM',
                        '12:00 PM',
                        '1:00 PM',
                        '2:00 PM',
                        '3:00 PM',
                        '4:00 PM',
                        '5:00 PM',
                        '6:00 PM'
                    ]
                },
                resources: [
                    { name: 'Alan Ashworth', skills: ['Picking'] },
                    { name: 'Arthur Hopper', skills: ['Picking', 'Scanning'] },
                    { name: 'Daniel Novak', skills: ['Picking'] },
                    { name: 'Jacob Lewis', skills: ['Picking'] },
                    { name: 'Kevin Ramsay', skills: ['Picking', 'Shipping'] },
                    { name: 'Linda Parker', skills: ['Picking', 'Shipping'] },
                    { name: 'Lisa Parta', skills: ['Picking', 'Shipping'] },
                    { name: 'Raj Rangan', skills: ['Picking', 'Shipping'] }
                ],
                waves: [
                    {
                        name: 'Wave 1',
                        tasks: [
                            {
                                ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                                type: 'Picking'
                            }
                        ]
                    },
                    {
                        name: 'Wave 2',
                        tasks: [
                            {
                                ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                                type: 'Picking'
                            },
                            { ticks: ['1:00 PM', '2:00 PM', '3:00 PM'], type: 'Picking' },
                            { ticks: ['1:00 PM', '2:00 PM', '3:00 PM'], type: 'Scanning' }
                        ]
                    },
                    {
                        name: 'Wave 3',
                        tasks: [
                            {
                                ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                                type: 'Picking'
                            },
                            {
                                ticks: [
                                    '1:00 PM',
                                    '2:00 PM',
                                    '3:00 PM',
                                    '4:00 PM',
                                    '5:00 PM',
                                    '6:00 PM'
                                ],
                                type: 'Picking'
                            }
                        ]
                    },
                    {
                        name: 'Wave 4',
                        tasks: [
                            {
                                ticks: [
                                    '1:00 PM',
                                    '2:00 PM',
                                    '3:00 PM',
                                    '4:00 PM',
                                    '5:00 PM',
                                    '6:00 PM'
                                ],
                                type: 'Shipping'
                            }
                        ]
                    }
                ]
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetGanttTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.queryAllByLabelText('empty-cell')).not.toBeNull();
        const firstEmptyCell = screen.queryAllByLabelText('empty-cell')[0];
        fireEvent.click(firstEmptyCell);
        expect(screen.getByLabelText('action-dropdown')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('action-dropdown'));
        expect(screen.queryAllByRole('menuitem')).not.toBeNull();
        const firstMenuItem = screen.queryAllByRole('menuitem')[0];
        expect(screen.getByLabelText('popover')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('presentation').firstChild);
    });

    test('Should render AppScreen Component', () => {
        const props = {
            params: {
                assignments: [
                    {
                        resource: 'Alan Ashworth',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM'],
                        wave: 'Wave 1'
                    },
                    {
                        resource: 'Alan Ashworth',
                        task: 'Picking',
                        ticks: ['10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 2'
                    },
                    {
                        resource: 'Alan Ashworth',
                        task: 'Picking',
                        ticks: ['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
                        wave: 'Wave 3'
                    },
                    {
                        resource: 'Arthur Hopper',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 1'
                    },
                    {
                        resource: 'Arthur Hopper',
                        task: 'Scanning',
                        ticks: ['1:00 PM', '2:00 PM', '3:00 PM'],
                        wave: 'Wave 2'
                    },
                    {
                        resource: 'Daniel Novak',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 1'
                    },
                    {
                        resource: 'Daniel Novak',
                        task: 'Picking',
                        ticks: ['1:00 PM', '2:00 PM', '3:00 PM'],
                        wave: 'Wave 2'
                    },
                    {
                        resource: 'Daniel Novak',
                        task: 'Picking',
                        ticks: ['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
                        wave: 'Wave 3'
                    },
                    {
                        resource: 'Jacob Lewis',
                        task: false,
                        ticks: [
                            '8:00 AM',
                            '9:00 AM',
                            '10:00 AM',
                            '11:00 AM',
                            '12:00 PM',
                            '1:00 PM',
                            '2:00 PM',
                            '3:00 PM',
                            '4:00 PM',
                            '5:00 PM',
                            '6:00 PM'
                        ],
                        wave: 'On Leave'
                    },
                    {
                        resource: 'Kevin Ramsay',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 3'
                    },
                    {
                        resource: 'Kevin Ramsay',
                        task: 'Shipping',
                        ticks: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
                        wave: 'Wave 4'
                    },
                    {
                        resource: 'Linda Parker',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 3'
                    },
                    {
                        resource: 'Linda Parker',
                        task: 'Shipping',
                        ticks: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
                        wave: 'Wave 4'
                    },
                    {
                        resource: 'Lisa Parta',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 2'
                    },
                    {
                        resource: 'Lisa Parta',
                        task: 'Shipping',
                        ticks: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
                        wave: 'Wave 4'
                    },
                    {
                        resource: 'Raj Rangan',
                        task: 'Picking',
                        ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                        wave: 'Wave 2'
                    },
                    {
                        resource: 'Raj Rangan',
                        task: 'Shipping',
                        ticks: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
                        wave: 'Wave 4'
                    }
                ],
                assumptions: false,
                extra_assignment_options: ['On Leave', 'Cross Training'],
                is_gantt_table: true,
                layout: {
                    updatemenus: [
                        {
                            active: 0,
                            buttons: [
                                { label: 'Mon' },
                                { label: 'Tue' },
                                { label: 'Wed' },
                                { label: 'Thu' },
                                { label: 'Fri' }
                            ],
                            name: 'Day',
                            type: 'buttons'
                        }
                    ]
                },
                range: {
                    break: ['12:00 PM', '1:00 PM'],
                    ticks: [
                        '8:00 AM',
                        '9:00 AM',
                        '10:00 AM',
                        '11:00 AM',
                        '12:00 PM',
                        '1:00 PM',
                        '2:00 PM',
                        '3:00 PM',
                        '4:00 PM',
                        '5:00 PM',
                        '6:00 PM'
                    ]
                },
                resources: [
                    { name: 'Alan Ashworth', skills: ['Picking'] },
                    { name: 'Arthur Hopper', skills: ['Picking', 'Scanning'] },
                    { name: 'Daniel Novak', skills: ['Picking'] },
                    { name: 'Jacob Lewis', skills: ['Picking'] },
                    { name: 'Kevin Ramsay', skills: ['Picking', 'Shipping'] },
                    { name: 'Linda Parker', skills: ['Picking', 'Shipping'] },
                    { name: 'Lisa Parta', skills: ['Picking', 'Shipping'] },
                    { name: 'Raj Rangan', skills: ['Picking', 'Shipping'] }
                ],
                waves: [
                    {
                        name: 'Wave 1',
                        tasks: [
                            {
                                ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                                type: 'Picking'
                            }
                        ]
                    },
                    {
                        name: 'Wave 2',
                        tasks: [
                            {
                                ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                                type: 'Picking'
                            },
                            { ticks: ['1:00 PM', '2:00 PM', '3:00 PM'], type: 'Picking' },
                            { ticks: ['1:00 PM', '2:00 PM', '3:00 PM'], type: 'Scanning' }
                        ]
                    },
                    {
                        name: 'Wave 3',
                        tasks: [
                            {
                                ticks: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                                type: 'Picking'
                            },
                            {
                                ticks: [
                                    '1:00 PM',
                                    '2:00 PM',
                                    '3:00 PM',
                                    '4:00 PM',
                                    '5:00 PM',
                                    '6:00 PM'
                                ],
                                type: 'Picking'
                            }
                        ]
                    },
                    {
                        name: 'Wave 4',
                        tasks: [
                            {
                                ticks: [
                                    '1:00 PM',
                                    '2:00 PM',
                                    '3:00 PM',
                                    '4:00 PM',
                                    '5:00 PM',
                                    '6:00 PM'
                                ],
                                type: 'Shipping'
                            }
                        ]
                    }
                ]
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetGanttTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.queryAllByLabelText('empty-cell')).not.toBeNull();
        const firstEmptyCell = screen.queryAllByLabelText('empty-cell')[0];
        fireEvent.click(firstEmptyCell);
        expect(screen.getByLabelText('action-dropdown')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('action-dropdown'));
        expect(screen.queryAllByRole('menuitem')).not.toBeNull();
        fireEvent.click(screen.getByText('Wave 2 : Picking', { exact: false }));
        const anotherEmptyCell = screen.queryAllByLabelText('empty-cell')[1];
        fireEvent.click(anotherEmptyCell);
    });
});
