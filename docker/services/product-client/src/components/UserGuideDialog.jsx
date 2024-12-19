import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    ThemeProvider,
    TextField,
    MenuItem,
    FormControl,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import { textCompTheme } from './dynamic-form/inputFields/textInput';
import { selectCompTheme } from './dynamic-form/inputFields/select';
import CodxPopupDialog from './custom/CodxPoupDialog';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { ReactComponent as GuideListIcon } from '../assets/img/empty-alert.svg';
import { saveScreenUserGuide, getScreenUserGuide, updateScreenUserGuide } from 'services/screen.js';
import DeleteOutlineTwoToneIcon from '@material-ui/icons/DeleteOutlineTwoTone';

const dialogStyles = makeStyles((theme) => ({
    dialogPaper: {
        background: theme.palette.background.dialogBody,
        backdropFilter: 'blur(2rem)',
        border: '1px solid ' + theme.palette.border.dialogBorder
    },
    dialogRoot: {
        margin: 0,
        padding: '1rem 1rem 1rem 3.1rem',
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        },
        background: theme.palette.background.dialogTitle,
        display: 'flex',
        justifyContent: 'space-between'
    },
    dialogTitle: {
        fontSize: '2.2rem',
        letterSpacing: '0.2rem',
        color: theme.palette.text.titleText,
        opacity: '0.8',
        alignSelf: 'center'
    },
    dialogContentSection: {
        '&.MuiDialogContent-dividers': {
            borderBottomColor: theme.palette.border.colorWithOpacity
        },
        padding: 0,
        overflow: 'hidden'
    },
    dialogContent: {
        color: theme.palette.text.titleText,
        fontSize: '1.75rem',
        marginBottom: 0
    },
    closeIcon: {
        '&.MuiSvgIcon-root': {
            color: theme.palette.text.titleText
        }
    },
    dialogActionSection: {
        '& .MuiButton-outlined': {
            color: theme.palette.border.buttonOutline + '!important',
            borderColor: theme.palette.border.buttonOutline + '!important'
        },
        '& .MuiButton-contained': {
            backgroundColor: theme.palette.border.buttonOutline
        }
    },
    dialogFormStyle: {
        borderRight: '1px solid ' + theme.palette.border.colorWithOpacity
    },
    dialogContentForm: {
        padding: '1% 5% 1% 5%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    dialogContentList: {
        padding: '1% 0.5% 1% 5%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    }
}));

const useStyles = makeStyles((theme) => ({
    formTitle: {
        padding: '2% 5% 1% 4%',
        borderBottom: '1px solid ' + theme.palette.border.colorWithOpacity
    },
    screenName: {
        fontSize: '2rem',
        marginBottom: '1%',
        color: theme.palette.text.default,
        fontWeight: 500
    },
    formBody: {
        padding: '2% 5% 1% 4%'
    },
    formHeading: {
        fontSize: '2rem',
        color: theme.palette.text.default,
        marginBottom: '1.5rem',
        fontWeight: 600
    },
    backButton: {
        border: 'none',
        color: theme.palette.text.default,
        textTransform: 'none',
        marginBottom: '2rem',
        fontSize: '1.5rem',
        letterSpacing: '0.1rem',
        '&:hover': {
            color: theme.palette.text.default,
            border: 'none',
            backgroundColor: 'transparent',
            opacity: 1
        }
    },
    backIcon: {
        color: theme.palette.border.buttonOutline
    },
    formFonts: {
        fontSize: '1.7rem',
        letterSpacing: '0.07rem',
        fontWeight: 'normal',
        color: theme.palette.text.default
    },
    formInput: {
        padding: '1.5rem 1rem',
        background: theme.palette.background.dialogInput
    },
    formInputUnderline: {
        '&::before': {
            borderColor: theme.palette.border.light
        },
        '&::after': {
            borderColor: theme.palette.border.buttonOutline
        }
    },
    selectFocus: {
        '&:focus': {
            backgroundColor: theme.palette.background.dialogInput
        }
    },

    deleteIcon: {
        fontSize: '2.5rem',
        color: 'red'
    },
    existingGuidesHeading: {
        fontSize: '2rem',
        alignSelf: 'flex-start',
        marginLeft: '18%'
    },
    existingGuidesList: {
        marginTop: '0.5rem',
        boxSizing: 'border-box',
        borderRadius: '1px',
        cursor: 'default',
        width: '70%',
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
                border: '1px solid ' + theme.palette.border.chip,
                backgroundColor: theme.palette.background.chip,
                borderRadius: '3.2rem',
                '&:hover': {
                    backgroundColor: theme.palette.background.dialogInput,
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
                border: '2px solid ' + theme.palette.border.buttonOutline + '!important',
                backgroundColor: theme.palette.background.dialogInput + '!important'
            }
        },
        '& .MuiListItemIcon-root': {
            justifyContent: 'center'
        }
    }
}));

const UserGuideDialog = (props) => {
    const [open, setOpen] = useState(true);
    const [guideSelected, setGuideSelected] = useState(false);
    const [userGuideName, setGuideName] = useState('');
    const [userGuideType, setGuideType] = useState('pdf');
    const [userGuideURL, setGuideURL] = useState('');
    const [notification, setNotification] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [existingGuides, setExistingGuides] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [updateGuideList, setUpdateGuideList] = useState('');
    const dialogClasses = dialogStyles();
    const classes = useStyles();

    useEffect(() => {
        getScreenUserGuide({
            app_id: props.app_id,
            screen_id: props.screen_id,
            callback: onResponseGetGuide
        });
    }, [updateGuideList]);

    const handleClickCloseNotification = () => {
        setNotificationOpen(false);
    };

    const handleClickClose = () => {
        setGuideSelected(false);
        setGuideName('');
        setGuideType('pdf');
        setGuideURL('');
    };

    const deletePopUp = () => {
        setDeleteDialogOpen(true);
    };

    const deletePopUpClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleListItemClick = (event, index) => {
        setGuideSelected(index);
        setGuideName(existingGuides[index].guide_name);
        setGuideType(existingGuides[index].guide_type);
        setGuideURL(existingGuides[index].guide_url);
    };

    const onFieldChange = (field_id, field_value) => {
        if (field_id === 'userGuideName') {
            setGuideName(field_value);
        }
        if (field_id === 'userGuideType') {
            setGuideType(field_value);
        }
        if (field_id === 'userGuideURL') {
            setGuideURL(field_value);
        }
    };

    const validateURL = (guideURL, guideType) => {
        let validURL = false;
        try {
            const url = new URL(guideURL);
            let pathname = url.pathname.toLowerCase();
            if (
                (url.protocol === 'http:' || url.protocol === 'https:') &&
                url.host !== '' &&
                !url.pathname.startsWith('/.')
            ) {
                if (guideType === 'pdf' && pathname.endsWith('.pdf')) {
                    validURL = true;
                } else if (
                    guideType === 'word' &&
                    (pathname.endsWith('.doc') || pathname.endsWith('.docx'))
                ) {
                    validURL = true;
                } else if (
                    guideType === 'video' &&
                    (pathname.endsWith('.mp4') ||
                        pathname.endsWith('.webm') ||
                        pathname.endsWith('.ogg'))
                ) {
                    validURL = true;
                } else throw Error('URL and type mismatch');
            } else throw Error('invalid');
        } catch (_) {
            validURL = false;
        }
        return validURL;
    };

    const onClickSaveGuide = () => {
        if (userGuideName.length === 0 || userGuideType.length === 0 || userGuideURL.length === 0) {
            setNotificationOpen(true);
            setNotification({
                message: 'Please fill all fields !',
                severity: 'error'
            });
        } else {
            let validURL = validateURL(userGuideURL, userGuideType);
            if (validURL) {
                saveScreenUserGuide({
                    app_id: props.app_id,
                    screen_id: props.screen_id,
                    payload: {
                        guide_name: userGuideName,
                        guide_type: userGuideType,
                        guide_url: userGuideURL
                    },
                    callback: onResponseGuideSave
                });
            } else {
                setNotificationOpen(true);
                setNotification({
                    message: 'Please enter valid URL !',
                    severity: 'error'
                });
            }
        }
    };

    const onResponseGetGuide = (response_data) => {
        if (response_data.data.length !== 0) {
            setExistingGuides(response_data.data);
        }
    };

    const onResponseGuideSave = (response_data) => {
        if (response_data.status === 'success') {
            setNotificationOpen(true);
            setNotification({
                message: 'Guide saved successfully !'
            });
            setUpdateGuideList(userGuideURL);
            setGuideName('');
            setGuideType('pdf');
            setGuideURL('');
        } else {
            setNotificationOpen(true);
            setNotification({
                message: 'Guide could not be saved !',
                severity: 'error'
            });
        }
    };

    const deleteGuide = () => {
        let currentGuides = existingGuides;
        currentGuides.splice(guideSelected, 1);
        setExistingGuides(currentGuides);
        deletePopUpClose();
        updateScreenUserGuide({
            app_id: props.app_id,
            screen_id: props.screen_id,
            payload: {
                data: existingGuides
            },
            callback: onResponseDeleteGuide
        });
    };

    const editGuideSubmit = () => {
        let currentGuides = existingGuides;
        if (userGuideName.length > 0 && validateURL(userGuideURL, userGuideType)) {
            currentGuides[guideSelected].guide_name = userGuideName;
            currentGuides[guideSelected].guide_type = userGuideType;
            currentGuides[guideSelected].guide_url = userGuideURL;
            setExistingGuides(currentGuides);
            updateScreenUserGuide({
                app_id: props.app_id,
                screen_id: props.screen_id,
                payload: {
                    data: existingGuides
                },
                callback: onResponseManageGuideSave
            });
        } else if (userGuideName.length === 0) {
            setNotificationOpen(true);
            setNotification({
                message: 'Please add Guide Name !',
                severity: 'error'
            });
        } else {
            setNotificationOpen(true);
            setNotification({
                message: 'Invalid Guide URL',
                severity: 'error'
            });
        }
    };

    const onResponseManageGuideSave = (response_data) => {
        if (response_data.status === 'success') {
            setNotificationOpen(true);
            setNotification({
                message: 'Guides saved successfully !'
            });
            setGuideName('');
            setGuideType('pdf');
            setGuideURL('');
            setGuideSelected(false);
        } else {
            setNotificationOpen(true);
            setNotification({
                message: 'Error saving Guides !',
                severity: 'error'
            });
        }
    };

    const onResponseDeleteGuide = (response_data) => {
        if (response_data.status === 'success') {
            setNotificationOpen(true);
            setNotification({
                message: 'Guide Deleted successfully !'
            });
            setGuideName('');
            setGuideType('pdf');
            setGuideURL('');
            setGuideSelected(false);
        } else {
            setNotificationOpen(true);
            setNotification({
                message: 'Error deleting Guides !',
                severity: 'error'
            });
        }
    };

    const guideDialogActions = (
        <React.Fragment>
            <Button variant="outlined" onClick={props.onCloseGuide}>
                Cancel
            </Button>
            <Button
                aria-label="Create User Guide"
                variant="contained"
                fontWeight="1000"
                onClick={guideSelected || guideSelected === 0 ? editGuideSubmit : onClickSaveGuide}
            >
                {guideSelected || guideSelected === 0 ? 'Update Guide' : 'Create Guide'}
            </Button>
        </React.Fragment>
    );

    const guideDialogContent = (
        <React.Fragment>
            <Grid container spacing={0} className="grids">
                <Grid item xs={7} className={dialogClasses.dialogFormStyle}>
                    <div className={classes.formTitle}>
                        <Typography variant="subtitle1" className={classes.screenName}>
                            {props.screen_name}
                        </Typography>
                    </div>
                    <div className={classes.formBody}>
                        {(guideSelected || guideSelected === 0) && (
                            <Button
                                variant="outlined"
                                className={classes.backButton}
                                startIcon={
                                    <ArrowBackIosIcon
                                        fontSize="small"
                                        className={classes.backIcon}
                                    />
                                }
                                onClick={handleClickClose}
                            >
                                Back to Create User Guide
                            </Button>
                        )}
                        <Typography variant="subtitle1" className={classes.formHeading}>
                            {guideSelected || guideSelected === 0 ? 'EDIT GUIDE' : 'CREATE GUIDE'}
                        </Typography>

                        <Grid container spacing={5}>
                            <Grid item xs={4} style={{ alignSelf: 'center' }}>
                                <Typography variant="subtitle2" className={classes.formFonts}>
                                    Guide Name
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <ThemeProvider theme={textCompTheme}>
                                    <TextField
                                        variant="filled"
                                        fullWidth
                                        className={classes.formFonts}
                                        value={userGuideName}
                                        onChange={(event) =>
                                            onFieldChange('userGuideName', event.target.value)
                                        }
                                        InputProps={{
                                            classes: {
                                                input: classes.formInput,
                                                underline: classes.formInputUnderline
                                            }
                                        }}
                                        id={userGuideName || 'user guide name'}
                                    />
                                </ThemeProvider>
                            </Grid>
                        </Grid>

                        <Grid container spacing={5}>
                            <Grid item xs={4} style={{ alignSelf: 'center' }}>
                                <Typography variant="subtitle2" className={classes.formFonts}>
                                    Guide Type
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <ThemeProvider theme={selectCompTheme}>
                                    <FormControl fullWidth>
                                        <TextField
                                            className={classes.formFonts}
                                            name="guideType"
                                            value={userGuideType ? userGuideType : 'pdf'}
                                            onChange={(event) =>
                                                onFieldChange('userGuideType', event.target.value)
                                            }
                                            variant="filled"
                                            select
                                            fullWidth
                                            size="small"
                                            InputProps={{
                                                classes: {
                                                    input: classes.formInput
                                                }
                                            }}
                                            SelectProps={{
                                                classes: { select: classes.selectFocus }
                                            }}
                                            id={userGuideType || 'pdf'}
                                        >
                                            <MenuItem value={'pdf'}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    PDF
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={'word'}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    Word Document
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={'video'}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    Video
                                                </Typography>
                                            </MenuItem>
                                        </TextField>
                                    </FormControl>
                                </ThemeProvider>
                            </Grid>
                        </Grid>
                        <Grid container spacing={5}>
                            <Grid item xs={4} style={{ alignSelf: 'center' }}>
                                <Typography variant="subtitle2" className={classes.formFonts}>
                                    Guide URL
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <ThemeProvider theme={textCompTheme}>
                                    <TextField
                                        variant="filled"
                                        fullWidth
                                        className={classes.formFonts}
                                        value={userGuideURL}
                                        onChange={(event) =>
                                            onFieldChange('userGuideURL', event.target.value)
                                        }
                                        InputProps={{
                                            classes: {
                                                input: classes.formInput,
                                                underline: classes.formInputUnderline
                                            }
                                        }}
                                        id={userGuideURL || 'user guide url'}
                                    />
                                </ThemeProvider>
                            </Grid>
                        </Grid>
                        <br />
                    </div>
                </Grid>
                <Grid
                    item
                    xs={5}
                    className={
                        existingGuides === ''
                            ? dialogClasses.dialogContentForm
                            : dialogClasses.dialogContentList
                    }
                >
                    {existingGuides === '' && (
                        <>
                            <GuideListIcon />
                            <Typography variant="h5" className={classes.formFonts}>
                                Your created Guides will appear here
                            </Typography>
                        </>
                    )}
                    {existingGuides !== '' && (
                        <>
                            <Typography
                                variant="subtitle1"
                                className={classes.existingGuidesHeading}
                            >
                                List of Existing Guides
                            </Typography>
                            <List className={classes.existingGuidesList}>
                                {existingGuides.map((guide, index) => (
                                    <ListItem
                                        button
                                        key={index}
                                        selected={guideSelected === index}
                                        onClick={(event) =>
                                            handleListItemClick(event, index, guide)
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="h5"
                                                    className={classes.formFonts}
                                                >
                                                    {guide.guide_name}
                                                </Typography>
                                            }
                                        />
                                        {guideSelected === index ? (
                                            <ListItemIcon
                                                aria-label="Delete Guide"
                                                data-testid="Delete-guide"
                                                onClick={deletePopUp}
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
            </Grid>
            <CodxPopupDialog
                open={deleteDialogOpen}
                setOpen={setDeleteDialogOpen}
                dialogTitle="Delete User Guide"
                dialogContent="Are you sure you want to delete this Guide?"
                dialogActions={
                    <React.Fragment>
                        <Button
                            variant="outlined"
                            onClick={deletePopUpClose}
                            aria-label="Cancel Delete"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={deleteGuide}
                            aria-label="Confirm Delete"
                        >
                            Delete
                        </Button>
                    </React.Fragment>
                }
                maxWidth="xs"
                dialogClasses={classes}
            />
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <CodxPopupDialog
                open={open}
                setOpen={setOpen}
                onClose={props.onCloseGuide}
                dialogTitle="Manage User Guide"
                dialogContent={guideDialogContent}
                dialogActions={guideDialogActions}
                maxWidth="md"
                sectionDivider={true}
                dialogClasses={dialogClasses}
                reason="backdropClick"
            />
            <CustomSnackbar
                key="user-guide-notification-container"
                open={notificationOpen && notification?.message ? true : false}
                autoHideDuration={
                    notification?.autoHideDuration === undefined
                        ? 3000
                        : notification?.autoHideDuration
                }
                onClose={handleClickCloseNotification}
                severity={notification?.severity || 'success'}
                message={notification?.message}
            />
        </React.Fragment>
    );
};

export default UserGuideDialog;
