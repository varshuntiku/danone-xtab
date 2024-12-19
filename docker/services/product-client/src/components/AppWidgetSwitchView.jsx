import React, { useState, useCallback } from 'react';
import { Button, ButtonGroup, makeStyles, Paper } from '@material-ui/core';
import AppWidgetGraph from './AppWidgetGraph';
import BarChartIcon from '@material-ui/icons/BarChart';
import ListIcon from '@material-ui/icons/List';

const useStyles = makeStyles((theme) => ({
    widgetContent: {
        width: '100%',
        height: '100%',
        borderRadius: theme.spacing(1),
        position: 'relative',
        zIndex: 1
    },
    ButtonGroup: {
        '& .MuiButton-contained': {
            border: 'transparent',
            backgroundColor: theme.palette.icons.closeIcon,
            color: theme.palette.text.btnTextColor
        },
        '& .MuiButton-outlined': {
            border: `1px solid ${theme.palette.icons.closeIcon}`,
            color: theme.palette.icons.closeIcon
        }
    }
}));
/**
 * Gives an ability to switch through multiple views for a data
 * @summary It fetches multiple views for a data and gives the user access to all the views. The user can go through all views one by one on-clicking the button and switching the view
 * Can be used where there are multiple views(graphs or tables) to be displayed on same screen for the given data
 * @param {object} props - params
 */
export default function AppWidgetSwitchView({
    widgetData,
    onStateUpdateRequest,
    updateDataStateKey,
    ...props
}) {
    const classes = useStyles();
    const [data, setData] = useState(widgetData?.data?.value?.views[0]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [switchCount, setSwitchCount] = useState(0);

    const getIcon = (name) => {
        switch (name) {
            case 'barChartIcon':
                return <BarChartIcon color="inherit" />;
            case 'listIcon':
                return <ListIcon color="inherit" />;
            default:
                return name;
        }
    };

    React.useEffect(() => {
        setData(widgetData?.data?.value?.views[activeIndex]);
    }, [activeIndex, widgetData]);

    React.useEffect(() => {
        setSwitchCount((s) => s + 1);
    }, [activeIndex]);

    const handleChange = useCallback((i) => {
        setActiveIndex(i);
    }, []);

    const handleStateUpdateRequest = useCallback(
        (params) => {
            const { tabActiveIndex, ..._params } = params;
            if (tabActiveIndex >= 0) {
                setActiveIndex(tabActiveIndex);
            }
            if (onStateUpdateRequest) {
                onStateUpdateRequest(_params);
            }
            props.refreshWidget();
        },
        [onStateUpdateRequest]
    );

    return (
        <Paper className={classes.widgetContent}>
            <AppWidgetGraph
                {...props}
                updateDataStateKey={updateDataStateKey}
                data={{ ...data, switch_view: true, switch_view_index: activeIndex }}
                onStateUpdateRequest={handleStateUpdateRequest}
                dataProvided={true}
                key={switchCount}
                actionItem={
                    <ButtonGroup className={classes.ButtonGroup} size={'small'}>
                        {widgetData?.data?.value?.buttons?.map((el, i) => (
                            <Button
                                key={'widgetDataButtons' + i}
                                onClick={handleChange.bind(null, i)}
                                variant={i === activeIndex ? 'contained' : 'outlined'}
                                title={el?.title || ''}
                                aria-label="Widget Data"
                            >
                                {getIcon(el?.name || el)}
                            </Button>
                        ))}
                    </ButtonGroup>
                }
            />
        </Paper>
    );
}
