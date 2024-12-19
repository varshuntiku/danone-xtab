import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import {
    Select,
    MenuItem,
    ListItemText,
    Checkbox,
    Divider,
    FormControl,
    InputLabel
} from '@material-ui/core';
// import createPlotlyComponent from 'react-plotly.js/factory';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import DynamicForm from 'components/dynamic-form/dynamic-form';

function RightPopout({ data, classes, drawer_data, rightPopoutStateChange }) {
    // const Plotly = window.Plotly;
    // const Plot = createPlotlyComponent(Plotly);
    // const { CodxBkgdColor, CodxTextColor, CodxBkgdLightColor, CodxContrastColor } = themeContextPlot;
    const [activeTab, setActiveTab] = useState(
        data.digitaltwin_data.drawer.tabs ? data.digitaltwin_data?.drawer?.tabs[0].id : ' '
    );
    const [tabData, setTabData] = useState({ fields: [] });
    const [loader, setLoader] = useState(false);
    // const renderSectionOptions = (dropdown_options) => {
    //     return (
    //         <div className={classes.drawerSectionOptionsContainer}>
    //             <div className={clsx(classes.drawerSectionOptionsBody, classes.digitalTwinPopupDropdown)}>
    //                 <Select fullWidth={true} value={dropdown_options[0]}>
    //                     {dropdown_options.map(element => (
    //                         <MenuItem key={element} value={element} className={classes.digitalTwinPopupDropdownMenuItem}>
    //                             <ListItemText primary={element} />
    //                         </MenuItem>
    //                     ))}
    //                 </Select>
    //                 <br clear="all" />
    //             </div>
    //             <br clear="all" />
    //         </div>
    //     );
    // }

    useEffect(() => {
        if (data.digitaltwin_data.drawer.tabs) {
            setActiveTab(data.digitaltwin_data?.drawer?.tabs[0].id);
        } else setActiveTab('');
    }, [data]);

    const handleTab = (tab) => {
        setLoader(true);
        setActiveTab(tab);
        setTimeout(() => {
            setLoader(false);
        }, [1000]);
    };

    useEffect(() => {
        if (data.digitaltwin_data?.drawer[activeTab]) {
            setTabData({
                fields: JSON.parse(JSON.stringify(data.digitaltwin_data?.drawer[activeTab]))
            });
        }
    }, [activeTab]);
    const renderContent = (drawer_data) => {
        if (drawer_data?.tabs) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {data.rightpopoutLoading ? (
                        <div>
                            <CodxCircularLoader size={60} center />
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex' }}>
                                {drawer_data.tabs.map((tab) => (
                                    <Typography
                                        className={
                                            activeTab === tab.id
                                                ? classes.tabViewSelected
                                                : classes.tabView
                                        }
                                        key={tab.id}
                                        variant="h4"
                                        onClick={() => handleTab(tab.id)}
                                    >
                                        {tab.label}
                                    </Typography>
                                ))}
                            </div>
                            <Divider></Divider>
                            {loader || data.rightpopoutLoading ? (
                                <CodxCircularLoader size={60} center />
                            ) : (
                                <DynamicForm
                                    params={tabData}
                                    origin={'digital-twin'}
                                    onChange={setTabData}
                                />
                            )}
                        </div>
                    )}
                </div>
            );
        }
    };
    return (
        <div
            className={
                data.drawerOpen
                    ? clsx(
                          classes.digitalTwinPopup,
                          drawer_data?.isStagged
                              ? classes.digitalTwinDetailsDrawerisStagged
                              : classes.digitalTwinDetailsDrawer
                      )
                    : classes.digitalTwinPopupHidden
            }
            style={{ width: data.drawerSizes[drawer_data.size] + 'rem' }}
        >
            <div
                key={'digital_twin_drawer_zone_container'}
                className={clsx(classes.drawerDropdown, classes.digitalTwinPopupDropdown)}
            >
                {data.digitaltwin_data?.drawer?.extra_filters && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {data.digitaltwin_data?.drawer?.extra_filters.map((filter_item) => {
                            return (
                                <FormControl
                                    className={classes.digitalTwinPopupDropdownMultiple}
                                    key={filter_item.name}
                                >
                                    <InputLabel
                                        id={filter_item.name}
                                        className={classes.dropdownLabel}
                                    >
                                        {filter_item.name}
                                    </InputLabel>
                                    <Select
                                        value={data.rightpopout_filters[filter_item.name]}
                                        className={classes.multipleDropdown}
                                        multiple={filter_item?.multiselect ? true : false}
                                        renderValue={(selected) => {
                                            let selectedLabels = [];
                                            if (filter_item.multiselect) {
                                                if (selected.includes('all')) {
                                                    let reselected = selected.filter(
                                                        (el) => el !== 'all'
                                                    );
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
                                        onChange={(evt) =>
                                            rightPopoutStateChange(
                                                evt.target.value,
                                                filter_item.name
                                            )
                                        }
                                    >
                                        {filter_item.multiselect && (
                                            <MenuItem value="all" name="All">
                                                <Checkbox
                                                    checked={
                                                        data.rightpopout_filters[
                                                            filter_item.name
                                                        ].indexOf('all') > -1
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
                                                    className={
                                                        classes.digitalTwinPopupDropdownMenuItem
                                                    }
                                                >
                                                    {filter_item?.multiselect && (
                                                        <Checkbox
                                                            checked={
                                                                data.rightpopout_filters[
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
                )}
                <br />
            </div>
            {data.rightpopoutLoading && <CodxCircularLoader size={60} center />}
            {drawer_data && renderContent(data.digitaltwin_data.drawer)}
        </div>
    );
}

export default RightPopout;
