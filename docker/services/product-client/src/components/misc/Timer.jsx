import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
    timer: {
        color: theme.palette.primary.contrastText
    }
}));

const Timer = ({ minutes, onFinish, resetTimer }) => {
    const classes = useStyles();
    const [start, setStart] = useState(Date.now());
    const [time, setTime] = useState({
        minutes: minutes < 60 ? minutes : 59,
        seconds: 0
    });
    const [timerRunning, setTimerRunning] = useState(true);

    useEffect(() => {
        if (resetTimer) {
            setStart(Date.now());
            setTimerRunning(true);
        }
        setTime({
            minutes: minutes < 60 ? minutes : 59,
            seconds: 0
        });
    }, [resetTimer]);

    useEffect(() => {
        let timeout;
        if (timerRunning) {
            timeout = setTimeout(() => {
                const elapsedSeconds = parseInt((Date.now() - start) / 1000); // Seconds since timer started
                const elapsedMinutes = parseInt(elapsedSeconds / 60);
                if (elapsedMinutes === minutes) {
                    onFinish();
                    setTimerRunning(false);
                    setTime({ minutes: 0, seconds: 0 });
                } else {
                    setTime(() => {
                        return {
                            minutes: minutes - elapsedMinutes - 1,
                            seconds: 60 - (elapsedSeconds - elapsedMinutes * 60) - 1
                        };
                    });
                }
            }, 1000);
        }
        return () => clearTimeout(timeout);
    }, [time]);

    return (
        <span className={classes.timer}>
            {`${time.minutes.toString().length === 1 ? '0' : ''}${time.minutes}:${
                time.seconds.toString().length === 1 ? '0' : ''
            }${time.seconds}`}
        </span>
    );
};

export default Timer;
