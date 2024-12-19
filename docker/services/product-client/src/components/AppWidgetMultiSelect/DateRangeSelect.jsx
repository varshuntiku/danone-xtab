import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import DatePicker from '../dynamic-form/inputFields/datepicker';
import { red } from '@material-ui/core/colors';
import moment from 'moment';
const useStyles = makeStyles((theme) => ({
    errorMsg: {
        color: red[500],
        fontSize: '1.5rem',
        marginLeft: '1rem'
    },
    dateLabel: {
        color: theme.palette.primary.contrastText
    }
}));
const getDateElements = (d) => {
    return [d.getFullYear(), d.getMonth(), d.getDate()];
};
const getDateLabel = (params, val) => {
    const now = moment(getDateElements(new Date()));
    const start = moment(getDateElements(new Date(val.start_date)));
    const end = moment(getDateElements(new Date(val.end_date)));

    let startLabel = null;
    let endLabel = null;
    let durationLabel = null;

    let labelStr = [];

    if (params?.startDateArrivalLabel && val.start_date) {
        const startArrival = start.diff(now, 'days');

        if (!isNaN(startArrival)) {
            startLabel = `${startArrival >= 0 ? 'Starts ' : 'Started'} : ${
                startArrival >= 0
                    ? `${
                          startArrival === 0
                              ? 'Today'
                              : `in ${startArrival} ${startArrival > 1 ? 'days' : 'day'}`
                      }`
                    : `${Math.abs(startArrival)} ${Math.abs(startArrival) > 1 ? 'days' : 'day'} ago`
            }`;
            labelStr.push(startLabel);
        }
    }

    if (params?.endDateArrivalLabel && val.end_date) {
        if (params?.endDateArrivalLabelIfStarted) {
            const startArrival = start.diff(now, 'days');

            if (startArrival > 0) {
                return;
            }
        }

        const endArrival = end.diff(now, 'days');

        if (!isNaN(endArrival)) {
            endLabel = `${endArrival >= 0 ? 'Ends' : 'Ended'} : ${
                endArrival > 0
                    ? `in ${endArrival} ${endArrival > 1 ? 'days' : 'day'}`
                    : `${
                          endArrival === 0
                              ? 'Today'
                              : `${Math.abs(endArrival)} ${
                                    Math.abs(endArrival) > 1 ? 'days' : 'day'
                                } ago`
                      }`
            }`;
            labelStr.push(endLabel);
        }
    }

    if (params?.durationLabel && val.start_date && val.end_date) {
        const duration = end.diff(start, 'days');

        if (!isNaN(duration)) {
            durationLabel = `Duration : ${duration} ${duration > 1 ? 'days' : 'day'}`;
            labelStr.push(durationLabel);
        }
    }

    const finalStr = labelStr.join(' | ');

    return finalStr;
};
export default function DateRangeSelect({ value, onChangeFilter, params, onError }) {
    const classes = useStyles();
    // const [value, setValue] = React.useState({start_date: "08/21/2021", end_date: "12/21/2021"}); // tobe removed
    const [_value, setValue] = React.useState(value || {});
    const [error, setError] = React.useState('');
    const [dateLabel, setDateLabel] = React.useState(null);

    React.useEffect(() => {
        if (params?.endDateArrivalLabel || params?.startDateArrivalLabel || params?.durationLabel) {
            const label = getDateLabel(params, _value);
            setDateLabel(label);
        }
    }, [_value]);

    const handleDateChange = (propName, date) => {
        const newValue = { ..._value, [propName]: date };
        setValue(newValue);
        if (!params?.endDateOptional) {
            compareDate(newValue);
        } else {
            if (newValue.end_date) {
                compareDate(newValue);
            } else {
                onChangeFilter(newValue);
            }
        }
    };

    const compareDate = (newValue) => {
        if (new Date(newValue.start_date) <= new Date(newValue.end_date)) {
            onChangeFilter(newValue);
            setError('');
            onError && onError();
        } else {
            setError('Invalid selection');
            onError && onError({ message: 'Invalid range selection' });
        }
    };

    // const handleValidateChange = (propName, date) => {
    //     const newValue = { ..._value, [propName]: date }
    //     return new Date(newValue.start_date) <= new Date(newValue.end_date);
    // }

    return (
        <Box display="flex" gridGap="1rem" flexDirection="column">
            <div style={{ display: 'flex', gridGap: '1rem', alignItems: 'center' }}>
                <DatePicker
                    fieldInfo={{
                        value: _value.start_date,
                        suppressUTC: params?.start_date?.suppressUTC,
                        setHours: params?.start_date?.setHours,
                        allowInvalid: true,
                        variant: params?.start_date?.variant || 'outlined',
                        label: params?.start_date?.label || 'Start Date',
                        inputprops: {
                            format: 'DD/MM/yyyy',
                            size: 'small',
                            maxDate: _value.end_date,
                            ...params?.start_date
                        },
                        error
                    }}
                    // validateChange={handleValidateChange.bind(null, 'start_date')}
                    onChange={handleDateChange.bind(null, 'start_date')}
                />

                <DatePicker
                    fieldInfo={{
                        value: _value.end_date,
                        suppressUTC: params?.end_date?.suppressUTC,
                        setHours: params?.end_date?.setHours,
                        allowInvalid: true,
                        variant: params?.end_date?.variant || 'outlined',
                        label: params?.end_date?.label || 'End Date',
                        inputprops: {
                            format: 'DD/MM/yyyy',
                            size: 'small',
                            minDate: _value.start_date,
                            ...params?.end_date
                        },
                        error
                    }}
                    // validateChange={handleValidateChange.bind(null, 'end_date')}
                    onChange={handleDateChange.bind(null, 'end_date')}
                />
                {(params?.endDateArrivalLabel ||
                    params?.startDateArrivalLabel ||
                    params?.durationLabel) && (
                    <Typography variant="h5" className={classes.dateLabel}>
                        {dateLabel}
                    </Typography>
                )}
            </div>

            <Typography variant="h3" className={classes.errorMsg}>
                {error}
            </Typography>
        </Box>
    );
}
