import React, { useEffect, useState, useContext } from 'react';
import { makeStyles /*, withStyles*/, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Switch, Grid, Typography, Slider, Input, Button, Box } from '@material-ui/core';
import { GraphInfo } from '../graphInfo/GraphInfo';
import SaveScenario from '../AppScenarioComponent/saveScenario';
import LoadScenario from '../AppScenarioComponent/loadScenario';
import CloseIcon from '../../assets/Icons/CloseBtn';
import CodxCircularLoader from '../CodxCircularLoader';
import { getCurrencySymbol } from 'common/utils';
import NumberFormat from 'react-number-format';
import * as _ from 'underscore';
import AlternateSimulatorCustomType from './CustomSimulator';

// let _ = require("underscore");

const default_number_separator = ',';
const default_decimal_separator = '.';
const default_number_prefix = '$';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    tableContainer: {
        padding: theme.spacing(1.2),
        width: '100%'
    },
    buttonFloat: {
        float: 'right'
    },
    button: {
        margin: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(10)} ${theme.layoutSpacing(16)}`,
        height: theme.layoutSpacing(36),
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(24)}`,
        '& span': {
            fontSize: theme.layoutSpacing(15),
            fontWeight: '500',
            lineHeight: 'normal',
            letterSpacing: theme.layoutSpacing(1.5)
        }
    },
    downloadSheet: {
        margin: theme.spacing(1, 0, 1, 3)
    },
    hiddenElement: {
        display: 'none'
    },
    displayedElement: {
        display: 'block'
    },
    simulatorSectionHeader: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontWeight: 400,
        padding: theme.spacing(2, 0)
    },
    simulatorSliderInputBox: {
        marginLeft: theme.spacing(2),
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            backgroundColor: theme.palette.background.paper,
            border: '2px solid ' + theme.palette.background.paper,
            color: theme.palette.primary.contrastText,
            textAlign: 'right',
            padding: theme.spacing(0.3, 0),
            margin: theme.spacing(0.6, 0),
            fontSize: '1.8rem'
        }
    },
    totalValues: {
        textAlign: 'center'
    },
    simulatorOptionText: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        fontWeight: 200,
        padding: theme.spacing(2, 0)
    },
    floatingDiv: {
        zIndex: 10,
        position: 'absolute',
        padding: '10px',
        background: theme.palette.primary.light
    },
    graphGridContainer: {
        minHeight: '35vh'
    },
    graphTitleTypography: {
        fontSize: theme.spacing(1.5),
        color: theme.palette.text.titleText,
        opacity: '0.8'
    },
    simulatorContainer: {
        maxHeight: '65vh',
        overflowY: 'scroll',
        padding: theme.spacing(0, 2, 0, 2)
    },
    widgetContent: {
        width: '100%',
        height: '100%',
        borderRadius: theme.spacing(1),
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '0.5rem'
    },
    plot: {
        height: '100%',
        flex: 1
    },
    graphContainer: {
        width: '100%',
        background: theme.palette.primary.main,
        margin: '0'
    },
    simulatorSliderLabel: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        padding: theme.spacing(1, 0)
    },
    simulatorTotal: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontWeight: 400,
        padding: theme.spacing(1, 0),
        display: 'flex',
        justifyContent: 'center'
    },
    sectionHeading: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontWeight: 400,
        padding: theme.spacing(2, 0)
    },
    simulatorSection: {
        border: ' 1px solid',
        padding: '1.6rem',
        marginBottom: '1.6rem',
        borderColor: theme.palette.background.default,
        background: theme.palette.background.default
    },
    customContainer: {
        display: 'flex',
        direction: 'row',
        color: theme.palette.text.default
    },
    closeIcon: {
        position: 'absolute',
        top: 2,
        right: 10,
        '& svg': {
            cursor: 'pointer',
            marginRight: '.5rem',
            '& rect:first-child': {
                fill: theme.palette.primary.light
            }
        }
    },
    closeIconWithoutCont: {
        paddingTop: 5
    },
    actionContainer: {
        marginTop: theme.layoutSpacing(32)
    },
    closeIconContainer: {
        marginTop: theme.layoutSpacing(7)
    },
    customGridContainer: {
        background: theme.palette.primary.light
    }
}));

const theme = (th) =>
    createTheme({
        overrides: {
            MuiSwitch: {
                root: {
                    width: 42,
                    height: 22,
                    padding: 0,
                    margin: th.spacing(1)
                },
                switchBase: {
                    top: 1,
                    left: 2,
                    padding: 1,
                    color: '#E5E5E5',
                    '&$checked': {
                        color: th.palette.primary.dark + ' !important'
                    }
                },
                track: {
                    backgroundColor: th.palette.primary.dark,
                    borderRadius: 22 / 2,
                    border: `1px solid #E5E5E5`,
                    //backgroundColor: theme.palette.grey[50],
                    opacity: 1,
                    transition: th.transitions.create(['background-color', 'border']),
                    '$checked$checked + &': {
                        opacity: 1,
                        backgroundColor: th.palette.primary.contrastText,
                        border: `1px solid ${th.palette.primary.contrastText}`
                    }
                },
                thumb: {
                    width: 18,
                    height: 18
                }
            },
            MuiTypography: {
                body1: {
                    fontSize: '2rem',
                    color: th.palette.primary.contrastText + ' !important',
                    backgroundColor: th.palette.primary.main
                }
            },
            MuiInputAdornment: {
                positionStart: {
                    marginRight: th.spacing(0)
                }
            }
        }
    });

const useStylesCustomSliders = makeStyles((theme) => ({
    checkbox: {
        padding: 0,
        '& svg': {
            width: '3rem',
            height: '3rem'
        }
    },
    symbolContainer: {
        color: theme.palette.text.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    symbolContainerRowReversed: {
        color: theme.palette.text.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row-reverse'
    },
    simulatorSliderLabel: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        padding: theme.spacing(1, 0)
    },
    simulatorSliderLabelTypeB: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        padding: theme.spacing(1, 0),
        textAlign: 'center'
    },
    simulatorSwitch: {
        display: 'flex',
        justifyContent: 'center'
    },
    simulatorSwitchB: {
        display: 'flex'
    },
    simulatorSliderSection: {
        alignItems: 'center'
    },
    simulatorSliderInput: {
        margin: theme.spacing(0.35, 0),
        color: theme.palette.primary.contrastText
    },
    numberFormatInputContainer: {
        position: 'relative',
        width: theme.spacing(24)
    },
    sliderInputStyle: {
        marginLeft: theme.layoutSpacing(40),
        '& input': {
            textAlign: 'center'
        }
    },
    symbolStyle: {
        fontSize: theme.layoutSpacing(18),
        lineHeight: theme.layoutSpacing(32),
        paddingBottom: theme.layoutSpacing(6)
    },
    numberFormatInputBox: {
        width: theme.spacing(12),
        marginLeft: theme.spacing(2),
        '&&&:before': {
            borderBottom: 'none'
        },
        '&&:after': {
            borderBottom: 'none'
        },
        '&&:focus': {
            borderBottom: 'none'
        },
        '& input': {
            // padding: theme.spacing(1),
            backgroundColor: theme.palette.primary.dark,
            borderBottom: '2px solid ' + theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
            textAlign: 'right',
            padding: theme.spacing(0, 0.3, 0.3, 0),
            margin: theme.spacing(0.6, 0),
            fontSize: '1.8rem',
            minWidth: '100%'
            //borderRadius: '5px',
            // borderTopRightRadius:'5px',
            // borderBottomRightRadius:'5px'
        }
    },
    numberFormatInputStepper: {
        position: 'absolute',
        right: '0',
        fontSize: '1.8rem',
        color: 'transparent',
        textDecoration: 'none'
    },
    adornments: {
        marginRight: '0',
        '& .MuiTypography-root': {
            paddingLeft: theme.spacing(0.3),
            fontSize: '1.5rem',
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.dark
        }
    },
    simulatorSliderInputBox: {
        marginLeft: theme.spacing(2),
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            // padding: theme.spacing(1),
            backgroundColor: theme.palette.background.paper,
            border: '2px solid ' + theme.palette.background.paper,
            color: theme.palette.primary.contrastText,
            textAlign: 'right',
            padding: theme.spacing(0.3, 0),
            margin: theme.spacing(0.6, 0),
            fontSize: '1.8rem'
            //borderRadius: '5px',
            // borderTopRightRadius:'5px',
            // borderBottomRightRadius:'5px'
        }
    },
    simulatorSectionHeader: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontWeight: 400,
        padding: theme.spacing(2, 0)
    },
    simulatorOptimizeCellLabel: {
        float: 'left',
        fontSize: '1.5rem',
        padding: theme.spacing(1, 0),
        color: theme.palette.text.default
    },
    simulatorOptimizeCellInput: {
        marginLeft: theme.spacing(2),
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            // padding: theme.spacing(1),
            float: 'right',
            backgroundColor: theme.palette.primary.main,
            border: '2px solid ' + theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            textAlign: 'right',
            padding: theme.spacing(0.5, 0),
            margin: theme.spacing(0.6, 0),
            fontSize: '1.5rem',
            borderRadius: '5px'
        }
    }
}));

const CustomAltSimulatorContext = React.createContext({
    simulator_json: null,
    handleActiveSwitchChange: null,
    handleOptimizeSwitchChange: null,
    handleSliderInputChange: null
});

// const CodexSwitch = withStyles((theme) => ({
//     root: {
//         width: 42,
//         height: 22,
//         padding: 0,
//         margin: theme.spacing(1),
//     },
//     switchBase: {
//         padding: 1,
//         '&$checked': {
//             transform: 'translateX(16px)',
//             color: theme.palette.common.white,
//             '& + $track': {
//                 backgroundColor: '#52d869',
//                 opacity: 1,
//                 border: 'none',
//             },
//         },
//         '&$focusVisible $thumb': {
//             color: '#52d869',
//             border: '6px solid #fff',
//         },
//         '&$disabled + $track': {
//             backgroundColor: theme.palette.common.white,
//         },
//     },
//     track: {},
// }))(({ classes, ...props }) => {
//     return (
//         <Switch
//             disableRipple
//             classes={{
//                 root: classes.root,
//                 switchBase: classes.switchBase,
//                 track: classes.track,
//                 checked: classes.checked,
//             }}
//             {...props}
//         />
//     );
// });

// const CutomInputAdornment = withStyles((theme) => ({
//     root: {
//         color: theme.palette.primary.contrastText,
//         fontSize: '1.5rem'
//     }
// }))(({ classes, ...props }) => {
//     return (
//         <InputAdornment
//             disablePointerEvents={true}
//             disableTypography={false}
//             variant="standard"
//             fullwidth={true}
//             classes={{
//                 root: classes.root,
//                 positionStart: classes.root
//             }}
//             {...props}
//         />
//     );
// });

function Switches({ onChange, name, checked }) {
    // const classes = useStylesCustomSliders();
    const [checkedState, setCheckedState] = useState(checked);
    const [switchName] = useState(name);

    const handleChange = (event) => {
        setCheckedState(event.target.checked);
        onChange(Number(event.target.checked), switchName);
    };

    return (
        <ThemeProvider theme={theme}>
            <Switch checked={checkedState} onChange={handleChange} name={switchName} />
        </ThemeProvider>
    );
}

const CutomButtonGeneration = ({ ...params }) => {
    let { simulator_json } = useContext(CustomAltSimulatorContext);

    const renderer = (button, key) => {
        if (button.action_flag_type) {
            return (
                <Button
                    key={key}
                    variant={button.variant}
                    className={params.classes.button}
                    onClick={() => {
                        params.actionfunc(button.action_flag_type, simulator_json);
                    }}
                    aria-label={button.name}
                >
                    {button.name}
                </Button>
            );
        } else {
            switch (button.action) {
                // case 'change': return (<Button key={key} variant={button.variant} className={params.classes.button} onClick={params.changefunc}>{button.name}</Button>);
                // case 'reset': return (<Button key={key} variant={button.variant} className={params.classes.button} onClick={params.resetfunc}>{button.name}</Button>);
                // case 'submit': return (<Button key={key} variant={button.variant} className={params.classes.button} onClick={params.submitfunc}>{button.name}</Button>);
                // case 'upload': return (<Button key={key} variant={button.variant} className={params.classes.button} onClick={params.uploadfunc}>{button.name}</Button>);
                // case 'download': return (<Button key={key} variant={button.variant} className={params.classes.downloadSheet} onClick={params.downloadfunc}>{button.name}</Button>);

                default:
                    return (
                        <Button
                            key={key}
                            variant={button.variant}
                            className={params.classes.button}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );
            }
        }
    };

    return (
        <React.Fragment>
            {params.action_buttons
                ? params.action_buttons.map((button, key) => {
                      return <React.Fragment key={key}>{renderer(button, key)}</React.Fragment>;
                  })
                : ''}
        </React.Fragment>
    );
};

function CustomSliderInput({ input, section, props, type }) {
    const classes = useStylesCustomSliders();

    const [inputInfo, setinputInfo] = React.useState(props);
    const [_key] = useState(input);
    const [_section] = useState(section);

    let { handleActiveSwitchChange, handleOptimizeSwitchChange, handleSliderInputChange } =
        useContext(CustomAltSimulatorContext);

    const handleSliderChange = (event, newinputInfo) => {
        let newInputObj = { ...inputInfo, value: Number(newinputInfo) };
        setinputInfo(newInputObj);
        handleSliderInputChange(_key, _section, newInputObj);
    };

    const handleInputChange = (event) => {
        let value = event.target.value === '' ? '' : Number(event.target.value);
        //if (value >= inputInfo.min && value <= inputInfo.max) {
        let newInputObj = { ...inputInfo, value: value };
        setinputInfo(newInputObj);
        handleSliderInputChange(_key, _section, newInputObj);
        // }
    };

    const handleInputNumberChange = (event, inputInfo) => {
        let number_separator = inputInfo.number_separator
            ? inputInfo.number_separator
            : default_number_separator;
        if (number_separator === ',') {
            event.target.value = event.target.value.replace(/,/g, '');
        } else if (number_separator === '.') {
            event.target.value = event.target.value.replace(/\./g, '').replace(',', '.');
        }
        handleInputChange(event);
    };

    const handleNumberBlur = (event, inputInfo) => {
        let number_separator = inputInfo.number_separator
            ? inputInfo.number_separator
            : default_number_separator;
        if (number_separator === ',') {
            event.target.value = event.target.value.replace(/,/g, '');
        } else if (number_separator === '.') {
            event.target.value = event.target.value.replace(/\./g, '').replace(',', '.');
        }
        handleBlur(event);
    };

    const handleBlur = (event) => {
        //let newInputObj = { ...inputInfo, "value": value }
        let value = event.target.value === '' ? '' : Number(event.target.value);

        if (value < inputInfo.min) {
            let newInputObj = { ...inputInfo, value: inputInfo.min };
            setinputInfo(newInputObj);
            handleSliderInputChange(_key, _section, newInputObj);
        } else if (value > inputInfo.max) {
            let newInputObj = { ...inputInfo, value: inputInfo.max };
            setinputInfo(newInputObj);
            handleSliderInputChange(_key, _section, newInputObj);
        } else {
            let newInputObj = { ...inputInfo, value: value };
            setinputInfo(newInputObj);
            handleSliderInputChange(_key, _section, newInputObj);
        }
    };

    const handleOptimizeSwitch = (v) => {
        setinputInfo({ ...inputInfo, flag_optimize: v });
        handleOptimizeSwitchChange(_key, _section, v);
    };
    const handleActiveSwitch = (v) => {
        setinputInfo({ ...inputInfo, flag_active: v });
        handleActiveSwitchChange(_key, _section, v);
    };

    return (
        <React.Fragment>
            {(type === null || type === 'typeA') && (
                <Grid container direction="row" spacing={2}>
                    <Grid item xs={3}>
                        <Typography
                            id={'input-slider-heading' + inputInfo.id}
                            className={classes.simulatorSliderLabel}
                            variant="h5"
                            gutterBottom
                        >
                            {/* <Checkboxes /> */}
                            {inputInfo.label}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Switches
                            onChange={handleActiveSwitch}
                            name={_key + '_' + _section + '_active'}
                            checked={Boolean(inputInfo.flag_active)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Switches
                            onChange={handleOptimizeSwitch}
                            name={_key + '_' + _section + '_optimize'}
                            checked={Boolean(inputInfo.flag_optimize)}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <Slider
                            className={classes.simulatorSliderInput}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            value={inputInfo.value}
                            step={inputInfo.steps || 0.01}
                            max={inputInfo.max}
                            min={inputInfo.min}
                            disabled={!inputInfo.flag_active}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <ThemeProvider theme={theme}>
                            <div
                                className={`${classes.numberFormatInputContainer} ${classes.sliderInputStyle}`}
                            >
                                <Input
                                    className={classes.numberFormatInputStepper}
                                    value={inputInfo.value}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    fullWidth={true}
                                    inputProps={{
                                        step: inputInfo.steps,
                                        min: inputInfo.min,
                                        max: inputInfo.max,
                                        type: 'number',
                                        lang: 'en',
                                        'aria-labelledby': 'input-slider'
                                    }}
                                    disabled={!inputInfo.flag_active}
                                />
                                {inputInfo.flag_active ? (
                                    <div
                                        className={`${
                                            inputInfo.value_symbol_position === 'end'
                                                ? classes.symbolContainerRowReversed
                                                : classes.symbolContainer
                                        }`}
                                    >
                                        <div className={classes.symbolStyle}>
                                            {getCurrencySymbol(
                                                inputInfo.value_symbol || default_number_prefix
                                            )}
                                        </div>
                                        <NumberFormat
                                            className={classes.numberFormatInputBox}
                                            value={inputInfo.value}
                                            margin="dense"
                                            onChange={(e) => handleInputNumberChange(e, inputInfo)}
                                            onBlur={(e) => handleNumberBlur(e, inputInfo)}
                                            customInput={Input}
                                            fullWidth={true}
                                            thousandSeparator={
                                                inputInfo.number_separator
                                                    ? inputInfo.number_separator
                                                    : default_number_separator
                                            }
                                            decimalSeparator={
                                                inputInfo.decimal_separator
                                                    ? inputInfo.decimal_separator
                                                    : default_decimal_separator
                                            }
                                            disabled={!inputInfo.flag_active}
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </ThemeProvider>
                    </Grid>
                    <Grid item xs={1}></Grid>
                </Grid>
            )}
            {type && type === 'typeB' && (
                <Grid
                    container
                    className={classes.simulatorSliderSection}
                    direction="row"
                    spacing={2}
                >
                    <Grid item xs={4}>
                        <span className={classes.simulatorSliderLabel}>{inputInfo.label}</span>
                        <Slider
                            className={classes.simulatorSliderInput}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            value={inputInfo.value}
                            step={inputInfo.steps || 0.01}
                            max={inputInfo.max}
                            min={inputInfo.min}
                            // disabled={!Boolean(inputInfo.flag_active)}
                        />
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={2}>
                        {inputInfo.flag_active !== undefined ? (
                            <div>
                                <div className={classes.simulatorSliderLabel}>{'Active'}</div>
                                <div className={classes.simulatorSwitchB}>
                                    <Switches
                                        onChange={handleActiveSwitch}
                                        name={_key + '_' + _section + '_active'}
                                        checked={Boolean(inputInfo.flag_active)}
                                    />
                                </div>
                            </div>
                        ) : null}
                    </Grid>
                    <Grid item xs={2}>
                        {inputInfo.flag_optimize !== undefined ? (
                            <div>
                                <div className={classes.simulatorSliderLabel}>{'Optimize'}</div>
                                <div className={classes.simulatorSwitchB}>
                                    <Switches
                                        onChange={handleOptimizeSwitch}
                                        name={_key + '_' + _section + '_optimize'}
                                        checked={Boolean(inputInfo.flag_optimize)}
                                    />
                                </div>
                            </div>
                        ) : null}
                    </Grid>
                    <Grid item xs={2}>
                        <ThemeProvider theme={theme}>
                            <div className={classes.numberFormatInputContainer}>
                                <Input
                                    className={classes.numberFormatInputStepper}
                                    value={inputInfo.value}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    fullWidth={true}
                                    inputProps={{
                                        step: inputInfo.steps,
                                        min: inputInfo.min,
                                        max: inputInfo.max,
                                        type: 'number',
                                        lang: 'en',
                                        'aria-labelledby': 'input-slider'
                                    }}
                                    disabled={!inputInfo.flag_active}
                                />
                                <div
                                    className={
                                        inputInfo.value_symbol_position === 'end'
                                            ? classes.symbolContainerRowReversed
                                            : classes.symbolContainer
                                    }
                                >
                                    <div
                                        style={{
                                            fontSize: '2rem',
                                            paddingLeft:
                                                inputInfo.value_symbol_position === 'end'
                                                    ? '0px'
                                                    : '2rem'
                                        }}
                                    >
                                        {getCurrencySymbol(
                                            inputInfo.value_symbol || default_number_prefix
                                        )}
                                    </div>
                                    <NumberFormat
                                        className={classes.numberFormatInputBox}
                                        value={inputInfo.value}
                                        margin="dense"
                                        onChange={(e) => handleInputNumberChange(e, inputInfo)}
                                        onBlur={(e) => handleNumberBlur(e, inputInfo)}
                                        customInput={Input}
                                        fullWidth={true}
                                        thousandSeparator={
                                            inputInfo.number_separator
                                                ? inputInfo.number_separator
                                                : default_number_separator
                                        }
                                        decimalSeparator={
                                            inputInfo.decimal_separator
                                                ? inputInfo.decimal_separator
                                                : default_decimal_separator
                                        }
                                        disabled={!inputInfo.flag_active}
                                    />
                                </div>
                            </div>
                        </ThemeProvider>
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
}

/**
 * @summary AlternateSimulator is the first experimental Simulator created to customize functionality asked by a client. It will enable the user to turn on/off a slider based on the need.
 */
export default function AlternateSimulator({ params, ...props }) {
    const classes = useStyles();
    const [state, setState] = useState(params);

    useEffect(() => {}, [state]);
    const handleActiveChange = (input_index, section_index, value) => {
        let temp_state = { ...state };
        temp_state.section_inputs[state.sections[section_index]][input_index]['flag_active'] =
            value;

        setState({
            ...state,
            ...temp_state
        });
    };
    const handleOptimizeChange = (input_index, section_index, value) => {
        let temp_state = { ...state };
        temp_state.section_inputs[state.sections[section_index]][input_index]['flag_optimize'] =
            value;

        setState({
            ...state,
            ...temp_state
        });
    };
    const handleSliderInputChange = (input_index, section_index, value) => {
        let temp_state = { ...state };
        temp_state.section_inputs[state.sections[section_index]][input_index] = value;

        setState({
            ...state,
            ...temp_state
        });
    };
    const loadScenario = (scenario) => {
        let timerId;
        setState(false);
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            setState(scenario.scenarios_json);
        }, 5000);
        props.onLoadScenario(scenario.scenarios_json);
    };
    const getTotalvalue = (sectionInps) => {
        var value = 0;
        _.each(sectionInps, function (section) {
            value = section.value + value;
        });

        return value.toLocaleString();
    };
    const inputRenderer = (input, inputIndex, sectionIndex, grid) => {
        return (
            <CustomSliderInput
                input={inputIndex}
                type={params.simulator_type ? params.simulator_type : null}
                section={sectionIndex}
                grid={grid}
                props={{ ...input }}
                key={'input' + inputIndex}
            />
        );
    };

    const actionRenderer = (actions) => {
        return (
            <Box display="flex" width="100%">
                <div></div>
                <Box marginLeft="auto">
                    {
                        <CutomButtonGeneration
                            action_buttons={actions}
                            classes={classes}
                            actionfunc={props.parent_obj.handleAltActionInvoke}
                        />
                    }
                    <SaveScenario
                        filters_json={props.parent_obj.props.selected_filters}
                        scenarios_json={params}
                        screen_id={props.parent_obj.props.screen_id}
                        app_id={props.parent_obj.props.app_id}
                        widget_id={props.parent_obj.props.details.id}
                        getScenarios={props.getScenarios}
                    />
                    {props.savedScenarios.length > 0 ? (
                        <LoadScenario
                            screen_id={props.parent_obj.props.screen_id}
                            app_id={props.parent_obj.props.app_id}
                            widget_id={props.parent_obj.props.details.id}
                            savedScenarios={props.savedScenarios}
                            getScenarios={props.getScenarios}
                            loadScenario={loadScenario}
                        />
                    ) : (
                        ''
                    )}
                    {/* <Button onClick={closeSimulator} variant={"contained"} className={classes.buttonFloat} startIcon={<CloseIcon />}>
                        Close
                    </Button> */}
                </Box>
            </Box>
        );
    };

    const sectionRenderer = (state, section, sectionInps, sectionIndex, grid, type) => {
        return (
            <React.Fragment key={'section' + sectionIndex}>
                {type && type === 'custom' && (
                    <AlternateSimulatorCustomType section={section} sectionInps={sectionInps} />
                )}
                {(type === null || type === 'typeA') && (
                    <React.Fragment>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"
                        >
                            <Grid item xs={3}>
                                <Typography
                                    variant={'h6'}
                                    className={classes.simulatorSectionHeader}
                                >
                                    {section}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography
                                    variant={'h6'}
                                    className={classes.simulatorSectionHeader}
                                >
                                    {'Active'}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography
                                    variant={'h6'}
                                    className={classes.simulatorSectionHeader}
                                >
                                    {'Optimize'}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    variant={'h6'}
                                    className={classes.simulatorSectionHeader}
                                >
                                    {'Manual Entry'}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container direction="row">
                            {sectionInps.map((input, key) => {
                                return inputRenderer(input, key, sectionIndex, grid);
                            })}
                        </Grid>
                    </React.Fragment>
                )}

                {type && type === 'typeB' && (
                    <React.Fragment>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"
                            className={classes.simulatorSection}
                        >
                            <Grid item xs={2}>
                                <Typography
                                    id={'section'}
                                    variant="h5"
                                    gutterBottom
                                    className={classes.sectionHeading}
                                >
                                    {section}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={
                                    params.simulator_type && params.simulator_type === 'typeB'
                                        ? 8
                                        : 10
                                }
                            >
                                {sectionInps.map((input, key) => {
                                    return inputRenderer(input, key, sectionIndex, grid);
                                })}
                            </Grid>
                            {params.simulator_type && params.simulator_type === 'typeB' && (
                                <Grid item xs={2} className={classes.totalValues}>
                                    {/* <ThemeProvider theme={theme}> */}
                                    <div className={classes.simulatorSliderLabel}>{'Total'}</div>
                                    <div
                                        className={classes.simulatorTotal}
                                        style={{
                                            flexDirection:
                                                state.section_inputs.total_symbol_position === 'end'
                                                    ? 'row-reverse'
                                                    : 'row'
                                        }}
                                    >
                                        <div>
                                            {getCurrencySymbol(
                                                state.section_inputs.total_symbol ||
                                                    default_number_prefix
                                            )}
                                        </div>
                                        <div>{getTotalvalue(sectionInps)}</div>
                                    </div>
                                </Grid>
                            )}
                        </Grid>
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    };

    return (
        <div>
            {state ? (
                <CustomAltSimulatorContext.Provider
                    value={{
                        simulator_json: state,
                        handleActiveSwitchChange: handleActiveChange,
                        handleOptimizeSwitchChange: handleOptimizeChange,
                        handleSliderInputChange: handleSliderInputChange
                    }}
                >
                    <Grid container direction="row" className={classes.customGridContainer}>
                        {props.show_simulator ? (
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Box
                                    className={`${classes.closeIcon} ${
                                        classes.closeIconContainer
                                    } ${
                                        !state?.sections?.length ? classes.closeIconWithoutCont : ''
                                    }`}
                                    onClick={props.onCloseSimulator}
                                >
                                    <CloseIcon />
                                </Box>
                                <Grid container>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        className={classes.simulatorContainer}
                                    >
                                        {state?.simulator_type == 'custom' && (
                                            <div className={classes.customContainer}>
                                                <Grid container direction="row" spacing={2}>
                                                    {state?.headers} &&{' '}
                                                    {state?.headers.map((value, key) => (
                                                        <Grid item xs={2} key={`${value}_${key}`}>
                                                            <Typography variant="h5">
                                                                {value}
                                                            </Typography>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </div>
                                        )}
                                        {state.sections.map((section, index) => {
                                            return sectionRenderer(
                                                state,
                                                section,
                                                state.section_inputs[section],
                                                index,
                                                12,
                                                params.simulator_type ? params.simulator_type : null
                                            );
                                        })}
                                    </Grid>
                                    <hr style={{ width: '100%' }} />
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        className={
                                            !state?.sections?.length ? classes.actionContainer : ''
                                        }
                                    >
                                        <React.Fragment>
                                            {actionRenderer(state.actions)}
                                        </React.Fragment>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : (
                            ''
                        )}

                        {state.graph_info ? (
                            <GraphInfo
                                graphInfo={state.graph_info}
                                size_nooverride={false}
                                color_nooverride={true}
                            />
                        ) : null}
                    </Grid>
                </CustomAltSimulatorContext.Provider>
            ) : (
                <CodxCircularLoader size={60} center />
            )}
        </div>
    );
}
