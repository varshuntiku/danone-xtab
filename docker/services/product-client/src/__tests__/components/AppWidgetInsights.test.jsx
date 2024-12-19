import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppWidgetInsights from '../../components/AppWidgetInsights';
import CustomThemeContextProvider from '../../themes/customThemeContext';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render AppScreen Component', () => {
        const props = {
            classes: {
                infoWidgetInsight: 'AppWidgetInsights-infoWidgetInsight-1053',
                successWidgetInsight: 'AppWidgetInsights-successWidgetInsight-1054',
                warningWidgetInsight: 'AppWidgetInsights-warningWidgetInsight-1055',
                insightHeader: 'AppWidgetInsights-insightHeader-1056',
                insightExtraValue: 'AppWidgetInsights-insightExtraValue-1057'
            },
            params: {
                insight_data: [
                    {
                        label: 'Lowest Demand',
                        severity: 'warning',
                        value: 'Week 265 (Post-Christmas Week 2017)'
                    },
                    {
                        label: 'Highest Demand',
                        severity: 'success',
                        value: 'Week 232 (Black Friday Week)'
                    },
                    {
                        label: 'Seasonal Spikes',
                        severity: 'success',
                        value: 'Mar, Aug, Nov (End of Season)'
                    },
                    { label: 'Seasonal Troughs', severity: 'warning', value: 'Dec, Jan' },
                    { label: 'Most Volatile months', value: 'Nov, Dec' },
                    { label: 'Cyclical pattern observed repeats at about 3 years interval' }
                ],
                insight_label: 'Alerts'
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetInsights {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render AppScreen Component with up and down arrows', () => {
        const props = {
            classes: {
                infoWidgetInsight: 'AppWidgetInsights-infoWidgetInsight-2199',
                successWidgetInsight: 'AppWidgetInsights-successWidgetInsight-2200',
                warningWidgetInsight: 'AppWidgetInsights-warningWidgetInsight-2201',
                insightHeader: 'AppWidgetInsights-insightHeader-2202',
                insightExtraValue: 'AppWidgetInsights-insightExtraValue-2203'
            },
            params: {
                insight_data: [
                    {
                        label: 'Sales - Volume',
                        severity: 'success',
                        arrow: 'down',
                        alt_behaviour: 'true',
                        value: '100K Units',
                        extra_value: '20%'
                    },
                    { label: 'Revenue', arrow: 'up', value: '$134 M' },
                    { label: 'Deviation from 1YP', severity: 'success', value: '$17 M' },
                    { label: 'Estimated Reversal Cost', value: '$1 M' }
                ],
                insight_label: 'Scenario 2 : Outcome'
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetInsights {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render AppScreen Component with alt Behaviour color for arrow', () => {
        const props = {
            classes: {
                infoWidgetInsight: 'AppWidgetInsights-infoWidgetInsight-2199',
                successWidgetInsight: 'AppWidgetInsights-successWidgetInsight-2200',
                warningWidgetInsight: 'AppWidgetInsights-warningWidgetInsight-2201',
                insightHeader: 'AppWidgetInsights-insightHeader-2202',
                insightExtraValue: 'AppWidgetInsights-insightExtraValue-2203'
            },
            params: {
                insight_data: [
                    {
                        label: 'Sales - Volume',
                        severity: 'success',
                        arrow: 'down',
                        value: '100K Units',
                        extra_value: '20%'
                    },
                    { label: 'Revenue', arrow: 'up', alt_behaviour: 'true', value: '$134 M' },
                    { label: 'Deviation from 1YP', severity: 'success', value: '$17 M' },
                    { label: 'Estimated Reversal Cost', value: '$1 M' }
                ],
                insight_label: 'Scenario 2 : Outcome'
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetInsights {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render custom insight with BulbIcon', () => {
        const props = {
            classes: {
                customInsightContainer: 'AppWidgetInsights-customInsightContainer-1053',
                bulbIconSuccess: 'AppWidgetInsights-bulbIconSuccess-1054',
                bulbIconFailure: 'AppWidgetInsights-bulbIconFailure-1055',
                bulbIconNeutral: 'AppWidgetInsights-bulbIconNeutral-1056',
                customInsightHeading: 'AppWidgetInsights-customInsightHeading-1057'
            },
            params: {
                insight_data: [
                    {
                        insight_type: 'custom',
                        label: 'Custom Insight',
                        success: true,
                        iconLabel: true,
                        likes: 10,
                        dislikes: 2,
                        comments: 5,
                        share: true
                    }
                ],
                insight_label: 'Custom Insight Label'
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetInsights {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('Custom Insight')).toBeInTheDocument();
        expect(screen.getByAltText('Bulb-Icon')).toBeInTheDocument();
    });

    test('Should render ArrowDownwardIcon with alt_behaviour as true', () => {
        const props = {
            classes: {
                arrowRedIcon: 'AppWidgetInsights-arrowRedIcon-1054',
                arrowGreenIcon: 'AppWidgetInsights-arrowGreenIcon-1055'
            },
            params: {
                insight_data: [
                    {
                        label: 'Sales - Volume',
                        arrow: 'down',
                        alt_behaviour: true,
                        value: '100K Units'
                    }
                ],
                insight_label: 'Arrow Insight Label'
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetInsights {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('Sales - Volume')).toBeInTheDocument();
        expect(screen.getByText('100K Units')).toBeInTheDocument();
    });

    test('Should render ArrowUpwardIcon with default behaviour', () => {
        const props = {
            classes: {
                arrowRedIcon: 'AppWidgetInsights-arrowRedIcon-1054',
                arrowGreenIcon: 'AppWidgetInsights-arrowGreenIcon-1055'
            },
            params: {
                insight_data: [
                    {
                        label: 'Revenue',
                        arrow: 'up',
                        alt_behaviour: false,
                        value: '$134 M'
                    }
                ],
                insight_label: 'Arrow Insight Label'
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetInsights {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('Revenue')).toBeInTheDocument();
        expect(screen.getByText('$134 M')).toBeInTheDocument();
    });

    test('Should render InsightStatus when params.insight_status is present', () => {
        const props = {
            classes: {},
            params: {
                insight_data: [],
                insight_status: {
                    status: 'active',
                    message: 'Insight Status Message'
                }
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetInsights {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('Status:')).toBeInTheDocument();
        expect(screen.getByText('active')).toBeInTheDocument();
        expect(screen.getByText('Updated On:')).toBeInTheDocument();
        expect(screen.getByText('Updated By:')).toBeInTheDocument();
    });
});
