import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import MenuThumbIcon from '@material-ui/icons/StopRounded';
import TabThumbIcon from '@material-ui/icons/FiberManualRecordRounded';
import { ReactComponent as SubMenuThumbIcon } from '../../assets/img/sub-screen.svg';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    screenBreadcrumbItem: {
        display: 'flex',
        alignItems: 'center',
        opacity: '0.5'
    },
    selectedScreenBreadcrumbItem: {
        opacity: '1',
        '& svg': {
            color: theme.palette.primary.contrastText
        }
    },
    screenBreadcrumbItemValue: {
        color: theme.palette.text.default,
        fontSize: '1.5rem'
    },
    screenBreadcrumbSeperator: {
        paddingLeft: '1rem',
        paddingRight: '0.5rem'
    }
}));
export default function ScreenLevelBreadcrumb({ screens = [], screenId }) {
    const classes = useStyles();
    // var found_screen = props.app_info.screens, function (screen) {
    //   return screen.id === parseInt(screenId);
    // });
    let current_first_level = null;
    let current_second_level = null;
    let first_level_breadcrumb = null;
    let second_level_breadcrumb = null;
    let third_level_breadcrumb = null;
    screens.forEach(function (screen) {
        if (!screen.level) {
            current_first_level = screen;
            current_second_level = null;
            if (screen.id === parseInt(screenId)) {
                first_level_breadcrumb = current_first_level?.name;
                second_level_breadcrumb = null;
                third_level_breadcrumb = null;
            }
        } else if (screen.level === 1) {
            current_second_level = screen;
            if (screen.id === parseInt(screenId)) {
                first_level_breadcrumb = current_first_level?.name;
                second_level_breadcrumb = current_second_level?.name;
                third_level_breadcrumb = null;
            }
        } else if (screen.level === 2) {
            if (screen.id === parseInt(screenId)) {
                first_level_breadcrumb = current_first_level?.name;
                second_level_breadcrumb = current_second_level?.name;
                third_level_breadcrumb = screen.name;
            }
        }
    });
    let selected_level = 0;
    if (first_level_breadcrumb && !second_level_breadcrumb && !third_level_breadcrumb) {
        selected_level = 0;
    } else if (first_level_breadcrumb && second_level_breadcrumb && !third_level_breadcrumb) {
        selected_level = 1;
    } else if (first_level_breadcrumb && third_level_breadcrumb) {
        selected_level = 2;
    }
    return (
        <div className={classes.root}>
            {first_level_breadcrumb && (
                <div
                    className={clsx(
                        classes.screenBreadcrumbItem,
                        selected_level === 0 ? classes.selectedScreenBreadcrumbItem : null
                    )}
                >
                    <MenuThumbIcon fontSize="large" />
                    <Typography variant="body1" className={clsx(classes.screenBreadcrumbItemValue)}>
                        {first_level_breadcrumb}
                    </Typography>
                </div>
            )}
            {second_level_breadcrumb && (
                <div className={clsx(classes.screenBreadcrumbItem)}>
                    <Typography
                        variant="body1"
                        className={clsx(
                            classes.screenBreadcrumbItemValue,
                            classes.screenBreadcrumbSeperator
                        )}
                    >
                        /
                    </Typography>
                </div>
            )}
            {second_level_breadcrumb && (
                <div
                    className={clsx(
                        classes.screenBreadcrumbItem,
                        selected_level === 1 ? classes.selectedScreenBreadcrumbItem : null
                    )}
                >
                    <SubMenuThumbIcon className="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge" />
                    <Typography variant="body1" className={clsx(classes.screenBreadcrumbItemValue)}>
                        {second_level_breadcrumb}
                    </Typography>
                </div>
            )}
            {third_level_breadcrumb && (
                <div className={clsx(classes.screenBreadcrumbItem)}>
                    <Typography
                        variant="body1"
                        className={clsx(
                            classes.screenBreadcrumbItemValue,
                            classes.screenBreadcrumbSeperator
                        )}
                    >
                        /
                    </Typography>
                </div>
            )}
            {third_level_breadcrumb && (
                <div
                    className={clsx(
                        classes.screenBreadcrumbItem,
                        selected_level === 2 ? classes.selectedScreenBreadcrumbItem : null
                    )}
                >
                    <TabThumbIcon fontSize="large" viewBox="-3 -3 30 30" />
                    <Typography variant="body1" className={clsx(classes.screenBreadcrumbItemValue)}>
                        {third_level_breadcrumb}
                    </Typography>
                </div>
            )}
        </div>
    );
}
