// src/VerticalLine.js
import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { LayoutContext } from 'context/LayoutContext';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        padding: '0px 1rem',
        position: 'relative',
        zIndex: 1000,
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
        background: theme.palette.border.loginGrid,
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

const VerticalOrientationOuterLine = (props) => {
    const { widthPattern, updateLayoutState } = useContext(LayoutContext);
    const classes = useStyles();
    const index = props.index;
    const [hoverInfo, setHoverInfo] = useState(widthPattern[index] || 0);
    const containerRef = props.containerRef;

    useEffect(() => {
        setHoverInfo(widthPattern[index]);
    }, [widthPattern]);

    const handleMouseDown = (e) => {
        const startX = e.clientX;
        const topDiv = document.getElementById(`container${index}`);
        const bottomDiv = document.getElementById(`container${index + 1}`);
        const parentVerticalFlex = document.getElementsByClassName(`verticalParentContainer`);
        const startTopHeight = topDiv.offsetWidth; // in rem
        const startBottomHeight = bottomDiv.offsetWidth; // in rem
        const onMouseMove = (e) => {
            const deltaY = e.clientX - startX;
            const containerHeightRem = startTopHeight + startBottomHeight;
            const newTopHeight = startTopHeight + deltaY;
            const newBottomHeight = containerHeightRem - newTopHeight;
            const containerRect = containerRef.current.offsetWidth;
            let calculateWidth = Math.ceil(newTopHeight / (containerRect / 12));
            let boundaryWidthTop = Math.round(newTopHeight / (containerRect / 12));
            if (
                boundaryWidthTop > 0 &&
                calculateWidth >= 1 &&
                calculateWidth <= 11 &&
                calculateWidth < widthPattern[index] + widthPattern[index + 1]
            ) {
                parentVerticalFlex[index].style.flex = 0;
                parentVerticalFlex[index + 1]
                    ? (parentVerticalFlex[index + 1].style.flex = 0)
                    : null;
                topDiv.style.width = `${newTopHeight}px`;
                bottomDiv.style.width = `${newBottomHeight}px`;
                setHoverInfo(calculateWidth);
                let newWidthPattern = [...widthPattern];
                newWidthPattern[index] = calculateWidth;
                let diff = widthPattern[index] - calculateWidth;
                newWidthPattern[index + 1] = widthPattern[index + 1] + diff;
                updateLayoutState('widthPattern', newWidthPattern, -1);
            }
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };
    return (
        <div
            className={classes.container}
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

export default VerticalOrientationOuterLine;
