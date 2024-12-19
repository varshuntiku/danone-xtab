import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import clsx from 'clsx';
import CloseIcon from '../assets/Icons/CloseBtn';
import FileUpload from '../components/dynamic-form/inputFields/fileUpload';
// import CustomSnackbar from '../components/CustomSnackbar';
import { Box, InputLabel } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        maxHeight: 364
    },
    buttonFloat: {
        // float: 'right'
        marginLeft: 'auto',
        display: 'block'
    },
    button: {
        margin: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(10)} ${theme.layoutSpacing(12)}`,
        height: theme.layoutSpacing(36),
        padding: `${theme.layoutSpacing(12)} ${theme.layoutSpacing(24)}`,
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
        visibility: 'hidden'
    },
    displayedElement: {
        display: 'block'
    },
    simulatorSectionHeader: {
        color: theme.palette.text.revamp,
        fontSize: theme.layoutSpacing(16),
        fontWeight: '500',
        letterSpacing: 0,
        fontFamily: theme.body.B1.fontFamily,
        opacity: 1,
        padding: theme.spacing(2, 0, 0),
        lineHeight: 'normal'
    },
    floatingDiv: {
        zIndex: 10,
        position: 'absolute',
        padding: '10px',
        background: theme.palette.primary.light,
        top: 0,
        right: 0,
        width: '100%'
    },
    closeIcon: {
        position: 'absolute',
        top: theme.layoutSpacing(20),
        right: theme.layoutSpacing(18),
        '& svg': {
            cursor: 'pointer',
            width: theme.layoutSpacing(16),
            height: theme.layoutSpacing(16),
            fill: theme.palette.text.revamp + '! important',
            '& rect:first-child': {
                fill: theme.palette.text.revamp + '! important'
            }
        }
    },
    itemContianer: {
        borderRight: `1px solid ${theme.palette.text.default}26`,
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(24)}`,
        '&:last-child': {
            borderRight: 'none'
        }
    },
    container: {
        rowGap: theme.layoutSpacing(24)
    },
    innerContainer: {
        marginBottom: theme.layoutSpacing(16)
    },
    outerContainer: {
        marginBottom: theme.layoutSpacing(16)
    },
    seprator: {
        marginBottom: theme.layoutSpacing(12)
    }
}));

/**
 * Simulates the sections and actions on clicking the simulate button.
 * @summary Simulates the different results that effects the widget on changing the input variable through different input buttons and renders the result in a grid
 * It is used whenever we want to simulate the graphical result based on the different inputs that we give to the variable
 * JSON Structure-
 *  {
 *    "simulator_options": {
 *        "sections": [
 *            {
 *                "header": <section Header name>
 *                "inputs": [ <List of items which will be shown in the sections>
 *                            <items can be *slider*, *upload*, *radio* / *checkboxes*, *text*, number* inputs>
 *                    {
 *                        "input_type": <type of input button>
 *                        "value": <default value>
 *                        "max": <max value>
 *                        "min": <min value>
 *                        "label": <lable will be used to display the name>
 *                        "id": <id will be used internally>
 *                        "steps": <value of steps>
 *                    },
 *                ]
 *            }
 *        ],
 *        "actions": [ <holds overall actions on the simulators>
 *            {
 *                "name": <Action name>
 *                "action_flag_type": <action_flag_type will be the flag which will be sent to the codestring to run necessary functions>
 *                "variant": <variant of button can be contained, outlined>
 *                "action": <can be ignored when action_flag_type is given>
 *            },
 *        ]
 *    }
 * }
 * @param {object} props - onChange, classes, simulatorInfo, changefunc, resetfunc, submitfunc, uploadfunc, downloadfunc,  actionfunc.
 */
export default function AppWidgetSimulator({ onChange, ...props }) {
    const classes = useStyles();
    const [simulatorOpenState, setsimulatorOpenState] = useState(false);
    // const [errorOpenState, seterrorOpenState] = useState(false);
    const [simulatorInfo, setSimulatorInfo] = useState(props.simulatorInfo);

    useEffect(() => {
        setSimulatorInfo(props.simulatorInfo);
    }, [props.simulatorInfo]);

    const handleSimulatorChange = (d) => {
        setSimulatorInfo({ ...d });
        if (onChange) {
            onChange({ ...d });
        }
    };

    const openSimulator = () => {
        setsimulatorOpenState(true);
    };

    const closeSimulator = () => {
        setsimulatorOpenState(false);
    };

    const renderSimulatorSections = (section, section_key, arr) => {
        let cols = arr.length > 3 ? 12 : 12 / arr.length;
        return (
            <React.Fragment key={'renderSimulatorSections' + section_key}>
                <Grid item xs={cols} md={4} spacing={1} className={classes.itemContianer}>
                    <Grid container className={`${classes.container} ${classes.innerContainer}`}>
                        <Grid item xs={12}>
                            <Typography variant="h4" className={classes.simulatorSectionHeader}>
                                {section.header}
                            </Typography>
                        </Grid>
                        {section.inputs.map((input, key) => {
                            return renderSimulatorInput(input, section_key, key);
                        })}
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    };
    const renderSimulatorInput = (input, section_key, input_key) => {
        const renderer = (input, key) => {
            switch (input.input_type) {
                case 'slider':
                    return (
                        <CustomSliderInput
                            onChange={(v) => {
                                simulatorInfo.sections[section_key].inputs[input_key].value = v;
                                handleSimulatorChange(simulatorInfo);
                            }}
                            key={'slider' + key}
                            props={{ ...input }}
                        ></CustomSliderInput>
                    );
                case 'radio':
                    return (
                        <CustomRadioInput
                            onChange={(v) => {
                                simulatorInfo.sections[section_key].inputs[input_key].value = v;
                                handleSimulatorChange(simulatorInfo);
                            }}
                            key={'radio' + key}
                            props={{ ...input }}
                        ></CustomRadioInput>
                    );
                case 'text':
                    return (
                        <CustomTextInput
                            onChange={(v) => {
                                simulatorInfo.sections[section_key].inputs[input_key].value = v;
                                handleSimulatorChange(simulatorInfo);
                            }}
                            key={'text' + key}
                            props={{ ...input }}
                        ></CustomTextInput>
                    );
                case 'upload': {
                    const filedInfo = {
                        id: 9,
                        name: input.label,
                        label: input.label,
                        type: 'upload',
                        value: '',
                        variant: 'outlined',
                        margin: 'none',
                        inputprops: {
                            type: 'file',
                            error: 'false',
                            multiple: false
                            // "accept": "/*"
                        },
                        InputLabelProps: {
                            disableAnimation: true,
                            shrink: true
                        },
                        placeholder: 'Enter your Input',
                        grid: 12
                    };
                    return (
                        <FileUpload
                            fieldInfo={filedInfo}
                            onChange={(v) => {
                                simulatorInfo.sections[section_key].inputs[input_key].value = v;
                                handleSimulatorChange(simulatorInfo);
                            }}
                            key={'upload' + key}
                        />
                    );
                }
                case 'number':
                    return (
                        <CustomNumberInput
                            onChange={(v) => {
                                simulatorInfo.sections[section_key].inputs[input_key].value = v;
                                handleSimulatorChange(simulatorInfo);
                            }}
                            key={'number' + key}
                            props={{ ...input }}
                        ></CustomNumberInput>
                    );
                case 'dropdown':
                    return (
                        <CustomSelectList
                            menu_options={input.options}
                            onChange={(v) => {
                                simulatorInfo.sections[section_key].inputs[input_key].value = v;
                                handleSimulatorChange(simulatorInfo);
                            }}
                            key={'dropdown' + key}
                            props={{ ...input }}
                        ></CustomSelectList>
                    ); //NOTE:not being used for now
                default:
                    return null;
            }
        };
        return (
            <React.Fragment key={section_key + input_key}>
                <Grid item xs={12}>
                    {renderer(input, input_key)}
                </Grid>
            </React.Fragment>
        );
    };
    const renderSimulatorActions = (actions) => {
        return (
            <Box display="flex" width="100%">
                <div style={{ flex: 1 }}></div>
                <Box marginLeft="auto">
                    {
                        <CutomButtonGeneration
                            action_buttons={actions}
                            classes={classes}
                            changefunc={props.changefunc}
                            resetfunc={props.resetfunc}
                            submitfunc={props.submitfunc}
                            uploadfunc={props.uploadfunc}
                            downloadfunc={props.downloadfunc}
                            actionfunc={props.actionfunc}
                            simulatorInfo={simulatorInfo}
                        />
                    }
                </Box>
            </Box>
        );
    };

    return (
        <React.Fragment>
            {/* <React.Fragment>
                <CustomSnackbar
                    message={simulatorInfo.errors?.messages}
                    open={errorOpenState || simulatorInfo.errors?.show}
                    autoHideDuration={4000}
                    onClose={() => {
                        if (props.simulatorInfo.errors) {
                            props.simulatorInfo.errors.show = false;
                        }
                        seterrorOpenState(false);
                    }}
                    severity={"error"}
                />
            </React.Fragment> */}
            <Button
                onClick={openSimulator}
                variant={simulatorInfo.trigger?.variant || 'contained'}
                size={simulatorInfo.trigger?.size || 'medium'}
                className={clsx({ [classes.buttonFloat]: true })}
                aria-label={simulatorInfo.trigger?.text || 'Simulate'}
            >
                {simulatorInfo.trigger?.text || 'Simulate'}
            </Button>
            <Paper
                elevation={5}
                className={clsx({
                    [classes.floatingDiv]: true,
                    [classes.displayedElement]: simulatorOpenState,
                    [classes.hiddenElement]: !simulatorOpenState
                })}
            >
                <Grid container>
                    <Box className={classes.closeIcon} onClick={closeSimulator}>
                        <CloseIcon />
                    </Box>
                    <Grid item xs={12}>
                        <Grid item container xs={12} className={classes.outerContainer}>
                            {simulatorInfo.sections.map((section, key, arr) => {
                                return renderSimulatorSections(section, key, arr);
                            })}
                        </Grid>
                    </Grid>

                    <Grid item xs={12} className={classes.actionContainer}>
                        <Grid container>
                            <Grid item xs={12} className={classes.seprator}>
                                <hr style={{ opacity: '0.4' }} />
                            </Grid>
                            <Grid item xs={12}>
                                {simulatorInfo?.errors?.show
                                    ? simulatorInfo?.errors?.messages?.map((el, i) => (
                                          <Typography
                                              key={'simulatorInfoMessages' + i}
                                              variant="h5"
                                              color="error"
                                          >
                                              {el}
                                          </Typography>
                                      ))
                                    : null}
                            </Grid>
                            <Grid item xs={12}>
                                {renderSimulatorActions(simulatorInfo.actions)}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </React.Fragment>
    );
}

const useStylesCustomSelect = makeStyles((theme) => ({
    formControl: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        '& .MuiFormLabel-root.Mui-focused': {
            color: theme.palette.text.default
        }
    },
    input: {
        '& input': {
            color: theme.palette.text.default,
            fontSize: '1.5rem'
        },
        '&:before': {
            borderColor: `${theme.palette.text.default} !important`
        }
    },
    selectEmpty: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        borderBottom: '2px solid ' + theme.palette.text.default
    },
    menuItem: {
        color: theme.palette.text.default,
        fontSize: '1.5rem'
    },
    icon: {
        fill: theme.palette.text.default,
        transform: 'scale(2.3)'
    },
    radioText: {
        fontSize: '1.5rem'
    },
    label:{
        fontSize:theme.layoutSpacing(20),
        color:theme.palette.text.default
    }
}));

function CustomSelectList({ onChange, ...props }) {
    const classes = useStylesCustomSelect();
    const [value, setValue] = React.useState(props.props.value || '');

    const handleChange = (event) => {
        const v = event.target.value;
        setValue(v);
        onChange(v);
    };
    return (
        <React.Fragment>
            <FormControl fullWidth className={classes.formControl}>
                {props?.props?.label ? <InputLabel shrink id="dropdwon-label" className={classes.label}>
                    {props?.props?.label}
                </InputLabel> : null}
                <Select
                    value={value}
                    onChange={handleChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    inputProps={{
                        'aria-label': 'Without label',
                        classes: {
                            icon: classes.icon
                        }
                    }}
                >
                    {props.menu_options.map((option, key) => {
                        return (
                            <MenuItem value={option} className={classes.menuItem} key={key}>
                                {option}
                            </MenuItem>
                        );
                    })}
                </Select>
                {/* <FormHelperText>Without label</FormHelperText> */}
            </FormControl>
        </React.Fragment>
    );
}

const useStylesCustomSliders = makeStyles((theme) => ({
    simulatorSliderLabel: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        marginBottom: 0,
        fontWeight: '400',
        lineHeight: 'normal',
        letterSpacing: 0
    },
    sliderLabel: {
        padding: `${theme.layoutSpacing(24)} 0 ${theme.layoutSpacing(4)}`
    },
    sliderContainer: {
        display: 'flex',
        alignItems: 'center',
        height: theme.layoutSpacing(32)
    },
    simulatorSliderInput: {
        margin: theme.spacing(0.35, 0),
        color: theme.palette.text.revamp
    },
    simulatorSliderInputBox: {
        marginLeft: theme.layoutSpacing(36),
        height: theme.layoutSpacing(24),
        minWidth: theme.layoutSpacing(60),
        '&.Mui-focused': {
            borderBottom: 'none'
        },
        '&&&:before': {
            borderBottom: 'none'
        },
        '&&&:after ': {
            borderBottom: 'none'
        },
        '& input': {
            border: '1px solid ' + theme.palette.border.grey,
            backgroundColor: theme.palette.background.pureWhite,
            color: theme.palette.primary.contrastText,
            textAlign: 'right',
            padding: `${theme.layoutSpacing(4)} 0`,
            fontSize: theme.layoutSpacing(15),
            minWidth: theme.layoutSpacing(48),
            height: theme.layoutSpacing(24),
            borderRadius: 0,
            lineHeight: 'normal',
            letterSpacing: 0,
            fontWeight: 400,
            fontFamily: theme.body.B1.fontFamily
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
    }
}));

function CustomSliderInput({ onChange, ...props }) {
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
            <Grid container className={classes.sliderContainer}>
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

                <Grid item xs={6}>
                    <Slider
                        className={classes.simulatorSliderInput}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        value={props.props.value}
                        step={props.props.steps || 0.01}
                        max={props.props.max}
                        min={props.props.min}
                    />
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

function CustomRadioInput({ onChange, ...props }) {
    const sliderClasses = useStylesCustomSliders();
    const formClasses = useStylesCustomSelect();
    const [value, setValue] = React.useState(props.props.value);

    const handleRadioChange = (event) => {
        setValue(event.target.value);
        onChange(event.target.value);
    };

    return (
        <FormControl fullWidth component="fieldset" className={formClasses.formControl}>
            {/* <FormLabel className={classes.simulatorSliderLabel} component="legend">{props.props.label}</FormLabel> */}
            <Typography
                id={'input-radio-text-heading' + props.props.id}
                className={`${sliderClasses.simulatorSliderLabel} ${sliderClasses.sliderLabel}`}
                variant="h5"
                gutterBottom
            >
                {props.props.label}
            </Typography>
            <RadioGroup
                aria-label={props.props.label}
                name={props.props.name}
                value={value}
                onChange={handleRadioChange}
            >
                {props.props.options.map((option, key) => {
                    return (
                        <FormControlLabel
                            value={option}
                            key={key}
                            control={<Radio />}
                            classes={{ label: formClasses.radioText }}
                            label={option}
                        />
                    );
                })}
            </RadioGroup>
        </FormControl>
    );
}

function CustomTextInput({ onChange, ...props }) {
    const sliderClasses = useStylesCustomSliders();
    const formClasses = useStylesCustomSelect();

    const [value, setValue] = React.useState(props.props.value);

    const handleInputChange = (event) => {
        setValue(event.target.value);
        onChange(event.target.value);
    };

    return (
        <FormControl fullWidth component="fieldset" className={formClasses.formControl}>
            <Grid container>
                <Grid item xs={4}>
                    <Typography
                        id={'input-text-heading' + props.props.id}
                        className={sliderClasses.simulatorSliderLabel}
                        variant="h5"
                        gutterBottom
                    >
                        {props.props.label}
                    </Typography>
                    {/* <Typography>
                        <FormLabel component="legend">{props.props.label}</FormLabel>
                    </Typography> */}
                </Grid>
                <Grid item xs={8}>
                    <Input
                        className={formClasses.input}
                        value={value}
                        margin="dense"
                        onChange={handleInputChange}
                        fullWidth
                        // onBlur={handleBlur}
                        inputProps={{
                            'aria-label': 'Without label'
                        }}
                    />
                </Grid>
            </Grid>
        </FormControl>
    );
}

function CustomNumberInput({ onChange, ...props }) {
    const sliderClasses = useStylesCustomSliders();
    const formClasses = useStylesCustomSelect();

    const [value, setValue] = React.useState(props.props.value);

    const handleInputChange = (event) => {
        setValue(event.target.value === null ? null : Number(event.target.value));
        onChange(event.target.value === null ? null : Number(event.target.value));
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
        <FormControl fullWidth component="fieldset" className={formClasses.formControl}>
            <Grid container>
                <Grid item xs={4}>
                    <Typography
                        id={'input-number-heading' + props.props.id}
                        className={sliderClasses.simulatorSliderLabel}
                        variant="h5"
                        gutterBottom
                    >
                        {props.props.label}
                    </Typography>
                    {/* <Typography>
                        <FormLabel component="legend">{props.props.label}</FormLabel>
                    </Typography> */}
                </Grid>
                <Grid item xs={8}>
                    <Input
                        className={formClasses.input}
                        value={value}
                        margin="dense"
                        onChange={handleInputChange}
                        fullWidth
                        onBlur={handleBlur}
                        inputProps={{
                            step: props.props.steps,
                            min: props.props.min,
                            max: props.props.max,
                            type: 'number',
                            'aria-label': 'Without label'
                        }}
                    />
                </Grid>
            </Grid>
        </FormControl>
    );
}

const CutomButtonGeneration = ({ simulatorInfo, ...params }) => {
    const renderer = (button, key) => {
        if (button.action_flag_type) {
            return (
                <Button
                    key={key}
                    variant={button.variant}
                    className={params.classes.button}
                    onClick={() => {
                        params.actionfunc(button.action_flag_type, simulatorInfo);
                    }}
                    aria-label={button.name}
                >
                    {button.name}
                </Button>
            );
        } else {
            switch (button.action) {
                case 'change':
                    return (
                        <Button
                            key={key}
                            variant={button.variant}
                            className={params.classes.button}
                            onClick={() => params.changefunc(simulatorInfo)}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );
                case 'reset':
                    return (
                        <Button
                            key={key}
                            variant={button.variant}
                            className={params.classes.button}
                            onClick={params.resetfunc}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );
                case 'submit':
                    return (
                        <Button
                            key={key}
                            variant={button.variant}
                            className={params.classes.button}
                            onClick={params.submitfunc}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );
                case 'upload':
                    return (
                        <Button
                            key={key}
                            variant={button.variant}
                            className={params.classes.button}
                            onClick={params.uploadfunc}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );
                case 'download':
                    return (
                        <Button
                            key={key}
                            variant={button.variant}
                            className={params.classes.downloadSheet}
                            onClick={params.downloadfunc}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );

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
