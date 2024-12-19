import { alpha, Button, Grid, IconButton, makeStyles, Menu, MenuItem } from '@material-ui/core';
import MenuThumbIcon from '@material-ui/icons/StopRounded';
import TabThumbIcon from '@material-ui/icons/FiberManualRecordRounded';
import React, { useCallback, useState } from 'react';
import CustomTextField from '../Forms/CustomTextField';
import clsx from 'clsx';
import { ReactComponent as SubMenuThumbIcon } from '../../assets/img/sub-screen.svg';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/Settings';
import { orange } from '@material-ui/core/colors';
import ConfirmPopup from '../confirmPopup/ConfirmPopup';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
    root: {
        overflowY: 'auto',
        height: 'calc(100vh - 22rem)',
        display: 'flex',
        flexDirection: 'column'
    },
    screenItemContainer: {
        // maxHeight: "67vh",
        overflowY: 'auto',
        '&::-webkit-scrollbar-thumb': {
            borderColor: theme.palette.text.default + '99'
        }
    },
    screenItem: {
        padding: '0.75rem',
        border: `1px solid ${alpha(theme.palette.text.default, 0.2)}`,
        borderRight: 0,
        borderLeft: 0,
        opacity: 0.7,
        '& svg': {
            color: theme.palette.text.default,
            fill: theme.palette.text.default
        }
    },
    selectedScreen: {
        background: theme.palette.background.selectedScreen,
        opacity: 1,

        '& $screenLevelIcon svg': {
            color: theme.palette.primary.contrastText,
            fill: theme.palette.primary.contrastText
        },
        '& $screenItemInputRoot .MuiInput-input': {
            color: `${theme.palette.primary.contrastText} !important`
        }
    },
    hiddenScreen: {
        border: `2px solid ${theme.palette.text.default}`,
        opacity: '0.3'
    },
    screenConfigIconContainer: {
        height: '100%',
        display: 'flex',
        alignItems: 'center'
    },
    screenLevelIcon: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    screenItemInputRoot: {
        '& .MuiInput-underline.Mui-disabled:before': {
            borderBottomStyle: 'none'
        },
        '& .MuiInput-underline': {
            '&:hover::before': {
                display: 'block'
            },
            '&::before': {
                display: 'none',
                borderBottomColor: `${alpha(theme.palette.text.default, 0.7)} !important`
            },
            '&.Mui-focused:after': {
                borderBottomColor: theme.palette.text.default
            }
        }
    },
    draggingItem: {
        filter: 'blur(1px)'
    },
    grab: {
        cursor: 'grab'
    },
    noMargin: {
        margin: 0
    },
    screenLevelIconInfoContainer: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        opacity: '0.6',
        paddingTop: '1.5rem'
    },
    screenLevelIconInfo: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.4rem',
        color: theme.palette.text.default,
        // gap: "1rem",
        '& svg': {
            color: theme.palette.primary.contrastText,
            fill: theme.palette.primary.contrastText
        }
    },
    saveBtnContainer: {
        display: 'flex',
        padding: '1rem',
        justifyContent: 'right',
        alignItems: 'flex-start',
        gap: '1rem',
        '& button': {
            minWidth: 'max-content'
        }
    },
    warningMsg: {
        color: orange[500],
        fontSize: '1.2rem',
        '& svg': {
            color: orange[500],
            transform: 'translate(0, 15%)',
            marginRight: '0.5em'
        }
    },
    menuItem: {
        '& .MuiMenu-list': {
            border: `1px ${theme.palette.text.default} solid`
        }
    },
    input: {
        fontSize: theme.layoutSpacing(15),
        fontFamily: theme.body.B5.fontFamily,
        color: theme.palette.text.revamp,
        letterSpacing: theme.layoutSpacing(0.5)
    },
    formControl: {
        '& .MuiInputBase-input.Mui-disabled': {
            opacity: 0.5
        }
    }
}));

export default function ScreensLitView({
    screens,
    valueChanged,
    selectedScreenId,
    screenHierarchySaveInProgress,
    editMode,
    unsavedChangesPresent,
    ...props
}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = useState(false);
    const [draggable, setDraggable] = useState(false);
    const [dragging, setDragging] = useState(null);
    const editDisabled = props.editDisabled;
    const top_navbar = props?.app_info?.modules?.top_navbar;

    const handleClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setOpen(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false);
    };

    const hanldeDragMouseDown = () => {
        if (!editDisabled && editMode) {
            setDraggable(true);
        }
    };
    const handleDragMouseUp = () => {
        if (!editDisabled && editMode) {
            setDraggable(false);
        }
    };
    const handleDragStart = (e, index) => {
        if (!editDisabled && editMode) {
            e.dataTransfer.setData('draggedIndex', index);
            setDragging(index);
        }
    };
    const handleDragOver = (e) => {
        if (!editDisabled && editMode) {
            e.preventDefault();
        }
    };
    const hanldeDrop = (e, dropIndex) => {
        if (!editDisabled && editMode) {
            e.preventDefault();
            const dragIndex = e.dataTransfer.getData('draggedIndex');
            props.onReorderScreen(dragIndex, dropIndex);
            setDragging(null);
        }
    };
    const handleDragEnd = () => {
        if (!editDisabled && editMode) {
            setDraggable(false);
            setDragging(null);
        }
    };

    const checkNoOfStepperScreens = useCallback(
        (screen) => {
            let prevScreen = null;
            for (let index = screen?.screen_index - 1; index >= screen?.screen_index - 6; index--) {
                if (screens[index]?.level !== 3) {
                    prevScreen = screens[index];
                    break;
                }
            }
            return screen?.screen_index - prevScreen?.screen_index < 5;
        },
        [screens]
    );

    return (
        <div className={classes.root}>
            <div className={classes.screenItemContainer}>
                {screens.map(function (screen_config, index) {
                    let screen_layout_class = classes.screenHierarchyItem;
                    let ScreenThumbIcon = MenuThumbIcon;
                    let screen_layout_number = 'auto';
                    if (screen_config['level'] === 1) {
                        screen_layout_number = 2;

                        screen_layout_class = classes.screenHierarchyItemSecond;
                        // eslint-disable-next-line react/display-name
                        ScreenThumbIcon = (p) => (
                            <SubMenuThumbIcon
                                className="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge"
                                {...p}
                            />
                        );
                    } else if (screen_config['level'] === 2) {
                        screen_layout_number = 3;
                        screen_layout_class = classes.screenHierarchyItemThird;
                        // eslint-disable-next-line react/display-name
                        ScreenThumbIcon = (p) => (
                            <TabThumbIcon {...p} viewBox="-3 -3 30 30" fontSize="large" />
                        );
                    } else if (screen_config['level'] === 3) {
                        screen_layout_number = 4;
                        screen_layout_class = classes.screenHierarchyItemThird;
                        // eslint-disable-next-line react/display-name
                        ScreenThumbIcon = (p) => <NavigateNextIcon {...p} fontSize="large" />;
                    }
                    const key = screen_config.id || screen_config._id;
                    const screenSelected = selectedScreenId == key;
                    return (
                        <div
                            key={key}
                            id={'screen-list-item' + key}
                            className={clsx(
                                classes.screenItem,
                                screen_layout_class,
                                screenSelected ? classes.selectedScreen : null,
                                dragging == index ? classes.draggingItem : null,
                                screen_config.hidden ? classes.hiddenScreen : null
                            )}
                            draggable={draggable}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => hanldeDrop(e, index)}
                            onDragEnd={handleDragEnd}
                        >
                            <Grid container spacing={1}>
                                <Grid item xs="auto" alignItems="center">
                                    <IconButton
                                        size="medium"
                                        title="drag"
                                        onMouseDown={hanldeDragMouseDown}
                                        onMouseUp={handleDragMouseUp}
                                        className={clsx(classes.grab, classes.noMargin)}
                                        disabled={editDisabled || !editMode}
                                        aria-label="Drag"
                                    >
                                        <DragIndicatorIcon fontSize="medium" />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={screen_layout_number}>
                                    <div className={classes.screenLevelIcon}>
                                        <ScreenThumbIcon fontSize="large" />
                                    </div>
                                </Grid>
                                <Grid
                                    item
                                    xs={true}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <CustomTextField
                                        parent_obj={{
                                            onHandleFieldChange: props.onHandleFieldChange
                                        }}
                                        field_info={{
                                            key: 'screen_' + index + '_title',
                                            params: {
                                                screen_index: index
                                            },
                                            classes: {
                                                root: classes.screenItemInputRoot,
                                                customScreenRoot: classes
                                            },
                                            fullWidth: true,
                                            value: screen_config['name'],
                                            disabled: editDisabled || !editMode,
                                            variant: 'standard',
                                            inputProps: {
                                                classes: {
                                                    input: classes.input,
                                                    formControl: classes.formControl
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs="auto">
                                    <div className={classes.screenConfigIconContainer}>
                                        {screen_config.id ? (
                                            <ConfirmPopup
                                                onConfirm={() => props.onExpand(index, false)}
                                                disabled={!unsavedChangesPresent}
                                                confirmText="Exit screen"
                                                cancelText="Cancel"
                                                title="Exit screen?"
                                                subTitle={
                                                    <>
                                                        <span>
                                                            You have unsaved changes. If you exit
                                                            the screen all the changes will be lost.
                                                        </span>
                                                        <br />
                                                        <span>Do you wish to continue?</span>
                                                    </>
                                                }
                                            >
                                                {(triggerConfirm) => (
                                                    <IconButton
                                                        disabled={screenSelected}
                                                        className={classes.noMargin}
                                                        onClick={triggerConfirm}
                                                        size="medium"
                                                        title="configure screen"
                                                        aria-label="Configure"
                                                    >
                                                        <SettingsIcon
                                                            color="primary"
                                                            fontSize="medium"
                                                        />
                                                    </IconButton>
                                                )}
                                            </ConfirmPopup>
                                        ) : null}

                                        <IconButton
                                            aria-label="more"
                                            aria-controls="long-menu"
                                            aria-haspopup="true"
                                            onClick={(e) => handleClick(e, index)}
                                            size="medium"
                                            title="more"
                                            className={classes.noMargin}
                                        >
                                            <MoreVertIcon fontSize="medium" />
                                        </IconButton>
                                        <Menu
                                            id="long-menu"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={open === index}
                                            onClose={handleClose}
                                            elevation={0}
                                            className={classes.menuItem}
                                        >
                                            {screen_config['level'] ? (
                                                <MenuItem
                                                    key={'SettoMainScreen'}
                                                    onClick={() => {
                                                        props.onIndentScreen(index, 0);
                                                        handleClose();
                                                    }}
                                                    disabled={editDisabled || !editMode}
                                                >
                                                    Set to Main Screen
                                                </MenuItem>
                                            ) : null}
                                            {screen_config['level'] !== 1 ? (
                                                <MenuItem
                                                    key={'SettoSubScreen'}
                                                    onClick={() => {
                                                        props.onIndentScreen(index, 1);
                                                        handleClose();
                                                    }}
                                                    disabled={editDisabled || !editMode}
                                                >
                                                    Set to Sub Screen
                                                </MenuItem>
                                            ) : null}
                                            {screen_config['level'] !== 2 &&
                                            screens[index + 1]?.level !== 3 &&
                                            !top_navbar ? (
                                                <MenuItem
                                                    key={'SettoTab'}
                                                    onClick={() => {
                                                        props.onIndentScreen(index, 2);
                                                        handleClose();
                                                    }}
                                                    disabled={editDisabled || !editMode}
                                                >
                                                    Set to Tab
                                                </MenuItem>
                                            ) : null}
                                            {screen_config['level'] !== 3 &&
                                            screens[index - 1]?.level !== 2 &&
                                            checkNoOfStepperScreens(screen_config) ? (
                                                <MenuItem
                                                    key={'SettoStepper'}
                                                    onClick={() => {
                                                        props.onIndentScreen(index, 3);
                                                        handleClose();
                                                    }}
                                                    disabled={editDisabled || !editMode}
                                                >
                                                    Set to Screen Stepper
                                                </MenuItem>
                                            ) : null}
                                            <MenuItem
                                                key={'hidden'}
                                                onClick={() => {
                                                    props.onHideScreen(
                                                        index,
                                                        !screen_config.hidden
                                                    );
                                                    handleClose();
                                                }}
                                                disabled={editDisabled || !editMode}
                                            >
                                                {screen_config.hidden
                                                    ? 'Show nav link'
                                                    : 'Hide nav link'}
                                            </MenuItem>
                                            <ConfirmPopup
                                                title={<span>Remove Screen?</span>}
                                                subTitle={
                                                    <>
                                                        Are you sure you want to remove
                                                        <br />
                                                        <em>{screen_config.name}?</em>
                                                    </>
                                                }
                                                cancelText="Cancel"
                                                confirmText="Remove"
                                                onConfirm={() => {
                                                    props.onDeleteScreen(index);
                                                    handleClose();
                                                }}
                                            >
                                                {(triggerConfirm) => (
                                                    <MenuItem
                                                        key={'delete'}
                                                        onClick={triggerConfirm}
                                                        disabled={editDisabled || !editMode}
                                                    >
                                                        Remove Screen
                                                    </MenuItem>
                                                )}
                                            </ConfirmPopup>
                                        </Menu>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    );
                }, this)}
            </div>
            <div className={classes.saveBtnContainer}>
                {screens?.[0]?.level ? (
                    <div className={classes.warningMsg}>
                        <WarningRoundedIcon fontSize="large" />
                        First screen should be Main Screen. End result may not come as expected.
                    </div>
                ) : null}
                <Button
                    variant="contained"
                    onClick={props.onClickScreenSave}
                    size="small"
                    disabled={
                        !valueChanged || screenHierarchySaveInProgress || editDisabled || !editMode
                    }
                    aria-label="Save Screens"
                >
                    Save Screens
                </Button>
            </div>
            <div style={{ flex: 1 }}></div>
            <div className={classes.screenLevelIconInfoContainer}>
                <div className={classes.screenLevelIconInfo}>
                    <MenuThumbIcon fontSize="large" /> Main Screen
                </div>
                <div className={clsx(classes.screenLevelIconInfo)}>
                    <SubMenuThumbIcon className="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge" /> Sub
                    Screen
                </div>
                <div className={classes.screenLevelIconInfo}>
                    <TabThumbIcon fontSize="large" viewBox="-3 -3 30 30" /> Tab
                </div>
                <div className={classes.screenLevelIconInfo}>
                    <NavigateNextIcon fontSize="large" /> Stepper
                </div>
            </div>
        </div>
    );
}
