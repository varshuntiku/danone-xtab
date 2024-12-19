import React from 'react';
import { Grid, makeStyles, Typography, Box } from '@material-ui/core';
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
import moment from 'moment';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    block: {
        borderRadius: '8px',
        height: '56px',
        border: '1px solid ' + theme.palette.primary.contrastText,
        position: 'relative'
    },

    unusedBlocks: {
        border: '1px solid rgba(151, 151, 151, 0.4)'
    },

    emptyBlock: {
        height: '56px'
    },

    date: {
        position: 'relative',
        left: '10px',
        top: '5px',
        color: theme.palette.text.default,
        fontSize: '1.5rem'
    },

    unusedDate: {
        color: 'rgba(151, 151, 151, 0.4)'
    },

    value: {
        position: 'absolute',
        right: '10px',
        bottom: '5px',
        color: theme.palette.text.default,
        '& span': {
            fontSize: '2rem'
        },
        '& .price': {
            paddingLeft: '5px'
        }
    },

    arrows: {
        position: 'relative',
        right: '21px',
        top: '21px'
    },

    colorRedArrow: {
        fill: theme.palette.error.main,
        fontSize: '3rem'
    },

    colorGreenArrow: {
        fill: theme.palette.success.main,
        fontSize: '3rem'
    }
}));

const CalendarBlock = (props) => {
    const { blocks, unused } = props;
    const classes = useStyles();
    const dateContext = blocks && moment(blocks.date);
    const date = dateContext && dateContext.format('DD');

    return (
        <>
            {blocks ? (
                <Grid
                    container
                    key={blocks.date}
                    className={unused ? clsx(classes.block, classes.unusedBlocks) : classes.block}
                    style={{ background: blocks.colorscale }}
                >
                    <Typography
                        className={unused ? clsx(classes.date, classes.unusedDate) : classes.date}
                        variant="body1"
                    >
                        {date}
                    </Typography>
                    {blocks.value && (
                        <Box className={classes.value}>
                            <Box className={classes.arrows}>
                                {blocks.extra_dir === 'down' && (
                                    <ArrowDownward
                                        className={
                                            blocks.alt_behaviour
                                                ? classes.colorGreenArrow
                                                : classes.colorRedArrow
                                        }
                                    />
                                )}
                                {blocks.extra_dir === 'up' && (
                                    <ArrowUpward
                                        className={
                                            blocks.alt_behaviour
                                                ? classes.colorRedArrow
                                                : classes.colorGreenArrow
                                        }
                                    />
                                )}
                            </Box>
                            <Typography variant="body1">
                                <span>{blocks.prefix || ' '}</span>
                                <span className="price">{blocks.value}</span>
                                <span>{blocks.suffix || ' '}</span>
                            </Typography>
                        </Box>
                    )}
                </Grid>
            ) : (
                <Grid container className={classes.emptyBlock} />
            )}
        </>
    );
};

export default CalendarBlock;
