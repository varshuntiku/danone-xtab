import React, { useState } from 'react';
import { Toolbar, makeStyles, alpha } from '@material-ui/core';

import FadedButton from './CodxFadedButton';
import SingleSelectDropdown from './CodxSingleSelectDropdown';
import MultiSelectDropdown from './CodxMultiSelectDropdown';
import ToggleButtonSwitch from './CodxToggleButtonSwitch';
import ToggleSwitch from './CodxToggleSwitch';
import IconButton from './CodxIconButton';
import CodxLegendsIcons from './CodxLegends';
import CustomLabel from '../dynamic-form/inputFields/customLabel';
import DynamicFormModal from '../dynamic-form/inputFields/DynamicFormModal';

const useStyles = makeStyles((theme) => ({
    toolBar: {
        display: 'flex',
        justifyContent: 'space-between',
        marginLeft: '0',
        marginRight: '0',
        '&.MuiToolbar-gutters': {
            paddingLeft: '0',
            paddingRight: '0'
        }
    },
    toolBarText: {
        color: theme.palette.text.default,
        fontWeight: 500,
        fontSize: '1.5rem'
    },
    toolBarIcon: {
        color: theme.palette.primary.contrastText
    },
    toolBarIcons: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        border: 'none',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        touchAction: 'manipulation',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        color: theme.palette.grey[500],
        fontSize: theme.spacing(2)
    },
    MuiOutlinedInput: {
        root: {
            '& fieldset': {
                borderColor: alpha(theme.palette.text.titleText, 0.5)
            },
            '&$focused $notchedOutline': {
                borderColor: alpha(theme.palette.text.titleText, 0.5)
            },
            '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                borderColor: alpha(theme.palette.text.titleText, 0.5)
            },
            '&.Mui-disabled': {
                '& fieldset$notchedOutline': {
                    borderColor: alpha(theme.palette.text.titleText, 0.5)
                }
            }
        }
    },
    filterButton: {
        marginRight: theme.spacing(2),
        fontSize: '1.5rem',
        lineHeight: '1rem',
        fontWeight: 500,
        letterSpacing: '0.035rem',
        color: theme.palette.primary.contrastText,
        height: '3.5rem',
        width: '12rem',
        '& svg': {
            color: theme.palette.primary.contrastText
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.contrastText
        },
        '& .MuiSelect-select:focus': {
            backgroundColor: 'trasparent'
        }
    }
}));

function ToolBar({ props, app_details, onAction }) {
    const { left: leftElements, right: rightElements, center: centerElements } = props;
    const classes = useStyles();
    const [state, setState] = useState({});
    let alignment;
    if (!leftElements && !rightElements && centerElements) {
        alignment = { justifyContent: 'center' };
    } else if (!leftElements && !centerElements && rightElements) {
        alignment = { justifyContent: 'flex-end' };
    } else if (leftElements && centerElements && !rightElements) {
        alignment = { justifyContent: 'space-between', width: '50%' };
    } else if (rightElements && centerElements && !leftElements) {
        alignment = { justifyContent: 'space-between', width: '50%', marginLeft: 'auto' };
    } else if (leftElements && rightElements && !centerElements) {
        alignment = { justifyContent: 'space-between' };
    }

    const handleChange = (fieldId, value, optionName = null) => {
        setState({
            ...state,
            [fieldId]: value
        });
        if (onAction && props?.enableToggleAction) {
            onAction(fieldId, value, optionName);
        }
    };
    return (
        <Toolbar
            className={classes.toolBar}
            style={{
                ...alignment,
                minHeight: props?.minHeight ? props.minHeight : '7rem',
                width: props?.width ?? null
            }}
            data-testid="toolbar"
        >
            {leftElements ? (
                <div className={classes.toolBarIcons}>
                    {leftElements.map((el) => {
                        const { type, ...elementProps } = el;
                        return (
                            <MapComponentType
                                key={`toolBar_component_${elementProps.id}`}
                                type={type}
                                elementProps={elementProps}
                                onChange={handleChange}
                                classes={classes}
                                onAction={onAction}
                                app_details={app_details}
                            />
                        );
                    })}
                </div>
            ) : null}
            {centerElements ? (
                <div className={classes.toolBarIcons}>
                    {centerElements.map((el) => {
                        const { type, ...elementProps } = el;
                        return (
                            <MapComponentType
                                key={`toolBar_component_${elementProps.id}`}
                                type={type}
                                elementProps={elementProps}
                                onChange={handleChange}
                                classes={classes}
                                onAction={onAction}
                                app_details={app_details}
                            />
                        );
                    })}
                </div>
            ) : null}
            {rightElements ? (
                <div className={classes.toolBarIcons}>
                    {rightElements.map((el) => {
                        const { type, ...elementProps } = el;
                        return (
                            <MapComponentType
                                key={`toolBar_component_${elementProps.id}`}
                                type={type}
                                elementProps={elementProps}
                                onChange={handleChange}
                                classes={classes}
                                onAction={onAction}
                                app_details={app_details}
                            />
                        );
                    })}
                </div>
            ) : null}
        </Toolbar>
    );
}

const MapComponentType = ({ type, elementProps, onChange, classes, onAction, app_details }) => {
    switch (type) {
        case 'singleSelectDropdown':
            return (
                <SingleSelectDropdown
                    elementProps={elementProps}
                    classes={classes}
                    onChange={onChange}
                />
            );
        case 'multiSelectDropdown':
            return (
                <MultiSelectDropdown
                    elementProps={elementProps}
                    classes={classes}
                    onChange={onChange}
                />
            );
        case 'button':
            return (
                <FadedButton elementProps={elementProps} classes={classes} onChange={onChange} />
            );
        case 'iconButton':
            return <IconButton elementProps={elementProps} classes={classes} onChange={onChange} />;
        case 'toggleSwitch':
            return (
                <ToggleSwitch elementProps={elementProps} classes={classes} onChange={onChange} />
            );
        case 'toggleButton':
            return <ToggleButtonSwitch elementProps={elementProps} onChange={onChange} />;
        case 'legendsIcon':
            return <CodxLegendsIcons elementProps={elementProps} onChange={onChange} />;
        case 'modalForm':
            return (
                <DynamicFormModal
                    params={elementProps}
                    app_details={app_details}
                    onAction={onAction}
                />
            );
        case 'label':
            return <CustomLabel fieldInfo={elementProps} />;
        default:
            return <div className={classes.toolBarText}>Not found</div>;
    }
};

export default ToolBar;
