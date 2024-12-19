import React, { useState, useEffect } from 'react';
import {
    Menu,
    MenuItem,
    ThemeProvider,
    ListItemIcon,
    ListItemText,
    Checkbox,
    makeStyles,
    IconButton
} from '@material-ui/core';
import { selectCompTheme } from '../components/dynamic-form/inputFields/select';
import DehazeIcon from '@material-ui/icons/Dehaze';
import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles(() => ({
    root: {
        '& .MuiIconButton-root:hover': {
            backgroundColor: 'none !important'
        }
    },
    paper: {
        width: '100%'
    },
    font2: {
        fontSize: '2rem'
    }
}));
function MultiSelectPopupMenu(props) {
    const ITEM_HEIGHT = props.menuHeight;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'filter-menu' : undefined;
    let options = [];
    const [zoomLevel, setZoomLevel] = useState(props?.zoomLevel || 1.0);

    useEffect(() => {
        setZoomLevel(props?.zoomLevel || 1.0);
    }, [props?.zoomLevel]);

    if (props.type === 'grid') {
        options = props.columns.map((el) => {
            return el.key;
        });
    }
    const [selected, setSelected] = useState(options);
    const isAllSelected = options.length > 0 && selected.length === options.length;

    useEffect(() => {
        props.onChangeFilterMenu(selected, props.columns);
    }, [selected]);

    const handleSelectChange = (event, index) => {
        if (index === 'all') {
            setSelected(selected.length === options.length ? [] : options);
            return;
        } else {
            const value = options[index];
            const chosenItemExistsInSelectedList = selected?.indexOf(value) > -1;
            chosenItemExistsInSelectedList
                ? setSelected((current) => current.filter((option) => option !== value))
                : setSelected((current) => [...current, value]);
        }
    };
    const handleFilterMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleFiltermenuClose = () => {
        setAnchorEl(null);
    };
    return (
        <div title="dropdown-multi-select-menu-popup">
            <div>
                <IconButton
                    className={classes.root}
                    title="Filter"
                    aria-describedby={id}
                    variant="contained"
                    onClick={handleFilterMenuClick}
                >
                    {props?.isFilter ? (
                        <FilterListIcon className={classes.font2} />
                    ) : (
                        <DehazeIcon className={classes.font2} />
                    )}
                </IconButton>
            </div>

            <ThemeProvider theme={selectCompTheme}>
                <Menu
                    open={open}
                    MenuListProps={{
                        'aria-labelledby': 'filter-menu',
                        role: 'listbox'
                    }}
                    id={id}
                    anchorEl={anchorEl}
                    onClose={handleFiltermenuClose}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 1,
                        horizontal: 'center'
                    }}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            zoom: zoomLevel
                        }
                    }}
                >
                    <MenuItem value="all" onClick={(event) => handleSelectChange(event, 'all')}>
                        <ListItemIcon>
                            <Checkbox
                                checked={isAllSelected}
                                indeterminate={
                                    selected.length > 0 && selected.length < options.length
                                }
                            />
                        </ListItemIcon>
                        <ListItemText
                            classes={{ primary: classes.selectAllText }}
                            primary="SELECT ALL"
                        />
                    </MenuItem>
                    {options?.map((option, index) => (
                        <MenuItem
                            key={option}
                            value={option}
                            onClick={(event) => handleSelectChange(event, index)}
                        >
                            <ListItemIcon>
                                <Checkbox checked={selected?.indexOf(option) > -1} />
                            </ListItemIcon>
                            <ListItemText primary={option} />
                        </MenuItem>
                    ))}
                </Menu>
            </ThemeProvider>
        </div>
    );
}

export default MultiSelectPopupMenu;
