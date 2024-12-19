import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, Switch } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';

const useStyles = makeStyles(() => ({
    simulatorSwitchB: {
        display: 'flex'
    }
}));

function Switches({ onChange, name, checked, color }) {
    const [checkedState, setCheckedState] = useState(checked);
    const [switchName] = useState(name);
    const useStyles = makeStyles((theme) => ({
        switchClass: {
            '& .Mui-checked .MuiSwitch-thumb': {
                color: color ? color : theme.palette.text.contrastText
            },
            '& .MuiSwitch-thumb': {
                color: color ? color : theme.palette.text.contrastText
            },
            '& .MuiSwitch-track': {
                backgroundColor: color
                    ? `${color} !important`
                    : `${theme.palette.text.contrastText} !important`
            }
        }
    }));

    const classes = useStyles();
    const handleChange = (event) => {
        setCheckedState(event.target.checked);
        onChange(Number(event.target.checked), switchName);
    };

    return (
        <Switch
            checked={checkedState}
            onChange={handleChange}
            name={switchName}
            className={classes.switchClass}
        />
    );
}

export default function InputRenderer(
    type,
    section,
    simulatorState,
    setSimulatorState,
    level,
    row
) {
    const useStylesInput = makeStyles((theme) => ({
        inputtext: {
            color: section?.color || theme.palette.primary.contrastText
        },
        gridStyle: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        simulatorSliderLabel: {
            color: section?.labelColor || theme.palette.text.default,
            fontSize: '1.5rem',
            padding: theme.spacing(1, 0),
            textAlign: 'left'
        },
        simulatorSliderInput: {
            margin: theme.spacing(0.35, 0),
            color: section?.color || theme.palette.primary.contrastText,
            '& .MuiSlider-markLabel': {
                color: theme.palette.primary.contrastText + '!important'
            }
        },
        simulatorSliderInputBox: {
            '&&&:before': {
                borderBottom: 'none'
            },
            '& input': {
                backgroundColor: theme.palette.background.paper,
                color: section?.color || theme.palette.primary.contrastText,
                textAlign: 'center',
                fontSize: '1.6rem',
                borderRadius: '3px'
            },
            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0
            },
            '&.MuiInput-root': {
                margin: '0.2rem'
            },
            '&.MuiInputBase-root': {
                border: '1px solid ' + (section?.color || theme.palette.primary.contrastText),
                maxWidth: '8rem !important',
                backgroundColor: theme.palette.background.paper,
                color: section?.color || theme.palette.primary.contrastText,
                textAlign: 'center',
                padding: '0.8rem',
                margin: '0.3rem',
                fontSize: '1.6rem',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        currency: {
            color: theme.palette.text.default,
            marginRight: '1rem'
        }
    }));
    const classesInput = useStylesInput();
    const classes = useStyles();
    let inputType = type.slice(0, type.indexOf('-') == -1 ? type.length : type.indexOf('-'));
    const [inputValue, setInputValue] = useState(section?.value || 0);
    useEffect(() => {
        setInputValue(section.value);
    }, [section.value]);

    const getWidgetValue = (level, indicator, type, newState) => {
        let widgetValue = 0;
        switch (level) {
            case 0:
                widgetValue = newState[`${type}`].value;
                break;
            case 1:
                widgetValue = newState.indicators[`${indicator}`][`${type}`].value;
                break;
            case 2:
                widgetValue = newState.child_indicators.indicators[`${indicator}`][`${type}`].value;
                break;
            case 3:
                widgetValue =
                    newState.child_indicators.child_indicators.indicators[`${indicator}`][`${type}`]
                        .value;
                break;
        }
        return widgetValue;
    };

    const doMath = (formula, method) => {
        let calculatedValue = 0;
        let innerBracket = formula.lastIndexOf('(');
        if (innerBracket != -1) {
            let outerBracket = formula.indexOf(')', innerBracket);
            let calculatedValue = formula.slice(innerBracket + 1, outerBracket);
            let value = doMath(calculatedValue, method);
            formula.splice(innerBracket, 0, value);
            formula.splice(innerBracket + 1, calculatedValue.length + 2);
            return doMath(formula, method);
        } else {
            let value_1 = null;
            let value_2 = null;
            let operator = null;
            const evaluate = (val1, val2, operator) => {
                switch (operator) {
                    case '+':
                        return method == 'round'
                            ? Math.round(val1 + val2)
                            : (val1 + val2).toFixed(2);
                    case '-':
                        return method == 'round'
                            ? Math.round(val1 - val2)
                            : (val1 - val2).toFixed(2);
                    case '*':
                        return method == 'round'
                            ? Math.round(val1 * val2)
                            : (val1 * val2).toFixed(2);
                    case '/':
                        return method == 'round'
                            ? Math.round(val1 / val2)
                            : (val1 / val2).toFixed(2);
                    case '**':
                        return method == 'round'
                            ? Math.round(val1 ** val2)
                            : (val1 ** val2).toFixed(2);
                }
            };
            formula.map((val) => {
                !isNaN(Number(val))
                    ? value_1 == null
                        ? (value_1 = Number(val))
                        : (value_2 = Number(val))
                    : (operator = val);
                if (operator != null && value_2 != null) {
                    let formulaValue = evaluate(value_1, value_2, operator, method);
                    value_1 = formulaValue;
                    value_2 = null;
                    operator = null;
                }
            });
            calculatedValue = value_1;
            return calculatedValue;
        }
    };

    const getTargetedItemFormula = (formula, connected_values, newState, method) => {
        let splitFormula = formula.split(' ');
        splitFormula.map((val, key) => {
            if (isNaN(val)) {
                let widgetValue =
                    val[0] == 'v'
                        ? getWidgetValue(
                              connected_values[`${val}`].level,
                              connected_values[`${val}`].indicator,
                              connected_values[`${val}`].type,
                              newState
                          )
                        : null;
                splitFormula[key] = widgetValue == null ? val : widgetValue;
            }
        });
        let finalValue = doMath(splitFormula, method);
        return finalValue;
    };

    const handleInputChange = (value) => {
        let newState = { ...simulatorState };
        switch (level) {
            case 1:
                newState.indicators[`${row}`][`${type}`].value = value?.target?.value
                    ? Number(value?.target?.value)
                    : value;
                break;
            case 2:
                newState.child_indicators.indicators[`${row}`][`${type}`].value = value?.target
                    ?.value
                    ? Number(value?.target?.value)
                    : value;
                break;
            case 3:
                newState.child_indicators.child_indicators.indicators[`${row}`][`${type}`].value =
                    value?.target?.value ? Number(value?.target?.value) : value;
                break;
        }
        setSimulatorState(newState);
        if (section?.interconnected) {
            section?.interconnected.map((val) => {
                let targetedItem = null;
                let calculatedValue = 0;
                switch (val.level) {
                    case 0:
                        targetedItem = newState[`${val.type}`];
                        calculatedValue = getTargetedItemFormula(
                            targetedItem?.formula,
                            targetedItem.connected_values,
                            newState,
                            targetedItem?.method
                        );
                        newState[`${val.type}`].value = calculatedValue;
                        setSimulatorState(newState);
                        break;
                    case 1:
                        targetedItem = newState.indicators[`${val.indicator}`][`${val.type}`];
                        calculatedValue = getTargetedItemFormula(
                            targetedItem?.formula,
                            targetedItem.connected_values,
                            newState,
                            targetedItem?.method
                        );
                        newState.indicators[`${val.indicator}`][`${val.type}`].value =
                            calculatedValue;
                        setSimulatorState(newState);
                        break;
                    case 2:
                        targetedItem =
                            newState.child_indicators.indicators[`${val.indicator}`][`${val.type}`];
                        calculatedValue = getTargetedItemFormula(
                            targetedItem?.formula,
                            targetedItem.connected_values,
                            newState,
                            targetedItem?.method
                        );
                        newState.child_indicators.indicators[`${val.indicator}`][
                            `${val.type}`
                        ].value = calculatedValue;
                        setSimulatorState(newState);
                        break;
                    case 3:
                        targetedItem =
                            newState.child_indicators.child_indicators.indicators[
                                `${val.indicator}`
                            ][`${val.type}`];
                        calculatedValue = getTargetedItemFormula(
                            targetedItem?.formula,
                            targetedItem.connected_values,
                            newState,
                            targetedItem?.method
                        );
                        newState.child_indicators.child_indicators.indicators[`${val.indicator}`][
                            `${val.type}`
                        ].value = calculatedValue;
                        setSimulatorState(newState);
                        break;
                }
            });
        }
    };

    switch (inputType) {
        case 'input':
            return (
                <Grid item xs={section?.length || 1} className={classesInput.gridStyle}>
                    {section?.label && (
                        <div className={classesInput.simulatorSliderLabel}>{section.label}</div>
                    )}
                    <Input
                        className={classesInput.simulatorSliderInputBox}
                        value={inputValue}
                        defaultValue={0}
                        disabled={!section?.active || false}
                        onChange={(e) => setInputValue(e.target.value)}
                        endAdornment={section?.percent ? '% ' : ''}
                        inputProps={{
                            disableUnderline: false
                        }}
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        type={section?.type || 'number'}
                        onBlur={(inputValue) => handleInputChange(inputValue)}
                    />
                </Grid>
            );
        case 'slider':
            return (
                <Grid item xs={section?.length || 2}>
                    {section?.label && (
                        <div className={classesInput.simulatorSliderLabel}>{section.label}</div>
                    )}
                    <Slider
                        aria-label="slider1"
                        label="Slider"
                        className={classesInput.simulatorSliderInput}
                        defaultValue={0}
                        value={section?.value}
                        step={section.steps}
                        max={section.max}
                        min={section.min}
                        track={false}
                        id="interconnected"
                        onChange={(_, value) => handleInputChange(value)}
                    />
                </Grid>
            );
        case 'flag_active':
            return (
                <Grid item xs={section?.length || 1}>
                    <div className={classesInput.simulatorSliderLabel}>{'Active'}</div>
                    <div className={classes.simulatorSwitchB}>
                        <Switches
                            onChange={(e) => {
                                handleInputChange(e);
                            }}
                            name={'_active'}
                            checked={section?.value == 1 ? true : false}
                            color={section?.color || null}
                        />
                    </div>
                </Grid>
            );
        case 'flag_optimize':
            return (
                <Grid item xs={section?.length || 1} className={classesInput.gridStyle}>
                    <div className={classesInput.simulatorSliderLabel}>
                        {section?.label ? section.label : 'Optimize'}
                    </div>
                    <div className={classes.simulatorSwitchB}>
                        <Switches
                            onChange={(e) => {
                                handleInputChange(e);
                            }}
                            name={'_optimize'}
                            checked={section?.value == 1 ? true : false}
                            color={section?.color || null}
                        />
                    </div>
                </Grid>
            );
        case 'text':
            return (
                <Grid item xs={section?.length || 2} className={classesInput.gridStyle}>
                    {section?.label && (
                        <div className={classesInput.simulatorSliderLabel}>{section.label}</div>
                    )}
                    <Typography className={classesInput.inputtext} variant="h4">
                        {section?.currency && <span className={classesInput.currency}>$</span>}{' '}
                        {section?.number
                            ? section?.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                            : section?.value}
                    </Typography>
                </Grid>
            );
        case 'default':
            null;
    }
}
