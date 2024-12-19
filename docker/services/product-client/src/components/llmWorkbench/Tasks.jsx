import React, { useState } from 'react';
import taskStyle from '../../assets/jss/llmWorkbench/tasksStyle';
import {
    Box,
    InputAdornment,
    List,
    ListItem,
    TextField,
    Typography,
    makeStyles
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks } from 'store/thunks/llmWorkbenchThunk';
import { updateTaskFilter } from 'store';
import { useDebouncedEffect } from 'hooks/useDebounceEffect';

const useStyles = makeStyles(taskStyle);

const Tasks = () => {
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const {
        importedModel: {
            huggingFace: { tasks },
            loadingModels
        }
    } = useSelector((state) => state.llmWorkbench);

    useDebouncedEffect(
        () => {
            const fetchTasks = () => {
                dispatch(getTasks({ search: search }));
            };
            fetchTasks();
        },
        [search],
        500
    );

    const classes = useStyles();
    const handleFocus = (task, index) => {
        if (index === focusedIndex) {
            setFocusedIndex(null);
            dispatch(updateTaskFilter(''));
        } else {
            setFocusedIndex(index);
            dispatch(updateTaskFilter(task));
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };
    return (
        <Box className={classes.container}>
            <Box className={classes.top}>
                <Typography variant="h4" className={classes.text}>
                    Tasks
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Filter by name"
                    className={classes.input}
                    color="primary"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon className={classes.searchIcon} />
                            </InputAdornment>
                        ),
                        classes: {
                            input: classes.inputText
                        }
                    }}
                    value={search}
                    onChange={handleSearch}
                />
            </Box>
            <Box className={classes.bottom}>
                <Typography variant="h4" className={classes.text}>
                    Natural Language Processing
                </Typography>
                <div>
                    <List className={classes.list}>
                        {tasks?.map((_task, index) => {
                            return (
                                <ListItem
                                    key={_task}
                                    button
                                    className={`${classes.eachTask} ${
                                        focusedIndex === index
                                            ? classes.focus
                                            : focusedIndex !== null
                                            ? classes.blur
                                            : ''
                                    }`}
                                    onClick={() => handleFocus(_task, index)}
                                    disabled={loadingModels}
                                >
                                    {_task}
                                </ListItem>
                            );
                        })}
                    </List>
                </div>
            </Box>
        </Box>
    );
};

export default Tasks;
