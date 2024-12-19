import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
    Checkbox,
    ListItemText
} from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Box } from '@material-ui/core';
import { GraphInfo } from '../graphInfo/GraphInfo';
import SaveScenario from '../AppScenarioComponent/saveScenario';
import LoadScenario from '../AppScenarioComponent/loadScenario';
import CodxCircularLoader from '../CodxCircularLoader';
import ActionButtons from '../dynamic-form/inputFields/ActionButtons';
import TextInput from '../dynamic-form/inputFields/textInput';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },

    buttonFloat: {
        float: 'right'
    },
    button: {
        margin: theme.spacing(0, 1, 0, 1)
    },
    downloadSheet: {
        margin: theme.spacing(1, 0, 1, 3)
    },
    hiddenElement: {
        display: 'none'
    },
    simulatorSectionHeader: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontWeight: 400,
        padding: theme.spacing(2, 0),
        textDecoration: 'underline'
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
            width: '10rem'
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
    simulatorContainer: {
        padding: theme.spacing(5, 2, 5, 2),
        border: ' 1px solid',
        marginBottom: '1.6rem',
        borderColor: theme.palette.background.default,
        background: theme.palette.background.default
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
    confirmationError: {
        fontSize: '1.3rem',
        width: '50%',
        color: 'red',
        marginLeft: '5%',
        marginTop: '-4%'
    }
}));

const useStylesCustomSliders = makeStyles((theme) => ({
    checkbox: {
        padding: 0,
        '& svg': {
            width: '3rem',
            height: '3rem'
        }
    },
    textfieldDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    sliderDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '225px'
    },
    dropdownDiv: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        width: '100%'
    },
    simulatorSliderLabel: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        padding: theme.spacing(1, 0),
        textAlign: 'center',
        justifyContent: 'space-around'
    },
    simulatorDropDownLabel: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        padding: theme.spacing(1, 0),
        textAlign: 'baseline',
        justifyContent: 'space-around'
    },
    sliderBox: {
        color: theme.palette.primary.contrastText,
        width: '10px',
        borderRadius: '6px',
        fontSize: '1.5rem',
        padding: theme.spacing(1, 0),
        textAlign: 'center',
        justifyContent: 'space-around',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid ' + theme.palette.background.paper
    },
    simulatorSliderSection: {
        alignItems: 'center',
        width: '100%',
        marginLeft: '5px'
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
            width: '10rem'
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
    textField: {
        color: theme.palette.text.default,
        fontSize: '10px',
        '& .MuiInput-underline:before': {
            borderBottomColor: theme.palette.text.default
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.text.default
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: theme.palette.text.default
        },
        width: '225px'
    },
    selectLabel: {
        color: theme.palette.text.default,
        fontSize: '1.5rem'
    },
    formControl: {
        color: theme.palette.text.default,
        width: '225px',
        '& .MuiSelect-root': {
            color: theme.palette.text.default
        },
        '& .MuiSelect-icon': {
            color: theme.palette.text.default
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: theme.palette.text.default
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.text.default
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: theme.palette.text.default
        }
    }
}));

const CustomAltSimulatorContext = React.createContext({
    simulator_json: null,
    default_json: null,
    handleSliderInputChange: null
});

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
            params.actionfunc(action_flag_type, simulator_json);
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

function CustomSliderInput({ input, section, props }) {
    const classes = useStylesCustomSliders();
    const [inputInfo, setinputInfo] = React.useState(props);
    const [_key] = useState(input);
    const [_section] = useState(section);
    const [selectedValues, setSelectedValues] = useState(
        inputInfo?.dropDownValue || Array(inputInfo.num_dropdown).fill([])
    );
    const [dependentOptions, setDependentOptions] = useState(inputInfo.dropdown_option);
    const [sliderValue, setsliderValue] = useState(inputInfo.slider_value);
    let { handleSliderInputChange } = useContext(CustomAltSimulatorContext);

    const handlePrimaryInputChange = (event) => {
        let value = event.target.value === '' ? '' : event.target.value;
        let newInputObj = { ...inputInfo, text_value: value };
        setinputInfo(newInputObj);
        handleSliderInputChange(_key, _section, newInputObj);
    };

    const handleChangeMultipleDrop = (event, index) => {
        const newSelectedValues = [...selectedValues];
        newSelectedValues[index] = event.target.value;
        const newDependentOptions = [...dependentOptions];
        for (let i = index + 1; i < inputInfo.num_dropdown; i++) {
            newDependentOptions[i] = inputInfo.dropdown_option[i].filter((option) =>
                event.target.value.includes(option.parent)
            );
            newSelectedValues[i] = [];
        }
        setSelectedValues(newSelectedValues);
        setDependentOptions(newDependentOptions);
        let newInputObj = { ...inputInfo, dropDownValue: newSelectedValues };
        handleSliderInputChange(_key, _section, newInputObj);
    };
    const handleChangeSlider = (event, newValue) => {
        let newInputObj = { ...inputInfo, slider_value: newValue };
        setsliderValue(newValue);
        handleSliderInputChange(_key, _section, newInputObj);
    };
    return (
        <React.Fragment>
            <Grid
                container
                className={classes.simulatorSliderSection}
                direction="row"
                spacing={2}
                xs={12}
            >
                {inputInfo.enable_textfiled ? (
                    <Grid item xs={11} style={{ width: '100%' }}>
                        <div className={classes.textfieldDiv}>
                            <Typography className={classes.simulatorSliderLabel}>
                                {inputInfo.text_label}
                            </Typography>
                            <TextField
                                variant="standard"
                                className={classes.textField}
                                value={inputInfo.text_value}
                                onChange={handlePrimaryInputChange}
                                type="text"
                                name="text_value"
                                size="Normal"
                                InputProps={{ className: classes.textField }}
                                id="text_value"
                            />
                        </div>
                    </Grid>
                ) : null}
                {inputInfo.enable_dropdown ? (
                    <Grid item xs={11}>
                        <div>
                            {selectedValues.map((selectedValue, index) => (
                                <div key={'key' + index} className={classes.dropdownDiv}>
                                    <Typography className={classes.simulatorDropDownLabel}>
                                        {inputInfo?.dropdown_label[index]}
                                    </Typography>
                                    <FormControl variant="standard" className={classes.formControl}>
                                        {inputInfo?.is_multiple_dropdown[index] ? (
                                            <Select
                                                value={selectedValue}
                                                multiple
                                                onChange={(event) =>
                                                    handleChangeMultipleDrop(event, index)
                                                }
                                                inputProps={{
                                                    className: classes.selectLabel
                                                }}
                                                renderValue={(selected) => selected.join(', ')}
                                            >
                                                {dependentOptions[index].map((option) => (
                                                    <MenuItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        <Checkbox
                                                            checked={
                                                                selectedValue.indexOf(
                                                                    option.value
                                                                ) > -1
                                                            }
                                                        />
                                                        <ListItemText
                                                            primary={
                                                                <Typography
                                                                    className={classes.selectLabel}
                                                                >
                                                                    {option.label}
                                                                </Typography>
                                                            }
                                                        />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Select
                                                value={selectedValue}
                                                onChange={(event) =>
                                                    handleChangeMultipleDrop(event, index)
                                                }
                                                inputProps={{
                                                    className: classes.selectLabel
                                                }}
                                            >
                                                {dependentOptions[index].map((option) => (
                                                    <MenuItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </FormControl>
                                </div>
                            ))}
                        </div>
                    </Grid>
                ) : null}
                {inputInfo.enable_slider ? (
                    <Grid item xs={11} style={{ marginTop: '5px' }}>
                        <div className={classes.textfieldDiv}>
                            <Typography className={classes.simulatorSliderLabel}>
                                {inputInfo.slider_label}
                            </Typography>
                            <div className={classes.sliderDiv}>
                                <Slider
                                    className={classes.simulatorSliderInput}
                                    value={sliderValue}
                                    onChange={handleChangeSlider}
                                    aria-labelledby="slider-label"
                                />
                                <span className={classes.sliderBox}>{sliderValue}</span>
                            </div>
                        </div>
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
                //TODO
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
            aria-labelledby="alternate-simulator-typee-save-scenario"
        >
            <DialogTitle id="alternate-simulator-typee-save-scenario">
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

/**
 * @summary AlternateSimulatorType is the first experimental Simulator created to customize functionality asked by a client. It will enable the user to turn on/off a slider based on the need.
 */
export default function AlternateSimulatorTypeE({
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
    const scenarioButton = state.actions?.find((el) => el?.action_flag_type === 'save_scenario');
    const showScenarioButton = state.actions?.find((el) => el?.action_flag_type === 'save_scenario')
        ? true
        : false;
    const loadScenarioButton = state.actions?.find((el) => el?.action_flag_type === 'load_scenario')
        ? true
        : false;
    const namePopup = scenarioButton && scenarioButton.namePopup === false ? false : true;
    const sectionLength = state?.sections?.length;

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
    const inputRenderer = (input, inputIndex, sectionIndex, grid, sectionLength) => {
        return (
            <CustomSliderInput
                input={inputIndex}
                section={sectionIndex}
                grid={grid}
                props={{ ...input }}
                key={'input' + inputIndex}
                sectionLength={sectionLength}
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
                </Box>
            </Box>
        );
    };

    const sectionRenderer = (section, sectionInps, sectionIndex, grid, sectionLength) => {
        const itemCol = sectionLength < 2 ? 12 : sectionLength <= 4 ? 6 : 4;
        return (
            <React.Fragment key={'section' + sectionIndex}>
                <Grid item xs={itemCol}>
                    <Typography
                        style={{ marginLeft: '10px' }}
                        id={'section'}
                        variant="h5"
                        gutterBottom
                        className={classes.simulatorSectionHeader}
                    >
                        {section}
                    </Typography>
                    {sectionInps.map((input, key) => {
                        return inputRenderer(input, key, sectionIndex, grid, sectionLength);
                    })}
                </Grid>
            </React.Fragment>
        );
    };
    const handleAction = async (action_flag_type) => {
        if (action_flag_type === 'save_scenario') {
            setOpenConfirmation(true);
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
            }
            setState((s) => ({ ...s, ...resp }));
            return resp;
        } catch (err) {
            //TODO
        }
    };
    return (
        <div>
            {state ? (
                <CustomAltSimulatorContext.Provider
                    value={{
                        simulator_json: state,
                        default_json: defaultState,
                        handleSliderInputChange: handleSliderInputChange
                    }}
                >
                    <Paper>
                        <Grid container justifyContent="space-evenly" alignItems="center">
                            {props.show_simulator ? (
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Grid spacing={0} container>
                                        <Grid
                                            container
                                            columnSpacing={{ xs: 0, sm: 0, md: 0 }}
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            className={classes.simulatorContainer}
                                            direction="row"
                                        >
                                            {state.sections.map((section, index) => {
                                                return sectionRenderer(
                                                    section,
                                                    state.section_inputs[section],
                                                    index,
                                                    12 /*state.section_grid_config.split("-")[index]*/,
                                                    sectionLength
                                                );
                                            })}
                                        </Grid>
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
