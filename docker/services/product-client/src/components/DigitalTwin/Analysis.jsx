import React from 'react';
import {
    Select,
    MenuItem,
    ListItemText,
    FormControl,
    InputLabel,
    Checkbox
} from '@material-ui/core';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';

function Analysis({ data, classes, display_kpi_options, onChangeDropDown }) {
    return (
        <div key={'digital_twin_drawer_zone_container'} className={classes.actionFiltersContainer}>
            <div className={classes.digitalTwinActionFilterHeader}>Filters</div>
            <FormControl className={classes.digitalTwinPopupDropdown}>
                <InputLabel>Metric</InputLabel>
                <Select
                    id="metric-select"
                    value={data.displayKPI}
                    label={'Metric'}
                    onChange={(evt) => onChangeDropDown(evt.target.value, 'metric')}
                >
                    {display_kpi_options.map((element) => (
                        <MenuItem
                            key={element.value}
                            value={element.value}
                            className={classes.digitalTwinPopupDropdownMenuItem}
                        >
                            <ListItemText primary={element.label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div style={{ display: 'flex', gap: '1rem' }}>
                {data.digitaltwin_data[data.actionOpen].extra_filters.map((filter_item) => {
                    return (
                        <FormControl
                            className={classes.digitalTwinPopupDropdownMultiple}
                            key={filter_item.name}
                        >
                            <InputLabel id={filter_item.name} className={classes.dropdownLabel}>
                                {filter_item.name}
                            </InputLabel>
                            <Select
                                value={data.analysis_filters[filter_item.name]}
                                className={classes.multipleDropdown}
                                multiple={filter_item?.multiselect ? true : false}
                                renderValue={(selected) => {
                                    let selectedLabels = [];
                                    if (filter_item.multiselect) {
                                        if (selected.includes('all')) {
                                            let reselected = selected.filter((el) => el !== 'all');
                                            for (let i in reselected) {
                                                selectedLabels.push(
                                                    filter_item.options.filter(
                                                        (el) => el.value === reselected[i]
                                                    )[0].label
                                                );
                                            }
                                        } else {
                                            for (let i in selected) {
                                                selectedLabels.push(
                                                    filter_item.options.filter(
                                                        (el) => el.value === selected[i]
                                                    )[0].label
                                                );
                                            }
                                        }
                                    }
                                    let content = filter_item?.multiselect
                                        ? selectedLabels.join(',')
                                        : selected;
                                    return content;
                                }}
                                onChange={(evt) => {
                                    onChangeDropDown(evt.target.value, filter_item.name);
                                }}
                            >
                                {filter_item.multiselect && (
                                    <MenuItem value="all" name="All">
                                        <Checkbox
                                            checked={
                                                data.analysis_filters[filter_item.name].indexOf(
                                                    'all'
                                                ) > -1
                                            }
                                        />
                                        <ListItemText primary="Select all" />
                                    </MenuItem>
                                )}
                                {filter_item.options.map((el) => {
                                    return (
                                        <MenuItem
                                            key={el.value}
                                            value={el.value}
                                            name={el.label}
                                            className={classes.digitalTwinPopupDropdownMenuItem}
                                        >
                                            {filter_item?.multiselect && (
                                                <Checkbox
                                                    checked={
                                                        data.analysis_filters[
                                                            filter_item.name
                                                        ].indexOf(el.value) > -1
                                                    }
                                                />
                                            )}
                                            <ListItemText primary={el.label} />
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    );
                })}
            </div>
            <br />
            <div className={classes.digitalTwinActionContainer}>
                {data.actionLoading ? (
                    <div className={classes.digitalTwinActionLoadingBody} data-testid="loader">
                        <CodxCircularLoader size={60} center />
                    </div>
                ) : (
                    <div className={classes.digitalTwinActionBody}>{data.actionPlot}</div>
                )}
            </div>
        </div>
    );
}

export default Analysis;
