import { makeStyles } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import {
    OfflineBoltOutlined,
    DesktopMacOutlined,
    Share,
    Settings,
    Usb,
    AccountTree
} from '@material-ui/icons';
import React, { useState, useEffect, useRef } from 'react';
import Icon from '../icon/icon';
import pulsatorBackgroundStyles from './styles';

const useStyles = makeStyles(pulsatorBackgroundStyles);

const PulsatorBackground = (props) => {
    const [activeDot, setActive] = useState([2, 4]);
    const [nextDot, setNext] = useState([2, 15]);
    // const [iconIndex, setIconIndex] = useState(0);
    const [side, setSide] = useState(true); // to determine the direction of the next dot
    const [direction, setDirection] = useState([true, true]); // index 0 for vertical and index 1 for horizontal direction

    const grid = [10, 18]; // index 0 for rows and index 1 for columns
    const animationSpeed = 2; // in seconds

    const containerRef = useRef();

    const classes = useStyles();

    // Icon coordinates
    const icons = {
        41: <OfflineBoltOutlined />,
        73: <DesktopMacOutlined />,
        24: <Share />,
        215: <Settings />,
        417: <Usb />,
        714: <AccountTree />
    };

    // Returns a randon number in a range excluding a provided number
    const getRandomNumber = (range, previous) => {
        let num = parseInt(Math.random() * range);
        while (num === previous || num === previous - 1 || num === previous + 1) {
            num = parseInt(Math.random() * range);
        }
        return num;
    };

    // Returns percentage value gor a given number and total
    const getPercentage = (num, total) => {
        return (num / total) * 100;
    };

    // Returns the direction in which the animated beams should travel
    const getDirection = (value, previous) => {
        if (!side) {
            if (value < previous) {
                setDirection([true, false]);
                return -getPercentage(previous - value, grid[1]);
            } else {
                setDirection([true, true]);
                return getPercentage(value - previous, grid[1]) - 5;
            }
        } else {
            if (value < previous) {
                setDirection([false, true]);
                return -getPercentage(previous - value, grid[0]);
            } else {
                setDirection([true, true]);
                return getPercentage(value - previous, grid[0]) - 5;
            }
        }
    };

    useEffect(() => {
        // Setting the CSS variables on initial load
        containerRef.current.style.setProperty('--left', '0vw');
        containerRef.current.style.setProperty('--right', '50vw');
        containerRef.current.style.setProperty('--up', '0vw');
        containerRef.current.style.setProperty('--down', '80vh');
        containerRef.current.style.setProperty('--animation-duration', animationSpeed + 's');
        containerRef.current.style.setProperty(
            '--color',
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'rgba(255, 255, 255,0.2)'
                : 'rgba(0,0,0,0.2)'
        );
        containerRef.current.style.setProperty(
            '--glass-back',
            localStorage.getItem('codx-products-theme') === 'dark'
                ? '255, 255, 255'
                : '234, 237, 243'
        );
        containerRef.current.style.setProperty(
            '--dot-color',
            props.theme.palette.primary.contrastText
        );
        containerRef.current.style.setProperty(
            '--background-color',
            props.theme.palette.primary.dark
        );
        containerRef.current.style.setProperty('--grid-x', grid[1]);
        containerRef.current.style.setProperty('--grid-y', grid[0]);
    }, []);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            const i = side ? getRandomNumber(grid[0], nextDot[0]) : nextDot[0];
            const j = !side ? getRandomNumber(grid[1], nextDot[1]) : nextDot[1];
            let horizontal;
            let vertical;
            if (side) {
                vertical = getDirection(i, nextDot[0]);
                horizontal = 100 - getPercentage(nextDot[1], grid[1]) - 5;
                // If direction is Up
                if (vertical <= 0) {
                    containerRef.current.style.setProperty('--up', vertical + 'vh');
                    containerRef.current.style.setProperty('--right', horizontal + 'vw');
                }
                // If direction is down
                else {
                    containerRef.current.style.setProperty('--down', vertical + 'vh');
                    containerRef.current.style.setProperty('--right', horizontal + 'vw');
                }
            } else {
                horizontal = getDirection(j, nextDot[1]);
                vertical = 100 - getPercentage(nextDot[0], grid[0]) - 15;
                // If direction is left
                if (horizontal <= 0) {
                    containerRef.current.style.setProperty('--down', vertical + 'vh');
                    containerRef.current.style.setProperty('--left', horizontal + 'vw');
                }
                // If direction is right
                else {
                    containerRef.current.style.setProperty('--down', vertical + 'vh');
                    containerRef.current.style.setProperty('--right', horizontal + 'vw');
                }
            }

            setSide(!side);
            setNext([i, j]);
            setActive(nextDot);
        }, animationSpeed * 1000);

        return () => clearTimeout(timeOut);
    }, [activeDot]);

    const dots = [...Array(grid[0])].map((e, i) => {
        return (
            <React.Fragment key={'row' + i}>
                {[...Array(grid[1])].map((e, j) => {
                    const className1 = classes.dots;
                    // Adding glow class to the active dot
                    const className2 = activeDot.join('') === i + '' + j ? classes.glow : '';
                    // Adding next class to the next dot
                    const className3 = nextDot.join('') === i + '' + j ? classes.next : '';
                    const className4 = Object.keys(icons).includes(i + '' + j) ? classes.noDot : '';
                    return (
                        <span
                            className={
                                className1 + ' ' + className2 + ' ' + className3 + ' ' + className4
                            }
                            key={i + '' + j}
                            id={i + '' + j}
                        >
                            {Object.keys(icons).includes(i + '' + j) && (
                                <Icon>{icons[i + '' + j]}</Icon>
                            )}

                            {/* Adding CSS classes based on the direction of the beam */}
                            {direction[0] && (
                                <div
                                    className={`${classes.beam} ${
                                        i !== grid[0] - 1 && classes.beamVerticalDown
                                    }`}
                                ></div>
                            )}
                            {direction[1] && (
                                <div
                                    className={`${classes.beam} ${
                                        j !== grid[1] - 1 && classes.beamHorizontalRight
                                    }`}
                                ></div>
                            )}
                            {!direction[0] && (
                                <div
                                    className={`${classes.beam} ${
                                        i !== 0 && classes.beamVerticalUp
                                    }`}
                                ></div>
                            )}
                            {!direction[1] && (
                                <div
                                    className={`${classes.beam} ${
                                        j !== 0 && classes.beamHorizontalLeft
                                    }`}
                                ></div>
                            )}
                        </span>
                    );
                })}
            </React.Fragment>
        );
    });

    return (
        <div className={classes.container} ref={containerRef}>
            <div className={classes.background}>{dots}</div>
        </div>
    );
};

export default withTheme(PulsatorBackground);
