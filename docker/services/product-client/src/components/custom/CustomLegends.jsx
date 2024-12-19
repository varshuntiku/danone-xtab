import React from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    filterLegends: {
        display: 'flex',
        padding: '0.5rem',
        gap: '1rem',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        alignSelf: 'flex-start'
    },
    verticalAlignment: {
        flexDirection: 'column'
    },
    horizontalAlignment: {
        flexDirection: 'row'
    },
    alignRight: {
        alignSelf: 'flex-end'
    },
    filterLegendsCircle: {
        height: '1.5rem',
        width: '1.5rem',
        backgroundColor: `var(--bgcolor, ${theme.palette.primary.contrastText})`,
        borderRadius: '50%',
        margin: theme.spacing(0, 1.2, 0, 1.2),
        display: 'inline'
    },
    label: {
        color: `var(--label-color, ${theme.palette.text.default})`,
        fontSize: '1.5rem',
        maxWidth: '20rem'
    },
    legendPosition: {
        position: 'absolute',
        zIndex: 999
    },
    legendWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    square: {
        borderRadius: 0
    },
    line: {
        borderRadius: 0,
        border: 'none',
        borderTop: '2px solid',
        borderTopColor: `var(--bgcolor, ${theme.palette.primary.contrastText})`,
        height: '0 !important'
    }
}));

export default function CustomLegends({ legends, alignRight, props }) {
    const { alignment, backgroundColor, textSize, textColor, legendSize, isVertical } = props || {};
    const classes = useStyles();

    if (!legends?.length) {
        return null;
    }

    //Below code transforms position input in form of "top-right" to {top: 0, right: 0} to be added as inline style
    const customAlignment = alignment?.includes('-')
        ? alignment?.split('-').reduce((acc, current, i) => {
              if (current === 'center' || current === 'middle') {
                  const key = i === 0 ? 'top' : 'right';
                  return { ...acc, [key]: '50%' };
              }
              return { ...acc, [current]: 0 };
          }, {})
        : { [alignment]: 0 };

    return (
        <div
            className={clsx(
                classes.filterLegends,
                isVertical ? classes.verticalAlignment : classes.horizontalAlignment,
                alignRight ? classes.alignRight : '',
                alignment ? classes.legendPosition : ''
            )}
            style={{ backgroundColor: backgroundColor || undefined, ...customAlignment }}
        >
            {legends.map((legend, i) => (
                <div className={classes.legendWrapper} key={`${legend.label}_${i}`}>
                    <div
                        className={clsx(
                            classes.filterLegendsCircle,
                            legend.shape ? classes?.[legend?.shape] : ''
                        )}
                        style={{
                            '--bgcolor': legend.color,
                            width: legendSize || undefined,
                            height: legendSize || undefined
                        }}
                    >
                        &nbsp;
                    </div>
                    <span
                        className={classes.label}
                        style={{ fontSize: textSize || undefined, color: textColor || undefined }}
                    >
                        {legend.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

CustomLegends.propTypes = {
    legends: PropTypes.arrayOf(PropTypes.object),
    alignRight: PropTypes.bool,
    props: PropTypes.object
};
