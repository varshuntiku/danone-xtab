import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Typography, Button, Grid } from '@material-ui/core';
import {
    Select,
    MenuItem,
    ListItemText,
    FormControl,
    Input,
    InputLabel,
    Slider,
    Checkbox,
    TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import createPlotlyComponent from "react-plotly.js/factory";
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import CodxPopupDialog from 'components/custom/CodxPoupDialog';
import { saveScrenario, getScrenarios, validScenarioName } from 'services/scenario';
import CustomSnackbar from 'components/CustomSnackbar';
import DynamicForm from 'components/dynamic-form/dynamic-form';

const useStylesCustomSliders = makeStyles((theme) => ({
    simulatorSliderLabel: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        textAlign: 'left',
        padding: theme.spacing(1, 2)
    },
    simulatorSliderInput: {
        margin: theme.spacing(0.35, 0),
        color: theme.palette.primary.contrastText
    },
    simulatorSliderInputBox: {
        marginLeft: theme.spacing(2),
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            // padding: theme.spacing(1),
            backgroundColor: theme.palette.primary.main,
            border: '2px solid ' + theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            textAlign: 'right',
            padding: theme.spacing(0.3, 0),
            margin: theme.spacing(0.6, 0),
            fontSize: '1.5rem',
            borderRadius: '5px'
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
    },
    simulatorSliderThreshold: {
        position: 'absolute',
        width: theme.spacing(1),
        height: theme.spacing(3),
        borderLeft: theme.spacing(0.25) + ' dashed ' + theme.palette.primary.contrastText,
        top: theme.spacing(0.5)
    }
}));

function CustomSliderInputSimulate({ onChange, ...props }) {
    const classes = useStylesCustomSliders();
    const [value, setValue] = React.useState(props.props.value);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        onChange(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
        onChange(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < props.props.min) {
            setValue(props.props.min);
            onChange(props.props.min);
        } else if (value > props.props.max) {
            setValue(props.props.max);
            onChange(props.props.max);
        }
    };

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={4}>
                    <Typography
                        id={'input-slider-heading' + props.props.id}
                        className={classes.simulatorSliderLabel}
                        variant="h5"
                        gutterBottom
                    >
                        {props.props.label}
                    </Typography>
                </Grid>

                <Grid item xs={6} style={{ position: 'relative' }}>
                    <Slider
                        className={classes.simulatorSliderInput}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        value={props.props.value}
                        step={props.props.steps || 0.01}
                        max={props.props.max}
                        min={props.props.min}
                    />
                    {props.props.threshold && (
                        <div
                            className={classes.simulatorSliderThreshold}
                            style={{
                                left:
                                    (props.props.threshold * 100) /
                                        (props.props.max - props.props.min) +
                                    '%'
                            }}
                        ></div>
                    )}
                </Grid>

                <Grid item xs={2}>
                    <Input
                        className={classes.simulatorSliderInputBox}
                        value={value}
                        margin="dense"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: props.props.steps,
                            min: props.props.min,
                            max: props.props.max,
                            type: 'number',
                            'aria-labelledby': 'input-slider'
                        }}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

const dialogStyles = makeStyles((theme) => ({
    dialogContent: {
        border: 'none'
    },
    textField: {
        '& label.Mui-focused': {
            color: theme.palette.text.default,
            fontSize: '1.8rem'
        },
        '& label': {
            fontSize: '1.5rem',
            color: theme.palette.text.default
        },
        '& .MuiSvgIcon-root': {
            fontSize: '25px',
            color: theme.palette.text.default
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: theme.palette.text.default
            }
        }
    },
    label: {
        color: theme.palette.text.default,
        fontSize: '1.9rem'
    }
}));
function Simulate({
    data,
    classes,
    onChangeSlider,
    onSimulateScenario,
    onShowSimulateOutput,
    onShowSimulateInput,
    rightPopoutStateChange
}) {
    // eslint-disable-next-line no-unused-vars
    const [extraFilters, Setextrafilters] = useState(data.digitaltwin_data.simulate.extra_filters);
    const [saveScenarioForm, setSaveScenarioForm] = useState({
        dialogOpen: false,
        notification: false,
        notificationMessage: '',
        severity: ''
    });
    const [scenarioName, setScenarioName] = useState('Simulator Scenario');
    const [validScenario, setValidScenario] = useState(null);
    const [scenarioslist, Setscenarioslist] = useState([]);
    const [buttonActivate, setButtonactivate] = useState(true);
    const [simulateInput, setSimulateInput] = useState([]);
    const [simulateOutput, setSimulateOutput] = useState([]);

    // const Plotly = window.Plotly;
    // const Plot = createPlotlyComponent(Plotly);
    // const { CodxBkgdColor, CodxTextColor, CodxBkgdLightColor, CodxContrastColor } = themeContextPlot;
    const dialogClasses = dialogStyles();

    const handleSimulation = () => {
        onSimulateScenario();
        setButtonactivate(false);
    };

    const handleSaveScenarioForm = () => {
        setSaveScenarioForm((prevstate) => ({ ...prevstate, dialogOpen: true }));
    };
    const onCloseSaveScenarioDialog = () => {
        setSaveScenarioForm((prevstate) => ({ ...prevstate, dialogOpen: false }));
    };

    const saveCallback = (response) => {
        if (response.status === 200) {
            setSaveScenarioForm((prevstate) => ({
                ...prevstate,
                notification: true,
                notificationMessage: response.message,
                severity: 'success'
            }));
        } else if (response.error) {
            setSaveScenarioForm((prevstate) => ({
                ...prevstate,
                notification: true,
                notificationMessage: response.message,
                severity: 'warning'
            }));
        } else if (response.status === 500) {
            setSaveScenarioForm((prevstate) => ({
                ...prevstate,
                notification: true,
                notificationMessage: response.message,
                severity: 'error'
            }));
        }
    };
    const saveScenario = () => {
        let scenarioDetails = {
            widget_id: data.widget_id,
            scenarioname: scenarioName,
            app_id: data.app_id,
            app_screen_id: data.screen_id,
            comment: '',
            scenarios_json: { simulateSilderValues: data.simulate_input_values },
            filters_json: []
        };
        validScenarioName({
            app_id: data.app_id,
            widget_id: data.widget_value_id,
            app_screen_id: data.screen_id,
            name: scenarioName
        }).then((response) => setValidScenario(response.isexists));
        if (!validScenario) {
            saveScrenario({
                payload: scenarioDetails,
                callback: saveCallback
            });
        } else {
            setSaveScenarioForm((prevstate) => ({
                ...prevstate,
                notification: true,
                notificationMessage: 'Scenario name already exists',
                severity: 'warning'
            }));
        }
        setSaveScenarioForm((prevstate) => ({ ...prevstate, dialogOpen: false }));
    };
    const dialogContent = (
        <React.Fragment>
            <div>
                <TextField
                    required
                    label="Scenario name"
                    id="outlined-required"
                    variant="outlined"
                    fullWidth
                    size="normal"
                    defaultValue={scenarioName}
                    onChange={(event) => {
                        setScenarioName(event.target.value);
                    }}
                    className={dialogClasses.textField}
                    inputProps={{
                        className: dialogClasses.label
                    }}
                />
            </div>
        </React.Fragment>
    );
    const dialogActions = (
        <React.Fragment>
            <Button variant="outlined" onClick={onCloseSaveScenarioDialog} aria-label="Cancel">
                Cancel
            </Button>
            <Button variant="contained" onClick={saveScenario} aria-label="Save">
                {' '}
                Save
            </Button>
        </React.Fragment>
    );

    useEffect(() => {
        getScrenarios({
            app_id: data.app_id,
            screen_id: data.screen_id,
            widget_id: data.widget_id,
            filters: []
        }).then((response) => {
            Setscenarioslist(response.data);
        });
    }, [saveScenarioForm.notification]);

    useEffect(() => {
        if (data.digitaltwin_data?.simulate?.input && data.digitaltwin_data?.simulate?.output) {
            setSimulateInput(data.digitaltwin_data?.simulate?.input);
            setSimulateOutput(data.digitaltwin_data?.simulate?.output);
        }
    });
    return (
        <div
            key={'digital_twin_simulate'}
            className={
                data.simulateOpen
                    ? clsx(classes.digitalTwinPopup, classes.digitalTwinDetailsSimulate)
                    : classes.digitalTwinPopupHidden
            }
        >
            <div key={'digital_twin_simulate_container'}>
                <div
                    key={'digital_twin_simulate_filter_container'}
                    className={classes.actionFiltersContainer}
                    style={{ display: 'flex' }}
                >
                    <div className={classes.simulateExtraFilters}>
                        {extraFilters.map((filter_item) => {
                            return (
                                <div
                                    className={classes.simulateFilterDropDown}
                                    key={filter_item.name}
                                >
                                    <FormControl
                                        className={classes.digitalTwinPopupDropdownMultiple}
                                    >
                                        <InputLabel
                                            id={filter_item.name}
                                            className={classes.dropdownLabel}
                                        >
                                            {data.show_simulate_input ? filter_item.name : ''}
                                        </InputLabel>
                                        {data.show_simulate_input && (
                                            <Select
                                                value={data.simulate_filters[filter_item.name]}
                                                labelId={filter_item}
                                                className={classes.multipleDropdown}
                                                multiple={filter_item?.multiselect ? true : false}
                                                renderValue={(selected) => {
                                                    let selectedLabels = [];
                                                    if (filter_item.multiselect) {
                                                        if (selected.includes('all')) {
                                                            let reselected = selected.filter(
                                                                (el) => el !== 'all'
                                                            );
                                                            for (let i in reselected) {
                                                                selectedLabels.push(
                                                                    filter_item.options.filter(
                                                                        (el) =>
                                                                            el.value ===
                                                                            reselected[i]
                                                                    )[0].label
                                                                );
                                                            }
                                                        } else {
                                                            for (let i in selected) {
                                                                selectedLabels.push(
                                                                    filter_item.options.filter(
                                                                        (el) =>
                                                                            el.value === selected[i]
                                                                    )[0].label
                                                                );
                                                            }
                                                        }
                                                    }
                                                    let content = filter_item?.multiselect
                                                        ? selectedLabels.join(',')
                                                        : selected;
                                                    return content;
                                                }}
                                                onChange={(evt) =>
                                                    rightPopoutStateChange(
                                                        evt.target.value,
                                                        filter_item.name
                                                    )
                                                }
                                            >
                                                {filter_item.multiselect && (
                                                    <MenuItem value="all" name="All">
                                                        <Checkbox
                                                            checked={
                                                                data.simulate_filters[
                                                                    filter_item.name
                                                                ].indexOf('all') > -1
                                                            }
                                                        />
                                                        <ListItemText primary="Select all" />
                                                    </MenuItem>
                                                )}
                                                {filter_item.options.map((el) => {
                                                    return (
                                                        <MenuItem
                                                            key={el.value}
                                                            value={el.value}
                                                            className={
                                                                classes.digitalTwinPopupDropdownMenuItem
                                                            }
                                                        >
                                                            {filter_item?.multiselect && (
                                                                <Checkbox
                                                                    checked={
                                                                        data.simulate_filters[
                                                                            filter_item.name
                                                                        ].indexOf(el.value) > -1
                                                                    }
                                                                />
                                                            )}
                                                            <ListItemText primary={el.label} />
                                                        </MenuItem>
                                                    );
                                                })}
                                            </Select>
                                        )}
                                        {data.show_simulate_output && (
                                            <Typography
                                                className={
                                                    classes.digitalTwinActionFilterValueLabel
                                                }
                                            >
                                                {filter_item.options[0].label}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </div>
                            );
                        })}
                    </div>
                    <FormControl className={classes.digitalTwinPopupDropdownMultiple}>
                        <InputLabel>Scenarios</InputLabel>
                        <Select
                            value={data.simulate_filters.scenarios}
                            className={classes.multipleDropdown}
                            onChange={(evt) =>
                                rightPopoutStateChange(evt.target.value, 'scenarios')
                            }
                        >
                            {scenarioslist?.map((element) => (
                                <MenuItem
                                    key={element.id}
                                    value={element.name}
                                    className={classes.digitalTwinPopupDropdownMenuItem}
                                >
                                    <ListItemText primary={element.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <br clear="all" />
                </div>
                <Typography
                    className={
                        data.show_simulate_input
                            ? classes.simulateHeaderSelected
                            : classes.simulateHeader
                    }
                    onClick={onShowSimulateInput}
                >
                    INPUT
                </Typography>
                <Typography
                    className={
                        data.show_simulate_output
                            ? classes.simulateHeaderSelected
                            : classes.simulateHeader
                    }
                    style={{
                        opacity: !buttonActivate ? '1' : '0.5',
                        cursor: !buttonActivate ? 'pointer' : 'cursor',
                        pointerEvents: !buttonActivate ? 'all' : 'none'
                    }}
                    onClick={onShowSimulateOutput}
                >
                    OUTPUT
                </Typography>
                <br clear="all" />
                {data.show_simulate_input && (
                    <div className={classes.simulateContainer}>
                        <div className={classes.simulateBody}>
                            <div className={classes.simulateBodySegment}>
                                <Typography className={classes.simulateSectionHeader}>
                                    Uncontrollable Variables
                                </Typography>
                                <div className={classes.simulateBodyDetailsLeft}>
                                    <CustomSliderInputSimulate
                                        onChange={(v) => onChangeSlider(v, 0)}
                                        props={{
                                            min: 0,
                                            max: 50000,
                                            value: data.simulate_input_values[0],
                                            threshold: 25000,
                                            label: 'Volume'
                                        }}
                                    />
                                    <Typography className={classes.simulateBodyDetailsHeader}>
                                        Assortment Mix
                                    </Typography>
                                    <CustomSliderInputSimulate
                                        onChange={(v) => onChangeSlider(v, 1)}
                                        props={{
                                            min: 0,
                                            max: 10000,
                                            value: data.simulate_input_values[1],
                                            threshold: 6000,
                                            label: 'Apparel'
                                        }}
                                    />
                                    <CustomSliderInputSimulate
                                        onChange={(v) => onChangeSlider(v, 2)}
                                        props={{
                                            min: 0,
                                            max: 10000,
                                            value: data.simulate_input_values[2],
                                            threshold: 5000,
                                            label: 'Shoes'
                                        }}
                                    />
                                    <CustomSliderInputSimulate
                                        onChange={(v) => onChangeSlider(v, 3)}
                                        props={{
                                            min: 0,
                                            max: 10000,
                                            value: data.simulate_input_values[3],
                                            threshold: 4000,
                                            label: 'Accesories'
                                        }}
                                    />
                                    <CustomSliderInputSimulate
                                        onChange={(v) => onChangeSlider(v, 4)}
                                        props={{
                                            min: 0,
                                            max: 10000,
                                            value: data.simulate_input_values[4],
                                            threshold: 8000,
                                            label: 'Ecom'
                                        }}
                                    />
                                    <CustomSliderInputSimulate
                                        onChange={(v) => onChangeSlider(v, 5)}
                                        props={{
                                            min: 0,
                                            max: 10000,
                                            value: data.simulate_input_values[5],
                                            threshold: 7500,
                                            label: 'Electronics'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={classes.simulateBodySegment}>
                                <Typography className={classes.simulateSectionHeader}>
                                    Controllable Levers
                                </Typography>
                                <div className={classes.simulateBodyDetailsLeft}>
                                    <Typography className={classes.simulateBodyDetailsHeader}>
                                        Labor
                                    </Typography>
                                    <CustomSliderInputSimulate
                                        onChange={(v) => onChangeSlider(v, 6)}
                                        props={{
                                            min: 0,
                                            max: 10,
                                            value: data.simulate_input_values[6],
                                            threshold: 7.5,
                                            label: 'Workers/ Zone'
                                        }}
                                    />
                                    <CustomSliderInputSimulate
                                        onChange={(v) => onChangeSlider(v, 7)}
                                        props={{
                                            min: 0,
                                            max: 10,
                                            value: data.simulate_input_values[7],
                                            threshold: 5,
                                            label: 'Hours/ worker'
                                        }}
                                    />
                                    <CustomSliderInputSimulate
                                        onChange={(v) => onChangeSlider(v, 8)}
                                        props={{
                                            min: 0,
                                            max: 500,
                                            value: data.simulate_input_values[8],
                                            threshold: 300,
                                            label: '# workers'
                                        }}
                                    />
                                    <Typography className={classes.simulateBodyDetailsHeader}>
                                        Pick Design Levers
                                    </Typography>
                                    <CustomSliderInputSimulate
                                        onChange={(v) => onChangeSlider(v, 9)}
                                        props={{
                                            min: 0,
                                            max: 10,
                                            value: data.simulate_input_values[9],
                                            threshold: 7.5,
                                            label: 'Waves/ Day'
                                        }}
                                    />
                                    <CustomSliderInputSimulate
                                        onChange={(v) => onChangeSlider(v, 10)}
                                        props={{
                                            min: 0,
                                            max: 20,
                                            value: data.simulate_input_values[10],
                                            threshold: 14,
                                            label: 'Orders/ wave'
                                        }}
                                    />
                                    <CustomSliderInputSimulate
                                        onChange={(v) => onChangeSlider(v, 11)}
                                        props={{
                                            min: 0,
                                            max: 24,
                                            value: data.simulate_input_values[11],
                                            threshold: 20,
                                            label: '# unique skus/ pick tickets'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={classes.simulateBodySegment}>
                                <Typography className={classes.simulateSectionHeader}>
                                    Cost Levers
                                </Typography>
                                <div className={classes.simulateBodyDetails}>
                                    <div className={classes.simulateBodyTable}>
                                        <div className={classes.simulateBodyTableHeaderContainer}>
                                            <Typography className={classes.simulateBodyTableHeader}>
                                                {' '}
                                            </Typography>
                                            <Typography
                                                className={classes.simulateBodyTableHeaderSmall}
                                            >
                                                MIN
                                            </Typography>
                                            <Typography
                                                className={classes.simulateBodyTableHeaderSmall}
                                            >
                                                MAX
                                            </Typography>
                                            <br clear="all" />
                                        </div>
                                        <div className={classes.simulateBodyTableCellContainer}>
                                            <div className={classes.simulateBodyTableCellRow}>
                                                <div className={classes.simulateBodyTableCell}>
                                                    Max # OT hours/day
                                                </div>
                                                <div className={classes.simulateBodyTableCellSmall}>
                                                    <Input
                                                        className={
                                                            classes.simulateBodyTableCellInput
                                                        }
                                                        variant="filled"
                                                        value={data.simulate_input_values[12]}
                                                        onChange={(evt) =>
                                                            onChangeSlider(evt.target.value, 12)
                                                        }
                                                    />
                                                </div>
                                                <div className={classes.simulateBodyTableCellSmall}>
                                                    <Input
                                                        className={
                                                            classes.simulateBodyTableCellInput
                                                        }
                                                        variant="filled"
                                                        value={data.simulate_input_values[13]}
                                                        onChange={(evt) =>
                                                            onChangeSlider(evt.target.value, 13)
                                                        }
                                                    />
                                                </div>
                                                <br clear="all" />
                                            </div>
                                            <div className={classes.simulateBodyTableCellRow}>
                                                <div className={classes.simulateBodyTableCell}>
                                                    Max # Contractors/day
                                                </div>
                                                <div className={classes.simulateBodyTableCellSmall}>
                                                    <Input
                                                        className={
                                                            classes.simulateBodyTableCellInput
                                                        }
                                                        variant="filled"
                                                        value={data.simulate_input_values[14]}
                                                        onChange={(evt) =>
                                                            onChangeSlider(evt.target.value, 14)
                                                        }
                                                    />
                                                </div>
                                                <div className={classes.simulateBodyTableCellSmall}>
                                                    <Input
                                                        className={
                                                            classes.simulateBodyTableCellInput
                                                        }
                                                        variant="filled"
                                                        value={data.simulate_input_values[15]}
                                                        onChange={(evt) =>
                                                            onChangeSlider(evt.target.value, 15)
                                                        }
                                                    />
                                                </div>
                                                <br clear="all" />
                                            </div>
                                            <div className={classes.simulateBodyTableCellRow}>
                                                <div className={classes.simulateBodyTableCell}>
                                                    Max # new hires/day
                                                </div>
                                                <div className={classes.simulateBodyTableCellSmall}>
                                                    <Input
                                                        className={
                                                            classes.simulateBodyTableCellInput
                                                        }
                                                        variant="filled"
                                                        value={data.simulate_input_values[16]}
                                                        onChange={(evt) =>
                                                            onChangeSlider(evt.target.value, 16)
                                                        }
                                                    />
                                                </div>
                                                <div className={classes.simulateBodyTableCellSmall}>
                                                    <Input
                                                        className={
                                                            classes.simulateBodyTableCellInput
                                                        }
                                                        variant="filled"
                                                        value={data.simulate_input_values[17]}
                                                        onChange={(evt) =>
                                                            onChangeSlider(evt.target.value, 17)
                                                        }
                                                    />
                                                </div>
                                                <br clear="all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br clear="all" />
                            <div className={classes.simulateBodyToolbar}>
                                <Button
                                    variant="contained"
                                    className={classes.simulateBodyToolbarButton}
                                    onClick={handleSimulation}
                                    aria-label="Simulate"
                                >
                                    Simulate
                                </Button>
                                <Button
                                    variant="outlined"
                                    className={classes.simulateBodyToolbarButton}
                                    onClick={handleSaveScenarioForm}
                                    disabled={buttonActivate}
                                    aria-label="Save scenario"
                                >
                                    Save Scenario
                                </Button>
                                <Button
                                    variant="contained"
                                    className={classes.simulateBodyToolbarButton}
                                    onClick={onShowSimulateOutput}
                                    disabled={buttonActivate}
                                    aria-label="View Result"
                                >
                                    View Result
                                </Button>
                                <br clear="all" />
                            </div>
                            <CodxPopupDialog
                                open={saveScenarioForm.dialogOpen}
                                setOpen={setSaveScenarioForm}
                                dialogTitle="Save Scenario"
                                dialogContent={dialogContent}
                                maxWidth="xs"
                                dialogClasses={dialogClasses}
                                dialogActions={dialogActions}
                            />
                            <CustomSnackbar
                                open={
                                    saveScenarioForm.notification &&
                                    saveScenarioForm.notificationMessage
                                }
                                autoHideDuration={2000}
                                severity={saveScenarioForm.severity || 'success'}
                                message={saveScenarioForm.notificationMessage}
                                onClose={() => {
                                    setSaveScenarioForm((prevstate) => ({
                                        ...prevstate,
                                        notification: false
                                    }));
                                }}
                            />
                            {data.show_simulate_input_results && (
                                <div className={classes.digitalTwinSimulateInputResults}>
                                    {data.simulateLoading ? (
                                        <div className={classes.digitalTwinActionLoadingBody}>
                                            <CodxCircularLoader
                                                size={60}
                                                style={{
                                                    top: '75%',
                                                    left: '45%',
                                                    position: 'absolute'
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <DynamicForm
                                                params={{ fields: simulateInput }}
                                                origin={'digital-twin'}
                                                onChange={setSimulateInput}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {data.show_simulate_output && (
                    <div className={classes.simulateContainer}>
                        {data.simulateLoading ? (
                            <div className={classes.digitalTwinActionLoadingBody}>
                                <CodxCircularLoader size={60} center />
                            </div>
                        ) : (
                            <div>
                                <DynamicForm
                                    params={{ fields: simulateOutput }}
                                    origin={'digital-twin'}
                                    onChange={setSimulateOutput}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Simulate;
