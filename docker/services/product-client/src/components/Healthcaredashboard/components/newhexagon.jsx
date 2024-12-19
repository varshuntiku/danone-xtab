import React from 'react';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles(() => ({
    out: {
        position: 'relative',
        width: '90px',
        height: '70px',
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
        alignItems: 'center'
    },
    img: {
        height: '55px',
        width: '55px'
    }
}));
export default function Newhexagon({ data, color }) {
    const classes = useStyles();
    return (
        <div>
            <div className={classes.out} style={{ backgroundColor: color }}>
                <div className={classes.in} style={{ backgroundColor: 'white' }}>
                    <div className={classes.cont}>
                        <img src={data} alt="icon" className={classes.img} />
                    </div>
                </div>
            </div>
        </div>
    );
}
