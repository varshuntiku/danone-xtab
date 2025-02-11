import {
    alpha,
    Chip,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Typography,
    Tooltip
} from '@material-ui/core';
import React, { useState } from 'react';
import clsx from 'clsx';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    },
    textOverflow: {
        overflowWrap: 'break-word'
    }
}));

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0
        },
        '&:before': {
            display: 'none'
        },
        '&$expanded': {
            margin: 'auto'
        }
    },
    expanded: {}
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56
        }
    },
    content: {
        '&$expanded': {
            margin: '12px 0'
        }
    },
    expanded: {}
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        display: 'contents'
    }
}))(MuiAccordionDetails);

export default function PivotFilter({ pivotInfo, pivotAccordionInfo, onChange, ...props }) {
    const classes = useStyles();
    const [pivotItems, setPivotItems] = useState(pivotInfo.map((el) => ({ ...el })) || []);
    const [pivotAccordionItems, setPivotAccordionItems] = useState(
        pivotAccordionInfo ? pivotAccordionInfo : []
    );
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
        let pivotItemsLoc = [...pivotItems].map((a) => {
            if (a.key === el.key) {
                a.type = false;
                a.order = null;
            }
            return a;
        });
        correctOrder(pivotItemsLoc);
        onChange(pivotItemsLoc, '');
        setPivotItems((s) => [...s]);
    };

    const hanldeDrag = (ev, el) => {
        ev.dataTransfer.setData('text', el.key);
        setDisabledZones(el.disabledZones || []);
    };

    const onDragStartCustom = (start) => {
        const draggedList = { filters: filtersItems, rows: rowsItems, columns: columnsItems };
        setDisabledZones(
            draggedList?.[start?.source?.droppableId][start?.source?.index]?.disabledZones || []
        );
    };

    const insertItem = (dropId, element) => {
        const [elId, dType] = dropId.split('-');
        const newState = {
            filters: {
                value: filtersItems,
                setValue: setFiltersItems
            },
            rows: {
                value: rowsItems,
                setValue: setRowsItems
            },
            columns: {
                value: columnsItems,
                setValue: setColumnsItems
            }
        };
        const currentSelected = newState[dType];
        let destClone = Array.from(currentSelected.value);
        const dropIndex = destClone.findIndex((el) => el.index === elId);
        destClone.splice(dropIndex, 0, element);
        const sortedOrders = destClone.map((a) => a.order).sort((a, b) => a - b);
        destClone = destClone.map((dest, ind) => ({ ...dest, order: sortedOrders[ind] }));

        currentSelected.setValue(destClone);
        return destClone;
    };

    const handleDrop = (ev, zone) => {
        const dropId =
            ev.target.getAttribute('data-rbd-draggable-id') ||
            ev.target.parentElement.getAttribute('data-rbd-draggable-id');
        let pivotItemsLoc = [...pivotItems];

        ev.preventDefault();
        const key = ev.dataTransfer.getData('text');
        const el = pivotItemsLoc.find((el) => el.key === key);
        el.type = zone;
        el.order = orderIndex + 1;
        setOrderIndex((s) => s + 1);
        if (dropId) {
            const updatedData = insertItem(dropId, el);
            let updatedDataObj = [...updatedData].reduce((a, b) => ((a[b.key] = b), a), {});
            for (let row of pivotItemsLoc) {
                if (updatedDataObj[row.key]) {
                    row.order = updatedDataObj[row.key].order;
                    row.type = updatedDataObj[row.key].type;
                }
            }
        } else {
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
        }
        correctOrder(pivotItemsLoc);
        onChange(pivotItemsLoc, '');
        setPivotItems((s) => [...s]);
    };
    function updateItems(type, data) {
        switch (type) {
            case 'filters':
                setFiltersItems(data[type]);
                break;
            case 'rows':
                setRowsItems(data[type]);
                break;
            case 'columns':
                setColumnsItems(data[type]);
                break;

            default:
                break;
        }
    }

    function handleOnDragEnd(result) {
        setDisabledZones([]);
        const { source, destination, draggableId } = result;
        if (!destination) return;

        const [elId, sType] = draggableId.split('-');
        const sInd = source.droppableId;
        const dType = destination.droppableId;
        const dInd = destination.droppableId;
        const newState = { filters: filtersItems, rows: rowsItems, columns: columnsItems };
        if (sInd === dInd) {
            const items = reorder(newState[sInd], source.index, destination.index);
            newState[sInd] = items;
            updateItems(sInd, newState);
            updatePivotItems(newState, pivotItems);
        } else {
            const result = move(newState[sType], newState[dType], source, destination, dType);
            newState[sType] = result[sInd];
            newState[dType] = result[dInd];
            updateItems(sInd, newState);
            updateItems(dInd, newState);
            updatePivotItems(newState, pivotItems, elId);
        }
        setPivotItems((s) => [...s]);
    }

    const updatePivotItems = (newState, pivotInf, id) => {
        let pivotItemsLoc = [...newState.filters, ...newState.rows, ...newState.columns].reduce(
            (a, b) => ((a[b.key] = b), a),
            {}
        );
        for (let row of pivotInf) {
            if (pivotItemsLoc[row.key]) {
                row.order = pivotItemsLoc[row.key].order;
                row.type = pivotItemsLoc[row.key].type;
            }
        }
        correctOrder(pivotInf);
        onChange(pivotInf, id);
    };

    return (
        <div className={classes.root}>
            <div
                aria-label="pivots"
                // draggable={false}
                className={classes.pivotsContainer}
            >
                {pivotAccordionItems.length > 0 ? (
                    <div style={{ width: '100%' }}>
                        {pivotAccordionItems?.map((elem) => (
                            <div style={{ width: '100%' }}>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography variant="h5">{elem}</Typography>
                                    </AccordionSummary>
                                    {pivotItems?.map((el, index) => (
                                        <AccordionDetails>
                                            {elem === el.differentiator ? (
                                                <Chip
                                                    id={el.key}
                                                    variant="outlined"
                                                    disabled={el.type}
                                                    size="large"
                                                    label={el.label}
                                                    title={el.label}
                                                    draggable={!el.type}
                                                    onDragStart={(ev) => hanldeDrag(ev, el)}
                                                    className={clsx(
                                                        classes.chip,
                                                        classes.fontSize1
                                                    )}
                                                />
                                            ) : (
                                                <></>
                                            )}
                                        </AccordionDetails>
                                    ))}
                                </Accordion>
                            </div>
                        ))}
                    </div>
                ) : (
                    <span>
                        {pivotItems?.map((el, index) => (
                            <Chip
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
                    </span>
                )}
            </div>
            <DropZone
                onRemove={handleRemove}
                items={{ filters: filtersItems, rows: rowsItems, columns: columnsItems }}
                onDrop={handleDrop}
                classes={classes}
                handleOnDragEnd={handleOnDragEnd}
                onDragStartCustom={onDragStartCustom}
                disableDrop={disabledZones}
            />
        </div>
    );
}

const move = (source, destination, droppableSource, droppableDestination, destinationType) => {
    const sourceClone = Array.from(source);
    let destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    removed.type = destinationType;

    destClone.splice(droppableDestination.index, 0, removed);
    const sortedOrders = destClone.map((a) => a.order).sort((a, b) => a - b);
    destClone = destClone.map((dest, ind) => ({ ...dest, order: sortedOrders[ind] }));

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
const reorder = (list, startIndex, endIndex) => {
    let result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const sortedOrders = result.map((a) => a.order).sort((a, b) => a - b);
    result = result.map((dest, ind) => ({ ...dest, order: sortedOrders[ind] }));
    return result;
};

function DropZone({
    title,
    items: draggedList,
    onRemove,
    onDrop,
    classes,
    disableDrop,
    handleOnDragEnd,
    onDragStartCustom,
    ...props
}) {
    return (
        <>
            <DragDropContext
                onDragEnd={handleOnDragEnd}
                onDragStart={(start) => onDragStartCustom(start)}
            >
                {['Filters', 'Rows', 'Columns'].map(
                    (item, idx) => (
                        <Droppable
                            isDropDisabled={disableDrop?.includes(item.toLowerCase())}
                            droppableId={item.toLowerCase()}
                            key={item + `${idx}`}
                        >
                            {(provided) => (
                                <div
                                    aria-label="drop-zone"
                                    onDrop={(ev) => {
                                        onDrop(ev, item.toLowerCase());
                                    }}
                                    onDragOver={(ev) =>
                                        disableDrop?.includes(item.toLowerCase())
                                            ? false
                                            : ev.preventDefault()
                                    }
                                    className={classes.dropzoneContainer}
                                >
                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        className={clsx(classes.defaultColor, classes.fontSize1)}
                                    >
                                        {item}{' '}
                                        {disableDrop?.includes(item.toLowerCase()) ? (
                                            <span>Not Allowed</span>
                                        ) : (
                                            ''
                                        )}
                                    </Typography>
                                    <div
                                        aria-label="filters list"
                                        className={classes.dropZone}
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {item.toLowerCase() === 'filters' ? (
                                            <DraggableListItem
                                                draggedList={draggedList.filters}
                                                onRemove={onRemove}
                                                classes={classes}
                                            />
                                        ) : item.toLowerCase() === 'rows' ? (
                                            <DraggableListItem
                                                draggedList={draggedList.rows}
                                                onRemove={onRemove}
                                                classes={classes}
                                            />
                                        ) : item.toLowerCase() === 'columns' ? (
                                            <DraggableListItem
                                                draggedList={draggedList.columns}
                                                onRemove={onRemove}
                                                classes={classes}
                                            />
                                        ) : null}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    )
                    //  </div>
                )}
            </DragDropContext>
        </>
    );
}

export function DraggableListItem({ classes, onRemove, draggedList }) {
    return (
        <List dense>
            {draggedList?.map((el, index) => (
                <Draggable draggableId={`${el.index}-${el.type}`} index={index} key={el.label}>
                    {(provided) => (
                        <ListItem
                            divider
                            classes={{ divider: classes.divider }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                        >
                            <ListItemText
                                disableTypography
                                primary={el.label}
                                className={clsx(
                                    classes.fontSize1,
                                    classes.defaultColor,
                                    classes.textOverflow
                                )}
                            />

                            <HighlightOffIcon
                                title="remove"
                                onClick={(e) => onRemove(el)}
                                fontSize="large"
                                className={classes.closeIcon}
                            />
                        </ListItem>
                    )}
                </Draggable>
            ))}
        </List>
    );
}
