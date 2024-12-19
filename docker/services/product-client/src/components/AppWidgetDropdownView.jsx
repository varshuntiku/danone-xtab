import React, { useState, useCallback } from 'react';
import { Select, makeStyles, Paper, Typography, MenuItem, FormControl } from '@material-ui/core';
import AppWidgetGraph from './AppWidgetGraph';

const useStyles = makeStyles((theme) => ({
    widgetContent: {
        width: '100%',
        height: '100%',
        borderRadius: theme.spacing(1),
        position: 'relative',
        zIndex: 1
    },
    dropDown: {
        marginLeft: '2rem',
        color: theme.palette.text.titleText,
        fontSize: '1.6rem',
        border: `1px solid ${theme.palette.text.default}`,
        '& .MuiSelect-outlined.MuiSelect-outlined': {
            padding: '0.5rem',
            color: theme.palette.text.titleText + '!important'
        },
        '& .MuiSelect-iconOutlined': {
            color: theme.palette.text.titleText + '!important',
            height: '100%',
            position: 'relative',
            right: '3px'
        }
    },

    dropDownTitle: {
        display: 'inline-block',
        color: theme.palette.text.titleText,
        fontSize: '1.6rem',
        margin: 'auto',
        lineHeight: '3rem'
    }
}));

/**
 * Gives an ability to switch through multiple views for a data
 * @summary It fetches multiple views for a data and gives the user access to all the views. The user can go through all views one by one on-clicking the button and switching the view
 * Can be used where there are multiple views(graphs or tables) to be displayed on same screen for the given data
 * @param {object} props - params
 */

export default function AppWidgetDropdownView({
    widgetData,
    onStateUpdateRequest,
    updateDataStateKey,
    ...props
}) {
    const classes = useStyles();
    const [data, setData] = useState(widgetData?.data?.value?.views[0]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [switchCount, setSwitchCount] = useState(0);

    React.useEffect(() => {
        setData(widgetData?.data?.value?.views[activeIndex]);
    }, [activeIndex, widgetData]);

    React.useEffect(() => {
        setSwitchCount((s) => s + 1);
    }, [activeIndex]);

    const handleChange = useCallback((e) => {
        setActiveIndex(e.target.value);
    }, []);

    const handleStateUpdateRequest = useCallback((params) => {
        const { tabActiveIndex, ..._params } = params;
        if (tabActiveIndex >= 0) {
            setActiveIndex(tabActiveIndex);
        }
        if (onStateUpdateRequest) {
            onStateUpdateRequest(_params);
        }
    }, []);

    // widgetData?.data?.value?.switch_button

    return (
        <Paper className={classes.widgetContent}>
            <AppWidgetGraph
                {...props}
                updateDataStateKey={updateDataStateKey}
                data={data}
                onStateUpdateRequest={handleStateUpdateRequest}
                dataProvided={true}
                key={switchCount}
                actionItem={
                    <>
                        <div className={classes.dropDownTitle}>
                            <Typography
                                className={classes.dropDownTitle}
                                color="inherit"
                                variant="h5"
                            >
                                {widgetData.data.value.dropdown_label}
                            </Typography>
                        </div>
                        <FormControl variant="outlined">
                            <Select
                                onChange={handleChange}
                                className={classes.dropDown}
                                value={activeIndex}
                            >
                                {widgetData?.data?.value?.options?.map((el, i) => (
                                    <MenuItem key={'options' + i} value={i}>
                                        {el}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                }
            />
        </Paper>
    );
}
