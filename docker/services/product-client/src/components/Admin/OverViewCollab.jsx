import { Typography } from '@material-ui/core';
import CustomSwitch from '../dynamic-form/inputFields/CustomSwitch';
import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        width: 'full',
        background: theme.palette.background.tableSelcted,
        height: theme.layoutSpacing(56),
        marginBottom: theme.layoutSpacing(20),
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)'
    },
    customSelector: {
        marginLeft: '2rem'
    },
    label: {
        color: theme.palette.text.revamp,
        fontSize: '1.44rem',
        fontFamily: theme.body.B1.fontFamily,
        letterSpacing: 0,
        lineHeight: 'normal',
        marginLeft: '1.5rem',
        fontWeight: '500'
    }
}));
const OverViewCollab = ({ onChange, params }) => {
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <Typography className={classes.label}>Collaboration on App Configurator </Typography>
            <CustomSwitch
                onChange={onChange}
                params={{ ...params, customSelector: classes.customSelector }}
            />
        </div>
    );
};

export default OverViewCollab;
