import {
    alpha,
    Chip,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Typography
} from '@material-ui/core';
// import { Button, IconButton } from '@material-ui/core';
import React, { useState } from 'react';
import clsx from 'clsx';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        gap: '2rem',
        padding: '2rem',
        height: '100%'
    },
    pivotsContainer: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        marginTop: '4rem',
        alignContent: 'flex-start',
        maxHeight: '450px',
        overflowY: 'auto',
        paddingBottom: '1rem',
        width: '40%'
    },
    chip: {
        color: theme.palette.text.default,
        borderColor: theme.palette.text.default,
        width: '45%',
        cursor: 'pointer'
    },
    defaultColor: {
        color: theme.palette.text.default
    },
    fontSize1: {
        fontSize: '1.6rem'
    },
    dropzoneContainer: {
        width: '20%',
        display: 'flex',
        flexDirection: 'column'
    },
    dropZone: {
        background: theme.palette.primary.dark,
        flex: 1,
        borderRadius: '4px',
        border: `1px solid ${alpha(theme.palette.text.default, 0.4)}`,
        padding: '1rem',
        maxHeight: '450px',
        overflowY: 'auto'
    },
    divider: {
        borderColor: alpha(theme.palette.primary.light, 0.4)
    },
    closeIcon: {
        cursor: 'pointer'
    }
}));

export default function PivotFilter({ pivotInfo, onChange }) {
    const classes = useStyles();
    const [pivotItems, setPivotItems] = useState(pivotInfo.map((el) => ({ ...el })) || []);
    const [orderIndex, setOrderIndex] = useState(
        Math.max(...pivotInfo.map((el) => el.order || 0)) || 0
    );
    const [filtersItems, setFiltersItems] = useState(() => {
        const items = pivotItems.filter((el) => el.type === 'filters');
        items.sort((a, b) => a.order - b.order);
        return items;
    });
    const [rowsItems, setRowsItems] = useState(() => {
        const items = pivotItems.filter((el) => el.type === 'rows');
        items.sort((a, b) => a.order - b.order);
        return items;
    });
    const [columnsItems, setColumnsItems] = useState(() => {
        const items = pivotItems.filter((el) => el.type === 'columns');
        items.sort((a, b) => a.order - b.order);
        return items;
    });
    const [disabledZones, setDisabledZones] = useState([]);

    const correctOrder = (pivotElemetns) => {
        const filteredPivotInfo = pivotElemetns.filter((el) => el.type);
        filteredPivotInfo.sort((a, b) => a.order - b.order);
        filteredPivotInfo.forEach((el, i) => {
            el.order = i;
        });
    };

    const handleRemove = (el) => {
        switch (el.type) {
            case 'filters': {
                const newList = filtersItems.filter((item) => item.key !== el.key);
                setFiltersItems(newList);
                break;
            }
            case 'rows': {
                const newList = rowsItems.filter((item) => item.key !== el.key);
                setRowsItems(newList);
                break;
            }
            case 'columns': {
                const newList = columnsItems.filter((item) => item.key !== el.key);
                setColumnsItems(newList);
                break;
            }
            default:
        }
        el.type = false;
        el.order = null;
        correctOrder(pivotItems);
        onChange(pivotItems);
        setPivotItems((s) => [...s]);
    };

    const hanldeDrag = (ev, el) => {
        ev.dataTransfer.setData('text', el.key);
        setDisabledZones(el.disabledZones || []);
    };

    const handleDrop = (ev, zone) => {
        ev.preventDefault();
        const key = ev.dataTransfer.getData('text');
        const el = pivotItems.find((el) => el.key === key);
        el.type = zone;
        el.order = orderIndex + 1;
        setOrderIndex((s) => s + 1);
        switch (el.type) {
            case 'filters': {
                setFiltersItems((s) => [...s, el]);
                break;
            }
            case 'rows': {
                setRowsItems((s) => [...s, el]);
                break;
            }
            case 'columns': {
                setColumnsItems((s) => [...s, el]);
                break;
            }
            default:
        }
        correctOrder(pivotItems);
        onChange(pivotItems);
        setPivotItems((s) => [...s]);
    };

    return (
        <div className={classes.root}>
            <div aria-label="pivots" draggable={false} className={classes.pivotsContainer}>
                {pivotItems?.map((el, i) => (
                    <Chip
                        key={'pivotItems' + i}
                        id={el.key}
                        variant="outlined"
                        disabled={el.type}
                        size="large"
                        label={el.label}
                        title={el.label}
                        draggable={!el.type}
                        onDragStart={(ev) => hanldeDrag(ev, el)}
                        className={clsx(classes.chip, classes.fontSize1)}
                    />
                ))}
            </div>
            <DropZone
                title={'Filters'}
                onRemove={handleRemove}
                items={filtersItems}
                onDrop={(ev) => handleDrop(ev, 'filters')}
                classes={classes}
                disableDrop={disabledZones.includes('filters')}
            />
            <DropZone
                title={'Rows'}
                onRemove={handleRemove}
                items={rowsItems}
                classes={classes}
                onDrop={(ev) => handleDrop(ev, 'rows')}
                disableDrop={disabledZones.includes('rows')}
            />
            <DropZone
                title={'Columns'}
                onRemove={handleRemove}
                items={columnsItems}
                classes={classes}
                onDrop={(ev) => handleDrop(ev, 'columns')}
                disableDrop={disabledZones.includes('columns')}
            />
        </div>
    );
}

function DropZone({ title, items, onRemove, onDrop, classes, disableDrop }) {
    return (
        <div
            aria-label="drop-zone"
            onDrop={onDrop}
            onDragOver={(ev) => (disableDrop ? false : ev.preventDefault())}
            className={classes.dropzoneContainer}
        >
            <Typography
                variant="h5"
                gutterBottom
                className={clsx(classes.defaultColor, classes.fontSize1)}
            >
                {title}
            </Typography>
            <div aria-label="filters list" className={classes.dropZone}>
                <List dense>
                    {items.map((el) => (
                        <ListItem key={el.label} divider classes={{ divider: classes.divider }}>
                            <ListItemText
                                disableTypography
                                primary={el.label}
                                className={clsx(classes.fontSize1, classes.defaultColor)}
                            />
                            <ListItemSecondaryAction>
                                <HighlightOffIcon
                                    title="remove"
                                    onClick={() => onRemove(el)}
                                    fontSize="large"
                                    className={classes.closeIcon}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </div>
        </div>
    );
}
