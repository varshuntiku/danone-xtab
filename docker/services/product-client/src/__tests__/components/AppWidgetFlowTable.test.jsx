import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppWidgetFlowTable from '../../components/AppWidgetFlowTable';
import CustomThemeContextProvider from '../../themes/customThemeContext';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);
    test('Should render AppScreen Component', () => {
        const props = {
            classes: {
                appWidgetFlowTableContainer: 'AppWidgetFlowTable-appWidgetFlowTableContainer-262',
                appWidgetFlowTableLabel: 'AppWidgetFlowTable-appWidgetFlowTableLabel-263',
                appWidgetFlowTableSubLabel: 'AppWidgetFlowTable-appWidgetFlowTableSubLabel-264',
                appWidgetFlowTableSubLabelRed:
                    'AppWidgetFlowTable-appWidgetFlowTableSubLabelRed-265',
                appWidgetFlowTableSubLabelGreen:
                    'AppWidgetFlowTable-appWidgetFlowTableSubLabelGreen-266',
                appWidgetFlowTableGridItem: 'AppWidgetFlowTable-appWidgetFlowTableGridItem-267',
                appWidgetFlowTableItemHeaderContainer:
                    'AppWidgetFlowTable-appWidgetFlowTableItemHeaderContainer-268',
                appWidgetFlowTableItemHeader: 'AppWidgetFlowTable-appWidgetFlowTableItemHeader-269',
                appWidgetFlowTableItemIncomingContainer:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingContainer-270',
                appWidgetFlowTableItemIncoming:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncoming-271',
                appWidgetFlowTableItemIncomingLeftIcon1:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingLeftIcon1-272',
                appWidgetFlowTableItemIncomingLeftIcon2:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingLeftIcon2-273',
                appWidgetFlowTableItemIncomingRightIcon1:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingRightIcon1-274',
                appWidgetFlowTableItemIncomingRightIcon2:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingRightIcon2-275',
                appWidgetFlowTableItemTable: 'AppWidgetFlowTable-appWidgetFlowTableItemTable-276',
                appWidgetFlowTableHead: 'AppWidgetFlowTable-appWidgetFlowTableHead-277',
                appWidgetFlowTablecellValue: 'AppWidgetFlowTable-appWidgetFlowTablecellValue-278',
                appWidgetFlowTablecellValueRed:
                    'AppWidgetFlowTable-appWidgetFlowTablecellValueRed-279',
                appWidgetFlowTablecellValueYellow:
                    'AppWidgetFlowTable-appWidgetFlowTablecellValueYellow-280',
                appWidgetFlowTablecellValueGreen:
                    'AppWidgetFlowTable-appWidgetFlowTablecellValueGreen-281',
                appWidgetFlowTableIcon: 'AppWidgetFlowTable-appWidgetFlowTableIcon-282',
                appWidgetFlowTableIconRed: 'AppWidgetFlowTable-appWidgetFlowTableIconRed-283',
                appWidgetFlowTableCalloutContainer:
                    'AppWidgetFlowTable-appWidgetFlowTableCalloutContainer-284',
                appWidgetFlowTableCalloutText:
                    'AppWidgetFlowTable-appWidgetFlowTableCalloutText-285'
            },
            params: {
                flow_table: {
                    name: 'Total Inventory Management Cost',
                    sub_title: '£2m [12% YoY]',
                    sub_title_direction: 'up',
                    data: [
                        {
                            name: 'RDCs',
                            incoming_text: 'Forecast Demand: 20k Units',
                            table_headers: [
                                'Regional Distribution Centres',
                                'On Hand Inventory',
                                'Estimated Demand'
                            ],
                            table_data: [
                                { cols: ['RDC 1', '14k Units', '5k Units'], rowspan: 4 },
                                { cols: ['RDC 2', '10k Units', '7k Units'], rowspan: 2 }
                            ]
                        },
                        {
                            name: 'DCs',
                            incoming_text: 'Forecast Demand: 6k Units',
                            table_headers: [
                                'Distribution Centres',
                                'On Hand Inventory',
                                'Estimated Demand'
                            ],
                            table_data: ['Object', 'Object', 'Object']
                        },
                        {
                            name: 'Stores',
                            table_headers: ['Stores', 'On Hand Inventory', 'Estimated Demand'],
                            table_data: ['Object', 'Object', 'Object', 'Object', 'Object', 'Object']
                        }
                    ]
                }
            },
            parent_obj: {
                props: 'Object',
                context: 'Object',
                refs: 'Object',
                updater: 'Object',
                onClickGraphFilter: 'fn()',
                closeGraphFilterMenu: 'fn()',
                onSelectGraphFilterMenu: 'fn()',
                onChangeFilterSearchValue: 'fn()',
                renderChartFilters: 'fn()',
                onClickFilterOption: 'fn()',
                setupPlot: 'fn()',
                onResponseGetWidget: 'fn()',
                onClickSimulator: 'fn()',
                onResetSimulator: 'fn()',
                onCloseSimulator: 'fn()',
                onApplySimulator: 'fn()',
                onResponseExecuteCode: 'fn()',
                onSliderChange: 'fn()',
                renderSimulatorSliders: 'fn()',
                getSliderValueRange: 'fn()',
                renderSimulatorGroups: 'fn()',
                isTable: 'fn()',
                isExpandableTable: 'fn()',
                isPlot: 'fn()',
                isInsights: 'fn()',
                isTestLearn: 'fn()',
                isFlowTable: 'fn()',
                isTableSimulator: 'fn()',
                isGanttTable: 'fn()',
                isKPI: 'fn()',
                renderVisualContent: 'fn()',
                getCreateStoriesPayload: 'fn()',
                getPayloadMap: 'fn()',
                getPayloadArray: 'fn()',
                onCheckboxValueChange: 'fn()',
                onSearch: 'fn()',
                handleSimulatorChange: 'fn()',
                changefunc: 'fn()',
                resetfunc: 'fn()',
                submitfunc: 'fn()',
                uploadfunc: 'fn()',
                downloadfunc: 'fn()',
                handleActionInvoke: 'fn()',
                state: 'Object',
                _reactInternalFiber: 'Object',
                _reactInternalInstance: 'Object',
                isReactComponent: 'Object',
                setState: 'fn()',
                forceUpdate: 'fn()'
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetFlowTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('should not render subtitle if not provided', () => {
        const props = {
            params: {
                flow_table: {
                    name: 'Total Inventory Management Cost',
                    data: [
                        {
                            name: 'RDCs',
                            incoming_text: 'Forecast Demand: 20k Units',
                            table_headers: [
                                'Regional Distribution Centres',
                                'On Hand Inventory',
                                'Estimated Demand'
                            ],
                            table_data: [
                                { cols: ['RDC 1', '14k Units', '5k Units'], rowspan: 4 },
                                { cols: ['RDC 2', '10k Units', '7k Units'], rowspan: 2 }
                            ]
                        },
                        {
                            name: 'DCs',
                            incoming_text: 'Forecast Demand: 6k Units',
                            table_headers: [
                                'Distribution Centres',
                                'On Hand Inventory',
                                'Estimated Demand'
                            ],
                            table_data: ['Object', 'Object', 'Object']
                        },
                        {
                            name: 'Stores',
                            table_headers: ['Stores', 'On Hand Inventory', 'Estimated Demand'],
                            table_data: ['Object', 'Object', 'Object', 'Object', 'Object', 'Object']
                        }
                    ]
                }
            },
            classes: {
                appWidgetFlowTableContainer: 'AppWidgetFlowTable-appWidgetFlowTableContainer-262',
                appWidgetFlowTableLabel: 'AppWidgetFlowTable-appWidgetFlowTableLabel-263',
                appWidgetFlowTableSubLabel: 'AppWidgetFlowTable-appWidgetFlowTableSubLabel-264',
                appWidgetFlowTableSubLabelRed:
                    'AppWidgetFlowTable-appWidgetFlowTableSubLabelRed-265',
                appWidgetFlowTableSubLabelGreen:
                    'AppWidgetFlowTable-appWidgetFlowTableSubLabelGreen-266',
                appWidgetFlowTableGridItem: 'AppWidgetFlowTable-appWidgetFlowTableGridItem-267',
                appWidgetFlowTableItemHeaderContainer:
                    'AppWidgetFlowTable-appWidgetFlowTableItemHeaderContainer-268',
                appWidgetFlowTableItemHeader: 'AppWidgetFlowTable-appWidgetFlowTableItemHeader-269',
                appWidgetFlowTableItemIncomingContainer:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingContainer-270',
                appWidgetFlowTableItemIncoming:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncoming-271',
                appWidgetFlowTableItemIncomingLeftIcon1:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingLeftIcon1-272',
                appWidgetFlowTableItemIncomingLeftIcon2:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingLeftIcon2-273',
                appWidgetFlowTableItemIncomingRightIcon1:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingRightIcon1-274',
                appWidgetFlowTableItemIncomingRightIcon2:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingRightIcon2-275',
                appWidgetFlowTableItemTable: 'AppWidgetFlowTable-appWidgetFlowTableItemTable-276',
                appWidgetFlowTableHead: 'AppWidgetFlowTable-appWidgetFlowTableHead-277',
                appWidgetFlowTablecellValue: 'AppWidgetFlowTable-appWidgetFlowTablecellValue-278',
                appWidgetFlowTablecellValueRed:
                    'AppWidgetFlowTable-appWidgetFlowTablecellValueRed-279',
                appWidgetFlowTablecellValueYellow:
                    'AppWidgetFlowTable-appWidgetFlowTablecellValueYellow-280',
                appWidgetFlowTablecellValueGreen:
                    'AppWidgetFlowTable-appWidgetFlowTablecellValueGreen-281',
                appWidgetFlowTableIcon: 'AppWidgetFlowTable-appWidgetFlowTableIcon-282',
                appWidgetFlowTableIconRed: 'AppWidgetFlowTable-appWidgetFlowTableIconRed-283',
                appWidgetFlowTableCalloutContainer:
                    'AppWidgetFlowTable-appWidgetFlowTableCalloutContainer-284',
                appWidgetFlowTableCalloutText:
                    'AppWidgetFlowTable-appWidgetFlowTableCalloutText-285'
            },
            parent_obj: {}
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetFlowTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.queryByTestId('subtitle')).not.toBeInTheDocument();
    });
    test('Should render with different flow table data', () => {
        const props = {
            params: {
                flow_table: {
                    name: 'Inventory Cost Analysis',
                    sub_title: '£1.5m [8% YoY]',
                    sub_title_direction: 'down',
                    data: [
                        {
                            name: 'Warehouse',
                            incoming_text: 'Expected Demand: 15k Units',
                            table_headers: ['Warehouse', 'Inventory Level', 'Expected Demand'],
                            table_data: [
                                { cols: ['Warehouse 1', '12k Units', '5k Units'], rowspan: 3 },
                                { cols: ['Warehouse 2', '9k Units', '6k Units'], rowspan: 2 }
                            ]
                        }
                    ]
                }
            },
            classes: {
                appWidgetFlowTableContainer: 'AppWidgetFlowTable-appWidgetFlowTableContainer-262',
                appWidgetFlowTableLabel: 'AppWidgetFlowTable-appWidgetFlowTableLabel-263',
                appWidgetFlowTableSubLabel: 'AppWidgetFlowTable-appWidgetFlowTableSubLabel-264',
                appWidgetFlowTableSubLabelRed:
                    'AppWidgetFlowTable-appWidgetFlowTableSubLabelRed-265',
                appWidgetFlowTableSubLabelGreen:
                    'AppWidgetFlowTable-appWidgetFlowTableSubLabelGreen-266',
                appWidgetFlowTableGridItem: 'AppWidgetFlowTable-appWidgetFlowTableGridItem-267',
                appWidgetFlowTableItemHeaderContainer:
                    'AppWidgetFlowTable-appWidgetFlowTableItemHeaderContainer-268',
                appWidgetFlowTableItemHeader: 'AppWidgetFlowTable-appWidgetFlowTableItemHeader-269',
                appWidgetFlowTableItemIncomingContainer:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingContainer-270',
                appWidgetFlowTableItemIncoming:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncoming-271',
                appWidgetFlowTableItemIncomingLeftIcon1:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingLeftIcon1-272',
                appWidgetFlowTableItemIncomingLeftIcon2:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingLeftIcon2-273',
                appWidgetFlowTableItemIncomingRightIcon1:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingRightIcon1-274',
                appWidgetFlowTableItemIncomingRightIcon2:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingRightIcon2-275',
                appWidgetFlowTableItemTable: 'AppWidgetFlowTable-appWidgetFlowTableItemTable-276',
                appWidgetFlowTableHead: 'AppWidgetFlowTable-appWidgetFlowTableHead-277',
                appWidgetFlowTablecellValue: 'AppWidgetFlowTable-appWidgetFlowTablecellValue-278',
                appWidgetFlowTablecellValueRed:
                    'AppWidgetFlowTable-appWidgetFlowTablecellValueRed-279',
                appWidgetFlowTablecellValueYellow:
                    'AppWidgetFlowTable-appWidgetFlowTablecellValueYellow-280',
                appWidgetFlowTablecellValueGreen:
                    'AppWidgetFlowTable-appWidgetFlowTablecellValueGreen-281',
                appWidgetFlowTableIcon: 'AppWidgetFlowTable-appWidgetFlowTableIcon-282',
                appWidgetFlowTableIconRed: 'AppWidgetFlowTable-appWidgetFlowTableIconRed-283',
                appWidgetFlowTableCalloutContainer:
                    'AppWidgetFlowTable-appWidgetFlowTableCalloutContainer-284',
                appWidgetFlowTableCalloutText:
                    'AppWidgetFlowTable-appWidgetFlowTableCalloutText-285'
            },
            parent_obj: {}
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetFlowTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('Inventory Cost Analysis')).toBeInTheDocument();
        expect(screen.getByText('Expected Demand: 15k Units')).toBeInTheDocument();
    });
    test('should render sub_title if provided', () => {
        const props = {
            params: {
                flow_table: {
                    name: 'Total Inventory Management Cost',
                    sub_title: '£2m [12% YoY]',
                    data: [
                        {
                            name: 'RDCs',
                            incoming_text: 'Forecast Demand: 20k Units',
                            table_headers: [
                                'Regional Distribution Centres',
                                'On Hand Inventory',
                                'Estimated Demand'
                            ],
                            table_data: [
                                { cols: ['RDC 1', '14k Units', '5k Units'], rowspan: 4 },
                                { cols: ['RDC 2', '10k Units', '7k Units'], rowspan: 2 }
                            ]
                        }
                    ]
                }
            },
            classes: {
                appWidgetFlowTableContainer: 'AppWidgetFlowTable-appWidgetFlowTableContainer-262',
                appWidgetFlowTableLabel: 'AppWidgetFlowTable-appWidgetFlowTableLabel-263',
                appWidgetFlowTableSubLabel: 'AppWidgetFlowTable-appWidgetFlowTableSubLabel-264',
                appWidgetFlowTableSubLabelRed:
                    'AppWidgetFlowTable-appWidgetFlowTableSubLabelRed-265',
                appWidgetFlowTableSubLabelGreen:
                    'AppWidgetFlowTable-appWidgetFlowTableSubLabelGreen-266',
                appWidgetFlowTableGridItem: 'AppWidgetFlowTable-appWidgetFlowTableGridItem-267',
                appWidgetFlowTableItemHeaderContainer:
                    'AppWidgetFlowTable-appWidgetFlowTableItemHeaderContainer-268',
                appWidgetFlowTableItemHeader: 'AppWidgetFlowTable-appWidgetFlowTableItemHeader-269',
                appWidgetFlowTableItemIncomingContainer:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingContainer-270',
                appWidgetFlowTableItemIncoming:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncoming-271',
                appWidgetFlowTableItemIncomingLeftIcon1:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingLeftIcon1-272',
                appWidgetFlowTableItemIncomingLeftIcon2:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingLeftIcon2-273',
                appWidgetFlowTableItemIncomingRightIcon1:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingRightIcon1-274',
                appWidgetFlowTableItemIncomingRightIcon2:
                    'AppWidgetFlowTable-appWidgetFlowTableItemIncomingRightIcon2-275',
                appWidgetFlowTableItemTable: 'AppWidgetFlowTable-appWidgetFlowTableItemTable-276',
                appWidgetFlowTableHead: 'AppWidgetFlowTable-appWidgetFlowTableHead-277',
                appWidgetFlowTablecellValue: 'AppWidgetFlowTable-appWidgetFlowTablecellValue-278',
                appWidgetFlowTablecellValueRed:
                    'AppWidgetFlowTable-appWidgetFlowTablecellValueRed-279',
                appWidgetFlowTablecellValueYellow:
                    'AppWidgetFlowTable-appWidgetFlowTablecellValueYellow-280',
                appWidgetFlowTablecellValueGreen:
                    'AppWidgetFlowTable-appWidgetFlowTablecellValueGreen-281',
                appWidgetFlowTableIcon: 'AppWidgetFlowTable-appWidgetFlowTableIcon-282',
                appWidgetFlowTableIconRed: 'AppWidgetFlowTable-appWidgetFlowTableIconRed-283',
                appWidgetFlowTableCalloutContainer:
                    'AppWidgetFlowTable-appWidgetFlowTableCalloutContainer-284',
                appWidgetFlowTableCalloutText:
                    'AppWidgetFlowTable-appWidgetFlowTableCalloutText-285'
            },
            parent_obj: {}
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetFlowTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('£2m [12% YoY]')).toBeInTheDocument();
    });
    test('Should render correct subtitle styles based on direction', () => {
        const props = {
            params: {
                flow_table: {
                    name: 'Test Table',
                    sub_title: 'Test Subtitle',
                    sub_title_direction: 'up'
                }
            },
            classes: {
                appWidgetFlowTableSubLabelGreen: 'green-class',
                appWidgetFlowTableSubLabelRed: 'red-class',
                appWidgetFlowTableSubLabel: 'default-class'
            }
        };

        const { container } = render(
            <CustomThemeContextProvider>
                <AppWidgetFlowTable {...props} />
            </CustomThemeContextProvider>
        );

        expect(container.querySelector('.green-class')).toBeInTheDocument();
    });
    test('Should render incoming text and icons if incoming_text is present', () => {
        const props = {
            params: {
                flow_table: {
                    data: [
                        {
                            name: 'Table Name',
                            incoming_text: 'Incoming Data',
                            incoming_text_icons: ['icon1', 'icon2']
                        }
                    ]
                }
            },
            classes: {
                appWidgetFlowTableItemIncomingContainer: 'incoming-container',
                appWidgetFlowTableItemIncomingLeftIcon1: 'left-icon1',
                appWidgetFlowTableItemIncomingLeftIcon2: 'left-icon2',
                appWidgetFlowTableItemIncomingRightIcon1: 'right-icon1',
                appWidgetFlowTableItemIncomingRightIcon2: 'right-icon2'
            }
        };

        const { getByText } = render(
            <CustomThemeContextProvider>
                <AppWidgetFlowTable {...props} />
            </CustomThemeContextProvider>
        );

        expect(getByText('Incoming Data')).toBeInTheDocument();
    });
    test('Should render table rows with alerts correctly', () => {
        const props = {
            params: {
                flow_table: {
                    data: [
                        {
                            name: 'Table Name',
                            table_headers: ['Header 1'],
                            table_data: [
                                {
                                    cols: ['Cell 1'],
                                    rowspan: 1,
                                    alerts: ['red']
                                }
                            ]
                        }
                    ]
                }
            },
            classes: {
                appWidgetFlowTablecellValueRed: 'red-class',
                appWidgetFlowTablecellValue: 'default-class'
            }
        };

        const { getByText } = render(
            <CustomThemeContextProvider>
                <AppWidgetFlowTable {...props} />
            </CustomThemeContextProvider>
        );

        expect(getByText('Cell 1')).toHaveClass('red-class');
    });
    test('Should render table data with actions and status correctly', () => {
        const props = {
            params: {
                flow_table: {
                    data: [
                        {
                            name: 'Table Name',
                            table_headers: ['Header 1'],
                            table_data: [
                                {
                                    cols: ['Cell 1'],
                                    rowspan: 1,
                                    status: 'SUCCESS',
                                    test_link: 'http://test.link',
                                    log_link: 'http://log.link',
                                    trigger_link: 'http://trigger.link',
                                    alerts: []
                                }
                            ],
                            show_actions: true,
                            show_status: true
                        }
                    ]
                }
            },
            classes: {
                appWidgetFlowTableIcon: 'icon-class',
                appWidgetFlowTablecellValueGreen: 'green-class'
            }
        };

        const { getByRole } = render(
            <CustomThemeContextProvider>
                <AppWidgetFlowTable {...props} />
            </CustomThemeContextProvider>
        );

        expect(getByRole('button', { name: /Validations/i })).toBeInTheDocument();
        expect(getByRole('button', { name: /Logs/i })).toBeInTheDocument();
        expect(getByRole('button', { name: /Trigger/i })).toBeInTheDocument();
    });
});
