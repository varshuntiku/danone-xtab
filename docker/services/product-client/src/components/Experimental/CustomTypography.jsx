import React from 'react';
import Markdown from 'markdown-to-jsx';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
    customContainer: {
        color: theme.palette.text.titleText,
        fontSize: '1.8rem',
        '& td': {
            padding: '16px',
            fontSize: '1.5rem',
            textAlign: 'left',
            fontWeight: '400',
            lineHeight: '1.43',
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            letterSpacing: '0.01071em',
            verticalAlign: 'inherit',
            color: theme.palette.text.titleText
        },
        '& th': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.text.titleText,
            padding: '2rem',
            fontSize: '1.6rem',
            borderBottom: '1px solid rgba(224, 224, 224, 1)'
        },
        '& table': {
            borderCollapse: 'collapse',
            padding: '2rem',
            color: theme.palette.text.contrastText,
            width: '100%'
        },
        '& li': {
            padding: '0.8rem',
            fontSize: '1.8rem'
        },
        '& h1': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.text.titleText,
            padding: '2rem',
            fontSize: '2rem'
        },
        '& p': {
            color: theme.palette.text.titleText,
            padding: '2rem',
            fontSize: '1.8rem'
        }
    }
}));
export default function CustomTypography({ params }) {
    const classes = useStyles();
    return (
        <div className={classes.customContainer}>
            {params ? <Markdown>{params}</Markdown> : null}
        </div>
    );
}
