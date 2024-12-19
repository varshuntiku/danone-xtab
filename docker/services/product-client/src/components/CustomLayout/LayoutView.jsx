import React, { useRef, useContext, useEffect, useState } from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import AddWidget from './AddWidget';
import VerticalLine from './VerticalLine';
import HorizontalLine from './HorizontalLine';
import VerticalOrientationInnerLine from './VerticalOrientationInnerSeparator';
import VerticalOrientationOuterLine from './VerticalOrientationOuterSeparator';
import { LayoutContext } from 'context/LayoutContext';

const useStyles = makeStyles((theme) => ({
    layoutHeader: {
        fontSize: '2rem',
        fontWeight: theme.title.h1.fontWeight,
        fontFamily: theme.title.h1.fontFamily,
        marginBottom: '3rem',
        color: theme.palette.text.default,
        paddingLeft: '1.6rem',
        paddingTop: '0.6rem'
    },
    container: {
        position: 'relative',
        flexDirection: 'column',
        height: '100%',
        border: `2.25px solid ${theme.palette.text.default}40`,
        padding: '2rem',
        marginLeft: '1.5rem',
        marginRight: '1.5rem',
        boxShadow: '0px 4px 30px 0px rgba(148, 148, 148, 0.16)',
        borderRadius: '2px'
    },
    gridHolder: {
        position: 'absolute',
        top: '2rem',
        left: '3rem',
        display: 'flex',
        gap: '2rem',
        width: 'calc(100% - 6rem)',
        zIndex: 1,
        height: 'calc(100% - 5rem)'
    },
    gridStyle: {
        height: '100%',
        border: `1px solid '${
            localStorage.getItem('codx-products-theme') === 'light'
                ? 'rgba(251, 249, 247, 1)'
                : `${theme.palette.text.peachText}10`
        }`,
        background:
            localStorage.getItem('codx-products-theme') === 'light'
                ? 'rgba(251, 249, 247, 1)'
                : `${theme.palette.text.peachText}10`,
        backgroundSize: '5px 5px',
        width: 'var(--width,6.6%)'
    },
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '68vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        zIndex: 10,
        border: `1px solid ${theme.palette.text.default}42`,
        borderRadius: '2px',
        padding: '1rem'
    },
    kpiHolder: { display: 'flex', width: '100%', zIndex: 2, gap: '2rem', height: 'auto' },
    kpiStyle: {
        height: '10rem',
        flex: 1,
        background:
            localStorage.getItem('codx-products-theme') === 'light'
                ? 'rgba(34, 0, 71, 0.28)'
                : `${theme.palette.text.default}40`,
        minWidth: 'auto'
    },
    horizontalWidgetContainer: {
        display: 'flex',
        width: '100%',
        zIndex: 2,
        gap: '0.5rem',
        flexDirection: 'column'
    },
    horizontalRowHolder: {
        flex: 1,
        background: 'transparent',
        minWidth: '100%',
        position: 'relative',
        flexDirection: 'column',
        display: 'flex',
        gap: '0.5rem'
    },
    horizontalRow: {
        display: 'flex',
        width: '100%',
        background: `${
            localStorage.getItem('codx-products-theme') === 'light'
                ? 'rgba(239, 229, 238, 0.44)'
                : `${theme.palette.text.default}30`
        }`,
        position: 'relative',
        border: `1px solid ${theme.palette.border.loginGrid}`
    },
    horizontalRowAddWidget: {
        display: 'flex',
        width: '100%',
        position: 'relative',
        border: `1px solid ${theme.palette.border.loginGrid}`
    },
    verticalContainer: { display: 'flex', width: '100%', zIndex: 2, gap: '1rem' },
    columnContainer: {
        minHeight: '100%',
        flex: 1,
        background: 'transparent',
        flexDirection: 'row',
        display: 'flex',
        gap: '1rem'
    },
    columnHolder: {
        display: 'flex',
        height: '100%',
        width: '100%',
        background: `${
            localStorage.getItem('codx-products-theme') === 'light'
                ? 'rgba(239, 229, 238, 0.44)'
                : `${theme.palette.text.default}30`
        }`,
        position: 'relative',
        border: `1px solid ${theme.palette.border.loginGrid}`
    },
    verticalHolder: {
        minHeight: '100%',
        flex: 1,
        background: 'transparent',
        flexDirection: 'row',
        display: 'flex',
        gap: '1rem'
    },
    columnHolderAddWidget: {
        display: 'flex',
        height: '100%',
        width: '100%',
        position: 'relative',
        border: `1px solid ${theme.palette.border.loginGrid}`
    }
}));
const LayoutView = ({ kpiCount, rows, orientation, addWidget, setAddWidget }) => {
    const { widthPattern } = useContext(LayoutContext);
    const classes = useStyles();
    const parentRef = useRef(null);
    const containerRef = useRef(null);
    const containerVerticalRef = useRef(null);
    const gridContainerRef = useRef(null);
    const [gridcontaineWidth, setGridContainerWidth] = useState(0);

    useEffect(() => {
        console.log('setting width', gridContainerRef.current.offsetWidth);
        gridContainerRef?.current && setGridContainerWidth(gridContainerRef.current.offsetWidth);
    }, [gridContainerRef?.current?.offsetWidth]);

    function sumUntilIndex(arr, index) {
        if (arr == null) {
            arr = [];
        }
        if (index < 0) {
            return 0;
        } else if (index >= arr.length) {
            index = arr.length - 1;
        }
        let sum = 0;
        for (let i = 0; i <= index; i++) {
            sum += arr[i];
        }
        return (sum * 100) / 12 - 1;
    }
    return (
        <Box>
            <Typography className={classes.layoutHeader}>Layout View</Typography>
            <div className={classes.container}>
                <div className={classes.gridHolder} ref={gridContainerRef}>
                    {Array.from({ length: 12 }, (_, index) => (
                        <div
                            className={classes.gridStyle}
                            key={`grid${index}`}
                            style={{ '--width': `${gridcontaineWidth / 12}px` }}
                        ></div>
                    ))}
                </div>
                <div className={classes.mainContainer}>
                    <div className={classes.kpiHolder}>
                        {Array.from({ length: kpiCount }, (_, index) => (
                            <div key={`kpi${index}`} className={classes.kpiStyle}></div>
                        ))}
                    </div>
                    {orientation == 'Horizontal' ? (
                        <div
                            className={classes.horizontalWidgetContainer}
                            style={{
                                height: kpiCount == 0 ? '55vh' : '50vh',
                                marginTop: kpiCount == 0 ? '0rem' : '1.5rem'
                            }}
                            ref={containerRef}
                        >
                            {Array.from({ length: rows }, (_, index) => (
                                <div
                                    key={`widgetrow${index}`}
                                    className={classes.horizontalRowHolder}
                                >
                                    {addWidget[index] == undefined ? (
                                        <div
                                            id={`container${index}`}
                                            className={classes.horizontalRowAddWidget}
                                            style={{
                                                height:
                                                    rows == 1
                                                        ? '100%'
                                                        : kpiCount == 0
                                                        ? '26rem'
                                                        : '24rem'
                                            }}
                                            ref={parentRef}
                                        >
                                            <AddWidget
                                                addWidget={addWidget}
                                                setAddWidget={setAddWidget}
                                                row={index}
                                                rows={rows}
                                                kpiCount={kpiCount}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            id={`container${index}`}
                                            className={classes.horizontalRow}
                                            style={{
                                                height:
                                                    rows == 1
                                                        ? '100%'
                                                        : kpiCount == 0
                                                        ? '26rem'
                                                        : '24rem'
                                            }}
                                            ref={parentRef}
                                        >
                                            <AddWidget
                                                addWidget={addWidget}
                                                setAddWidget={setAddWidget}
                                                row={index}
                                                rows={rows}
                                            />
                                            {Array.from(
                                                { length: addWidget[index] - 1 },
                                                (_, rowIndex) => (
                                                    <VerticalLine
                                                        key={`horizontalOseparator${rowIndex}`}
                                                        position={`${sumUntilIndex(
                                                            widthPattern[index],
                                                            rowIndex
                                                        )}`}
                                                        parentRef={containerRef}
                                                        rowIndex={rowIndex}
                                                        columnIndex={index}
                                                        sumUntilIndex={(arr, rowindex) =>
                                                            sumUntilIndex(arr, rowindex)
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}
                                    {index !== rows - 1 && (
                                        <HorizontalLine
                                            containerRef={containerRef}
                                            index={index}
                                            containerHeight={
                                                containerRef.current?.offsetHeight || 0
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className={classes.verticalContainer}
                            style={{
                                height: kpiCount == 0 ? '55vh' : '50vh',
                                flexDirection: 'row',
                                marginTop: kpiCount == 0 ? '0rem' : '1.5rem'
                            }}
                            ref={containerVerticalRef}
                        >
                            {Array.from({ length: rows }, (_, index) => (
                                <div
                                    key={`column${index}`}
                                    className={`${classes.verticalHolder} verticalParentContainer`}
                                >
                                    {addWidget[index] == undefined ? (
                                        <div className={classes.columnHolderAddWidget}>
                                            <AddWidget
                                                addWidget={addWidget}
                                                setAddWidget={setAddWidget}
                                                row={index}
                                                rows={rows}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            id={`container${index}`}
                                            className={classes.columnHolder}
                                            ref={parentRef}
                                        >
                                            <AddWidget
                                                addWidget={addWidget}
                                                setAddWidget={setAddWidget}
                                                row={index}
                                                orientation="Vertical"
                                                rows={rows}
                                            />
                                            {Array.from(
                                                { length: addWidget[index] - 1 },
                                                (_, rowIndex) => (
                                                    <VerticalOrientationInnerLine
                                                        key={`verticalDivider${rowIndex}`}
                                                        position={`${
                                                            (100 / addWidget[index] - 1) *
                                                            (rowIndex + 1)
                                                        }`}
                                                        parentRef={parentRef}
                                                        rowIndex={rowIndex}
                                                        columnIndex={index}
                                                        addWidget={addWidget}
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}
                                    {index !== rows - 1 && (
                                        <VerticalOrientationOuterLine
                                            containerRef={containerVerticalRef}
                                            index={index}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Box>
    );
};

export default LayoutView;
