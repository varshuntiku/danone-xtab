import React, { useEffect, useState, useContext } from 'react';
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
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import CustomSnackbar from 'components/CustomSnackbar.jsx';

import FileUpload from 'components/dynamic-form/inputFields/fileUpload';
import {
    InfoOutlined,
    KeyboardArrowUp
} from '@material-ui/icons';
import { Box, IconButton,Menu } from '@material-ui/core';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import { SavedScenarioContext } from '../AppScreen';
import RevampedTableSim from './RevampedTableSim';
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
    infoicon:{
       marginRight:'5px !important',
       padding:'0px',
      top:'-0.5px'

    }
    ,
    savebutton: {
        margin: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(10)} ${theme.layoutSpacing(12)}`,
        height: theme.layoutSpacing(36),
        padding: `${theme.layoutSpacing(12)} ${theme.layoutSpacing(24)}`,
        background:theme.palette.background.pureWhite,
        color:theme.palette.text.revamp,
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
    simulatorSectionHeaderHorizontal: {
        color: theme.palette.text.revamp,
        fontSize: theme.layoutSpacing(16),
        fontWeight: '500',
        letterSpacing: 0,
        fontFamily: theme.body.B1.fontFamily,
        opacity: 1,
        padding: theme.spacing(2, 0, 0),
        lineHeight: 'normal',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center'
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
    },
    simInputContainer: {
        marginBottom: '3rem'
    },
    saveScenarioContainer: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
        width: 'max-content',
        marginRight: '2rem',
        cursor: 'pointer'
    },
    icon: {
        marginRight: '0.8rem',
    },
    floatingdivtext:{
        color: '#2b0052',
        fontWeight: '500',
     padding:'4px !important',
        fontSize: '1.5rem',
    },
    text: {
        color: '#2b0052',
        fontWeight: '500',
        textDecoration: 'underline',
        fontSize: '1.5rem'
    },
    simulatorHolder: {
        height: '100%',
        overflowY: 'scroll'
    },
    floatingDiv: {
        zIndex: 10,
        padding: '12px',
        background: '#D4E5F6',
        color: '#333',
        marginLeft: 'auto',
        textAlign: 'center',
        width: '50%',
        position: 'relative',
       top:'5px',
        height:'max-content',
       marginRight:'auto',
        bottom:'7px',
        fontWeight:'5',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    menu: {
        '& .MuiList-padding': {
            padding: 0
        },
        '& .MuiMenuItem-root': {
            width: '20rem',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.6rem',
            color: theme.palette.text.default,
            padding: '1rem !important',
            height: '4.5rem',
            minHeight: '4.5rem',
            fontFamily: theme.body.B5.fontFamily,
            '&:hover': {
                backgroundColor: theme.palette.background.selected
            }
        }
    },

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
export default function RevampedSimulator({ onChange,...props }) {
    const { openSavedScenarioPopup } = useContext(SavedScenarioContext);
    const classes = useStyles();
    const [snackopen,setsnackopen]=useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification, setNotification] = useState({
        message: '',
        severity: 'warning',
        autoHideDuration: 3000,
    });
    const [simulatorInfo, setSimulatorInfo] = useState(props.isEditing ? props.selectedScenario : props.simulatorInfo);
    useEffect(() => {
        setSimulatorInfo(props.isEditing ? props.selectedScenario : props.simulatorInfo);
        props.getScenarios?.();
    }, [props.isEditing, props.simulatorInfo, props.selectedScenario,props.shouldOpenLibrary]);

    useEffect(() => {
        if (props.shouldOpenLibrary && props.savedScenarios?.length > 0) {
            openSavedScenarioPopup(props.savedScenarios, props.linkedScreen);
        }
    }, [props.savedScenarios]);

    const handleBackToDefault = () => {

        props.setIsEditingParent(false);

    }

    const handleSimulatorChange = (d) => {
        setSimulatorInfo({ ...d });
        if (onChange) {
            onChange({ ...d });
        }
    };

    const outputRenderer = (section, section_key) => {
        return (
            <React.Fragment>
                <Grid item xs={10}>
                    {section.inputs.map((input, key) => {
                        return (
                            <div
                                className={classes.simInputContainer}
                                key={`simulatorInputHolder${key}`}
                            >
                                {renderSimulatorInput(input, section_key, key)}
                            </div>
                        );
                    })}
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="h4" className={classes.simulatorSectionHeaderHorizontal}>
                        {section.header}
                    </Typography>
                </Grid>
            </React.Fragment>
        );
    };
    const renderSimulatorSections = (section, section_key, arr) => {
        let cols = section?.grid || (arr.length > 3 ? 12 : 12 / arr.length);
        let orientation = simulatorInfo.section_orientation;
        return (
            <React.Fragment key={'renderSimulatorSections' + section_key}>
                <Grid
                    item
                    xs={orientation == 'vertical' ? 12 : cols}
                    spacing={1}
                    className={classes.itemContianer}
                >
                    <Grid container className={`${classes.container} ${classes.innerContainer}`}>
                        {section?.header_pos == 'right' ? (
                            outputRenderer(section, section_key)
                        ) : (
                            <React.Fragment>
                                <Grid item xs={section?.header_pos == 'left' ? 2 : 12}>
                                    <Typography
                                        variant="h4"
                                        className={
                                            section?.header_pos == 'left'
                                                ? classes.simulatorSectionHeaderHorizontal
                                                : classes.simulatorSectionHeader
                                        }
                                    >
                                        {section.header}
                                    </Typography>
                                </Grid>
                                <Grid item xs={section?.header_pos == 'left' ? 10 : 12}>
                                    {section.inputs.map((input, key) => (
                                        <div
                                            className={classes.simInputContainer}
                                            key={`simulatorInputHolder${key}`}
                                        >
                                            {renderSimulatorInput(input, section_key, key)}
                                        </div>
                                    ))}
                                </Grid>
                            </React.Fragment>
                        )}
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
                case 'input':
                    return (
                        <CustomPlusMinusInput
                            onChange={(v) => {
                                simulatorInfo.sections[section_key].inputs[input_key].value = v;
                                handleSimulatorChange(simulatorInfo);
                            }}
                            key={'input' + key}
                            props={{ ...input }}
                        />
                    );
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
                            onSaveScenario={props.onSaveScenario}
                            onSaveasScenario={props.onSaveasScenario}
                            isEditing={props.isEditing}
                        />
                    }
                </Box>
            </Box>
        );
    };
    // const { openSavedScenarioPopup } = useContext(SavedScenarioContext);
    const handleSavedScenarioPopup = () => {
        if(props.isEditing){
            setsnackopen(true);  // Set login state to true
            setNotification({
                message: 'Please Go back to default State, to view Saved Scenarios.',
                severity: 'warning',
                autoHideDuration: 3000,
            });
            setNotificationOpen(true);
        }
        else{
        openSavedScenarioPopup(props.savedScenarios, props.linkedScreen);}
    };

    return (
        <React.Fragment>
 {props.isEditing && (
                <div className={classes.floatingDiv}>
                  <IconButton className={classes.infoicon}> <InfoOutlined fontSize='large' /></IconButton> <span className={classes.floatingdivtext}>  You are editing the scenario <b>{props.scenerioname}</b>. </span>
                    <span
                        onClick={handleBackToDefault}
                        className={classes.text}
                        style={{ textDecoration: 'underline', cursor: 'pointer', color: '#0000EE' }}
                    >
                        Click here
                    </span>
                     <span className={classes.floatingdivtext}> to go back to the default state.</span>
                </div>
            )}

                 {snackopen && (
                    <CustomSnackbar
                        open={notificationOpen && notification?.message ? true : false}
                        autoHideDuration={notification?.autoHideDuration || 3000}
                        onClose={() => setNotificationOpen(false)}
                        severity={notification?.severity || 'warning'}
                        message={notification?.message}
                    />
                )}

            <div className={classes.saveScenarioContainer} onClick={handleSavedScenarioPopup}>
                <BookmarkBorderIcon className={classes.icon} />
                <Typography variant="h6" className={classes.text}>
                    Saved Scenarios
                </Typography>


            </div>
            {simulatorInfo?.isRevampedTableSim ? <RevampedTableSim data={simulatorInfo} {...props} /> :
                <Paper
                    elevation={5}
                    className={clsx({
                        [classes.displayedElement]: true,
                        [classes.hiddenElement]: false
                    })}
                >
                    <Grid container className={classes.simulatorHolder}>
                        <Grid item xs={12}>
                            <Grid item container xs={12} className={classes.outerContainer}>
                                {simulatorInfo?.sections?.map((section, key, arr) => {
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

                                {renderSimulatorActions(simulatorInfo?.actions)}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>}
        </React.Fragment>
    );
}

const useStylesCustomSelect = makeStyles((theme) => ({
    formControl: {
        color: theme.palette.text.default,
        fontSize: '1.5rem'
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
    kpiNumberCount: {
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: theme.title.h1.fontWeight,
        fontSize: '1.6rem',
        color: theme.palette.text.default
    },
    plusIcon: {
        background: theme.palette.text.default,
        borderRadius: 0,
        marginLeft: '3rem',
        padding: '0.5rem 0.5rem',
        '& svg': {
            color: `${theme.palette.text.btnTextColor} !important`
        }
    },
    minusIcon: {
        background: theme.palette.background.default,
        borderRadius: 0,
        marginRight: '3rem',
        padding: '0.5rem 0.5rem',
        '& svg': {
            color: `${theme.palette.text.default} !important`
        }
    },
    inputHolder: {
        display: 'flex',
        gap: '2rem'
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
    simulatorSliderInputBoxPlusMinus: {
        height: theme.layoutSpacing(24),
        minWidth: theme.layoutSpacing(100),
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
            textAlign: 'center',
            padding: `${theme.layoutSpacing(4)} 0`,
            fontSize: theme.layoutSpacing(15),
            minWidth: theme.layoutSpacing(200),
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
    },
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

function CustomPlusMinusInput({ onChange, ...props }) {
    const sliderClasses = useStylesCustomSliders();
    const formClasses = useStylesCustomSelect();
    const [value, setValue] = React.useState(props.props.value.toFixed(2));
    const handleInputChange = (event) => {
        setValue(event.target.value === null ? null : Number(event.target.value));
        onChange(event.target.value === null ? null : Number(event.target.value));
    };

    const handleInput2Change = (val) => {
        const newValue = Number(value) + val;
        setValue(newValue.toFixed(2));
        onChange(newValue);
    };

    const handleBlur = () => {
        if (value < props.props.min) {
            setValue(props.props.min).toFixed(2);
            onChange(props.props.min).toFixed(2);
        } else if (value > props.props.max) {
            setValue(props.props.max).toFixed(2);
            onChange(props.props.max).toFixed(2);
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
                <Grid item xs={8} className={formClasses.inputHolder}>
                    <IconButton
                        className={formClasses.minusIcon}
                        onClick={() => handleInput2Change(-props.props.steps)}
                        disabled={value - props.props.steps < props.props.min ? true : false}
                    >
                        <RemoveIcon />
                    </IconButton>
                    <Input
                        className={sliderClasses.simulatorSliderInputBoxPlusMinus}
                        value={value}
                        margin="dense"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: props.props.steps,
                            min: props.props.min,
                            max: props.props.max,
                            type: 'text',
                            'aria-labelledby': 'input-slider'
                        }}
                    />
                    <IconButton
                        className={formClasses.plusIcon}
                        onClick={() => handleInput2Change(props.props.steps)}
                        disabled={value + props.props.steps > props.props.max ? true : false}
                    >
                        <AddIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </FormControl>
    );
}

export const CutomButtonGeneration = ({ simulatorInfo, ...params }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuButton, setMenuButton] = useState(null);

    const handleMenuOpen = (event, button) => {
        setAnchorEl(event.currentTarget);
        setMenuButton(button);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuButton(null);
    };
    const renderer = (button, key) => {
        const isSaveButton = button.name.toLowerCase().includes('save');

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
                            onClick={() => params.resetfunc(simulatorInfo)}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );
                    case 'submit':
                        if (isSaveButton && params.isEditing) {
                            return (
                                <React.Fragment key={key}>
                                    <Button
                                        variant={'outlined'}
                                        className={params.classes.savebutton}
                                        onClick={(e) => handleMenuOpen(e, button)}
                                        aria-label={button.name}
                                    >
                                        {button.name}
                                        <KeyboardArrowUp
                                                fontSize="large"

                                            />
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl && menuButton === button)}
                                        onClose={handleMenuClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center'
                                        }}
                                        className={params.classes.menu}
                                        transformOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center'
                                        }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                handleMenuClose();
                                                params.onSaveasScenario();
                                            }}
                                        >
                                            Save Changes
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleMenuClose();
                                                params.onSaveScenario();
                                            }}
                                        >
                                            Save As New Scenario
                                        </MenuItem>
                                    </Menu>
                                </React.Fragment>
                            );
                        }
                        return (
                            <Button
                                key={key}
                                variant={'outlined'}
                                className={params.classes.savebutton}
                                onClick={params.onSaveScenario}
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
