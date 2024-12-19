import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import infPopupStyles from './InfoPopupStyles';
import { Tooltip } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
const InfoPoup = (props) => {
    const { classes, children } = props;
    const renderIcon = () => {
        return (
            <Tooltip
                classes={{ tooltip: classes.toolTip }}
                title={
                    <div>
                        {children ? (
                            children
                        ) : (
                            <Typography className={classes.contentTextNoTitle}>
                                {'Oops!, info missing'}
                            </Typography>
                        )}
                    </div>
                }
                placement="bottom"
                interactive
            >
                <div className={clsx(classes.iconContainer)}>
                    <IconButton className={classes.iconButton} size="small" aria-label={'Label'}>
                        <InfoOutlinedIcon
                            fontSize="small"
                            className={clsx(classes.assumptionsIcon, classes.iconButtonIcon)}
                        />
                    </IconButton>
                </div>
            </Tooltip>
        );
    };

    return <div>{renderIcon()}</div>;
};

export default withStyles(infPopupStyles)(InfoPoup);
