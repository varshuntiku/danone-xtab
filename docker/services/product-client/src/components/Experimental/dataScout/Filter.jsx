import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Button } from '@material-ui/core';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import clsx from 'clsx';
import { dateDifference } from 'util/index';

const darkTheme = localStorage.getItem('codx-products-theme') == 'dark';
const useStyles = makeStyles((theme) => ({
    root: {
        zIndex: 100,
        position: 'absolute',
        top: 130,
        background: darkTheme ? '#1E3E5F' : '#fff',
        border: '0.5px solid black',
        borderRadius: '1rem'
    },
    filterContainer: {
        width: '102rem',
        height: 'fit-content',
        display: 'flex',
        padding: '2rem',
        paddingBottom: '1rem'
    },
    filterLabel: {
        display: 'flex',
        flexDirection: 'column',
        width: '30%',
        cursor: 'pointer'
    },
    filterItem: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 'normal',
        letterSpacing: '1px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        padding: '1.5rem',
        '& svg': {
            fontSize: '2rem'
        }
    },
    filterValueContainer: {
        display: 'flex',
        width: '68rem',
        background: localStorage.getItem('codx-products-theme') === 'dark' ? '#0C2744' : '#D3DDFC77'
    },
    filterValueItem: {
        fontSize: '2rem',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        color: theme.palette.text.default
    },
    checkbox: {
        width: '15px',
        height: '15px',
        border: localStorage.getItem('codx-products-theme') === 'dark' ? '#FFF' : '#091F3A',
        background:
            localStorage.getItem('codx-products-theme') === 'dark' ? '#0C2744' : '#D3DDFC77',
        cursor: 'pointer'
    },
    selectedFilterLabel: {
        background: 'rgba(104, 131, 247, 0.20)'
    },
    bottomContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '102rem',
        padding: '2rem'
    },
    resetSection: {
        display: 'flex',
        fontSize: '2rem',
        color: theme.palette.text.contrastText,
        gap: '1rem',
        alignItems: 'center',
        marginRight: '2rem',
        cursor: 'pointer',
        '& svg': {
            fontSize: '3rem',
            fill: theme.palette.text.contrastText
        }
    },
    buttonGroup: {
        display: 'flex',
        gap: '2rem'
    },
    filterOptionHolder: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

const Filter = (props) => {
    const classes = useStyles();
    const [selectedFilterLabel, setSelectedFilterLabel] = useState(null);
    const [finalFilterValues, setFinalFilterValues] = useState([]);
    const [FilterData, setFilterData] = useState(JSON.parse(JSON.stringify(props.filterOptions)));
    const [selectedFilterIndex, setSelectedFilterIndex] = useState(null);
    const data = props.data;

    const handleSelectionFilter = (value, index) => {
        selectedFilterLabel === value
            ? setSelectedFilterLabel(null)
            : setSelectedFilterLabel(value);
        setSelectedFilterIndex(index);
    };

    useEffect(() => {
        const finalFilterValues = [];
        if (selectedFilterIndex != null) {
            const options = FilterData[selectedFilterIndex];
            const fi = options.filterOptions.slice();
            while (fi.length) {
                finalFilterValues.push(fi.splice(0, 4));
            }
            setFinalFilterValues(finalFilterValues);
        }
    }, [selectedFilterLabel]);

    const handleFilterSearch = () => {
        let filteredSearchData = [];
        const searchValue = (label, val) => {
            let newData = [];
            let toFilterData = filteredSearchData.length > 0 ? filteredSearchData : data.allData;
            switch (label) {
                case 'Business Domain':
                    toFilterData.map((dataset) => {
                        for (let i = 0; i < dataset.tags.length; i++) {
                            if (dataset.tags[i].tag.toLowerCase() == val.toLowerCase()) {
                                newData.push(dataset);
                                break;
                            }
                        }
                    });
                    break;
                case 'Region':
                    toFilterData.map((dataset) => {
                        let regions = dataset.region.split('|');
                        for (let i = 0; i < regions.length; i++) {
                            if (regions[i].toLowerCase().trim() == val.toLowerCase().trim()) {
                                newData.push(dataset);
                                break;
                            }
                        }
                    });
                    break;
                case 'Last Updated':
                    toFilterData.map((dataset) => {
                        let dayDifference = dateDifference(dataset.lastUpdated);
                        switch (val) {
                            case 'Last Week':
                                if (dayDifference <= 7) {
                                    newData.push(dataset);
                                }
                                break;

                            case 'Last Month':
                                if (dayDifference <= 30) {
                                    newData.push(dataset);
                                }
                                break;

                            case 'Last Year':
                                if (dayDifference <= 365) {
                                    newData.push(dataset);
                                }
                                break;
                        }
                    });
                    break;
            }
            return newData;
        };
        let filterCount = 0;
        FilterData.map((val) => {
            val.filterOptions.map((item) => {
                if (item.active && item.name !== 'Select All' && item.name !== 'All') {
                    filteredSearchData = searchValue(val.filterLabel, item.name);
                    let filteredData = { ...data };
                    filteredData.allData = filteredSearchData;
                    props.setFilteredData(filteredData);
                    filterCount += 1;
                }
                if (filterCount == 0) {
                    props.setFilteredData(null);
                }
            });
        });
    };

    const handleClick = (i, index, filterName) => {
        if (filterName == 'Select All' || filterName == 'All') {
            let optionData = [...FilterData];
            let currentState = !optionData[selectedFilterIndex].filterOptions[0].active;
            optionData[selectedFilterIndex].filterOptions.map((i, key) => {
                optionData[selectedFilterIndex].filterOptions[key].active = currentState;
                setFilterData(optionData);
            });
        } else {
            let optionData = [...FilterData];
            index = i * 4 + index;
            optionData[selectedFilterIndex].filterOptions[index].active =
                !optionData[selectedFilterIndex].filterOptions[index].active;
            setFilterData(optionData);
        }
    };

    const handleApply = () => {
        props.setFilterOpen(false);
        props.setFilterOptions(FilterData);
        handleFilterSearch();
    };

    const handleReset = () => {
        const optionData = FilterData.map((filter) => ({
            ...filter,
            filterOptions: filter.filterOptions.map((option) => ({ ...option, active: false }))
        }));
        setFilterData(optionData);
    };

    return (
        <div className={classes.root}>
            <div className={classes.filterContainer}>
                <div className={classes.filterLabel}>
                    {FilterData.map((el, i) => (
                        <div
                            className={clsx(
                                classes.filterItem,
                                selectedFilterLabel === el.filterLabel
                                    ? classes.selectedFilterLabel
                                    : 'none'
                            )}
                            key={i}
                            onClick={() => handleSelectionFilter(el.filterLabel, i)}
                        >
                            {el.filterLabel}
                            {el.filterLabel === selectedFilterLabel ? (
                                <ChevronLeftIcon />
                            ) : (
                                <ChevronRightIcon />
                            )}
                        </div>
                    ))}
                </div>
                <div className={classes.filterValueContainer}>
                    {selectedFilterLabel
                        ? finalFilterValues.map((el, i) => (
                              <div key={i} className={classes.filterOptionHolder}>
                                  {el.map((item, index) => (
                                      <div key={index} className={classes.filterValueItem}>
                                          <input
                                              type="checkbox"
                                              className={classes.checkbox}
                                              checked={item.active}
                                              onClick={() => handleClick(i, index, item.name)}
                                          />
                                          {item.name}
                                      </div>
                                  ))}
                              </div>
                          ))
                        : null}
                </div>
            </div>
            <div className={classes.bottomContainer}>
                <div className={classes.buttonGroup}>
                    <Button
                        onClick={() => props.setFilterOpen(false)}
                        variant="outlined"
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button variant="contained" aria-label="Apply" onClick={handleApply}>
                        Apply
                    </Button>
                </div>
                <div className={classes.resetSection} onClick={handleReset}>
                    <RotateLeftIcon /> Reset
                </div>
            </div>
        </div>
    );
};

export default Filter;
