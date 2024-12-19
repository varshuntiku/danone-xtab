import React from 'react';
import RightPopout from './RightPopout.jsx';
import Analysis from './Analysis.jsx';
import Simulate from './Simulate.jsx';
import * as _ from 'underscore';

function Drawer({
    data,
    classes,
    drawer_zone_options,
    onChangeZone,
    CodxFontFamily,
    themeContextPlot,
    onChangeSlider,
    onSimulateScenario,
    onShowSimulateOutput,
    onShowSimulateInput,
    onChangeDropDown,
    drawer_data,
    rightPopoutStateChange
}) {
    var display_kpi_options = _.map(data.digitaltwin_data.display_kpis, function (display_kpi) {
        return {
            label: display_kpi.name,
            value: display_kpi.value
        };
    });

    var date_options = [
        { label: '3/1 3/2', value: 'first_date' },
        { label: '3/2 3/3', value: 'second_date' },
        { label: '3/3 3/4', value: 'third_date' }
    ];

    var comparison_metric = [
        { label: 'vs Planned', value: 'vs planned' },
        { label: 'vs % Repicks', value: 'vs % Repicks' },
        { label: 'vs Prior week avg', value: 'vs Prior week avg' },
        { label: 'vs Prior month avg', value: 'vs Prior month avg' },
        { label: ' vs Prior quarter avg', value: 'Prior quarter avg' }
    ];
    var drawer_zone_options1 = drawer_zone_options();

    var base_plan_options = [{ value: 'yr2023_feb', label: 'YR2023/ Feb' }];

    var scenario_options = [{ value: 'scenario_1', label: 'Scenario 1' }];

    var date_options_simulate = [];
    var date_index = 0;
    var current_date = new Date();
    while (date_index < 7) {
        current_date.setDate(current_date.getDate() + 1);
        date_options_simulate.push({
            value: current_date.getMonth() + 1 + '/' + current_date.getDate(),
            label: current_date.getMonth() + 1 + '/' + current_date.getDate()
        });
        date_index++;
    }

    var zone_options = [{ label: 'Select All', value: 'all' }];

    _.each(
        _.groupBy(
            _.unique(
                _.map(data.digitaltwin_data.metrics, function (metric_item) {
                    return {
                        name: metric_item.name,
                        group: metric_item.group
                    };
                }),
                false
            ),
            function (metric_mapped_item) {
                return metric_mapped_item.group;
            }
        ),
        function (zones, zone_group) {
            zone_options.push({ label: zone_group + '/ All Zones', value: zone_group + '_all' });

            _.each(
                _.uniq(
                    _.map(zones, function (zone_item) {
                        return zone_item.name;
                    })
                ),
                function (filtered_zone_item) {
                    if (filtered_zone_item) {
                        zone_options.push({
                            label: zone_group + '/ ' + filtered_zone_item,
                            value: zone_group + '_' + filtered_zone_item
                        });
                    }
                }
            );
        }
    );

    const renderDrawer = () => {
        if (data.drawerOpen) {
            return (
                <RightPopout
                    data={data}
                    classes={classes}
                    drawer_zone_options={drawer_zone_options1}
                    onChangeZone={onChangeZone}
                    CodxFontFamily={CodxFontFamily}
                    themeContextPlot={themeContextPlot}
                    onChangeDropDown={(value, type) => onChangeDropDown(value, type)}
                    drawer_data={drawer_data}
                    rightPopoutStateChange={(evt, dropdown_type) =>
                        rightPopoutStateChange(evt, dropdown_type)
                    }
                />
            );
        } else if (data.actionOpen) {
            return (
                <Analysis
                    data={data}
                    classes={classes}
                    display_kpi_options={display_kpi_options}
                    date_options={date_options}
                    drawer_zone_options={drawer_zone_options1}
                    onChangeDropDown={(value, type) => onChangeDropDown(value, type)}
                    comparison_metric={comparison_metric}
                />
            );
        } else if (data.simulateOpen) {
            return (
                <Simulate
                    data={data}
                    classes={classes}
                    base_plan_options={base_plan_options}
                    scenario_options={scenario_options}
                    zone_options={zone_options}
                    date_options_simulate={date_options_simulate}
                    CodxFontFamily={CodxFontFamily}
                    themeContextPlot={themeContextPlot}
                    onChangeSlider={onChangeSlider}
                    onSimulateScenario={onSimulateScenario}
                    onShowSimulateOutput={onShowSimulateOutput}
                    onShowSimulateInput={onShowSimulateInput}
                    rightPopoutStateChange={(evt, dropdown_type) =>
                        rightPopoutStateChange(evt, dropdown_type)
                    }
                />
            );
        }
    };
    return data && renderDrawer();
}
export default Drawer;
