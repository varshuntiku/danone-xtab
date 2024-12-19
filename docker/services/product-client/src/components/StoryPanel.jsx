import React, { useEffect, useState } from 'react';
import { makeStyles, Button, Checkbox, Typography, IconButton } from '@material-ui/core';
import { DoubleArrow as DoubleArrowIcon } from '@material-ui/icons';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CreateReportsDialog from 'components/CreateReportsDialog.jsx';
import * as _ from 'underscore';
import { connect } from 'react-redux';
import { selectOrUnselectAllItems } from 'store/index';
import Popup from './ActionPopUp';
import AddIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { ReactComponent as DataStoryIcon } from 'assets/img/DataStoryIcon.svg';
import { ReactComponent as CreateStoryIcon } from 'assets/img/CreateStoryIcon.svg';
import Collapse from './Nuclios/assets/Collapse';

const useStyles = makeStyles((theme) => {
    const isDarkTheme = localStorage.getItem('codx-products-theme') === 'dark';
    return {
        storyPanel: {
            width: '5.6rem',
            height: '5.6rem',
            position: 'absolute',
            bottom: '1rem',
            right: '2rem',
            borderRadius: '4px 0px 0px 0px',
            borderWidth: '1px 0px 0px 0px',
            borderStyle: 'solid',
            opacity: 1,
            boxShadow: '0px 6px 16px 0px rgba(0, 0, 0, 0.4)',
            backgroundColor: theme.palette.text.titleText,
            zIndex: 10000,
            cursor: 'pointer',
            transform: 'translateX(100%)',
            animation: `$slideInPanel 400ms ease-out forwards`,
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center'
        },
       
        dataStoryIcon: {
            '& path': {
                fill: theme.palette.border.dataStoryIcon,
                stroke: theme.palette.border.dataStoryIcon
            }
        },
        createStoryPanel: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0px 6px 16px 0px rgba(0, 0, 0, 0.4)',
            background: theme.palette.background.dataStoryBar,
            position: 'absolute',
            bottom: '1rem',
            right: '25%',
            zIndex: 10000,
            transform: 'translateX(100%)',
            animation: `$slideIn 400ms ease-out forwards`
        },
        '@keyframes slideIn': {
            '0%': {
                opacity: 0,
                transform: 'translateX(100%)'
            },
            '100%': {
                opacity: 1,
                transform: 'translateX(0)'
            }
        },
        '@keyframes slideInPanel': {
            '0%': {
                opacity: 0,
                transform: 'translateX(100%)'
            },
            '100%': {
                opacity: 1,
                transform: 'translateX(0)'
            }
        },
        kpiText: {
            color: theme.palette.text.dataStoryText,
            marginRight: theme.spacing(2),
            fontSize: '1.6rem',
            fontFamily: theme.body.B1.fontFamily
        },
        widgetsText: {
            color: theme.palette.text.dataStoryText,
            marginRight: theme.spacing(2),
            fontSize: '1.6rem',
            fontFamily: theme.body.B1.fontFamily
        },
        actionButton: {
            background: !isDarkTheme ? theme.palette.text.peachText : theme.palette.text.purpleText,
            color: !isDarkTheme ? theme.palette.text.purpleText : theme.palette.text.peachText,
            textTransform: 'none',
            padding: '0.8rem 1.6rem',
            borderRadius: '4px',
            fontSize: '1.6rem',
            fontFamily: theme.body.B1.fontFamily,
            marginRight: theme.spacing(2),
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        },
        actionButoonText: {
            fontFamily: 'Graphik Compact'
        },
        actionButtonDisabled: {
            background: !isDarkTheme ? theme.palette.text.peachText : theme.palette.text.purpleText,
            color: !isDarkTheme ? theme.palette.text.purpleText : theme.palette.text.peachText,
            textTransform: 'none',
            padding: '0.8rem 1.6rem',
            borderRadius: '4px',
            fontSize: '1.6rem',
            fontFamily: theme.body.B1.fontFamily,
            marginRight: theme.spacing(2),
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            pointerEvents: 'none',
            opacity: 0.7,
            cursor: 'none'
        },
        bottomIcon: {
            color: `${theme.palette.text.default} !important`,
            transform: 'rotate(90deg)',
            marginLeft: '1rem'
        },
        topIcon: {
            color: `${theme.palette.text.default} !important`,
            transform: 'rotate(-90deg)',
            marginLeft: '1rem'
        },
        iconButton: {
            '&:hover $doubleArrowIcon': {
                color: `${theme.palette.text.default} !important`
            }
        },
        doubleArrowIcon: {
            color: !isDarkTheme
                ? `${theme.palette.text.peachText} !important`
                : `${theme.palette.text.purpleText} !important`
        },
        addIcon: {
            color: !isDarkTheme
                ? `${theme.palette.text.white} !important`
                : `${theme.palette.text.purpleText} !important`,
            fill: !isDarkTheme
                ? `${theme.palette.text.white} !important`
                : `${theme.palette.text.purpleText} !important`,
            '& path': {
                fill: theme.palette.text.dataStoryText
            },
            height: '2rem',
            width: '2rem'
        },
        checkbox: {
            height: '1.6rem',
            width: '1.6rem',
            '& svg': {
                color: theme.palette.text.dataStoryText,
                height: '1.6rem',
                width: '1.6rem'
            },
            '&.Mui-checked': {
                color: !isDarkTheme
                    ? `${theme.palette.text.white} !important`
                    : `${theme.palette.text.btnTextColor} !important`
            }
        },
        selectAll: {
            color: theme.palette.text.dataStoryText,
            marginRight: theme.spacing(2),
            fontSize: '1.6rem',
            fontFamily: theme.body.B1.fontFamily
        },
        divider: {
            borderLeft: `1px solid ${theme.palette.text.dataStoryText}`,
            height: '2.4rem',
            margin: '0 1rem'
        },
        actionOptionHolder: {
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            gap: '1rem'
        },
        StoryPanelOnActions:{
            width:'3.5rem',
           height:'6rem',
            position: 'absolute',
            bottom: '1rem',
            right: '2rem',
            borderRadius: '4px 0px 0px 4px',
            borderWidth: '1px 0px 0px 0px',
            borderStyle: 'solid',
            opacity: 1,
            boxShadow: '0px 6px 16px 0px rgba(0, 0, 0, 0.4)',
            backgroundColor: theme.palette.text.titleText,
            zIndex: 10000,
            cursor: 'pointer',
            transform: 'translateX(100%)',
            animation: `$slideInPanel 400ms ease-out forwards`,
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center'

        },
        storyPanelOnComment: {
            right:'25.55%'
        },
        storyPanelOnAskNuclios: {
            right:'25.55%'
        },
        collapseIcon: {
            fill: theme.palette.border.dataStoryIcon
        }
    };
});

const StoryPanel = (props) => {
    const classes = useStyles();
    const [isSelected, setIsSelected] = useState(false);
    const [createStoriesDialog, setCreateStoriesDialog] = useState(false);
    const [checked, setChecked] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [storyPanel, setStoryPanel] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [storyPayload, setStoryPayload] = useState([]);
    const [kpiCount, setKpiCount] = useState(0);
    const [graphCount, setGraphCount] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    useEffect(() => {
        var screens = _.map(props.app_info.screens, (item) => {
            return _.extend({ selected: false }, _.pick(item, 'id', 'screen_name'));
        });
        props.setScreens(screens);
    }, [props.app_info.screens]);

    useEffect(() => {
        if (props.screenId) {
            var appScreenDetails = _.where(props.screens, { id: props.screenId });
            const selected = appScreenDetails[0]?.selected;
            if (selected !== checked) {
                setChecked(selected);
            }
        }
    }, [props.screenId, props.screens, checked]);

    const handleClick = () => {
        setIsSelected(!isSelected);
    };

    const openAddStoriesDialog = () => {
        setAddDialog(true);
        setCreateStoriesDialog(true);
    };

    const openCreateStoriesDialog = () => {
        setAddDialog(false);
        setCreateStoriesDialog(true);
    };

    const closeCreateStoriesDialog = () => {
        setCreateStoriesDialog(false);
    };

    const onResponseAddORCreateStory = () => {
        props.setScreens(props.app_info.screens);
        if (props.onResponseAddORCreateStory) {
            props.onResponseAddORCreateStory();
        }
    };

    const selectAllCharts = (checked) => {
        const tempScreens = structuredClone(props.screens);

        var screens = _.map(tempScreens, function (screen) {
            if (screen.id === props.screenId) {
                screen.selected = checked;
            }
            return screen;
        });

        props.setScreens(screens);
    };

    const togglePopup = () => {
        setShowPopup((prev) => !prev);
    };

    const getPayload = () => {
        var payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));
        var payloadObject = null;
        if (payloadMap && payloadMap.size) {
            payloadObject = payloadMap.get(props.app_info.id);
        }
        return payloadObject;
    };

    const renderStoriesActionPanel = () => {
        var payload = getPayload();
        if (payload && payload.length) {
            return true;
        }
        return false;
    };

    const getSelectedItemsCount = () => {
        try {
            let payload = getPayload();
            let kpi_value = 0; // To count when extra_dir and extra_value exist
            let graphs = 0; // To count other cases

            payload.reduce((acc, val) => {
                if (val.graph_data && Object.keys(val.graph_data).length >= 1) {
                    // Check if extra_dir and extra_value exist in graph_data
                    if (val.graph_data.extra_dir && val.graph_data.extra_value) {
                        kpi_value += 1; // Increment kpi_value if the keys are present
                    } else {
                        let validGraph = !(
                            val.graph_data.multiple_tables ||
                            (val.graph_data.table_data && val.graph_data.table_headers) ||
                            val.graph_data.toggleLeft?.multiple_tables ||
                            (val.graph_data.toggleLeft?.table_data &&
                                val.graph_data.toggleLeft?.table_headers) ||
                            val.graph_data.isExpandable ||
                            val.graph_data.toggleLeft?.isExpandable ||
                            val.graph_data.is_grid_table ||
                            val.graph_data.toggleLeft?.is_grid_table
                        );

                        if (validGraph) {
                            graphs += val.graph_data?.componentType?.startsWith('custom:') ? 0 : 1;
                        }
                    }
                }
                return acc;
            }, 0);
            setGraphCount(graphs);
            setKpiCount(kpi_value);
            return { kpi_value: kpi_value, graphs: graphs };
        } catch (err) {
            console.error(err);
        }

        return { kpi_value: 0, graphs: 0 };
    };

    // Custom hook to track localStorage updates
    const trackLocalStorageUpdate = (key, callback) => {
        useEffect(() => {
            const originalSetItem = localStorage.setItem;

            localStorage.setItem = function (keyName, value) {
                if (keyName === key) {
                    callback(value);
                }
                originalSetItem.apply(this, arguments);
            };

            return () => {
                localStorage.setItem = originalSetItem;
            };
        }, [key, callback]);
    };

    const handleCreateStoriesPayloadUpdate = (newPayload) => {
        setStoryPayload(JSON.parse(newPayload));
    };

    trackLocalStorageUpdate('create-stories-payload', handleCreateStoriesPayloadUpdate);
    useEffect(() => {
        getSelectedItemsCount();
    }, [storyPayload]);

    return !storyPanel ? (
        <div
        className={`${
          (props.commentsOpen || props.askNucliosOpen||props.widgetComment) && !isHovered
            ? classes.StoryPanelOnActions 
            : classes.storyPanel    
        } ${props.commentsOpen||props.widgetComment ? classes.storyPanelOnComment : ''} ${
          props.askNucliosOpen ? classes.storyPanelOnAskNuclios : ''
        }`}
        onMouseEnter={() => {
          if (props.commentsOpen || props.askNucliosOpen||props.widgetComment) setIsHovered(true);
        }}
        onMouseLeave={() => {
          if (props.commentsOpen || props.askNucliosOpen||props.widgetComment) setIsHovered(false);
        }}
        onClick={() => {
            setStoryPanel(true); 
            setIsHovered(false);
          }}
      >
        {props.commentsOpen || props.askNucliosOpen ||props.widgetComment ? (
          !isHovered ? (
            <Collapse className={classes.collapseIcon} alt="Collapse Icon" />
          ) : (
            <DataStoryIcon className={classes.dataStoryIcon} alt="Data Story Icon" />
          )
        ) : (
          <DataStoryIcon className={classes.dataStoryIcon} alt="Data Story Icon" />
        )}
      </div>
      
        
    ) : (
        <React.Fragment>
            <div className={classes.createStoryPanel} onClick={handleClick}>
                <Typography className={classes.kpiText}>{kpiCount} KPI Selected</Typography>
                <div className={classes.divider} />
                <Typography variant="body1" className={classes.widgetsText}>
                    {graphCount} {graphCount > 1 ? 'Widgets' : 'Widget'} Selected
                </Typography>
                <div className={classes.divider} />
                <Checkbox
                    className={classes.checkbox}
                    checked={checked}
                    onChange={(event) => {
                        selectAllCharts(event.target.checked);
                    }}
                />
                <Typography variant="body1" className={classes.selectAll}>
                    Select all
                </Typography>
                <Button
                    className={
                        renderStoriesActionPanel()
                            ? classes.actionButton
                            : `${classes.actionButtonDisabled}`
                    }
                    onClick={togglePopup}
                >
                    <span className={classes.actionButoonText}>Action</span>{' '}
                    <ArrowForwardIosIcon
                        className={showPopup ? classes.topIcon : classes.bottomIcon}
                    />
                </Button>
                {showPopup && (
                    <Popup>
                        <Typography
                            className={classes.actionOptionHolder}
                            onClick={openAddStoriesDialog}
                        >
                            <AddIcon className={classes.addIcon} />
                            <span className={classes.kpiText}>Add To Existing Story</span>
                        </Typography>
                        <Typography
                            className={classes.actionOptionHolder}
                            onClick={openCreateStoriesDialog}
                        >
                            <CreateStoryIcon className={classes.addIcon} />
                            <span className={classes.kpiText}>Create New Story</span>
                        </Typography>
                    </Popup>
                )}
                <IconButton className={classes.iconButton} onClick={() => setStoryPanel(false)}>
                    <DoubleArrowIcon className={classes.doubleArrowIcon} />
                </IconButton>
            </div>
            {createStoriesDialog ? (
                <CreateReportsDialog
                    onClose={closeCreateStoriesDialog}
                    app_info={props.app_info}
                    onResponseAddORCreateStory={onResponseAddORCreateStory}
                    logged_in_user_info={props.logged_in_user_info}
                    createStoryPanel={addDialog}
                ></CreateReportsDialog>
            ) : null}
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        screens: state.createStories.selectedScreens,
        screenId: state.createStories.screenId
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setScreens: (payload) => dispatch(selectOrUnselectAllItems(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(StoryPanel);
