import { Grid, makeStyles, alpha, Divider, Typography } from '@material-ui/core';
import SimpleSelect from '../dynamic-form/inputFields/select';
import RadioButtonGroup from '../dynamic-form/inputFields/radiogroup';
import SearchBar from '../CustomSearchComponent/SearchComponent';
import AppMultipleSelect from './AppMultipleSelect';
import ActionButtons from '../dynamic-form/inputFields/ActionButtons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    gridItem: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemDivider: {
        background: alpha(theme.palette.text.default, 0.4),
        width: '100%'
    },
    text: {
        color: theme.palette.primary.contrastText,
        fontSize: '2rem'
    },
    optionMainHeader: {
        fontSize: '3rem',
        fontWeight: 600
    },
    optionHeader1: {
        fontSize: '1.8rem',
        fontWeight: 500
    },
    optionHeader2: {
        fontSize: '1.8rem',
        fontWeight: 500
    }
}));

export default function DropdownRadioSelect({
    value,
    onChange,
    extra_params,
    params,
    onError,
    item,
    selectedValue,
    data
}) {
    const classes = useStyles();
    const [_value, setValue] = React.useState(value || {});
    const [search, setSearch] = React.useState(value?.search || '');
    const disableElement = Boolean(search);
    let optionsBodyHeight = extra_params[0]?.show_dropdown ? '60%' : '95%';

    const handleChange = (propValue, propName) => {
        let newValue = { ..._value, [propName]: propValue };
        if (propName == 'search') {
            newValue = { ...newValue, items: [] };
        }
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const handleSearchChange = (searchValue) => {
        setSearch(searchValue);
        if (search && searchValue == '') {
            handleChange(searchValue, 'search');
        }
    };

    return (
        <>
            {extra_params[0]?.show_dropdown ? (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography className={classes.optionMainHeader} variant="body1">
                            FIND YOUR ITEM
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className={classes.optionHeader1} variant="body1">
                                    OPTION 1 - By Top Selling products
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <SimpleSelect
                                    onChange={(v) => {
                                        handleChange(v, extra_params[0]?.label);
                                    }}
                                    fieldInfo={{
                                        label: extra_params[0]['label'],
                                        type: 'select',
                                        value: _value[extra_params[0]?.label]
                                            ? _value[extra_params[0].label]
                                            : extra_params[0]['options'][0],
                                        options: extra_params[0]['options'],
                                        variant: 'outlined',
                                        size: 'medium',
                                        fullWidth: true,
                                        disabled: disableElement
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <RadioButtonGroup
                            onChange={(v) => {
                                handleChange(v, extra_params[1]?.label);
                            }}
                            params={{
                                label: extra_params[1]['label'],
                                type: 'radioGroup',
                                value: _value[extra_params[1]?.label]
                                    ? _value[extra_params[1].label]
                                    : extra_params[1]['options'][0],
                                row: true,
                                options: extra_params[1]['options'].map((option) => {
                                    return { name: option, label: option };
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography className={classes.optionHeader1} variant="body1">
                            OPTION 2 - By Keyword
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <SearchBar
                            value={search}
                            debounceDuration={100}
                            onChangeWithDebounce={handleSearchChange}
                            placeholder={extra_params[2]?.placeholder}
                            borderColor="#7a7a7a"
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <ActionButtons
                            params={{
                                variant: 'contained',
                                text: 'search'
                            }}
                            onClick={() => handleChange(search, 'search')}
                            align={'flex-start'}
                        />
                    </Grid>
                </Grid>
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <SearchBar
                            value={search}
                            debounceDuration={100}
                            onChangeWithDebounce={handleSearchChange}
                            placeholder={extra_params[2]?.placeholder}
                            borderColor="#7a7a7a"
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ActionButtons
                            params={{
                                variant: 'contained',
                                text: 'search'
                            }}
                            onClick={() => handleChange(search, 'search')}
                            align={'flex-start'}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <RadioButtonGroup
                            onChange={(v) => {
                                handleChange(v, extra_params[1]?.label);
                            }}
                            params={{
                                label: extra_params[1]['label'],
                                type: 'radioGroup',
                                value: _value[extra_params[1]?.label]
                                    ? _value[extra_params[1].label]
                                    : extra_params[1]['options'][0],
                                row: true,
                                options: extra_params[1]['options'].map((option) => {
                                    return { name: option, label: option };
                                })
                            }}
                        />
                    </Grid>
                </Grid>
            )}
            {data?.widget_tag_value.length &&
            search &&
            search == _value?.search &&
            data.widget_tag_value.every((item) =>
                item == 'All' ? true : item.toLowerCase().includes(search.toLowerCase())
            ) ? (
                <AppMultipleSelect
                    key={item}
                    item={item}
                    selectedValue={selectedValue}
                    data={data}
                    params={params}
                    onChangeFilter={(items) => handleChange(items, 'items')}
                    is_default_value_dict={true}
                    optionsBodyHeight={optionsBodyHeight}
                />
            ) : null}
        </>
    );
}
