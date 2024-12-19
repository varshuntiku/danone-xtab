/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
//     selectEmpty: {
//         marginTop: theme.spacing(0)
//     }
// }));

export const selectCompTheme = (theme) =>
    createTheme({
        ...theme,
        overrides: {
            ...theme.overrides,
            MuiAutocomplete: {
                inputRoot: {
                    '&&[class*="MuiOutlinedInput-root"] $input': {
                        padding: 0
                    }
                },
                option: {
                    fontSize: '1.6rem',
                    color: '#000',
                    fontWeight: '400',
                    lineHeight: '1.5',
                    letterSpacing: '0.00938em'
                }
            },
            MuiInputBase: {
                root: {
                    color: theme.palette.text.default,
                    fontSize: '1.6rem',
                    '&.Mui-disabled': {
                        color: theme.palette.text.default
                    }
                }
            },
            MuiFormControl: {
                marginNormal: {
                    marginTop: '0px'
                }
            },
            MuiOutlinedInput: {
                root: {
                    '& fieldset': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                    },
                    '&$focused $notchedOutline': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                    },
                    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                    },
                    '&.Mui-disabled': {
                        '& fieldset$notchedOutline': {
                            borderColor: alpha(theme.palette.text.titleText, 0.5)
                        }
                    }
                },
                input: {
                    paddingTop: '0px',
                    paddingBottom: '10px'
                }
            }
        }
    });
export default function SimpleAutocomplete() {
    // function handleChange(event) {
    //     alert('1' + event.target.value);
    // }
    function random(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i += 1) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }
    const OPTIONS = Array.from(new Array(10000))
        .map(() => random(10 + Math.ceil(Math.random() * 20)))
        .sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()));

    return (
        <div style={{ width: 180, height: 20 }}>
            <ThemeProvider theme={selectCompTheme}>
                <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    // onChange={(event, newValue) => {
                    //     setValue(newValue);
                    // }}
                    disableClearable
                    options={OPTIONS}
                    renderInput={(params) => (
                        <TextField
                            theme={selectCompTheme}
                            {...params}
                            label=""
                            margin="normal"
                            variant="outlined"
                            InputProps={{ ...params.InputProps, type: 'search' }}
                        />
                    )}
                />
            </ThemeProvider>
        </div>
    );
}

// const top100Films = [
//     { title: 'The Shawshank Redemption', year: 1994 },
//     { title: 'The Godfather', year: 1972 },
//     { title: 'The Godfather: Part II', year: 1974 },
//     { title: 'The Dark Knight', year: 2008 },
//     { title: '12 Angry Men', year: 1957 },
//     { title: "Schindler's List", year: 1993 },
//     { title: 'Pulp Fiction', year: 1994 },
//     { title: 'The Lord of the Rings: The Return of the King', year: 2003 }
// ];
