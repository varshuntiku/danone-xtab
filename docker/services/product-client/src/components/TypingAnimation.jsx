import { alpha, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
    caretBar: {
        animation: `$blink 0.75s step-end infinite`,
        borderLeft: `2px solid ${alpha(theme.palette.text.default, 0.7)}`
        // marginLeft: "0.5em"
    },
    '@keyframes blink': {
        from: {
            borderColor: 'transparent'
        },
        to: {
            borderColor: 'transparent'
        },
        '50%': {
            borderColor: alpha(theme.palette.text.default, 0.7)
        }
    }
}));

export default function TypingAnimation({ text = '', speed = 'medium', enableCaret }) {
    const classes = useStyles();
    const [value, setValue] = useState('');

    useEffect(() => {
        let count = 0;
        let time;
        const setTimer = () => {
            const range = { fast: 21, medium: 101, slow: 151 }[speed] || 101;
            const t = Math.floor(Math.random() * range);
            time = setTimeout(() => {
                const v = text.slice(0, count);
                setValue(v);
                count++;
                if (v != text) {
                    setTimer();
                }
            }, t);
        };
        setTimer();
        return () => {
            setValue('');
            clearTimeout(time);
        };
    }, [text, speed]);

    return (
        <>
            {value}
            {enableCaret ? <span data-testid="caret" className={classes.caretBar} /> : null}
        </>
    );
}
