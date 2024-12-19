import React, { useState, useEffect, Fragment } from 'react';
import {
    Typography,
    TextField,
    MenuItem,
    FormControlLabel,
    Switch,
    Grid,
    ThemeProvider,
    Chip,
    Button
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { textCompTheme } from '../dynamic-form/inputFields/textInput';
import { selectCompTheme } from '../dynamic-form/inputFields/select';
import { getUsers } from '../../services/project';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Close } from '@material-ui/icons';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles((theme) => ({
    dialogContentForm: {
        // background: 'transparent',
        // padding: '1% 5% 1% 5%',
        // height: '78rem'
        height: '70rem',
        borderRight: `1px solid ${theme.palette.border.loginGrid}`
        // borderBottom: '1px solid red',
    },
    switchLabel: {
        // color: theme.palette.border.buttonOutline,
        fontStyle: 'normal',
        fontWeight: 300,
        fontSize: '1.5rem',
        lineHeight: '16px',
        marginLeft: '0.05%',
        marginTop: '1.5%',
        '& .MuiFormControlLabel-label': {
            fontSize: '1.7rem',
            paddingLeft: '0.5rem',
            letterSpacing: '0.05rem'
            // color: theme.palette.border.buttonOutline + '!important'
        },
        '&#receive-notification .MuiSwitch-root span.Mui-checked + span.MuiSwitch-track ': {
            // backgroundColor: theme.palette.border.buttonOutline + '!important'
            border: `none`
        }
    },
    graphBtn: {
        border: 'none',
        color: theme.palette.primary.contrastText
    },
    fontSize1: {
        fontSize: '2rem',
        marginBottom: '1%'
    },
    fontSize2: {
        fontSize: '1.7rem'
    },
    fontSize3: {
        fontSize: '2rem',
        marginTop: '4%',
        marginBottom: '1.5%'
    },
    fontSize4: {
        fontSize: '1.7rem',
        letterSpacing: '0.07rem',
        fontWeight: 'normal'
        // marginTop: "5%"
    },
    fontColor: {
        color: theme.palette.text.default
    },
    cancelBtn: {
        borderRadius: '22px'
    },
    createBtn: {
        borderRadius: '14px'
    },
    notificationBellIcon: {
        color: theme.palette.primary.contrastText,
        marginRight: '0.5%',
        marginLeft: '1.5%'
    },
    notificationLabel: {
        width: '100%',
        color: theme.palette.text.default,
        fontStyle: 'normal',
        fontWeight: 300,
        fontSize: '1.5rem',
        lineHeight: '16px',
        marginLeft: '-1.5%',
        marginTop: '1.5%',
        '& .MuiFormControlLabel-label': {
            fontSize: '1.6rem'
        }
    },
    deleteAlert: {
        display: 'flex',
        flexDirection: 'row-reverse',
        '& .MuiSvgIcon-root': {
            color: theme.palette.primary.contrastText
        }
    },
    errorMessage: {
        color: 'red',
        fontSize: '1.5rem',
        letterSpacing: '1px',
        marginLeft: 0,
        position: 'absolute',
        bottom: '-15px'
    },
    resetButton: {
        color: theme.palette.primary.contrastText,
        '& .MuiTouchRipple-root': {
            display: 'none'
        },
        borderRadius: '22px'
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
        color: theme.palette.primary.contrastText,
        opacity: '0.8'
    },
    /* dialogContent: {
        color: theme.palette.text.titleText,
        fontSize: '1.75rem'
    }, */
    threshold: {
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            '-webkitAppearance': 'none',
            margin: 0
        }
    },
    autoCompleteOption: {
        color: theme.palette.text.default,
        fontSize: '1.75rem',
        '&:hover': {
            background: theme.palette.background.hover + ' !important',
            color: theme.palette.text.default + '!important'
        }
    },
    chip: {
        backgroundColor: theme.palette.background.selected,
        fontSize: '1.8rem',
        color: theme.palette.text.default + ' !important',
        '& span': {
            lineHeight: '3rem'
        },
        '& svg': {
            fill: theme.palette.text.default,
            background: theme.palette.background.modelBackground,
            borderRadius: '50%',
            padding: '3px'
        }
    },
    userListSelect: {
        background: theme.palette.background.modelBackground,
        padding: '0 !important',
        color: theme.palette.text.default + ' !important',
        border: `1px solid ${theme.palette.border.grey}`,
        borderRadius: '3px',
        '&::before': {
            border: 'none !important'
        },
        '&:hover': {
            border: `1px solid ${theme.palette.border.buttonOutline}`
        },
        '&:focus': {
            border: `1px solid ${theme.palette.border.buttonOutline}`
        }
    },

    helperTextRoot: {
        fontSize: '1.3rem',
        letterSpacing: '0.1rem',
        color: theme.palette.text.default,
        fontWeight: 300
    },
    helperTextContained: {
        margin: '0 !important'
    },
    alertDialogTitle: {
        textTransform: 'capitalize',
        fontWeight: 500
    },
    formTitle: {
        padding: '2% 5% 1% 4%',
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`
    },
    formBody: {
        padding: '2% 5% 1% 4%'
    },
    formBodyHeading: {
        marginBottom: '1.5rem',
        fontWeight: 600
    },
    formFontStyle: {
        alignSelf: 'center'
    },
    backButton: {
        border: 'none',
        padding: '1rem',
        color: theme.palette.text.default,
        textTransform: 'none',
        marginBottom: '2rem',
        fontSize: '1.5rem',
        letterSpacing: '0.1rem',
        '&:hover': {
            color: theme.palette.text.default,
            border: 'none ',
            backgroundColor: 'transparent !important',
            opacity: 1
        }
    },
    backIcon: {
        color: theme.palette.border.modelBackground
    },
    inputRoot: {},

    formInput: {
        padding: '1.5rem 1rem',
        background: theme.palette.background.modelBackground
    },

    formControl: {
        margin: theme.spacing(1),
        border: `1px solid ${theme.palette.border.grey}`, // default border color
        borderRadius: '2px',
        '&:hover': {
            borderColor: `${theme.palette.border.buttonOutline}` // hover border color
        },
        '& .Mui-focused': {
            borderColor: `${theme.palette.border.buttonOutline}` // focused border color
        }
    },
    formInputUnderline: {
        '&::before': {
            border: 'none !important'
        },
        '&::after': {
            border: 'none !important'
        }
    },
    formInputBorderless: {
        '&::before': {
            border: 'none !important'
        },
        '&:hover:before': {
            border: 'none !important'
        }
    },
    selectFocus: {
        // '&:focus': {
        //     backgroundColor: theme.palette.background.dialogInput
        // }
    },
    selectedAlertFormInput: {
        padding: '1.5rem 1rem',
        color: theme.palette.primary.contrastText,
        background: theme.palette.background.dialogInput
    },
    helperMessage: {
        fontSize: '1.4rem !important',
        color: theme.palette.text.default + '!important'
    },
    listItemButton: {
        color: theme.palette.border.modelBackground + '!important',
        '&:hover': {
            background: theme.palette.background.hover + ' !important',
            color: theme.palette.text.default + '!important'
        }
    },
    renderTags: {
        maxHeight: '8rem',
        overflowY: 'auto'
    },
    listboxScroll: {}
}));

const NotificationSwitch = withStyles((theme) => ({
    root: {
        width: '5rem',
        height: '1.9rem',
        padding: 0,
        display: 'flex'
    },
    switchBase: {
        padding: '0.1rem',
        // color: '#FFFFFF',
        top: '0.1rem',
        left: '0.1rem',
        borderColor: theme.palette.primary.contrastText,
        '&$checked': {
            transform: 'translateX(2.5rem)',
            // color: theme.palette.border.buttonOutline,
            '& + $track': {
                opacity: 0,
                backgroundColor: theme.palette.border.modelBackground + '!important',
                borderColor: 'white'
            },
            '& .MuiIconButton-label .MuiSwitch-thumb': {
                color: theme.palette.primary.contrastText
            }
        }
    },
    thumb: {
        color: theme.palette.border.modelBackground,
        width: '1.5rem',
        height: '1.5rem',
        boxShadow: 'none'
    },
    track: {
        borderRadius: '2rem',
        opacity: 1,
        // backgroundColor: theme.palette.textColor + '!important',
        backgroundColor: 'transparent !important',
        border: '1px solid ' + theme.palette.border.modelBackground
    },
    checked: {}
}))(Switch);

export default function CreateAlertForm(props) {
    const classes = useStyles();
    const { createAlert, setCreateAlert, isError, setIsError, alertSelected } = props;

    const [userList, setUserList] = useState([]);
    const [userListScroll, setUserListScroll] = useState(false);

    useEffect(() => {
        (async () => {
            const users = await getUsers({
                _end: 10,
                _order: 'ASC',
                _sort: 'name',
                _start: 0
            });
            const updatedUserList = users.filter((user) => {
                return user.email !== props.logged_in_user_info;
            });
            setUserList(updatedUserList);
        })();
    }, []);

    /* handle notification toggle change */
    const handleNotificationChange = () => {
        const updatedAlert = {
            ...createAlert,
            receive_notification: !createAlert.receive_notification
        };
        setCreateAlert(updatedAlert);
    };
    /* form input change handlers */
    const handleInputChange = (event) => {
        formValueUpdate(event.target.name, event.target.value);
        inputErrorUpdate(
            event.target.name,
            event.target.value === '' || event.target.value === ' '
        );
    };

    /* form input update */
    const formValueUpdate = (name, val) => {
        setCreateAlert({
            ...createAlert,
            [name]: val
        });
    };
    /* empty input check */
    const inputErrorUpdate = (name, emptyInput) => {
        setIsError({
            ...isError,
            [name]: emptyInput
        });
    };

    return (
        <Fragment>
            <Grid item xs={7} className={classes.dialogContentForm}>
                {props.widget_name && (
                    <div className={classes.formTitle}>
                        <Typography
                            variant="subtitle1"
                            className={clsx(
                                classes.fontSize1,
                                classes.fontColor,
                                classes.alertDialogTitle
                            )}
                        >
                            {props.widget_name?.toLowerCase()}
                        </Typography>
                    </div>
                )}
                <div className={classes.formBody}>
                    {alertSelected && (
                        <Button
                            variant="text"
                            className={classes.backButton}
                            startIcon={
                                <ArrowBackIosIcon fontSize="xs" className={classes.backIcon} />
                            }
                            onClick={props.resetForm}
                            aria-label="Back to create alert"
                        >
                            Back to Create Alert
                        </Button>
                    )}
                    <Typography
                        variant="subtitle1"
                        className={clsx(
                            classes.fontSize2,
                            classes.fontColor,
                            classes.formBodyHeading
                        )}
                    >
                        {alertSelected ? 'EDIT ALERT' : 'CREATE ALERT'}
                    </Typography>

                    <Grid container spacing={5}>
                        <Grid item xs={4} className={classes.formFontStyle}>
                            <Typography
                                variant="subtitle2"
                                className={clsx(classes.fontSize4, classes.fontColor)}
                            >
                                Alert Name *
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {alertSelected ? (
                                <span className={classes.helperMessage}>Title</span>
                            ) : (
                                ''
                            )}
                            <ThemeProvider theme={textCompTheme}>
                                <FormControl fullWidth className={classes.formControl}>
                                    <TextField
                                        error={isError?.title}
                                        // label={alertSelected ? 'Title' : ''}
                                        placeholder="Title"
                                        variant="filled"
                                        fullWidth
                                        className={clsx(classes.fontSize2, classes.fontColor)}
                                        value={createAlert?.title}
                                        name="title"
                                        onChange={handleInputChange}
                                        helperText={isError?.title ? 'Title is required' : ''}
                                        InputProps={{
                                            classes: {
                                                input: classes.formInput,
                                                underline: classes.formInputUnderline
                                            }
                                        }}
                                        FormHelperTextProps={{
                                            classes: { root: classes.errorMessage }
                                        }}
                                        id="title"
                                    />
                                </FormControl>
                            </ThemeProvider>
                        </Grid>
                    </Grid>

                    <Grid container spacing={5}>
                        <Grid item xs={4} className={classes.formFontStyle}>
                            <Typography
                                variant="subtitle2"
                                className={clsx(classes.fontSize4, classes.fontColor)}
                            >
                                Set Alert Category *
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {alertSelected ? (
                                <span className={classes.helperMessage}>Category</span>
                            ) : (
                                ''
                            )}
                            <ThemeProvider theme={selectCompTheme}>
                                <FormControl fullWidth className={classes.formControl}>
                                    <TextField
                                        error={isError?.category}
                                        //label={alertSelected ? 'Category' : ''}
                                        inputProps={{ 'data-testid': 'category' }}
                                        className={clsx(classes.fontSize2, classes.fontColor)}
                                        value={createAlert?.category}
                                        name="category"
                                        onChange={handleInputChange}
                                        variant="filled"
                                        select
                                        fullWidth
                                        size="small"
                                        style={
                                            createAlert?.category !== ' '
                                                ? { textTransform: 'capitalize' }
                                                : {}
                                        }
                                        helperText={isError?.category ? 'Category is required' : ''}
                                        InputProps={{
                                            classes: {
                                                input: classes.formInput,
                                                underline: classes.formInputUnderline
                                            }
                                        }}
                                        FormHelperTextProps={{
                                            classes: { root: classes.errorMessage }
                                        }}
                                        SelectProps={{ classes: { select: classes.selectFocus } }}
                                        id="category"
                                    >
                                        <MenuItem
                                            ListItemClasses={{ button: classes.listItemButton }}
                                            value={' '}
                                        >
                                            Category: <b> &nbsp;Select</b>{' '}
                                        </MenuItem>
                                        {props.categories?.map((item, index) => (
                                            <MenuItem
                                                ListItemClasses={{ button: classes.listItemButton }}
                                                value={item.id}
                                                key={item.id + index}
                                                style={{ textTransform: 'capitalize' }}
                                            >
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>
                            </ThemeProvider>
                        </Grid>
                    </Grid>

                    <Grid container spacing={5}>
                        <Grid item xs={4} className={classes.formFontStyle}>
                            <Typography
                                variant="subtitle2"
                                className={clsx(classes.fontSize4, classes.fontColor)}
                            >
                                Set Alert Condition *
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            {alertSelected ? (
                                <span className={classes.helperMessage}>Condition</span>
                            ) : (
                                ''
                            )}
                            <ThemeProvider theme={selectCompTheme}>
                                <FormControl fullWidth className={classes.formControl}>
                                    <TextField
                                        error={isError?.condition}
                                        //label={alertSelected ? 'Condition' : ''}
                                        inputProps={{ 'data-testid': 'condition' }}
                                        className={clsx(classes.fontSize2, classes.fontColor)}
                                        value={createAlert?.condition}
                                        name="condition"
                                        onChange={handleInputChange}
                                        variant="filled"
                                        select
                                        fullWidth
                                        size="small"
                                        helperText={
                                            isError?.condition ? 'Condition is required' : ''
                                        }
                                        InputProps={{
                                            classes: {
                                                input: classes.formInput,
                                                underline: classes.formInputUnderline
                                            }
                                        }}
                                        FormHelperTextProps={{
                                            classes: { root: classes.errorMessage }
                                        }}
                                        SelectProps={{ classes: { select: classes.selectFocus } }}
                                        id="condition"
                                    >
                                        <MenuItem
                                            ListItemClasses={{ button: classes.listItemButton }}
                                            value={' '}
                                        >
                                            Condition: <b>&nbsp; Select</b>
                                        </MenuItem>
                                        <MenuItem
                                            ListItemClasses={{ button: classes.listItemButton }}
                                            value={'above'}
                                        >
                                            Above
                                        </MenuItem>
                                        <MenuItem
                                            ListItemClasses={{ button: classes.listItemButton }}
                                            value={'below'}
                                        >
                                            Below
                                        </MenuItem>
                                    </TextField>
                                </FormControl>
                            </ThemeProvider>
                        </Grid>
                        <Grid item xs={4}>
                            {alertSelected ? (
                                <span className={classes.helperMessage}>Threshold</span>
                            ) : (
                                ''
                            )}
                            <ThemeProvider theme={textCompTheme}>
                                <FormControl fullWidth className={classes.formControl}>
                                    <TextField
                                        error={isError?.threshold}
                                        //label={alertSelected ? 'Threshold' : ''}
                                        type="number"
                                        placeholder="Threshold *"
                                        variant="filled"
                                        fullWidth
                                        className={clsx(
                                            classes.fontSize2,
                                            classes.fontColor,
                                            classes.threshold
                                        )}
                                        value={createAlert?.threshold}
                                        name="threshold"
                                        onChange={handleInputChange}
                                        helperText={
                                            isError?.threshold ? 'Threshold is required' : ''
                                        }
                                        InputProps={{
                                            classes: {
                                                input: classes.formInput,
                                                underline: classes.formInputUnderline
                                            }
                                        }}
                                        FormHelperTextProps={{
                                            classes: { root: classes.errorMessage }
                                        }}
                                        id="Threshold"
                                    />
                                </FormControl>
                            </ThemeProvider>
                        </Grid>
                    </Grid>

                    {props.user_admin && (
                        <Grid container spacing={8}>
                            <Grid item xs={4} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Add User(s)
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                {alertSelected && createAlert?.users.length > 0 ? (
                                    <span className={classes.helperMessage}>Users(s)</span>
                                ) : (
                                    ''
                                )}
                                <ThemeProvider theme={selectCompTheme}>
                                    <Autocomplete
                                        multiple
                                        id="tags-standard"
                                        options={
                                            !props.alertSelected
                                                ? userList
                                                : userList.filter((el) => {
                                                      return !createAlert?.users.some(
                                                          (user) =>
                                                              el.name.toLowerCase() ===
                                                              user.name.toLowerCase()
                                                      );
                                                  })
                                        }
                                        getOptionLabel={(user) => {
                                            return user.name;
                                        }}
                                        value={createAlert?.users}
                                        classes={{
                                            option: classes.autoCompleteOption,
                                            inputRoot: classes.userListSelect,
                                            noOptions: classes.autoCompleteOption,
                                            listbox: classes.listboxScroll,
                                            underline: classes.formInputUnderline
                                        }}
                                        noOptionsText={'No User Found'}
                                        onChange={(event, newValues, reason) => {
                                            switch (reason) {
                                                case 'select-option':
                                                    setCreateAlert({
                                                        ...createAlert,
                                                        users: newValues
                                                    });
                                                    break;
                                                case 'remove-option':
                                                    setCreateAlert({
                                                        ...createAlert,
                                                        users: newValues
                                                    });
                                                    break;
                                                case 'clear':
                                                    setCreateAlert({
                                                        ...createAlert,
                                                        users: newValues
                                                    });
                                                    break;
                                                default:
                                            }
                                        }}
                                        filterOptions={(options, { inputValue }) => {
                                            return options.filter((el) => {
                                                return el.name
                                                    .toLowerCase()
                                                    .includes(inputValue.toLowerCase());
                                            });
                                        }}
                                        filterSelectedOptions
                                        ChipProps={{
                                            classes: { root: classes.chip },
                                            deleteIcon: <Close />
                                        }}
                                        renderTags={(value, getTagProps) => {
                                            const numTags = value.length;
                                            const limitTags = 1;
                                            return (
                                                <>
                                                    {userListScroll && (
                                                        <div className={classes.renderTags}>
                                                            {value.map((option, index) => (
                                                                <Chip
                                                                    key={'chip' + index}
                                                                    classes={{ root: classes.chip }}
                                                                    deleteIcon={<Close />}
                                                                    label={option.name}
                                                                    {...getTagProps({ index })}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                    {!userListScroll && (
                                                        <>
                                                            {value
                                                                .slice(0, limitTags)
                                                                .map((option, index) => (
                                                                    <Chip
                                                                        key={'chip2' + index}
                                                                        classes={{
                                                                            root: classes.chip
                                                                        }}
                                                                        deleteIcon={
                                                                            <Close fontSize="large" />
                                                                        }
                                                                        label={option.name}
                                                                        {...getTagProps({ index })}
                                                                    />
                                                                ))}
                                                            {numTags > limitTags &&
                                                                ` +${numTags - limitTags} more`}
                                                        </>
                                                    )}
                                                </>
                                            );
                                        }}
                                        onFocus={() => {
                                            setUserListScroll(true);
                                        }}
                                        onBlur={() => {
                                            setUserListScroll(false);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                //label={alertSelected ? 'Add User(s)' : ''}
                                                placeholder={
                                                    createAlert?.users.length === 0
                                                        ? 'Add user(s) to share this alert with'
                                                        : ''
                                                }
                                                className={clsx(
                                                    classes.fontSize2,
                                                    classes.fontColor
                                                )}
                                                variant="filled"
                                                id="add user(s)"
                                            />
                                        )}
                                    />
                                </ThemeProvider>
                            </Grid>
                        </Grid>
                    )}
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControlLabel
                                id="receive-notification"
                                control={
                                    <NotificationSwitch
                                        checked={createAlert?.receive_notification}
                                        onChange={handleNotificationChange}
                                    />
                                }
                                label="Receive Notification"
                                className={classes.switchLabel}
                            />
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        </Fragment>
    );
}
