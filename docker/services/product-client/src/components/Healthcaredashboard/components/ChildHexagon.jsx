import React from 'react';
import { icons } from '../data';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
    f1: {
        fontSize: '1.3rem',
        fontWeight: '500'
    },
    icon: {
        stroke: theme.palette.primary.contrastText
    },
    out: {
        position: 'relative',
        width: '155px',
        height: '134px',
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
    },
    in: {
        position: 'absolute',
        top: '2px',
        left: '2px',
        right: '2px',
        bottom: '2px',
        backgroundColor: '#fff',
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
    },
    hexagonContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    }
}));
export default function ChildHexagon({ category }) {
    const classes = useStyles();
    var color;
    var icon;
    if (category) {
        color = category.color;

        icon = icons[category.name];
    } else {
        color = '#68E1BD';
        icon = icons.health;
    }

    return (
        <div>
            <div className={classes.out} style={{ backgroundColor: color }}>
                <div className={classes.in} style={{ backgroundColor: color }}>
                    <div className={classes.hexagonContainer}>
                        <img className={classes.icon} src={icon} alt="icon" />
                        <p className={classes.f1}>
                            {category.name ? category.name : 'Health Care'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
