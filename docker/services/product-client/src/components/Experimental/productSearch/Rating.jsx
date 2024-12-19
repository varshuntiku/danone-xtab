import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import StarIcon from '@material-ui/icons/Star';

const useStyles = makeStyles(() => ({
    root: {
        display: 'inline-flex'
    },
    starContainer: {
        position: 'relative',
        width: '2rem',
        height: '2rem'
    },
    star: {
        fontSize: '2.25rem',
        color: '#ccc',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '2.25rem',
        height: '2.25rem'
    },
    filled: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
    },
    fullStar: {
        color: '#00A582',
        fontSize: '2rem',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '2rem',
        height: '2rem'
    },
    starIcon: {
        width: '2rem',
        height: '2rem'
    }
}));

const RatingComponent = ({ value }) => {
    const classes = useStyles();

    const renderStar = (index) => {
        const fillValue = Math.min(Math.max(value - index, 0), 1) * 100;

        return (
            <div key={index} className={classes.starContainer}>
                <StarIcon className={`${classes.star} ${classes.starIcon}`} />
                {fillValue > 0 && (
                    <div className={classes.filled} style={{ width: `${fillValue}%` }}>
                        <StarIcon className={`${classes.fullStar} ${classes.starIcon}`} />
                    </div>
                )}
            </div>
        );
    };

    return <div className={classes.root}>{[...Array(5)].map((_, index) => renderStar(index))}</div>;
};

RatingComponent.propTypes = {
    value: PropTypes.number.isRequired
};

export default RatingComponent;
