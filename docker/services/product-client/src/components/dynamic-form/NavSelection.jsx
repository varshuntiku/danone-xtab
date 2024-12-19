import React, { useState } from 'react';
import LeftNav from '../../assets/img/Left_Navigation';
import TopNav from '../../assets/img/Top_Navigation';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    nav: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        gap: theme.layoutSpacing(5),
        margin: theme.layoutSpacing(2),
        '& svg': {
            width: '28rem',
            stroke: theme.palette.border.loginGrid
        }
    },
    wrapper: {
        display: 'flex',
        gap: theme.spacing(2),
        maxWidth: '100%',
        overflow: 'hidden'
    },
    main: {
        display: 'flex',
        flexDirection: 'column'
    },
    helperText: {
        fontSize: theme.layoutSpacing(13),
        margin: `${theme.layoutSpacing(2)} 0 0`,
        color: theme.palette.text.error
    },
    labelText: {
        fontSize: theme.layoutSpacing(13),
        lineHeight: theme.layoutSpacing(13),
        color: theme.palette.text.default,
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: '400'
    }
}));
const NavSelection = ({ item, elemntProps, handleValueChange }) => {
    const [selected, setSelected] = useState(item.value);
    const classes = useStyles();

    return (
        <main className={classes.main}>
            <div className={classes.wrapper}>
                <div
                    className={classes.nav}
                    onClick={() => {
                        item.value = false;
                        setSelected(false);
                        handleValueChange(elemntProps);
                    }}
                >
                    <LeftNav selected={selected}></LeftNav>
                    <Typography className={classes.labelText}>Left Navigation</Typography>
                </div>
                <div
                    className={classes.nav}
                    onClick={() => {
                        item.value = true;
                        setSelected(true);
                        handleValueChange(elemntProps);
                    }}
                >
                    <TopNav selected={selected}></TopNav>
                    <Typography className={classes.labelText}>Top Navigation</Typography>
                </div>
            </div>
            {selected === null && (
                <Typography className={classes.helperText}>{elemntProps?.helperText}</Typography>
            )}
        </main>
    );
};

export default NavSelection;
