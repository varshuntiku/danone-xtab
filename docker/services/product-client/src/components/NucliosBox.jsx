import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const NucliosBox = ({
    spacing = 8,
    hideBorder = [],
    hideSpacing = [],
    wrapperClasses = '',
    ...props
}) => {
    const useStyles = makeStyles((theme) => ({
        boxWrapper: {
            width: '100%',
            paddingTop: hideSpacing.includes('top') ? 'none' : `${theme.layoutSpacing(spacing)}`,
            paddingBottom: hideSpacing.includes('bottom')
                ? 'none'
                : `${theme.layoutSpacing(spacing)}`,
            paddingLeft: hideSpacing.includes('left') ? 'none' : `${theme.layoutSpacing(spacing)}`,
            paddingRight: hideSpacing.includes('right') ? 'none' : `${theme.layoutSpacing(spacing)}`
        },
        box: {
            height: '100%',
            borderBottom: hideBorder.includes('bottom')
                ? 'none'
                : `1px solid ${theme.IndustryDashboard.border.light}`,
            borderTop: hideBorder.includes('top')
                ? 'none'
                : `1px solid ${theme.IndustryDashboard.border.light}`,
            marginBottom: hideSpacing.includes('bottom')
                ? 'none'
                : `-${theme.layoutSpacing(spacing)}`,
            marginTop: hideSpacing.includes('top') ? 'none' : `-${theme.layoutSpacing(spacing)}`,
            paddingBottom: hideSpacing.includes('bottom')
                ? 'none'
                : `${theme.layoutSpacing(spacing)}`,
            paddingTop: hideSpacing.includes('top') ? 'none' : `${theme.layoutSpacing(spacing)}`
        },
        innerBox: {
            height: '100%',
            borderLeft: hideBorder.includes('left')
                ? 'none'
                : `1px solid ${theme.IndustryDashboard.border.light}`,
            borderRight: hideBorder.includes('right')
                ? 'none'
                : `1px solid ${theme.IndustryDashboard.border.light}`,
            marginLeft: hideSpacing.includes('left') ? 'none' : `-${theme.layoutSpacing(spacing)}`,
            marginRight: hideSpacing.includes('right')
                ? 'none'
                : `-${theme.layoutSpacing(spacing)}`,
            paddingLeft: hideSpacing.includes('left') ? 'none' : `${theme.layoutSpacing(spacing)}`,
            paddingRight: hideSpacing.includes('right') ? 'none' : `${theme.layoutSpacing(spacing)}`
        }
    }));
    const classes = useStyles();

    return (
        <div className={`${classes.boxWrapper} ${wrapperClasses}`}>
            <div className={classes.box}>
                <div className={classes.innerBox}>{props.children}</div>
            </div>
        </div>
    );
};

export default NucliosBox;
