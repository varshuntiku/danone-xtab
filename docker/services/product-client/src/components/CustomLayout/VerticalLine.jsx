import React, { useState, useRef, useCallback, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import _ from 'underscore';
import { LayoutContext } from 'context/LayoutContext';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        padding: '10px',
        position: 'absolute',
        zIndex: 1000,
        left: `var(--left,40%)`,
        background: theme.palette.background.modelBackground,
        cursor: 'grab',
        '&:hover $hoverInfo': {
            visibility: 'visible',
            opacity: 1
        }
    },
    line: {
        position: 'relative',
        width: '1px',
        backgroundColor: theme.palette.border.loginGrid,
        height: '100%'
    },
    arrow: {
        position: 'absolute',
        width: '0',
        height: '0',
        borderLeft: '4px solid transparent',
        borderRight: '4px solid transparent'
    },
    arrowLeft: {
        top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
        borderBottom: `4px solid ${theme.palette.border.loginGrid}`,
        left: '-7px'
    },
    arrowRight: {
        top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
        borderBottom: `4px solid ${theme.palette.border.loginGrid}`,
        right: '-7px'
    },
    hoverInfo: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: theme.palette.background.modelBackground,
        border: `1px solid ${theme.palette.background.modelBackground}`,
        padding: '5px 10px',
        visibility: 'hidden',
        opacity: 0,
        transition: 'opacity 0.3s, visibility 0.3s',
        zIndex: '100000',
        color: theme.palette.text.default
    }
}));

function sumArray(array) {
    return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

const VerticalLine = ({ position, rowIndex, columnIndex, parentRef, sumUntilIndex }) => {
    const { widthPattern, updateLayoutState } = useContext(LayoutContext);
    const classes = useStyles();
    const [isDragging, setIsDragging] = useState(false);
    const [leftPercentage, setLeftPercentage] = useState(Number(position));
    const [startPos, setStartPos] = useState(0);
    const latestInputValue = useRef(widthPattern);
    const calculateInitialHoverInfo = () => {
        return widthPattern[columnIndex][rowIndex];
    };
    const [hoverInfo, setHoverInfo] = useState(calculateInitialHoverInfo);
    const divRef = useRef(null);
    useEffect(() => {
        setLeftPercentage(sumUntilIndex(widthPattern[columnIndex], rowIndex));
        setHoverInfo(widthPattern[columnIndex][rowIndex]);
        latestInputValue.current = widthPattern;
    }, [widthPattern]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                const parentWidth = parentRef.current.offsetWidth;
                const deltaX = e.clientX - startPos;
                const deltaPercentage = (deltaX / parentWidth) * 100;
                let newLeftPercentage = leftPercentage + deltaPercentage;
                let sum =
                    latestInputValue.current[columnIndex][rowIndex] +
                    latestInputValue.current[columnIndex][rowIndex + 1];
                let newLeft =
                    rowIndex == 0
                        ? Math.round(
                              (newLeftPercentage * parentWidth) / 100 / Math.round(parentWidth / 12)
                          )
                        : Math.round(
                              (newLeftPercentage * parentWidth) / 100 / Math.round(parentWidth / 12)
                          ) - sumArray(latestInputValue.current[columnIndex].slice(0, rowIndex));
                let rightCheck = sum - newLeft > 0 ? sum - newLeft : 0;
                if (newLeftPercentage >= 7 && newLeftPercentage <= 92) {
                    if (newLeftPercentage < 0) newLeftPercentage = 0;
                    if (newLeftPercentage > 100) newLeftPercentage = 100;
                    if (rightCheck >= 1 && newLeft >= 1) {
                        setLeftPercentage(newLeftPercentage);
                        setStartPos(e.clientX);
                        updateHoverInfo(newLeftPercentage);
                    }
                }
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            debouncedChange(leftPercentage);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, leftPercentage, startPos]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPos(e.clientX);
    };

    const updateHoverInfo = (leftPercentage) => {
        const parentWidth = parentRef.current.offsetWidth;
        let newPattern = JSON.parse(JSON.stringify(latestInputValue.current));
        let sum =
            latestInputValue.current[columnIndex][rowIndex] +
            latestInputValue.current[columnIndex][rowIndex + 1];
        newPattern[columnIndex][rowIndex] =
            rowIndex == 0
                ? Math.round((leftPercentage * parentWidth) / 100 / Math.round(parentWidth / 12))
                : Math.round((leftPercentage * parentWidth) / 100 / Math.round(parentWidth / 12)) -
                  sumArray(latestInputValue.current[columnIndex].slice(0, rowIndex));
        newPattern[columnIndex][rowIndex + 1] =
            sum - newPattern[columnIndex][rowIndex] > 0
                ? sum - newPattern[columnIndex][rowIndex]
                : 0;
        setHoverInfo(newPattern[columnIndex][rowIndex]);
    };

    const debouncedChange = useCallback(
        _.debounce((leftPercentage) => {
            const parentWidth = parentRef.current.offsetWidth;
            let newPattern = JSON.parse(JSON.stringify(latestInputValue.current));
            let sum =
                latestInputValue.current[columnIndex][rowIndex] +
                latestInputValue.current[columnIndex][rowIndex + 1];
            newPattern[columnIndex][rowIndex] =
                rowIndex == 0
                    ? Math.round(
                          (leftPercentage * parentWidth) / 100 / Math.round(parentWidth / 12)
                      )
                    : Math.round(
                          (leftPercentage * parentWidth) / 100 / Math.round(parentWidth / 12)
                      ) - sumArray(latestInputValue.current[columnIndex].slice(0, rowIndex));
            newPattern[columnIndex][rowIndex + 1] =
                sum - newPattern[columnIndex][rowIndex] > 0
                    ? sum - newPattern[columnIndex][rowIndex]
                    : 0;
            updateLayoutState('widthPattern', newPattern, columnIndex);
        }, 500),
        []
    );

    return (
        <div
            className={classes.container}
            ref={divRef}
            style={{ '--left': `${leftPercentage}%` }}
            onMouseDown={handleMouseDown}
            data-testid="vertical-line"
        >
            <div className={classes.line}>
                <div className={`${classes.arrow} ${classes.arrowLeft}`} />
                <div className={`${classes.arrow} ${classes.arrowRight}`} />
            </div>
            <div className={classes.hoverInfo}>{hoverInfo}</div>
        </div>
    );
};

export default VerticalLine;
