import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

export default function SuggestionBox({ searchValue, value, key, setValue, suggestionParams }) {
    const useStyles = makeStyles((theme) => ({
        boxStyle: {
            border: `1px ${suggestionParams?.borderType || 'solid'} ${
                suggestionParams?.borderColor || theme.palette.text.default
            }`,
            opacity: suggestionParams?.opacity || 0.5,
            borderRadius: suggestionParams?.shape == 'oval' ? '2.75rem' : '0rem',
            padding: '0.75rem 1rem',
            fontSize: suggestionParams?.fontSize || '2rem',
            color: suggestionParams?.color || theme.palette.text.default,
            marginLeft: '1rem',
            minWidth: '10rem',
            textAlign: 'center',
            marginTop: '1rem',
            cursor: 'pointer',
            backgroundColor: suggestionParams?.backgroundColor || 'transparent',
            fontStyle: suggestionParams?.fontStyle || 'normal'
        },
        activeBoxStyle: {
            border: `1px ${suggestionParams?.activeBorderType || 'solid'} ${
                suggestionParams?.activeBorderColor || theme.palette.text.default
            }`,
            opacity: suggestionParams?.activeOpacity || 1,
            borderRadius: suggestionParams?.shape == 'oval' ? '2.75rem' : '0rem',
            padding: '0.75rem 1rem',
            fontSize: suggestionParams?.activeFontSize || '2rem',
            color: suggestionParams?.activeColor || theme.palette.text.default,
            marginLeft: '1rem',
            minWidth: '10rem',
            textAlign: 'center',
            marginTop: '1rem',
            cursor: 'pointer',
            backgroundColor: suggestionParams?.activeBackgroundColor || 'transparent',
            fontStyle: suggestionParams?.fontStyle || 'normal'
        }
    }));

    const classes = useStyles();
    const [active, setActive] = useState(false);

    const addToSearch = (value) => {
        let valueToAdd = '';
        valueToAdd = !active
            ? (searchValue + ' ' + value).trim()
            : searchValue.replace(value, '').replace('  ', ' ').trim();
        setActive(!active);
        setValue(valueToAdd);
    };

    return (
        <button
            onClick={() => addToSearch(value)}
            key={key}
            className={active ? `${classes.activeBoxStyle} activeBox` : classes.boxStyle}
        >
            {value}
        </button>
    );
}
