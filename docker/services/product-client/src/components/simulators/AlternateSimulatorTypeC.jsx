import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { GraphInfoSimulatorTypeC } from '../graphInfo/GraphInfoSimulatorTypeC';
import CodxCircularLoader from '../CodxCircularLoader';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { ExpandMore, OpenInNew, Close } from '@material-ui/icons';
import ToolBar from '../custom/CodxToolBar';
import ActionButtons from '../dynamic-form/inputFields/ActionButtons';
import TextInput from '../dynamic-form/inputFields/textInput';
import SaveScenario from '../AppScenarioComponent/saveScenario';
import LoadScenario from '../AppScenarioComponent/loadScenario';
import clsx from 'clsx';
import { getCurrencySymbol } from 'common/utils';

const deepClone = (d) => d && JSON.parse(JSON.stringify(d));

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
        margin: theme.spacing(0, 1, 0, 1)
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
    simulatorSliderInput: {
        margin: theme.spacing(0.35, 0),
        color: theme.palette.primary.contrastText,
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
            textAlign: 'center',
            fontSize: '1.6rem',
            borderRadius: '3px'
        },
        '&.MuiInput-root': {
            margin: '0.1rem'
        },
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        },
        '&.MuiInputBase-root': {
            border: '1px solid ' + theme.palette.primary.contrastText,
            maxWidth: '8rem !important',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.primary.contrastText,
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
        padding: theme.spacing(2, 0)
    },
    sectionHeading: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontWeight: 400,
        padding: theme.spacing(2, 0)
    },
    simulatorSection: {
        padding: '1.6rem',
        marginTop: '1.6rem',
        marginBottom: '1.6rem',
        borderColor: theme.palette.background.default,
        boxShadow: '2px 2px 2px 2px ' + theme.palette.shadow.dark
    },
    rootSectionSummary: {
        flexDirection: 'row-reverse',
        alignItems: 'baseline'
    },
    headerContainer: {
        textAlign: 'center',
        maxHeight: '65vh',
        border: '1px solid',
        paddingTop: '1.6rem',
        paddingBottom: '1.6rem',
        paddingRight: '2.4rem',
        color: theme.palette.text.default,
        borderColor: theme.palette.background.default
    },
    accordionSimulatorSliderInput: {
        margin: theme.spacing(0.35, 0),
        color: theme.palette.primary.contrastText,
        '& .MuiSlider-markLabel': {
            color: theme.palette.primary.contrastText + '!important',
            fontSize: '1.1rem'
        }
    },
    simulatorSliderSection: {
        alignItems: 'center'
    },
    customTextBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: '0.8rem'
    },
    singleInputBox: {
        alignItems: 'center',
        padding: '1rem'
    },
    accordionSummary: {
        paddingLeft: '2.4rem'
    },
    groupedColumns: {
        display: 'flex',
        justifyContent: 'space-around'
    },
    groupedSubColumn: {
        display: 'flex',
        justifyContent: 'space-around',
        marginLeft: '0.6rem',
        marginRight: '0.6rem'
    },
    greyedOutColumns: {
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            backgroundColor: theme.palette.background.paper,
            textAlign: 'center',
            fontSize: '1.6rem',
            borderRadius: '3px'
        },
        '&.MuiInput-root': {
            margin: '0.1rem'
        },
        '&.MuiInputBase-root': {
            border: '1px solid ' + theme.palette.primary.contrastText,
            maxWidth: '8rem !important',
            backgroundColor: theme.palette.background.paper,
            color: '#9e9e9e',
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
    groupedHeaders: {
        display: 'flex',
        justifyContent: 'space-around'
    },
    headerwidth: {
        width: '10rem'
    },
    subsector: {
        display: 'flex',
        justifyContent: 'center',
        marginRight: '3rem'
    },
    rootSectionDetails: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '5rem',
        marginTop: '2rem'
    },
    popUpHeaderContainer: {
        textAlign: 'center',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        paddingRight: '2.4rem'
    },
    subHeaderContainer: {
        textAlign: 'center',
        border: '1px solid',
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
        color: theme.palette.text.default,
        borderColor: theme.palette.background.default
    },
    popUpRootSectionSummary: {
        flexDirection: 'row-reverse',
        alignItems: 'baseline',
        paddingLeft: 0
    },
    OpenIcon: {
        color: theme.palette.primary.contrastText,
        cursor: 'pointer'
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
    simulatorSliderLabel: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        padding: theme.spacing(1, 0),
        textAlign: 'center'
    },
    simulatorSliderSection: {
        alignItems: 'center'
    },
    simulatorSliderInput: {
        margin: theme.spacing(0.35, 0),
        color: theme.palette.primary.contrastText,
        '& .MuiSlider-markLabel': {
            color: theme.palette.primary.contrastText + '!important',
            fontSize: '1.1rem'
        }
    },
    simulatorSliderInputBox: {
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            backgroundColor: theme.palette.background.paper,
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
            border: '1px solid ' + theme.palette.primary.contrastText,
            maxWidth: '8rem !important',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.primary.contrastText,
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
    simulatorSectionHeader: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontWeight: 400,
        padding: theme.spacing(2, 0),
        textDecoration: 'underline'
    },
    customTextBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: '0.8rem'
    },
    singleInputBox: {
        alignItems: 'center',
        padding: '1rem'
    },
    accordionDetails: {
        paddingLeft: '2.4rem'
    },
    groupedColumns: {
        display: 'flex',
        justifyContent: 'space-around'
    },
    groupedSubColumn: {
        display: 'flex',
        justifyContent: 'space-around',
        marginLeft: '0.8rem',
        marginRight: '0.8rem'
    },
    greyedOutColumns: {
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            backgroundColor: theme.palette.background.paper,
            textAlign: 'center',
            fontSize: '1.6rem',
            borderRadius: '3px'
        },
        '&.MuiInput-root': {
            margin: '0.1rem'
        },
        '&.MuiInputBase-root': {
            border: '1px solid ' + theme.palette.primary.contrastText,
            maxWidth: '8rem !important',
            backgroundColor: theme.palette.background.paper,
            color: '#9e9e9e',
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
    groupedHeaders: {
        display: 'flex',
        justifyContent: 'space-evenly'
    }
}));

const CutomButtonGeneration = ({ actionfunc, popupAction, ...params }) => {
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
        if (action_flag_type === 'action_reset') {
            actionfunc(action_flag_type, default_json);
        } else if (action_flag_type === 'action_apply') {
            actionfunc(action_flag_type, simulator_json);
        } else if (action_flag_type === 'save_scenario' && params.namePopup) {
            popupAction(action_flag_type);
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
        } else {
            actionfunc(action_flag_type, simulator_json);
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

const CustomAltSimulatorContext = React.createContext({
    simulator_json: null,
    default_json: null,
    handlePriceInputChange: null,
    handleElasticityInputChange: null,
    handleChildToParentChange: null,
    handleAccordionChanges: null
});

function CustomSliderInput({
    child,
    accordionSummaryData,
    sectionData,
    parentData,
    input,
    section,
    props
}) {
    const classes = useStylesCustomSliders();
    const [inputInfo, setinputInfo] = React.useState(props);
    const [_key] = useState(input);
    const [_section] = useState(section);
    const [defaultValues] = useState({
        elasticity: inputInfo.elasticity_value,
        price: inputInfo.price_change_value
    });
    useEffect(() => {
        setinputInfo(sectionData);
    }, [sectionData, accordionSummaryData, child]);

    let { handlePriceInputChange, handleElasticityInputChange, handleChildToParentChange } =
        useContext(CustomAltSimulatorContext);

    const priceCalculation = (num) => {
        if (num === 0 || num) {
            let val = (num / 100) * inputInfo.static_price_value + inputInfo.static_price_value;
            return Math.round(val * 100) / 100;
        }
        return num;
    };

    const rpiWithCatCalculation = (num) => {
        let val = (num / parentData.accordionSummaryData.price_value) * 100;
        return Math.round(val * 100) / 100;
    };

    const updateChildElasticityData = () => {
        let accordionElasticityValue = 0;
        child.map((item, i) => {
            if (i != _key) {
                accordionElasticityValue += item.elasticity_value * item.elasticity_volume_ratio;
            }
        });
        return accordionElasticityValue;
    };

    const updateChildData = (newinputInfo, newPriceValue) => {
        let newRpiWithSubCat = Number(rpiWithCatCalculation(newPriceValue).toFixed(0));
        let accordionPriceValue = 0;
        let heinzPrice = 0;
        let newInputObj = {};
        child.map((item, i) => {
            if (i != _key) {
                accordionPriceValue += item.price_change_volume_ratio * item.price_change_value;
            }
            if (!item.comp) {
                heinzPrice = item.price_value;
            }
        });
        if (inputInfo.comp) {
            let newHeinzRpiWithComp =
                Number((Math.round((heinzPrice / newPriceValue) * 100 * 100) / 100).toFixed(0)) ||
                0;
            newInputObj = {
                ...inputInfo,
                price_change_value: newinputInfo,
                price_value: newPriceValue,
                rpi_with_subsectors_value: newRpiWithSubCat,
                heinz_rpi_with_comp_value: newHeinzRpiWithComp
            };
        } else {
            newInputObj = {
                ...inputInfo,
                price_change_value: newinputInfo,
                price_value: newPriceValue,
                rpi_with_subsectors_value: newRpiWithSubCat
            };
        }
        return [newInputObj, accordionPriceValue];
    };

    const onHandleSliderChange = (name) => (event, newinputInfo) => {
        if (name === 'slider1') {
            let newPriceValue = priceCalculation(Number(newinputInfo));
            let [newInputObj, accordionPriceValue] = updateChildData(newinputInfo, newPriceValue);
            accordionPriceValue = Math.ceil(
                accordionPriceValue + Number(newinputInfo) * inputInfo.price_change_volume_ratio
            );
            let accordionPricefigure =
                Math.round(
                    ((accordionPriceValue / 100) * accordionSummaryData.static_price_value +
                        accordionSummaryData.static_price_value) *
                        100
                ) / 100;
            let accordionRPIValue = Number(
                (
                    (accordionPricefigure / parentData.accordionSummaryData.price_value) *
                    100
                ).toFixed(0)
            );
            let accordionObject = {
                ...accordionSummaryData,
                price_change_value: accordionPriceValue,
                rpi_with_subsectors_value: accordionRPIValue,
                price_value: accordionPricefigure
            };
            handleChildToParentChange(_section, accordionObject, 'price');
            setinputInfo(newInputObj);
            handlePriceInputChange(_key, _section, newInputObj);
        }
    };

    const validateSliderOneInputChange = (event) => {
        const value = event.target.value;
        if (
            value === '' ||
            isNaN(value) ||
            value > inputInfo.price_change_max ||
            value < inputInfo.price_change_min
        ) {
            let newPriceValue = priceCalculation(defaultValues.price);
            let [newInputObj, accordionPriceValue] = updateChildData(
                defaultValues.price,
                newPriceValue
            );
            accordionPriceValue = Math.ceil(
                accordionPriceValue + Number(value) * inputInfo.price_change_volume_ratio
            );
            let accordionPricefigure =
                Math.round(
                    ((accordionPriceValue / 100) * accordionSummaryData.static_price_value +
                        accordionSummaryData.static_price_value) *
                        100
                ) / 100;
            let accordionRPIValue = Number(
                (
                    (accordionPricefigure / parentData.accordionSummaryData.price_value) *
                    100
                ).toFixed(0)
            );
            let accordionObject = {
                ...accordionSummaryData,
                price_change_value: accordionPriceValue,
                rpi_with_subsectors_value: accordionRPIValue,
                price_value: accordionPricefigure
            };
            handleChildToParentChange(_section, accordionObject, 'price');
            setinputInfo(newInputObj);
            handlePriceInputChange(_key, _section, newInputObj);
        }
    };

    const validateSliderTwoInputChange = (event) => {
        const value = event.target.value;
        let newInputObj;
        let accordionObject;
        if (!(value == defaultValues.elasticity)) {
            if (
                value === '' ||
                isNaN(value) ||
                value > inputInfo.elasticity_max ||
                value < inputInfo.elasticity_min
            ) {
                let newElasticityValue = defaultValues.elasticity;
                newInputObj = { ...inputInfo, elasticity_value: newElasticityValue };
                let accordionElasticityValue = Number(
                    (
                        updateChildElasticityData() +
                        newElasticityValue * inputInfo.elasticity_volume_ratio
                    ).toFixed(2)
                );
                accordionObject = {
                    ...accordionSummaryData,
                    elasticity_value: accordionElasticityValue
                };
            } else {
                newInputObj = {
                    ...inputInfo,
                    elasticity_value: Number(parseFloat(value).toFixed(2))
                };
                let accordionElasticityValue = Number(
                    (
                        updateChildElasticityData() +
                        Number(value) * inputInfo.elasticity_volume_ratio
                    ).toFixed(2)
                );
                accordionObject = {
                    ...accordionSummaryData,
                    elasticity_value: accordionElasticityValue
                };
            }
            handleChildToParentChange(_section, accordionObject, 'elasticity');
            setinputInfo(newInputObj);
            handleElasticityInputChange(_key, _section, newInputObj);
        }
    };

    const handleSliderOneInputChange = (event) => {
        let value = event.target.value === '' ? '' : Number(event.target.value);
        if (value >= inputInfo.price_change_min && value <= inputInfo.price_change_max) {
            let newPriceValue = priceCalculation(event.target.value);
            let [newInputObj, accordionPriceValue] = updateChildData(value, newPriceValue);
            accordionPriceValue = Math.ceil(
                accordionPriceValue + Number(value) * inputInfo.price_change_volume_ratio
            );
            let accordionPricefigure =
                Math.round(
                    ((accordionPriceValue / 100) * accordionSummaryData.static_price_value +
                        accordionSummaryData.static_price_value) *
                        100
                ) / 100;
            let accordionRPIValue = Number(
                (
                    (accordionPricefigure / parentData.accordionSummaryData.price_value) *
                    100
                ).toFixed(0)
            );
            let accordionObject = {
                ...accordionSummaryData,
                price_change_value: accordionPriceValue,
                rpi_with_subsectors_value: accordionRPIValue,
                price_value: accordionPricefigure
            };
            handleChildToParentChange(_section, accordionObject, 'price');
            setinputInfo(newInputObj);
            handlePriceInputChange(_key, _section, newInputObj);
        }
    };

    const handleSliderTwoInputChange = (event) => {
        let value = event.target.value;
        if (
            (value >= inputInfo.elasticity_min && value <= inputInfo.elasticity_max) ||
            value === '' ||
            /^(?:\-0\.[1-3]|\-(?:0\.?)?|0\.1|(?:\-[1-3]|[1-3])\.|0)$/.test(value)
        ) {
            let newInputObj = { ...inputInfo, elasticity_value: value };
            setinputInfo(newInputObj);
            handleElasticityInputChange(_key, _section, newInputObj);
        }
    };

    return (
        <React.Fragment>
            <Grid container direction="row" spacing={3} className={classes.accordionDetails}>
                <Grid item xs={2}>
                    <span className={classes.simulatorSliderLabel}>{inputInfo.label}</span>
                </Grid>
                <Grid item xs={2}>
                    <Slider
                        aria-label="slider1"
                        className={classes.simulatorSliderInput}
                        onChange={onHandleSliderChange('slider1')}
                        value={inputInfo.price_change_value}
                        step={inputInfo.price_change_steps || 0.01}
                        max={inputInfo.price_change_max}
                        min={inputInfo.price_change_min}
                        track={false}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Input
                        className={classes.simulatorSliderInputBox}
                        value={inputInfo.price_change_value}
                        onChange={handleSliderOneInputChange}
                        name="numberformat"
                        endAdornment="% "
                        inputProps={{
                            disableUnderline: false
                        }}
                        type="number"
                        onBlur={validateSliderOneInputChange}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Input
                        className={classes.simulatorSliderInputBox}
                        value={inputInfo.elasticity_value}
                        margin="dense"
                        onChange={handleSliderTwoInputChange}
                        name="numberformat"
                        inputProps={{
                            disableUnderline: false
                        }}
                        onBlur={validateSliderTwoInputChange}
                        disabled={inputInfo?.disableElasticity}
                    />
                </Grid>
                <Grid item xs={6} className={classes.groupedColumns}>
                    <div className={classes.groupedSubColumn}>
                        <Input
                            className={classes.greyedOutColumns}
                            value={inputInfo.static_price_value}
                            startAdornment={
                                inputInfo.static_price_value_symbol_position === 'start' &&
                                getCurrencySymbol(inputInfo.static_price_value_symbol || '')
                            }
                            endAdornment={
                                inputInfo.static_price_value_symbol_position === 'end' &&
                                getCurrencySymbol(inputInfo.static_price_value_symbol || '')
                            }
                        />
                        <Input
                            id="value1_input"
                            className={classes.simulatorSliderInputBox}
                            value={inputInfo.price_value}
                            startAdornment={
                                inputInfo.price_value_symbol_position === 'start' &&
                                getCurrencySymbol(inputInfo.price_value_symbol || '')
                            }
                            endAdornment={
                                inputInfo.price_value_symbol_position === 'end' &&
                                getCurrencySymbol(inputInfo.price_value_symbol || '')
                            }
                        />
                    </div>
                    <div className={classes.groupedSubColumn}>
                        <Input
                            className={classes.greyedOutColumns}
                            value={inputInfo.static_rpi_with_subsectors_value}
                            margin="dense"
                        />
                        <Input
                            id="value2_input"
                            className={classes.simulatorSliderInputBox}
                            value={inputInfo.rpi_with_subsectors_value}
                            margin="dense"
                        />
                    </div>
                    <div className={classes.groupedSubColumn}>
                        <Input
                            className={classes.greyedOutColumns}
                            value={
                                inputInfo.comp ? inputInfo.static_heinz_rpi_with_comp_value : '-'
                            }
                            margin="dense"
                        />
                        <Input
                            id="value3_input"
                            className={classes.simulatorSliderInputBox}
                            value={inputInfo.comp ? inputInfo.heinz_rpi_with_comp_value : '-'}
                            margin="dense"
                        />
                    </div>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

function CodxParentAccordion({ ...props }) {
    const classes = useStyles();
    const [expanded] = React.useState(true);
    const [accordionSummaryData] = React.useState(props.accordionSummaryData);

    // let { handlePriceInputChange, handleElasticityInputChange, handleAccordionChanges } =
    //     useContext(CustomAltSimulatorContext);

    const onHandleSliderChange = () => {};
    const onHandleParentSliderOneInputChange = () => {};
    const validateParentSliderOneInputChange = () => {};
    const onHandleParentSliderTwoInputChange = () => {};
    const validateParentSliderTwoInputChange = () => {};

    return (
        <div className={classes.root}>
            <div>
                <Accordion className={classes.rootSection}>
                    <AccordionSummary
                        className={classes.rootSectionSummary}
                        expandIcon={<ExpandMore />}
                        IconButtonProps={{ edge: 'start' }}
                        style={{ margin: accordionSummaryData?.margin }}
                    >
                        <Grid container direction="row" spacing={3}>
                            <Grid item xs={2}>
                                <Typography variant="h4">{props.sectionName}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Slider
                                    aria-label="slider1"
                                    onClick={(event) => event.stopPropagation()}
                                    onFocus={(event) => event.stopPropagation()}
                                    className={classes.accordionSimulatorSliderInput}
                                    onChange={onHandleSliderChange('slider1')}
                                    value={accordionSummaryData.price_change_value}
                                    step={accordionSummaryData.price_change_steps || 0.01}
                                    max={accordionSummaryData.price_change_max}
                                    min={accordionSummaryData.price_change_min}
                                    track={false}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={1} className={classes.singleInputBox}>
                                <Input
                                    className={classes.simulatorSliderInputBox}
                                    onClick={(event) => event.stopPropagation()}
                                    onFocus={(event) => event.stopPropagation()}
                                    value={accordionSummaryData.price_change_value}
                                    endAdornment="% "
                                    onChange={onHandleParentSliderOneInputChange}
                                    onBlur={validateParentSliderOneInputChange}
                                    type="number"
                                    disabled={accordionSummaryData?.disablePrice}
                                    style={{
                                        color: accordionSummaryData?.color,
                                        borderColor: accordionSummaryData?.borderColor
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <Input
                                    className={classes.simulatorSliderInputBox}
                                    onClick={(event) => event.stopPropagation()}
                                    onFocus={(event) => event.stopPropagation()}
                                    value={accordionSummaryData.elasticity_value}
                                    onChange={onHandleParentSliderTwoInputChange}
                                    onBlur={validateParentSliderTwoInputChange}
                                    disabled={accordionSummaryData?.disableElasticity}
                                />
                            </Grid>
                            <Grid item xs={6} className={classes.groupedColumns}>
                                <div className={classes.groupedSubColumn}>
                                    <Input
                                        className={classes.greyedOutColumns}
                                        value={accordionSummaryData.static_price_value}
                                        startAdornment={
                                            accordionSummaryData.static_price_value_symbol_position ===
                                                'start' &&
                                            getCurrencySymbol(
                                                accordionSummaryData.static_price_value_symbol || ''
                                            )
                                        }
                                        endAdornment={
                                            accordionSummaryData.static_price_value_symbol_position ===
                                                'end' &&
                                            getCurrencySymbol(
                                                accordionSummaryData.static_price_value_symbol || ''
                                            )
                                        }
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                    />
                                    <Input
                                        id="value1_input"
                                        className={classes.simulatorSliderInputBox}
                                        value={accordionSummaryData.price_value}
                                        startAdornment={
                                            accordionSummaryData.price_value_symbol_position ===
                                                'start' &&
                                            getCurrencySymbol(
                                                accordionSummaryData.price_value_symbol || ''
                                            )
                                        }
                                        endAdornment={
                                            accordionSummaryData.price_value_symbol_position ===
                                                'end' &&
                                            getCurrencySymbol(
                                                accordionSummaryData.price_value_symbol || ''
                                            )
                                        }
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                    />
                                </div>
                                <div className={classes.groupedSubColumn}>
                                    <Input
                                        className={classes.greyedOutColumns}
                                        value={
                                            accordionSummaryData?.static_rpi_with_subsectors_value
                                                ? accordionSummaryData.static_rpi_with_subsectors_value
                                                : '-'
                                        }
                                        margin="dense"
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                    />
                                    <Input
                                        id="value2_input"
                                        className={classes.simulatorSliderInputBox}
                                        value={
                                            accordionSummaryData?.rpi_with_subsectors_value
                                                ? accordionSummaryData.rpi_with_subsectors_value
                                                : '-'
                                        }
                                        margin="dense"
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                    />
                                </div>
                                <div className={classes.groupedSubColumn}>
                                    <Input
                                        className={classes.greyedOutColumns}
                                        value={
                                            accordionSummaryData?.static_heinz_rpi_with_comp_value
                                                ? accordionSummaryData.static_heinz_rpi_with_comp_value
                                                : '-'
                                        }
                                        margin="dense"
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                    />
                                    <Input
                                        id="value3_input"
                                        className={classes.simulatorSliderInputBox}
                                        value={
                                            accordionSummaryData?.heinz_rpi_with_comp_value
                                                ? accordionSummaryData.heinz_rpi_with_comp_value
                                                : '-'
                                        }
                                        margin="dense"
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </AccordionSummary>

                    {expanded ? (
                        <AccordionDetails>
                            <div style={{ width: '100%' }}>{props.children}</div>
                        </AccordionDetails>
                    ) : null}
                </Accordion>
            </div>
        </div>
    );
}

function CodxAccordion({ ...props }) {
    const classes = useStyles();
    const [expanded] = React.useState(true);
    const [accordionSummaryData, setAccordionSummaryData] = React.useState(
        props.accordionSummaryData
    );
    const [sectionData] = React.useState(props.sectionData);
    const [defaultValues] = useState({
        price: accordionSummaryData.price_change_value,
        elasticity: accordionSummaryData.elasticity_value
    });
    const [tempElasticityValue, setTempElasticityValue] = useState(
        accordionSummaryData.elasticity_value
    );

    let { handlePriceInputChange, handleElasticityInputChange, handleAccordionChanges } =
        useContext(CustomAltSimulatorContext);

    useEffect(() => {
        setAccordionSummaryData(props.accordionSummaryData);
    }, [props.accordionSummaryData]);

    const priceCalculation = (num) => {
        if (num === 0 || num) {
            let val =
                (num / 100) * accordionSummaryData.static_price_value +
                accordionSummaryData.static_price_value;
            return Math.round(val * 100) / 100;
        }
        return num;
    };
    const rpiWithCatCalculation = (num) => {
        let val = (num / props.parentData.accordionSummaryData.price_value) * 100;
        return Math.round(val * 100) / 100;
    };

    const updateSectionPriceData = (subSectorPriceValue, newinputInfo) => {
        let heinzPrice = 0;
        let subCatPrice = props.parentData.accordionSummaryData.price_value;
        sectionData.map((data, i) => {
            let brandPriceValue =
                (Number(newinputInfo) / 100) * data.static_price_value + data.static_price_value;
            brandPriceValue = Math.round(brandPriceValue * 100) / 100;
            let newRpiWithSubCat = ((brandPriceValue / subCatPrice) * 100).toFixed(0);
            let newObj = {};
            if (!data.comp) {
                heinzPrice = brandPriceValue;
            }
            if (data.comp) {
                let newHeinzRpiWithComp = ((heinzPrice / brandPriceValue) * 100).toFixed(0);
                newObj = {
                    ...data,
                    price_change_value: Number(newinputInfo),
                    price_value: brandPriceValue,
                    rpi_with_subsectors_value: newRpiWithSubCat,
                    heinz_rpi_with_comp_value: newHeinzRpiWithComp
                };
            } else {
                newObj = {
                    ...data,
                    price_change_value: Number(newinputInfo),
                    price_value: brandPriceValue,
                    rpi_with_subsectors_value: newRpiWithSubCat
                };
            }
            handlePriceInputChange(i, props.index, newObj);
        });
    };

    const updateSectionElasticityData = (diff) => {
        sectionData.map((data, i) => {
            let newElasticityValue = data.elasticity_value + diff;
            newElasticityValue = Math.round(newElasticityValue * 100) / 100;
            let newObj = { ...data, elasticity_value: newElasticityValue };
            handleElasticityInputChange(i, props.index, newObj, true);
        });
    };

    const validateParentSliderOneInputChange = (event) => {
        const value = event.target.value;
        if (
            value === '' ||
            isNaN(value) ||
            value > accordionSummaryData.price_change_max ||
            value < accordionSummaryData.price_change_min
        ) {
            let defaultPriceValue = defaultValues.price;
            let subSectorPriceValue = priceCalculation(Number(defaultPriceValue));
            let newInputObj = {
                ...accordionSummaryData,
                price_change_value: Number(defaultPriceValue),
                price_value: subSectorPriceValue
            };
            updateSectionPriceData(subSectorPriceValue, Number(defaultPriceValue));
            handleAccordionChanges(props.sectionName, newInputObj);
            setAccordionSummaryData(newInputObj);
            props.handleParentAccordionChange('price');
        }
    };

    const validateParentSliderTwoInputChange = (event) => {
        const value = event.target.value;
        let diff;
        let newInputObj;
        if (
            value === '' ||
            isNaN(value) ||
            value > accordionSummaryData.elasticity_max ||
            value < accordionSummaryData.elasticity_min
        ) {
            let defaultElasticityValue = defaultValues.elasticity;
            diff = defaultElasticityValue - tempElasticityValue;
            newInputObj = { ...accordionSummaryData, elasticity_value: defaultElasticityValue };
            setTempElasticityValue(defaultElasticityValue);
        } else {
            newInputObj = {
                ...accordionSummaryData,
                elasticity_value: Number(parseFloat(value).toFixed(2))
            };
            diff = Number(value) - tempElasticityValue;
            setTempElasticityValue(Number(value));
        }
        setAccordionSummaryData(newInputObj);
        updateSectionElasticityData(diff);
        handleAccordionChanges(props.sectionName, newInputObj);
        props.handleParentAccordionChange('elasticity');
    };

    const onHandleSliderChange = (name) => (event, newinputInfo) => {
        if (name === 'slider1') {
            let subSectorPriceValue = priceCalculation(Number(newinputInfo));
            let rpiWithSubCatValue = Number(rpiWithCatCalculation(subSectorPriceValue).toFixed(0));
            let newInputObj = {
                ...accordionSummaryData,
                price_change_value: Number(newinputInfo),
                price_value: subSectorPriceValue,
                rpi_with_subsectors_value: rpiWithSubCatValue
            };
            updateSectionPriceData(subSectorPriceValue, newinputInfo);
            handleAccordionChanges(props.sectionName, newInputObj);
            setAccordionSummaryData(newInputObj);
            props.handleParentAccordionChange('price');
        }
    };

    const onHandleParentSliderOneInputChange = (event) => {
        let value = event.target.value === '' ? '' : Number(event.target.value);
        if (
            value >= accordionSummaryData.price_change_min &&
            value <= accordionSummaryData.price_change_max
        ) {
            let subSectorPriceValue = priceCalculation(event.target.value);
            let newInputObj = {
                ...accordionSummaryData,
                price_change_value: value,
                price_value: subSectorPriceValue
            };
            updateSectionPriceData(subSectorPriceValue, Number(value));
            handleAccordionChanges(props.sectionName, newInputObj);
            setAccordionSummaryData(newInputObj);
            props.handleParentAccordionChange('price');
        }
    };

    const onHandleParentSliderTwoInputChange = (event) => {
        let value = event.target.value;
        if (
            value >= accordionSummaryData.elasticity_min &&
            value <= accordionSummaryData.elasticity_max
        ) {
            let diff = Number(event.target.value) - tempElasticityValue || 0;
            let newInputObj = { ...accordionSummaryData, elasticity_value: value };
            setTempElasticityValue(value);
            setAccordionSummaryData(newInputObj);
            updateSectionElasticityData(diff);
            handleAccordionChanges(props.sectionName, newInputObj);
            props.handleParentAccordionChange('elasticity');
        } else if (
            /^(?:\-0\.[1-3]|\-(?:0\.?)?|0\.1|(?:\-[1-3]|[1-3])\.|0)$/.test(value) ||
            value === ''
        ) {
            let newInputObj = { ...accordionSummaryData, elasticity_value: value };
            setAccordionSummaryData(newInputObj);
        }
    };

    return (
        <div className={classes.root}>
            <div>
                <Accordion className={classes.rootSection}>
                    <AccordionSummary
                        className={classes.rootSectionSummary}
                        expandIcon={<ExpandMore style={{ cursor: 'pointer' }} />}
                        IconButtonProps={{ edge: 'start' }}
                    >
                        <Grid container direction="row" spacing={3}>
                            <Grid item xs={2}>
                                <Typography variant="h4">{props.sectionName}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Slider
                                    aria-label="slider1"
                                    onClick={(event) => event.stopPropagation()}
                                    onFocus={(event) => event.stopPropagation()}
                                    className={classes.accordionSimulatorSliderInput}
                                    onChange={onHandleSliderChange('slider1')}
                                    value={accordionSummaryData.price_change_value}
                                    step={accordionSummaryData.price_change_steps || 0.01}
                                    max={accordionSummaryData.price_change_max}
                                    min={accordionSummaryData.price_change_min}
                                    track={false}
                                />
                            </Grid>
                            <Grid item xs={1} className={classes.singleInputBox}>
                                <Input
                                    className={classes.simulatorSliderInputBox}
                                    onClick={(event) => event.stopPropagation()}
                                    onFocus={(event) => event.stopPropagation()}
                                    value={accordionSummaryData.price_change_value}
                                    endAdornment="% "
                                    onChange={onHandleParentSliderOneInputChange}
                                    onBlur={validateParentSliderOneInputChange}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <Input
                                    className={classes.simulatorSliderInputBox}
                                    onClick={(event) => event.stopPropagation()}
                                    onFocus={(event) => event.stopPropagation()}
                                    value={accordionSummaryData.elasticity_value}
                                    onChange={onHandleParentSliderTwoInputChange}
                                    onBlur={validateParentSliderTwoInputChange}
                                    disabled={accordionSummaryData?.disableElasticity}
                                />
                            </Grid>
                            <Grid item xs={6} className={classes.groupedColumns}>
                                <div className={classes.groupedSubColumn}>
                                    <Input
                                        className={classes.greyedOutColumns}
                                        value={accordionSummaryData.static_price_value}
                                        startAdornment={
                                            accordionSummaryData.static_price_value_symbol_position ===
                                                'start' &&
                                            getCurrencySymbol(
                                                accordionSummaryData.static_price_value_symbol || ''
                                            )
                                        }
                                        endAdornment={
                                            accordionSummaryData.static_price_value_symbol_position ===
                                                'end' &&
                                            getCurrencySymbol(
                                                accordionSummaryData.static_price_value_symbol || ''
                                            )
                                        }
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                    />
                                    <Input
                                        id="value1_input"
                                        className={classes.simulatorSliderInputBox}
                                        value={accordionSummaryData.price_value}
                                        startAdornment={
                                            accordionSummaryData.price_value_symbol_position ===
                                                'start' &&
                                            getCurrencySymbol(
                                                accordionSummaryData.price_value_symbol || ''
                                            )
                                        }
                                        endAdornment={
                                            accordionSummaryData.price_value_symbol_position ===
                                                'end' &&
                                            getCurrencySymbol(
                                                accordionSummaryData.price_value_symbol || ''
                                            )
                                        }
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                    />
                                </div>
                                <div className={classes.groupedSubColumn}>
                                    <Input
                                        className={classes.greyedOutColumns}
                                        value={
                                            accordionSummaryData?.static_rpi_with_subsectors_value
                                                ? accordionSummaryData.static_rpi_with_subsectors_value
                                                : '-'
                                        }
                                        margin="dense"
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                    />
                                    <Input
                                        id="value2_input"
                                        className={classes.simulatorSliderInputBox}
                                        value={
                                            accordionSummaryData?.rpi_with_subsectors_value
                                                ? accordionSummaryData.rpi_with_subsectors_value
                                                : '-'
                                        }
                                        margin="dense"
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                    />
                                </div>
                                <div className={classes.groupedSubColumn}>
                                    <Input
                                        className={classes.greyedOutColumns}
                                        value={
                                            accordionSummaryData?.static_heinz_rpi_with_comp_value
                                                ? accordionSummaryData.static_heinz_rpi_with_comp_value
                                                : '-'
                                        }
                                        margin="dense"
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                    />
                                    <Input
                                        id="value3_input"
                                        className={classes.simulatorSliderInputBox}
                                        value={
                                            accordionSummaryData?.heinz_rpi_with_comp_value
                                                ? accordionSummaryData.heinz_rpi_with_comp_value
                                                : '-'
                                        }
                                        margin="dense"
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </AccordionSummary>

                    {expanded ? (
                        <AccordionDetails>
                            <div style={{ width: '100%' }}>{props.children}</div>
                        </AccordionDetails>
                    ) : null}
                </Accordion>
            </div>
        </div>
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
            aria-labelledby="alternate-simulator-typec-save-scenario"
        >
            <DialogTitle id="alternate-simulator-typec-save-scenario">
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
export default function AlternateSimulatorTypeC({
    params,
    onAction,
    onCloseSimulator,
    onTriggerNotification,
    theme,
    ...props
}) {
    const classes = useStyles();
    const defaultState = Object.assign({}, params ? params : null);
    const [state, setState] = useState(JSON.parse(JSON.stringify(params)));
    const [accordionSummaryData] = useState(state.accordionSummaryData);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [toolbarValues, setToolBarValues] = useState(params.isToolBar);
    const [parentSection, setParentSection] = useState(state.headerSection);
    const [openPopup, setOpenPopup] = useState(false);
    const [defaultScenarioName] = useState(
        state.actions?.find((el) => el?.action_flag_type === 'save_scenario')?.scenarioName || ''
    );
    const scenarioButton = state.actions?.find((el) => el?.action_flag_type === 'save_scenario');
    const showScenarioButton = state.actions?.find((el) => el?.action_flag_type === 'save_scenario')
        ? true
        : false;
    const loadScenarioButton = state.actions?.find((el) => el?.action_flag_type === 'load_scenario')
        ? true
        : false;
    const namePopup = scenarioButton && scenarioButton.namePopup === false ? false : true;

    useEffect(() => {
        if (theme) {
            let toolBarState = toolbarValues;
            for (let el in toolBarState) {
                if (toolBarState[el].length) {
                    for (let ele of toolBarState[el]) {
                        if (ele?.id === 'legendsIcon') {
                            ele['theme'] = theme;
                        }
                    }
                }
            }
            setToolBarValues((s) => {
                return {
                    ...s,
                    toolBarState
                };
            });
        }
    }, [theme]);

    const loadScenario = (scenario) => {
        let timerId;
        setState(false);
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            setState(scenario.scenarios_json);
        }, 5000);
        props.onLoadScenario(scenario.scenarios_json);
    };

    const actionRenderer = (actions) => {
        return (
            <Box display="flex" width="100%">
                <Box marginLeft="auto" paddingRight="4.9rem">
                    {
                        <CutomButtonGeneration
                            action_buttons={actions}
                            classes={classes}
                            actionfunc={props.parent_obj.handleAltActionInvoke}
                            props={props}
                            popupAction={handleAction}
                            namePopup={namePopup}
                            onAction={onAction}
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
                    props.savedScenarios?.length > 0 ? (
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
                        onClick={onCloseSimulator}
                        aria-label="Close"
                    >
                        {'Close'}
                    </Button>
                </Box>
            </Box>
        );
    };

    const onClickPopupAction = (e, action) => {
        setOpenPopup(() => action === 'open');
    };

    const handlePriceInputChange = (input_index, section_index, value) => {
        let temp_state = { ...state };
        temp_state.section_inputs[state.sections[section_index]][input_index] = value;
        setState({
            ...state,
            ...temp_state
        });
    };
    const handleParentAccordionChange = (changed) => {
        let newparentSection = { ...parentSection };
        if (changed === 'price') {
            let newPriceChangeValue = 0;
            for (let el in accordionSummaryData) {
                newPriceChangeValue +=
                    accordionSummaryData[el].price_change_value *
                    accordionSummaryData[el].price_change_volume_ratio;
            }
            newPriceChangeValue = Math.ceil(newPriceChangeValue);
            let newPriceValue =
                Math.round(
                    ((newPriceChangeValue / 100) *
                        parentSection.accordionSummaryData.static_price_value +
                        parentSection.accordionSummaryData.static_price_value) *
                        100
                ) / 100;
            newparentSection.accordionSummaryData.price_change_value = newPriceChangeValue;
            newparentSection.accordionSummaryData.price_value = newPriceValue;
        } else if (changed === 'elasticity') {
            let newElasticityChangeValue = 0;
            for (let el in accordionSummaryData) {
                newElasticityChangeValue +=
                    accordionSummaryData[el].elasticity_value *
                    accordionSummaryData[el].elasticity_volume_ratio;
            }
            newElasticityChangeValue = Number(newElasticityChangeValue.toFixed(2));
            newparentSection.accordionSummaryData.elasticity_value = newElasticityChangeValue;
        }
        setParentSection((s) => {
            return { ...s, ...newparentSection };
        });
    };

    const handleElasticityInputChange = (input_index, section_index, value, isSliderAction) => {
        let temp_state = { ...state };
        let ElasticityValue = temp_state.section_inputs[state.sections[section_index]][input_index];
        let updatedValue = value;
        if (value.elasticity_value >= ElasticityValue.elasticity_max && isSliderAction) {
            updatedValue.elasticity_value = ElasticityValue.elasticity_max;
        } else if (value.elasticity_value <= ElasticityValue.elasticity_min && isSliderAction) {
            updatedValue.elasticity_value = ElasticityValue.elasticity_min;
        }
        temp_state.section_inputs[state.sections[section_index]][input_index] = updatedValue;
        setState({
            ...state,
            ...temp_state
        });
    };

    const overrideElasticityValues = (elasticityValue) => {
        let temp_state = { ...state };
        // update subSector level values
        for (let el in temp_state.accordionSummaryData) {
            temp_state.accordionSummaryData[el].elasticity_value =
                elasticityValue.headerSection[0].accordionSummaryData[el].elasticity_value;
            // update brand level values
            for (let i = 0; i < temp_state.section_inputs[el].length; i++) {
                temp_state.section_inputs[el][i].elasticity_value =
                    elasticityValue.headerSection[0].section_inputs[el][i].elasticity_value;
            }
        }
        // update subCat level values
        let newparentSection = { ...parentSection };
        newparentSection.accordionSummaryData.elasticity_value =
            elasticityValue.headerSection[0].section_data.elasticity_value;

        setParentSection((s) => {
            return { ...s, ...newparentSection };
        });
        setState({
            ...state,
            ...temp_state
        });
    };

    const handleChildToParentChange = (section_index, object, changed) => {
        let temp_state = { ...state };
        temp_state.accordionSummaryData[state.sections[section_index]] = { ...object };
        let newparentSection = { ...parentSection };
        if (changed === 'price') {
            let newPriceChangeValue = 0;
            for (let el in temp_state.accordionSummaryData) {
                newPriceChangeValue +=
                    temp_state.accordionSummaryData[el].price_change_value *
                    temp_state.accordionSummaryData[el].price_change_volume_ratio;
            }
            newPriceChangeValue = Math.ceil(newPriceChangeValue);
            let newPriceValue =
                Math.round(
                    ((newPriceChangeValue / 100) *
                        parentSection.accordionSummaryData.static_price_value +
                        parentSection.accordionSummaryData.static_price_value) *
                        100
                ) / 100;
            newparentSection.accordionSummaryData.price_change_value = newPriceChangeValue;
            newparentSection.accordionSummaryData.price_value = newPriceValue;
        } else if (changed === 'elasticity') {
            let newElasticityChangeValue = 0;
            for (let el in accordionSummaryData) {
                newElasticityChangeValue +=
                    accordionSummaryData[el].elasticity_value *
                    accordionSummaryData[el].elasticity_volume_ratio;
            }
            newElasticityChangeValue = Number(newElasticityChangeValue.toFixed(2));
            newparentSection.accordionSummaryData.elasticity_value = newElasticityChangeValue;
        }
        setParentSection((s) => {
            return { ...s, ...newparentSection };
        });
        setState({
            ...state,
            ...temp_state
        });
    };

    const handleAccordionChanges = (sectionName, value) => {
        let temp_state = { ...state };
        temp_state.accordionSummaryData[sectionName] = { ...value };
        setState((s) => ({
            ...s,
            ...temp_state
        }));
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
            // console.error(err);
        }
    };

    const toggleAction = async (fieldId, value) => {
        const priceType = value ? 'Average Price' : 'Base Price';
        const resp = await props.parent_obj.handleAltActionInvoke(priceType, { ...state });
        setState((s) => ({ ...s, ...resp }));
        return resp;
    };

    return (
        <div>
            {state ? (
                <CustomAltSimulatorContext.Provider
                    value={{
                        simulator_json: state,
                        default_json: defaultState,
                        handlePriceInputChange: handlePriceInputChange,
                        handleElasticityInputChange: handleElasticityInputChange,
                        handleChildToParentChange: handleChildToParentChange,
                        handleAccordionChanges: handleAccordionChanges
                    }}
                >
                    <Paper>
                        <Grid container justifyContent="space-evenly" alignItems="center">
                            {props.show_simulator ? (
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    {state?.elasticity_overlay && (
                                        <OverlayWindow
                                            dialogAction={setOpenPopup}
                                            open={openPopup}
                                            data={state}
                                            elasticityData={state.elasticity_overlay}
                                            handleElasticityUpdate={overrideElasticityValues}
                                            onTriggerNotification={onTriggerNotification}
                                        />
                                    )}
                                    <Grid container>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            className={clsx(
                                                classes.headerContainer,
                                                classes.popUpHeaderContainer
                                            )}
                                        >
                                            <Grid container direction="row" spacing={3}>
                                                <Grid item xs={2}>
                                                    <Typography
                                                        variant="h5"
                                                        className={classes.subsector}
                                                    >
                                                        {state.headers[0]}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography variant="h5">
                                                        {state.headers[1]}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={1} wrap="nowrap">
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-evenly'
                                                        }}
                                                    >
                                                        <Typography variant="h5">
                                                            {state.headers[2]}
                                                        </Typography>
                                                        {state?.elasticity_overlay && (
                                                            <OpenInNew
                                                                onClick={(e) =>
                                                                    onClickPopupAction(e, 'open')
                                                                }
                                                                className={classes.OpenIcon}
                                                                fontSize={
                                                                    state?.elasticity_overlay
                                                                        ?.overlayIconSize || 'large'
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={6}
                                                    className={classes.groupedHeaders}
                                                >
                                                    <div className={classes.headerwidth}>
                                                        <Typography variant="h5">
                                                            {state.headers[3]}
                                                        </Typography>
                                                    </div>
                                                    <div className={classes.headerwidth}>
                                                        <Typography variant="h5">
                                                            {state.headers[4]}
                                                        </Typography>
                                                    </div>
                                                    <div className={classes.headerwidth}>
                                                        <Typography variant="h5">
                                                            {state.headers[5]}
                                                        </Typography>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            {state?.isContainToolBar ? (
                                                <ToolBar
                                                    props={toolbarValues}
                                                    onAction={toggleAction}
                                                />
                                            ) : null}
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            className={classes.simulatorContainer}
                                        >
                                            <CodxParentAccordion
                                                sectionName={parentSection.section_name}
                                                key={0}
                                                index={0}
                                                sectionData={parentSection.data}
                                                accordionSummaryData={
                                                    parentSection.accordionSummaryData
                                                }
                                            >
                                                {state.sections.map((section, index) => {
                                                    return (
                                                        <CodxAccordion
                                                            sectionName={section}
                                                            key={index}
                                                            index={index}
                                                            sectionData={
                                                                state.section_inputs[section]
                                                            }
                                                            accordionSummaryData={
                                                                accordionSummaryData[section]
                                                            }
                                                            parentData={state.headerSection}
                                                            handleParentAccordionChange={
                                                                handleParentAccordionChange
                                                            }
                                                        >
                                                            <React.Fragment key={'section' + index}>
                                                                <Grid
                                                                    container
                                                                    direction="row"
                                                                    justifyContent="space-around"
                                                                    alignItems="center"
                                                                    className={
                                                                        classes.simulatorSection
                                                                    }
                                                                >
                                                                    <Grid item xs={12}>
                                                                        {state.section_inputs[
                                                                            section
                                                                        ].map((input, key) => {
                                                                            return (
                                                                                <CustomSliderInput
                                                                                    accordionSummaryData={
                                                                                        state
                                                                                            .accordionSummaryData[
                                                                                            section
                                                                                        ]
                                                                                    }
                                                                                    child={
                                                                                        state
                                                                                            .section_inputs[
                                                                                            section
                                                                                        ]
                                                                                    }
                                                                                    sectionData={
                                                                                        input
                                                                                    }
                                                                                    input={key}
                                                                                    section={index}
                                                                                    grid={12}
                                                                                    props={{
                                                                                        ...input
                                                                                    }}
                                                                                    key={
                                                                                        'input' +
                                                                                        key
                                                                                    }
                                                                                    parentData={
                                                                                        state.headerSection
                                                                                    }
                                                                                />
                                                                            );
                                                                        })}
                                                                    </Grid>
                                                                </Grid>
                                                            </React.Fragment>
                                                        </CodxAccordion>
                                                    );
                                                })}
                                            </CodxParentAccordion>
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
                            {state.graph_info ? (
                                <GraphInfoSimulatorTypeC
                                    graphInfo={state.graph_info}
                                    size_nooverride={false}
                                    color_nooverride={true}
                                />
                            ) : null}
                        </Grid>
                    </Paper>
                </CustomAltSimulatorContext.Provider>
            ) : (
                <CodxCircularLoader size={60} center />
            )}
        </div>
    );
}

const OverlayWindow = (props) => {
    const classes = useStyles();
    const [data, setData] = useState({ ...props.elasticityData });
    const [defaultData, setDefaultData] = useState(deepClone({ ...props.elasticityData }));

    const onClickFormAction = (e, name) => {
        if (name === 'cancel') {
            props.dialogAction(false);
            setData(deepClone({ ...defaultData }));
        } else if (name === 'save') {
            props.dialogAction(false);
            setDefaultData(deepClone({ ...data }));
            props.onTriggerNotification({
                notification: {
                    message: data?.saveMessage || 'updating values',
                    severity: 'success'
                }
            });
            props.handleElasticityUpdate({ ...data });
        }
    };

    return (
        <Dialog
            key={3}
            open={props.open}
            fullWidth
            classes={{ paper: classes.paper }}
            maxWidth={data?.overlayWindowSize || 'lg'}
        >
            <DialogTitle className={classes.title} disableTypography>
                {data?.closeIcon && (
                    <Button
                        title="close"
                        className={classes.btn}
                        variant={data.closeIcon?.variant || 'contained'}
                        onClick={(e) => {
                            onClickFormAction(e, data.closeIcon.action);
                        }}
                        style={{
                            position: 'absolute',
                            top: '6px',
                            right: '10px',
                            padding: '2px',
                            minWidth: 'unset',
                            borderRadius: '50%'
                        }}
                        aria-label="Close"
                    >
                        <Close fontSize="large" />
                    </Button>
                )}
            </DialogTitle>
            <DialogContent>
                <CustomPopupAccordion params={data} />
            </DialogContent>
            <DialogActions
                style={{ padding: '8px 24px 24px', display: 'flex', justifyContent: 'flex-end' }}
            >
                <div>
                    {data.buttons.map((el, i) => {
                        return (
                            <Button
                                key={'btn' + i}
                                className={classes.btn}
                                variant={el?.variant}
                                style={{ margin: el?.margin }}
                                onClick={(e) => {
                                    onClickFormAction(e, el.action);
                                }}
                                aria-label={el.name}
                            >
                                {el.name}
                            </Button>
                        );
                    })}
                </div>
            </DialogActions>
        </Dialog>
    );
};

function CustomPopupAccordion({ params }) {
    const classes = useStyles();
    const [data, setData] = useState(deepClone({ ...params }));
    const [defaultData] = useState(deepClone({ ...params }));

    useEffect(() => {
        setData({ ...params });
    }, [params]);

    const checkElasticityValue = (value, min, max) => {
        if (
            value >= min &&
            value <= max &&
            value.charAt(value.length - 1) != '.' &&
            !['-0', '.0'].includes(value.substring(value.length - 2, value.length)) &&
            value != ''
        ) {
            return 1;
        } else if (/^\-?[0-9]\d{0,2}(\.\d{0,2})?$/.test(value) || value == '-' || value == '') {
            return 2;
        } else {
            return 0;
        }
    };
    const validateElasticityRange = (value, min, max) => {
        if (value >= min && value <= max) {
            return 'value';
        } else if (value > max) {
            return 'max';
        } else {
            return 'min';
        }
    };

    const validateBrandLevelChange = (e) => {
        let value = e.target.value;
        let [section_name, index, i] = e.target.name.split('_');
        let elasticityMin =
            data.headerSection[Number(index)].section_inputs[section_name][Number(i)]
                .elasticity_min;
        let elasticityMax =
            data.headerSection[Number(index)].section_inputs[section_name][Number(i)]
                .elasticity_max;
        if (checkElasticityValue(value, elasticityMin, elasticityMax) != 1) {
            // update Elasticity for brand -> subsector -> subCat
            let tempState = { ...data };
            tempState.headerSection[Number(index)].section_inputs[section_name][
                Number(i)
            ].elasticity_value =
                defaultData.headerSection[Number(index)].section_inputs[section_name][
                    Number(i)
                ].elasticity_value;
            tempState.headerSection[Number(index)].accordionSummaryData[
                section_name
            ].elasticity_value =
                defaultData.headerSection[Number(index)].accordionSummaryData[
                    section_name
                ].elasticity_value;
            tempState.headerSection[Number(index)].section_data.elasticity_value =
                defaultData.headerSection[Number(index)].section_data.elasticity_value;
            setData((s) => {
                return { ...s, ...tempState };
            });
        }
    };

    const validateSubsectorLevelChange = (e) => {
        let [section_name, index] = e.target.name.split('_');
        let elasticityMin =
            data.headerSection[Number(index)].accordionSummaryData[section_name].elasticity_min;
        let elasticityMax =
            data.headerSection[Number(index)].accordionSummaryData[section_name].elasticity_max;
        if (checkElasticityValue(e.target.value, elasticityMin, elasticityMax) != 1) {
            let tempState = { ...data };
            tempState.headerSection[Number(index)].accordionSummaryData[
                section_name
            ].elasticity_value =
                defaultData.headerSection[Number(index)].accordionSummaryData[
                    section_name
                ].elasticity_value;
            tempState.headerSection[Number(index)].section_data.elasticity_value =
                defaultData.headerSection[Number(index)].section_data.elasticity_value;
            for (
                let i = 0;
                i < tempState.headerSection[Number(index)].section_inputs[section_name].length;
                i++
            ) {
                tempState.headerSection[Number(index)].section_inputs[section_name][
                    i
                ].elasticity_value =
                    defaultData.headerSection[Number(index)].section_inputs[section_name][
                        i
                    ].elasticity_value;
            }
            setData((s) => {
                return { ...s, ...tempState };
            });
        }
    };

    const onBrandLevelChange = (e) => {
        let [section_name, index, i] = e.target.name.split('_');
        let elasticityMin =
            data.headerSection[Number(index)].section_inputs[section_name][Number(i)]
                .elasticity_min;
        let elasticityMax =
            data.headerSection[Number(index)].section_inputs[section_name][Number(i)]
                .elasticity_max;
        if (checkElasticityValue(e.target.value, elasticityMin, elasticityMax) === 1) {
            // update Elasticity for brand -> subsector -> subCat
            let tempState = { ...data };
            tempState.headerSection[Number(index)].section_inputs[section_name][
                Number(i)
            ].elasticity_value = Number(parseFloat(e.target.value).toFixed(2));
            let subSectorElasticity = 0;
            tempState.headerSection[Number(index)].section_inputs[section_name].map((brand) => {
                subSectorElasticity += brand.elasticity_value * brand.elasticity_volume_ratio;
            });
            subSectorElasticity = Number(subSectorElasticity.toFixed(2));
            let subSectorValidatedValue = validateElasticityRange(
                subSectorElasticity,
                tempState.headerSection[Number(index)].accordionSummaryData[section_name]
                    .elasticity_min,
                tempState.headerSection[Number(index)].accordionSummaryData[section_name]
                    .elasticity_max
            );
            subSectorValidatedValue === 'value'
                ? (tempState.headerSection[Number(index)].accordionSummaryData[
                      section_name
                  ].elasticity_value = subSectorElasticity)
                : (tempState.headerSection[Number(index)][section_name].elasticity_value =
                      tempState.headerSection[Number(index)].accordionSummaryData[section_name][
                          `elasticity_${subSectorValidatedValue}`
                      ]);
            let subCatElasticity = 0;
            for (let el in tempState.headerSection[Number(index)].accordionSummaryData) {
                subCatElasticity +=
                    tempState.headerSection[Number(index)].accordionSummaryData[el]
                        .elasticity_value *
                    tempState.headerSection[Number(index)].accordionSummaryData[el]
                        .elasticity_volume_ratio;
            }
            subCatElasticity = Number(subCatElasticity.toFixed(2));
            let subCatValidatedValue = validateElasticityRange(
                subCatElasticity,
                tempState.headerSection[Number(index)].section_data.elasticity_min,
                tempState.headerSection[Number(index)].section_data.elasticity_max
            );
            subCatValidatedValue === 'value'
                ? (tempState.headerSection[Number(index)].section_data.elasticity_value =
                      subCatElasticity)
                : (tempState.headerSection[Number(index)].section_data.elasticity_value =
                      tempState.headerSection[Number(index)].section_data[
                          `elasticity_${subCatValidatedValue}`
                      ]);
            // newparentSection.accordionSummaryData.elasticity_value = newElasticityChangeValue
            setData((s) => {
                return { ...s, ...tempState };
            });
        } else if (checkElasticityValue(e.target.value, elasticityMin, elasticityMax) === 2) {
            let tempState = { ...data };
            tempState.headerSection[Number(index)].section_inputs[section_name][
                Number(i)
            ].elasticity_value = e.target.value;
            setData((s) => {
                return { ...s, ...tempState };
            });
        }
    };

    const onSubsectorLevelChange = (e) => {
        let [section_name, index] = e.target.name.split('_');
        let elasticityMin =
            data.headerSection[Number(index)].accordionSummaryData[section_name].elasticity_min;
        let elasticityMax =
            data.headerSection[Number(index)].accordionSummaryData[section_name].elasticity_max;
        if (checkElasticityValue(e.target.value, elasticityMin, elasticityMax) === 1) {
            // update Elasticity for subsector -> subCat --- <- brand
            let tempState = { ...data };
            let diff =
                Number(parseFloat(e.target.value).toFixed(2)) -
                data.headerSection[Number(index)].accordionSummaryData[section_name]
                    .elasticity_value;
            tempState.headerSection[Number(index)].accordionSummaryData[
                section_name
            ].elasticity_value = Number(parseFloat(e.target.value).toFixed(2));
            // subsector -> subCat
            let subCatElasticity = 0;
            for (let el in tempState.headerSection[Number(index)].accordionSummaryData) {
                subCatElasticity +=
                    tempState.headerSection[Number(index)].accordionSummaryData[el]
                        .elasticity_value *
                    tempState.headerSection[Number(index)].accordionSummaryData[el]
                        .elasticity_volume_ratio;
            }
            subCatElasticity = Number(subCatElasticity.toFixed(2));
            let subCatValidatedValue = validateElasticityRange(
                subCatElasticity,
                tempState.headerSection[Number(index)].section_data.elasticity_min,
                tempState.headerSection[Number(index)].section_data.elasticity_max
            );
            subCatValidatedValue === 'value'
                ? (tempState.headerSection[Number(index)].section_data.elasticity_value =
                      subCatElasticity)
                : (tempState.headerSection[Number(index)].section_data.elasticity_value =
                      tempState.headerSection[Number(index)].section_data[
                          `elasticity_${subCatValidatedValue}`
                      ]);

            // subsector <- brand
            tempState.headerSection[Number(index)].section_inputs[section_name].forEach((brand) => {
                const brandElasticity = Number((brand.elasticity_value + diff).toFixed(2));
                const validateBrandElasticity = validateElasticityRange(
                    brandElasticity,
                    brand.elasticity_min,
                    brand.elasticity_max
                );
                validateBrandElasticity === 'value'
                    ? (brand.elasticity_value = brandElasticity)
                    : (brand.elasticity_value = brand[`elasticity_${validateBrandElasticity}`]);
            });
            setData((s) => {
                return { ...s, ...tempState };
            });
        } else if (checkElasticityValue(e.target.value, elasticityMin, elasticityMax) === 2) {
            let tempState = { ...data };
            tempState.headerSection[Number(index)].accordionSummaryData[
                section_name
            ].elasticity_value = e.target.value;
            setData((s) => {
                return { ...s, ...tempState };
            });
        }
    };

    return (
        <Paper>
            <Grid container xs={12}>
                <Grid container xs={12} className={classes.headerContainer}>
                    {data?.headers.map((header, index) => {
                        return (
                            <Grid
                                key={'header' + index}
                                item
                                xs={header.grid}
                                style={{ color: header?.color, backgroundColor: header?.bgColor }}
                            >
                                <Typography variant="h5">{header.name}</Typography>
                            </Grid>
                        );
                    })}
                </Grid>
                <Grid container xs={12} className={classes.subHeaderContainer}>
                    {data?.subHeaders.map((subHeader, index) => {
                        return (
                            <Grid
                                key={'subHeader' + index}
                                item
                                xs={subHeader.grid}
                                style={{
                                    color: subHeader?.color,
                                    backgroundColor: subHeader?.bgColor,
                                    border: subHeader?.color
                                }}
                            >
                                <Typography variant="h5">{subHeader.name}</Typography>
                            </Grid>
                        );
                    })}
                </Grid>
                <Grid container xs={12}>
                    {data?.headerSection.map((headerElement, headerIndex) => {
                        const section_data = headerElement.section_data;
                        return (
                            <Grid key={'headerElement' + headerIndex} item xs={12}>
                                <Accordion className={classes.rootSection}>
                                    <AccordionSummary
                                        className={classes.popUpRootSectionSummary}
                                        expandIcon={<ExpandMore />}
                                        style={{ padding: section_data?.paddingElasticity }}
                                    >
                                        <Grid container xs={12}>
                                            <Grid item xs={4}>
                                                <Typography variant="h5">
                                                    {section_data.section_name}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={4}
                                                align="center"
                                                style={{ padding: section_data?.paddingElasticity }}
                                            >
                                                <Input
                                                    className={classes.simulatorSliderInputBox}
                                                    onClick={(event) => event.stopPropagation()}
                                                    onFocus={(event) => event.stopPropagation()}
                                                    value={section_data.elasticity_value}
                                                    name={`header_ ${headerIndex}`}
                                                    type="numberformat"
                                                    step="any"
                                                    disabled={section_data?.disableInput}
                                                    style={{
                                                        color: section_data?.color,
                                                        borderColor: section_data?.borderColor
                                                    }}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}
                                                align="center"
                                                style={{ margin: 'auto' }}
                                            >
                                                <Typography variant="h5">
                                                    {section_data.elasticity_min}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}
                                                align="center"
                                                style={{ margin: 'auto' }}
                                            >
                                                <Typography variant="h5">
                                                    {section_data.elasticity_max}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div style={{ width: '100%' }}>
                                            {headerElement?.accordionSections.map(
                                                (section, subCatindex) => {
                                                    return (
                                                        <Grid
                                                            key={'accordion' + subCatindex}
                                                            item
                                                            xs={12}
                                                        >
                                                            <Accordion
                                                                className={classes.rootSection}
                                                            >
                                                                <AccordionSummary
                                                                    className={
                                                                        classes.popUpRootSectionSummary
                                                                    }
                                                                    expandIcon={<ExpandMore />}
                                                                >
                                                                    <Grid container xs={12}>
                                                                        <Grid item xs={4}>
                                                                            <Typography variant="h5">
                                                                                {section}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={4}
                                                                            align="center"
                                                                        >
                                                                            <Input
                                                                                className={
                                                                                    classes.simulatorSliderInputBox
                                                                                }
                                                                                onClick={(event) =>
                                                                                    event.stopPropagation()
                                                                                }
                                                                                onFocus={(event) =>
                                                                                    event.stopPropagation()
                                                                                }
                                                                                value={
                                                                                    headerElement
                                                                                        ?.accordionSummaryData[
                                                                                        section
                                                                                    ]
                                                                                        .elasticity_value
                                                                                }
                                                                                name={`${section}_ ${headerIndex}`}
                                                                                type="numberformat"
                                                                                onChange={
                                                                                    onSubsectorLevelChange
                                                                                }
                                                                                onBlur={
                                                                                    validateSubsectorLevelChange
                                                                                }
                                                                                step="any"
                                                                            />
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={2}
                                                                            align="center"
                                                                            style={{
                                                                                padding:
                                                                                    headerElement
                                                                                        ?.accordionSummaryData[
                                                                                        section
                                                                                    ]?.paddingMin,
                                                                                margin: 'auto'
                                                                            }}
                                                                        >
                                                                            <Typography variant="h5">
                                                                                {
                                                                                    headerElement
                                                                                        ?.accordionSummaryData[
                                                                                        section
                                                                                    ].elasticity_min
                                                                                }
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={2}
                                                                            align="center"
                                                                            style={{
                                                                                padding:
                                                                                    headerElement
                                                                                        ?.accordionSummaryData[
                                                                                        section
                                                                                    ]?.paddingMin,
                                                                                margin: 'auto'
                                                                            }}
                                                                        >
                                                                            <Typography variant="h5">
                                                                                {
                                                                                    headerElement
                                                                                        ?.accordionSummaryData[
                                                                                        section
                                                                                    ].elasticity_max
                                                                                }
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <div style={{ width: '100%' }}>
                                                                        {headerElement?.section_inputs[
                                                                            section
                                                                        ].map((el, i) => {
                                                                            return (
                                                                                <Grid
                                                                                    key={
                                                                                        'accordionDetail' +
                                                                                        i
                                                                                    }
                                                                                    container
                                                                                    xs={12}
                                                                                >
                                                                                    <Grid
                                                                                        item
                                                                                        xs={4}
                                                                                    >
                                                                                        <Typography
                                                                                            variant="h5"
                                                                                            style={{
                                                                                                paddingLeft:
                                                                                                    '2rem'
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                el.label
                                                                                            }
                                                                                        </Typography>
                                                                                    </Grid>
                                                                                    <Grid
                                                                                        item
                                                                                        xs={4}
                                                                                        align="center"
                                                                                    >
                                                                                        <Input
                                                                                            className={
                                                                                                classes.simulatorSliderInputBox
                                                                                            }
                                                                                            onClick={(
                                                                                                event
                                                                                            ) =>
                                                                                                event.stopPropagation()
                                                                                            }
                                                                                            onFocus={(
                                                                                                event
                                                                                            ) =>
                                                                                                event.stopPropagation()
                                                                                            }
                                                                                            value={
                                                                                                el.elasticity_value
                                                                                            }
                                                                                            name={`${section}_ ${headerIndex}_${i}`}
                                                                                            type="numberformat"
                                                                                            onChange={
                                                                                                onBrandLevelChange
                                                                                            }
                                                                                            onBlur={
                                                                                                validateBrandLevelChange
                                                                                            }
                                                                                            step="any"
                                                                                        />
                                                                                    </Grid>
                                                                                    <Grid
                                                                                        item
                                                                                        xs={2}
                                                                                        align="center"
                                                                                        style={{
                                                                                            padding:
                                                                                                el?.paddingMin,
                                                                                            margin: 'auto'
                                                                                        }}
                                                                                    >
                                                                                        <Typography variant="h5">
                                                                                            {
                                                                                                el.elasticity_min
                                                                                            }
                                                                                        </Typography>
                                                                                    </Grid>
                                                                                    <Grid
                                                                                        item
                                                                                        xs={2}
                                                                                        align="center"
                                                                                        style={{
                                                                                            padding:
                                                                                                el?.paddingMax,
                                                                                            margin: 'auto'
                                                                                        }}
                                                                                    >
                                                                                        <Typography variant="h5">
                                                                                            {
                                                                                                el.elasticity_max
                                                                                            }
                                                                                        </Typography>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        </Grid>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        </Paper>
    );
}
