import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    icon: {
        width: '50px',
        height: '50px',
        background:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'linear-gradient(137.16deg, rgba(var(--glass-back), 0.15) 13.3%, rgba(var(--glass-back), 0.05) 86.55%, rgba(var(--glass-back), 0.05) 86.55%, rgba(var(--glass-back), 0.05) 86.55%)'
                : 'linear-gradient(to bottom right, rgba(var(--glass-back), 1) 50%, rgba(var(--glass-back), 0.36) 100%)',
        borderRadius: '5px',
        border: '1px solid #979797',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        '& .MuiSvgIcon-root': {
            color: theme.palette.primary.contrastText,
            fontSize: '30px'
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    }
}));

const Icon = (props) => {
    const classes = useStyles();
    return <div className={classes.icon}>{props.children}</div>;
};

export default Icon;
