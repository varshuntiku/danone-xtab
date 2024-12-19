import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    text: {
        position: 'relative',
        animation: 'move-text 0.1s forwards',
        bottom: '-1em',
        opacity: 0,
        animationDelay: '0.06s'
    }
}));

export default function TextAnimation(props) {
    const classes = useStyles();
    return (
        <div>
            {props.text.split('').map((item, index) =>
                isNaN(item) ? (
                    <span className={classes.text} key={'text' + index} aria-hidden="true">
                        {item}
                    </span>
                ) : (
                    <span
                        key={'text' + index}
                        className="number"
                        style={{ '--from': 0, '--to': item, '--duration': '2s' }}
                    ></span>
                )
            )}
        </div>
    );
}
