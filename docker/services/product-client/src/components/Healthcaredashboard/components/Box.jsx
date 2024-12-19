import React from 'react';
import Card from './card';
import { data } from '../data1';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    f1: {
        fontSize: '1.5rem',
        fontWeight: '500',
        color: theme.palette.text.titleText,
        textAlign: 'center'
    },
    table: {
        border: '1px gray solid',
        padding: '3px',
        cursor: 'pointer'
    },
    icon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paading: '3px'
    },
    box: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: 'max-content',
        padding: '5px'
    },
    subfunctions: {
        position: 'relative',
        left: '20px',
        top: '20px'
    }
}));
export default function Box({ functions, subfunctions, setSubfunctions }) {
    const classes = useStyles();
    const handleclick = (val) => {
        const subfunctions = data.filter((el) => el.parent_id === val.id);
        setSubfunctions(() => ({
            functionheading: val.name,
            subfunctions: subfunctions,
            show: true
        }));
    };
    return (
        <div className={classes.box}>
            <div>
                <div className={classes.icon}>
                    <img src={functions.icon} alt="icon" />
                </div>
                {functions.children.map((item) => (
                    <div
                        style={{
                            opacity: subfunctions.functionheading === item.name ? '0.7' : '1'
                        }}
                        className={classes.table}
                        key={item.id}
                        onClick={() => {
                            handleclick(item);
                        }}
                    >
                        <Card color={item.color}>{item.name}</Card>
                    </div>
                ))}
            </div>
            {subfunctions.show && (
                <div className={classes.subfunctions}>
                    <div className={`${classes.f1}`}>{subfunctions.functionheading}</div>
                    {subfunctions.subfunctions.map((item) => (
                        <div className={classes.table} key={item.id}>
                            <Card color={item.color}>{item.name}</Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
