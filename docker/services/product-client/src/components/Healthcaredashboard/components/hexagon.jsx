import '../styles.css';
import React from 'react';
import { icons } from '../data';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
    f1: {
        fontSize: '1.3rem',
        fontWeight: '500'
    },
    outside: {
        position: 'relative',
        width: '155px',
        height: '134px',
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
    },
    inside: {
        position: 'absolute',
        top: '2px',
        left: '2px',
        right: '2px',
        bottom: '2px',
        backgroundColor: '#fff',
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    }
}));

export default function Hexagon({ clickedHexagon, category, setShow }) {
    const classes = useStyles();
    const { name } = category;
    var color;
    var icon;
    if (name) {
        if (name === 'health') {
            color = 'white';
        } else {
            color = category.color;
        }

        icon = icons[name];
    } else {
        color = '#68E1BD';
        icon = icons.health;
    }
    return (
        <div
            onClick={() => {
                clickedHexagon(category);
                if (setShow) setShow(false);
            }}
            style={{ cursor: 'pointer' }}
        >
            <div className={classes.outside} style={{ backgroundColor: color }}>
                <div className={classes.inside} style={{ backgroundColor: '#fff' }}>
                    <div className={classes.content}>
                        <img src={icon} alt="icon" />
                        <p className={clsx(classes.f1)}>
                            {category.name ? category.name : 'Health Care'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
