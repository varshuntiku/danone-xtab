import React, { useCallback, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Box, Button, Checkbox, createTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/moment';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker
} from '@material-ui/pickers';
import CustomSnackbar from 'components/CustomSnackbar.jsx';

import { scheduleStory } from 'services/reports.js';
import scheduleStoriesStyle from 'assets/jss/scheduleStoriesStyle.jsx';

import * as _ from 'underscore';

const DialogTitle = withStyles(scheduleStoriesStyle)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6" className={classes.title}>
                {children}
            </Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2)
    }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2)
    }
}))(MuiDialogActions);

const useStyles = makeStyles(scheduleStoriesStyle);

const scheduleTheme = (theme) =>
    createTheme({
        ...theme,
        overrides: {
            ...theme,
            MuiInputBase: {
                root: {
                    color: theme.palette.text.titleText,
                    fontSize: '1.6rem'
                }
            },
            MuiFormLabel: {
                root: {
                    color: theme.palette.text.titleText,
                    fontSize: '1.6rem'
                }
            },
            MuiOutlinedInput: {
                root: {
                    '& fieldset': {
                        borderColor: theme.palette.text.titleText
                    },
                    '&$focused $notchedOutline': {
                        borderColor: theme.palette.text.titleText,
                        borderWidth: 1.5
                    },
                    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                        borderColor: theme.palette.text.titleText,
                        borderWidth: 1.5
                    }
                }
            },
            MuiSvgIcon: {
                root: {
                    fontSize: '2rem',
                    color: theme.palette.text.titleText
                }
            },
            MuiTypography: {
                body1: {
                    fontSize: '2rem',
                    color: theme.palette.text.titleText
                },
                body2: {
                    fontSize: '1.25rem'
                },
                caption: {
                    fontSize: '1rem',
                    color: theme.palette.text.titleText
                }
            },
            MuiPickersCalendarHeader: {
                dayLabel: {
                    fontSize: '1.25rem',
                    color: theme.palette.text.titleText
                }
            },
            MuiPickersDay: {
                day: {
                    color: theme.palette.text.titleText
                }
            },
            MuiButton: {
                textPrimary: {
                    color: theme.palette.text.titleText,
                    fontSize: theme.spacing(2.5)
                }
            },
            MuiPickersClockNumber: {
                clockNumber: {
                    color: theme.palette.text.titleText
                }
            }
        }
    });

const ScheduleStoriesDialog = (props) => {
    const { storyData } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [submitted, setSubmitted] = React.useState(false);
    const [loading, setloading] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState({ open: false });
    const [values, setValues] = React.useState({
        isScheduled: false,
        frequency: '',
        startDate: new Date(),
        endDate: new Date(),
        time: new Date(),
        occuringOn: '',
        occuringAt: '',
        days: []
    });

    const initialErrorState = {
        frequency: '',
        startDate: '',
        endDate: '',
        time: '',
        days: '',
        occuringOn: '',
        occuringAt: ''
    };

    const [errors, setErrors] = React.useState(initialErrorState);

    React.useEffect(() => {
        if (storyData?.story_schedule_info) {
            const storyScheduleInfo = JSON.parse(storyData.story_schedule_info);
            setValues({ ...values, ...populatesData(storyScheduleInfo) });
        }
    }, [storyData]);

    const populatesData = (ScheduleInfo) => {
        if (ScheduleInfo) {
            return {
                isScheduled: ScheduleInfo.isScheduled,
                frequency: ScheduleInfo.frequency,
                startDate: new Date(ScheduleInfo.startDate),
                endDate: new Date(ScheduleInfo.endDate),
                time: new Date(ScheduleInfo.time),
                occuringOn: ScheduleInfo.occuringOn,
                occuringAt: ScheduleInfo.occuringAt,
                days: ScheduleInfo.days
            };
        }
    };

    const handleClose = () => {
        props.onClose();
    };

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const setScheduled = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.checked });
    };

    const handleDateChange = (prop) => (date) => {
        setValues({ ...values, [prop]: date.toDate() });
    };

    useEffect(() => {
        if (submitted) {
            validateInputFields();
        }
    });

    const submit = () => {
        setSubmitted(true);

        let validationStatus = validateInputFields();
        if (validationStatus) {
            createSchedule();
        }
    };

    const validateInputFields = () => {
        let valid = true;
        let formErrors = initialErrorState;

        let validationGroup = {
            Once: ['startDate', 'time'],
            Day: ['startDate', 'endDate', 'time'],
            Week: ['startDate', 'endDate', 'time', 'days'],
            Month: ['startDate', 'endDate', 'time', 'occuringOn', 'occuringAt']
        };

        if (!values.isScheduled) {
            return true;
        } else {
            if (values.frequency) {
                formErrors['frequency'] = '';
                _.mapObject(values, function (val, key) {
                    if (validationGroup[values.frequency].includes(key)) {
                        if (key === 'startDate' || key === 'endDate' || key === 'time') {
                            if (val === 'Invalid Date') {
                                valid = false;
                            }
                        } else if (key === 'days') {
                            formErrors[key] = !val.length ? 'Days selection is required' : '';
                            if (!val.length) {
                                valid = false;
                            }
                        } else {
                            formErrors[key] = !val.length ? 'Field is required' : '';
                            if (!val.length) {
                                valid = false;
                            }
                        }
                    }
                });
            } else {
                formErrors['frequency'] = 'Field is mandatory';
                valid = false;
            }
        }

        setErrors({ ...errors, ...formErrors });
        return valid;
    };

    const createSchedule = () => {
        setloading(true);
        var payload = {
            email: props.logged_in_user_info,
            story_id: storyData.story_id,
            isScheduled: values.isScheduled,
            frequency: values.frequency,
            startDate: values.startDate,
            endDate: values.endDate,
            time: values.time,
            days: values.days,
            occuringAt: values.occuringAt,
            occuringOn: values.occuringOn
        };

        scheduleStory({
            payload: payload,
            callback: onResponseScheduleStory
        });
    };

    const onResponseScheduleStory = () => {
        handleScheduleResponse({ message: 'Submitted Successfully' });

        _.delay(
            () => {
                setOpen(false);
                setloading(false);
                props.onClose();
                props.onResponseScheduleStory();
            },
            2000,
            ''
        );
    };

    const handleScheduleResponse = useCallback(({ message, severity = 'success' }) => {
        setSnackbar({ open: true, severity, message });
    }, []);

    const isSelected = (day) => {
        var index = values.days.indexOf(day);
        if (index !== -1) {
            return true;
        }
        return false;
    };

    const updateDays = (day) => {
        var days = values.days;
        var index = days.indexOf(day);
        if (index !== -1) {
            days.splice(index, 1);
        } else {
            days.push(day);
        }
        setValues({ ...values, days });
    };

    var weeks = ['M', 'T', 'W', 'Th', 'Fr', 'Sa', 'Su'];

    return (
        <div>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                classes={{ paper: classes.dialogPaper }}
                aria-describedby="schedule stories dialog content"
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Schedule Story
                </DialogTitle>
                <DialogContent dividers id="schedule stories dialog content">
                    <div className={classes.summary}>
                        <span> Schedule Story </span>
                        <Checkbox
                            checked={values.isScheduled}
                            className={classes.storyCheckbox}
                            disableRipple={true}
                            onChange={setScheduled('isScheduled')}
                        />
                    </div>
                    <div className={classes.summary}>
                        <span> Story Name : </span>
                        <span>{storyData.story_name}</span>
                    </div>
                    <div className={classes.summary}>
                        <span> Story Description : </span>
                        <span>{storyData.story_desc}</span>
                    </div>

                    {values.isScheduled && (
                        <div className={classes.pd10}>
                            <div className={classes.clause}>
                                <span className={classes.heading}> Repeat Every : </span>
                                <Box display="flex" flex={1} gridGap="2rem">
                                    <FormControl
                                        size="small"
                                        variant="outlined"
                                        className={classes.frequency}
                                    >
                                        <InputLabel id="demo-simple-select-outlined-label">
                                            {' '}
                                            Frequency
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={values.frequency}
                                            onChange={handleChange('frequency')}
                                            label="Frequency"
                                            error={errors.frequency}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'Once'}>Once</MenuItem>
                                            <MenuItem value={'Day'}>Day</MenuItem>
                                            <MenuItem value={'Week'}>Week</MenuItem>
                                            <MenuItem value={'Month'}>Month</MenuItem>
                                        </Select>
                                        {errors.frequency.length > 0 && (
                                            <span className={classes.errors}>
                                                {' '}
                                                {errors.frequency}
                                            </span>
                                        )}
                                    </FormControl>
                                </Box>
                            </div>

                            {values.frequency && (
                                <div>
                                    <ThemeProvider theme={scheduleTheme}>
                                        <div className={classes.clause}>
                                            <span className={classes.dateHeading}> From :</span>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    className={classes.startDate}
                                                    disableToolbar
                                                    size="small"
                                                    inputVariant="outlined"
                                                    format="MM/DD/yyyy"
                                                    minDate={new Date()}
                                                    margin="normal"
                                                    id="date-picker-inline"
                                                    label="Start Date"
                                                    value={values.startDate}
                                                    onChange={handleDateChange('startDate')}
                                                />
                                            </MuiPickersUtilsProvider>

                                            {values.frequency !== 'Once' && (
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <KeyboardDatePicker
                                                        className={classes.endDate}
                                                        disableToolbar
                                                        size="small"
                                                        inputVariant="outlined"
                                                        format="MM/DD/yyyy"
                                                        minDate={new Date()}
                                                        margin="normal"
                                                        id="date-picker-inline"
                                                        label="End Date"
                                                        value={values.endDate}
                                                        onChange={handleDateChange('endDate')}
                                                    />
                                                </MuiPickersUtilsProvider>
                                            )}

                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardTimePicker
                                                    className={classes.endDate}
                                                    inputVariant="outlined"
                                                    label="Time"
                                                    size="small"
                                                    placeholder="08:00 AM"
                                                    mask="__:__ _M"
                                                    value={values.time}
                                                    margin="normal"
                                                    onChange={handleDateChange('time')}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </div>
                                    </ThemeProvider>

                                    {/* {(values.frequency === 'Once') && <span className={classes.scheduleInfo}>Occurs once on {values.startDate.toLocaleDateString()} at {values.time.toLocaleTimeString()}</span>} */}
                                    {/* {(values.frequency === 'Day') && <span className={classes.scheduleInfo}>Occurs every day starting from {values.startDate.toLocaleDateString()} until {values.endDate.toLocaleDateString()} at {values.time.toLocaleTimeString()}</span>} */}
                                    {values.frequency === 'Week' && (
                                        <div>
                                            <div className={classes.clause}>
                                                <ul className={classes.weekList}>
                                                    {weeks.map(function (name, index) {
                                                        return (
                                                            <li
                                                                className={[
                                                                    classes.days,
                                                                    isSelected(name)
                                                                        ? classes.active
                                                                        : null
                                                                ].join(' ')}
                                                                onClick={() => {
                                                                    updateDays(name);
                                                                }}
                                                                key={index}
                                                            >
                                                                {name}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                            {errors.days.length > 0 && (
                                                <span className={classes.daysErrors}>
                                                    {' '}
                                                    {errors.days}
                                                </span>
                                            )}
                                            {/* <span className={classes.scheduleInfo}>
                                            Occurs every 2 Weeks on Monday and Friday starting from {values.startDate.toLocaleDateString()} until {values.endDate.toLocaleDateString()} at {values.time.toLocaleTimeString()}
                                        </span> */}
                                        </div>
                                    )}

                                    {values.frequency === 'Month' && (
                                        <div className={classes.clause}>
                                            <span className={classes.heading}> on the :</span>
                                            <FormControl
                                                size="small"
                                                variant="outlined"
                                                className={classes.formControl}
                                            >
                                                <InputLabel id="demo-simple-select-outlined-label">
                                                    Occurance On
                                                </InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-outlined-label"
                                                    id="demo-simple-select-outlined"
                                                    value={values.occuringOn}
                                                    onChange={handleChange('occuringOn')}
                                                    label="occuringOn"
                                                    error={errors.occuringOn}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    <MenuItem value={'First'}>First</MenuItem>
                                                    <MenuItem value={'Last'}>Last</MenuItem>
                                                </Select>
                                                {errors.occuringOn.length > 0 && (
                                                    <span className={classes.errors}>
                                                        {' '}
                                                        {errors.occuringOn}
                                                    </span>
                                                )}
                                            </FormControl>

                                            <FormControl
                                                size="small"
                                                variant="outlined"
                                                className={classes.formControl}
                                            >
                                                <InputLabel id="demo-simple-select-outlined-label">
                                                    Select Day
                                                </InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-outlined-label"
                                                    id="demo-simple-select-outlined"
                                                    value={values.occuringAt}
                                                    onChange={handleChange('occuringAt')}
                                                    label="occuringAt"
                                                    error={errors.occuringAt}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    <MenuItem value={'Monday'}>Monday</MenuItem>
                                                    <MenuItem value={'Tuesday'}>Tuesday</MenuItem>
                                                    <MenuItem value={'Wednesday'}>
                                                        Wednesday
                                                    </MenuItem>
                                                    <MenuItem value={'Thursday'}>Thursday</MenuItem>
                                                    <MenuItem value={'Friday'}>Friday</MenuItem>
                                                    <MenuItem value={'Saturday'}>Saturday</MenuItem>
                                                    <MenuItem value={'Sunday'}>Sunday</MenuItem>
                                                </Select>
                                                {errors.occuringAt.length > 0 && (
                                                    <span className={classes.errors}>
                                                        {' '}
                                                        {errors.occuringAt}
                                                    </span>
                                                )}
                                            </FormControl>

                                            {/* <span>
                                        Occurs every Monday starting from 03/05/2021 until 03/06/2021 at 12:00 am
                                </span> */}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        aria-label="cancel"
                        onClick={handleClose}
                        variant="outlined"
                        size="large"
                        className={classes.button}
                    >
                        Cancel
                    </Button>
                    ,
                    <Button
                        aria-label="submit"
                        onClick={submit}
                        disabled={loading}
                        variant="contained"
                        size="large"
                        className={classes.button}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <CustomSnackbar
                message={snackbar.message}
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={setSnackbar.bind(null, { ...snackbar, open: false })}
                severity={snackbar.severity}
            />
        </div>
    );
};

export default ScheduleStoriesDialog;
