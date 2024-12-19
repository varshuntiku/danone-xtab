import { useState } from 'react';
import React from 'react';
import { ThemeProvider, makeStyles, createTheme } from '@material-ui/core/styles';
import { Chip, TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        fontSize: '1.5rem'
    },
    label: {
        color: theme.palette.text.default
    },
    deleteIcon: {
        color: `${theme.palette.text.titleText}60`,
        '&:hover': {
            color: `${theme.palette.text.titleText}90`
        },
        width: '15px',
        height: '15px'
    },
    maincontainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '1rem'
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
        height: 'fit-content',
        maxWidth: '50rem'
    },
    expand: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.3rem'
    },
    expandplus: {
        cursor: 'pointer',
        fontSize: '1.5rem',
        color: theme.palette.text.contrastText,
        textAlign: 'center'
    }
}));

export const textCompTheme = (theme) =>
    createTheme({
        ...theme,
        overrides: {
            ...theme.overrides,
            MuiInputBase: {
                root: {
                    color: theme.palette.text.titleText,
                    fontSize: '1.6rem'
                }
            },
            MuiInput: {
                underline: {
                    '&:before': {
                        borderBottomColor: `${theme.palette.text.default}`
                    },
                    '&:after': {
                        borderBottomColor: `${theme.palette.text.default}`
                    },
                    '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: theme.palette.text.default
                    }
                }
            }
        }
    });
function TagsRenderer({ params, onChange, tagData, handleTags }) {
    let data = tagData;
    const [expand, setExpand] = useState(0);
    const [input, setInput] = useState('');
    const deleteTag = (item, index) => {
        if (params?.delete) {
            data.splice(index, 1);
            onChange([...data]);
        }
    };

    const truncatedTag = (el) => {
        let text;
        if (el.length <= params?.characterlimit) {
            text = el;
        } else {
            text = params?.characterLimit ? el.slice(0, params?.characterLimit) + '...' : el;
        }
        return text;
    };
    const filterData = (val) => {
        if (handleTags) {
            handleTags(val);
        }
    };
    const expandTags = () => {
        setExpand((expand) => (expand ? expand - 1 : expand + 1));
    };
    const handleInput = (e) => {
        setInput(e.target.value);
    };
    const submitInput = (e) => {
        if (e.key === 'Enter') {
            if (input.length > 0) {
                let newTag = { tagName: input, tagColor: null };
                data.push(newTag);
                setInput('');
            }
        }
    };
    const classes = useStyles(params);
    return (
        <ThemeProvider theme={textCompTheme}>
            <div className={classes.maincontainer}>
                <div className={classes.container}>
                    {(expand
                        ? data
                        : params?.tagLimit
                        ? data.slice(0, params?.tagLimit)
                        : data
                    ).map((el, index) => {
                        return (
                            <Chip
                                key={el.tagName + index}
                                label={truncatedTag(el.tagName)}
                                onClick={() => filterData(el.tagName)}
                                onDelete={params?.delete ? () => deleteTag(el, index) : null}
                                style={{ backgroundColor: el.tagColor ? el.tagColor : '#0C274450' }}
                                classes={{
                                    root: classes.root,
                                    label: classes.label,
                                    deleteIcon: classes.deleteIcon
                                }}
                            />
                        );
                    })}
                    {data.length > params?.tagLimit ? (
                        <div className={classes.expand}>
                            <Typography className={classes.expandplus} onClick={expandTags}>
                                {expand ? '-' : `...+${data.length - params?.tagLimit}`}
                            </Typography>
                        </div>
                    ) : null}
                </div>
                {params?.modify && (
                    <div>
                        <TextField
                            placeholder="Add your tag here"
                            value={input}
                            onChange={handleInput}
                            onKeyDown={submitInput}
                            classes={{
                                root: classes.textfield
                            }}
                            id="add your tag here"
                        />
                    </div>
                )}
            </div>
        </ThemeProvider>
    );
}

export default TagsRenderer;
