import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import { useDebouncedEffect } from '../../hooks/useDebounceEffect';
import { TextField } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import SuggestionBox from './suggestionsComponent';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    inputRoot: {
        '& input': {
            fontSize: '1.6rem',
            color: theme.palette.text.default
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: '0px !important',
            borderColor: `${theme.palette.border.grey}`
        },
        '& .MuiOutlinedInput-notchedOutline.Mui-focused': {
            borderColor: `${theme.palette.border.grey}`
        },
        '& .MuiOutlinedInput-inputMarginDense': {
            padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(0)}`
        },
        '& .MuiOutlinedInput-root.Mui-focused': {
            border: `${theme.palette.border.inputFocus} 1px solid`
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.border.inputFocus
        },
        '& .MuiInputLabel-outlined': {
            fontSize: '1.6rem',
            backgroundColor: theme.palette.primary.light,
            fontWeight: 'bold',
            '&.Mui-focused': {
                color: theme.palette.text.titleText,
                fontWeight: 'bold'
            }
        }
    },
    suggestionsHolder: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: '1rem',
        marginLeft: '5rem'
    },
    searchIcon: {
        fill: theme.palette.text.revamp
    }
}));

const generateRandomId = (prefix = 'id') => {
    return `${prefix}-${Math.random().toString(36).slice(2, 7)}`;
};

/**
 * Graphical element to query input or to search and retrieve related information
 * @summary Gives the list of results for the desired keywords.
 * It is used when there's a large amount of data in same place and the user wants to get specific results
 * @param {object} props - value, onChange, onChangeWithDebounce, debounceDuration, placeholder
 */

export default function SearchBar({
    value,
    onChange,
    onChangeWithDebounce,
    debounceDuration = 1000,
    placeholder = '',
    name = '',
    variant = 'outlined',
    ...props
}) {
    const classes = useStyles();
    const [_value, setValue] = useState(value || '');

    useEffect(() => {
        if (_value !== null && onChange) {
            if (name) {
                onChange(_value, name);
            } else {
                onChange(_value);
            }
        }
    }, [_value, onChange]);

    useEffect(() => {
        if (value) {
            setValue(value);
        }
    }, [value]);

    useDebouncedEffect(
        () => {
            if (_value !== null && onChangeWithDebounce) {
                if (name) {
                    onChangeWithDebounce(_value, name);
                } else {
                    onChangeWithDebounce(_value);
                }
            }
        },
        [_value, onChangeWithDebounce],
        debounceDuration
    );

    const clearSearch = () => {
        const buttons = document.querySelectorAll('.activeBox');
        let buttonsArray = [...buttons];
        buttonsArray.map((element) => {
            element.click();
        });
        setValue('');
        if (onChangeWithDebounce) {
            onChangeWithDebounce('');
        }
    };

    return (
        <div className={classes.root} id="customSearchSelector">
            <FormControl fullWidth>
                <TextField
                    size="small"
                    id={generateRandomId('standard-adornment-amount')}
                    variant={variant}
                    className={classes.inputRoot}
                    placeholder={placeholder}
                    inputProps={{ 'aria-label': 'search' }}
                    value={_value || ''}
                    onChange={(e) => setValue(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="large" className={classes.searchIcon} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                {_value ? (
                                    <Close
                                        fontSize="large"
                                        onClick={clearSearch}
                                        style={{ cursor: 'pointer' }}
                                        data-testid="Clear-button"
                                    />
                                ) : (
                                    ''
                                )}
                            </InputAdornment>
                        )
                    }}
                />
            </FormControl>
            {props?.suggestions ? (
                <div className={classes.suggestionsHolder}>
                    {props?.suggestions.map((value, key) => (
                        <SuggestionBox
                            searchValue={_value}
                            value={value}
                            key={key}
                            setValue={setValue}
                            suggestionParams={props?.suggestionParams || false}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}
