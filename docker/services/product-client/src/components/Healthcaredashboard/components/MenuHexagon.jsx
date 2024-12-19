import React from 'react';
import { icons } from '../data';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
    f1: {
        color: theme.palette.primary.contrastText,
        fontSize: '1.3rem',
        fontWeight: '500'
    },
    f2: {
        fontSize: '1.1rem',
        fontWeight: '500'
    },
    out: {
        position: 'relative',
        width: '130px',
        height: '110px',
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
    cont: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    menuhexagon: {
        '&:hover': {
            opacity: '0.5'
        }
    }
}));
export default function MenuHexagon({ category, clickedHexagon, setShow, setPosition }) {
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
        <div
            onClick={() => {
                clickedHexagon(category);
                if (setShow) setShow(false);
                setPosition({
                    leftTop: false,
                    leftBottom: false,
                    rightTop: false,
                    rightBottom: false
                });
            }}
            className={classes.menuhexagon}
            style={{ cursor: 'pointer' }}
        >
            <div className={classes.out} style={{ backgroundColor: color }}>
                <div className={classes.in} style={{ backgroundColor: color }}>
                    <div className={classes.cont}>
                        <img src={icon} alt="icon" />
                        <p className={category.name === 'Health care' ? classes.f1 : classes.f2}>
                            {category.name ? category.name : 'Health Care'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
