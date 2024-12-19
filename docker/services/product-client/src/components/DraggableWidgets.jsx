import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Grid, Button, IconButton } from '@material-ui/core';
import { rearrangeWidgets } from 'services/widget';
import CloseIcon from '@material-ui/icons/Close';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { setActiveScreenWidgets } from 'store/index';

const useStyles = makeStyles((theme) => ({
    card: {
        height: theme.layoutSpacing(80),
        borderRadius: theme.layoutSpacing(10),
        background: theme.palette.background.cardBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        padding: theme.layoutSpacing(8),
        border: `1px solid ${theme.palette.border.cardBorder}`,
        '&:hover': {
            cursor: 'grab'
        }
    },
    draggingItem: {
        filter: 'blur(1px)',
        cursor: 'grabbing',
        opacity: '0.4'
    },
    wrapper: {
        width: theme.layoutSpacing(920),
        background: theme.palette.background.blueBg,
        padding: theme.layoutSpacing(0, 16, 24, 16),
        border: `1px solid ${theme.palette.border.cardBorder}`
    },
    hover: {
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        '&:hover': {
            backgroundColor: theme.palette.background.menuItemHover,
            borderRadius: '100%'
        }
    },
    closeIcon: {
        width: theme.layoutSpacing(22),
        height: theme.layoutSpacing(22),
        '&:hover': {
            backgroundColor: theme.palette.background.menuItemHover
        }
    },
    dragIcon: {
        margin: 0,
        cursor: 'grab',
        padding: 0,
        marginRight: theme.layoutSpacing(8),
        '&:hover': {
            background: 'none',
            cursor: 'grab'
        }
    },
    dragIndicator: {
        width: theme.layoutSpacing(28),
        height: theme.layoutSpacing(28),
        '&:hover': {
            background: 'none',
            cursor: 'grab'
        }
    },
    headerWrapper: {
        borderBottom: `1px solid ${theme.palette.border.titleBorder}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: theme.layoutSpacing(70)
    },
    title: {
        fontSize: theme.layoutSpacing(22),
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(36),
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.title
    },
    subtitle: {
        fontSize: theme.layoutSpacing(20),
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(24),
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default,
        marginBottom: theme.layoutSpacing(16)
    },
    kpiWrapper: {
        padding: theme.layoutSpacing(30, 10, 50, 10)
    },
    content: {
        fontSize: theme.layoutSpacing(18),
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(21),
        fontFamily: theme.body.B1.fontFamily,
        color: theme.palette.text.revamp
    },
    chartCard: {
        height: theme.layoutSpacing(96)
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.layoutSpacing(0, 10, 0, 10),
        '& button': {
            width: theme.layoutSpacing(142),
            height: theme.layoutSpacing(48),
            padding: theme.layoutSpacing(8, 24, 8, 24),
            fontSize: theme.layoutSpacing(16),
            fontWeight: 500,
            lineHeight: theme.layoutSpacing(19),
            fontFamily: theme.body.B1.fontFamily,
            letterSpacing: theme.layoutSpacing(0.5)
        }
    },
    resetBtn: {
        background: theme.palette.background.buttonBg,
        color: theme.palette.border.buttonBorder,
        border: `1px solid ${theme.palette.border.buttonBorder}`,
        '&:hover': {
            background: theme.palette.background.buttonBg,
            color: theme.palette.border.buttonBorder
        }
    },
    verticalChartCard: {
        height: '100%'
    }
}));

export default function DraggableWidgets(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [kpis] = useState(props.widgets.filter((widget) => widget.is_label));
    const [graphs] = useState(props.widgets.filter((widget) => !widget.is_label));
    const [dragIndex, setDragIndex] = useState(null);
    const [dragging, setDragging] = useState(null);
    const [draggingChart, setDraggingChart] = useState(null);
    const [dragGraphIndex, setDragGraphIndex] = useState(null);
    const [newKpis, setNewKpis] = useState(props.widgets.filter((widget) => widget.is_label));
    const [newGraphs, setNewGraphs] = useState(props.widgets.filter((widget) => !widget.is_label));
    const activeScreenDetails = useSelector((state) => state.appScreen.activeScreenDetails);

    const handleDragEnd = () => {
        setDragging(null);
        setDragIndex(null);
    };
    const handleDragStart = (i) => {
        setDragIndex(i);
        setDragging(i);
    };
    const handleDragOver = (e) => {
        dragIndex !== null && e.preventDefault();
    };
    const handleDrop = (e, kpi, dropIndex) => {
        if (dragIndex !== null) {
            const pickedScreen = newKpis.splice(dragIndex, 1);
            const updatedKpis = [
                ...newKpis.slice(0, dropIndex),
                ...pickedScreen,
                ...newKpis.slice(dropIndex)
            ];
            setNewKpis(updatedKpis);
            setDragging(null);
            setDragIndex(null);
        }
    };
    const handleGraphDragStart = (i) => {
        setDragGraphIndex(i);
        setDraggingChart(i);
    };
    const handleGraphDragOver = (e) => {
        dragGraphIndex !== null && e.preventDefault();
    };
    const handleGraphDrop = (e, graph, dropIndex) => {
        if (dragGraphIndex !== null) {
            const pickedGraph = newGraphs.splice(dragGraphIndex, 1);
            const updatedGraphs = [
                ...newGraphs.slice(0, dropIndex),
                ...pickedGraph,
                ...newGraphs.slice(dropIndex)
            ];
            setNewGraphs(updatedGraphs);
            setDraggingChart(null);
            setDragGraphIndex(null);
        }
    };
    const handleGraphDragEnd = () => {
        setDraggingChart(null);
        setDragGraphIndex(null);
    };
    const resetChanges = () => {
        setNewKpis(kpis);
        setNewGraphs(graphs);
    };
    const applyChanges = () => {
        const widgets = [...newKpis, ...newGraphs];
        rearrangeWidgets({
            appId: props.appId,
            screenId: props.screenId,
            payload: {
                widgets: widgets.map((widget, index) => ({ id: widget.id, widget_index: index }))
            },
            callback: (data) => {
                dispatch(setActiveScreenWidgets(data?.widgets));
                props.updateNotificationStatus(true);
                props.closeRearrangeWidgets();
            }
        });
    };

    const getXsValue = () => {
        if (activeScreenDetails?.horizontal === null) {
            return () =>
                newGraphs.length > 4 ? 4 : newGraphs.length === 4 ? 6 : 12 / newGraphs.length;
        }
        const getWidths = () => {
            if (activeScreenDetails?.horizontal && activeScreenDetails?.graph_width)
                return activeScreenDetails?.graph_width
                    ?.split(',')
                    .map((e) => e.split('-'))
                    .flat();
            else if (activeScreenDetails?.graph_height)
                return activeScreenDetails?.graph_height
                    ?.split(',')
                    .map((e) => e.split('-'))
                    .flat();
            return activeScreenDetails?.graph_type
                ?.split('-')
                .map((elem) => new Array(Number(elem)).fill(parseInt(12 / Number(elem))))
                .flat();
        };
        if (activeScreenDetails?.graph_type) {
            const widths = getWidths();
            return (i) =>
                i === newGraphs.length - 1 && i !== widths.length - 1 ? true : Number(widths[i]);
        } else {
            return () =>
                newGraphs.length > 4 ? 4 : newGraphs.length === 4 ? 6 : 12 / newGraphs.length;
        }
    };
    const xsValue = getXsValue();

    let verticalWidgetIndex = 0;
    const renderVerticalCards = (count) => {
        const arr = [];
        for (let j = 0; j < count; ++j) {
            const graph = newGraphs[verticalWidgetIndex + j];
            const i = verticalWidgetIndex + j;
            arr.push(
                <Grid key={graph?.id} item xs>
                    <div
                        className={`${classes.card} ${classes.verticalChartCard} ${
                            draggingChart == i ? classes.draggingItem : ''
                        }`}
                        draggable={true}
                        onDragStart={() => handleGraphDragStart(i)}
                        onDragOver={handleGraphDragOver}
                        onDrop={(e) => handleGraphDrop(e, graph, i)}
                        onDragEnd={handleGraphDragEnd}
                    >
                        <IconButton
                            size="medium"
                            title="drag"
                            className={classes.dragIcon}
                            aria-label="Drag"
                        >
                            <DragIndicatorIcon fontSize="large" className={classes.dragIndicator} />
                        </IconButton>
                        <div className={classes.content}>
                            {graph?.config?.title || graph?.widget_key}
                        </div>
                    </div>
                </Grid>
            );
        }
        return arr;
    };
    const renderVerticalColumns = () => {
        const verticalGraphTypeArr = activeScreenDetails?.graph_type?.split('-');
        return verticalGraphTypeArr.map((count) => {
            const verticalColumn = (
                <Grid item justify="center" spacing={1} xs={12 / verticalGraphTypeArr.length}>
                    <Grid
                        container
                        justify="center"
                        spacing={1}
                        direction="column"
                        style={{ height: `${75 * Math.max(...verticalGraphTypeArr)}px` }}
                    >
                        {renderVerticalCards(Number(count))}
                    </Grid>
                </Grid>
            );
            verticalWidgetIndex = verticalWidgetIndex + Number(count);
            return verticalColumn;
        });
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.headerWrapper}>
                <div className={classes.title}>Rearrange Components</div>
                <div className={classes.hover}>
                    <CloseIcon
                        onClick={() => props.closeRearrangeWidgets()}
                        className={classes.closeIcon}
                    />
                </div>
            </div>
            {newKpis && newKpis.length ? (
                <div className={classes.kpiWrapper}>
                    <div className={classes.subtitle}>KPI Cards</div>
                    <Grid container justify="center" spacing={1}>
                        {newKpis.map((kpi, i) => (
                            <Grid key={kpi.id} item xs>
                                <div
                                    className={`${classes.card} ${
                                        dragging == i ? classes.draggingItem : ''
                                    }`}
                                    draggable={true}
                                    onDragStart={() => handleDragStart(i)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, kpi, i)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <IconButton
                                        size="medium"
                                        title="drag"
                                        className={classes.dragIcon}
                                        aria-label="Drag"
                                    >
                                        <DragIndicatorIcon
                                            fontSize="large"
                                            className={classes.dragIndicator}
                                        />
                                    </IconButton>
                                    <div className={classes.content}>
                                        {kpi?.config?.title || kpi?.widget_key}
                                    </div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            ) : null}
            <div className={classes.kpiWrapper}>
                <div className={classes.subtitle}>Charts</div>
                {activeScreenDetails?.horizontal || activeScreenDetails?.horizontal === null ? (
                    <Grid container justify="center" spacing={1}>
                        {newGraphs.map((graph, i) => {
                            return (
                                <Grid key={graph?.id} item xs={xsValue(i)}>
                                    <div
                                        className={`${classes.card} ${classes.chartCard} ${
                                            draggingChart == i ? classes.draggingItem : ''
                                        }`}
                                        draggable={true}
                                        onDragStart={() => handleGraphDragStart(i)}
                                        onDragOver={handleGraphDragOver}
                                        onDrop={(e) => handleGraphDrop(e, graph, i)}
                                        onDragEnd={handleGraphDragEnd}
                                    >
                                        <IconButton
                                            size="medium"
                                            title="drag"
                                            className={classes.dragIcon}
                                            aria-label="Drag"
                                        >
                                            <DragIndicatorIcon
                                                fontSize="large"
                                                className={classes.dragIndicator}
                                            />
                                        </IconButton>
                                        <div className={classes.content}>
                                            {graph?.config?.title || graph?.widget_key}
                                        </div>
                                    </div>
                                </Grid>
                            );
                        })}
                    </Grid>
                ) : (
                    <Grid container justify="center" spacing={1}>
                        {renderVerticalColumns()}
                    </Grid>
                )}
            </div>
            <div className={classes.buttonsWrapper}>
                <Button
                    variant="contained"
                    onClick={resetChanges}
                    aria-label="Reset"
                    className={classes.resetBtn}
                >
                    Reset
                </Button>
                <Button variant="contained" onClick={applyChanges} aria-label="Apply">
                    Apply
                </Button>
            </div>
        </div>
    );
}
