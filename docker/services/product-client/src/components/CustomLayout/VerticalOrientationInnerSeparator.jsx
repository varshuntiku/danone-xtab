import React, { useState, useRef, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { LayoutContext } from 'context/LayoutContext';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '1px',
        width: '100%',
        padding: '10px',
        position: 'absolute',
        zIndex: 1000,
        top: `var(--top,40%)`,
        background: theme.palette.background.modelBackground,
        cursor: 'grab',
        '&:hover $hoverInfo': {
            visibility: 'visible',
            opacity: 1
        }
    },
    line: {
        position: 'relative',
        width: '100%',
        backgroundColor: theme.palette.border.loginGrid,
        height: '1px'
    },
    arrow: {
        position: 'absolute',
        width: '0',
        height: '0',
        borderLeft: '4px solid transparent',
        borderRight: '4px solid transparent',
        cursor: 'grab'
    },
    arrowLeft: {
        top: '0.65rem',
        transform: 'translateY(-50%) rotate(180deg)',
        borderBottom: `4px solid ${theme.palette.border.loginGrid}`,
        left: '49.5%'
    },
    arrowRight: {
        top: '-0.5rem',
        transform: 'translateY(-50%) rotate(0deg)',
        borderBottom: `4px solid ${theme.palette.border.loginGrid}`,
        left: '49.5%'
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

const VerticalOrientationInnerLine = ({
    position,
    parentRef,
    columnIndex,
    rowIndex,
    addWidget
}) => {
    const { heightPattern, updateLayoutState } = useContext(LayoutContext);
    const [hoverInfo, setHoverInfo] = useState(heightPattern[columnIndex][rowIndex] || 0);
    const classes = useStyles();
    const [isDragging, setIsDragging] = useState(false);
    const [topPercentage, setTopPercentage] = useState(Number(position));
    const [startPos, setStartPos] = useState(0);
    const divRef = useRef(null);

    useEffect(() => {
        setHoverInfo(heightPattern[columnIndex][rowIndex] || 0);
    }, [heightPattern]);

    useEffect(() => {
        setTopPercentage(Number(`${(100 / addWidget[columnIndex] - 1) * (rowIndex + 1)}`));
        setHoverInfo(heightPattern[columnIndex][rowIndex] || 0);
    }, [addWidget]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                const parentHeight = parentRef.current.offsetHeight;
                const deltaY = e.clientY - startPos;
                const deltaPercentage = (deltaY / parentHeight) * 100;
                let newTopPercentage = topPercentage + deltaPercentage;
                if (newTopPercentage >= 7 && newTopPercentage <= 92) {
                    setTopPercentage(newTopPercentage);
                    setStartPos(e.clientY);
                    let pos = Math.round(newTopPercentage / (10 * (rowIndex + 1))) * 10;
                    let newHeightPattern = JSON.parse(JSON.stringify(heightPattern));
                    let sum =
                        heightPattern[columnIndex][rowIndex] +
                        heightPattern[columnIndex][rowIndex + 1];
                    newHeightPattern[columnIndex][rowIndex] = pos;
                    newHeightPattern[columnIndex][rowIndex + 1] = sum - pos;
                    updateLayoutState('heightPattern', newHeightPattern, 0);
                    setHoverInfo(pos);
                }
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
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
    }, [isDragging, topPercentage, startPos]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPos(e.clientY);
    };

    return (
        <div
            className={classes.container}
            ref={divRef}
            onMouseDown={handleMouseDown}
            style={{ '--top': `${topPercentage}%` }}
            data-testid={`container-${rowIndex}`}
        >
            <div className={classes.line}>
                <div className={`${classes.arrow} ${classes.arrowLeft}`} />
                <div className={`${classes.arrow} ${classes.arrowRight}`} />
            </div>
            <div className={classes.hoverInfo} data-testid="hover-info">
                {hoverInfo}
            </div>
        </div>
    );
};

export default VerticalOrientationInnerLine;
