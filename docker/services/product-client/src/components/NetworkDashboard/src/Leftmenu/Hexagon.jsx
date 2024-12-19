import React from 'react';
import { makeStyles } from '@material-ui/core';
import { DashboardSpecs } from '../../../../assets/data/dashboardSpecs';
import DefaultIcon from '../../../../assets/img/DefaultIcon.svg';
const useStyles = makeStyles((theme) => ({
    f1: {
        color: theme.palette.primary.contrastText,
        fontSize: '1.5rem',
        fontWeight: '720',
        textAlign: 'center'
        // padding: '.5rem'
    },
    f2: {
        color: theme.palette.primary.contrastText,
        fontSize: '1.5rem',
        fontWeight: '310',
        textAlign: 'center',
        position: 'relative',
        top: '-1rem'
    },
    out: {
        position: 'relative',
        width: '13rem',
        height: '11rem',
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
    },
    in: {
        position: 'absolute',
        top: '2px',
        left: '2px',
        right: '2px',
        bottom: '2px',
        backgroundColor: theme.palette.primary.main,
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
            // opacity:"0.5",
            transform: 'scale(0.8)',
            transitionDuration: '.5s'
        }
    },
    icon: {
        height: '50px',
        width: 'auto'
        // backgroundColor:'blue'
    }
}));
export default function Hexagon({ category, setMenu, handleMenu, menu, rootNode }) {
    const classes = useStyles();
    const rootLabel = rootNode[0].label;
    if (category) {
        var color = category.color;
        var icon = DashboardSpecs[category.logo_name];
    }
    const hexagonBackground =
        localStorage.getItem('codx-products-theme') === 'dark' ? '#0C2744' : '#fcfcfc';
    return (
        <>
            <div
                onClick={() => {
                    setMenu(category);
                    handleMenu(category);
                }}
                className={classes.menuhexagon}
                style={{ cursor: 'pointer' }}
            >
                <div
                    className={classes.out}
                    style={{
                        backgroundColor: color,
                        opacity:
                            menu?.label !== rootLabel
                                ? menu?.label === category?.label
                                    ? '0.3'
                                    : '1'
                                : '1'
                    }}
                >
                    <div className={classes.in} style={{ backgroundColor: hexagonBackground }}>
                        <div
                            style={{ opacity: menu?.label === category?.label ? '0.3' : '1' }}
                            className={classes.cont}
                        >
                            {typeof icon === 'string' ? (
                                <img
                                    className={classes.icon}
                                    data-testid="hexagonicon"
                                    src={icon}
                                    alt="icon"
                                />
                            ) : (
                                <img
                                    className={classes.icon}
                                    data-testid="hexagonicon"
                                    src={DefaultIcon}
                                    alt="icon"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <p
                style={{
                    opacity: menu?.label === category?.label ? '0.3' : '1'
                }}
                className={category.label === rootLabel ? classes.f1 : classes.f2}
            >
                {category.label ? category.label : rootLabel}
            </p>
        </>
    );
}
