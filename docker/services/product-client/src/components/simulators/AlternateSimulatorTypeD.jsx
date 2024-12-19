import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, withStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import {
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Checkbox,
    Box
} from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { GraphInfo } from '../graphInfo/GraphInfo';
import SaveScenario from '../AppScenarioComponent/saveScenario';
import LoadScenario from '../AppScenarioComponent/loadScenario';
import CodxCircularLoader from '../CodxCircularLoader';
import Tooltip from '@material-ui/core/Tooltip';
import ActionButtons from '../dynamic-form/inputFields/ActionButtons';
import TextInput from '../dynamic-form/inputFields/textInput';
import { triggerWidgetActionHandler } from 'services/widget.js';
import { getCurrencySymbol } from 'common/utils';
import * as _ from 'underscore';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    tableContainer: {
        padding: theme.spacing(1.2),
        width: '100%'
    },
    buttonFloat: {
        float: 'right',
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
        padding: theme.spacing(2, 0),
        textDecoration: 'underline'
    },
    simulatorSliderInputBoxContainer: {
        color: theme.palette.text.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    simulatorSliderInputBox: {
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
            fontSize: '1.8rem',
            paddingRight: '5px',
            width: '11rem'
        },
        '& input[type=number]': {
            '-moz-appearance': 'textfield'
        },
        '& input[type=number]::-webkit-outer-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        },
        '& input[type=number]::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
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
    confirmationError: {
        fontSize: '1.3rem',
        width: '50%',
        color: 'red',
        marginLeft: '5%',
        marginTop: '-4%'
    },
    checkboxLabel: {
        fontSize: '1.75rem'
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
                    fontSize: '2.1rem',
                    color: th.palette.primary.contrastText + ' !important',
                    backgroundColor: th.palette.primary.main
                }
            },
            MuiInputAdornment: {
                positionStart: {
                    marginRight: th.spacing(0)
                }
            },
            MuiSlider: {
                mark: {
                    height: 5,
                    width: 2,
                    marginTop: -2
                },
                markActive: {
                    backgroundColor: 'purple'
                },
                markLabel: {
                    color: th.palette.primary.contrastText,
                    fontSize: '1.2rem'
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
    simulatorSliderLabel: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        padding: theme.spacing(1, 0),
        textAlign: 'center'
    },
    simulatorSwitch: {
        display: 'flex',
        justifyContent: 'center'
    },
    simulatorSliderSection: {
        alignItems: 'center'
    },
    simulatorSliderInput: {
        margin: theme.spacing(0.35, 0),
        color: theme.palette.primary.contrastText
    },
    simulatorSliderInputBox: {
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
            fontSize: '1.8rem',
            paddingRight: '5px',
            width: '11rem'
        },
        '& input[type=number]': {
            '-moz-appearance': 'textfield'
        },
        '& input[type=number]::-webkit-outer-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        },
        '& input[type=number]::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        },
        '& .Mui-disabled': {
            color: theme.palette.primary.contrastText
        }
    },
    simulatorSectionHeader: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontWeight: 400,
        padding: theme.spacing(2, 0),
        textDecoration: 'underline'
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
    },
    adornments: {
        color: theme.palette.primary.contrastText,
        fontSize: '1.5rem'
    },
    sliderMinErrorMsg: {
        marginLeft: '3.7rem',
        fontSize: '1.4rem',
        color: 'red'
    },
    sliderMaxErrorMsg: {
        marginRight: '1.7rem',
        fontSize: '1.4rem',
        float: 'right',
        color: 'red'
    },
    sliderSection: {
        [theme.breakpoints.up('sm')]: {
            width: '20rem' //'15rem'
        },
        [theme.breakpoints.up('md')]: {
            width: '25rem' //'30rem'
        },
        [theme.breakpoints.up('lg')]: {
            width: '30rem' //'45rem'
        },
        '@media (min-width: 960px) and (max-width: 1000px)': {
            width: '20rem'
        },
        width: '30rem'
    }
}));

const CustomAltSimulatorContext = React.createContext({
    simulator_json: null,
    default_json: null,
    handleActiveSwitchChange: null,
    handleOptimizeSwitchChange: null,
    handleSliderInputChange: null
});

// const CodexSwitch = withStyles((theme) => ({
//     root: {
//         width: 42,
//         height: 22,
//         padding: 0,
//         margin: theme.spacing(1)
//     },
//     switchBase: {
//         padding: 1,
//         '&$checked': {
//             transform: 'translateX(16px)',
//             color: theme.palette.common.white,
//             '& + $track': {
//                 backgroundColor: '#52d869',
//                 opacity: 1,
//                 border: 'none'
//             }
//         },
//         '&$focusVisible $thumb': {
//             color: '#52d869',
//             border: '6px solid #fff'
//         },
//         '&$disabled + $track': {
//             backgroundColor: theme.palette.common.white
//         }
//     },
//     track: {}
// }))(({ classes, ...props }) => {
//     return (
//         <Switch
//             disableRipple
//             classes={{
//                 root: classes.root,
//                 switchBase: classes.switchBase,
//                 track: classes.track,
//                 checked: classes.checked
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

const CutomButtonGeneration = ({ props, ...params }) => {
    let { simulator_json, default_json } = useContext(CustomAltSimulatorContext);

    const renderer = (button, key) => {
        if (button.action_flag_type) {
            return (
                <Button
                    key={key}
                    variant={button.variant}
                    className={params.classes.button}
                    onClick={() => {
                        handleButtonClick(button.action_flag_type);
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

    const handleButtonClick = async (action_flag_type) => {
        let request_id = props.parent_obj.state.request_id + 1;
        if (action_flag_type == 'reset') {
            request_id = 0;
            props.parent_obj.setRequestId(request_id);
            params.actionfunc(action_flag_type, simulator_json, default_json, request_id);
        } else if (action_flag_type === 'save_scenario' && params.namePopup) {
            params.popupAction(action_flag_type);
        } else if (action_flag_type === 'save_scenario' && !params.namePopup) {
            params.onTriggerNotification({
                notification: {
                    message: 'Request Is Being Processed',
                    severity: 'info'
                }
            });
            const resp = await params.onAction({
                actionType: action_flag_type,
                data: simulator_json
            });
            if (resp.message) {
                params.onTriggerNotification({
                    notification: {
                        message: resp.message,
                        severity: resp?.error ? 'error' : 'success'
                    }
                });
            }
        } else if (action_flag_type === 'load_scenario') {
            params.popupAction(action_flag_type);
        } else {
            props.parent_obj.setRequestId(request_id);
            params.actionfunc(action_flag_type, simulator_json, default_json, request_id);
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

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11
    }
}))(Tooltip);

function ValueLabelComponent(props) {
    const { children, open, value } = props;

    return (
        <LightTooltip
            open={open}
            placement="top"
            arrow
            interactive
            enterTouchDelay={0}
            title={value}
        >
            {children}
        </LightTooltip>
    );
}

function CustomSliderInput({ input, section, props }) {
    const classes = useStylesCustomSliders();
    const [inputInfo, setinputInfo] = React.useState(props);
    const [_key] = useState(input);
    const [_section] = useState(section);

    const softBound = props.soft_bound;

    const [sliderRange, setSliderRange] = useState(props.sliderValue || props.slider_value);

    const [minBoundError, setMinBoundError] = useState(false);
    const [maxBoundError, setMaxBoundError] = useState(false);

    let { handleActiveSwitchChange, handleOptimizeSwitchChange, handleSliderInputChange } =
        useContext(CustomAltSimulatorContext);

    const [focus, setFocus] = useState({
        minConstraint: false,
        maxConstraint: false,
        budget: false
    });
    const [blur, setBlur] = useState({
        minConstraint: true,
        maxConstraint: true,
        budget: true
    });
    const handleSliderChange = (event, newinputInfo) => {
        setSliderRange(newinputInfo);
        let newInputObj = { ...inputInfo, sliderValue: newinputInfo };
        setinputInfo(newInputObj);
        handleSliderInputChange(_key, _section, newInputObj);

        newinputInfo[0] < softBound[0] ? setMinBoundError(true) : setMinBoundError(false);

        if (newinputInfo[1] > softBound[1]) {
            setMaxBoundError(true);
        } else {
            setMaxBoundError(false);
        }
    };

    const handleMinValueChange = (event) => {
        let value = event.target.value === '' ? 0 : Number(event.target.value);
        setSliderRange([value, sliderRange[1]]);
        let newInputObj = { ...inputInfo, sliderValue: [value, sliderRange[1]] };
        setinputInfo(newInputObj);
        handleSliderInputChange(_key, _section, newInputObj);

        if (value < softBound[0]) {
            setMinBoundError(true);
        } else {
            setMinBoundError(false);
        }
    };

    const handleMaxValueChange = (event) => {
        let value = event.target.value === '' ? 0 : Number(event.target.value);
        setSliderRange([sliderRange[0], value]);
        let newInputObj = { ...inputInfo, sliderValue: [sliderRange[0], value] };
        setinputInfo(newInputObj);
        handleSliderInputChange(_key, _section, newInputObj);

        if (value > softBound[1]) {
            setMaxBoundError(true);
        } else {
            setMaxBoundError(false);
        }
    };

    const handleInputChange = (event) => {
        let value = event.target.value === '' ? '' : Number(event.target.value);

        let newInputObj = { ...inputInfo, value: value };
        setinputInfo(newInputObj);
        handleSliderInputChange(_key, _section, newInputObj);
    };

    const handlePrimaryInputChange = (event) => {
        const enterdValue = event.target.value;
        if (
            enterdValue.endsWith('.') &&
            enterdValue.indexOf('.') !== enterdValue.lastIndexOf('.')
        ) {
            return;
        }
        let value =
            event.target.value === ''
                ? ''
                : enterdValue.endsWith('.')
                ? enterdValue
                : Number(enterdValue.replaceAll(',', ''));
        let newInputObj = { ...inputInfo, primary_input_value: value };
        setinputInfo(newInputObj);
        handleSliderInputChange(_key, _section, newInputObj);
    };
    const handleBlur = (event) => {
        if (event.target.value.endsWith('.')) {
            let value = Number(event.target.value.replaceAll(',', ''));
            let newInputObj = { ...inputInfo, primary_input_value: value };
            setinputInfo(newInputObj);
            handleSliderInputChange(_key, _section, newInputObj);
        }
    };
    // const handleBlur = (event) => {
    //     let value = event.target.value === '' ? '' : Number(event.target.value);

    //     if (value < inputInfo.min) {
    //         let newInputObj = { ...inputInfo, value: inputInfo.min };
    //         setinputInfo(newInputObj);
    //         handleSliderInputChange(_key, _section, newInputObj);
    //     } else if (value > inputInfo.max) {
    //         let newInputObj = { ...inputInfo, value: inputInfo.max };
    //         setinputInfo(newInputObj);
    //         handleSliderInputChange(_key, _section, newInputObj);
    //     } else {
    //         let newInputObj = { ...inputInfo, value: value };
    //         setinputInfo(newInputObj);
    //         handleSliderInputChange(_key, _section, newInputObj);
    //     }
    // };

    const handleOptimizeSwitch = (v) => {
        setinputInfo({ ...inputInfo, flag_optimize: v });
        handleOptimizeSwitchChange(_key, _section, v);
    };
    const handleActiveSwitch = (v) => {
        setinputInfo({ ...inputInfo, flag_active: v });
        handleActiveSwitchChange(_key, _section, v);
    };

    const getFormattedValue = (v) => {
        return v?.toLocaleString(inputInfo.localeFormat, {
            ...(inputInfo.localeStyle && { style: inputInfo.localeStyle }),
            ...(inputInfo.localeCurrency && { currency: inputInfo.localeCurrency })
        });
    };

    const getFormattedSliderMarks = (marks, locale) => {
        marks.map((m) => {
            if (m.label) {
                m.label = m.label.toLocaleString(locale);
            }
        });
        return marks;
    };
    return (
        <React.Fragment>
            <Grid container className={classes.simulatorSliderSection} direction="row" spacing={2}>
                <Grid item xs={3}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}
                    >
                        <span
                            style={{
                                width: '80px',
                                alignItems: 'center',
                                justifyContent: 'space-around'
                            }}
                            className={classes.simulatorSliderLabel}
                        >
                            {inputInfo.label}
                        </span>
                        {inputInfo.enable_active_toggle ? (
                            <div>
                                {input == 0 ? (
                                    <div className={classes.simulatorSliderLabel}>{'Active'}</div>
                                ) : null}
                                <div className={classes.simulatorSwitch}>
                                    <Switches
                                        onChange={handleActiveSwitch}
                                        name={_key + '_' + _section + '_active'}
                                        checked={Boolean(inputInfo.flag_active)}
                                    />
                                </div>
                            </div>
                        ) : null}
                        {inputInfo.enable_optimize_toggle ? (
                            <div>
                                {input == 0 ? (
                                    <div className={classes.simulatorSliderLabel}>{'Optimize'}</div>
                                ) : null}
                                <div className={classes.simulatorSwitch}>
                                    <Switches
                                        onChange={handleOptimizeSwitch}
                                        name={_key + '_' + _section + '_optimize'}
                                        checked={Boolean(inputInfo.flag_optimize)}
                                    />
                                </div>
                            </div>
                        ) : null}
                    </div>
                </Grid>
                {inputInfo.enable_primary_input ? (
                    <Grid item xs={2}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'space-around'
                            }}
                        >
                            <Input
                                className={classes.simulatorSliderInputBox}
                                value={
                                    inputInfo.localeString
                                        ? getFormattedValue(inputInfo.primary_input_value)
                                        : inputInfo.primary_input_value
                                }
                                margin="dense"
                                onChange={handlePrimaryInputChange}
                                onBlur={handleBlur}
                                name="primary_input_value"
                            />
                        </div>
                    </Grid>
                ) : null}
                {props?.enable_slider ? (
                    <Grid item xs={7}>
                        <article
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around'
                            }}
                        >
                            <section
                                style={{
                                    display: 'inline-block',
                                    alignItems: 'center',
                                    justifyContent: 'space-around'
                                }}
                            >
                                <ThemeProvider theme={theme}>
                                    {input == 0 ? (
                                        <div className={classes.simulatorSliderLabel}>
                                            {'Min Constraint'}
                                        </div>
                                    ) : null}
                                    <Input
                                        className={classes.simulatorSliderInputBox}
                                        value={
                                            inputInfo.localeString
                                                ? blur.minConstraint
                                                    ? getFormattedValue(sliderRange[0])
                                                    : sliderRange[0]
                                                : sliderRange[0]
                                        }
                                        onFocus={() => {
                                            setFocus({ ...focus, minConstraint: true });
                                            setBlur({ ...blur, minConstraint: false });
                                        }}
                                        onBlur={() => {
                                            setFocus({ ...focus, minConstraint: false });
                                            setBlur({ ...blur, minConstraint: true });
                                        }}
                                        margin="dense"
                                        onChange={handleMinValueChange}
                                        // onBlur={handleBlur}
                                        name="numberformat"
                                        startAdornment={
                                            <InputAdornment position="start"> </InputAdornment>
                                        }
                                        inputProps={{
                                            step: inputInfo.steps,
                                            min: inputInfo.min,
                                            max: inputInfo.max,
                                            ...(focus.minConstraint
                                                ? { type: 'number' }
                                                : { type: 'text' }),
                                            lang: 'en',
                                            'aria-labelledby': 'input-slider'
                                        }}
                                        disabled={
                                            !inputInfo.flag_active || !inputInfo.display_slider
                                        }
                                    />
                                </ThemeProvider>
                            </section>
                            <section
                                className={classes.sliderSection}
                                style={{ paddingTop: input == 0 && '3.5rem' }}
                            >
                                <ThemeProvider theme={theme}>
                                    <Slider
                                        className={classes.simulatorSliderInput}
                                        onChange={handleSliderChange}
                                        valueLabelDisplay="auto"
                                        ValueLabelComponent={ValueLabelComponent}
                                        marks={
                                            inputInfo.localeString
                                                ? getFormattedSliderMarks(
                                                      props.marks,
                                                      inputInfo.localeFormat
                                                  )
                                                : props.marks
                                        }
                                        value={sliderRange}
                                        step={inputInfo.steps || 0.01}
                                        max={inputInfo.max}
                                        min={inputInfo.min}
                                        disabled={
                                            !inputInfo.flag_active || !inputInfo.display_slider
                                        }

                                        // disableSwap
                                    />
                                </ThemeProvider>
                            </section>
                            <section
                                style={{
                                    display: 'inline-block',
                                    alignItems: 'center',
                                    justifyContent: 'space-around'
                                }}
                            >
                                <ThemeProvider theme={theme}>
                                    {input == 0 ? (
                                        <div className={classes.simulatorSliderLabel}>
                                            {'Max Constraint'}
                                        </div>
                                    ) : null}
                                    <Input
                                        className={classes.simulatorSliderInputBox}
                                        value={
                                            inputInfo.localeString
                                                ? blur.maxConstraint
                                                    ? getFormattedValue(sliderRange[1])
                                                    : sliderRange[1]
                                                : sliderRange[1]
                                        }
                                        onFocus={() => {
                                            setFocus({ ...focus, maxConstraint: true });
                                            setBlur({ ...blur, maxConstraint: false });
                                        }}
                                        onBlur={() => {
                                            setFocus({ ...focus, maxConstraint: false });
                                            setBlur({ ...blur, maxConstraint: true });
                                        }}
                                        margin="dense"
                                        onChange={handleMaxValueChange}
                                        // onBlur={handleBlur}
                                        name="numberformat"
                                        startAdornment={
                                            <InputAdornment position="start"> </InputAdornment>
                                        }
                                        inputProps={{
                                            step: inputInfo.steps,
                                            min: inputInfo.min,
                                            max: inputInfo.max,
                                            ...(focus.maxConstraint
                                                ? { type: 'number' }
                                                : { type: 'text' }),
                                            lang: 'en',
                                            'aria-labelledby': 'input-slider'
                                        }}
                                        disabled={
                                            !inputInfo.flag_active || !inputInfo.display_slider
                                        }
                                        fullWidth={true}
                                    />
                                </ThemeProvider>
                            </section>
                        </article>
                        <section>
                            {minBoundError ? (
                                <span className={classes.sliderMinErrorMsg}>
                                    {'You are exceding the base minimum bound value'}
                                </span>
                            ) : null}
                            {maxBoundError ? (
                                <span className={classes.sliderMaxErrorMsg}>
                                    {'You are exceding the base maximum bound value'}
                                </span>
                            ) : null}
                        </section>
                    </Grid>
                ) : null}

                {props?.enable_secondary_input ? (
                    <Grid item xs={1}>
                        <ThemeProvider theme={theme}>
                            {input == 0 ? (
                                <div className={classes.simulatorSliderLabel}>
                                    {inputInfo?.secondary_label}
                                </div>
                            ) : null}
                            <Input
                                className={classes.simulatorSliderInputBox}
                                value={
                                    inputInfo.localeString
                                        ? blur.budget
                                            ? getFormattedValue(inputInfo.value)
                                            : inputInfo.value
                                        : inputInfo.value
                                }
                                margin="dense"
                                onChange={handleInputChange}
                                // onBlur={handleBlur}
                                onFocus={() => {
                                    setFocus({ ...focus, budget: true });
                                    setBlur({ ...blur, budget: false });
                                }}
                                onBlur={() => {
                                    setFocus({ ...focus, budget: false });
                                    setBlur({ ...blur, budget: true });
                                }}
                                fullWidth={true}
                                name="numberformat"
                                startAdornment={<InputAdornment position="start"> </InputAdornment>}
                                inputProps={{
                                    step: inputInfo.steps,
                                    // min: inputInfo.min,
                                    // max: inputInfo.max,
                                    ...(focus.budget ? { type: 'number' } : { type: 'text' }),
                                    lang: 'en',
                                    'aria-labelledby': 'input-slider'
                                    // startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                                }}
                                disabled={!inputInfo.enable_secondary_edit}
                                // readOnly={Boolean(inputInfo.flag_active)}
                            />
                        </ThemeProvider>
                    </Grid>
                ) : null}
            </Grid>
        </React.Fragment>
    );
}

function SaveScenarioConfirmation({ open, classes, onClose, onAction, defaultScenarioName }) {
    const [scenarioName, setScenarioName] = useState(defaultScenarioName);
    const [error, setError] = useState('');
    const handleAction = async (e) => {
        if (e.name === 'Cancel') {
            onClose();
            setScenarioName(defaultScenarioName);
            setError('');
        } else {
            try {
                if (!scenarioName) {
                    setError('Please Enter Scenario Name');
                } else {
                    onClose();
                    setError('');
                    await onAction({ scenarioName: scenarioName });
                }
            } catch (err) {
                // console.error(err);
            }
        }
    };

    const onChangeScenarioName = (v) => {
        setError('');
        setScenarioName(v);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            aria-labelledby="alternate-simulator-typed-save-scenario"
        >
            <DialogTitle id="alternate-simulator-typed-save-scenario">
                <Typography variant="h4" className={classes.defaultColor}>
                    Save Scenario
                </Typography>
            </DialogTitle>
            <DialogContent>
                <TextInput
                    fieldInfo={{
                        name: 'scenarioName',
                        label: 'Scenario name',
                        required: true,
                        variant: 'outlined',
                        fullWidth: true,
                        value: scenarioName
                    }}
                    onChange={onChangeScenarioName}
                />
            </DialogContent>
            <DialogActions className={classes.actionsStyle} disableSpacing={true}>
                <Typography className={classes.confirmationError}>{error}</Typography>
                <ActionButtons
                    params={[{ name: 'Cancel' }, { name: 'Save', variant: 'contained' }]}
                    onClick={handleAction}
                />
            </DialogActions>
        </Dialog>
    );
}

const LoadScenarioConfirmation = (props) => {
    const [selectedScenario, setSelectedScenario] = useState('');

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setSelectedScenario(checked ? value : '');
    };

    const handleClick = () => {
        const scenario = props.scenariosList.find((scene) => scene.name === selectedScenario);
        props.onClose();
        props.onLoadClick(scenario);
    };

    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth>
            <DialogTitle>
                <Typography variant="h4" className={props.classes.defaultColor}>
                    Select a Scenario to Load
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {props.scenariosList.map((scene) => (
                        <Grid item xs={4} key={scene.name}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedScenario === scene.name}
                                        onChange={handleCheckboxChange}
                                        value={scene.name}
                                    />
                                }
                                label={scene.name}
                                classes={{ label: props.classes.checkboxLabel }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions className={props.classes.actionsStyle}>
                <React.Fragment>
                    <Button
                        variant="contained"
                        onClick={handleClick}
                        disabled={!selectedScenario}
                        aria-label="Load"
                    >
                        Load
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setSelectedScenario('');
                            props.onClose();
                        }}
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                </React.Fragment>
            </DialogActions>
        </Dialog>
    );
};

// const default_filters = {
//     'Product Line': ['Danone'],
//     Brand: ['All'],
//     'Marketing Channels': ['All'],
//     Touchpoints: ['All'],
//     Drivers: ['All'],
//     'Time Period': 'Jun 2020'
// };

/**
 * @summary AlternateSimulatorType is the first experimental Simulator created to customize functionality asked by a client. It will enable the user to turn on/off a slider based on the need.
 */
export default function AlternateSimulatorTypeD({
    params,
    onAction,
    onTriggerNotification,
    ...props
}) {
    const classes = useStyles();
    const defaultState = Object.assign({}, params ? params : null);
    const [state, setState] = useState(JSON.parse(JSON.stringify(params)));
    const [defaultScenarioName] = useState(
        state.actions?.find((el) => el?.action_flag_type === 'save_scenario')?.scenarioName || ''
    );
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [loadScenariosList, setLoadScenariosList] = useState([]);
    const [openLoadScenarioDialog, setOpenLoadScenarioDialog] = useState(false);
    const scenarioButton = state.actions?.find((el) => el?.action_flag_type === 'save_scenario');
    const showScenarioButton = state.actions?.find((el) => el?.action_flag_type === 'save_scenario')
        ? true
        : false;
    const loadScenarioButton = state.actions?.find((el) => el?.action_flag_type === 'load_scenario')
        ? true
        : false;
    const namePopup = scenarioButton && scenarioButton.namePopup === false ? false : true;

    useEffect(() => {
        if (showScenarioButton || loadScenarioButton) {
            triggerWidgetActionHandler({
                screen_id: props.parent_obj.props.screen_id,
                app_id: props.parent_obj.props.app_id,
                payload: {
                    widget_value_id: props.parent_obj.props.widget_value_id,
                    action_type: 'get_scenarios'
                },
                callback: (resp) => {
                    if (resp.scenarios) {
                        setLoadScenariosList(resp.scenarios);
                    }
                }
            });
        }
    }, []);

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

    const getTotalvalue = (sectionInps) => {
        let value = 0;
        let commaVal;
        _.each(sectionInps, function (section, idx) {
            value = (section?.enable_secondary_input ? section.value : 0) + value;
            if (idx === sectionInps.length - 1 && section.localeString) {
                commaVal = value.toLocaleString(section.localeFormat, {
                    ...(section.localeStyle && { style: section.localeStyle }),
                    ...(section.localeCurrency && { currency: section.localeCurrency })
                });
            }
        });
        // return value
        return commaVal ? commaVal : value;
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
    const inputRenderer = (input, inputIndex, sectionIndex, grid) => {
        return (
            <CustomSliderInput
                input={inputIndex}
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
                            props={props}
                            popupAction={handleAction}
                            onAction={onAction}
                            namePopup={namePopup}
                            onTriggerNotification={onTriggerNotification}
                        />
                    }
                    {!showScenarioButton && !loadScenarioButton && (
                        <SaveScenario
                            filters_json={props.parent_obj.props.selected_filters}
                            scenarios_json={state}
                            screen_id={props.parent_obj.props.screen_id}
                            app_id={props.parent_obj.props.app_id}
                            widget_id={props.parent_obj.props.details.id}
                            getScenarios={props.getScenarios}
                        />
                    )}
                    {!showScenarioButton &&
                    !loadScenarioButton &&
                    props.savedScenarios.length > 0 ? (
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
                    <Button
                        variant="contained"
                        className={classes.buttonFloat}
                        onClick={props.onCloseSimulator}
                        aria-label="Close"
                    >
                        {'Close'}
                    </Button>
                    {/* <Button onClick={closeSimulator} variant={"contained"} className={classes.buttonFloat} startIcon={<CloseIcon />}>
                        Close
                    </Button> */}
                </Box>
            </Box>
        );
    };

    const sectionRenderer = (section, sectionInps, sectionIndex, grid) => {
        return (
            <React.Fragment key={'section' + sectionIndex}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                    className={classes.simulatorSection}
                >
                    <Grid item xs={1}>
                        <Typography
                            id={'section'}
                            variant="h5"
                            gutterBottom
                            className={classes.sectionHeading}
                        >
                            {section}
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        {sectionInps.map((input, key) => {
                            return inputRenderer(input, key, sectionIndex, grid);
                        })}
                    </Grid>

                    <Grid item xs={1} className={classes.totalValues}>
                        {sectionInps[0]?.enable_total ? (
                            <ThemeProvider theme={theme}>
                                <div className={classes.simulatorSliderLabel}>{'Total'}</div>
                                <div
                                    className={classes.simulatorSliderInputBoxContainer}
                                    style={{
                                        flexDirection:
                                            sectionInps[0].total_symbol_position === 'end'
                                                ? 'row-reverse'
                                                : 'row'
                                    }}
                                >
                                    <div style={{ fontSize: '2rem', padding: '2%' }}>
                                        {getCurrencySymbol(sectionInps[0].total_symbol || '')}
                                    </div>
                                    <Input
                                        className={classes.simulatorSliderInputBox}
                                        value={getTotalvalue(sectionInps)}
                                        margin="dense"
                                        // fullWidth={true}
                                        name="numberformat"
                                        disabled={true}
                                        // readOnly={Boolean(inputInfo.flag_active)}
                                    />
                                </div>
                            </ThemeProvider>
                        ) : null}
                    </Grid>
                </Grid>
                {/* </Grid > */}
            </React.Fragment>
        );
    };

    const handleAction = async (action_flag_type) => {
        if (action_flag_type === 'save_scenario') {
            setOpenConfirmation(true);
        } else if (action_flag_type === 'load_scenario') {
            setOpenLoadScenarioDialog(true);
        }
    };

    const handleConfirmation = async (e) => {
        try {
            onTriggerNotification({
                notification: {
                    message: 'Request Is Being Processed',
                    severity: 'info'
                }
            });
            const resp = await onAction({
                actionType: state.actions.find((el) => el.action_flag_type === 'save_scenario')
                    .name,
                data: { ...state, ...e }
            });
            if (resp.message) {
                onTriggerNotification({
                    notification: {
                        message: resp.message,
                        severity: resp?.error ? 'error' : 'success'
                    }
                });
                triggerWidgetActionHandler({
                    screen_id: props.parent_obj.props.screen_id,
                    app_id: props.parent_obj.props.app_id,
                    payload: {
                        widget_value_id: props.parent_obj.props.widget_value_id,
                        action_type: 'get_scenarios'
                    },
                    callback: (data) => {
                        if (data.scenarios) {
                            setLoadScenariosList(data.scenarios);
                        }
                    }
                });
            }
            setState((s) => ({ ...s, ...resp }));
            return resp;
        } catch (err) {
            // console.error(err);
        }
    };

    return (
        <div>
            {state ? (
                <CustomAltSimulatorContext.Provider
                    value={{
                        simulator_json: state,
                        default_json: defaultState,
                        handleActiveSwitchChange: handleActiveChange,
                        handleOptimizeSwitchChange: handleOptimizeChange,
                        handleSliderInputChange: handleSliderInputChange
                    }}
                >
                    <Paper>
                        <Grid container justifyContent="space-evenly" alignItems="center">
                            {props.show_simulator ? (
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                                            {state.sections.map((section, index) => {
                                                return sectionRenderer(
                                                    section,
                                                    state.section_inputs[section],
                                                    index,
                                                    12 /*state.section_grid_config.split("-")[index]*/
                                                );
                                            })}
                                        </Grid>
                                        {/* <hr style={{ width: "100%" }} /> */}
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <React.Fragment>
                                                {actionRenderer(state.actions)}
                                            </React.Fragment>
                                        </Grid>
                                        <SaveScenarioConfirmation
                                            open={openConfirmation}
                                            classes={classes}
                                            onClose={() => setOpenConfirmation(false)}
                                            onAction={handleConfirmation}
                                            defaultScenarioName={defaultScenarioName}
                                        />
                                        {openLoadScenarioDialog && (
                                            <LoadScenarioConfirmation
                                                open={openLoadScenarioDialog}
                                                classes={classes}
                                                onClose={() => setOpenLoadScenarioDialog(false)}
                                                scenariosList={loadScenariosList}
                                                onLoadClick={loadScenario}
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                            ) : (
                                ''
                            )}

                            {state.graph_info ? <GraphInfo graphInfo={state.graph_info} /> : null}
                        </Grid>
                    </Paper>
                </CustomAltSimulatorContext.Provider>
            ) : (
                <CodxCircularLoader size={60} center />
            )}
        </div>
    );
}
