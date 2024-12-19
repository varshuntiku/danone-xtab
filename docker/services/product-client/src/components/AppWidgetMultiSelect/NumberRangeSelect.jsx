import { makeStyles, Slider, TextField, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.text.default
    },
    sliderWrapper: {
        width: '40rem',
        margin: '4rem'
    },
    sliderRoot: {
        color: theme.palette.text.default
    },
    thumb: {
        transition: 'scale 0.2s ease 0s;',
        '&.MuiSlider-thumb:hover': {
            scale: 1.25
        },
        '& .MuiSlider-valueLabel': {
            top: '-2rem',
            transition: 'all 0.2s ease 0s;',
            '& *': {
                transition: 'all 0.2s ease 0s;',
                background: 'transparent',
                color: theme.palette.text.default,
                fontSize: '1.2rem',
                fontWeight: '600'
            }
        },
        '&:hover': {
            '& .MuiSlider-valueLabel': {
                top: '-34px',
                scale: 0.8,
                '& *': {
                    background: theme.palette.text.default,
                    color: theme.palette.primary.dark,
                    fontSize: '1.2rem',
                    fontWeight: '600'
                }
            }
        }
    },
    markLabel: {
        fontSize: '1.2rem',
        color: theme.palette.text.default
    },
    rangeInput: {
        '& .MuiOutlinedInput-root': {
            '& fieldset, &:hover fieldset, &.Mui-focused fieldset': {
                borderColor: theme.palette.text.default
            }
        },
        '& label, & label.Mui-focused': {
            color: theme.palette.text.default
        },
        '& input': {
            color: theme.palette.text.default,
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0
            }
        }
    },
    rangeWrapper: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}));

export default function NumberRangeSelect({ value, onChange, params }) {
    const [limit, setLimit] = React.useState([]);
    const [min, setMin] = React.useState(0);
    const [max, setMax] = React.useState(0);
    React.useEffect(() => {
        if (Array.isArray(value) && value.length < 3) {
            const limitValue = [Math.min(...value), Math.max(...value)];
            setLimit(limitValue);
            setMax(limitValue[1]);
            setMin(limitValue[0]);
        } else if (!Array.isArray(value)) {
            setMin(value);
        }
    }, [value]);

    let { title, marks, width, prefix = '', suffix = '', enableInputBox, ..._params } = params;
    const classes = useStyles();
    marks = marks || [
        { value: params.min, label: prefix + params.min + suffix },
        { value: params.max, label: prefix + params.max + suffix }
    ];

    const isInLimit = (value) => value >= marks[0].value && value <= marks[1].value;
    enableInputBox= enableInputBox === "true" ? 1:0;
    const showTextBox = enableInputBox && ((Array.isArray(value) && value.length < 3) || !Array.isArray(value));
    const setRangeValue = (e) => {
        let newValue = e.target.value;
        if (!newValue) return;
        newValue = parseFloat(newValue);
        if (isInLimit(newValue)) {
            setMin(newValue);
            onChange(Array.isArray(value) ? [newValue] : newValue);
        }
    };

    const updateLimit = ({ maxRange, minRange }) => {
        if (!minRange && !maxRange) return;
        const _maxRange = parseFloat(maxRange);
        const _minRange = parseFloat(minRange);
        let newLimit = limit;
        if (Number.isFinite(_maxRange)) {
            setMax(_maxRange);
            if (_maxRange < limit[0] || !isInLimit(_maxRange)) return;
            const newMin = min <= _maxRange && isInLimit(min) ? min : limit[0];
            newLimit = [newMin, _maxRange];
        } else if (Number.isFinite(_minRange)) {
            setMin(_minRange);
            if (_minRange > limit[1] || !isInLimit(_minRange)) return;
            const newMax = max >= _minRange && isInLimit(max) ? max : limit[1];
            newLimit = [_minRange, newMax];
        }
        setLimit(newLimit);
        onChange(newLimit);
    };

    return (
        <div>
            <Typography variant="h5" className={classes.title}>
                {title}
            </Typography>
            <div className={classes.sliderWrapper} style={{ width: width }}>
                <Slider
                    classes={{
                        root: classes.sliderRoot,
                        markLabel: classes.markLabel,
                        thumb: classes.thumb
                    }}
                    value={value}
                    onChange={(e, v) => onChange(v)}
                    valueLabelDisplay="on"
                    marks={marks}
                    {..._params}
                    getAriaLabel={(index) => `Slider_${index}`}
                />
                <div className={classes.rangeWrapper}>
                    {showTextBox? (
                        value.length === 2 ? (
                            <React.Fragment>
                                <TextField
                                    variant="outlined"
                                    label="Min"
                                    type="number"
                                    className={classes.rangeInput}
                                    value={min}
                                    onChange={(e) => updateLimit({ minRange: e.target.value })}
                                    size="small"
                                    inputProps={{ step: params.step, 'aria-label': 'range-min' }}
                                    id="min-range"
                                />
                                <TextField
                                    variant="outlined"
                                    label="Max"
                                    type="number"
                                    className={classes.rangeInput}
                                    value={max}
                                    onChange={(e) => updateLimit({ maxRange: e.target.value })}
                                    size="small"
                                    inputProps={{ step: params.step, 'aria-label': 'range-max' }}
                                    id="max-range"
                                />
                            </React.Fragment>
                        ) : (
                            <TextField
                                variant="outlined"
                                label="Value"
                                type="number"
                                className={classes.rangeInput}
                                value={min}
                                onChange={setRangeValue}
                                size="small"
                                inputProps={{ step: params.step, 'aria-label': 'value' }}
                                id="value"
                            />
                        )
                    ) : null}
                </div>
            </div>
        </div>
    );
}
