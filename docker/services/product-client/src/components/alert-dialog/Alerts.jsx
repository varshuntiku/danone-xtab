import React, { useState, Fragment } from 'react';
import { Grid, Typography, Button, ListItemIcon } from '@material-ui/core';
import { ReactComponent as AlertListIcon } from '../../assets/img/empty-alert.svg';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteOutlineTwoToneIcon from '@material-ui/icons/DeleteOutlineTwoTone';
import CodxPopupDialog from '../custom/CodxPoupDialog';

const useStyles = makeStyles((theme) => ({
    dialogContentAlert: {
        padding: '1% 5% 1% 5%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    alertContent: {
        justifyContent: 'center'
    },
    fontSize2: {
        fontSize: '2rem'
    },
    fontColor: {
        color: theme.palette.text.default
    },
    alertList: {
        // background: theme.overrides.MuiButton.outlined.backgroundColor,
        marginTop: '0.5rem',
        boxSizing: 'border-box',
        borderRadius: '5px',
        cursor: 'default',
        width: '100%',
        '& .MuiListItem-root': {
            padding: 0,
            '&.Mui-selected': {
                backgroundColor: 'transparent !important'
            }
        },
        '& .MuiListItem-button': {
            marginBottom: '5%',
            textAlign: 'center',
            '& .MuiListItemText-root': {
                margin: 0,
                padding: '1.3rem 1.2rem 1.3rem 1.2rem',
                border: '1px solid ' + theme.palette.text.contrastText,
                backgroundColor: theme.palette.background.modelBackground,
                borderRadius: '3.2rem',
                '&:hover': {
                    backgroundColor: theme.palette.background.hover,
                    border: '1px solid ' + theme.palette.border.buttonOutline
                }
            },
            '&:hover': {
                borderRadius: '3.2rem',
                backgroundColor: 'transparent'
            }
        },
        '& .Mui-selected': {
            '& .MuiListItemText-root': {
                border: '1px solid ' + theme.palette.border.buttonOutline + '!important',
                backgroundColor: theme.palette.background.selected + '!important'
            }
        },
        '& .MuiListItemIcon-root': {
            justifyContent: 'center'
        },
        '& .MuiTouchRipple-root': {
            display: 'none'
        },
        maxHeight: '63.2rem',
        overflowY: 'auto'
    },
    deleteIcon: {
        fontSize: '2.5rem',
        '&.MuiSvgIcon-root': {
            color: theme.palette.icons.indicatorRed
        }
    },
    dialogPaper: {
        width: '30%',
        backdropFilter: 'blur(2rem)',
        borderRadius: 'unset'
    },
    dialogRoot: {
        margin: 0,
        padding: theme.spacing(2),
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        },
        background: theme.palette.background.modelBackground
    },
    dialogTitle: {
        fontSize: theme.spacing(2.5),
        letterSpacing: '1.5px',
        color: theme.palette.text.default,
        opacity: '0.8',
        paddingBottom: '2rem',
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`
    },
    dialogContent: {
        color: theme.palette.text.titleText,
        fontSize: '1.75rem'
    },
    alertsHeading: {
        fontSize: '2rem',
        alignSelf: 'flex-start'
    },
    dialogContentList: {
        padding: '1% 0.5% 1% 5%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    dialogActionSection: {
        '& .MuiButton-outlined': {
            // color: theme.palette.border.buttonOutline + '!important',
            // borderColor: theme.palette.border.buttonOutline + '!important'
        },
        '& .MuiButton-contained': {
            // backgroundColor: theme.palette.border.buttonOutline
        }
    },
    dialogContentSection: {
        padding: '1.6rem'
    }
}));

export default function Alerts(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleListItemClick = (event, index, alert) => {
        props.selectAlert(alert.id);
        props.alertClicked(alert);
    };

    const deleteAlertHandler = () => {
        props.deleteAlert(props.selectedAlertId);
        setOpen(false);
    };

    const dialogActions = (
        <Fragment>
            <Button variant="outlined" onClick={() => setOpen(false)} aria-label="Cancel Delete">
                Cancel
            </Button>
            <Button variant="contained" onClick={deleteAlertHandler} aria-label="Confirm Delete">
                Delete
            </Button>
        </Fragment>
    );

    return (
        <Fragment>
            <Grid
                item
                xs={5}
                className={
                    props.alerts.length === 0
                        ? clsx(classes.dialogContentAlert, classes.alertContent)
                        : classes.dialogContentList
                }
            >
                {props.alerts.length > 0 && (
                    <Typography variant="subtitle1" className={classes.alertsHeading}>
                        List of Created Alerts
                    </Typography>
                )}
                {props.alerts.length === 0 && <AlertListIcon />}
                {props.alerts.length === 0 && (
                    <Typography variant="h5" className={clsx(classes.fontSize2, classes.fontColor)}>
                        Your created alerts will appear here
                    </Typography>
                )}
                {props.alerts.length > 0 && (
                    <>
                        <List className={classes.alertList}>
                            {props.alerts.map((alert, index) => (
                                <ListItem
                                    key={'listItem' + index}
                                    button
                                    selected={props.selectedAlertId === alert.id}
                                    onClick={(event) => handleListItemClick(event, index, alert)}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="h5"
                                                className={clsx(
                                                    classes.fontSize2,
                                                    classes.fontColor
                                                )}
                                            >
                                                {alert.title}
                                            </Typography>
                                        }
                                    />
                                    {props.selectedAlertId === alert.id ? (
                                        <ListItemIcon
                                            aria-label="Delete Alert"
                                            onClick={() => setOpen(true)}
                                        >
                                            <DeleteOutlineTwoToneIcon
                                                fontSize="large"
                                                className={classes.deleteIcon}
                                            />
                                        </ListItemIcon>
                                    ) : (
                                        <ListItemIcon />
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
            </Grid>
            <CodxPopupDialog
                open={open}
                setOpen={setOpen}
                dialogTitle="Delete Alert"
                dialogContent="Are you sure you want to delete this alert?"
                dialogActions={dialogActions}
                maxWidth="xs"
                dialogClasses={classes}
            />
        </Fragment>
    );
}
