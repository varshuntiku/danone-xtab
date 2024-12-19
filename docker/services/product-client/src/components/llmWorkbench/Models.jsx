import {
    Box,
    Button,
    ClickAwayListener,
    Grid,
    Grow,
    InputAdornment,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    TextField,
    Typography,
    makeStyles
} from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import modelsStyle from 'assets/jss/llmWorkbench/modelsStyle';
import SearchIcon from '@material-ui/icons/Search';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import ModelCard from './ModelCard';
import { useDispatch, useSelector } from 'react-redux';
import { getHuggingFaceModels } from 'store/thunks/llmWorkbenchThunk';
import CodxCircularLoader from 'components/CodxCircularLoader';
import { useDebouncedEffect } from 'hooks/useDebounceEffect';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles(modelsStyle);

// eslint-disable-next-line react/display-name
const Models = React.memo(() => {
    const [searchByName, setSearchbyName] = useState('');
    const [selectSort, setSelectSort] = useState({ display: 'Trending', value: 'Trending' });
    const sortRef = useRef(null);
    const [openSort, setOpenSort] = useState(false);
    const [page, setPage] = useState(1);
    const sortOptions = [
        {
            display: 'Trending',
            value: 'Trending'
        },
        {
            display: 'Most likes',
            value: 'likes'
        },
        {
            display: 'Most downloads',
            value: 'downloads'
        },
        {
            display: 'Recently created',
            value: 'created'
        },
        {
            display: 'Recently updated',
            value: 'modified'
        }
    ];
    const dispatch = useDispatch();
    const {
        importedModel: {
            huggingFace: { models, total },
            filters: { task },
            loadingModels
        }
    } = useSelector((state) => state.llmWorkbench);

    useDebouncedEffect(
        () => {
            dispatch(
                getHuggingFaceModels({
                    task: task?.toLowerCase().replace(/ /g, '-'),
                    search: searchByName,
                    sort: selectSort.value?.toLowerCase().replace(' ', '-'),
                    page: page - 1
                })
            );
        },
        [task, searchByName, selectSort, page],
        500
    );

    useEffect(() => {
        setPage(1);
    }, [task, searchByName, selectSort]);

    const handleSearch = (e) => {
        setSearchbyName(e.target.value);
    };

    const handleToggle = () => {
        setOpenSort((prevOpen) => !prevOpen);
    };

    const handlePageChange = (_, page) => {
        setPage(page);
    };
    const handleClose = (event, option) => {
        if (sortRef.current && sortRef.current.contains(event.target)) {
            return;
        }
        setOpenSort(false);
        if (option && option.value !== selectSort.value) setSelectSort(option);
    };

    const handleListKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenSort(false);
        }
    };
    const getFormatedTotal = (total) => {
        const formated = new Intl.NumberFormat().format(total);
        return formated;
    };
    const prevOpen = useRef(openSort);
    useEffect(() => {
        if (prevOpen.current === true && openSort === false) {
            sortRef.current.focus();
        }
        prevOpen.current = openSort;
    }, [openSort]);

    const classes = useStyles();
    return (
        <Box className={classes.container}>
            <Box className={classes.top}>
                <Typography variant="h4" className={classes.text}>
                    Models
                </Typography>
                <Box className={classes.searchSortContainer}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by name"
                        className={classes.input}
                        color="primary"
                        value={searchByName}
                        onChange={handleSearch}
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
                    />
                    <Button
                        startIcon={<ImportExportIcon className={classes.sortIcon} />}
                        className={classes.sort}
                        ref={sortRef}
                        aria-controls={openSort ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        // disabled={loadingModels}
                    >
                        Sort : {selectSort?.display}
                    </Button>
                    <Popper
                        open={openSort}
                        anchorEl={sortRef.current}
                        role={'menu'}
                        transition
                        disablePortal
                        className={classes.popper}
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom' ? 'center top' : 'center bottom'
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList
                                            autoFocusItem={openSort}
                                            id="menu-list-grow"
                                            onKeyDown={handleListKeyDown}
                                        >
                                            {sortOptions.map((option) => (
                                                <MenuItem
                                                    key={option.display}
                                                    className={classes.menuItem}
                                                    onClick={(e) => handleClose(e, option)}
                                                >
                                                    {option.display}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Box>
            </Box>
            <Box className={classes.bottom}>
                {!loadingModels ? (
                    models?.length === 0 ? (
                        <Box
                            height={'50vh'}
                            display={'flex'}
                            justifyContent={'center'}
                            alignItems={'center'}
                        >
                            <Typography variant="h4" className={classes.textLight}>
                                No models found for this filter!
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <Typography variant="h4" className={classes.textLight}>
                                {total ? getFormatedTotal(total) : ''}
                            </Typography>
                            <Grid container spacing={3} className={classes.padding}>
                                {models?.map((_model, index) => (
                                    <Grid item xs={6} spacing={2} key={index}>
                                        <ModelCard model={_model} />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )
                ) : (
                    <Box
                        height={'50vh'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <CodxCircularLoader size={60} />
                    </Box>
                )}
            </Box>

            {total > 30 && !loadingModels && (
                <Pagination
                    count={Math.ceil(total / 30)}
                    className={classes.paginate}
                    page={page}
                    onChange={handlePageChange}
                ></Pagination>
            )}
        </Box>
    );
});

export default Models;
