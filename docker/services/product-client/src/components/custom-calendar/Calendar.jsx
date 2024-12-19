import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Box /*, Grid*/, IconButton, makeStyles, Typography } from '@material-ui/core';
import CalendarBlock from './CalendarBlock';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gridGap: '10px',
        color: theme.palette.text.default,
        margin: '10px',
        '& .weekdays': {
            fontSize: '1.5rem',
            paddingLeft: '5px'
        }
    },
    calendarControllerContainer: {
        position: 'relative',
        display: 'flex',
        margin: '10px',
        alignItems: 'center',
        justifyContent: 'center',
        '& .disable': {
            fill: 'rgba(151, 151, 151, 0.4)'
        }
    },
    emptySpace: {
        flexGrow: '1'
    },
    disable: {
        fill: 'rgba(151, 151, 151, 0.4)'
    },
    controllerBlock: {
        margin: '3px',
        '& p': {
            fontSize: '2rem',
            color: theme.palette.primary.contrastText
        }
    }
}));

const Calendar = (props) => {
    const { params } = props;
    const [momentContext, setMomentContext] = useState(moment());
    const [isIncrementMonth, setIsIncrementMonth] = useState(false);
    const [isDecrementMonth, setIsDecrementMonth] = useState(false);
    const classes = useStyles();
    const weekdays = moment.weekdaysShort();
    const firstDayOfMonth = momentContext && momentContext.startOf('month').format('d');
    const lastDayOfMonth = momentContext && moment(momentContext).endOf('month').format('d');
    const lastDateOfMonth =
        momentContext && moment(momentContext).endOf('month').format('YYYY-MM-DD');
    const firstDateOfMonth =
        momentContext && moment(momentContext).startOf('month').format('YYYY-MM-DD');

    const month = momentContext.format('MMM');
    const year = momentContext.format('YY');

    const getEmptyBlocks = (startIndex, endIndex) => {
        let blocks = [];
        for (let i = startIndex; i < endIndex; i++) {
            blocks.push(<CalendarBlock />);
        }
        return blocks;
    };

    const getDaysBlock = (dates, blockType) => {
        let blocks = dates.map((date, i) => {
            if (blockType === 'unused') {
                return <CalendarBlock key={'dates' + i} blocks={date} unused={true} />;
            }
            return <CalendarBlock key={'dates' + i} blocks={date} />;
        });
        return blocks;
    };

    const getDaysBetweenDates = (startDate, endDate) => {
        const now = moment(startDate).clone(),
            dates = [];
        while (now.isSameOrBefore(moment(endDate))) {
            let block = {};
            block.date = now.format('YYYY-MM-DD');
            dates.push(block);
            now.add(1, 'days');
        }
        return dates;
    };

    const allDaysInMonth = () => {
        const startEmptyBlocks = getEmptyBlocks(0, firstDayOfMonth);
        const endEmptyBlocks = getEmptyBlocks(lastDayOfMonth, 6);
        const currentMonthFirstDate =
            params &&
            params.data &&
            [...params.data].find(
                (item) =>
                    month === moment(item.date).format('MMM') &&
                    year === moment(item.date).format('YY')
            )['date'];
        const currentMonthLastDate =
            params &&
            params.data &&
            [...params.data]
                .reverse()
                .find(
                    (item) =>
                        month === moment(item.date).format('MMM') &&
                        year === moment(item.date).format('YY')
                )['date'];
        const currentMonthFirstBeforeDate = moment(currentMonthFirstDate).subtract(1, 'days');
        const startUnusedBlocksData = getDaysBetweenDates(
            firstDateOfMonth,
            currentMonthFirstBeforeDate
        );
        const currentMonthLastAfterDate = moment(currentMonthLastDate).add(1, 'days');
        const endUnusedBlocksData = getDaysBetweenDates(currentMonthLastAfterDate, lastDateOfMonth);
        const startUnusedBlocks =
            params && params.data && getDaysBlock(startUnusedBlocksData, 'unused');
        const endUnusedBlock = params && params.data && getDaysBlock(endUnusedBlocksData, 'unused');
        const currentMonthData =
            params &&
            params.data &&
            params.data.filter(
                (item) =>
                    month === moment(item.date).format('MMM') &&
                    year === moment(item.date).format('YY')
            );
        const daysBlocks = params && params.data && getDaysBlock(currentMonthData);
        const blocks = params &&
            daysBlocks && [
                ...startEmptyBlocks,
                ...startUnusedBlocks,
                ...daysBlocks,
                ...endUnusedBlock,
                ...endEmptyBlocks
            ];

        return blocks;
    };

    const incrementMonth = () => {
        let newMomentContext = { ...momentContext };
        newMomentContext = moment(newMomentContext).add(1, 'month');
        setMomentContext(newMomentContext);
    };

    const decrementMonth = () => {
        let newMomentContext = { ...momentContext };
        newMomentContext = moment(newMomentContext).subtract(1, 'month');
        setMomentContext(newMomentContext);
    };

    useEffect(() => {
        if (params && params.data) {
            let newMomentContext = { ...momentContext };
            newMomentContext = moment(params.data[0].date);
            setMomentContext(newMomentContext);
        }
    }, [params, momentContext]);

    useEffect(() => {
        const getIsMonth = (momentContexts, searchMonthType) => {
            let newMomentContext = { ...momentContexts };
            const isMonthAvailable = params.data.find((item) => {
                let month = moment(item.date).format('MMM');
                let year = moment(item.date).format('YY');
                if (searchMonthType === 'next') {
                    const nextMonth = moment(newMomentContext).add(1, 'month');
                    return (
                        month === moment(nextMonth).format('MMM') &&
                        year === moment(nextMonth).format('YY')
                    );
                } else if (searchMonthType === 'previous') {
                    const previousMonth = moment(newMomentContext).subtract(1, 'month');
                    return (
                        month === moment(previousMonth).format('MMM') &&
                        year === moment(previousMonth).format('YY')
                    );
                }
                return false;
            });
            return isMonthAvailable;
        };

        let newMomentContext = { ...momentContext };
        const isNextMonth = getIsMonth(newMomentContext, 'next');
        const ispreviousMonth = getIsMonth(newMomentContext, 'previous');

        if (isNextMonth) {
            setIsIncrementMonth(true);
        } else {
            setIsIncrementMonth(false);
        }

        if (ispreviousMonth) {
            setIsDecrementMonth(true);
        } else {
            setIsDecrementMonth(false);
        }
    }, [params, momentContext]);

    return (
        <>
            <Box className={classes.calendarControllerContainer}>
                <Box className={classes.emptySpace} />
                <Box className={classes.controllerBlock}>
                    <Typography variant="body1"> {month} </Typography>
                </Box>
                <Box className={classes.controllerBlock}>
                    <Typography variant="body1"> {year} </Typography>
                </Box>
                <Box>
                    <IconButton disabled={!isDecrementMonth} onClick={decrementMonth}>
                        <ArrowBackIos className={!isDecrementMonth ? classes.disable : ''} />
                    </IconButton>
                    <IconButton disabled={!isIncrementMonth} onClick={incrementMonth}>
                        <ArrowForwardIos className={!isIncrementMonth ? classes.disable : ''} />
                    </IconButton>
                </Box>
            </Box>
            <Box className={classes.container} spacing={2}>
                {weekdays &&
                    weekdays.map((day) => {
                        return (
                            <Typography variant="body1" className="weekdays" key={day}>
                                {' '}
                                {day}
                            </Typography>
                        );
                    })}
                {params &&
                    allDaysInMonth().map((block) => {
                        return block;
                    })}
            </Box>
        </>
    );
};

export default Calendar;
