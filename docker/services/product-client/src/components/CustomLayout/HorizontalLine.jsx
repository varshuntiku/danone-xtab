import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import { LayoutContext } from 'context/LayoutContext';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '1px',
        width: '100%',
        padding: '1rem 0',
        position: 'relative',
        zIndex: 1000,
        cursor: 'grab',
        '&:hover $hoverInfo': {
            visibility: 'visible',
            opacity: 1
        },
        background: theme.palette.background.modelBackground
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

function sumArray(array) {
    return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

const HorizontalLine = (props) => {
    const { heightPattern, updateLayoutState } = useContext(LayoutContext);
    const classes = useStyles();
    const [hoverInfo, setHoverInfo] = useState(50);
    const handleMouseDown = (e) => {
        const startY = e.clientY;
        const topDiv = document.getElementById(`container${props.index}`);
        const bottomDiv = document.getElementById(`container${props.index + 1}`);
        const containerRect = props.containerHeight / 7;
        const startTopHeight = topDiv.offsetHeight / 7;
        const startBottomHeight = bottomDiv.offsetHeight / 7;
        const onMouseMove = (e) => {
            const deltaY = e.clientY - startY;
            const containerHeightRem = startTopHeight + startBottomHeight;
            const newTopHeight = startTopHeight + deltaY / 7;
            const newBottomHeight = containerHeightRem - newTopHeight;
            if (newTopHeight > 5) {
                topDiv.style.height = `${newTopHeight}rem`;
                bottomDiv.style.height = `${newBottomHeight < 0 ? 0 : newBottomHeight}rem`;
                let nearestTen =
                    Math.round(Math.ceil((newTopHeight * 100) / containerRect) / 10) * 10;
                setHoverInfo(nearestTen);
                let newHeightPattern = [...heightPattern];
                let index = props.index;
                let sum = sumArray(heightPattern.slice(index, index + 2));
                newHeightPattern[index] = nearestTen / 10;
                newHeightPattern[index + 1] = sum - nearestTen / 10 > 0 ? sum - nearestTen / 10 : 0;
                updateLayoutState('heightPattern', [...newHeightPattern], 0);
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
            data-testid="horizontal-line"
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

export default HorizontalLine;
