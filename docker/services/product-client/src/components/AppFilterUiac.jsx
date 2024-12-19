import React, { useState, useEffect } from 'react';
import {
    MenuItem,
    ClickAwayListener,
    List,
    ListItem,
    ListItemText,
    Grid,
    Button,
    Typography,
    Popover
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import DateRangeSelect from './AppWidgetMultiSelect/DateRangeSelect.jsx';
import NumberRangeSelect from './AppWidgetMultiSelect/NumberRangeSelect.jsx';
import { makeStyles } from '@material-ui/core/styles';
import { getWidgetfilters } from '../services/filters.js';
import { ReactComponent as FilterIcon } from 'assets/Icons/filterIcon.svg';
import RefreshIcon from '@material-ui/icons/Refresh';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    tag: {
        padding: '2px 8px 2px 11px',
        border: '1px solid #E9EEEE',
        borderRadius: '2px',
        cursor: 'pointer',
        marginBottom: theme.spacing(1),
        minHeight: '3.4rem',
        maxHeight: '4.4rem',
        fontSize: '1.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '0.6rem',
        color: theme.palette.text.default
    },
    iconStyle: {
        width: '2.14rem',
        border: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dropdownStyle: {
        width: 'auto',
        margin: '1rem'
    },
    dropdownRenderContainer: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    dropdownContainer: {
        position: 'relative',
        margin: '0.2rem'
    },
    dropdownText: {
        fontSize: '1.5rem',
        color: 'theme.palette.text.default'
    },
    hierarchicialDropdownMenu: {
        position: 'absolute',
        right: 0,
        zIndex: 10000,
        background: '#fff',
        borderRadius: '2px',
        fontSize: '15px',
        color: theme.palette.text.default,
        boxShadow: '3px 2px 8px 0px #00000040 !important',
        overflowX: 'scroll'
    },
    gridContainer: {
        width: '88.37rem',
        height: '21.45rem'
    },
    leftPanel: {
        fontSize: '1.5rem',
        borderRight: '1px solid #c5c5c5',
        borderBottom: '1px solid #c5c5c5',
        padding: theme.spacing(0.7),
        width: '26.37rem',
        height: '21.45rem',
        overflowY: 'scroll'
    },
    leftPanelText: {
        color: theme.palette.text.default,
        width: 'auto',
        paddingLeft: '0.5rem',
        '&:hover': {
            borderColor: theme.palette.text.sidebarSelected,
            backgroundColor: theme.palette.text.backgroundColor
        },
        '&.Mui-selected': {
            backgroundColor: '#d6eaff'
        }
    },

    detailedArrows: {
        width: '2rem',
        height: '2rem',
        fontSize: '2rem',
        fontWeight: '800'
    },

    rightPanel: {
        borderBottom: '1px solid #c5c5c5',
        width: '62rem',
        height: '21.45rem',
        overflowY: 'scroll'
    },

    detailedRightPanel: {
        height: '21.45rem',
        display: 'flex',
        justifyContent: 'flex-start',
        width: 'auto',
        flexWrap: 'wrap'
    },

    buttonContainer: {
        width: '27.37rem',
        display: 'flex',
        gap: '0.4rem',
        justifyContent: 'space-between',
        maxWidth: '26.37rem'
    },

    applyButton: {
        width: '5.2rem',
        marginTop: '0.6rem',
        color: theme.button.applyButton.color,
        borderColor: theme.palette.text.sidebarSelected,
        backgroundColor: theme.palette.text.sidebarSelected,
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        letterSpacing: theme.layoutSpacing(0.5),
        '&:hover': {
            borderColor: theme.palette.text.sidebarSelected,
            backgroundColor: theme.palette.text.sidebarSelected
        },
        height: theme.layoutSpacing(33),
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(24)}`
    },

    detailedRightPanelText: {
        padding: '0',
        height: '1rem',
        width: '13.6rem',
        '&:hover': {
            backgroundColor: theme.palette.background.paper
        }
    },
    itemCount: {
        marginTop: '1rem',
        fontWeight: 600,
        marginLeft: '48rem'
    },
    itemCountText: {
        fontSize: '1.5rem',
        background: theme.palette.background.insightSuccess,
        color: theme.palette.text.default,
        padding: '3px'
    },
    footer: {
        height: '5.5rem',
        display: 'flex'
    },

    checkbox: {
        '&:hover': {
            backgroundColor: theme.palette.background.paper
        }
    },

    radio: {
        '&:hover': {
            backgroundColor: theme.palette.background.paper
        }
    },
    resetButton: {
        marginTop: '1rem',
        marginLeft: '1rem',
        width: '3rem',
        height: '3rem',
        cursor: 'pointer',
        color: theme.palette.icons.closeIcon
    },
    cancelButton: {
        marginTop: '0.3rem',
        fontSize: '1.5rem',
        margiLeft: '0.5rem'
    },
    dropdownItem: {
        color: theme.palette.text.default,
        border: '1px',
        minHeight: '3.5rem',
        fontSize: '1.5rem',
        '&:hover': {
            borderColor: theme.palette.text.sidebarSelected,
            backgroundColor: '#C9DEF499'
        },
        '&.Mui-selected': {
            backgroundColor: '#d6eaff'
        }
    },

    titleSelectLabel: {
        fontWeight: '500'
    },
    filterButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto'
    },
    filterTitle: {
        color: theme.palette.text.default
    },
    icon: {
        width: '3rem',
        height: '2rem',
        '& path': {
            fill: theme.palette.border.widgetFilterIcon
        }
    },
    dateRangeContainer: {
        padding: '2rem'
    },
    NumberRangeContainer: {
        paddingLeft: '1rem',
        height: '2rem'
    },
    dropdownArrows: {
        fontSize: '4rem'
    }
}));

const AppFilterUiac = ({
    filterCode,
    handleWidgetLevelFilterTrigger,
    app_id,
    screen_id,
    widget_id
}) => {
    const classes = useStyles();
    const [selectedValues, setSelectedValues] = useState({});
    const [activeLabel, setActiveLabel] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [widgetTargetKey, setWidgetTargetKey] = useState(null);
    const [checkedItems, setCheckedItems] = useState({});
    const [dynamicData, setDynamicData] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [sliderValue, setSliderValue] = useState([]);
    const [dateValue, setDateValue] = useState({});
    const {
        displayType = 'value_dropdown',
        dropdownType = 'simple',
        filterType = 'non-hierarchical',
        dataValues
    } = filterCode || {};

    useEffect(() => {
        if (dataValues) {
            const initialValues = {};
            dataValues.forEach((item) => {
                initialValues[item.widget_tag_label] = item.widget_default_filter;
                if (item.widget_select_type === 'number_range') {
                    setSliderValue(item.widget_tag_value[0]);
                }
                if (item.widget_select_type === 'date_range') {
                    setDateValue(item.widget_tag_value[0]);
                }
            });
            setSelectedValues(initialValues);
        }
    }, [dataValues]);

    useEffect(() => {
        const fetchWidgetFilters = async () => {
            if (filterType === 'hierarchical' && widgetTargetKey) {
                const formattedSelectedValues = {};

                Object.keys(selectedValues).forEach((key) => {
                    const value = selectedValues[key];
                    formattedSelectedValues[key] = Array.isArray(value) ? value : [value];
                });

                try {
                    await getWidgetfilters({
                        app_id: app_id,
                        screen_id,
                        widget_id,
                        payload: {
                            current_filter: widgetTargetKey,
                            selected: formattedSelectedValues
                        },
                        callback: (resp) => {
                            if (resp && resp.dataValues) {
                                setDynamicData(resp.dataValues);
                            }
                        }
                    });
                } catch (error) {
                    return error;
                }
            }
        };

        fetchWidgetFilters();
    }, [selectedValues, widgetTargetKey, filterType]);

    const handleOptionClick = (value, label, selectType = 'single') => {
        if (dropdownType === 'detailed') {
            const updatedCheckedItems =
                selectType === 'multiple'
                    ? (checkedItems[label] || []).includes(value)
                        ? (checkedItems[label] || []).filter((item) => item !== value)
                        : [...(checkedItems[label] || []), value]
                    : [value];

            setCheckedItems({
                ...checkedItems,
                [label]: updatedCheckedItems
            });
            setSelectedValues((prev) => ({
                ...prev,
                [label]: selectType === 'multiple' ? updatedCheckedItems : value
            }));
            if (filterType === 'hierarchical') {
                setWidgetTargetKey(label);
                if (dropdownType === 'simple') {
                    handleWidgetLevelFilterTrigger(
                        { ...selectedValues, [label]: updatedCheckedItems },
                        JSON.stringify({ ...selectedValues, [label]: updatedCheckedItems })
                    );
                }
            }
        } else {
            setSelectedValues((prev) => ({
                ...prev,
                [label]: value
            }));
            if (filterType === 'hierarchical') {
                handleWidgetLevelFilterTrigger(
                    { ...selectedValues, [label]: value },
                    JSON.stringify({ ...selectedValues, [label]: value })
                );
                setWidgetTargetKey(label);
            } else {
                handleWidgetLevelFilterTrigger(value, JSON.stringify({ [label]: value }));
            }
            setActiveLabel(null);
        }
    };

    const toggleDropdown = (label, event) => {
        setActiveLabel((prev) => (prev === label ? null : label));

        if (event && event.currentTarget) {
            setAnchorEl(event.currentTarget);
            if (dropdownType === 'detailed') {
                setDropdownOpen(true);
            }
        } else {
            setAnchorEl(null);
        }
    };

    const handleClickAway = () => {
        setActiveLabel(null);
        setDropdownOpen(false);
        setAnchorEl(null);
    };

    const handleDateSelect = (value) => {
        setDateValue(value);
        handleOptionClick(value, 'Date');
    };

    const onRangeChange = (value) => {
        setSliderValue(value);
        handleOptionClick(value, 'Range');
    };

    const renderDropdownLabel = (label) => {
        switch (displayType) {
            case 'icon':
                return <FilterIcon className={classes.icon} />;
            case 'filter_icon':
                return (
                    <div className={classes.filterButton}>
                        <FilterIcon className={classes.icon} />
                        {dropdownType === 'detailed' ? (
                            <span className={classes.filterTitle}>Filter</span>
                        ) : (
                            <span className={classes.filterTitle}> {label}</span>
                        )}
                    </div>
                );
            case 'title_value_dropdown':
                return dropdownType === 'detailed' ? (
                    <FilterIcon className={classes.icon} />
                ) : (
                    <span>
                        <span className={classes.titleSelectLabel}>{label}:</span>
                        <span> {selectedValues[label]}</span>
                    </span>
                );
            case 'value_dropdown':
                return dropdownType === 'detailed' ? (
                    <FilterIcon className={classes.icon} />
                ) : (
                    selectedValues[label]
                );
            default:
                return null;
        }
    };

    const handleReset = () => {
        setCheckedItems({});
        setSelectedValues({});
    };

    const handleApply = () => {
        let selectedFilters = {};
        if (filterType === 'hierarchical') {
            Object.keys(checkedItems).forEach((label) => {
                if (checkedItems[label].length > 0) {
                    selectedFilters[label] = checkedItems[label];
                }
            });
        } else {
            Object.keys(selectedValues).forEach((label) => {
                if (selectedValues[label]) {
                    selectedFilters[label] = selectedValues[label];
                }
            });
        }
        handleWidgetLevelFilterTrigger(selectedFilters, JSON.stringify(selectedFilters));
        setDropdownOpen(false);
        setAnchorEl(null);
    };

    const handleCancel = () => {
        setDropdownOpen(false);
        setAnchorEl(null);
    };

    const countSelectedItems = () => {
        return Object.values(checkedItems).reduce((acc, items) => acc + items.length, 0);
    };

    if (!dataValues || dataValues.length === 0) {
        return null;
    }

    const renderDropdownOptions = (label) => {
        const dynamicFilter = (dynamicData || dataValues).find(
            (item) => item.widget_tag_label === label
        );
        if (dynamicFilter && dynamicFilter.widget_select_type === 'date_range') {
            return (
                <div className={classes.dateRangeContainer}>
                    <DateRangeSelect value={dateValue} onChangeFilter={handleDateSelect} />
                </div>
            );
        } else if (dynamicFilter && dynamicFilter.widget_select_type === 'number_range') {
            return (
                <div className={classes.NumberRangeContainer}>
                    <NumberRangeSelect
                        value={sliderValue}
                        onChange={onRangeChange}
                        params={dynamicFilter.widget_tag_value[1]}
                    />
                </div>
            );
        } else {
            return (
                <List className={classes.detailedRightPanel}>
                    {dynamicFilter?.widget_tag_value.map((option) => (
                        <MenuItem
                            key={option}
                            onClick={() =>
                                handleOptionClick(option, label, dynamicFilter.widget_select_type)
                            }
                            className={classes.detailedRightPanelText}
                        >
                            {dropdownType === 'detailed' &&
                            dynamicFilter.widget_select_type === 'multiple' ? (
                                <Checkbox
                                    className={classes.checkbox}
                                    checked={checkedItems[label]?.includes(option) || false}
                                    onChange={() => handleOptionClick(option, label, 'multiple')}
                                />
                            ) : (
                                <Radio
                                    className={classes.radio}
                                    checked={checkedItems[label]?.[0] === option}
                                    name={label}
                                    onChange={() => handleOptionClick(option, label, 'single')}
                                />
                            )}
                            <div className={classes.dropdownText}>{option}</div>
                        </MenuItem>
                    ))}
                </List>
            );
        }
    };
    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div className={classes.dropdownRenderContainer}>
                {dropdownType === 'simple' ? (
                    (dynamicData || dataValues)
                        .filter(
                            (dropdownData) =>
                                dropdownData.widget_select_type !== 'date_range' &&
                                dropdownData.widget_select_type !== 'number_range'
                        )
                        .map((dropdownData) => (
                            <div
                                key={dropdownData.widget_tag_label}
                                className={classes.dropdownContainer}
                            >
                                <div
                                    className={classes.tag}
                                    onClick={(event) =>
                                        toggleDropdown(dropdownData.widget_tag_label, event)
                                    }
                                >
                                    {displayType === 'icon' ? (
                                        <span className={classes.iconStyle}>
                                            {renderDropdownLabel(dropdownData.widget_tag_label)}
                                        </span>
                                    ) : (
                                        <span className={classes.dropdownStyle}>
                                            {renderDropdownLabel(dropdownData.widget_tag_label)}
                                        </span>
                                    )}
                                    {displayType !== 'icon' &&
                                    displayType !== 'filter_icon' &&
                                    filterType !== 'hierarchical' ? (
                                        <span>
                                            {activeLabel === dropdownData.widget_tag_label ? (
                                                <ArrowDropUpIcon
                                                    className={classes.dropdownArrows}
                                                />
                                            ) : (
                                                <ArrowDropDownIcon
                                                    className={classes.dropdownArrows}
                                                />
                                            )}
                                        </span>
                                    ) : (
                                        <span>{activeLabel === dropdownData.widget_tag_label}</span>
                                    )}
                                </div>

                                {activeLabel === dropdownData.widget_tag_label && (
                                    <Popover
                                        open={Boolean(anchorEl)}
                                        anchorEl={anchorEl}
                                        onClose={handleClickAway}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left'
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left'
                                        }}
                                    >
                                        {(dropdownData.widget_tag_value || []).map((option) => (
                                            <MenuItem
                                                key={option}
                                                onClick={() =>
                                                    handleOptionClick(
                                                        option,
                                                        dropdownData.widget_tag_label
                                                    )
                                                }
                                                className={classes.dropdownItem}
                                            >
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Popover>
                                )}
                            </div>
                        ))
                ) : (
                    <>
                        <div
                            className={classes.tag}
                            onClick={(event) => toggleDropdown('Select Option', event)}
                        >
                            {renderDropdownLabel('Select Option')}
                            {displayType !== 'icon' && displayType !== 'filter_icon' && (
                                <span>
                                    {dropdownOpen ? (
                                        <ArrowDropUpIcon className={classes.dropdownArrows} />
                                    ) : (
                                        <ArrowDropDownIcon className={classes.dropdownArrows} />
                                    )}
                                </span>
                            )}
                        </div>
                        <Popover
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={handleClickAway}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                            }}
                        >
                            <Grid container className={classes.gridContainer}>
                                <Grid item className={classes.leftPanel}>
                                    <List>
                                        {(dynamicData || dataValues).map((item) => (
                                            <ListItem
                                                button
                                                className={classes.leftPanelText}
                                                key={item.widget_tag_label}
                                                onClick={() =>
                                                    setActiveLabel(item.widget_tag_label)
                                                }
                                            >
                                                <ListItemText
                                                    primary={item.widget_tag_label}
                                                    primaryTypographyProps={{
                                                        style: { fontSize: '1.5rem' }
                                                    }}
                                                />
                                                {
                                                    <span>
                                                        {activeLabel === item.widget_tag_label ? (
                                                            <ChevronRightIcon
                                                                className={classes.detailedArrows}
                                                            />
                                                        ) : (
                                                            <ExpandMoreIcon
                                                                className={classes.detailedArrows}
                                                            />
                                                        )}
                                                    </span>
                                                }
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>
                                <Grid item className={classes.rightPanel}>
                                    {activeLabel && (
                                        <List className={classes.detailedRightPanel}>
                                            {renderDropdownOptions(activeLabel)}
                                        </List>
                                    )}
                                </Grid>
                            </Grid>
                            <div className={classes.footer}>
                                <div className={classes.buttonContainer}>
                                    <RefreshIcon
                                        onClick={handleReset}
                                        className={classes.resetButton}
                                    />
                                    <Button onClick={handleCancel} className={classes.cancelButton}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleApply}
                                        variant="contained"
                                        color="primary"
                                        className={classes.applyButton}
                                    >
                                        Apply
                                    </Button>
                                </div>
                                <div className={classes.itemCount}>
                                    <Typography variant="body2" className={classes.itemCountText}>
                                        {countSelectedItems()} items selected
                                    </Typography>
                                </div>
                            </div>
                        </Popover>
                    </>
                )}
            </div>
        </ClickAwayListener>
    );
};

export default AppFilterUiac;
