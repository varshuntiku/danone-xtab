import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Container, Grid, Paper, Typography, makeStyles } from '@material-ui/core';
import KPISettings from './KpiSettings';
import LayoutView from './LayoutView';
import { LayoutContext } from 'context/LayoutContext';

const useStyles = makeStyles((theme) => ({
    customHeader: {
        fontSize: '2rem',
        fontWeight: theme.title.h6.fontWeight,
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default,
        borderBottom: `1px solid ${theme.palette.text.contrastText}70`,
        paddingLeft: '3rem',
        paddingBottom: '1rem',
        paddingTop: '1rem'
    },
    containerMain: {
        width: '100%',
        height: '100%',
        background: theme.palette.background.modelBackground,
        padding: 0
    },
    bottomContainer: {
        padding: 0,
        width: 'inherit',
        height: '100%'
    },
    bottomLeftContainer: {
        height: 'inherit',
        borderRight: `1px solid ${theme.palette.text.contrastText}70`,
        padding: '0 !important'
    }
}));

const CustomLayout = (props) => {
    const { widthPattern, heightPattern, updateLayoutState } = useContext(LayoutContext);
    const classes = useStyles();
    const [rows, setRows] = useState('');
    const [orientation, setOrientation] = useState('Horizontal');
    const [addWidget, setAddWidget] = useState({});

    const setWidgetAdd = (row, newWidget) => {
        setAddWidget(newWidget);
        let patternArr = [];
        if (orientation == 'Horizontal') {
            let calculateWidth = (remainingWidth = 12, remainingWidgets = newWidget[row]) => {
                if (remainingWidth % remainingWidgets == 0) {
                    let width = remainingWidth / remainingWidgets;
                    for (let i = 0; i < remainingWidgets; i++) {
                        patternArr.push(width);
                    }
                } else {
                    patternArr.push(remainingWidth % remainingWidgets);
                    calculateWidth(
                        remainingWidth - (remainingWidth % remainingWidgets),
                        remainingWidgets - 1
                    );
                }
            };
            calculateWidth();
            let newWidthPattern = { ...widthPattern, [row]: patternArr };
            updateLayoutState('widthPattern', newWidthPattern, row);
        } else {
            let calculateWidth = () => {
                for (let i = 0; i < newWidget[row]; i++) {
                    patternArr.push(Math.round(100 / newWidget[row] / 10) * 10);
                }
            };
            calculateWidth();
            let newHeightPattern = { ...heightPattern, [row]: patternArr };
            updateLayoutState('heightPattern', newHeightPattern, row);
        }
    };
    useEffect(() => {
        if (Object.keys(addWidget).length == rows) {
            const values = Object.values(addWidget);
            const joinedValues = values.join('-');
            const sum = values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            props.handleGraphTypeChange(joinedValues, sum);
        }
    }, [addWidget]);

    function removeLastXItemsFromObject(obj, x) {
        const entries = Object.entries(obj);
        const newEntries = entries.slice(0, -x);
        return Object.fromEntries(newEntries);
    }

    useEffect(() => {
        let resultArray = [];
        for (let i = 0; i < rows; i++) {
            resultArray.push(5);
        }
        if (resultArray.length == 1) {
            resultArray[0] = 10;
        }
        orientation == 'Horizontal' ? updateLayoutState('heightPattern', resultArray, 0) : null;
        if (orientation == 'Vertical' && rows > 0) {
            let patternArr = [];
            let calculateWidth = (remainingWidth = 12, remainingWidgets = rows) => {
                if (remainingWidth % remainingWidgets == 0) {
                    let width = remainingWidth / remainingWidgets;
                    for (let i = 0; i < remainingWidgets; i++) {
                        patternArr.push(width);
                    }
                } else {
                    patternArr.push(remainingWidth % remainingWidgets);
                    calculateWidth(
                        remainingWidth - (remainingWidth % remainingWidgets),
                        remainingWidgets - 1
                    );
                }
            };
            calculateWidth();
            updateLayoutState('widthPattern', patternArr, -1);
        }
        if (Object.keys(addWidget).length > rows && rows > 0) {
            let newAddWidget = removeLastXItemsFromObject(
                addWidget,
                Object.keys(addWidget).length - rows
            );
            setAddWidget(newAddWidget);
        }
    }, [rows, orientation]);

    useEffect(() => {
        props.handleOrientationChange(orientation == 'Horizontal' ? false : true);
        setAddWidget({});
        orientation == 'Vertical' && updateLayoutState('heightPattern', [], 0);
        orientation == 'Horizontal' && updateLayoutState('widthPattern', [], -1);
        props.handleGraphTypeChange('', 0);
    }, [orientation]);

    useEffect(() => {
        switch (orientation) {
            case 'Vertical':
                if (widthPattern.length == rows && widthPattern.length != 0) {
                    props.handleGraphWHPatternChange('width', widthPattern.join('-'));
                }
                break;
            case 'Horizontal':
                if (
                    Object.keys(widthPattern).length == rows &&
                    Object.keys(widthPattern).length != 0
                ) {
                    const output = Object.values(widthPattern)
                        .map((arr) => arr.join('-'))
                        .join(',');
                    props.handleGraphWHPatternChange('width', output);
                }

                break;
            default:
                break;
        }
    }, [widthPattern]);

    useEffect(() => {
        switch (orientation) {
            case 'Vertical':
                if (
                    Object.keys(heightPattern).length == rows &&
                    Object.keys(heightPattern).length != 0
                ) {
                    const output = Object.values(heightPattern)
                        .map((arr) => arr.map((num) => num / 10).join('-'))
                        .join(',');
                    props.handleGraphWHPatternChange('height', output);
                }

                break;
            case 'Horizontal':
                if (heightPattern.length == rows && heightPattern != 0) {
                    props.handleGraphWHPatternChange('height', heightPattern.join('-'));
                }
                break;
            default:
                break;
        }
    }, [heightPattern]);

    return (
        <Container className={classes.containerMain}>
            <Grid container spacing={2} className={classes.bottomContainer}>
                <Grid item xs={3} className={classes.bottomLeftContainer}>
                    <Paper elevation={0}>
                        <Typography className={classes.customHeader} gutterBottom>
                            Custom Settings
                        </Typography>
                        <KPISettings
                            setKpiCount={props.setKpiCount}
                            kpiCount={props.kpiCount}
                            rows={rows}
                            setRows={setRows}
                            orientation={orientation}
                            setOrientation={setOrientation}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={9}>
                    <Paper elevation={0}>
                        <LayoutView
                            kpiCount={props.kpiCount}
                            rows={rows}
                            orientation={orientation}
                            addWidget={addWidget}
                            setAddWidget={setWidgetAdd}
                        />
                        <Box display="flex" justifyContent="end" marginTop={4} marginRight={2}>
                            <Button
                                variant="outlined"
                                style={{ marginRight: 10 }}
                                onClick={props.onCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={props.disabled}
                                onClick={props.onSaveClick}
                                size="small"
                                variant="contained"
                            >
                                Save Custom Layout
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CustomLayout;
