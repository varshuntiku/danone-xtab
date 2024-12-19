import React, { useEffect, useRef, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Switch,
    makeStyles,
    Checkbox,
    OutlinedInput,
    Typography,
    Chip,
    Tooltip,
    Button,
    Box,Menu
} from '@material-ui/core';
import codxTableStyle from '../tableComponents/codxTableStyle';
import withStyles from '@material-ui/core/styles/withStyles';
import NumberInput from '../dynamic-form/inputFields/numberInput';
import RadioGroup from '../dynamic-form/inputFields/radiogroup';
import Slider from '@material-ui/core/Slider';
import { RefreshOutlined ,KeyboardArrowUp} from '@material-ui/icons';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

// simulator top level section
function TopSection(props) {
    const [multiSelect, setMultiSelect] = useState(props?.data?.toplevel_inputs[2]?.value || []);
    const classes = useStylesCustomSelect();
    const multiSelectRef = useRef();
    const chipRefs = useRef([]);
    const [visibleChipCount, setVisibleChipCount] = useState(props?.data?.toplevel_inputs[2]?.value ? 2 : 0);

    const handleRadioChange = (value) => {
        props.data.toplevel_inputs[1].value = value;
        props?.onChange(value);
    };

    const handleMultiSelectChange = (event) => {
        const value = event.target.value;
        props.data.toplevel_inputs[2].value = value;
        setMultiSelect(typeof value === 'string' ? value.split(',') : value);
        props?.onChange(value);
    };

    // chips logic for multiselect
    const visibleItems = multiSelect.slice(0, visibleChipCount)?.map((el) => el);
    const hiddenItems =
        multiSelect.length > visibleChipCount
            ? multiSelect.slice(visibleChipCount).map((el) => el)
            : [];

    useEffect(() => {
        const containerWidth = multiSelectRef?.current?.clientWidth;
        const chipsWidth = chipRefs.current
            .map((el) => el?.clientWidth)
            .filter((el) => el !== undefined)
            .reduce((acc, curr) => acc + curr, 0);

        if (!hiddenItems.length) {
            let offset = multiSelect.length > 2 ? 1 : 0;
            let value = Math.floor(containerWidth / (chipsWidth / multiSelect.length)) - offset;
            setVisibleChipCount(value);
        }
    }, [multiSelect, hiddenItems, visibleItems]);
    useEffect(() => {
        setMultiSelect(props?.data?.toplevel_inputs[2]?.value || []);
    }, [props?.data]);
    return (
        <div className={classes.topSection}>
            {/* Single Select Dropdown */}
            {props?.data.toplevel_inputs[0] ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Typography className={classes.menuBarLabel}>
                        {props?.data.toplevel_inputs[0]?.label}
                    </Typography>
                    <CustomSelectList
                        column={props?.data.toplevel_inputs[0]}
                        options={props?.data.toplevel_inputs[0]}
                        onChange={props?.onChange}
                    />
                </div>
            ) : null}
            {props?.data.toplevel_inputs[1] ? (
                <RadioGroup
                    params={props?.data.toplevel_inputs[1]}
                    className={classes.radioGroupLabel}
                    onChange={handleRadioChange}
                    row={true}
                />
            ) : null}

            {/* Multi-Select Dropdown */}
            {props?.data.toplevel_inputs[2] ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Typography className={classes.menuBarLabel}>
                        {props?.data.toplevel_inputs[2]?.label}
                    </Typography>
                    <FormControl
                        fullWidth
                        className={classes.formControl}
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                    >
                        <Select
                            multiple
                            value={multiSelect}
                            ref={multiSelectRef}
                            variant="outlined"
                            displayEmpty
                            style={{ width: '300px' }}
                            className={classes.selectEmpty}
                            MenuProps={{
                                anchorOrigin: {
                                    vertical: 'bottom',
                                    horizontal: 'center'
                                },
                                transformOrigin: {
                                    vertical: 'top',
                                    horizontal: 'center'
                                },
                                PaperProps: {
                                    style: {
                                        marginTop: '5px'
                                    }
                                },
                                getContentAnchorEl: null
                            }}
                            onChange={handleMultiSelectChange}
                            input={<OutlinedInput />}
                            renderValue={() => (
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    {visibleItems.map((value, index) => {
                                        const chipRef = (el) => {
                                            chipRefs.current[index] = el;
                                        };
                                        return (
                                            <Tooltip
                                                title={value} key={`${index} - ${value}`}
                                                classes={{ tooltip: classes.chipToolTipStyle }}
                                            >
                                                <Chip
                                                    key={`${index} - ${value}`}
                                                    label={value}
                                                    className={classes.chip}
                                                    ref={chipRef}
                                                />
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            )}
                        >
                            {props?.data.toplevel_inputs[2]?.options?.map((option) => (
                                <MenuItem
                                    key={option.label}
                                    value={option.value}
                                    classes={{ root: classes.menuItem, selected: classes.selected }}
                                >
                                    <Checkbox checked={multiSelect.indexOf(option.value) > -1} />
                                    <Typography variant="h3">{option.value}</Typography>
                                </MenuItem>
                            ))}
                        </Select>
                        {hiddenItems.length > 0 && (
                            <Tooltip
                                title={<CustomizedTooltip items={hiddenItems} />}
                                classes={{ tooltip: classes.toolTipStyle }}
                            >
                                <Chip
                                    className={`${classes.chip} ${classes.numberChip}`}
                                    label={`...+${hiddenItems.length}`}
                                />
                            </Tooltip>
                        )}
                    </FormControl>
                </div>
            ) : null}
        </div>
    );
}

// main  simulator contianer
const RevampedTableSim = ({ ...props }) => {
    const { classes } = props;
    const [data, setData] = useState(props?.data);
    const [simulatorInfo, setsimulatorInfo] = useState('');

    const headers = data?.simulator_inputs[0].map((el) => el.label);

    function onChange() {
        setData({ ...data });
    }
    useEffect(() => {
        setData(props.isEditing ? props.selectedScenario : props.data);
       setsimulatorInfo(props.isEditing? props.selectedScenario :props.simulatorInfo)
      
    }, [props.isEditing, props.data, props.selectedScenario]);
    return (
        <>
            <TopSection data={data} onChange={onChange} />
            <Table>
                <TableHead>
                    <TableRow className={`${classes.headRow}`}>
                        {headers.map((label) => (
                            <TableCell className={classes.headCell} key={label}>
                                {label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.simulator_inputs.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {row?.map((col, index, row) => (
                                <TableCell key={col.label}>
                                    {col.type === 'text' && (
                                        <TextField
                                            value={row[col.accessorKey]}
                                            onChange={(e) => col.onChange(rowIndex, e.target.value)}
                                        />
                                    )}
                                    {col.type === 'number' && (
                                        <CustomNumberInput
                                            column={col}
                                            onChange={onChange}
                                            row={row}
                                        />
                                    )}
                                    {col.type === 'dropdown' && (
                                        <CustomSelectList
                                            column={col}
                                            options={col}
                                            onChange={onChange}
                                        />
                                    )}
                                    {col.type === 'toggle' && (
                                        <CustomSwitch column={col} onChange={onChange} />
                                    )}
                                    {col.type === 'slider' && (
                                        <CustomSliderInput
                                            column={col}
                                            options={col}
                                            onChange={onChange}
                                            row={row}
                                        />
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {renderSimulatorActions(data.actions, props,simulatorInfo)}
        </>
    );
};

// custom select
const useStylesCustomSelect = makeStyles((theme) => ({
    formControl: {
        color: theme.palette.text.default,
        // backgroundColor:'red',
        fontSize: '1.5rem',
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: `2px solid ${theme.palette.border.inputFocus}`
        },
        '& .MuiSelect-select:focus': {
            backgroundColor: 'transparent'
        },
        '& .MuiSelect-iconOpen': {
            fill: theme.palette.background.infoBgDark
        },
        '& .MuiInput-underline': {
            '&:before': {
                borderBottom: 'none'
            },
            '&:after': {
                borderBottom: 'none'
            }
        },
        '& .MuiOutlinedInput-input': {
            padding: theme.layoutSpacing(10)
        },
        '& .MuiOutlinedInput-root': {
            minHeight: '40px'
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
        fontSize: '1.75rem',
        borderBottom: 'none',
        '& svg': {
            fontSize: '3rem'
        }
    },
    menuItem: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        fontFamily: theme.body.B5.fontFamily,
        backgroundColor: theme.palette.background.pureWhite,
        '&:hover': {
            backgroundColor: theme.palette.background.menuItemHover
        }
    },
    selected: {
        backgroundColor: `${theme.palette.background.menuItemFocus} !important`,
        color: theme.palette.text.default,
        fontWeight: 400
    },
    icon: {
        fill: theme.palette.text.default,
        transform: 'scale(2.3)',
        backgroundColor: 'red'
    },
    radioText: {
        fontSize: '1.3rem'
    },
    menuBarLabel: {
        fontSize: '2rem',
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: '500'
    },
    radioGroupLabel: {
        fontSize: '2rem',
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: '500',
        marginBottom: theme.layoutSpacing(18)
    },
    chip: {
        backgroundColor: theme.palette.background.filterCategorySelected,
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.body.B5.fontFamily,
        color: theme.palette.text.revamp,
        height: `${theme.layoutSpacing(16)} !important`,
        fontWeight: '400',
        cursor: 'pointer',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        padding: `${theme.layoutSpacing(15)} ${theme.layoutSpacing(20)}`,
        '& .MuiChip-label': {
            padding: 0
        }
    },
    numberChip: {
        backgroundColor: theme.palette.background.pureWhite,
        color: theme.palette.background.infoBgDark,
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: '500',
        fontSize: theme.layoutSpacing(20),
        '& .MuiChip-label': {
            padding: 0
        }
    },
    toolTipStyle: {
        padding: '1rem',
        backgroundColor: theme.palette.background.pureWhite,
        position: 'relative',
        top: '-2rem',
        // ZIndex: 10,
        // height: 'fit-content',
        textAlign: 'start',
        fontSize: theme.layoutSpacing(14),
        borderRadius: '0.5rem',
        color: theme.palette.text.tooltipTextColor,
        fontWeight: '500',
        letterSpacing: '0.35%',
        lineHeight: '15.23px',
        // maxWidth: theme.layoutSpacing(200),
        fontFamily: theme.body.B5.fontFamily,
        boxShadow: '-13px 7px 71px -45px rgba(0,0,0,0.75)'
    },
    chipToolTipStyle: {
        padding: '1rem 3rem',
        backgroundColor:theme.palette.background.pureWhite,
        position: 'relative',
        top: '-2rem',
        textAlign: 'start',
        fontSize: theme.layoutSpacing(14),
        borderRadius: '0.5rem',
        color: theme.palette.text.default,
        fontWeight: '500',
        letterSpacing: '0.35%',
        lineHeight: '15.23px',
        fontFamily: theme.body.B5.fontFamily,
        boxShadow: '-13px 7px 71px -45px rgba(0,0,0,0.75)'
    },
    arrowStyle: {
        '&:before': {
            backgroundColor: theme.palette.background.tooltipBackground
        },
        fontSize: theme.layoutSpacing(10.2)
    },
    topSection: {
        width: '80%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '3rem',
        marginBottom: '2rem'
    }
}));
function CustomSelectList({ onChange, ...props }) {
    const classes = useStylesCustomSelect();
    const handleChange = (event) => {
        const v = event.target.value;
        props.column.value = v;
        onChange(props.column);
    };
    return (
        <FormControl variant='outlined' fullWidth className={classes.formControl}>
            <Select
                value={props?.column?.value}
                variant={props?.column?.variant|| 'outlined'}
                onChange={handleChange}
                displayEmpty
                role="dropdown"
                className={classes.selectEmpty}
                MenuProps={{
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center'
                    },
                    transformOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    PaperProps: {
                        style: {
                            marginTop: '5px'
                        }
                    },
                    getContentAnchorEl: null
                }}
            >
                {props?.column?.options?.map((option, key) => {
                    return (
                        <MenuItem
                            value={option.label}
                            classes={{ root: classes.menuItem, selected: classes.selected }}
                            key={key}
                        >
                            {option.label}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}

// custom switch
const useStylesCustomSwitch = makeStyles((theme) => ({
    root: {
        width: theme.layoutSpacing(50),
        height: theme.layoutSpacing(24),
        padding: '0px !important',
        margin: theme.layoutSpacing(1)
    },
    switchBase: {
        left: theme.layoutSpacing(4),
        top: theme.layoutSpacing(4),
        padding: '0px !important',
        '&$checked': {
            transform: `translateX(${theme.layoutSpacing(28)})`,
            color: theme.palette.common.white
        }
    },
    thumb: {
        width: theme.layoutSpacing(15),
        height: theme.layoutSpacing(15)
    },
    track: {
        borderRadius: theme.layoutSpacing(12),
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border'])
    },
    checked: {},
    focusVisible: {}
}));
function CustomSwitch({ onChange, ...props }) {
    const classes = useStylesCustomSwitch();
    function handleToggleChange(e) {
        let value = e.target.checked;
        props.column.value = value;
        onChange(value);
    }
    return (
        <div className={classes.themeButton}>
            <Switch
                focusVisibleClassName={classes.focusVisible}
                disableRipple
                checked={props?.column?.value}
                onChange={(e) => handleToggleChange(e, 'access')}
                classes={{
                    root: classes.root,
                    switchBase: classes.switchBase,
                    thumb: classes.thumb,
                    track: classes.track,
                    checked: classes.checked
                }}
                disabled={props?.column?.disabled}
            />
        </div>
    );
}

// custom number input
function CustomNumberInput({ onChange, ...props }) {
    const { column } = props;
    const { label, height, value } = column;

    const INPUT_HEIGHTS = {
        default: 40,
        small: 32,
        large: 48
    };

    // Set height and fullWidth
    const fieldInfo = {
        ...props.column,
        height: height ? INPUT_HEIGHTS[height] : INPUT_HEIGHTS.default,
        fullWidth: column.fullWidth !== undefined ? column.fullWidth : true,
        customNumberButton: column.variant === 'outlined',
        disabled:column.disabled || false,
    };
    delete fieldInfo.label;
    // Initialize value based on label
    if (label.toLowerCase() === 'min') column.value = column.min;
    if (label.toLowerCase() === 'max') column.value = column.max;

    // Find min and max from row data
    const min = props.row.find((el) => el.label.toLowerCase() === 'min')?.min;
    const max = props.row.find((el) => el.label.toLowerCase() === 'max')?.max;
    const sliderEle = props.row.find((el) => el.label.toLowerCase() === 'slider');

    // Validate max against min
    if (max < min && label.toLowerCase() === 'max') {
        fieldInfo.error = 'error msg';
        fieldInfo.helperText = 'Max should be greater than min';
        fieldInfo.errorStyles=true
    }

    const classes = useStylesCustomSliders();

    const handleValueChange = (val) => {
        column.value = val;
        onChange(val);
    };

    const handleBtnClick = (action) => {
        const newValue = value + (action === 'increment' ? 1 : -1);
        if (['min', 'max'].includes(label.toLowerCase())) {
            column[label.toLowerCase()] = newValue;
        }
        handleValueChange(newValue);
    };

    const handleBlur = (e) => {
        const val = Number(e.target.value);
        if (['min', 'max'].includes(label.toLowerCase())) {
            column[label.toLowerCase()] = val;

            // Update slider value conditionally
            if (sliderEle) {
                if (label.toLowerCase() === 'min' && val > sliderEle.value && val > min) {
                    sliderEle.value = val;
                } else if (label.toLowerCase() === 'max' && val < sliderEle.value && val > min) {
                    sliderEle.value = val;
                }
            }
        }
        handleValueChange(val);
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <NumberInput
                onChange={(v) => {
                    handleValueChange(v);
                }}
                fieldInfo={{
                    ...fieldInfo,
                    inputprops: {
                        ...fieldInfo
                    }
                }}
                onBlur={handleBlur}
            />
            {fieldInfo.customNumberButton ? (
                <div
                    className={`${fieldInfo.error
                            ? classes.error_customNumberButton
                            : classes.customNumberButton
                        } ${fieldInfo.disabled ? classes.disabledInput : ''}`}
                >
                    <ArrowDropUpIcon fontSize="large" onClick={() => handleBtnClick('increment')} />
                    <ArrowDropDownIcon
                        fontSize="large"
                        onClick={() => handleBtnClick('decrement')}
                    />
                </div>
            ) : null}
        </div>
    );
}

// custom sliders
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
        margin: theme.layoutSpacing(0, 0),
        color: theme.palette.text.revamp,
        minWidth: theme.layoutSpacing(230)
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
    customNumberButton: {
        position: 'absolute',
        zIndex: 10,
        backgroundColor: theme.palette.background.pureWhite,
        right: 2.3,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeft: '1px solid #EDEBF0',
        height: '90%',
        marginTop: '2px',
        width:theme.layoutSpacing(30),
        '& svg': {
            fontSize: '18px',
            cursor: 'pointer',
            '&:nth-child(2)': {
                marginTop: '-8px'
            }
        }
    },
    error_customNumberButton: {
        position: 'absolute',
        zIndex: 10,
        backgroundColor: '#FAEFF0',
        right: 2.3,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeft: '1px solid #EDEBF0',
        height: '55%',
        marginTop: '2px',
        width:theme.layoutSpacing(30),
        '& svg': {
            fontSize: '18px',
            '&:nth-child(2)': {
                marginTop: '-8px'
            }
        }
    },
    disabledInput: {
        backgroundColor: '#F7F7F7 !important',
        opacity: '0.6'
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
    savebutton: {
        margin: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(10)} ${theme.layoutSpacing(12)}`,
        height: theme.layoutSpacing(36),
        padding: `${theme.layoutSpacing(12)} ${theme.layoutSpacing(24)}`,
        background: theme.palette.background.pureWhite,
        color: theme.palette.text.revamp,
        '& span': {
            fontSize: theme.layoutSpacing(15),
            fontWeight: '500',
            lineHeight: 'normal',
            letterSpacing: theme.layoutSpacing(1.5)
        }
    }

}));

function CustomSliderInput({ column, onChange, row }) {
    const classes = useStylesCustomSliders();
    const handleSliderChange = (event, newValue) => {
        column.value = newValue;
        onChange(newValue);
    };

    const min = row.find((el) => el.label?.toLowerCase() === 'min')?.min;
    const max = row.find((el) => el.label?.toLowerCase() === 'max')?.max;

    return (
        <>
            <Slider
                className={classes.simulatorSliderInput}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
                value={column.value}
                step={column.steps || 0.01}
                max={max}
                min={min}
            />
            <Typography variant="h4">{column.value}</Typography>
        </>
    );
}

// customised tooltip ui
function CustomizedTooltip({ items }) {
    const classes = useStylesCustomSelect();
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px 20px',
                gap: '2rem'
            }}
        >
            {items?.map((item) => (
                <Chip key={item} label={item} className={`${classes.chip}`} />
            ))}
        </div>
    );
}

// action Buttons
const CutomButtonGeneration = ({ selectedScenario,simulatorInfo, ...params }) => {
    const contextData = params.isEditing ? selectedScenario : simulatorInfo;
    const classes = useStylesCustomSliders();
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
                        params.actionfunc(button.action_flag_type, contextData);
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
                            onClick={() => params.changefunc(contextData)}
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
                            onClick={() => params.resetfunc(contextData)}
                            aria-label={button.name}
                        >
                            <RefreshOutlined fontSize="large" />
                            {button.name}
                        </Button>
                    );
                    case 'submit':
                        if (isSaveButton && params.isEditing) {
                            return (
                                <React.Fragment key={key}>
                                    <Button
                                        variant={'outlined'}
                                        className={classes.savebutton}
                                        onClick={(e) => handleMenuOpen(e, button)}
                                        aria-label={button.name}
                                    >
                                        {button.name}
                                        <KeyboardArrowUp fontSize="large" />
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl && menuButton === button)}
                                        onClose={handleMenuClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center'
                                        }}
                                        className={classes.menu}
                                        transformOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center'
                                        }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                params.onSaveasScenario();
                                                handleMenuClose();
                                            }}
                                        >
                                            Save Changes
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                params.onSaveScenario();
                                                handleMenuClose();
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
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
            {params.action_buttons
                ? params.action_buttons.map((button, key) => {
                      return <React.Fragment key={key}>{renderer(button, key)}</React.Fragment>;
                  })
                : ''}
        </div>
    );
};
const renderSimulatorActions = (actions, props) => {
    const resetfunc = () => {
        window.location.reload();
    };
    return (
        <Box display="flex" width="98%">
            <Box marginLeft="auto">
                <CutomButtonGeneration
                    action_buttons={actions}
                    classes={props?.classes}
                    changefunc={props?.changefunc}
                    resetfunc={resetfunc}
                    submitfunc={props?.submitfunc}
                    uploadfunc={props?.uploadfunc}
                    downloadfunc={props?.downloadfunc}
                    actionfunc={props?.actionfunc}
                    simulatorInfo={props?.simulatorInfo}
                    onSaveScenario={props?.onSaveScenario}
                    onSaveasScenario={props.onSaveasScenario}
                    isEditing={props?.isEditing}
                    selectedScenario={props?.selectedScenario}
                />
            </Box>
        </Box>
    );
};

export default withStyles(codxTableStyle)(RevampedTableSim);
